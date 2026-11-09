# The Excessory Studio — Store

React + Vite · Firebase (Firestore + Auth) · Cashfree payments · Vercel serverless API · Cloudinary · Framer Motion

## Features
- **Guest checkout** — no account needed; pay with UPI / cards / netbanking via **Cashfree**.
- **Sign in with Google** — saved addresses, order history, and reviews. Guest orders placed with the same email are linked automatically on first sign-in.
- **Verified reviews** — only customers with a paid order for that product can review it (enforced by Firestore rules).
- **Sizes + ring size guide** — admin chooses which sizes a product comes in; shoppers must pick one; the ring size chart opens from the product page.
- **Frequently bought together** + **"Complete the look"** cart upsell — admin can hand-pick pairings or leave it automatic.
- Admin: products, **online orders** (fulfilment tracking), invoices.

## Architecture
```
api/                     Vercel serverless functions (Node) — the only code holding secrets
  _lib/                  http helpers, Firebase Admin, Cashfree adapter, order domain service
  orders/create.js       re-prices the cart from Firestore, creates order + Cashfree session
  orders/verify.js       asks Cashfree for status, marks paid (idempotent), returns public order
  cashfree/webhook.js    signature-verified server-to-server confirmation
  account/claim.js       links paid guest orders to a Google account (verified email)
shared/commerce.js       rules shared by client + server (shipping, sizes, validation)
src/
  app/                   App routes (lazy-loaded) + provider composition
  components/ui/         design-system primitives (Button, Dialog, Field, Price, …) — each with a CSS module
  components/layout/     header, footer, store layout
  context/               Auth, Catalog, Cart (reducer), Toast
  services/              Firestore + API access (no UI code)
  hooks/                 useSubscription, dialog behaviour, customer data
  lib/                   formatting, product helpers, payments, recommendations
  features/<feature>/    home, catalog, cart, checkout, account, reviews, sizing, bundles, admin
  styles/                tokens.css (design tokens), reset, base, utilities, print
```
Styling: global CSS is limited to `src/styles/` (tokens, reset, base). Every component owns a co-located
`*.module.css` that consumes the tokens — no shared monolithic stylesheet.

## Setup
1. `npm install`, then copy `.env.example` → `.env` and fill it in.
2. **Firebase**
   - Authentication → Sign-in method → enable **Email/Password** (admin) and **Google** (customers).
   - Authentication → Settings → Authorized domains → add your production domain.
   - Project settings → Service accounts → **Generate new private key** → put it in `FIREBASE_SERVICE_ACCOUNT` (server only).
   - Firestore → Rules → paste `firestore.rules` (put **your admin email** in `isAdmin()`) → Publish.
3. **Cashfree** — Dashboard → Developers → API keys. Start with **test** keys, `CASHFREE_ENV=sandbox`, `VITE_CASHFREE_MODE=sandbox`.
   - Developers → Webhooks → add `https://<your-domain>/api/cashfree/webhook` (payment events).
   - Whitelist your domain in Cashfree (required for production).
4. **Cloudinary** — unsigned upload preset (unchanged).
5. **Local dev**
   - UI only: `npm run dev`.
   - Full stack with payments: `npm i -g vercel && vercel link && npm run dev:full` (serves `/api` too).
6. **Deploy (Vercel)** — add every variable from `.env.example` in Project → Settings → Environment Variables, then deploy.
   When going live, switch to production keys and set `CASHFREE_ENV=production` + `VITE_CASHFREE_MODE=production`.

## Things to personalise
- `src/config/site.js` — trust points, FAQ, business details, admin emails.
- `shared/commerce.js` — shipping fee / free-shipping threshold, preset ring sizes.
- `src/config/sizeGuides.js` — size chart data (the printable PDF lives in `public/size-guides/`).
- `src/config/policies.js` — replacement fee, claim window, dispatch/delivery/refund times used across the policy pages, FAQ and footer.
- `src/features/legal/` — policy pages (`/contact`, `/shipping-policy`, `/returns-policy`, `/privacy-policy`, `/terms`). Add a page by registering it in `policies.js` and `content/index.js`; routes, footer and sidebar update automatically. Have the text reviewed before relying on it legally.

## How payment works
1. Checkout posts the cart to `/api/orders/create`. The server re-reads prices and stock from Firestore,
   saves a `PENDING` order and creates a Cashfree order.
2. The browser opens Cashfree's hosted checkout. On return, `/order/:id` calls `/api/orders/verify`.
3. Whichever arrives first — the return-page check or the webhook — marks the order `PAID` inside a
   transaction: stock is decremented and `users/{uid}/purchases/{productId}` is written (unlocking reviews).
   Repeated calls are no-ops.
