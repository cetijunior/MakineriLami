/* global process */
/**
 * Cloudflare Pages Function for every /api/* request.
 *
 * Bridges the Fetch API to the existing Node-style router (server/router.js):
 * route files keep using res.statusCode / res.setHeader / res.end, and this
 * adapter collects that into a Response. D1 and R2 bindings are handed to the
 * data layer per request.
 */
import router from '../../server/router.js'
import { setBindings } from '../../server/lib/db.js'

export async function onRequest({ request, env }) {
  setBindings(env)
  for (const k of ['ADMIN_PASSWORD', 'ADMIN_SECRET']) if (typeof env[k] === 'string') process.env[k] = env[k]

  const url = new URL(request.url)
  const headers = Object.fromEntries(request.headers)
  let body = {}
  if (!['GET', 'HEAD'].includes(request.method)) {
    const raw = await request.text()
    if (raw) {
      try { body = JSON.parse(raw) } catch { body = raw }
    }
  }
  const req = { method: request.method, url: url.pathname + url.search, headers, body, socket: {} }

  return new Promise((resolve) => {
    const out = new Headers()
    const res = {
      statusCode: 200,
      setHeader: (k, v) => out.set(k, String(v)),
      getHeader: (k) => out.get(k),
      end: (chunk) => resolve(new Response(request.method === 'HEAD' ? null : chunk ?? null, { status: res.statusCode, headers: out })),
    }
    Promise.resolve(router(req, res)).catch((err) => {
      console.error('[api]', err)
      resolve(Response.json({ error: 'Gabim në server.' }, { status: 500 }))
    })
  })
}
