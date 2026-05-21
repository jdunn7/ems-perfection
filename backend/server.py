"""BrowsEMS — South Florida microblading & microshading studio.

Backend exposes:
- /api/health
- /api/newsletter (POST/GET) — newsletter subscribers
- /api/contact (POST/GET) — contact form
- /api/services (GET) — public service catalog (server-defined prices/deposits)
- /api/booking/checkout (POST) — create pending booking + Stripe Checkout Session for deposit
- /api/booking/checkout/status/{session_id} (GET) — poll payment status
- /api/webhook/stripe (POST) — Stripe webhook
- /api/booking (GET) — list bookings (admin)
- /api/hero-video — streams the hero video bytes (proxies the remote MP4 with Range support)
"""
from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')
HERO_VIDEO_REMOTE_URL = os.environ.get(
    'HERO_VIDEO_REMOTE_URL',
    'https://vids.videohosting.space/Kling%203_0%20Pro%20-%20Two%20glamorous%20cartoon%20princesses%20_one%20Black%20girl_%20one%20White%20girl_%20with%20flawless%20micr.mp4',
)

app = FastAPI()
api_router = APIRouter(prefix="/api")


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ----------------------------------------------------------------------------
# Service catalog (server-side authoritative — never trust client amounts)
# ----------------------------------------------------------------------------
SERVICES: Dict[str, Dict] = {
    "microblading": {
        "key": "microblading",
        "name": {"en": "Microblading", "es": "Microblading"},
        "blurb": {
            "en": "Crisp, hair-stroke brows hand-drawn with a feather-light blade.",
            "es": "Cejas pelo a pelo dibujadas a mano con técnica feather-light.",
        },
        "price": 600.00,
        "deposit": 100.00,
        "duration_min": 150,
    },
    "microshading": {
        "key": "microshading",
        "name": {"en": "Microshading (Ombré Brows)", "es": "Microshading (Cejas Ombré)"},
        "blurb": {
            "en": "Soft, powdered ombré brows for a fuller, makeup-finished look.",
            "es": "Cejas ombré suaves con efecto polvo, acabado tipo maquillaje.",
        },
        "price": 650.00,
        "deposit": 100.00,
        "duration_min": 150,
    },
    "combo_brows": {
        "key": "combo_brows",
        "name": {"en": "Combo Brows", "es": "Combo Brows"},
        "blurb": {
            "en": "Hair-stroke front + powdered tail — the best of both worlds.",
            "es": "Pelo a pelo al inicio + sombreado al final — lo mejor de ambos mundos.",
        },
        "price": 750.00,
        "deposit": 150.00,
        "duration_min": 180,
    },
    "lip_blush": {
        "key": "lip_blush",
        "name": {"en": "Lip Blush", "es": "Lip Blush"},
        "blurb": {
            "en": "Soft semi-permanent lip tint that enhances natural color & shape.",
            "es": "Tinte labial semipermanente que realza el color y forma natural.",
        },
        "price": 700.00,
        "deposit": 100.00,
        "duration_min": 150,
    },
    "touch_up_6w": {
        "key": "touch_up_6w",
        "name": {"en": "6-Week Touch-Up", "es": "Retoque 6 semanas"},
        "blurb": {
            "en": "Required follow-up to perfect color & symmetry. Within 8 weeks of initial.",
            "es": "Retoque requerido para perfeccionar color y simetría. Dentro de 8 semanas.",
        },
        "price": 200.00,
        "deposit": 50.00,
        "duration_min": 90,
    },
    "consult": {
        "key": "consult",
        "name": {"en": "Consultation", "es": "Consulta"},
        "blurb": {
            "en": "30-min in-studio consultation. Deposit credits toward your booking.",
            "es": "Consulta presencial de 30 min. El depósito se acredita a tu reserva.",
        },
        "price": 50.00,
        "deposit": 50.00,
        "duration_min": 30,
    },
}


# ----------------------------------------------------------------------------
# Models
# ----------------------------------------------------------------------------
class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    locale: Optional[str] = "en"
    created_at: str = Field(default_factory=utc_now_iso)


class NewsletterCreate(BaseModel):
    email: EmailStr
    locale: Optional[str] = "en"


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str
    locale: Optional[str] = "en"
    created_at: str = Field(default_factory=utc_now_iso)


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=3000)
    locale: Optional[str] = "en"


class BookingCheckoutCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    service_key: str  # must be in SERVICES
    artist_key: Optional[str] = None
    preferred_date: str = Field(min_length=8, max_length=20)
    preferred_time: Optional[str] = Field(default=None, max_length=10)
    notes: Optional[str] = Field(default=None, max_length=1000)
    locale: Optional[str] = "en"
    origin_url: str  # frontend window.location.origin


class BookingPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service_key: str
    service_name: str
    artist_key: Optional[str] = None
    preferred_date: str
    preferred_time: Optional[str] = None
    notes: Optional[str] = None
    locale: Optional[str] = "en"
    deposit_amount: float
    deposit_currency: str
    payment_status: str  # initiated | pending | paid | failed | expired
    stripe_session_id: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None


class CheckoutSessionPublic(BaseModel):
    url: str
    session_id: str
    booking_id: str


class CheckoutStatusPublic(BaseModel):
    session_id: str
    status: str
    payment_status: str
    amount_total: int
    currency: str
    booking_id: Optional[str] = None


# ----------------------------------------------------------------------------
# Routes — health / services
# ----------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "BrowsEMS API"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "browsems-api", "ts": utc_now_iso()}


@api_router.get("/services")
async def list_services():
    """Public service catalog. Prices/deposits are server-authoritative."""
    return [
        {
            "key": s["key"],
            "name": s["name"],
            "blurb": s["blurb"],
            "price": s["price"],
            "deposit": s["deposit"],
            "duration_min": s["duration_min"],
            "currency": "usd",
        }
        for s in SERVICES.values()
    ]


# ----------------------------------------------------------------------------
# Newsletter
# ----------------------------------------------------------------------------
@api_router.post("/newsletter", response_model=NewsletterSubscriber)
async def subscribe_newsletter(payload: NewsletterCreate):
    email_norm = payload.email.lower()
    existing = await db.newsletter_subscribers.find_one({"email": email_norm}, {"_id": 0})
    if existing:
        return NewsletterSubscriber(**existing)
    sub = NewsletterSubscriber(email=email_norm, locale=payload.locale or "en")
    await db.newsletter_subscribers.insert_one(sub.model_dump())
    return sub


@api_router.get("/newsletter", response_model=List[NewsletterSubscriber])
async def list_newsletter():
    items = await db.newsletter_subscribers.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [NewsletterSubscriber(**i) for i in items]


# ----------------------------------------------------------------------------
# Contact
# ----------------------------------------------------------------------------
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact():
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [ContactMessage(**i) for i in items]


# ----------------------------------------------------------------------------
# Booking — Stripe checkout
# ----------------------------------------------------------------------------
def _get_stripe(http_request: Request) -> StripeCheckout:
    host_url = str(http_request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    return StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)


@api_router.post("/booking/checkout", response_model=CheckoutSessionPublic)
async def create_booking_checkout(payload: BookingCheckoutCreate, http_request: Request):
    service = SERVICES.get(payload.service_key)
    if service is None:
        raise HTTPException(status_code=400, detail="Invalid service_key")

    deposit_amount = float(service["deposit"])
    currency = "usd"

    booking_id = str(uuid.uuid4())
    now = utc_now_iso()

    booking_doc = {
        "id": booking_id,
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "service_key": payload.service_key,
        "service_name": service["name"]["en"],
        "artist_key": payload.artist_key,
        "preferred_date": payload.preferred_date,
        "preferred_time": payload.preferred_time,
        "notes": payload.notes,
        "locale": payload.locale or "en",
        "deposit_amount": deposit_amount,
        "deposit_currency": currency,
        "payment_status": "initiated",
        "stripe_session_id": None,
        "created_at": now,
        "updated_at": now,
    }
    await db.booking_requests.insert_one(booking_doc)

    # Build Stripe session
    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/booking-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/booking-cancel?session_id={{CHECKOUT_SESSION_ID}}"

    metadata = {
        "booking_id": booking_id,
        "service_key": payload.service_key,
        "email": payload.email,
        "locale": payload.locale or "en",
    }

    stripe = _get_stripe(http_request)
    try:
        req = CheckoutSessionRequest(
            amount=deposit_amount,
            currency=currency,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
        )
        session: CheckoutSessionResponse = await stripe.create_checkout_session(req)
    except Exception as e:
        logging.exception("Stripe checkout creation failed")
        await db.booking_requests.update_one(
            {"id": booking_id},
            {"$set": {"payment_status": "failed", "updated_at": utc_now_iso()}},
        )
        raise HTTPException(status_code=502, detail=f"Stripe error: {e}")

    # Record payment_transactions
    txn_doc = {
        "id": str(uuid.uuid4()),
        "booking_id": booking_id,
        "session_id": session.session_id,
        "amount": deposit_amount,
        "currency": currency,
        "metadata": metadata,
        "payment_status": "initiated",
        "email": payload.email,
        "created_at": now,
        "updated_at": now,
    }
    await db.payment_transactions.insert_one(txn_doc)
    await db.booking_requests.update_one(
        {"id": booking_id},
        {"$set": {"stripe_session_id": session.session_id, "payment_status": "pending", "updated_at": utc_now_iso()}},
    )

    return CheckoutSessionPublic(url=session.url, session_id=session.session_id, booking_id=booking_id)


@api_router.get("/booking/checkout/status/{session_id}", response_model=CheckoutStatusPublic)
async def get_booking_checkout_status(session_id: str, http_request: Request):
    txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not txn:
        raise HTTPException(status_code=404, detail="Session not found")

    stripe = _get_stripe(http_request)
    try:
        status: CheckoutStatusResponse = await stripe.get_checkout_status(session_id)
    except Exception as e:
        logging.exception("Stripe status check failed")
        raise HTTPException(status_code=502, detail=f"Stripe error: {e}")

    # idempotent update — only mark paid once
    new_payment_status = status.payment_status
    booking_id = txn.get("booking_id")

    if txn.get("payment_status") != "paid" and new_payment_status == "paid":
        now = utc_now_iso()
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid", "updated_at": now}},
        )
        if booking_id:
            await db.booking_requests.update_one(
                {"id": booking_id, "payment_status": {"$ne": "paid"}},
                {"$set": {"payment_status": "paid", "updated_at": now}},
            )
    elif status.status == "expired":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "expired", "updated_at": utc_now_iso()}},
        )
        if booking_id:
            await db.booking_requests.update_one(
                {"id": booking_id, "payment_status": {"$nin": ["paid", "expired"]}},
                {"$set": {"payment_status": "expired", "updated_at": utc_now_iso()}},
            )

    return CheckoutStatusPublic(
        session_id=session_id,
        status=status.status,
        payment_status=status.payment_status,
        amount_total=status.amount_total,
        currency=status.currency,
        booking_id=booking_id,
    )


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request, stripe_signature: Optional[str] = Header(default=None, alias="Stripe-Signature")):
    body = await request.body()
    stripe = _get_stripe(request)
    try:
        event = await stripe.handle_webhook(body, stripe_signature)
    except Exception as e:
        logging.exception("Webhook verification failed")
        raise HTTPException(status_code=400, detail=f"Webhook error: {e}")

    session_id = getattr(event, "session_id", None)
    payment_status = getattr(event, "payment_status", None)
    metadata = getattr(event, "metadata", {}) or {}

    if session_id and payment_status:
        now = utc_now_iso()
        # idempotent: only set to paid if not already paid
        txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        if txn and txn.get("payment_status") != payment_status:
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": payment_status, "updated_at": now}},
            )
            booking_id = txn.get("booking_id") or metadata.get("booking_id")
            if booking_id and payment_status == "paid":
                await db.booking_requests.update_one(
                    {"id": booking_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {"payment_status": "paid", "updated_at": now}},
                )

    return {"received": True}


@api_router.get("/booking", response_model=List[BookingPublic])
async def list_bookings():
    items = await db.booking_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    out = []
    for i in items:
        # Tolerate missing fields from legacy bookings (pre-pivot)
        i.setdefault("service_key", "consult")
        i.setdefault("service_name", "Consultation")
        i.setdefault("deposit_amount", 0.0)
        i.setdefault("deposit_currency", "usd")
        i.setdefault("payment_status", "unknown")
        out.append(BookingPublic(**i))
    return out


# ----------------------------------------------------------------------------
# Hero video proxy — streams the configured remote MP4 with Range support,
# avoiding upstream CORS / hot-link blocks.
# ----------------------------------------------------------------------------
@api_router.get("/hero-video")
async def hero_video_proxy(request: Request):
    range_header = request.headers.get("range")

    async def upstream_stream():
        headers = {}
        if range_header:
            headers["Range"] = range_header
        # Some upstream CDNs require a browser-like UA
        headers["User-Agent"] = (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        async with httpx.AsyncClient(timeout=None, follow_redirects=True) as cx:
            async with cx.stream("GET", HERO_VIDEO_REMOTE_URL, headers=headers) as resp:
                async for chunk in resp.aiter_bytes(chunk_size=64 * 1024):
                    yield chunk

    # Probe upstream headers to mirror status + content-length / range
    async with httpx.AsyncClient(timeout=20, follow_redirects=True) as cx:
        probe_headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
        if range_header:
            probe_headers["Range"] = range_header
        head = await cx.head(HERO_VIDEO_REMOTE_URL, headers=probe_headers)

    upstream_status = head.status_code if head.status_code in (200, 206) else 200
    headers = {
        "Content-Type": head.headers.get("content-type", "video/mp4"),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
    }
    for k in ("content-length", "content-range", "etag", "last-modified"):
        if k in head.headers:
            headers[k.title()] = head.headers[k]

    return StreamingResponse(upstream_stream(), status_code=upstream_status, headers=headers)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
