/** Thin fetch wrapper for the /api functions. */
const TOKEN_KEY = 'ml-admin-token'

export const token = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' } },
  set: (t) => { try { localStorage.setItem(TOKEN_KEY, t) } catch { /* private mode */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY) } catch { /* private mode */ } },
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function api(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) headers.Authorization = `Bearer ${token.get()}`

  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new ApiError('Nuk ka lidhje me serverin. Kontrolloni internetin.', 0)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && auth) token.clear()
    throw new ApiError(data.error || `Gabim ${res.status}`, res.status)
  }
  return data
}

export const waLink = (number, text) =>
  `https://wa.me/${String(number || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`

export const telHref = (phone) => `tel:${String(phone || '').replace(/[^+0-9]/g, '')}`
