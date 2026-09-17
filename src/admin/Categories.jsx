import { useState } from 'react'
import { api } from '../lib/api.js'
import { Icon } from '../lib/icons.jsx'
import { useAdmin, Confirm } from './Admin.jsx'
import { Switch, IconPicker } from './fields.jsx'

const slugify = (s) =>
  String(s).toLowerCase().replace(/ë/g, 'e').replace(/ç/g, 'c').normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const Arrow = ({ up }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={up ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'} /></svg>
)
const Pen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>
)
const Trash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
)

function CategoryEditor({ initial, onSave, onCancel, busy }) {
  const [c, setC] = useState({ label: '', slug: '', icon: 'gear', active: true, ...initial })
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?._id))
  const set = (k, v) => setC((x) => ({ ...x, [k]: v, ...(k === 'label' && !slugTouched ? { slug: slugify(v) } : {}) }))

  return (
    <div className="panel" style={{ borderColor: 'var(--ink)' }}>
      <h2>{initial?._id ? 'Ndrysho kategorinë' : 'Kategori e re'}</h2>
      <p className="sub">Kategoritë shfaqen në menunë e dyqanit dhe te pllakat nën hero.</p>
      <div className="frow">
        <div className="fld">
          <label htmlFor="c-label">Emri *</label>
          <input id="c-label" className="inp" value={c.label} onChange={(e) => set('label', e.target.value)} placeholder="p.sh. Filtra & vajra" autoFocus />
        </div>
        <div className="fld">
          <label htmlFor="c-slug">Slug (në URL)</label>
          <input
            id="c-slug"
            className="inp"
            value={c.slug}
            onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          />
          {initial?._id && initial.slug !== c.slug && <p className="hint">Artikujt e kësaj kategorie përditësohen automatikisht.</p>}
        </div>
      </div>
      <div className="fld">
        <span className="lbl">Ikona</span>
        <IconPicker value={c.icon} onChange={(v) => set('icon', v)} />
      </div>
      <Switch checked={c.active} onChange={(v) => set('active', v)} label="E dukshme në dyqan" />
      <div className="dlg-in" style={{ padding: 0, boxShadow: 'none', width: '100%' }}>
        <div className="acts">
          <button type="button" className="btn btn-o" onClick={onCancel}>Anulo</button>
          <button type="button" className="btn btn-y" disabled={busy || !c.label.trim()} onClick={() => onSave(c)}>
            {busy ? <span className="spin" /> : initial?._id ? 'Ruaj' : 'Shto kategorinë'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Categories() {
  const { categories, setCategories, products, setProducts, notify, readOnly, loading } = useAdmin()
  const [editing, setEditing] = useState(null) // null | {} (new) | category
  const [del, setDel] = useState(null)
  const [moveTo, setMoveTo] = useState('')
  const [busy, setBusy] = useState(false)

  const count = (slug) => products.filter((p) => p.category === slug).length

  const save = async (c) => {
    setBusy(true)
    try {
      const body = { label: c.label, slug: c.slug, icon: c.icon, active: c.active }
      if (c._id) {
        const saved = await api(`/categories/${c._id}`, { method: 'PUT', auth: true, body })
        const old = categories.find((x) => x._id === c._id)
        setCategories((all) => all.map((x) => (x._id === saved._id ? saved : x)))
        if (old && old.slug !== saved.slug) {
          setProducts((all) => all.map((p) => (p.category === old.slug ? { ...p, category: saved.slug } : p)))
        }
        notify('Kategoria u ruajt')
      } else {
        const saved = await api('/categories', { method: 'POST', auth: true, body })
        setCategories((all) => [...all, saved])
        notify('Kategoria u shtua')
      }
      setEditing(null)
    } catch (e) {
      notify(e.message, 'err')
    } finally {
      setBusy(false)
    }
  }

  const move = async (i, d) => {
    const j = i + d
    if (j < 0 || j >= categories.length) return
    const next = [...categories]
    ;[next[i], next[j]] = [next[j], next[i]]
    const prev = categories
    setCategories(next)
    try {
      await Promise.all(next.map((c, k) => (c.order !== k + 1 ? api(`/categories/${c._id}`, { method: 'PUT', auth: true, body: { order: k + 1 } }) : null)))
      setCategories(next.map((c, k) => ({ ...c, order: k + 1 })))
    } catch (e) {
      setCategories(prev)
      notify(e.message, 'err')
    }
  }

  const toggle = async (c) => {
    const prev = categories
    setCategories((all) => all.map((x) => (x._id === c._id ? { ...x, active: c.active === false } : x)))
    try {
      await api(`/categories/${c._id}`, { method: 'PUT', auth: true, body: { active: c.active === false } })
    } catch (e) {
      setCategories(prev)
      notify(e.message, 'err')
    }
  }

  const remove = async () => {
    const used = count(del.slug)
    if (used && !moveTo) return notify('Zgjidhni ku të zhvendosen artikujt.', 'err')
    setBusy(true)
    try {
      await api(`/categories/${del._id}${used ? `?moveTo=${encodeURIComponent(moveTo)}` : ''}`, { method: 'DELETE', auth: true })
      setCategories((all) => all.filter((x) => x._id !== del._id))
      if (used) setProducts((all) => all.map((p) => (p.category === del.slug ? { ...p, category: moveTo } : p)))
      notify(used ? `Kategoria u fshi, ${used} artikuj u zhvendosën` : 'Kategoria u fshi')
      setDel(null)
      setMoveTo('')
    } catch (e) {
      notify(e.message, 'err')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Kategoritë</h1>
          <p>Renditja këtu është renditja në menunë e dyqanit.</p>
        </div>
        <div className="adm-actions">
          {!readOnly && !editing && <button className="btn btn-y" onClick={() => setEditing({})}>+ Shto kategori</button>}
        </div>
      </div>

      {editing && <CategoryEditor initial={editing} onSave={save} onCancel={() => setEditing(null)} busy={busy} />}

      {loading ? <p className="muted">Duke ngarkuar…</p> : (
        <div className="crows">
          {categories.length === 0 && <div className="panel"><p className="muted" style={{ margin: 0 }}>Nuk ka kategori. Shtoni të parën.</p></div>}
          {categories.map((c, i) => (
            <div className={`crow-ed${c.active === false ? ' off' : ''}`} key={c._id}>
              <span className="cic"><Icon name={c.icon} /></span>
              <div style={{ minWidth: 0 }}>
                <b>{c.label}</b>
                <small>/{c.slug} · {count(c.slug)} artikuj{c.active === false ? ' · E FSHEHUR' : ''}</small>
              </div>
              {!readOnly && (
                <div className="pact">
                  <button className="ib hide-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Lart"><Arrow up /></button>
                  <button className="ib hide-sm" onClick={() => move(i, 1)} disabled={i === categories.length - 1} aria-label="Poshtë"><Arrow /></button>
                  <Switch checked={c.active !== false} onChange={() => toggle(c)} label="" />
                  <button className="ib" onClick={() => setEditing(c)} aria-label="Ndrysho"><Pen /></button>
                  <button className="ib danger" onClick={() => { setDel(c); setMoveTo('') }} aria-label="Fshi"><Trash /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {del && (
        <Confirm
          title={`Ta fshij "${del.label}"?`}
          text={count(del.slug) ? `Kjo kategori ka ${count(del.slug)} artikuj. Zgjidhni ku të zhvendosen:` : 'Kategoria nuk ka artikuj dhe mund të fshihet menjëherë.'}
          onCancel={() => setDel(null)}
          onConfirm={remove}
          busy={busy}
        >
          {count(del.slug) > 0 && (
            <select className="sel inp" style={{ width: '100%' }} value={moveTo} onChange={(e) => setMoveTo(e.target.value)}>
              <option value="">Zgjidhni kategorinë…</option>
              {categories.filter((c) => c._id !== del._id).map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          )}
        </Confirm>
      )}
    </>
  )
}
