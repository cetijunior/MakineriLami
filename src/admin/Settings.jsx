import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useAdmin } from './Admin.jsx'

const GROUPS = [
  {
    title: 'Biznesi',
    sub: 'Shfaqen në header, kontakt dhe footer.',
    fields: [
      ['businessName', 'Emri i biznesit'],
      ['tagline', 'Nëntitulli (nën logo)'],
      ['phone', 'Telefoni (siç shfaqet)', '+355 68 615 6616'],
      ['whatsapp', 'Numri i WhatsApp (vetëm shifra)', '355686156616', 'Këtu vijnë të gjitha kërkesat nga faqja.'],
      ['address', 'Adresa'],
      ['hours', 'Orari', 'Hën - Sht, 08:00 - 18:00'],
      ['responseTime', 'Koha e përgjigjes', 'Zakonisht brenda 24 orësh'],
    ],
  },
  {
    title: 'Hero',
    sub: 'Pjesa e parë që sheh klienti.',
    fields: [
      ['heroEyebrow', 'Etiketa sipër titullit'],
      ['heroTitle', 'Titulli'],
      ['heroTitleAccent', 'Pjesa e verdhë e titullit'],
      ['heroLead', 'Teksti poshtë titullit', '', '', true],
      ['heroVideo', 'Video (URL .mp4)', '/assets/hero.mp4', 'Lëreni bosh për të përdorur vetëm foton.'],
      ['heroPoster', 'Foto e hero-s (URL)', '/assets/hero-poster.jpg'],
      ['yardImage', 'Foto e shiritit "Fusha jonë" (URL)', '/assets/yard.jpg'],
    ],
  },
  {
    title: 'Rrjetet sociale',
    sub: 'Lini bosh ato që nuk përdorni.',
    fields: [
      ['instagram', 'Instagram', 'https://instagram.com/…'],
      ['facebook', 'Facebook', 'https://facebook.com/…'],
      ['tiktok', 'TikTok', 'https://tiktok.com/@…'],
    ],
  },
]

export default function Settings() {
  const { notify, readOnly } = useAdmin()
  const [s, setS] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api('/settings').then(setS).catch((e) => notify(e.message, 'err'))
  }, [notify])

  const set = (k, v) => { setS((x) => ({ ...x, [k]: v })); setDirty(true) }
  const setFaq = (i, k, v) => set('faq', s.faq.map((f, j) => (j === i ? { ...f, [k]: v } : f)))

  const save = async () => {
    setSaving(true)
    try {
      const body = { ...s }
      delete body._id
      delete body.updatedAt
      delete body.key
      const saved = await api('/settings', { method: 'PUT', auth: true, body })
      setS(saved)
      setDirty(false)
      notify('Cilësimet u ruajtën')
    } catch (e) {
      notify(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  if (!s) return <p className="muted">Duke ngarkuar…</p>

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Cilësimet</h1>
          <p>Të dhënat e biznesit, teksti i hero-s, rrjetet sociale dhe pyetjet e shpeshta.</p>
        </div>
      </div>

      <div className="fgrid">
        <div>
          {GROUPS.map((g) => (
            <div className="panel" key={g.title}>
              <h2>{g.title}</h2>
              <p className="sub">{g.sub}</p>
              {g.fields.map(([k, label, ph, hint, long]) => (
                <div className="fld" key={k}>
                  <label htmlFor={`s-${k}`}>{label}</label>
                  {long ? (
                    <textarea id={`s-${k}`} className="ta" rows={3} value={s[k] || ''} onChange={(e) => set(k, e.target.value)} placeholder={ph} disabled={readOnly} />
                  ) : (
                    <input id={`s-${k}`} className="inp" value={s[k] || ''} onChange={(e) => set(k, e.target.value)} placeholder={ph} disabled={readOnly} />
                  )}
                  {hint && <p className="hint">{hint}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="panel">
            <h2>Pyetjet e shpeshta</h2>
            <p className="sub">Shfaqen në seksionin "Pyetje". E para hapet automatikisht.</p>
            <div style={{ display: 'grid', gap: 14 }}>
              {(s.faq || []).map((f, i) => (
                <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 12 }}>
                  <div className="fld">
                    <label>Pyetja {i + 1}</label>
                    <input className="inp" value={f.q} onChange={(e) => setFaq(i, 'q', e.target.value)} disabled={readOnly} />
                  </div>
                  <div className="fld" style={{ marginBottom: 8 }}>
                    <label>Përgjigjja</label>
                    <textarea className="ta" rows={3} value={f.a} onChange={(e) => setFaq(i, 'a', e.target.value)} disabled={readOnly} />
                  </div>
                  {!readOnly && (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="button" className="addline" disabled={i === 0} onClick={() => { const x = [...s.faq];[x[i - 1], x[i]] = [x[i], x[i - 1]]; set('faq', x) }}>↑ Lart</button>
                      <button type="button" className="addline" style={{ color: '#C0392B' }} onClick={() => set('faq', s.faq.filter((_, j) => j !== i))}>Hiq</button>
                    </div>
                  )}
                </div>
              ))}
              {!readOnly && (
                <button type="button" className="addline" onClick={() => set('faq', [...(s.faq || []), { q: '', a: '' }])}>+ Shto pyetje</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="savebar">
        <span className="msg">{readOnly ? 'Vetëm lexim: baza e të dhënave nuk është lidhur.' : dirty ? 'Keni ndryshime të paruajtura.' : 'Gjithçka e ruajtur.'}</span>
        <button className="btn btn-y" onClick={save} disabled={readOnly || saving || !dirty}>
          {saving ? <span className="spin" /> : 'Ruaj cilësimet'}
        </button>
      </div>
    </>
  )
}
