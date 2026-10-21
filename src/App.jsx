import { useEffect, useState } from 'react'
import { customer, messages, nav, claims as baseClaims } from './data.js'
import { Logo, MenuIcon, CloseIcon, MailIcon, LockIcon, UserIcon } from './icons.jsx'
import { useRoute, useStored, navigate, PageHead } from './lib.jsx'
import Home from './pages/Home.jsx'
import Info from './pages/Info.jsx'
import Messages from './pages/Messages.jsx'
import { PolicyList, PolicyDetail } from './pages/Policies.jsx'
import { ClaimList, ClaimDetail, NewClaim } from './pages/Claims.jsx'
import { PaymentList, PaymentDetail } from './pages/Payments.jsx'
import Surplus from './pages/Surplus.jsx'
import Benefits from './pages/Benefits.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  const route = useRoute()
  const [path, qs = ''] = route.split('?')
  const query = new URLSearchParams(qs)
  const [section, sub] = path.split('/').filter(Boolean)

  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const [read, setRead] = useStored('gft-read-messages', [])
  const [myClaims, setMyClaims] = useStored('gft-new-claims', [])
  const [sent, setSent] = useStored('gft-sent-messages', [])

  const claims = [...myClaims, ...baseClaims]
  const unread = messages.filter((m) => !read.includes(m.id)).length

  useEffect(() => setMenuOpen(false), [route])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const toggleRead = (id) => setRead((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]))
  const markRead = (id) => setRead((r) => (r.includes(id) ? r : [...r, id]))

  if (loggedOut) {
    return (
      <div className="logout">
        <Logo />
        <p>Du er logget ud.</p>
        <button className="btn" onClick={() => { setLoggedOut(false); navigate('/') }}>Log ind igen</button>
      </div>
    )
  }

  let page
  switch (section) {
    case undefined:
      page = <Home claims={claims} unread={unread} />
      break
    case 'vigtig-info':
      page = <Info />
      break
    case 'forsikringer':
      page = sub ? <PolicyDetail id={sub} claims={claims} /> : <PolicyList />
      break
    case 'skader':
      page = sub === 'ny'
        ? <NewClaim query={query} onCreate={(c) => setMyClaims((list) => [c, ...list])} />
        : sub ? <ClaimDetail id={sub} claims={claims} /> : <ClaimList claims={claims} />
      break
    case 'betaling':
      page = sub ? <PaymentDetail id={sub} /> : <PaymentList />
      break
    case 'overskudsdeling':
      page = <Surplus />
      break
    case 'fordele':
      page = <Benefits />
      break
    case 'kontakt':
      page = <Contact writeOpen={sub === 'skriv'} query={query} sent={sent} onSend={(m) => setSent((s) => [m, ...s])} />
      break
    case 'beskeder':
      page = <Messages read={read} onToggle={toggleRead} onRead={markRead} />
      break
    default:
      page = <PageHead title="Siden findes ikke" back={{ path: '/', label: 'Overblik' }} />
  }

  const active = '/' + (section || '')

  return (
    <div className="app">
      <header className="topbar">
        <a href="#/" className="logo-link"><Logo /></a>
        <button className="burger" onClick={() => setMenuOpen(true)} aria-label="Åbn menu" aria-expanded={menuOpen}>
          <MenuIcon />
          {unread > 0 && <span className="dot" />}
        </button>
      </header>

      <div className={`scrim ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`sidebar ${menuOpen ? 'open' : ''}`} aria-label="Hovedmenu">
        <a href="#/" className="sidebar-logo"><Logo light /></a>
        <div className="sidebar-user">
          <UserIcon />
          <span>
            {customer.name}
            <small>Kundenr. {customer.customerNo}</small>
          </span>
          <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Luk menu"><CloseIcon /></button>
        </div>
        <ul>
          {nav.map((item) => (
            <li key={item.path}>
              <a href={'#' + item.path} className={active === item.path ? 'active' : ''} aria-current={active === item.path ? 'page' : undefined}>
                {item.label}
                {item.isNew && <em>NY</em>}
              </a>
            </li>
          ))}
        </ul>
        <div className="sidebar-foot">
          <a href="#/beskeder" className={active === '/beskeder' ? 'active' : ''}>
            <MailIcon /> Beskeder {unread > 0 && <span className="count">{unread}</span>}
          </a>
          <button onClick={() => setLoggedOut(true)}>
            <LockIcon /> Log ud
          </button>
        </div>
      </nav>

      <main className="content">
        <div className="content-inner">{page}</div>
        <footer className="foot">Prototype · GFT Forsikring er et fiktivt selskab, og alle data er opdigtede.</footer>
      </main>
    </div>
  )
}
