# Makineri Lami — store

Parts and machinery storefront for Makineri Lami (Zall-Herr, Tiranë), with an admin panel to manage products, categories and site content. Customers build an inquiry list and send it via WhatsApp. There is no checkout and no online payment.

- **Storefront** `/` — search, categories, stock filters, product pages (`/p/<REF>`, shareable), inquiry list → WhatsApp
- **Admin** `/admin` — password login, products CRUD with photo upload / Instagram-TikTok import, categories, settings and FAQ

Stack: React 19 + Vite + React Router, Vercel serverless functions in `api/`, MongoDB.

## Deploy (Vercel)

Pushing to the connected GitHub branch deploys automatically. The site works right away on the built-in catalogue. To turn on the admin panel, set these in **Vercel → Project → Settings → Environment Variables** (Production + Preview), then **redeploy**:

| Variable | Required | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | yes, for `/admin` | Long random string. Changing it logs everyone out. |
| `MONGODB_URI` | yes, for saving | Atlas connection string. Without it the store is read-only and shows the seed catalogue. |
| `MONGODB_DB` | no | Database name, default `makinerilami`. |
| `ADMIN_SECRET` | no | Separate session-signing key. Defaults to a hash of `ADMIN_PASSWORD`. |

### MongoDB Atlas setup (about 5 minutes, free tier)

1. https://cloud.mongodb.com → create a free **M0** cluster (region: Frankfurt `eu-central-1` is closest to Vercel `fra1`).
2. **Database Access** → add a user with a password (role: *Read and write to any database*).
3. **Network Access** → add `0.0.0.0/0`. Vercel functions don't have fixed IPs.
4. **Connect → Drivers** → copy the `mongodb+srv://…` string, fill in the password, paste it as `MONGODB_URI` in Vercel.
5. Redeploy. On the first request the database seeds itself with the current catalogue, categories and settings. It never overwrites existing data.

Check it at `/api/health`, which should show `"configured": true, "connected": true`.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in MONGODB_URI and ADMIN_PASSWORD
npm run dev                  # storefront + /api on http://localhost:5173
```

`vite.config.js` includes a small dev plugin that serves the `api/` functions with Vercel's file routing, so `vercel dev` isn't needed. If you edit a file under `api/`, restart the dev server.

```bash
npm run build   # production bundle (admin is code-split, shoppers never load it)
npm run lint
```

## How it's organised

```
api/                    Vercel functions
  _lib/db.js            cached Mongo client, indexes, first-run seeding
  _lib/store.js         data layer + validation (products, categories, settings, images)
  _lib/http.js          JSON helpers, admin auth (HMAC-signed 7-day token)
  catalog.js            GET everything the storefront needs in one call
  products/ categories/ settings.js   CRUD (writes require the admin token)
  images/index.js       POST upload (browser-compressed WebP, stored in Mongo)
  images/import.js      POST {url}: Instagram/TikTok post or image link → stored copy
  images/[id].js        GET image (immutable cache)
  auth/login.js, me.js, health.js
shared/seed.js          starting catalogue; also the offline fallback in the browser
src/
  pages/Home.jsx        storefront
  components/           header, hero, catalogue, product modal, inquiry tray, sections
  lib/store.jsx         catalogue + inquiry-list context (list persists in localStorage)
  admin/                panel (lazy-loaded chunk)
public/assets/          optimised photos, hero video, og.jpg
```

### Data model

- **product**: `ref` (unique, uppercase, goes into the WhatsApp message), `name`, `category` (category slug), `stock` (`stok` | `porosi` | `makine`), `short`, `images[]`, `icon` (shown when there are no photos), `tags[]`, `specs[{label,value}]`, `bullets[]`, `note`, `badge`, `featured` (shown in "Në shitje sot"), `active` (hidden products stay in admin), `order`
- **category**: `slug` (unique), `label`, `icon`, `order`, `active`. Renaming a slug moves its products with it, and deleting a category that still has products requires choosing where to move them.
- **settings** (`key: "site"`): business name, phone, WhatsApp number, address, hours, hero texts, video/poster URLs, socials, FAQ
- **images**: binary, content type, size

### Notes

- **Photos.** Uploads are resized in the browser to 1600px WebP (a 5–10 MB phone photo becomes about 150–300 KB) and stored in MongoDB, which is fine for a catalogue of a few hundred items on the free 512 MB tier. Imports from Instagram/TikTok are copied, not hotlinked, because their CDN links expire. Private posts can't be imported; upload the photo instead.
- **Caching.** Catalogue API responses are `no-store`, so changes in the panel show on the next page load. Images are cached forever because their IDs never change.
- **Security.** Every write endpoint checks the admin token. Login is rate-limited per instance, `/admin` and `/api` are `noindex`, and hidden products 404 publicly.
