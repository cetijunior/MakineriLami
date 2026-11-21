# makineri-lami: migration to Cloudflare (already not Next.js)

> **Done 2026-11-21.** Live at https://makineri-lami.pages.dev. Mongo data could not be exported (cluster deleted), so steps 1 and 6 were skipped; the catalogue restarted from the seed. Remaining: step 7 (delete `api/`, `vercel.json`, Vercel project) with CJ's OK. Details in CHANGELOG.md.

Shared stack and checks: `~/Desktop/CLOUDFLARE-MIGRATION.md`. **Effort: M** (about 1.5 days). Wave 3.
This one is **not Next.js**: it's React 19 + Vite 8 + React Router 7, so the **frontend doesn't change at all**. The work is the API and the database.

## Today (see CLAUDE.md)

- **Frontend:** Vite SPA. Storefront plus a lazy-loaded admin (`src/admin/`). The inquiry list goes through WhatsApp, and the cart lives in localStorage. Build output is `dist/`.
- **API:** one Vercel function `api/index.js` → `server/router.js`, which dispatches `/api/<path>` to `server/routes/*`: catalog, health, settings, auth (login, me), products (index, reorder, id), categories (index, id), images (index, import, id).
  - These are written **Node-style** (`res.statusCode`, `res.setHeader`, `res.end` in `server/lib/http.js`).
- **`vercel.json`:**
  - rewrites `/api/:path*` → `/api?__path=:path*`, and everything else → `index.html` (the SPA fallback)
  - `maxDuration` 15 s
- **Data:** **MongoDB Atlas M0 (Frankfurt)**. Products, categories and settings, **plus image bytes stored as binary in Mongo** (WebP, resized in the browser, served immutably). It seeds itself from `shared/seed.js` and runs read-only without `MONGODB_URI`.
- **Auth:** `ADMIN_PASSWORD` → a 7-day HMAC token (`ADMIN_SECRET`). Login is rate-limited.

## Target

- **Cloudflare Pages** project `makineri-lami` (the name is free) → `makineri-lami.pages.dev`. `vite build` → `dist/` is deployed as-is. Pages' SPA fallback works by default (when there's no `404.html`, unknown paths serve `index.html`), which replaces the catch-all rewrite.
- **API:** `functions/api/[[path]].js`, one **Pages Function** catching every `/api/*` (there's no function-count limit on Cloudflare, but a single router keeps it simple).
  - It calls the existing `server/router.js` through a **thin adapter**: build a minimal `res` object (`statusCode`, `setHeader`, `end` → resolve a `Response`) and a `req` (method, url, headers, body stream). Then **no route file needs rewriting**.
  - Rewriting `lib/http.js` to return `Response` is the cleaner alternative. Either is fine.
- **Data → D1** `makineri-lami`: tables `products`, `categories`, `settings`. **Image bytes → R2** bucket `makineri-lami-images`, keyed by the same image id. The `images/id` route streams from R2 with the same immutable cache header.
  - `server/lib/db.js` and `store.js` are rewritten against D1, keeping their exported functions, so the routes don't change.
  - The self-seeding from `shared/seed.js` is kept.
- **HMAC token:** if `server/lib/http.js` uses `node:crypto`, either swap it for WebCrypto or enable `nodejs_compat`.

## Steps

1. Export the live data: `mongoexport` for products, categories and settings, plus a script that dumps each image document's binary to files.
2. Create D1 + R2, write `migrations/0001.sql`, import the JSON → SQL, and upload the images with `wrangler r2 object put`, or with a small script for bulk.
3. Rewrite `db.js` and `store.js` for D1 and R2, then add `functions/api/[[path]].js` with the adapter.
4. Local test: `npx wrangler pages dev dist`. Run the full admin flow (login, add a product with a photo, import from Instagram, reorder, edit settings) and the storefront inquiry → WhatsApp.
5. Secrets: `ADMIN_PASSWORD`, `ADMIN_SECRET`. Drop `MONGODB_*`.
6. Deploy, compare the storefront against makineri-lami.vercel.app (screenshots + catalogue count), and freeze admin edits during the final data sync.
7. Delete `api/`, `vercel.json`, and the Vercel project (with CJ's OK). Update the CLAUDE.md "never add files to `api/`" rule, which no longer applies.

## Note

The client sees `makineri-lami.vercel.app` today. Tell them about the new URL, or give them a real domain while we're at it (a `.al` through host.al, using Cloudflare DNS).
