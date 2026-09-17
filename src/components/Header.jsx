import { useEffect, useState } from 'react'
import { useStore, useBodyLock } from '../lib/store.jsx'
import { waLink, telHref } from '../lib/api.js'
import {
  CartIcon, SearchIcon, MenuIcon, CloseIcon, WaIcon, PinIcon, ClockIcon, PhoneIcon,
} from '../lib/icons.jsx'

export function UtilBar() {
  const { settings: s } = useStore()
  return (
    <div className="util">
      <div className="wrap">
        <span><PinIcon />{s.address}</span>
        {s.hours && <span className="u-hide"><ClockIcon />{s.hours}</span>}
        <span className="u-r">
          {s.instagram && <a className="u-hide" href={s.instagram} target="_blank" rel="noopener">Instagram</a>}
          {s.tiktok && <a className="u-hide" href={s.tiktok} target="_blank" rel="noopener">TikTok</a>}
          <a href={telHref(s.phone)}><PhoneIcon />{s.phone}</a>
        </span>
      </div>
    </div>
  )
}

export function Header({ query, onQuery, category, onCategory }) {
  const { settings: s, categories, products, count, openTray } = useStore()
  const [stuck, setStuck] = useState(false)
  const [menu, setMenu] = useState(false)
  useBodyLock(menu)

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menu)
    const esc = (e) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [menu])

  const countFor = (slug) => (slug ? products.filter((p) => p.category === slug).length : products.length)
  const greet = `Përshëndetje ${s.businessName}! Ju shkruaj nga faqja juaj.`

  return (
    <>
      <header className={`head${stuck ? ' stuck' : ''}`}>
        <div className="wrap head-in">
          <a href="/" className="brand" aria-label={`${s.businessName}, kreu`}>
            <img src="/assets/logo.png" alt={`Logo ${s.businessName}`} width="46" height="46" />
            <b>{s.businessName}<span>{s.tagline}</span></b>
          </a>
          <label className="hsearch">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Kërko: kovë, CAT 330, cilindër, zinxhir…"
              aria-label="Kërko në katalog"
            />
          </label>
          <div className="head-act">
            <button className={`cart-btn${count ? ' has' : ''}`} onClick={openTray} aria-label="Hap listën e kërkesës">
              <CartIcon />
              <span className="lbl">Kërkesa</span>
              <span className="cnt">{count}</span>
            </button>
            <button className="burger" onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}>
              {menu ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        <nav className="catnav" aria-label="Kategoritë">
          <div className="wrap">
            <button className={`cn${!category ? ' on' : ''}`} onClick={() => onCategory('')}>
              Të gjitha<i>{countFor('')}</i>
            </button>
            {categories.map((c) => (
              <button key={c.slug} className={`cn${category === c.slug ? ' on' : ''}`} onClick={() => onCategory(c.slug)}>
                {c.label}<i>{countFor(c.slug)}</i>
              </button>
            ))}
            <a className="cn cn-wa" href={waLink(s.whatsapp, greet)} target="_blank" rel="noopener">
              <WaIcon />Pyet në WhatsApp
            </a>
          </div>
        </nav>
      </header>

      <div className="drawer" aria-hidden={!menu}>
        {[
          ['#katalog', 'Katalogu'],
          ['#makineri', 'Makineri'],
          ['#si-funksionon', 'Si funksionon'],
          ['#faq', 'Pyetje'],
          ['#kontakt', 'Kontakt'],
        ].map(([href, label], i) => (
          <a key={href} className="dl" href={href} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}>
            <i>{String(i + 1).padStart(2, '0')}</i>{label}
          </a>
        ))}
        <div className="dfoot">
          <a className="btn btn-g" href={waLink(s.whatsapp, greet)} target="_blank" rel="noopener" tabIndex={menu ? 0 : -1}>
            <WaIcon />WhatsApp
          </a>
          <a className="btn btn-o" href={telHref(s.phone)} tabIndex={menu ? 0 : -1}>{s.phone}</a>
        </div>
      </div>
    </>
  )
}

