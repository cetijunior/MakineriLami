/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from './api.js'
import { CATEGORIES, PRODUCTS, SETTINGS } from '../../shared/seed.js'

const StoreCtx = createContext(null)

/** Built-in catalogue: shown instantly and used if the API is unreachable. */
const FALLBACK = {
  categories: CATEGORIES.map((c, i) => ({ ...c, _id: `seed-cat-${i}` })),
  products: PRODUCTS.map((p, i) => ({ ...p, _id: `seed-prod-${i}` })),
  settings: SETTINGS,
}

const CART_KEY = 'ml-inquiry-v2'

export function StoreProvider({ children }) {
  const [catalog, setCatalog] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY))
      return raw && typeof raw === 'object' ? raw : {}
    } catch {
      return {}
    }
  })
  const [trayOpen, setTrayOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  useEffect(() => {
    const ctl = new AbortController()
    api('/catalog', { signal: ctl.signal })
      .then((data) => {
        if (data?.products && data?.categories) {
          setCatalog({
            categories: data.categories,
            products: data.products,
            settings: { ...SETTINGS, ...(data.settings || {}) },
          })
        }
      })
      .catch(() => { /* keep fallback */ })
      .finally(() => setLoading(false))
    return () => ctl.abort()
  }, [])

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch { /* private mode */ }
  }, [cart])

  const byRef = useMemo(() => {
    const m = new Map()
    for (const p of catalog.products) m.set(p.ref, p)
    return m
  }, [catalog.products])

  const notify = useCallback((msg, kind = 'info') => {
    clearTimeout(toastTimer.current)
    setToast({ msg, kind })
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const add = useCallback((ref) => {
    setCart((c) => ({ ...c, [ref]: (c[ref] || 0) + 1 }))
    const p = byRef.get(ref)
    if (p) notify(p.name, 'add')
  }, [byRef, notify])

  const setQty = useCallback((ref, n) => {
    setCart((c) => {
      const next = { ...c }
      if (n <= 0) delete next[ref]
      else next[ref] = Math.min(n, 99)
      return next
    })
  }, [])

  const clear = useCallback(() => setCart({}), [])

  // only count items that still exist in the catalogue
  const lines = useMemo(
    () => Object.entries(cart).filter(([ref, q]) => q > 0 && byRef.has(ref)).map(([ref, qty]) => ({ product: byRef.get(ref), qty })),
    [cart, byRef],
  )
  const count = lines.reduce((n, l) => n + l.qty, 0)

  const value = {
    ...catalog,
    loading,
    byRef,
    cart,
    lines,
    count,
    add,
    setQty,
    clear,
    trayOpen,
    openTray: () => setTrayOpen(true),
    closeTray: () => setTrayOpen(false),
    toast,
    notify,
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)

export const STOCK = {
  stok: { cls: 'b-stok', label: 'Në stok' },
  porosi: { cls: 'b-porosi', label: 'Me kërkesë' },
  makine: { cls: 'b-makine', label: 'Makineri' },
}

/** Locks body scroll while any overlay is open. */
export function useBodyLock(active) {
  useEffect(() => {
    if (!active) return
    document.body.classList.add('lock')
    return () => document.body.classList.remove('lock')
  }, [active])
}

/** Adds .in to .rv elements as they scroll into view. */
export function useReveal(deps = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.rv:not(.in)'))
    if (!('IntersectionObserver' in window) || new URLSearchParams(location.search).has('shot')) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
