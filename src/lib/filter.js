/** Accent-insensitive, multi-word product search + filters. */
const norm = (s) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function filterProducts(products, { category, stock, query }) {
  const q = norm(query).trim()
  const words = q ? q.split(/\s+/) : []
  return products.filter((p) => {
    if (category && p.category !== category) return false
    if (stock && stock !== 'all' && p.stock !== stock) return false
    if (!words.length) return true
    const hay = norm([p.name, p.short, p.ref, ...(p.tags || [])].join(' '))
    return words.every((w) => hay.includes(w))
  })
}
