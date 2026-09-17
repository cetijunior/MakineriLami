import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store.jsx'
import { waLink, telHref } from '../lib/api.js'
import { Icon, WaIcon, CheckIcon, PhoneIcon, PinIcon, ClockIcon, IgIcon, FbIcon, TtIcon } from '../lib/icons.jsx'

export function Trust() {
  const items = [
    ['box', 'Foto reale të artikullit', 'Çdo foto është nga fusha jonë, jo nga interneti.'],
    ['filter', 'Gjendja thuhet hapur', 'E përdorur, e rregulluar ose për pjesë. Pa surpriza.'],
    ['truck', 'Transport i organizuar', 'Dorëzim në të gjithë Shqipërinë, sipas peshës.'],
    ['wrench', 'Nuk e gjetët? E kërkojmë', 'Na thoni markën dhe modelin, ju gjejmë pjesën.'],
  ]
  return (
    <div className="trust">
      <div className="wrap">
        {items.map(([icon, t, d]) => (
          <div className="tr" key={t}>
            <Icon name={icon} strokeWidth={1.8} />
            <div><b>{t}</b><span>{d}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Spotlight({ p }) {
  const { settings: s, add } = useStore()
  const [idx, setIdx] = useState(0)
  const imgs = p.images || []
  return (
    <article className="mach rv">
      <div className="mach-gal">
        <div className="mach-main">
          {imgs.length ? <img src={imgs[idx]} alt={p.name} loading="lazy" /> : <div className="ph-tile"><Icon name={p.icon || 'exc'} /></div>}
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
      <div className="mach-txt">
        {p.badge && <span className="mtag">{p.badge}</span>}
        <h3>{p.name}</h3>
        {p.short && <p>{p.short}</p>}
        {p.specs?.length > 0 && (
          <dl className="specs">
            {p.specs.slice(0, 4).map((x, i) => <div key={i}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
          </dl>
        )}
        <div className="mach-cta">
          <button className="btn btn-y" onClick={() => add(p.ref)}>Shto në kërkesë</button>
          <Link className="btn btn-o" to={`/p/${encodeURIComponent(p.ref)}`} preventScrollReset>Shiko detajet</Link>
          <a
            className="btn btn-o"
            href={waLink(s.whatsapp, `Përshëndetje! Jam i interesuar për ${p.name} (kodi ${p.ref}). A mund të më jepni çmimin dhe detajet?`)}
            target="_blank"
            rel="noopener"
          >
            <WaIcon />WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export function Machines() {
  const { products } = useStore()
  const featured = products.filter((p) => p.featured)
  if (!featured.length) return null
  return (
    <section className="sec" id="makineri">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <span className="kicker">Të veçanta</span>
            <h2>Në shitje sot</h2>
            <p>Të parë në punë, jo në letër. Shikimi organizohet në fushë me takim paraprak.</p>
          </div>
        </div>
        {featured.map((p) => <Spotlight key={p._id || p.ref} p={p} />)}
      </div>
    </section>
  )
}

export function Steps() {
  const steps = [
    ['Ndërtoni listën', 'Shtoni çdo pjesë ose makineri që ju intereson, me sasinë përkatëse. Lista ruhet edhe nëse mbyllni faqen.'],
    ['Dërgojeni në WhatsApp', 'Me një klikim hapet biseda me listën gati: kodi, artikulli dhe sasia. Nuk shkruani asgjë vetë.'],
    ['Merrni çmim dhe foto', 'Ju kthejmë çmimin, gjendjen reale dhe foto ose video shtesë. Dorëzimi ose tërheqja bihet dakord aty.'],
  ]
  return (
    <section className="sec" id="si-funksionon" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <span className="kicker">Si funksionon</span>
            <h2>Tre hapa, pa humbje kohe</h2>
          </div>
        </div>
        <div className="steps rv">
          {steps.map(([t, d], i) => (
            <div className="step" key={t}><b>{i + 1}</b><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Band() {
  const { settings: s } = useStore()
  return (
    <section className="band">
      {s.yardImage && <img src={s.yardImage} alt={`Fusha e ${s.businessName}`} loading="lazy" />}
      <div className="wrap">
        <div className="rv">
          <span className="kicker" style={{ color: '#B9BCC1' }}>Fusha jonë</span>
          <h2>Nuk shesim katalog. Shesim atë që kemi në fushë.</h2>
          <p>Makineritë çmontohen te ne, ndaj çdo pjesë vjen me histori të njohur dhe mund ta shihni para se ta blini.</p>
          <ul className="tick">
            <li><CheckIcon /><span>Foto dhe video reale të artikullit përpara se të paguani.</span></li>
            <li><CheckIcon /><span>Matje dhe kode pjese konfirmohen para dorëzimit.</span></li>
            <li><CheckIcon /><span>Nuk e keni në listë? Na shkruani markën dhe modelin, e kërkojmë.</span></li>
          </ul>
          <a className="btn btn-y" href={waLink(s.whatsapp, 'Përshëndetje! Po kërkoj një pjesë për makinerinë time. Marka dhe modeli: ')} target="_blank" rel="noopener">
            Kërko një pjesë specifike
          </a>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const { settings: s } = useStore()
  if (!s.faq?.length) return null
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <span className="kicker">Pyetje</span>
            <h2>Ato që na pyesin më shpesh</h2>
          </div>
        </div>
        <div className="faq-list rv">
          {s.faq.map((f, i) => (
            <details key={i} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const { settings: s, openTray } = useStore()
  return (
    <section className="sec" id="kontakt" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <span className="kicker">Kontakt</span>
            <h2>Shkruani, ju kthehemi shpejt</h2>
            <p>Mënyra më e shpejtë është WhatsApp: dërgoni listën ose thjesht një foto të pjesës që ju duhet.</p>
          </div>
        </div>
        <div className="contact rv">
          <div className="cbox">
            <h3>Kontakt direkt</h3>
            <div className="crow"><PhoneIcon /><div><b>Telefon / WhatsApp</b><span><a href={telHref(s.phone)}>{s.phone}</a></span></div></div>
            <div className="crow"><PinIcon /><div><b>Adresa</b><span>{s.address}</span></div></div>
            {s.hours && <div className="crow"><ClockIcon /><div><b>Orari</b><span>{s.hours}</span></div></div>}
            <a className="btn btn-g" href={waLink(s.whatsapp, `Përshëndetje ${s.businessName}! Kam një pyetje:`)} target="_blank" rel="noopener">Hap WhatsApp</a>
          </div>
          <div className="cbox">
            <h3>Na ndiqni</h3>
            {s.instagram && <div className="crow"><IgIcon /><div><b>Instagram</b><span><a href={s.instagram} target="_blank" rel="noopener">{handle(s.instagram)}</a></span></div></div>}
            {s.facebook && <div className="crow"><FbIcon /><div><b>Facebook</b><span><a href={s.facebook} target="_blank" rel="noopener">{s.businessName}</a></span></div></div>}
            {s.tiktok && <div className="crow"><TtIcon /><div><b>TikTok</b><span><a href={s.tiktok} target="_blank" rel="noopener">{handle(s.tiktok)}</a></span></div></div>}
            <a className="btn btn-o" href={telHref(s.phone)}>Telefono tani</a>
          </div>
          <div className="cbox">
            <h3>Kërkesë e shpejtë</h3>
            <p style={{ color: 'var(--mute)', margin: '0 0 12px', fontSize: 15 }}>
              Na dërgoni markën, modelin dhe pjesën që ju duhet. Nëse keni një foto të pjesës së vjetër, edhe më mirë: e krahasojmë direkt me stokun.
            </p>
            {s.responseTime && (
              <div className="crow" style={{ paddingTop: 0 }}>
                <ClockIcon /><div><b>Përgjigje</b><span>{s.responseTime}</span></div>
              </div>
            )}
            <a className="btn btn-y" href={waLink(s.whatsapp, 'Përshëndetje! Po kërkoj një pjesë. Makineria ime është: ')} target="_blank" rel="noopener">Dërgo kërkesën</a>
            <button className="btn btn-o" onClick={openTray}>Hap listën time</button>
          </div>
        </div>
      </div>
    </section>
  )
}

const handle = (url) => {
  try {
    const seg = new URL(url).pathname.split('/').filter(Boolean)[0] || ''
    return seg.startsWith('@') ? seg : `@${seg}`
  } catch {
    return url
  }
}

export function Footer({ onCategory }) {
  const { settings: s, categories } = useStore()
  const year = new Date().getFullYear()
  return (
    <>
      <footer>
        <div className="wrap">
          <div className="f-top">
            <div>
              <a href="/" className="brand" style={{ marginBottom: 14 }}>
                <img src="/assets/logo.png" alt="" width="46" height="46" />
                <b>{s.businessName}<span>{s.address}</span></b>
              </a>
              <p style={{ maxWidth: '36ch', margin: 0, fontSize: 15 }}>
                Pjesë këmbimi dhe makineri ndërtimi. Foto reale, çmim me kontakt, dorëzim në të gjithë Shqipërinë.
              </p>
            </div>
            <div>
              <h4>Dyqani</h4>
              <a href="#katalog" onClick={(e) => { e.preventDefault(); onCategory('') }}>Të gjitha artikujt</a>
              {categories.slice(0, 5).map((c) => (
                <a key={c.slug} href="#katalog" onClick={(e) => { e.preventDefault(); onCategory(c.slug) }}>{c.label}</a>
              ))}
            </div>
            <div>
              <h4>Faqja</h4>
              <a href="#makineri">Makineri</a>
              <a href="#si-funksionon">Si funksionon</a>
              <a href="#faq">Pyetje</a>
              <a href="#kontakt">Kontakt</a>
            </div>
            <div>
              <h4>Kontakt</h4>
              <a href={telHref(s.phone)}>{s.phone}</a>
              {s.instagram && <a href={s.instagram} target="_blank" rel="noopener">Instagram</a>}
              {s.facebook && <a href={s.facebook} target="_blank" rel="noopener">Facebook</a>}
              {s.tiktok && <a href={s.tiktok} target="_blank" rel="noopener">TikTok</a>}
            </div>
          </div>
          <div className="f-bot">
            <span>© {year} {s.businessName}. Të gjitha të drejtat e rezervuara.</span>
            <span>{s.address}, Shqipëri</span>
          </div>
        </div>
      </footer>
      <div className="rsd-strip">
        <a href="https://rritjesade.com" target="_blank" rel="noopener">Built by <b>Rritje Sade</b></a>
      </div>
    </>
  )
}

export function StickyBar() {
  const { settings: s, count, openTray } = useStore()
  return (
    <div className="bar">
      <a className="btn btn-g" href={waLink(s.whatsapp, `Përshëndetje ${s.businessName}! Ju shkruaj nga faqja juaj.`)} target="_blank" rel="noopener">
        <WaIcon />WhatsApp
      </a>
      <button className="btn btn-dk" onClick={openTray}>Kërkesa ({count})</button>
    </div>
  )
}

export function Toast() {
  const { toast, openTray } = useStore()
  return (
    <div className={`toast${toast ? ' on' : ''}`} role="status" aria-live="polite" onClick={openTray}>
      {toast && (
        <>
          <CheckIcon style={{ width: 16, height: 16, color: 'var(--yellow)' }} />
          {toast.kind === 'add' ? <span>U shtua: <b>{toast.msg}</b></span> : <span>{toast.msg}</span>}
        </>
      )}
    </div>
  )
}
