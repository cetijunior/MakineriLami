import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only: send /api/* to the same router the Vercel function uses.
 * In production Vercel rewrites /api/* to api/index.js (see vercel.json).
 */
function apiDev() {
  return {
    name: 'api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()
        try {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const raw = Buffer.concat(chunks).toString('utf8')
          let body = {}
          if (raw) {
            try { body = JSON.parse(raw) } catch { body = raw }
          }
          req.body = body
          const { default: router } = await server.ssrLoadModule('/server/router.js')
          await router(req, res)
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
    plugins: [react(), apiDev()],
  }
})
