import { route, send, readBody, queryOf, requireAdmin, PUBLIC_CACHE, NO_CACHE } from '../../lib/http.js'
import { listCategories, createCategory } from '../../lib/store.js'

export default route({
  GET: async (req, res) => {
    if (queryOf(req).all === '1') {
      requireAdmin(req)
      return send(res, 200, await listCategories({ includeInactive: true }), NO_CACHE)
    }
    send(res, 200, await listCategories(), PUBLIC_CACHE)
  },
  POST: async (req, res) => {
    requireAdmin(req)
    send(res, 201, await createCategory(await readBody(req)), NO_CACHE)
  },
})
