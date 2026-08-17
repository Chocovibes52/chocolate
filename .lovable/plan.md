This is a large full-stack build. To ship something premium and stable rather than a shallow version of everything, I'll build it in phases and confirm before moving to backend/payments. Note: the stack here is TanStack Start + React + Tailwind (not Next.js) and Lovable Cloud (Supabase) instead of MongoDB — same capabilities, no external accounts needed.

## Phase 1 — Design system + Storefront (frontend only, no backend yet)
- Brand tokens in `src/styles.css`: Dark Chocolate #2E1B12, Brown #5A3825, Cream #F8F3EC, Gold #C89B3C, white. Serif display font (Cormorant/Playfair) + clean sans body. Rounded cards, soft shadows, gold accents, smooth animations.
- Remove all Lovable branding, delete favicon, update root meta.
- Pages (with mocked data): Home (hero slider, featured categories, best-selling energy bars, gift hampers, why-choose-us, B2B teaser, testimonials, Instagram gallery, footer), Energy Bars listing, Gift Hampers listing, Product Details, Cart, Checkout (UI), B2B Enquiry, About, Contact, FAQ, Privacy, Terms, Shipping, Refund.
- Global: sticky header, floating WhatsApp button, back-to-top, breadcrumbs, toasts, search, wishlist (local).
- Generate hero + product imagery.

## Phase 2 — Backend (Lovable Cloud)
- Enable Cloud. Tables: products, categories, banners, orders, order_items, customers (profiles), b2b_enquiries, testimonials, settings, wishlists, cart (or local), user_roles.
- RLS + user_roles pattern for admin. Auth (email/password + Google). Storage bucket for product/banner images.
- Wire storefront to real data.

## Phase 3 — Admin Dashboard (`/admin`)
- Protected admin routes. Dashboard cards, recent orders/enquiries.
- CRUD: products, categories, banners (drag-drop reorder), orders (status), customers, B2B enquiries (CSV export), testimonials, website settings, Razorpay settings.

## Phase 4 — Razorpay + COD checkout
- Razorpay keys stored in settings table (admin-editable, server-only secret). Server function to create Razorpay order + verify signature. COD toggle. Order success page, stock decrement.

## Phase 5 — Polish
- SEO metadata per route, sitemap.xml, robots.txt, lazy images, loading states, image zoom on PDP.

---

### Technical notes
- Framework: TanStack Start v1 (React 19, Vite). Server logic via `createServerFn`; webhooks/Razorpay verify via `/api/public/*` server routes.
- DB: Supabase (Lovable Cloud). Roles stored in a separate `user_roles` table with `has_role()` security-definer function.
- Payments: Razorpay keys entered in admin → stored via `add_secret` (RAZORPAY_KEY_ID public, RAZORPAY_KEY_SECRET secret). Public key exposed to client via a server fn.
- Images: Supabase Storage bucket `media` (public read).

### Confirmation needed before I start
1. OK with **TanStack Start + Supabase** instead of Next.js + MongoDB? (Same features, no accounts required.)
2. Shall I start with **Phase 1 (design + storefront with mock data)** and get your approval on look/feel before enabling backend?
3. Any specific brand name for the site (e.g., "Cacao & Co."), or should I pick one?