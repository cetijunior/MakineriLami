/**
 * Cloudflare bindings: D1 (catalogue data) and R2 (uploaded image bytes).
 *
 * The Pages Function calls setBindings(env) on every request. Without a D1
 * binding (plain `vite` dev) every caller falls back to the in-memory seed
 * store, read-only, so the site keeps working. See store.js.
 *
 * Schema (migrations/0001_init.sql): each table stores the document as JSON
 * plus the few columns we look up or sort by.
 */
let env = {}

export function setBindings(e) {
  env = e || {}
}

export const hasDb = () => Boolean(env.DB)
export const getDb = () => env.DB || null
export const getBucket = () => env.IMAGES || null

let seeding = null

/** Seeds the catalogue the first time the DB is empty. Never overwrites. */
export function ensureSeeded(db) {
  if (!db) return Promise.resolve()
  if (!seeding) {
    seeding = seed(db).catch((e) => {
      seeding = null
      console.error('[d1] seed error:', e.message)
    })
  }
  return seeding
}

async function seed(db) {
  const { PRODUCTS, CATEGORIES, SETTINGS } = await import('../../shared/seed.js')
  const count = async (t) => (await db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).first())?.n || 0
  const now = new Date().toISOString()
  const [nc, np, ns] = await Promise.all([count('categories'), count('products'), count('settings')])
  const stmts = []
  if (!nc) {
    for (const c of CATEGORIES) {
      stmts.push(db.prepare('INSERT OR IGNORE INTO categories (id, slug, ord, data) VALUES (?, ?, ?, ?)')
        .bind(newId(), c.slug, c.order || 0, JSON.stringify({ ...c, createdAt: now, updatedAt: now })))
    }
  }
  if (!np) {
    for (const p of PRODUCTS) {
      stmts.push(db.prepare('INSERT OR IGNORE INTO products (id, ref, ord, created, data) VALUES (?, ?, ?, ?, ?)')
        .bind(newId(), p.ref, p.order || 0, now, JSON.stringify({ ...p, createdAt: now, updatedAt: now })))
    }
  }
  if (!ns) {
    stmts.push(db.prepare('INSERT OR IGNORE INTO settings (key, data) VALUES (?, ?)')
      .bind('site', JSON.stringify({ ...SETTINGS, key: 'site', updatedAt: now })))
  }
  if (stmts.length) await db.batch(stmts)
}

/** 24-char hex ids, same shape as the old Mongo ObjectIds the admin expects. */
export function newId() {
  const b = new Uint8Array(12)
  crypto.getRandomValues(b)
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
}
