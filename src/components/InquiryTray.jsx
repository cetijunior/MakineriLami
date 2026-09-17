import { useEffect, useState } from 'react'
import { useStore, useBodyLock } from '../lib/store.jsx'
import { waLink } from '../lib/api.js'
import { CartIcon, CloseIcon, WaIcon, InfoIcon } from '../lib/icons.jsx'
import { PhTile } from './Catalogue.jsx'

const FORM_KEY = 'ml-inquiry-form'

export function InquiryTray() {
  const { settings: s, lines, setQty, clear, trayOpen, closeTray } = useStore()
  const [form, setForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FORM_KEY)) || { name: '', city: '', note: '' } } catch { return { name: '', city: '', note: '' } }
  })
  useBodyLock(trayOpen)

  useEffect(() => {
    try { localStorage.setItem(FORM_KEY, JSON.stringify(form)) } catch { /* private mode */ }
  }, [form])

  useEffect(() => {
    if (!trayOpen) return
    const esc = (e) => e.key === 'Escape' && closeTray()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [trayOpen, closeTray])

  const message = [
    `Përshëndetje ${s.businessName}! Kërkesë nga faqja:`,
    '',
    ...lines.map((l, i) => `${i + 1}. ${l.product.name} [${l.product.ref}] x${l.qty}`),
    '',
    form.name && `Emri: ${form.name}`,
    form.city && `Qyteti: ${form.city}`,
    form.note && `Makineria: ${form.note}`,
    'Ju lutem çmimin dhe disponueshmërinë. Faleminderit!',
  ].filter((x) => x !== false && x !== undefined).join('\n')

  const field = (k) => ({ value: form[k], onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })) })

  return (
    <>
      <div className={`scrim${trayOpen ? ' on' : ''}`} onClick={closeTray} />
      <aside className={`tray${trayOpen ? ' on' : ''}`} aria-label="Lista e kërkesës" aria-hidden={!trayOpen}>
        <div className="tray-h">
          <h3>Kërkesa juaj</h3>
          {lines.length > 0 && (
            <button className="m-share" onClick={clear} style={{ marginRight: 6 }}>Pastro</button>
          )}
          <button className="icon-btn" onClick={closeTray} aria-label="Mbyll"><CloseIcon /></button>
        </div>
        <div className="tray-b">
          {lines.length === 0 ? (
            <div className="tray-empty">
              <CartIcon />
              <p style={{ margin: 0 }}>Lista është bosh.<br />Shtoni pjesët që ju interesojnë nga katalogu.</p>
            </div>
          ) : (
            lines.map(({ product: p, qty }) => (
              <div className="li" key={p.ref}>
                <div className="li-img">
                  {p.images?.[0] ? <img src={p.images[0]} alt="" /> : <PhTile icon={p.icon} label={false} />}
                </div>
                <div>
                  <i>{p.ref}</i>
                  <b>{p.name}</b>
                  <div className="qty">
                    <button onClick={() => setQty(p.ref, qty - 1)} aria-label="Hiq një">−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(p.ref, qty + 1)} aria-label="Shto një">+</button>
                  </div>
                </div>
                <button className="rm" onClick={() => setQty(p.ref, 0)} aria-label={`Fshi ${p.name}`}>×</button>
              </div>
            ))
          )}
        </div>
        {lines.length > 0 && (
          <div className="tray-f">
            <div className="f2">
              <div className="field"><label htmlFor="cName">Emri</label><input id="cName" placeholder="Emri juaj" autoComplete="name" {...field('name')} /></div>
              <div className="field"><label htmlFor="cCity">Qyteti</label><input id="cCity" placeholder="p.sh. Tiranë" {...field('city')} /></div>
            </div>
            <div className="field"><label htmlFor="cNote">Makineria ose shënim</label><input id="cNote" placeholder="p.sh. CAT 320D, 22 ton" {...field('note')} /></div>
            <a className="btn btn-g" href={waLink(s.whatsapp, message)} target="_blank" rel="noopener">
              <WaIcon />Dërgo kërkesën në WhatsApp
            </a>
            <p className="note"><InfoIcon />Hapet WhatsApp me mesazhin gati. Nuk paguani asgjë online.</p>
          </div>
        )}
      </aside>
    </>
  )
}
