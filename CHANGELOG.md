# Changelog

## 2026-11-21 — Moved to Cloudflare Pages (live)
- **Why:** the Vercel deployment was disabled (402 DEPLOYMENT_DISABLED) and the MongoDB Atlas cluster no longer exists (its DNS record is gone), so the site was down and the old live data could not be exported. The catalogue was rebuilt from `shared/seed.js` (existing items + the new November stock).
- **Live:** https://makineri-lami.pages.dev (Pages project `makineri-lami`, deployed with `wrangler pages deploy`).
- **API:** one Pages Function `functions/api/[[path]].js` adapts Fetch requests to the existing Node-style `server/router.js`; route files are unchanged.
- **Data:** D1 database `makineri-lami` (binding `DB`, schema in `migrations/0001_init.sql`: products / categories / settings as JSON documents). Seeds itself on first request when empty.
- **Uploaded photos:** R2 bucket `makineri-lami-images` (binding `IMAGES`), served from `/api/images/<id>` with immutable caching.
- **Secrets:** `ADMIN_PASSWORD` set on the Pages project (same value as before). `MONGODB_*` no longer used; `mongodb` package removed.
- `public/_headers` replaces the header rules from `vercel.json`. `api/`, `vercel.json` and the Vercel project `makineri-lami` were deleted.
- Removed `scripts/import-inventory.mjs` (MongoDB import, no longer needed).
- Hero headline shortened to “Pjesë dhe makineri ndërtimi” (accent line removed).
- Header on desktop aligns with the full-bleed hero; the search box stays inside the black panel (hidden over the hero between 981–1240px). Larger hero type on screens ≥1700px.

## 2026-11-21 — New inventory + magazine redesign

### Catalogue data
- Added 14 new items photographed in Zall-Herr on 2026-11-21 (`shared/inventory.js`), with 62 photos as 1600px WebP in `public/assets/inv/`.
  Komatsu PC340NLC, Astra HD7 mixer, Scania 114L 380, Terex PS6000, Thwaites and Toldo dumpers, three Iveco Stralis cabs, a crawler excavator (ex-TIEKU), a forklift, a bucket lot, a steel lattice section and a parts lot.
- New categories: `kamione` (Kamionë & kabina) and `pjese` (Pjesë të ndryshme).
- New stock uses negative `order` values so it lists first. Komatsu, Astra, Scania and Terex PS6000 are `featured`.
- Removed sold listings `M-330` (CAT 330) and `M-DMP` (Terex Benford) from the seed. 
- Thwaites dumper trimmed to one photo per angle (4 of 8).

### Storefront rules
- Products without photos are hidden from the storefront, and so are categories left empty by that (`visible()` in `src/lib/store.jsx`). Admin still shows and edits them.
- Seed fallback is now sorted by `order`, same as MongoDB.

### Design (CAT-style yellow/black, matches the PDF catalogue)
- **Hero:** full-height magazine cover. Desktop: black text panel + the first three featured products as numbered photo tiles. Mobile: one full-screen photo with the text over it. Hero video no longer shown.
- **Header:** fixed; transparent and compact while over the hero, solid with the category row after. Top info bar (`UtilBar`) removed from the home page.
- **Catalogue:** hazard-stripe divider, condensed uppercase headings, square cards with a yellow rule, ref label and photo count. Add and WhatsApp buttons equal width side by side (short labels on phones).
- **Featured (“Makineritë e javës”):** dark section, numbered spreads, alternating sides on desktop.
- **Item page (modal):** dark gallery with arrows, counter and thumbnail grid; header with ref/category chips; numbered sections for specs table and key points; note box; sticky equal-width Shto / WhatsApp buttons.
- **Empty inquiry tray:** heading, explanation, three steps and a “Shfleto katalogun” button.
- Category tiles: fluid grid, black icon boxes.
