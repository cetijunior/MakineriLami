import { useState } from 'react'
import { api, token } from '../lib/api.js'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!password) return
    setBusy(true)
    setError('')
    try {
      const { token: t } = await api('/auth/login', { method: 'POST', body: { password } })
      token.set(t)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <div className="tape" />
      <form className="login-card" onSubmit={submit}>
        <img src="/assets/logo.png" alt="Makineri Lami" />
        <h1>Paneli i dyqanit</h1>
        <p>Menaxhoni artikujt, kategoritë dhe të dhënat e faqes.</p>
        <div className="fld">
          <label htmlFor="pw">Fjalëkalimi</label>
          <input
            id="pw"
            className={`inp${error ? ' bad' : ''}`}
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="err">{error}</p>}
        </div>
        <button className="btn btn-y" disabled={busy || !password}>
          {busy ? <span className="spin" /> : 'Hyr'}
        </button>
      </form>
    </div>
  )
}
