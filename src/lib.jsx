import { useEffect, useState } from 'react'
import { CloseIcon, BackIcon } from './icons.jsx'

// Hash-routing (#/skader/SK-123) virker på GitHub Pages uden server-opsætning
const currentPath = () => window.location.hash.replace(/^#/, '') || '/'

export function useRoute() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onChange = () => {
      setPath(currentPath())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export const navigate = (path) => {
  window.location.hash = path
}

// Lille localStorage-wrapper til demo-data, som brugeren selv opretter
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])
  return [value, setValue]
}

const money = new Intl.NumberFormat('da-DK', { maximumFractionDigits: 0 })
export const kr = (n) => `${money.format(n)} kr.`

const dateFmt = new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
export const fmtDate = (iso) => dateFmt.format(new Date(iso + 'T12:00:00'))

export const asset = (p) => import.meta.env.BASE_URL + p

export function Modal({ onClose, children, label }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Luk"><CloseIcon /></button>
        {children}
      </div>
    </div>
  )
}

export function PageHead({ title, intro, back }) {
  return (
    <div className="page-head">
      {back && (
        <a className="crumb" href={'#' + back.path}>
          <BackIcon /> {back.label}
        </a>
      )}
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
    </div>
  )
}

export const Pill = ({ tone = 'neutral', children }) => <span className={`pill pill-${tone}`}>{children}</span>

export function Facts({ rows }) {
  return (
    <dl className="facts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}
