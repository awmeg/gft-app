const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
const ACCENT = 'var(--green)'

export function PolicyIcon({ type, size = 44 }) {
  const p = { width: size, height: size, viewBox: '0 0 48 48', 'aria-hidden': true }
  switch (type) {
    case 'indbo': // lampe
      return (
        <svg {...p}>
          <path {...line} d="M14 12 L24 6 L30 16 L20 22 Z" />
          <path {...line} d="M22 20 L26 34" />
          <path {...line} d="M14 40 H38 M26 34 L20 40 M26 34 L32 40" />
          <circle cx="30" cy="20" r="2.5" fill={ACCENT} />
        </svg>
      )
    case 'ulykke': // plaster
      return (
        <svg {...p}>
          <rect {...line} x="17" y="6" width="14" height="36" rx="4" />
          <rect {...line} x="6" y="17" width="36" height="14" rx="4" />
          {[20, 28].map((x) => [20, 28].map((y) => <circle key={x + '-' + y} cx={x} cy={y} r="1.8" fill={ACCENT} />))}
        </svg>
      )
    case 'hus':
      return (
        <svg {...p}>
          <path {...line} d="M5 24 L24 8 L43 24" />
          <path {...line} d="M10 20 V41 H38 V20" />
          <path {...line} d="M32 13 V8 H36 V16" />
          <rect x="21" y="27" width="7" height="14" fill={ACCENT} />
        </svg>
      )
    case 'bil':
      return (
        <svg {...p}>
          <path {...line} d="M5 32 V25 L11 17 H30 L37 24 H43 V32 Z" />
          <path {...line} d="M3 37 H45" />
          <circle cx="14" cy="32" r="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="34" cy="32" r="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="14" cy="32" r="1.6" fill={ACCENT} />
          <circle cx="34" cy="32" r="1.6" fill={ACCENT} />
        </svg>
      )
    default:
      return null
  }
}

export function Logo({ light }) {
  return (
    <div className={`logo ${light ? 'logo-light' : ''}`} aria-label="GFT Forsikring">
      <div className="logo-mark">
        <span>GFT</span>
        <small>FORSIKRING</small>
      </div>
      <span className="logo-tag">Tryghed i<br />hverdagen</span>
    </div>
  )
}

export const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

export const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9l9-6 9 6v11H3z M3 9l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)

export const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,.15)" />
    <circle cx="12" cy="9" r="4" fill="currentColor" />
    <path d="M4.5 19a8 8 0 0 1 15 0" fill="currentColor" />
  </svg>
)

export const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)

export const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 4h16v12H8l-4 4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)

export const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)
