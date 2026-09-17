import { route, send, readBody, queryOf, requireAdmin, NO_CACHE } from '../../lib/http.js'
import { updateCategory, deleteCategory } from '../../lib/store.js'

export default route({
  PUT: async (req, res) => {
    requireAdmin(req)
    send(res, 200, await updateCategory(queryOf(req).id, await readBody(req)), NO_CACHE)
  },
  DELETE: async (req, res) => {
    requireAdmin(req)
    const q = queryOf(req)
    send(res, 200, await deleteCategory(q.id, { moveTo: q.moveTo || '' }), NO_CACHE)
  },
})
