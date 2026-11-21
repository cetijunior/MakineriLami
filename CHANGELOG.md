# Changelog

## 2026-11-21 — New inventory + magazine redesign

### Catalogue data
- Added 14 new items photographed in Zall-Herr on 2026-11-21 (`shared/inventory.js`), with 62 photos as 1600px WebP in `public/assets/inv/`.
  Komatsu PC340NLC, Astra HD7 mixer, Scania 114L 380, Terex PS6000, Thwaites and Toldo dumpers, three Iveco Stralis cabs, a crawler excavator (ex-TIEKU), a forklift, a bucket lot, a steel lattice section and a parts lot.
- New categories: `kamione` (Kamionë & kabina) and `pjese` (Pjesë të ndryshme).
- New stock uses negative `order` values so it lists first. Komatsu, Astra, Scania and Terex PS6000 are `featured`.
- Removed sold listings `M-330` (CAT 330) and `M-DMP` (Terex Benford) from the seed. On the live DB they are set `active:false`, not deleted.
- Thwaites dumper trimmed to one photo per angle (4 of 8).
- `scripts/import-inventory.mjs`: one-off import for an existing MongoDB (seeding only runs on an empty DB). Dry run by default, `--write` to apply. Skips refs/slugs that already exist and hides the sold refs.

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
