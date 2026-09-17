import { useState } from 'react'
import { Icon, ICON_PATHS, ICON_LABELS, UI_ONLY_ICONS } from '../lib/icons.jsx'

export function Switch({ checked, onChange, label, disabled }) {
  return (
    <label className="sw">
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      <span className="t" />
      {label}
    </label>
  )
}

export function ChipsInput({ value = [], onChange, placeholder, max = 8, disabled }) {
  const [draft, setDraft] = useState('')
  const commit = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean)
    if (!parts.length) return
    const next = [...value]
    for (const p of parts) if (!next.includes(p) && next.length < max) next.push(p)
    onChange(next)
    setDraft('')
  }
  return (
    <div className="chips-ed">
      {value.map((t) => (
        <span className="chip" key={t}>
          {t}
          {!disabled && <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Hiq ${t}`}>×</button>}
        </span>
      ))}
      {!disabled && value.length < max && (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit() }
            if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
          }}
          onBlur={commit}
          placeholder={value.length ? '' : placeholder}
        />
      )}
    </div>
  )
}

const Del = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
)

export function LinesInput({ value = [], onChange, placeholder, addLabel = '+ Shto rresht', max = 12, disabled }) {
  const set = (i, v) => onChange(value.map((x, k) => (k === i ? v : x)))
  return (
    <div className="list-ed">
      {value.map((line, i) => (
        <div className="li-row" key={i}>
          <input className="inp" value={line} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} disabled={disabled} />
          {!disabled && <button type="button" className="ib danger" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Hiq"><Del /></button>}
        </div>
      ))}
      {!disabled && value.length < max && (
        <button type="button" className="addline" onClick={() => onChange([...value, ''])}>{addLabel}</button>
      )}
    </div>
  )
}

export function SpecsInput({ value = [], onChange, disabled }) {
  const set = (i, k, v) => onChange(value.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
  return (
    <div className="list-ed">
      {value.map((s, i) => (
        <div className="li-row spec" key={i}>
          <input className="inp" value={s.label} onChange={(e) => set(i, 'label', e.target.value)} placeholder="p.sh. Motor" disabled={disabled} />
          <input className="inp" value={s.value} onChange={(e) => set(i, 'value', e.target.value)} placeholder="p.sh. Cat C7.1 · 273 hp" disabled={disabled} />
          {!disabled && <button type="button" className="ib danger" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Hiq"><Del /></button>}
        </div>
      ))}
      {!disabled && value.length < 8 && (
        <button type="button" className="addline" onClick={() => onChange([...value, { label: '', value: '' }])}>+ Shto specifikë</button>
      )}
    </div>
  )
}

export function IconPicker({ value, onChange, disabled }) {
  return (
    <div className="icon-grid" role="radiogroup">
      {Object.keys(ICON_PATHS).filter((k) => !UI_ONLY_ICONS.includes(k)).map((k) => (
        <button
          type="button"
          key={k}
          className={value === k ? 'on' : ''}
          onClick={() => onChange(k)}
          title={ICON_LABELS[k]}
          aria-label={ICON_LABELS[k]}
          aria-checked={value === k}
          role="radio"
          disabled={disabled}
        >
          <Icon name={k} />
        </button>
      ))}
    </div>
  )
}
