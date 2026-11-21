/**
 * One entry point for every /api route, called by the Cloudflare Pages
 * Function functions/api/[[path]].js (and by the Vite dev plugin).
 * Route modules live in server/routes/.
 */
import catalog from './routes/catalog.js'
import health from './routes/health.js'
import settings from './routes/settings.js'
import login from './routes/auth/login.js'
import me from './routes/auth/me.js'
import products from './routes/products/index.js'
import productsReorder from './routes/products/reorder.js'
import productById from './routes/products/id.js'
import categories from './routes/categories/index.js'
import categoryById from './routes/categories/id.js'
import images from './routes/images/index.js'
import imagesImport from './routes/images/import.js'
import imageById from './routes/images/id.js'

// static paths win over :id, same as file routing
const ROUTES = [
  ['catalog', catalog],
  ['health', health],
  ['settings', settings],
  ['auth/login', login],
  ['auth/me', me],
  ['products', products],
  ['products/reorder', productsReorder],
  ['products/:id', productById],
  ['categories', categories],
  ['categories/:id', categoryById],
  ['images', images],
  ['images/import', imagesImport],
  ['images/:id', imageById],
]

function match(path) {
  const parts = path.split('/').filter(Boolean)
  let dynamic = null
  for (const [pattern, handler] of ROUTES) {
    const segs = pattern.split('/')
    if (segs.length !== parts.length) continue
    const params = {}
    const fits = segs.every((seg, i) => {
      if (seg.startsWith(':')) {
        params[seg.slice(1)] = decodeURIComponent(parts[i])
        return true
      }
      return seg === parts[i]
    })
    if (!fits) continue
    if (!Object.keys(params).length) return { handler, params }
    dynamic ??= { handler, params }
  }
  return dynamic
}

export default async function router(req, res) {
  const url = new URL(req.url, 'http://localhost')
  // ?__path= is kept for the old Vercel rewrite; Pages passes the real path
  const rawPath = url.searchParams.get('__path') ?? url.pathname.replace(/^\/api\/?/, '')
  url.searchParams.delete('__path')

  const hit = match(rawPath)
  if (!hit) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return res.end(JSON.stringify({ error: 'Nuk u gjet.' }))
  }
  req.query = { ...Object.fromEntries(url.searchParams), ...hit.params }
  return hit.handler(req, res)
}
