import { useEffect, useRef } from 'react'
import { useStore } from '../lib/store.jsx'
import { waLink } from '../lib/api.js'
import { Icon, WaIcon, CheckIcon } from '../lib/icons.jsx'

export function Hero({ onCategory }) {
  const { settings: s, categories, products } = useStore()
  const vid = useRef(null)

  useEffect(() => {
    const v = vid.current
    if (!v) return
    v.play().catch(() => {})
    const vis = () => (document.hidden ? v.pause() : v.play().catch(() => {}))
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [s.heroVideo])

  const countFor = (slug) => (slug ? products.filter((p) => p.category === slug).length : products.length)
  const tiles = [{ slug: '', label: 'Të gjitha', icon: 'grid' }, ...categories]

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-card">
          {s.heroVideo ? (
            <video ref={vid} key={s.heroVideo} autoPlay muted loop playsInline preload="metadata" poster={s.heroPoster}>
              <source src={s.heroVideo} type="video/mp4" />
            </video>
          ) : (
            s.heroPoster && <img src={s.heroPoster} alt="" />
          )}
          <div className="hero-grain" />
          <div className="hero-in">
            {s.heroEyebrow && <span className="pill-tag">{s.heroEyebrow}</span>}
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
            <div className="hero-mini">
              <div><CheckIcon />Foto reale, jo katalog</div>
              <div><CheckIcon />Përgjigje brenda 24 orësh</div>
              <div><CheckIcon />Transport në gjithë Shqipërinë</div>
            </div>
          </div>
        </div>

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
