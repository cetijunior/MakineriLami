import { route, send, readBody, queryOf, requireAdmin, NO_CACHE } from '../../lib/http.js'
import { getProduct, updateProduct, deleteProduct, StoreError } from '../../lib/store.js'

export default route({
  GET: async (req, res) => {
    const p = await getProduct(queryOf(req).id)
    // hidden products are only visible to the admin
    let admin = false
    if (p && p.active === false) {
      try { requireAdmin(req); admin = true } catch { admin = false }
    }
    if (!p || (p.active === false && !admin)) throw new StoreError('Artikulli nuk u gjet.', 404)
    send(res, 200, p, NO_CACHE)
  },
  PUT: async (req, res) => {
    requireAdmin(req)
    send(res, 200, await updateProduct(queryOf(req).id, await readBody(req)), NO_CACHE)
  },
  DELETE: async (req, res) => {
    requireAdmin(req)
    send(res, 200, await deleteProduct(queryOf(req).id), NO_CACHE)
  },
})
