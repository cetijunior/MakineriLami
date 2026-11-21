/**
 * Adds the November 2026 inventory (shared/inventory.js) to an existing
 * MongoDB catalogue. Seeding only runs on an empty database, so live data
 * needs this one-off import. It also hides the sold listings (SOLD). Negative `order` values list the new stock first. Safe to re-run: existing refs/slugs are skipped.
 *
 *   node --env-file=.env.local scripts/import-inventory.mjs          # dry run
 *   node --env-file=.env.local scripts/import-inventory.mjs --write  # insert
 */
import { MongoClient } from 'mongodb'
import { INVENTORY_CATEGORIES, INVENTORY_PRODUCTS } from '../shared/inventory.js'

const URI = process.env.MONGODB_URI
const DB = process.env.MONGODB_DB || 'makinerilami'
const write = process.argv.includes('--write')
if (!URI) throw new Error('MONGODB_URI mungon.')

const client = await MongoClient.connect(URI, { serverSelectionTimeoutMS: 8000 })
const db = client.db(DB)
const now = new Date()

for (const c of INVENTORY_CATEGORIES) {
  const exists = await db.collection('categories').findOne({ slug: c.slug })
  console.log(`${exists ? 'skip' : write ? 'add ' : 'new '} category ${c.slug}`)
  if (!exists && write) await db.collection('categories').insertOne({ ...c, createdAt: now, updatedAt: now })
}

for (const p of INVENTORY_PRODUCTS) {
  const exists = await db.collection('products').findOne({ ref: p.ref })
  console.log(`${exists ? 'skip' : write ? 'add ' : 'new '} product ${p.ref}`)
  if (!exists && write) {
    await db.collection('products').insertOne({ ...p, createdAt: now, updatedAt: now })
  }
}

// sold: hidden from the store (active:false), kept in the database for the record
const SOLD = ['M-330', 'M-DMP']
for (const ref of SOLD) {
  const p = await db.collection('products').findOne({ ref })
  if (!p || p.active === false) { console.log(`skip sold    ${ref}`); continue }
  console.log(`${write ? 'hide' : 'will hide'} sold ${ref}`)
  if (write) await db.collection('products').updateOne({ ref }, { $set: { active: false, updatedAt: now } })
}

if (!write) console.log('\nDry run. Add --write to insert.')
await client.close()
