import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore, STOCK } from '../lib/store.jsx'
import { waLink } from '../lib/api.js'
import { Icon, WaIcon, SearchIcon, ZoomIcon } from '../lib/icons.jsx'
import { filterProducts } from '../lib/filter.js'

export function PhTile({ icon, label = true }) {
  return (
    <div className="ph-tile">
      <Icon name={icon || 'gear'} />
      {label && <em>Foto sipas kërkesës</em>}
    </div>
  )
}

export function ProductCard({ p }) {
  const { settings: s, cart, add } = useStore()
  const st = STOCK[p.stock] || STOCK.stok
  const inCart = cart[p.ref] || 0
  const img = p.images?.[0]

  return (
    <article className="card">
      <Link className="card-img" to={`/p/${encodeURIComponent(p.ref)}`} aria-label={`Detaje: ${p.name}`} preventScrollReset>
        {img ? <img src={img} alt={p.name} loading="lazy" /> : <PhTile icon={p.icon} />}
        <span className={`badge ${st.cls}`}>{st.label}</span>
        <span className="zoom"><ZoomIcon /></span>
      </Link>
      <div className="card-body">
        <span className="card-ref">{p.ref}</span>
        <h3>{p.name}</h3>
        {p.short && <p>{p.short}</p>}
        {p.tags?.length > 0 && (
          <div className="card-meta">
            {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
        )}
        <div className="card-foot">
          <span className="price">Çmimi me kontakt<em>Përgjigje brenda 24h</em></span>
          <a
            className="icon-btn"
            href={waLink(s.whatsapp, `Përshëndetje! Më intereson ${p.name} [${p.ref}]. Sa kushton?`)}
            target="_blank"
            rel="noopener"
            aria-label={`Pyet në WhatsApp për ${p.name}`}
          >
            <WaIcon />
          </a>
          <button className={`btn btn-y add${inCart ? ' in' : ''}`} onClick={() => add(p.ref)}>
            {inCart ? `Në listë · ${inCart}` : 'Shto në kërkesë'}
          </button>
        </div>
      </div>
    </article>
  )
}

export function Catalogue({ query, onQuery, category, stock, onStock }) {
  const { products, categories, loading, settings: s } = useStore()
  const list = useMemo(() => filterProducts(products, { category, stock, query }), [products, category, stock, query])
  const title = categories.find((c) => c.slug === category)?.label || 'Të gjitha artikujt'

  return (
    <section className="sec" id="katalog">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <span className="kicker">Katalogu</span>
            <h2>{title}</h2>
            <p>Çmimi jepet me kontakt sepse varet nga gjendja dhe sasia. Shtoni sa artikuj të doni dhe dërgojini të gjithë me një mesazh.</p>
          </div>
          <a className="btn btn-o" href="#si-funksionon">Si funksionon</a>
        </div>

        <label className="msearch rv">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Kërko: kovë, CAT 330, cilindër…"
            aria-label="Kërko në katalog"
          />
        </label>

        <div className="shop-bar rv">
          <span className="res" aria-live="polite"><b>{list.length}</b> artikuj</span>
          <div className="filters" role="group" aria-label="Gjendja">
            {[['all', 'Të gjitha'], ['stok', 'Në stok'], ['makine', 'Makineri'], ['porosi', 'Me kërkesë']].map(([k, l]) => (
              <button key={k} className={`fbtn${stock === k ? ' on' : ''}`} onClick={() => onStock(k)} aria-pressed={stock === k}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {loading && products.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => <div key={i} className="card sk skeleton" />)
          ) : list.length ? (
            list.map((p) => <ProductCard key={p._id || p.ref} p={p} />)
          ) : (
            <div className="empty">
              <h3>Asgjë me këtë kërkim</h3>
              <p>Stoku ndryshon çdo javë. Na shkruani çfarë ju duhet dhe e kërkojmë për ju.</p>
              <a className="btn btn-g" href={waLink(s.whatsapp, `Përshëndetje! Po kërkoj: ${query}`)} target="_blank" rel="noopener">
                Pyet në WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
