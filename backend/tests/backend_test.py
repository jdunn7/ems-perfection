"""
BrowsEMS Backend API tests.
Covers: health, newsletter (idempotent), contact, booking, ObjectId leak protection.
"""
import os
import uuid
import time
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load frontend .env to get the public REACT_APP_BACKEND_URL (the one the user hits)
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_health_ok(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "ts" in data

    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe_success(self, client):
        email = f"TEST_news_{uuid.uuid4().hex[:8]}@example.com"
        r = client.post(f"{API}/newsletter", json={"email": email, "locale": "en"}, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == email
        assert data["locale"] == "en"
        assert "id" in data and isinstance(data["id"], str)
        # uuid format
        uuid.UUID(data["id"])
        assert "created_at" in data and isinstance(data["created_at"], str)
        assert "_id" not in data  # no Mongo ObjectId leak

    def test_subscribe_idempotent_duplicate(self, client):
        email = f"TEST_dup_{uuid.uuid4().hex[:8]}@example.com"
        r1 = client.post(f"{API}/newsletter", json={"email": email, "locale": "en"}, timeout=15)
        assert r1.status_code == 200
        first_id = r1.json()["id"]
        r2 = client.post(f"{API}/newsletter", json={"email": email, "locale": "es"}, timeout=15)
        assert r2.status_code == 200
        # Should return SAME record (idempotent)
        assert r2.json()["id"] == first_id, "Duplicate email should not create a new record"

    def test_subscribe_invalid_email(self, client):
        r = client.post(f"{API}/newsletter", json={"email": "not-an-email", "locale": "en"}, timeout=15)
        assert r.status_code == 422

    def test_list_newsletter_no_objectid(self, client):
        # ensure at least one subscriber exists
        email = f"TEST_listns_{uuid.uuid4().hex[:8]}@example.com"
        client.post(f"{API}/newsletter", json={"email": email, "locale": "en"}, timeout=15)
        r = client.get(f"{API}/newsletter", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        for item in items:
            assert "_id" not in item
            assert "id" in item
            assert "created_at" in item


# ---------- Contact ----------
class TestContact:
    def test_submit_success(self, client):
        payload = {
            "name": "TEST User",
            "email": f"TEST_contact_{uuid.uuid4().hex[:8]}@example.com",
            "subject": "Hi",
            "message": "Hello there!",
            "locale": "en",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        uuid.UUID(data["id"])
        assert "_id" not in data

    def test_submit_missing_fields(self, client):
        # missing message
        r = client.post(f"{API}/contact", json={"name": "x", "email": "a@b.com"}, timeout=15)
        assert r.status_code == 422
        # missing email
        r = client.post(f"{API}/contact", json={"name": "x", "message": "hi"}, timeout=15)
        assert r.status_code == 422
        # missing name
        r = client.post(f"{API}/contact", json={"email": "a@b.com", "message": "hi"}, timeout=15)
        assert r.status_code == 422

    def test_submit_invalid_email(self, client):
        r = client.post(f"{API}/contact", json={"name": "x", "email": "bad", "message": "hi"}, timeout=15)
        assert r.status_code == 422

    def test_list_contact_no_objectid(self, client):
        r = client.get(f"{API}/contact", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for item in items:
            assert "_id" not in item
            assert "id" in item


# ---------- Booking ----------
class TestBooking:
    def test_submit_success(self, client):
        payload = {
            "name": "TEST Booking",
            "email": f"TEST_book_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+971501234567",
            "service": "Microblading",
            "preferred_date": "2026-02-15",
            "preferred_time": "14:30",
            "notes": "First time",
            "locale": "en",
        }
        r = client.post(f"{API}/booking", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["service"] == payload["service"]
        assert data["preferred_date"] == payload["preferred_date"]
        uuid.UUID(data["id"])
        assert "_id" not in data

    def test_submit_missing_required(self, client):
        # missing service
        r = client.post(f"{API}/booking", json={
            "name": "x", "email": "a@b.com", "preferred_date": "2026-02-15"
        }, timeout=15)
        assert r.status_code == 422
        # missing preferred_date
        r = client.post(f"{API}/booking", json={
            "name": "x", "email": "a@b.com", "service": "Brows"
        }, timeout=15)
        assert r.status_code == 422
        # missing name
        r = client.post(f"{API}/booking", json={
            "email": "a@b.com", "service": "Brows", "preferred_date": "2026-02-15"
        }, timeout=15)
        assert r.status_code == 422
        # missing email
        r = client.post(f"{API}/booking", json={
            "name": "x", "service": "Brows", "preferred_date": "2026-02-15"
        }, timeout=15)
        assert r.status_code == 422

    def test_list_booking_no_objectid(self, client):
        r = client.get(f"{API}/booking", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for item in items:
            assert "_id" not in item
            assert "id" in item
            assert "created_at" in item
