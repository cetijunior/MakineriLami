/**
 * Data layer. Talks to MongoDB when it is configured, otherwise serves the
 * seed catalogue read-only (writes return a clear 503 instead of failing
 * silently, so the admin panel can explain what is missing).
 */
import { ObjectId } from 'mongodb'
import { getDb, ensureSeeded, COL, hasDb } from './db.js'
import { PRODUCTS, CATEGORIES, SETTINGS } from '../../shared/seed.js'

export class StoreError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

const NO_DB = () => {
  throw new StoreError(
    'Baza e të dhënave nuk është e lidhur. Shtoni MONGODB_URI te Environment Variables në Vercel dhe ribëni deploy.',
    503,
  )
}

async function db() {
  const d = await getDb()
  if (d) await ensureSeeded(d)
  return d
}

const oid = (id) => {
  if (!ObjectId.isValid(id)) throw new StoreError('Identifikues i pavlefshëm.', 400)
  return new ObjectId(id)
}

const clean = (doc) => (doc ? { ...doc, _id: String(doc._id) } : doc)

/* ------------------------------------------------------------------ read */

export async function listCategories({ includeInactive = false } = {}) {
  const d = await db()
  if (!d) {
    const rows = CATEGORIES.map((c, i) => ({ ...c, _id: `seed-cat-${i}` }))
    return includeInactive ? rows : rows.filter((c) => c.active !== false)
  }
  const q = includeInactive ? {} : { active: { $ne: false } }
  const rows = await d.collection(COL.categories).find(q).sort({ order: 1, label: 1 }).toArray()
  return rows.map(clean)
}

export async function listProducts({ includeInactive = false } = {}) {
  const d = await db()
  if (!d) {
    const rows = PRODUCTS.map((p, i) => ({ ...p, _id: `seed-prod-${i}` }))
    return includeInactive ? rows : rows.filter((p) => p.active !== false)
  }
  const q = includeInactive ? {} : { active: { $ne: false } }
  const rows = await d.collection(COL.products).find(q).sort({ order: 1, createdAt: 1 }).toArray()
  return rows.map(clean)
}

export async function getProduct(id) {
  const d = await db()
  if (!d) {
    const i = Number(String(id).replace('seed-prod-', ''))
    const p = PRODUCTS[i]
    return p ? { ...p, _id: id } : null
  }
  return clean(await d.collection(COL.products).findOne({ _id: oid(id) }))
}

export async function getSettings() {
  const d = await db()
  if (!d) return { ...SETTINGS, _id: 'seed-settings' }
  const s = await d.collection(COL.settings).findOne({ key: 'site' })
  return s ? clean(s) : { ...SETTINGS, _id: 'seed-settings' }
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

export async function createProduct(input) {
  const d = await db()
  if (!d) NO_DB()
  const doc = normaliseProduct(input)
  const dupe = await d.collection(COL.products).findOne({ ref: doc.ref })
  if (dupe) throw new StoreError(`Kodi "${doc.ref}" përdoret tashmë nga një artikull tjetër.`, 409)

  const last = await d.collection(COL.products).find({}).sort({ order: -1 }).limit(1).toArray()
  const now = new Date()
  const full = {
    images: [],
    tags: [],
    bullets: [],
    specs: [],
    featured: false,
    active: true,
    order: (last[0]?.order || 0) + 1,
    ...doc,
    createdAt: now,
    updatedAt: now,
  }
  const res = await d.collection(COL.products).insertOne(full)
  return clean({ ...full, _id: res.insertedId })
}

export async function updateProduct(id, input) {
  const d = await db()
  if (!d) NO_DB()
  const doc = normaliseProduct(input, { partial: true })
  if (doc.ref) {
    const dupe = await d
      .collection(COL.products)
      .findOne({ ref: doc.ref, _id: { $ne: oid(id) } })
  if (dupe) throw new StoreError(`Kodi "${doc.ref}" përdoret tashmë nga një artikull tjetër.`, 409)
  }
  const res = await d
    .collection(COL.products)
    .findOneAndUpdate(
      { _id: oid(id) },
      { $set: { ...doc, updatedAt: new Date() } },
      { returnDocument: 'after' },
    )
  const value = res?.value ?? res
  if (!value?._id) throw new StoreError('Artikulli nuk u gjet.', 404)
  return clean(value)
}

export async function deleteProduct(id) {
  const d = await db()
  if (!d) NO_DB()
  const res = await d.collection(COL.products).deleteOne({ _id: oid(id) })
  if (!res.deletedCount) throw new StoreError('Artikulli nuk u gjet.', 404)
  return { ok: true }
}

export async function reorderProducts(ids) {
  const d = await db()
  if (!d) NO_DB()
  if (!Array.isArray(ids)) throw new StoreError('Lista e renditjes mungon.')
  const ops = ids.map((id, i) => ({
    updateOne: { filter: { _id: oid(id) }, update: { $set: { order: i + 1, updatedAt: new Date() } } },
  }))
  if (ops.length) await d.collection(COL.products).bulkWrite(ops)
  return { ok: true, count: ops.length }
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

export async function createCategory(input) {
  const d = await db()
  if (!d) NO_DB()
  const doc = normaliseCategory(input)
  const dupe = await d.collection(COL.categories).findOne({ slug: doc.slug })
  if (dupe) throw new StoreError(`Kategoria "${doc.slug}" ekziston tashmë.`, 409)
  const last = await d.collection(COL.categories).find({}).sort({ order: -1 }).limit(1).toArray()
  const now = new Date()
  const full = { icon: 'gear', active: true, order: (last[0]?.order || 0) + 1, ...doc, createdAt: now, updatedAt: now }
  const res = await d.collection(COL.categories).insertOne(full)
  return clean({ ...full, _id: res.insertedId })
}

export async function updateCategory(id, input) {
  const d = await db()
  if (!d) NO_DB()
  const doc = normaliseCategory(input, { partial: true })
  const current = await d.collection(COL.categories).findOne({ _id: oid(id) })
  if (!current) throw new StoreError('Kategoria nuk u gjet.', 404)
  if (doc.slug && doc.slug !== current.slug) {
    const dupe = await d.collection(COL.categories).findOne({ slug: doc.slug })
    if (dupe) throw new StoreError(`Kategoria "${doc.slug}" ekziston tashmë.`, 409)
    // keep products attached to the category
    await d
      .collection(COL.products)
      .updateMany({ category: current.slug }, { $set: { category: doc.slug } })
  }
  const res = await d
    .collection(COL.categories)
    .findOneAndUpdate(
      { _id: oid(id) },
      { $set: { ...doc, updatedAt: new Date() } },
      { returnDocument: 'after' },
    )
  return clean(res?.value ?? res)
}

export async function deleteCategory(id, { moveTo = '' } = {}) {
  const d = await db()
  if (!d) NO_DB()
  const cat = await d.collection(COL.categories).findOne({ _id: oid(id) })
  if (!cat) throw new StoreError('Kategoria nuk u gjet.', 404)

  const used = await d.collection(COL.products).countDocuments({ category: cat.slug })
  if (used && !moveTo) {
    throw new StoreError(
      `Kjo kategori ka ${used} artikuj. Zgjidhni një kategori ku t'i zhvendosni përpara se ta fshini.`,
      409,
    )
  }
  if (used && moveTo) {
    await d.collection(COL.products).updateMany({ category: cat.slug }, { $set: { category: moveTo } })
  }
  await d.collection(COL.categories).deleteOne({ _id: oid(id) })
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

  const res = await d
    .collection(COL.settings)
    .findOneAndUpdate(
      { key: 'site' },
      { $set: { ...set, key: 'site', updatedAt: new Date() } },
      { returnDocument: 'after', upsert: true },
    )
  return clean(res?.value ?? res)
}

/* ---------------------------------------------------------------- images */

export async function saveImage({ data, contentType, name }) {
  const d = await db()
  if (!d) NO_DB()
  if (!data) throw new StoreError('Skedari mungon.')
  const buf = Buffer.from(data, 'base64')
  const MAX = 4 * 1024 * 1024
  if (buf.length > MAX) throw new StoreError('Fotoja është shumë e madhe (max 4 MB pas kompresimit).', 413)
  const res = await d.collection(COL.images).insertOne({
    data: buf,
    contentType: contentType || 'image/webp',
    name: String(name || '').slice(0, 120),
    size: buf.length,
    createdAt: new Date(),
  })
  return { url: `/api/images/${res.insertedId}`, id: String(res.insertedId), size: buf.length }
}

export async function readImage(id) {
  const d = await db()
  if (!d) return null
  const img = await d.collection(COL.images).findOne({ _id: oid(id) })
  if (!img) return null
  return { buffer: img.data.buffer ? Buffer.from(img.data.buffer) : Buffer.from(img.data), contentType: img.contentType }
}

export async function deleteImage(id) {
  const d = await db()
  if (!d) NO_DB()
  await d.collection(COL.images).deleteOne({ _id: oid(id) })
  return { ok: true }
}

export const dbConfigured = hasDb
