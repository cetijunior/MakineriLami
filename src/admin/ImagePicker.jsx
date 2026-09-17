import { useRef, useState } from 'react'
import { api } from '../lib/api.js'
import { useAdmin } from './Admin.jsx'

const MAX_SIDE = 1600
const QUALITY = 0.82

/** Resize in the browser so phone photos (5-12 MB) upload as ~200 KB WebP. */
async function compress(file) {
  const bitmap = await createImageBitmap(file).catch(() => null)
  let w, h, draw
  if (bitmap) {
    w = bitmap.width
    h = bitmap.height
    draw = (ctx, W, H) => ctx.drawImage(bitmap, 0, 0, W, H)
  } else {
    const url = URL.createObjectURL(file)
    const img = await new Promise((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = rej
      i.src = url
    })
    w = img.naturalWidth
    h = img.naturalHeight
    draw = (ctx, W, H) => ctx.drawImage(img, 0, 0, W, H)
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h))
  const W = Math.round(w * scale)
  const H = Math.round(h * scale)
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  draw(canvas.getContext('2d'), W, H)

  let blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', QUALITY))
  let type = 'image/webp'
  if (!blob || blob.type !== 'image/webp') {
    blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', QUALITY))
    type = 'image/jpeg'
  }
  const data = await new Promise((res) => {
    const fr = new FileReader()
    fr.onload = () => res(String(fr.result).split(',')[1])
    fr.readAsDataURL(blob)
  })
  return { data, contentType: type, size: blob.size }
}

const Up = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
const Down = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
const X = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
const Star = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" /></svg>

export default function ImagePicker({ value = [], onChange, disabled }) {
  const { notify } = useAdmin()
  const [pending, setPending] = useState(0)
  const [over, setOver] = useState(false)
  const [link, setLink] = useState('')
  const [importing, setImporting] = useState(false)
  const input = useRef(null)
  const latest = useRef(value)
  latest.current = value

  const push = (url) => onChange([...latest.current, url])

  const upload = async (files) => {
    const list = Array.from(files || []).filter((f) => /^image\//.test(f.type))
    if (!list.length) return
    const room = 12 - latest.current.length
    if (room <= 0) return notify('Maksimumi është 12 foto për artikull.', 'err')
    const batch = list.slice(0, room)
    setPending((n) => n + batch.length)
    for (const file of batch) {
      try {
        const c = await compress(file)
        const saved = await api('/images', { method: 'POST', auth: true, body: { ...c, name: file.name } })
        push(saved.url)
      } catch (e) {
        notify(`${file.name}: ${e.message}`, 'err')
      } finally {
        setPending((n) => n - 1)
      }
    }
  }

  const importLink = async () => {
    const url = link.trim()
    if (!url) return
    // a direct link to an image on a stable host can be used as-is
    if (/\.(jpe?g|png|webp)(\?.*)?$/i.test(url) && !/cdninstagram|fbcdn|tiktokcdn/.test(url)) {
      push(url)
      setLink('')
      return
    }
    setImporting(true)
    try {
      const saved = await api('/images/import', { method: 'POST', auth: true, body: { url } })
      push(saved.url)
      setLink('')
      notify('Fotoja u importua')
    } catch (e) {
      notify(e.message, 'err')
    } finally {
      setImporting(false)
    }
  }

  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const makeMain = (i) => {
    const next = [...value]
    const [x] = next.splice(i, 1)
    onChange([x, ...next])
  }
  const remove = (i) => onChange(value.filter((_, k) => k !== i))

  return (
    <div>
      {(value.length > 0 || pending > 0) && (
        <div className="imgs">
          {value.map((src, i) => (
            <div className="imgt" key={src + i}>
              <img src={src} alt="" />
              {i === 0 && <span className="main">Kryesore</span>}
              {!disabled && (
                <div className="ctl">
                  {i > 0 && <button type="button" onClick={() => makeMain(i)} aria-label="Bëje kryesore" title="Bëje kryesore"><Star /></button>}
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Majtas"><Up /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Djathtas"><Down /></button>
                  <button type="button" onClick={() => remove(i)} aria-label="Hiq"><X /></button>
                </div>
              )}
            </div>
          ))}
          {Array.from({ length: pending }).map((_, i) => (
            <div className="imgt busy skeleton" key={`p${i}`}><span className="spin" /></div>
          ))}
        </div>
      )}

      {!disabled && (
        <>
          <div
            className={`drop${over ? ' over' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => input.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setOver(true) }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files) }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
            <b>Ngarko foto</b>
            <span>Klikoni ose tërhiqni foto këtu. Nga telefoni hapet kamera ose galeria. Kompresohen automatikisht.</span>
            <input
              ref={input}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { upload(e.target.files); e.target.value = '' }}
            />
          </div>
          <div className="importrow">
            <input
              className="inp"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), importLink())}
              placeholder="Ose ngjisni linkun e postimit në Instagram, TikTok ose të një fotoje"
              inputMode="url"
            />
            <button type="button" className="btn btn-o" onClick={importLink} disabled={!link.trim() || importing}>
              {importing ? <span className="spin" /> : 'Importo'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
