import { route, send, readBody, requireAdmin, NO_CACHE } from '../_lib/http.js'
import { saveImage } from '../_lib/store.js'

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } }

export default route({
  POST: async (req, res) => {
    requireAdmin(req)
    const { data, contentType, name } = await readBody(req)
    const allowed = ['image/webp', 'image/jpeg', 'image/png']
    if (!allowed.includes(contentType)) return send(res, 415, { error: 'Lejohen vetëm WebP, JPEG ose PNG.' })
    send(res, 201, await saveImage({ data, contentType, name }), NO_CACHE)
  },
})
