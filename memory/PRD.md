# BrowsEMS Landing Page — PRD

## Original Problem Statement
Build a video-led landing page that visually mirrors siellabeauty.com (soft pink/cream feminine e-commerce makeup aesthetic) with one deliberate change: the hero/header is rebuilt around an attached cartoon-princesses video as the dominant, scroll-controlled full-viewport experience. Replace original brand identity with neutral placeholders. Bilingual (EN + ES). Backend captures newsletter signups, contact messages, and booking requests.

## User Choices (verbatim, captured on 2026-05-20)
- Hero video: cartoon princesses MP4 from videohosting.space (39.7MB)
- Brand placeholder: **BrowsEMS** (with provided logo)
- Language: English + Spanish toggle
- Backend: newsletter + contact + booking (all stored)
- Video fallback: defaults (smooth scroll-linked with mobile/reduced-motion fallback)

## User Personas
- Beauty shopper browsing for premium-feel everyday glam (primary purchase driver)
- Glam appointment booker (in-store / concierge artist sessions)
- Newsletter/loyalty subscriber wanting first access to drops
- Spanish-speaking customer (language toggle)

## Architecture
- **Frontend**: React 19 + CRA + craco, Tailwind, Shadcn/UI, sonner toasts, lucide-react icons, Dancing Script + DM Sans fonts, @ alias to /app/frontend/src.
- **Backend**: FastAPI + Motor (async MongoDB), Pydantic v2, all routes under `/api`.
- **DB**: MongoDB collections: `newsletter_subscribers`, `contact_messages`, `booking_requests`. UUID `id` field; `created_at` ISO string; `_id` excluded from all responses.

## Core Requirements (static)
1. Visual spirit must match siellabeauty.com (palette, typography, em-dash button, cursive accents)
2. Hero must be full-viewport scroll-controlled video with synced text states (no normal autoplay as primary)
3. EN + ES bilingual with persistent locale (localStorage)
4. Reduced-motion + mobile-safe fallbacks
5. Newsletter / Contact / Booking forms POST to backend, success toasts
6. data-testid on every interactive element

## What's been implemented (2026-05-20)
- ✅ Scroll-scrubbed hero with 3 cross-fading text states + progress indicator (desktop) + autoplay-loop fallback (mobile/iOS/reduced-motion)
- ✅ Sticky nav with logo + links + EN/ES toggle + cart badge + mobile hamburger
- ✅ Promo banner (shimmering pink gradient)
- ✅ Best Sellers grid (4 placeholder products with "Add to Bag ─ AED XX" signature button)
- ✅ Tagline ribbon ("Feel-good products… ✨")
- ✅ Shop by Category (4 tiles: Face/Lips/Eyes/Brows)
- ✅ 2 alternating featured banners with cursive overlays + inline product card
- ✅ Stories grid (3 cards)
- ✅ Instagram-style feed strip (6 squares)
- ✅ Newsletter / Contact / Booking forms (all wired to backend)
- ✅ Multi-column footer with social, payment-style badges
- ✅ Backend: 7 endpoints (`/api/health`, GET/POST newsletter, GET/POST contact, GET/POST booking)
- ✅ MongoDB models with `_id` exclusion + ISO datetime + UUID ids
- ✅ Newsletter idempotency (no duplicate emails)
- ✅ EN + ES locale strings for every visible string
- ✅ 100% test pass: backend 13/13 pytest cases, frontend full Playwright flows

## Files
- /app/backend/server.py
- /app/frontend/src/App.js, App.css, index.css
- /app/frontend/tailwind.config.js
- /app/frontend/src/pages/Home.jsx
- /app/frontend/src/components/{PromoBanner,Nav,ScrollVideoHero,BestSellers,TaglineRibbon,ShopByCategory,FeaturedBanners,Stories,InstagramFeed,Forms,Footer}.jsx
- /app/frontend/src/i18n/{LanguageContext.jsx,translations.js}
- /app/frontend/src/data/content.js
- /app/design_guidelines.json

## Prioritized Backlog
**P1**
- Cart/checkout flow (mini-cart drawer + Stripe checkout)
- Per-product detail pages with variant selection
- Lowercase-email-on-insert to make newsletter idempotency case-insensitive
- Admin dashboard to view bookings/contact submissions

**P2**
- Real Sanity/Strapi CMS integration for products + stories
- Animated story carousel (auto-rotating)
- Booking calendar with available time-slot logic
- More languages (AR for full UAE parity, FR)
- Image optimization (next/image-equivalent) + LQIP placeholders
- Confirmation emails via Resend/SendGrid on booking + contact submit
