import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Dev-only: serve the Vercel functions in /api from the Vite dev server,
 * with the same file routing Vercel uses (static file > index > [param]).
 * In production Vercel runs these files natively.
 */
function vercelApiDev() {
  const apiDir = path.resolve(import.meta.dirname, 'api')

  function resolve(urlPath) {
    const parts = urlPath.replace(/^\/api\/?/, '').split('/').filter(Boolean)
    const direct = path.join(apiDir, ...parts) + '.js'
    if (parts.length && fs.existsSync(direct)) return { file: direct, params: {} }
    const index = path.join(apiDir, ...parts, 'index.js')
    if (fs.existsSync(index)) return { file: index, params: {} }
    if (parts.length) {
      const dir = path.join(apiDir, ...parts.slice(0, -1))
      if (fs.existsSync(dir)) {
        const dyn = fs.readdirSync(dir).find((f) => /^\[.+\]\.js$/.test(f))
        if (dyn) {
          return { file: path.join(dir, dyn), params: { [dyn.slice(1, -4)]: decodeURIComponent(parts.at(-1)) } }
        }
      }
    }
    return null
  }

  return {
    name: 'vercel-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()
        const url = new URL(req.url, 'http://localhost')
        const hit = resolve(url.pathname)
        if (!hit) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Not found' }))
        }
        try {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const raw = Buffer.concat(chunks).toString('utf8')
          let body = {}
          if (raw) {
            try { body = JSON.parse(raw) } catch { body = raw }
          }
          req.body = body
          req.query = { ...Object.fromEntries(url.searchParams), ...hit.params }
          const mod = await server.ssrLoadModule(hit.file)
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // expose .env / .env.local to the dev API (MONGODB_URI, ADMIN_PASSWORD)
  const env = loadEnv(mode, process.cwd(), '')
  for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v

  return {
    plugins: [react(), vercelApiDev()],
  }
})
