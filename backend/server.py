from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
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


class BookingRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: str
    preferred_date: str  # YYYY-MM-DD
    preferred_time: Optional[str] = None  # HH:MM
    notes: Optional[str] = None
    locale: Optional[str] = "en"
    created_at: str = Field(default_factory=utc_now_iso)


class BookingCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    service: str = Field(min_length=1, max_length=120)
    preferred_date: str = Field(min_length=8, max_length=20)
    preferred_time: Optional[str] = Field(default=None, max_length=10)
    notes: Optional[str] = Field(default=None, max_length=1000)
    locale: Optional[str] = "en"


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "BrowsEMS API"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "browsems-api", "ts": utc_now_iso()}


# Newsletter
@api_router.post("/newsletter", response_model=NewsletterSubscriber)
async def subscribe_newsletter(payload: NewsletterCreate):
    existing = await db.newsletter_subscribers.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        return NewsletterSubscriber(**existing)
    sub = NewsletterSubscriber(**payload.model_dump())
    await db.newsletter_subscribers.insert_one(sub.model_dump())
    return sub


@api_router.get("/newsletter", response_model=List[NewsletterSubscriber])
async def list_newsletter():
    items = await db.newsletter_subscribers.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [NewsletterSubscriber(**i) for i in items]


# Contact
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact():
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [ContactMessage(**i) for i in items]


# Booking
@api_router.post("/booking", response_model=BookingRequest)
async def submit_booking(payload: BookingCreate):
    booking = BookingRequest(**payload.model_dump())
    await db.booking_requests.insert_one(booking.model_dump())
    return booking


@api_router.get("/booking", response_model=List[BookingRequest])
async def list_bookings():
    items = await db.booking_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [BookingRequest(**i) for i in items]


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
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
