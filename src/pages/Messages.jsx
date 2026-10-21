import { useState } from 'react'
import { messages } from '../data.js'
import { Modal, PageHead, fmtDate } from '../lib.jsx'

export default function Messages({ read, onToggle, onRead }) {
  const [open, setOpen] = useState(null)
  return (
    <>
      <PageHead
        title="Dine beskeder"
        intro="Her finder du de breve og dokumenter, vi har sendt dig i forbindelse med skader, forsikringspolicer og gode råd til korrekt dækning."
      />
      <ul className="msg-list">
        {messages.map((m) => {
          const isRead = read.includes(m.id)
          return (
            <li key={m.id} className={isRead ? 'read' : 'unread'}>
              <button className="msg-title" onClick={() => { setOpen(m); onRead(m.id) }}>
                <span className="bullet" aria-hidden="true" />
                <span>
                  {m.title}
                  <small>{fmtDate(m.date)}</small>
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
      {open && (
        <Modal onClose={() => setOpen(null)} label={open.title}>
          <p className="muted small">{fmtDate(open.date)}</p>
          <h2 className="msg-head">{open.title}</h2>
          {open.body.map((t, i) => <p key={i}>{t}</p>)}
          <a className="btn" href={`#/kontakt/skriv?emne=${encodeURIComponent(open.title)}`}>Skriv til GFT</a>
        </Modal>
      )}
    </>
  )
}
