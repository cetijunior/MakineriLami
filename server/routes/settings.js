import { route, send, readBody, requireAdmin, PUBLIC_CACHE, NO_CACHE } from '../lib/http.js'
import { getSettings, updateSettings } from '../lib/store.js'

export default route({
  GET: async (req, res) => send(res, 200, await getSettings(), PUBLIC_CACHE),
  PUT: async (req, res) => {
    requireAdmin(req)
    send(res, 200, await updateSettings(await readBody(req)), NO_CACHE)
  },
})
