import { route, send, readBody, requireAdmin, NO_CACHE } from '../../lib/http.js'
import { reorderProducts } from '../../lib/store.js'

export default route({
  POST: async (req, res) => {
    requireAdmin(req)
    const { ids } = await readBody(req)
    send(res, 200, await reorderProducts(ids), NO_CACHE)
  },
})
