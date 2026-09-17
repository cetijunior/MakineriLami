import { route, send, requireAdmin, NO_CACHE } from '../../lib/http.js'
import { hasDb, getDb } from '../../lib/db.js'

export default route({
  GET: async (req, res) => {
    requireAdmin(req)
    const configured = hasDb()
    const connected = configured ? Boolean(await getDb()) : false
    send(res, 200, { ok: true, database: { configured, connected } }, NO_CACHE)
  },
})
