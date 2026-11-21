# Makineri Lami — project schematic

> Parts and machinery storefront for Makineri Lami (Zall-Herr, Tiranë), with an
> admin panel. Customers build an inquiry list and send it via WhatsApp. **No
> checkout, no online payment.** Schematic last verified: 2026-11-21. Changes: see `CHANGELOG.md`.

## 1. Project info

| | |
|---|---|
| Client | Makineri Lami, a Rritje Sade portfolio client (listed on rritjesade.com since 2026-09-17) |
| Status | Live on **Cloudflare Pages**: https://makineri-lami.pages.dev (moved 2026-11-21; Vercel project deleted, old Atlas cluster gone). Deploy = `wrangler pages deploy`, not git push |
| Language | Albanian UI (stock values: `stok` / `porosi` / `makine`, "Në shitje sot") |

## 2. Stack & methods

- React 19 + Vite 8 + React Router 7 (plain JSX, no TypeScript)
- **Cloudflare Pages**, project `makineri-lami`. One Pages Function `functions/api/[[path]].js` handles every `/api/*` and adapts it to the Node-style `server/router.js`. New endpoints go in `server/routes/` and get registered in `server/router.js`
- **D1** `makineri-lami` (binding `DB`): products / categories / settings stored as JSON documents (`migrations/0001_init.sql`). Seeds itself from `shared/seed.js` on first request and never overwrites. Without a D1 binding (plain `npm run dev`) the API serves the seed read-only
- **R2** `makineri-lami-images` (binding `IMAGES`): uploaded / imported photos, served at `/api/images/<id>`. Photos for the Nov 2026 stock are static files in `public/assets/inv/`
- Storefront hides products without photos and categories left empty (`visible()` in `src/lib/store.jsx`)
- Admin auth: `ADMIN_PASSWORD` (Pages secret) → HMAC-signed 7-day token. `/admin` and `/api` are noindex (`public/_headers`)

## 3. Layout

```
functions/api/[[path]].js  Pages Function → server/router.js
migrations/            D1 schema
wrangler.toml          Pages config + D1/R2 bindings
server/router.js       /api/<path> dispatcher
server/lib/            db (D1/R2 bindings, seeding) · store (data + validation) · http (JSON, auth)
server/routes/         catalog, products/, categories/, settings, images/ (upload, import, get), auth/, health
shared/seed.js         starting catalogue + browser offline fallback
shared/inventory.js    Nov 2026 stock (imported into seed.js)
src/pages/Home.jsx     storefront
src/components/        Header Hero Catalogue ProductModal InquiryTray Sections
src/lib/store.jsx      catalogue + inquiry list context (localStorage)
src/admin/             lazy-loaded admin panel: Products, ProductForm, Categories, Settings, ImagePicker
public/assets/         photos, hero video, og.jpg
```

## 4. Data model

- **product**: `ref` (unique, uppercase, goes into the WhatsApp message), name, category slug, stock, images[], specs, bullets, tags, badge, featured, active, order
- **category**: slug (renaming moves its products; deleting one with products forces a reassign), label, icon, order, active
- **settings** (`key:"site"`): contact, WhatsApp, hours, hero copy, video, socials, FAQ
- **images**: binary + content type

## 5. Features

Search, category + stock filters, shareable product pages `/p/<REF>`, inquiry
tray → WhatsApp message, featured "Në shitje sot" rail. Admin: product CRUD
with photo upload and IG/TikTok import, categories, site settings + FAQ.

## 6. Commands

```bash
npm run dev     # storefront on :5173, API read-only from seed
npm run build
npm run lint
npx wrangler pages dev dist --port 8788                     # full stack, local D1 + R2 (.dev.vars for ADMIN_PASSWORD)
npx wrangler d1 migrations apply makineri-lami --local|--remote
npx wrangler pages deploy dist --project-name makineri-lami --branch main   # go live
```

Health: `/api/health` should return `configured: true, connected: true`.

## 7. Open ends

- Old live data (admin edits made on Vercel/Atlas) was lost with the deleted Atlas cluster; the catalogue restarted from the seed on 2026-11-21.
- Pages project is not git-connected: deploys are manual with wrangler. Vercel project and files deleted 2026-11-21.
- No custom domain yet; client should be told about `makineri-lami.pages.dev`.
- `.env.example` / `.gitignore` carry uncommitted user edits.
- No tests.
