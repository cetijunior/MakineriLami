/**
 * Data layer. Talks to MongoDB when it is configured, otherwise serves the
 * seed catalogue read-only (writes return a clear 503 instead of failing
 * silently, so the admin panel can explain what is missing).
 */
import { getDb, getBucket, ensureSeeded, hasDb, newId } from './db.js'
import { PRODUCTS, CATEGORIES, SETTINGS } from '../../shared/seed.js'

export class StoreError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

const NO_DB = () => {
  throw new StoreError('Baza e të dhënave nuk është e lidhur (D1). Kontrolloni bindings në Cloudflare Pages.', 503)
}

async function db() {
  const d = getDb()
  if (d) await ensureSeeded(d)
  return d
}

const oid = (id) => {
  if (!/^[a-f0-9]{24}$/.test(String(id))) throw new StoreError('Identifikues i pavlefshëm.', 400)
  return String(id)
}

/** Row → document with _id, the shape the API always returned. */
const toDoc = (row) => (row ? { ...JSON.parse(row.data), _id: row.id } : null)
const all = async (stmt) => ((await stmt.all()).results || []).map(toDoc)
const now = () => new Date().toISOString()

/* ------------------------------------------------------------------ read */

export async function listCategories({ includeInactive = false } = {}) {
  const d = await db()
  if (!d) {
    const rows = CATEGORIES.map((c, i) => ({ ...c, _id: `seed-cat-${i}` }))
    return includeInactive ? rows : rows.filter((c) => c.active !== false)
  }
  const rows = await all(d.prepare("SELECT * FROM categories ORDER BY ord, json_extract(data,'$.label')"))
  return includeInactive ? rows : rows.filter((c) => c.active !== false)
}

export async function listProducts({ includeInactive = false } = {}) {
  const d = await db()
  if (!d) {
    const rows = PRODUCTS.map((p, i) => ({ ...p, _id: `seed-prod-${i}` })).sort((a, b) => (a.order || 0) - (b.order || 0))
    return includeInactive ? rows : rows.filter((p) => p.active !== false)
  }
  const rows = await all(d.prepare('SELECT * FROM products ORDER BY ord, created'))
  return includeInactive ? rows : rows.filter((p) => p.active !== false)
}

export async function getProduct(id) {
  const d = await db()
  if (!d) {
    const i = Number(String(id).replace('seed-prod-', ''))
    const p = PRODUCTS[i]
    return p ? { ...p, _id: id } : null
  }
  return toDoc(await d.prepare('SELECT * FROM products WHERE id = ?').bind(oid(id)).first())
}

export async function getSettings() {
  const d = await db()
  if (!d) return { ...SETTINGS, _id: 'seed-settings' }
  const row = await d.prepare("SELECT * FROM settings WHERE key = 'site'").first()
  return row ? { ...JSON.parse(row.data), _id: 'site' } : { ...SETTINGS, _id: 'seed-settings' }
}

/* ----------------------------------------------------------------- write */

const STOCKS = ['stok', 'porosi', 'makine']

function normaliseProduct(input, { partial = false } = {}) {
  const out = {}
  const str = (v) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v) =>
    Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean) : []

  if (!partial || input.ref !== undefined) {
    out.ref = str(input.ref).toUpperCase()
    if (!out.ref) throw new StoreError('Kodi i artikullit është i detyrueshëm.')
    if (out.ref.length > 24) throw new StoreError('Kodi është shumë i gjatë (max 24).')
  }
  if (!partial || input.name !== undefined) {
    out.name = str(input.name)
    if (!out.name) throw new StoreError('Emri i artikullit është i detyrueshëm.')
  }
  if (!partial || input.category !== undefined) {
    out.category = str(input.category)
    if (!out.category) throw new StoreError('Kategoria është e detyrueshme.')
  }
  if (!partial || input.stock !== undefined) {
    out.stock = STOCKS.includes(input.stock) ? input.stock : 'stok'
  }
  if (input.short !== undefined) out.short = str(input.short)
  if (input.note !== undefined) out.note = str(input.note)
  if (input.badge !== undefined) out.badge = str(input.badge)
  if (input.icon !== undefined) out.icon = str(input.icon)
  if (input.images !== undefined) out.images = arr(input.images).slice(0, 12)
  if (input.tags !== undefined) out.tags = arr(input.tags).slice(0, 8)
  if (input.bullets !== undefined) out.bullets = arr(input.bullets).slice(0, 12)
  if (input.specs !== undefined) {
    out.specs = (Array.isArray(input.specs) ? input.specs : [])
      .map((s) => ({ label: str(s?.label), value: str(s?.value) }))
      .filter((s) => s.label || s.value)
      .slice(0, 8)
  }
  if (input.featured !== undefined) out.featured = Boolean(input.featured)
  if (input.active !== undefined) out.active = Boolean(input.active)
  if (input.order !== undefined) out.order = Number(input.order) || 0
  return out
}

const maxOrd = async (d, table) => (await d.prepare(`SELECT MAX(ord) AS m FROM ${table}`).first())?.m || 0

async function saveProductRow(d, id, full) {
  await d.prepare('UPDATE products SET ref = ?, ord = ?, data = ? WHERE id = ?')
    .bind(full.ref, full.order || 0, JSON.stringify(stripId(full)), id).run()
}
const stripId = (o) => { const { _id, ...rest } = o; void _id; return rest }

export async function createProduct(input) {
  const d = await db()
  if (!d) NO_DB()
  const data = normaliseProduct(input)
  const dupe = await d.prepare('SELECT id FROM products WHERE ref = ?').bind(data.ref).first()
  if (dupe) throw new StoreError(`Kodi "${data.ref}" përdoret tashmë nga një artikull tjetër.`, 409)
  const t = now()
  const full = {
    images: [], tags: [], bullets: [], specs: [], featured: false, active: true,
    order: (await maxOrd(d, 'products')) + 1,
    ...data, createdAt: t, updatedAt: t,
  }
  const id = newId()
  await d.prepare('INSERT INTO products (id, ref, ord, created, data) VALUES (?, ?, ?, ?, ?)')
    .bind(id, full.ref, full.order, t, JSON.stringify(full)).run()
  return { ...full, _id: id }
}

export async function updateProduct(id, input) {
  const d = await db()
  if (!d) NO_DB()
  const data = normaliseProduct(input, { partial: true })
  const cur = await getProduct(oid(id))
  if (!cur) throw new StoreError('Artikulli nuk u gjet.', 404)
  if (data.ref && data.ref !== cur.ref) {
    const dupe = await d.prepare('SELECT id FROM products WHERE ref = ? AND id != ?').bind(data.ref, id).first()
    if (dupe) throw new StoreError(`Kodi "${data.ref}" përdoret tashmë nga një artikull tjetër.`, 409)
  }
  const full = { ...cur, ...data, updatedAt: now() }
  await saveProductRow(d, id, full)
  return full
}

export async function deleteProduct(id) {
  const d = await db()
  if (!d) NO_DB()
  const r = await d.prepare('DELETE FROM products WHERE id = ?').bind(oid(id)).run()
  if (!r.meta?.changes) throw new StoreError('Artikulli nuk u gjet.', 404)
  return { ok: true }
}

export async function reorderProducts(ids) {
  const d = await db()
  if (!d) NO_DB()
  if (!Array.isArray(ids)) throw new StoreError('Lista e renditjes mungon.')
  const t = now()
  const stmts = ids.map((id, i) => d.prepare(
    "UPDATE products SET ord = ?, data = json_set(data, '$.order', ?, '$.updatedAt', ?) WHERE id = ?",
  ).bind(i + 1, i + 1, t, oid(id)))
  if (stmts.length) await d.batch(stmts)
  return { ok: true, count: stmts.length }
}

function normaliseCategory(input, { partial = false } = {}) {
  const out = {}
  const str = (v) => (typeof v === 'string' ? v.trim() : '')
  if (!partial || input.label !== undefined) {
    out.label = str(input.label)
    if (!out.label) throw new StoreError('Emri i kategorisë është i detyrueshëm.')
  }
  if (!partial || input.slug !== undefined) {
    out.slug =
      str(input.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      slugify(out.label || '')
    if (!out.slug) throw new StoreError('Slug i pavlefshëm.')
  }
  if (input.icon !== undefined) out.icon = str(input.icon) || 'gear'
  if (input.order !== undefined) out.order = Number(input.order) || 0
  if (input.active !== undefined) out.active = Boolean(input.active)
  return out
}

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/ë/g, 'e')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function getCategory(d, id) {
  return toDoc(await d.prepare('SELECT * FROM categories WHERE id = ?').bind(oid(id)).first())
}

export async function createCategory(input) {
  const d = await db()
  if (!d) NO_DB()
  const data = normaliseCategory(input)
  const dupe = await d.prepare('SELECT id FROM categories WHERE slug = ?').bind(data.slug).first()
  if (dupe) throw new StoreError(`Kategoria "${data.slug}" ekziston tashmë.`, 409)
  const t = now()
  const full = { icon: 'gear', active: true, order: (await maxOrd(d, 'categories')) + 1, ...data, createdAt: t, updatedAt: t }
  const id = newId()
  await d.prepare('INSERT INTO categories (id, slug, ord, data) VALUES (?, ?, ?, ?)')
    .bind(id, full.slug, full.order, JSON.stringify(full)).run()
  return { ...full, _id: id }
}

export async function updateCategory(id, input) {
  const d = await db()
  if (!d) NO_DB()
  const data = normaliseCategory(input, { partial: true })
  const current = await getCategory(d, id)
  if (!current) throw new StoreError('Kategoria nuk u gjet.', 404)
  const stmts = []
  if (data.slug && data.slug !== current.slug) {
    const dupe = await d.prepare('SELECT id FROM categories WHERE slug = ?').bind(data.slug).first()
    if (dupe) throw new StoreError(`Kategoria "${data.slug}" ekziston tashmë.`, 409)
    // keep products attached to the category
    stmts.push(d.prepare("UPDATE products SET data = json_set(data, '$.category', ?) WHERE json_extract(data, '$.category') = ?")
      .bind(data.slug, current.slug))
  }
  const full = { ...current, ...data, updatedAt: now() }
  stmts.push(d.prepare('UPDATE categories SET slug = ?, ord = ?, data = ? WHERE id = ?')
    .bind(full.slug, full.order || 0, JSON.stringify(stripId(full)), id))
  await d.batch(stmts)
  return full
}

export async function deleteCategory(id, { moveTo = '' } = {}) {
  const d = await db()
  if (!d) NO_DB()
  const cat = await getCategory(d, id)
  if (!cat) throw new StoreError('Kategoria nuk u gjet.', 404)
  const used = (await d.prepare("SELECT COUNT(*) AS n FROM products WHERE json_extract(data, '$.category') = ?")
    .bind(cat.slug).first())?.n || 0
  if (used && !moveTo) {
    throw new StoreError(
      `Kjo kategori ka ${used} artikuj. Zgjidhni një kategori ku t'i zhvendosni përpara se ta fshini.`,
      409,
    )
  }
  const stmts = []
  if (used && moveTo) {
    stmts.push(d.prepare("UPDATE products SET data = json_set(data, '$.category', ?) WHERE json_extract(data, '$.category') = ?")
      .bind(moveTo, cat.slug))
  }
  stmts.push(d.prepare('DELETE FROM categories WHERE id = ?').bind(id))
  await d.batch(stmts)
  return { ok: true, moved: used }
}

export async function updateSettings(input) {
  const d = await db()
  if (!d) NO_DB()
  const allowed = [
    'businessName', 'tagline', 'phone', 'whatsapp', 'address', 'hours', 'responseTime',
    'heroEyebrow', 'heroTitle', 'heroTitleAccent', 'heroLead', 'heroVideo', 'heroPoster',
    'yardImage', 'instagram', 'facebook', 'tiktok',
  ]
  const set = {}
  for (const k of allowed) if (input[k] !== undefined) set[k] = String(input[k] ?? '').trim()
  if (Array.isArray(input.faq)) {
    set.faq = input.faq
      .map((f) => ({ q: String(f?.q || '').trim(), a: String(f?.a || '').trim() }))
      .filter((f) => f.q && f.a)
      .slice(0, 20)
  }
  if (input.whatsapp !== undefined) set.whatsapp = String(input.whatsapp).replace(/[^0-9]/g, '')
  const cur = await getSettings()
  const full = { ...stripId(cur), ...set, key: 'site', updatedAt: now() }
  await d.prepare('INSERT INTO settings (key, data) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data')
    .bind('site', JSON.stringify(full)).run()
  return { ...full, _id: 'site' }
}

/* ---------------------------------------------------------------- images */

export async function saveImage({ data, contentType, name }) {
  const bucket = getBucket()
  if (!bucket) NO_DB()
  if (!data) throw new StoreError('Skedari mungon.')
  const buf = Buffer.from(data, 'base64')
  const MAX = 4 * 1024 * 1024
  if (buf.length > MAX) throw new StoreError('Fotoja është shumë e madhe (max 4 MB pas kompresimit).', 413)
  const id = newId()
  await bucket.put(id, buf, {
    httpMetadata: { contentType: contentType || 'image/webp' },
    customMetadata: { name: String(name || '').slice(0, 120) },
  })
  return { url: `/api/images/${id}`, id, size: buf.length }
}

export async function readImage(id) {
  const bucket = getBucket()
  if (!bucket) return null
  const obj = await bucket.get(oid(id))
  if (!obj) return null
  return { buffer: Buffer.from(await obj.arrayBuffer()), contentType: obj.httpMetadata?.contentType || 'image/webp' }
}

export async function deleteImage(id) {
  const bucket = getBucket()
  if (!bucket) NO_DB()
  await bucket.delete(oid(id))
  return { ok: true }
}

export const dbConfigured = hasDb
