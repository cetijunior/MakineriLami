import { useEffect, useRef, useState } from 'react'
import { useStore, STOCK, useBodyLock } from '../lib/store.jsx'
import { waLink } from '../lib/api.js'
import { CheckIcon, InfoIcon, CloseIcon, ShareIcon, WaIcon } from '../lib/icons.jsx'
import { PhTile } from './Catalogue.jsx'

export function ProductModal({ product, onClose }) {
  useBodyLock(Boolean(product))

  useEffect(() => {
    if (!product) return
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [product, onClose])

  return (
    <div
      className={`modal${product ? ' on' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!product}
      aria-label={product?.name}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* keyed so the gallery resets when switching products */}
      {product && <ModalBody key={product.ref} p={product} onClose={onClose} />}
    </div>
  )
}

function ModalBody({ p, onClose }) {
  const { settings: s, add, notify, categories } = useStore()
  const [idx, setIdx] = useState(0)
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const prev = document.title
    document.title = `${p.name} · ${s.businessName}`
    return () => { document.title = prev }
  }, [p.name, s.businessName])

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: p.name, url })
      else {
        await navigator.clipboard.writeText(url)
        notify('Linku u kopjua')
      }
    } catch { /* cancelled */ }
  }

  const imgs = p.images || []
  const st = STOCK[p.stock] || STOCK.stok
  const cat = categories.find((c) => c.slug === p.category)?.label
  const step = (d) => setIdx((i) => (i + d + imgs.length) % imgs.length)

  return (
    <div className="modal-in">
      <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Mbyll"><CloseIcon /></button>
      <div className="m-gal">
        <div className="m-main">
          {imgs.length ? <img src={imgs[idx]} alt={`${p.name}, foto ${idx + 1}`} /> : <PhTile icon={p.icon} />}
          {imgs.length > 1 && (
            <>
              <button className="m-nav prev" onClick={() => step(-1)} aria-label="Foto e mëparshme">‹</button>
              <button className="m-nav next" onClick={() => step(1)} aria-label="Foto tjetër">›</button>
              <span className="m-count">{idx + 1} / {imgs.length}</span>
            </>
          )}
        </div>
        {imgs.length > 1 && (
          <div className="thumbs">
            {imgs.map((src, i) => (
              <button key={src + i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} aria-label={`Foto ${i + 1}`}>
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="m-txt">
        <div className="m-head">
          <div className="m-chips">
            <span className="m-ref">{p.ref}</span>
            {cat && <span className="m-chip">{cat}</span>}
            {st.label !== cat && <span className={`m-chip ${st.cls}`}>{st.label}</span>}
          </div>
          <h3>{p.name}</h3>
          {p.short && <p>{p.short}</p>}
        </div>
        {p.specs?.length > 0 && (
          <section className="m-sec">
            <h4><b>01</b>Të dhëna teknike</h4>
            <dl className="m-specs">
              {p.specs.map((x, i) => <div key={i}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
            </dl>
          </section>
        )}
        {p.bullets?.length > 0 && (
          <section className="m-sec">
            <h4><b>{p.specs?.length ? '02' : '01'}</b>Pikat kryesore</h4>
            <ul className="m-list">
              {p.bullets.map((b, i) => <li key={i}><CheckIcon strokeWidth={2.6} /><span>{b}</span></li>)}
            </ul>
          </section>
        )}
        {p.note && <p className="m-note"><InfoIcon /><span>{p.note}</span></p>}
        <div className="m-foot">
          <button className="btn btn-y" onClick={() => add(p.ref)}>Shto në kërkesë</button>
          <a
            className="btn btn-g"
            href={waLink(s.whatsapp, `Përshëndetje! Më intereson ${p.name} [${p.ref}]. A mund të më jepni çmimin dhe detajet?\n${window.location.href}`)}
            target="_blank"
            rel="noopener"
          >
            <WaIcon />WhatsApp
          </a>
          <button className="m-share" onClick={share}><ShareIcon />Shpërndaje këtë artikull</button>
        </div>
      </div>
    </div>
  )
}
