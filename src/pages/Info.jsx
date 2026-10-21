import { useState } from 'react'
import { policies, importantIntro, importantInfo } from '../data.js'
import { PolicyIcon } from '../icons.jsx'
import { Modal, PageHead, asset } from '../lib.jsx'

export default function Info() {
  const [open, setOpen] = useState(null)
  return (
    <>
      <PageHead title="Vigtig info til dig" />
      <section className="callout">
        <span className="badge">VIGTIGT</span>
        <h2>{importantIntro.title}</h2>
        <p>{importantIntro.text}</p>
      </section>
      <div className="cards">
        {policies.map((p) => (
          <button key={p.id} className="card" onClick={() => setOpen(p)}>
            <PolicyIcon type={p.icon} size={48} />
            <span>{p.title}</span>
          </button>
        ))}
      </div>
      {open && <InfoModal policy={open} onClose={() => setOpen(null)} />}
    </>
  )
}

function InfoModal({ policy, onClose }) {
  const info = importantInfo[policy.id]
  return (
    <Modal onClose={onClose} label={policy.title}>
      <div className="modal-head">
        <PolicyIcon type={policy.icon} size={40} />
        <h2>{policy.title}</h2>
      </div>
      <h3>Hvornår skal du tage kontakt?</h3>
      <p>{info.when}</p>
      <h3>Hvorfor skal du tage kontakt?</h3>
      <p>{info.why}</p>
      {info.sports && (
        <div className="sports">
          <h3>Risikosport</h3>
          <img src={asset('img/risikosport.png')} alt="Oversigt over risikosportsgrene" />
          <h3>Højrisikosport</h3>
          <img src={asset('img/hoejrisikosport.png')} alt="Oversigt over højrisikosportsgrene" />
          <p className="note">Eller fører af MC, scooter, knallert eller ATV.</p>
        </div>
      )}
      <div className="why-box">
        <h3>Hvorfor er den vigtig?</h3>
        <p>{info.importance}</p>
      </div>
      <a className="btn" href={`#/kontakt/skriv?emne=${encodeURIComponent('Ændring af ' + policy.title.toLowerCase())}`} onClick={onClose}>
        Skriv til GFT
      </a>
    </Modal>
  )
}
