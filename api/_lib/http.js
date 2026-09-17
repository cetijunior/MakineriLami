/**
 * Small helpers shared by every API route: JSON responses, body parsing,
 * error mapping and admin auth (single password, HMAC-signed token).
 */
import crypto from 'node:crypto'
import { StoreError } from './store.js'

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function send(res, status, body, headers = {}) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  res.end(JSON.stringify(body))
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}') } catch { return {} }
  }
  const chunks = []
  for await (const c of req) chunks.push(c)
  const raw = Buffer.concat(chunks).toString('utf8')
  try { return JSON.parse(raw || '{}') } catch { return {} }
}

export function queryOf(req) {
  if (req.query) return req.query
  const u = new URL(req.url, 'http://x')
  return Object.fromEntries(u.searchParams)
}

/** Wraps a handler so thrown StoreErrors become clean JSON errors. */
export function route(methods) {
  return async (req, res) => {
    const fn = methods[req.method]
    if (!fn) {
      res.setHeader('Allow', Object.keys(methods).join(', '))
      return send(res, 405, { error: 'Metodë e palejuar.' })
    }
    try {
      await fn(req, res)
    } catch (err) {
      if (err instanceof StoreError || err?.status) {
        return send(res, err.status || 400, { error: err.message })
      }
      console.error('[api]', req.method, req.url, err)
      return send(res, 500, { error: 'Gabim në server. Provoni përsëri.' })
    }
  }
}

/* ------------------------------------------------------------------ auth */

function secret() {
  // Signing key: dedicated secret if set, otherwise derived from the password
  // so changing ADMIN_PASSWORD logs everyone out.
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || ''
  return crypto.createHash('sha256').update(`ml-admin:${s}`).digest()
}

const b64url = (buf) => Buffer.from(buf).toString('base64url')

export function signToken() {
  const payload = b64url(JSON.stringify({ sub: 'admin', exp: Date.now() + TOKEN_TTL_MS }))
  const sig = b64url(crypto.createHmac('sha256', secret()).update(payload).digest())
  return `${payload}.${sig}`
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false
  const [payload, sig] = token.split('.')
  const expected = b64url(crypto.createHmac('sha256', secret()).update(payload).digest())
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return data.exp > Date.now()
  } catch {
    return false
  }
}

export function checkPassword(input) {
  const pw = process.env.ADMIN_PASSWORD || ''
  if (!pw) return false
  const a = crypto.createHash('sha256').update(String(input || '')).digest()
  const b = crypto.createHash('sha256').update(pw).digest()
  return crypto.timingSafeEqual(a, b)
}

export function requireAdmin(req) {
  if (!process.env.ADMIN_PASSWORD) {
    const e = new Error('ADMIN_PASSWORD nuk është vendosur në Vercel. Paneli është i çaktivizuar.')
    e.status = 503
    throw e
  }
  const h = req.headers?.authorization || req.headers?.Authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  if (!verifyToken(token)) {
    const e = new Error('Sesioni ka skaduar. Hyni përsëri.')
    e.status = 401
    throw e
  }
}

/**
 * Public catalogue responses are never cached: when the owner saves in the
 * panel, the shop must show it on the next page load. Traffic is small, so a
 * fresh query per visit is cheap.
 */
export const PUBLIC_CACHE = { 'Cache-Control': 'no-store' }
export const NO_CACHE = { 'Cache-Control': 'no-store' }
