import { route, send, NO_CACHE } from './_lib/http.js'
import { getDb, hasDb } from './_lib/db.js'

export default route({
  GET: async (req, res) => {
    const configured = hasDb()
    let connected = false
    if (configured) connected = Boolean(await getDb())
    send(res, 200, {
      ok: true,
      database: { configured, connected },
      admin: { passwordSet: Boolean(process.env.ADMIN_PASSWORD) },
    }, NO_CACHE)
  },
})
