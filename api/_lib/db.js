/**
 * MongoDB connection with a serverless-safe cached client.
 *
 * If MONGODB_URI is not set (or the connection fails) every caller falls back
 * to the in-memory seed store, so the site keeps working before the database
 * is wired up. See store.js.
 */
import { MongoClient } from 'mongodb'

const URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.MONGODB_DB || 'makinerilami'

let cached = globalThis.__mlMongo
if (!cached) cached = globalThis.__mlMongo = { client: null, promise: null, failed: false }

export const hasDb = () => Boolean(URI)

export async function getDb() {
  if (!URI || cached.failed) return null
  if (cached.client) return cached.client.db(DB_NAME)

  if (!cached.promise) {
    cached.promise = MongoClient.connect(URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    }).catch((err) => {
      cached.promise = null
      cached.failed = true
      console.error('[mongo] connection failed:', err.message)
      return null
    })
  }

  const client = await cached.promise
  if (!client) return null
  cached.client = client
  return client.db(DB_NAME)
}

/** Collections, in one place so names never drift. */
export const COL = {
  products: 'products',
  categories: 'categories',
  settings: 'settings',
  images: 'images',
}

/** Creates indexes and seeds the catalogue the first time the DB is empty. */
export function ensureSeeded(db) {
  if (!db) return Promise.resolve()
  // concurrent first requests must all wait for the same seeding run
  if (!globalThis.__mlSeeding) {
    globalThis.__mlSeeding = seed(db).catch((e) => {
      globalThis.__mlSeeding = null
      console.error('[mongo] seed error:', e.message)
    })
  }
  return globalThis.__mlSeeding
}

async function seed(db) {
  const { PRODUCTS, CATEGORIES, SETTINGS } = await import('../../shared/seed.js')

  await Promise.all([
    db.collection(COL.products).createIndex({ ref: 1 }, { unique: true }),
    db.collection(COL.products).createIndex({ category: 1, order: 1 }),
    db.collection(COL.categories).createIndex({ slug: 1 }, { unique: true }),
    db.collection(COL.settings).createIndex({ key: 1 }, { unique: true }),
  ]).catch((e) => console.error('[mongo] index error:', e.message))

  const now = new Date()
  const counts = await Promise.all([
    db.collection(COL.categories).countDocuments(),
    db.collection(COL.products).countDocuments(),
    db.collection(COL.settings).countDocuments({ key: 'site' }),
  ])

  if (counts[0] === 0) {
    await db
      .collection(COL.categories)
      .insertMany(CATEGORIES.map((c) => ({ ...c, createdAt: now, updatedAt: now })), { ordered: false })
      .catch(ignoreDupes)
  }
  if (counts[1] === 0) {
    await db
      .collection(COL.products)
      .insertMany(PRODUCTS.map((p) => ({ ...p, createdAt: now, updatedAt: now })), { ordered: false })
      .catch(ignoreDupes)
  }
  if (counts[2] === 0) {
    await db.collection(COL.settings).insertOne({ ...SETTINGS, updatedAt: now }).catch(ignoreDupes)
  }
}

// another cold instance may have seeded at the same moment; duplicates are fine
function ignoreDupes(err) {
  if (err?.code === 11000 || err?.writeErrors?.every?.((e) => e.code === 11000)) return
  throw err
}
