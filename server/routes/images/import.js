/**
 * Import a photo from a link: an Instagram post/reel, a TikTok video, or a
 * direct image URL. The image is downloaded and stored in MongoDB, because
 * Instagram and TikTok CDN links expire after a few days and block hotlinking.
 */
import { route, send, readBody, requireAdmin, NO_CACHE } from '../../lib/http.js'
import { saveImage, StoreError } from '../../lib/store.js'

const UA_BOT = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
const UA_BROWSER =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
const MAX = 4 * 1024 * 1024

async function fetchWithTimeout(url, opts = {}, ms = 9000) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), ms)
  try {
    return await fetch(url, { ...opts, signal: ctl.signal, redirect: 'follow' })
  } finally {
    clearTimeout(t)
  }
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

function metaImage(html) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m) return decode(m[1])
  }
  return ''
}

async function resolveImageUrl(input) {
  let u
  try {
    u = new URL(input)
  } catch {
    throw new StoreError('Linku nuk është i vlefshëm.')
  }
  if (!/^https?:$/.test(u.protocol)) throw new StoreError('Lejohen vetëm linke http/https.')

  const host = u.hostname.replace(/^www\./, '')

  // TikTok: public oEmbed returns the video cover
  if (host.endsWith('tiktok.com')) {
    const r = await fetchWithTimeout(`https://www.tiktok.com/oembed?url=${encodeURIComponent(u.href)}`)
    if (r.ok) {
      const j = await r.json().catch(() => ({}))
      if (j.thumbnail_url) return j.thumbnail_url
    }
  }

  // Instagram / Facebook / anything with an HTML page: read og:image
  const head = await fetchWithTimeout(u.href, {
    headers: {
      'User-Agent': host.includes('instagram.com') || host.includes('facebook.com') ? UA_BOT : UA_BROWSER,
      Accept: 'text/html,image/*;q=0.9,*/*;q=0.8',
    },
  })
  const type = head.headers.get('content-type') || ''
  if (type.startsWith('image/')) return u.href

  if (!head.ok) throw new StoreError(`Faqja u përgjigj me ${head.status}. Provoni linkun direkt të fotos.`, 422)
  const html = await head.text()
  const img = metaImage(html)
  if (!img) {
    throw new StoreError(
      'Nuk u gjet foto te ky link. Postimi mund të jetë privat. Provoni ta ngarkoni fotografinë direkt.',
      422,
    )
  }
  return new URL(img, u.href).href
}

export default route({
  POST: async (req, res) => {
    requireAdmin(req)
    const { url } = await readBody(req)
    if (!url) throw new StoreError('Linku mungon.')

    const imageUrl = await resolveImageUrl(String(url).trim())
    const r = await fetchWithTimeout(imageUrl, { headers: { 'User-Agent': UA_BROWSER, Accept: 'image/*' } }, 12000)
    if (!r.ok) throw new StoreError('Fotoja nuk u shkarkua. Provoni ta ngarkoni direkt.', 422)

    const contentType = (r.headers.get('content-type') || '').split(';')[0]
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) {
      throw new StoreError('Linku nuk çon në një foto JPEG, PNG ose WebP.', 415)
    }
    const buf = Buffer.from(await r.arrayBuffer())
    if (buf.length > MAX) throw new StoreError('Fotoja është mbi 4 MB. Ngarkojeni direkt që të kompresohet.', 413)

    const saved = await saveImage({
      data: buf.toString('base64'),
      contentType,
      name: `import:${String(url).slice(0, 100)}`,
    })
    send(res, 201, { ...saved, source: imageUrl }, NO_CACHE)
  },
})
