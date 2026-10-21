import { useState } from 'react'
import { benefits } from '../data.js'
import { PageHead, Modal } from '../lib.jsx'

export default function Benefits() {
  const [open, setOpen] = useState(null)
  const [copied, setCopied] = useState(false)

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {}
    setCopied(true)
  }

  return (
    <>
      <PageHead title="Mine fordele" intro="Som kunde hos GFT Forsikring får du rabatter hos vores samarbejdspartnere." />
      <div className="benefit-grid">
        {benefits.map((b) => (
          <button key={b.id} className="benefit" onClick={() => { setOpen(b); setCopied(false) }}>
            <span className="tag">{b.category}</span>
            <strong>{b.title}</strong>
            <span className="muted">hos {b.partner}</span>
            <span className="tip-cta">Se fordel →</span>
          </button>
        ))}
      </div>
      {open && (
        <Modal onClose={() => setOpen(null)} label={open.title}>
          <span className="tag">{open.category}</span>
          <h2 className="msg-head">{open.title}</h2>
          <p>{open.text}</p>
          <p className="muted">Partner: {open.partner}</p>
          <div className="code-box">
            <span>Din rabatkode</span>
            <code>{open.code}</code>
          </div>
          <button className="btn" onClick={() => copy(open.code)}>{copied ? 'Kode kopieret ✓' : 'Kopiér kode'}</button>
        </Modal>
      )}
    </>
  )
}
