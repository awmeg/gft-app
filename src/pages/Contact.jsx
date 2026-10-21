import { useState } from 'react'
import { company } from '../data.js'
import { PhoneIcon, ChatIcon } from '../icons.jsx'
import { PageHead, Modal, Pill, fmtDate, navigate } from '../lib.jsx'

const topics = ['Generelt spørgsmål', 'Ændring af forsikring', 'Skade', 'Betaling', 'Flytning / adresseskift']

export default function Contact({ writeOpen, query, sent, onSend }) {
  return (
    <>
      <PageHead title="Kontakt" intro="Vi sidder klar til at hjælpe dig." />
      <div className="contact-grid">
        <a className="panel contact-card" href={`tel:${company.phone}`}>
          <span className="contact-icon"><PhoneIcon /></span>
          <span className="tile-label">Ring til os</span>
          <strong>{company.phoneDisplay}</strong>
          <span className="muted">Tryk for at ringe</span>
        </a>
        <button className="panel contact-card" onClick={() => navigate('/kontakt/skriv')}>
          <span className="contact-icon"><ChatIcon /></span>
          <span className="tile-label">Skriv til os</span>
          <strong>Skriv til GFT</strong>
          <span className="muted">Vi svarer inden for 2 hverdage</span>
        </button>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Åbningstider</h2>
          <dl className="facts">
            {company.hours.map(([d, t]) => (
              <div key={d}><dt>{d}</dt><dd>{t}</dd></div>
            ))}
          </dl>
        </section>
        <section className="panel">
          <h2>Akut skade uden for åbningstid?</h2>
          <p>Ring til vores døgnvagt ved brand, vandskade eller indbrud.</p>
          <a className="btn btn-ghost" href={`tel:${company.emergencyPhone}`}>Ring til døgnvagt {company.emergencyPhoneDisplay}</a>
          <p className="muted small">{company.name} · {company.address}</p>
        </section>
      </div>

      <h2 className="section-title">Dine henvendelser</h2>
      {sent.length ? (
        <ul className="list">
          {sent.map((m) => (
            <li key={m.id}>
              <div className="row">
                <span className="grow">
                  <strong>{m.topic}</strong>
                  <small>{fmtDate(m.date)} · {m.text.length > 70 ? m.text.slice(0, 70) + '…' : m.text}</small>
                </span>
                <Pill tone="neutral">Sendt</Pill>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Du har ikke skrevet til os endnu.</p>
      )}

      {writeOpen && <WriteModal initialTopic={query.get('emne')} onSend={onSend} onClose={() => navigate('/kontakt')} />}
    </>
  )
}

function WriteModal({ initialTopic, onSend, onClose }) {
  const options = initialTopic && !topics.includes(initialTopic) ? [initialTopic, ...topics] : topics
  const [topic, setTopic] = useState(initialTopic || topics[0])
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    onSend({ id: Date.now(), date: new Date().toISOString().slice(0, 10), topic, text })
    setDone(true)
  }

  return (
    <Modal onClose={onClose} label="Skriv til GFT">
      {done ? (
        <div className="done">
          <div className="done-check">✓</div>
          <h2 className="msg-head">Tak for din besked</h2>
          <p>Vi har modtaget din henvendelse om “{topic}” og svarer dig inden for 2 hverdage.</p>
          <button className="btn" onClick={onClose}>Luk</button>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <h2 className="msg-head">Skriv til GFT</h2>
          <label>
            Emne
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {options.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>
            Besked
            <textarea required rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Skriv din besked her…" />
          </label>
          <button className="btn" type="submit">Send besked</button>
          <p className="note">Prototype – beskeden sendes ikke, men gemmes i din browser.</p>
        </form>
      )}
    </Modal>
  )
}
