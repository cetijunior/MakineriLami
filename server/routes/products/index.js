import { route, send, readBody, queryOf, requireAdmin, PUBLIC_CACHE, NO_CACHE } from '../../lib/http.js'
import { listProducts, createProduct } from '../../lib/store.js'

export default route({
  GET: async (req, res) => {
    const all = queryOf(req).all === '1'
    if (all) {
      requireAdmin(req)
      return send(res, 200, await listProducts({ includeInactive: true }), NO_CACHE)
    }
    send(res, 200, await listProducts(), PUBLIC_CACHE)
  },
  POST: async (req, res) => {
    requireAdmin(req)
    send(res, 201, await createProduct(await readBody(req)), NO_CACHE)
  },
})
