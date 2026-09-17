/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { api, token } from '../lib/api.js'
import { Icon, CheckIcon, InfoIcon } from '../lib/icons.jsx'
import Login from './Login.jsx'
import Products from './Products.jsx'
import ProductForm from './ProductForm.jsx'
import Categories from './Categories.jsx'
import Settings from './Settings.jsx'
import '../styles.css'
import './admin.css'

const AdminCtx = createContext(null)
export const useAdmin = () => useContext(AdminCtx)

export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(token.get()))
  const [health, setHealth] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Paneli · Makineri Lami'
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }
    meta.content = 'noindex,nofollow'
  }, [])

  const notify = useCallback((msg, kind = 'ok') => {
    setToast({ msg, kind })
    clearTimeout(window.__admToast)
    window.__admToast = setTimeout(() => setToast(null), kind === 'err' ? 5000 : 2600)
  }, [])

  const logout = useCallback(() => {
    token.clear()
    setAuthed(false)
    navigate('/admin')
  }, [navigate])

  const reload = useCallback(async () => {
    try {
      const [me, p, c] = await Promise.all([
        api('/auth/me', { auth: true }),
        api('/products?all=1', { auth: true }),
        api('/categories?all=1', { auth: true }),
      ])
      setHealth(me.database)
      setProducts(p)
      setCategories(c)
    } catch (e) {
      if (e.status === 401) setAuthed(false)
      else notify(e.message, 'err')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    if (authed) reload()
  }, [authed, reload])

  if (!authed) return <Login onLogin={() => { setLoading(true); setAuthed(true) }} />

  const readOnly = health && !health.connected
  const value = { products, setProducts, categories, setCategories, reload, notify, loading, readOnly, health, logout }

  const nav = [
    ['/admin', 'Artikujt', 'box', products.length, true],
    ['/admin/kategorite', 'Kategoritë', 'grid', categories.length],
    ['/admin/cilesimet', 'Cilësimet', 'gear'],
  ]

  return (
    <AdminCtx.Provider value={value}>
      <div className="adm">
        <aside className="adm-side">
          <div className="adm-brand">
            <img src="/assets/logo.png" alt="" />
            <div><b>Makineri Lami</b><span>Paneli i dyqanit</span></div>
          </div>
          {nav.map(([to, label, icon, n, end]) => (
            <NavLink key={to} to={to} end={end} className="adm-nav">
              <Icon name={icon} />{label}{n !== undefined && <i>{n}</i>}
            </NavLink>
          ))}
          <NavLink to="/admin/artikull/i-ri" className="adm-nav"><Icon name="plus" />Shto artikull</NavLink>
          <div className="adm-side-foot">
            <a className="adm-nav" href="/" target="_blank" rel="noopener"><Icon name="store" />Shiko dyqanin</a>
            <button className="adm-nav" onClick={logout} style={{ textAlign: 'left' }}><Icon name="logout" />Dil</button>
          </div>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div className="adm-mobilebar">
            <img src="/assets/logo.png" alt="" />
            <b>Paneli</b>
            <a href="/" target="_blank" rel="noopener">Dyqani</a>
            <button onClick={logout}>Dil</button>
          </div>
          <nav className="adm-tabs">
            {nav.map(([to, label, , , end]) => (
              <NavLink key={to} to={to} end={end}>{label}</NavLink>
            ))}
          </nav>

          <main className="adm-main">
            {health && !health.configured && (
              <div className="banner warn">
                <InfoIcon />
                <div>
                  <b>Baza e të dhënave nuk është lidhur ende</b>
                  Dyqani po shfaq katalogun fillestar. Ndryshimet nuk mund të ruhen derisa të shtohet <code>MONGODB_URI</code> te Vercel → Settings → Environment Variables, dhe të bëhet redeploy.
                </div>
              </div>
            )}
            {health && health.configured && !health.connected && (
              <div className="banner err">
                <InfoIcon />
                <div>
                  <b>Lidhja me MongoDB dështoi</b>
                  Kontrolloni që <code>MONGODB_URI</code> është i saktë dhe që te Atlas → Network Access lejohet <code>0.0.0.0/0</code>.
                </div>
              </div>
            )}

            <Routes>
              <Route index element={<Products />} />
              <Route path="artikull/i-ri" element={<ProductForm />} />
              <Route path="artikull/:id" element={<ProductForm />} />
              <Route path="kategorite" element={<Categories />} />
              <Route path="cilesimet" element={<Settings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {toast && (
        <div className={`adm-toast${toast.kind === 'err' ? ' err' : ''}`} role="status">
          {toast.kind === 'err' ? <InfoIcon /> : <CheckIcon />}
          {toast.msg}
        </div>
      )}
    </AdminCtx.Provider>
  )
}

export function Confirm({ title, text, confirmLabel = 'Fshi', danger = true, onConfirm, onCancel, children, busy }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onCancel])
  return (
    <div className="dlg" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="dlg-in" role="alertdialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        {children}
        <div className="acts">
          <button className="btn btn-o" onClick={onCancel}>Anulo</button>
          <button className={`btn ${danger ? 'btn-red' : 'btn-dk'}`} onClick={onConfirm} disabled={busy}>
            {busy ? <span className="spin" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
