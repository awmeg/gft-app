import { useState } from 'react'
import { Modal, PageHead, Pill, fmtDate } from '../lib.jsx'
import { useStore } from '../store.jsx'

export default function Messages({ read, onToggle, onRead }) {
  const { state } = useStore()
  const [open, setOpen] = useState(null)
  const messages = state.messages

  return (
    <>
      <PageHead
        title="Dine beskeder"
        intro="Her finder du de breve og dokumenter, vi har sendt dig i forbindelse med skader, forsikringspolicer og gode råd til korrekt dækning."
      />
      {messages.length ? (
        <ul className="msg-list">
          {messages.map((m) => {
            const isRead = read.includes(m.id)
            return (
              <li key={m.id} className={isRead ? 'read' : 'unread'}>
                <button className="msg-title" onClick={() => { setOpen(m); onRead(m.id) }}>
                  <span className="bullet" aria-hidden="true" />
                  <span>
                    {m.title}
                    <small>{fmtDate(m.date)} · {m.kind === 'råd' ? 'Godt råd' : 'Bekræftelse'}</small>
                  </span>
                </button>
                <label className="switch" title={isRead ? 'Markér som ulæst' : 'Markér som læst'}>
                  <input type="checkbox" checked={isRead} onChange={() => onToggle(m.id)} aria-label={`Læst: ${m.title}`} />
                  <span />
                </label>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="empty">Du har ingen beskeder. Når der sker ændringer på dine forsikringer, får du besked her.</p>
      )}
      {open && (
        <Modal onClose={() => setOpen(null)} label={open.title}>
          <div className="status-row">
            <Pill tone={open.kind === 'råd' ? 'warn' : 'ok'}>{open.kind === 'råd' ? 'Godt råd' : 'Bekræftelse'}</Pill>
            <span className="muted small">{fmtDate(open.date)}</span>
          </div>
          <h2 className="msg-head">{open.title}</h2>
          {open.body.map((t, i) => <p key={i}>{t}</p>)}
          <div className="actions">
            {open.kind === 'råd' && <a className="btn" href="#/vigtig-info">Se i Vigtig info til dig</a>}
            <a className={`btn ${open.kind === 'råd' ? 'btn-ghost' : ''}`} href={`#/kontakt/skriv?emne=${encodeURIComponent(open.title)}`}>Skriv til GFT</a>
          </div>
        </Modal>
      )}
    </>
  )
}
