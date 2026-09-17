import { route, send, readBody, checkPassword, signToken, NO_CACHE } from '../../lib/http.js'

// naive per-instance throttle against password guessing
const attempts = new Map()

export default route({
  POST: async (req, res) => {
    if (!process.env.ADMIN_PASSWORD) {
      return send(res, 503, { error: 'ADMIN_PASSWORD nuk është vendosur në Vercel.' }, NO_CACHE)
    }
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'x').split(',')[0]
    const a = attempts.get(ip) || { n: 0, t: Date.now() }
    if (Date.now() - a.t > 15 * 60 * 1000) { a.n = 0; a.t = Date.now() }
    if (a.n >= 10) return send(res, 429, { error: 'Shumë tentativa. Provoni pas 15 minutash.' }, NO_CACHE)

    const { password } = await readBody(req)
    if (!checkPassword(password)) {
      a.n += 1
      attempts.set(ip, a)
      return send(res, 401, { error: 'Fjalëkalim i gabuar.' }, NO_CACHE)
    }
    attempts.delete(ip)
    send(res, 200, { token: signToken() }, NO_CACHE)
  },
})
