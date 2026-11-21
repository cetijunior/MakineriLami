import { Link } from 'react-router-dom'
import { useStore } from '../lib/store.jsx'
import { waLink, telHref } from '../lib/api.js'
import { Icon, WaIcon } from '../lib/icons.jsx'

/**
 * Magazine-cover hero: real photos of what is in the yard right now (the
 * featured products), numbered the same way as the "Në vëmendje" section.
 */
export function Hero({ onCategory }) {
  const { settings: s, categories, products } = useStore()

  const featured = products.filter((p) => p.featured && p.images?.length).slice(0, 3)
  const countFor = (slug) => (slug ? products.filter((p) => p.category === slug).length : products.length)
  const tiles = [{ slug: '', label: 'Të gjitha', icon: 'grid' }, ...categories]

  return (
    <section className="hero" id="top">
      <div className="cover">
        <div className="cover-txt">
          {s.heroEyebrow && <span className="kicker">{s.heroEyebrow}</span>}
          <h1>
            {s.heroTitle} {s.heroTitleAccent && <em>{s.heroTitleAccent}</em>}
          </h1>
          {s.heroLead && <p className="lead">{s.heroLead}</p>}
          <div className="hero-cta">
            <a className="btn btn-y" href="#katalog">
              <Icon name="grid" strokeWidth={2.2} />Shfleto katalogun
            </a>
            <a
              className="btn btn-gh"
              href={waLink(s.whatsapp, `Përshëndetje ${s.businessName}! Po kërkoj një pjesë.`)}
              target="_blank"
              rel="noopener"
            >
              <WaIcon />Kërko një pjesë
            </a>
          </div>
          <dl className="cover-facts">
            <div><dt>Në fushë</dt><dd>{products.length} artikuj</dd></div>
            {s.address && <div><dt>Ku</dt><dd>{s.address}</dd></div>}
            {s.phone && <div><dt>Tel / WhatsApp</dt><dd><a href={telHref(s.phone)}>{s.phone}</a></dd></div>}
          </dl>
        </div>

        <div className={`cover-pics n${featured.length || 1}`}>
          {featured.length ? (
            featured.map((p, i) => (
              <Link key={p.ref} className="cover-pic" to={`/p/${encodeURIComponent(p.ref)}`} preventScrollReset>
                <img src={p.images[0]} alt={p.name} loading="eager" />
                <span className="cover-lab">
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <span>{p.name}</span>
                </span>
              </Link>
            ))
          ) : (
            s.heroPoster && <div className="cover-pic"><img src={s.heroPoster} alt="" /></div>
          )}
        </div>
      </div>
      <div className="hazard" aria-hidden="true" />

      <div className="wrap">
        <div className="tiles">
          {tiles.map((c) => (
            <button key={c.slug || 'all'} className="tile" onClick={() => onCategory(c.slug)}>
              <span className="ic"><Icon name={c.icon} /></span>
              <b>{c.label}</b>
              <em>{countFor(c.slug)} artikuj</em>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
