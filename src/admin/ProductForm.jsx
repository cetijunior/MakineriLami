import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useBlocker } from 'react-router-dom'
import { api } from '../lib/api.js'
import { STOCK } from '../lib/store.jsx'
import { Icon } from '../lib/icons.jsx'
import { useAdmin, Confirm } from './Admin.jsx'
import ImagePicker from './ImagePicker.jsx'
import { Switch, ChipsInput, LinesInput, SpecsInput, IconPicker } from './fields.jsx'

const EMPTY = {
  ref: '', name: '', category: '', stock: 'stok', short: '', note: '', badge: '', icon: 'gear',
  images: [], tags: [], bullets: [], specs: [], featured: false, active: true,
}

function suggestRef(categorySlug, products) {
  const prefix = (categorySlug || 'ART').replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase() || 'AR'
  let n = 1
  const taken = new Set(products.map((p) => p.ref))
  while (taken.has(`${prefix}-${String(n).padStart(2, '0')}`)) n++
  return `${prefix}-${String(n).padStart(2, '0')}`
}

export default function ProductForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { products, setProducts, categories, notify, readOnly, loading } = useAdmin()

  const original = useMemo(() => (isNew ? null : products.find((p) => p._id === id)), [isNew, id, products])
  const [form, setForm] = useState(EMPTY)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [confirmDel, setConfirmDel] = useState(false)
  // set right before an intentional navigation (after save/delete) so the
  // unsaved-changes guard never races React's state commit
  const allowNav = useRef(false)

  useEffect(() => {
    if (original) setForm({ ...EMPTY, ...original })
    else if (isNew) setForm({ ...EMPTY, category: categories[0]?.slug || '' })
    setDirty(false)
    allowNav.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [original?._id, isNew, categories.length])

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !allowNav.current && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v && v.target ? v.target.value : v }))
    setDirty(true)
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  if (!isNew && !original) {
    return loading ? <p className="muted">Duke ngarkuar…</p> : (
      <div className="panel">
        <h2>Artikulli nuk u gjet</h2>
        <p className="sub">Mund të jetë fshirë.</p>
        <Link className="btn btn-o" to="/admin">Kthehu te artikujt</Link>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Shkruani emrin e artikullit.'
    if (!form.ref.trim()) e.ref = 'Kodi është i detyrueshëm.'
    else if (products.some((p) => p.ref === form.ref.trim().toUpperCase() && p._id !== id)) e.ref = 'Ky kod përdoret nga një artikull tjetër.'
    if (!form.category) e.category = 'Zgjidhni kategorinë.'
    setErrors(e)
    return !Object.keys(e).length
  }

  const save = async (andNew = false) => {
    if (!validate()) {
      notify('Plotësoni fushat e shënuara.', 'err')
      return
    }
    setSaving(true)
    const body = {
      ...form,
      bullets: form.bullets.map((b) => b.trim()).filter(Boolean),
      specs: form.specs.filter((s) => s.label.trim() || s.value.trim()),
    }
    delete body._id
    delete body.createdAt
    delete body.updatedAt
    try {
      const saved = isNew
        ? await api('/products', { method: 'POST', auth: true, body })
        : await api(`/products/${id}`, { method: 'PUT', auth: true, body })
      setProducts((all) => (isNew ? [...all, saved] : all.map((p) => (p._id === saved._id ? saved : p))))
      setDirty(false)
      notify(isNew ? 'Artikulli u shtua' : 'Ndryshimet u ruajtën')
      if (andNew) {
        setForm({ ...EMPTY, category: form.category })
        setErrors({})
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (isNew) {
        allowNav.current = true
        navigate(`/admin/artikull/${saved._id}`, { replace: true })
      }
    } catch (e) {
      notify(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    setSaving(true)
    try {
      await api(`/products/${id}`, { method: 'DELETE', auth: true })
      setProducts((all) => all.filter((p) => p._id !== id))
      setDirty(false)
      notify('Artikulli u fshi')
      allowNav.current = true
      navigate('/admin')
    } catch (e) {
      notify(e.message, 'err')
      setSaving(false)
    }
  }

  const ro = readOnly
  const catMissing = form.category && !categories.some((c) => c.slug === form.category)

  return (
    <form onSubmit={(e) => { e.preventDefault(); save() }} noValidate>
      <div className="adm-top">
        <div>
          <Link to="/admin" className="muted" style={{ fontSize: 14 }}>← Artikujt</Link>
          <h1 style={{ marginTop: 6 }}>{isNew ? 'Artikull i ri' : form.name || 'Pa emër'}</h1>
          {!isNew && <p>{original.ref} · përditësuar {original.updatedAt ? new Date(original.updatedAt).toLocaleDateString('sq-AL') : '–'}</p>}
        </div>
        {!isNew && (
          <div className="adm-actions">
            <a className="btn btn-o" href={`/p/${encodeURIComponent(original.ref)}`} target="_blank" rel="noopener">Shiko në dyqan</a>
          </div>
        )}
      </div>

      <div className="fgrid">
        <div>
          <div className="panel">
            <h2>Të dhënat bazë</h2>
            <p className="sub">Kjo shfaqet te karta e artikullit në katalog.</p>
            <div className="fld">
              <label htmlFor="f-name">Emri *</label>
              <input id="f-name" className={`inp${errors.name ? ' bad' : ''}`} value={form.name} onChange={set('name')} placeholder="p.sh. Kovë gërmimi 6 thumba" disabled={ro} />
              {errors.name && <p className="err">{errors.name}</p>}
            </div>
            <div className="frow">
              <div className="fld">
                <label htmlFor="f-ref">Kodi *</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    id="f-ref"
                    className={`inp${errors.ref ? ' bad' : ''}`}
                    value={form.ref}
                    onChange={(e) => set('ref')(e.target.value.toUpperCase())}
                    placeholder="p.sh. KV-06"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    disabled={ro}
                  />
                  {!ro && (
                    <button type="button" className="btn btn-o" style={{ padding: '0 12px' }} onClick={() => set('ref')(suggestRef(form.category, products))}>
                      Auto
                    </button>
                  )}
                </div>
                {errors.ref ? <p className="err">{errors.ref}</p> : <p className="hint">Shkon te mesazhi i WhatsApp që klienti ta identifikojë.</p>}
              </div>
              <div className="fld">
                <label htmlFor="f-cat">Kategoria *</label>
                <select id="f-cat" className={`sel inp${errors.category ? ' bad' : ''}`} style={{ width: '100%' }} value={form.category} onChange={set('category')} disabled={ro}>
                  <option value="">Zgjidhni…</option>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}{c.active === false ? ' (e fshehur)' : ''}</option>)}
                  {catMissing && <option value={form.category}>{form.category} (nuk ekziston)</option>}
                </select>
                {errors.category && <p className="err">{errors.category}</p>}
                {!categories.length && <p className="hint"><Link to="/admin/kategorite">Krijoni një kategori</Link> fillimisht.</p>}
              </div>
            </div>
            <div className="fld">
              <span className="lbl">Gjendja</span>
              <div className="seg">
                {Object.entries(STOCK).map(([k, v]) => (
                  <button type="button" key={k} className={form.stock === k ? 'on' : ''} onClick={() => set('stock')(k)} disabled={ro}>{v.label}</button>
                ))}
              </div>
            </div>
            <div className="fld">
              <label htmlFor="f-short">Përshkrim i shkurtër</label>
              <textarea id="f-short" className="ta" rows={2} value={form.short} onChange={set('short')} placeholder="Një ose dy fjali. Për çfarë shërben, për çfarë makinerie." maxLength={220} disabled={ro} />
              <p className="hint">{form.short.length}/220</p>
            </div>
            <div className="fld">
              <span className="lbl">Etiketat</span>
              <ChipsInput value={form.tags} onChange={set('tags')} placeholder="Shkruani dhe shtypni Enter, p.sh. 20-30 ton" disabled={ro} />
              <p className="hint">Ndihmojnë kërkimin. Maksimumi 8.</p>
            </div>
          </div>

          <div className="panel">
            <h2>Fotot</h2>
            <p className="sub">Fotoja e parë është kryesorja në katalog. Nëse nuk ka foto, shfaqet ikona e mëposhtme.</p>
            <ImagePicker value={form.images} onChange={set('images')} disabled={ro} />
            {form.images.length === 0 && (
              <div className="fld" style={{ marginTop: 16, marginBottom: 0 }}>
                <span className="lbl">Ikona kur nuk ka foto</span>
                <IconPicker value={form.icon} onChange={set('icon')} disabled={ro} />
              </div>
            )}
          </div>

          <div className="panel">
            <h2>Detajet</h2>
            <p className="sub">Shfaqen kur klienti hap artikullin.</p>
            <div className="fld">
              <span className="lbl">Specifikat</span>
              <SpecsInput value={form.specs} onChange={set('specs')} disabled={ro} />
            </div>
            <div className="fld">
              <span className="lbl">Pikat kryesore</span>
              <LinesInput value={form.bullets} onChange={set('bullets')} placeholder="p.sh. Gjashtë thumba në gjendje të përdorshme" addLabel="+ Shto pikë" disabled={ro} />
            </div>
            <div className="fld" style={{ marginBottom: 0 }}>
              <label htmlFor="f-note">Shënim</label>
              <input id="f-note" className="inp" value={form.note} onChange={set('note')} placeholder="p.sh. Matjet e pinave jepen në WhatsApp." disabled={ro} />
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <h2>Dukshmëria</h2>
            <p className="sub">Artikujt e fshehur nuk shfaqen në dyqan, por mbeten këtu.</p>
            <div style={{ display: 'grid', gap: 14 }}>
              <Switch checked={form.active} onChange={set('active')} label="I dukshëm në dyqan" disabled={ro} />
              <Switch checked={form.featured} onChange={set('featured')} label={'I veçantë (seksioni "Në shitje sot")'} disabled={ro} />
            </div>
            {form.featured && (
              <div className="fld" style={{ marginTop: 16, marginBottom: 0 }}>
                <label htmlFor="f-badge">Etiketa e verdhë</label>
                <input id="f-badge" className="inp" value={form.badge} onChange={set('badge')} placeholder="p.sh. Klasa 30 ton" disabled={ro} />
              </div>
            )}
          </div>

          <div className="panel">
            <h2>Parapamja</h2>
            <div className="card" style={{ maxWidth: 300, pointerEvents: 'none' }}>
              <div className="card-img">
                {form.images[0] ? <img src={form.images[0]} alt="" /> : (
                  <div className="ph-tile"><Icon name={form.icon} /><em>Foto sipas kërkesës</em></div>
                )}
                <span className={`badge ${(STOCK[form.stock] || STOCK.stok).cls}`}>{(STOCK[form.stock] || STOCK.stok).label}</span>
              </div>
              <div className="card-body">
                <span className="card-ref">{form.ref || 'KODI'}</span>
                <h3>{form.name || 'Emri i artikullit'}</h3>
                {form.short && <p>{form.short}</p>}
              </div>
            </div>
          </div>

          {!isNew && !ro && (
            <div className="panel">
              <h2>Zona e rrezikshme</h2>
              <p className="sub">Fshirja nuk kthehet mbrapsht.</p>
              <button type="button" className="btn btn-red" onClick={() => setConfirmDel(true)}>Fshi artikullin</button>
            </div>
          )}
        </div>
      </div>

      <div className="savebar">
        <span className="msg">{ro ? 'Vetëm lexim: baza e të dhënave nuk është lidhur.' : dirty ? 'Keni ndryshime të paruajtura.' : isNew ? '' : 'Gjithçka e ruajtur.'}</span>
        <Link className="btn btn-o" to="/admin">Anulo</Link>
        {isNew && !ro && <button type="button" className="btn btn-o" onClick={() => save(true)} disabled={saving}>Ruaj dhe shto tjetër</button>}
        <button type="submit" className="btn btn-y" disabled={ro || saving || (!isNew && !dirty)}>
          {saving ? <span className="spin" /> : isNew ? 'Shto artikullin' : 'Ruaj ndryshimet'}
        </button>
      </div>

      {confirmDel && (
        <Confirm
          title="Ta fshij artikullin?"
          text={`"${form.name}" do të hiqet përgjithmonë nga dyqani.`}
          onCancel={() => setConfirmDel(false)}
          onConfirm={remove}
          busy={saving}
        />
      )}
      {blocker.state === 'blocked' && (
        <Confirm
          title="Largohu pa ruajtur?"
          text="Ndryshimet që keni bërë do të humbasin."
          confirmLabel="Largohu"
          onCancel={() => blocker.reset()}
          onConfirm={() => blocker.proceed()}
        />
      )}
    </form>
  )
}
