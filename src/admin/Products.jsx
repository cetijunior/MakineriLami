import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { STOCK } from '../lib/store.jsx'
import { SearchIcon } from '../lib/icons.jsx'
import { PhTile } from '../components/Catalogue.jsx'
import { filterProducts } from '../lib/filter.js'
import { useAdmin, Confirm } from './Admin.jsx'

const Arrow = ({ up }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={up ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'} /></svg>
)
const Trash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
)
const Star = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" /></svg>
)
const Eye = ({ off }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" />{off && <path d="M4 4l16 16" />}</svg>
)

export default function Products() {
  const { products, setProducts, categories, notify, loading, readOnly } = useAdmin()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [stock, setStock] = useState('all')
  const [status, setStatus] = useState('all')
  const [del, setDel] = useState(null)
  const [busy, setBusy] = useState(false)

  const list = useMemo(() => {
    let rows = filterProducts(products, { category: cat, stock, query: q })
    if (status === 'active') rows = rows.filter((p) => p.active !== false)
    if (status === 'hidden') rows = rows.filter((p) => p.active === false)
    if (status === 'featured') rows = rows.filter((p) => p.featured)
    return rows
  }, [products, q, cat, stock, status])

  const filtered = q || cat || stock !== 'all' || status !== 'all'
  const catLabel = (slug) => categories.find((c) => c.slug === slug)?.label || <span style={{ color: '#C0392B' }}>Pa kategori</span>

  const patch = async (p, changes, okMsg) => {
    const prev = products
    setProducts((all) => all.map((x) => (x._id === p._id ? { ...x, ...changes } : x)))
    try {
      await api(`/products/${p._id}`, { method: 'PUT', auth: true, body: changes })
      if (okMsg) notify(okMsg)
    } catch (e) {
      setProducts(prev)
      notify(e.message, 'err')
    }
  }

  const move = async (index, dir) => {
    const j = index + dir
    if (j < 0 || j >= products.length) return
    const next = [...products]
    ;[next[index], next[j]] = [next[j], next[index]]
    const prev = products
    setProducts(next.map((p, i) => ({ ...p, order: i + 1 })))
    try {
      await api('/products/reorder', { method: 'POST', auth: true, body: { ids: next.map((p) => p._id) } })
    } catch (e) {
      setProducts(prev)
      notify(e.message, 'err')
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await api(`/products/${del._id}`, { method: 'DELETE', auth: true })
      setProducts((all) => all.filter((x) => x._id !== del._id))
      notify(`"${del.name}" u fshi`)
      setDel(null)
    } catch (e) {
      notify(e.message, 'err')
    } finally {
      setBusy(false)
    }
  }

  const stats = [
    [products.length, 'Artikuj gjithsej'],
    [products.filter((p) => p.active !== false).length, 'Të dukshëm'],
    [products.filter((p) => p.stock === 'stok').length, 'Në stok'],
    [categories.length, 'Kategori'],
  ]

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Artikujt</h1>
          <p>Shtoni, ndryshoni, fshihni ose renditni artikujt e dyqanit.</p>
        </div>
        <div className="adm-actions">
          <Link className="btn btn-y" to="/admin/artikull/i-ri" aria-disabled={readOnly}>
            + Shto artikull
          </Link>
        </div>
      </div>

      <div className="stats">
        {stats.map(([n, l]) => <div className="stat" key={l}><b>{loading ? '–' : n}</b><span>{l}</span></div>)}
      </div>

      <div className="tbar">
        <label className="hsearch">
          <SearchIcon />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kërko sipas emrit, kodit ose etiketës…" />
        </label>
        <select className="sel" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kategoria">
          <option value="">Të gjitha kategoritë</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <select className="sel" value={stock} onChange={(e) => setStock(e.target.value)} aria-label="Gjendja">
          <option value="all">Çdo gjendje</option>
          {Object.entries(STOCK).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Statusi">
          <option value="all">Të gjitha</option>
          <option value="active">Të dukshëm</option>
          <option value="hidden">Të fshehur</option>
          <option value="featured">Të veçantë</option>
        </select>
      </div>

      <div className="ptable">
        <div className="prow head">
          <span />
          <span>Artikulli</span>
          <span className="pcat">Kategoria</span>
          <span className="pst">Gjendja</span>
          <span style={{ textAlign: 'right' }}>Veprime</span>
        </div>

        {loading && <div className="prow"><span /><span className="muted">Duke ngarkuar…</span></div>}
        {!loading && list.length === 0 && (
          <div className="prow"><span /><span className="muted">{filtered ? 'Asnjë artikull me këto filtra.' : 'Nuk ka artikuj ende.'}</span></div>
        )}

        {list.map((p) => {
          const i = products.findIndex((x) => x._id === p._id)
          const st = STOCK[p.stock] || STOCK.stok
          const hidden = p.active === false
          return (
            <div className={`prow${hidden ? ' off' : ''}`} key={p._id}>
              <Link className="pthumb" to={`/admin/artikull/${p._id}`}>
                {p.images?.[0] ? <img src={p.images[0]} alt="" loading="lazy" /> : <PhTile icon={p.icon} />}
              </Link>
              <div className="pname">
                <Link to={`/admin/artikull/${p._id}`}>{p.name}</Link>
                <small>{p.ref}{hidden ? ' · I FSHEHUR' : ''}{p.featured ? ' · I VEÇANTË' : ''}</small>
              </div>
              <span className="pcat">{catLabel(p.category)}</span>
              <span className="pst"><span className={`tagp ${p.stock === 'stok' ? 'y' : p.stock === 'makine' ? 'dk' : 'mute'}`}>{st.label}</span></span>
              <div className="pact">
                {!filtered && (
                  <>
                    <button className="ib hide-sm" onClick={() => move(i, -1)} disabled={readOnly || i === 0} aria-label="Lart"><Arrow up /></button>
                    <button className="ib hide-sm" onClick={() => move(i, 1)} disabled={readOnly || i === products.length - 1} aria-label="Poshtë"><Arrow /></button>
                  </>
                )}
                <button
                  className={`ib hide-sm${p.featured ? ' on' : ''}`}
                  onClick={() => patch(p, { featured: !p.featured }, p.featured ? 'U hoq nga të veçantët' : 'U shtua te të veçantët')}
                  disabled={readOnly}
                  aria-label="I veçantë"
                  title="Shfaq te seksioni 'Në shitje sot'"
                ><Star /></button>
                <button
                  className="ib"
                  onClick={() => patch(p, { active: hidden }, hidden ? 'Artikulli u shfaq' : 'Artikulli u fsheh')}
                  disabled={readOnly}
                  aria-label={hidden ? 'Shfaq' : 'Fshih'}
                  title={hidden ? 'Shfaq në dyqan' : 'Fshih nga dyqani'}
                ><Eye off={hidden} /></button>
                <button className="ib danger" onClick={() => setDel(p)} disabled={readOnly} aria-label="Fshi"><Trash /></button>
              </div>
            </div>
          )
        })}
      </div>
      {filtered && <p className="muted" style={{ fontSize: 13.5, marginTop: 10 }}>Renditja me shigjeta aktivizohet kur hiqni filtrat.</p>}

      {del && (
        <Confirm
          title="Ta fshij artikullin?"
          text={`"${del.name}" (${del.ref}) do të hiqet përgjithmonë. Nëse vetëm është shitur përkohësisht, më mirë fshiheni me ikonën e syrit.`}
          onCancel={() => setDel(null)}
          onConfirm={remove}
          busy={busy}
        />
      )}
    </>
  )
}
