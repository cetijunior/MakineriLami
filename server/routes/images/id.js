import { route, send, queryOf, requireAdmin, NO_CACHE } from '../../lib/http.js'
import { readImage, deleteImage } from '../../lib/store.js'

export default route({
  GET: async (req, res) => {
    const img = await readImage(queryOf(req).id)
    if (!img) return send(res, 404, { error: 'Fotoja nuk u gjet.' })
    res.statusCode = 200
    res.setHeader('Content-Type', img.contentType)
    res.setHeader('Content-Length', img.buffer.length)
    // image ids are immutable, so cache forever
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.end(img.buffer)
  },
  DELETE: async (req, res) => {
    requireAdmin(req)
    send(res, 200, await deleteImage(queryOf(req).id), NO_CACHE)
  },
})
