# The Excessory Studio — Store

React + Vite · Firebase (Firestore + Auth) · Cloudinary · Framer Motion · WhatsApp ordering

## Setup (10 minutes)
1. `npm install`
2. **Firebase**: create project → add Web app → copy keys into `.env` (copy `.env.example`).
   - Build → **Firestore Database** → create (production mode).
   - Build → **Authentication** → enable **Email/Password** → add your admin user.
   - Firestore → Rules → paste `firestore.rules` (put YOUR admin email in it) → Publish.
3. **Cloudinary**: Settings → Upload → Upload presets → Add → Signing mode **Unsigned** → copy preset name and your cloud name into `.env`.
4. **WhatsApp**: `VITE_WHATSAPP_NUMBER=91XXXXXXXXXX` (country code, digits only).
5. `npm run dev` → store at `/`, admin at `/admin`.
6. Deploy: `npm run build` → host `dist/` on Firebase Hosting / Vercel / Netlify (enable SPA fallback to `index.html` so `/admin` works).

## Things to personalise (`src/config.js`)
- Trust points and FAQ: make them match your real policies.
- `REVIEWS`: add real customer reviews only.

## How ordering works
"Order Now" opens `wa.me/<your number>` with the product name, price and a shareable product link pre-filled.
# TheAxcessoryStudio
