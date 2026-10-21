import { useState } from 'react'
import { policyMeta, policyById, importantIntro, importantInfo } from '../data.js'
import { PolicyIcon } from '../icons.jsx'
import { Modal, PageHead, asset, fmtDate } from '../lib.jsx'
import { useStore } from '../store.jsx'

// Rådgivningspunkter udløses af ændringer i TIA Admin (se rules.js) og styrer denne side
export const adviceItems = (state) => state.messages.filter((m) => m.kind === 'råd')
export const openAdvice = (state) => adviceItems(state).filter((m) => !(state.handled ?? []).includes(m.id))

export default function Info() {
  const { state, save } = useStore()
  const [open, setOpen] = useState(null)
  const [showHandled, setShowHandled] = useState(false)
  const handled = state.handled ?? []
  const active = openAdvice(state)
  const done = adviceItems(state).filter((m) => handled.includes(m.id))

  const setHandled = (id, value) =>
    save({ ...state, handled: value ? [...handled, id] : handled.filter((x) => x !== id) })

  const countFor = (policyId) => active.filter((m) => m.policyId === policyId).length

  return (
    <>
      <PageHead title="Vigtig info til dig" intro="Vi holder øje med ændringer i din husstand og dine forsikringer og fortæller dig, hvad du skal være opmærksom på." />

      {active.length ? (
        <section className="advice">
          <h2 className="section-title">Det skal du være opmærksom på nu ({active.length})</h2>
          <div className="advice-list">
            {active.map((m) => <AdviceCard key={m.id} item={m} onDone={() => setHandled(m.id, true)} />)}
          </div>
        </section>
      ) : (
        <section className="all-good">
          <span className="all-good-icon">✓</span>
          <div>
            <strong>Alt ser ud til at være i orden</strong>
            <p>Når der sker ændringer i din husstand eller på dine forsikringer, viser vi her, hvad du skal være opmærksom på.</p>
          </div>
        </section>
      )}

      <section className="callout">
        <span className="badge">VIGTIGT</span>
        <h2>{importantIntro.title}</h2>
        <p>{importantIntro.text}</p>
      </section>
      <div className="cards">
        {policyMeta.map((p) => {
          const n = countFor(p.id)
          return (
            <button key={p.id} className={`card ${n ? 'card-alert' : ''}`} onClick={() => setOpen(p)}>
              {n > 0 && <span className="card-count" aria-label={`${n} aktuelle punkter`}>{n}</span>}
              <PolicyIcon type={p.icon} size={48} />
              <span>{p.title}</span>
              {!state.policies[p.id] && <small>Ikke en del af dine forsikringer</small>}
            </button>
          )
        })}
      </div>

      {done.length > 0 && (
        <section className="handled">
          <button className="link" onClick={() => setShowHandled(!showHandled)}>
            {showHandled ? 'Skjul' : 'Vis'} håndterede punkter ({done.length})
          </button>
          {showHandled && (
            <ul className="list">
              {done.map((m) => (
                <li key={m.id}>
                  <div className="row">
                    <span className="grow">
                      <strong>{m.title}</strong>
                      <small>{policyById(m.policyId)?.title} · {fmtDate(m.date)}</small>
                    </span>
                    <button className="link" onClick={() => setHandled(m.id, false)}>Genåbn</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {open && (
        <InfoModal
          policy={open}
          advice={active.filter((m) => m.policyId === open.id)}
          onDone={(id) => setHandled(id, true)}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  )
}

function AdviceCard({ item, onDone, compact }) {
  const [expanded, setExpanded] = useState(false)
  const meta = policyById(item.policyId)
  const [first, ...rest] = item.body
  return (
    <article className={`advice-card ${compact ? 'compact' : ''}`}>
      <div className="advice-head">
        {!compact && <PolicyIcon type={meta.icon} size={34} />}
        <div className="grow">
          <span className="tag">{meta.title} · {fmtDate(item.date)}</span>
          <h3>{item.title}</h3>
        </div>
      </div>
      <p>{first}</p>
      {expanded && rest.map((t, i) => <p key={i}>{t}</p>)}
      {rest.length > 0 && (
        <button className="link" onClick={() => setExpanded(!expanded)}>{expanded ? 'Vis mindre' : 'Læs mere'}</button>
      )}
      <div className="advice-actions">
        <a className="btn btn-small" href={`#/kontakt/skriv?emne=${encodeURIComponent(item.title)}`}>Kontakt GFT</a>
        <button className="btn btn-small btn-ghost" onClick={onDone}>Det er på plads ✓</button>
      </div>
    </article>
  )
}

function InfoModal({ policy, advice, onDone, onClose }) {
  const info = importantInfo[policy.id]
  return (
    <Modal onClose={onClose} label={policy.title}>
      <div className="modal-head">
        <PolicyIcon type={policy.icon} size={40} />
        <h2>{policy.title}</h2>
      </div>
      {advice.length > 0 && (
        <div className="modal-advice">
          <h3>Aktuelt for dig</h3>
          {advice.map((m) => <AdviceCard key={m.id} item={m} compact onDone={() => onDone(m.id)} />)}
        </div>
      )}
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
