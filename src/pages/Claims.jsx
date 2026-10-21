import { useState } from 'react'
import { policyById, claimStatuses } from '../data.js'
import { useStore } from '../store.jsx'
import { PolicyIcon, ChevronIcon, PlusIcon } from '../icons.jsx'
import { PageHead, Facts, Pill, kr, fmtDate, navigate } from '../lib.jsx'

const isOpen = (c) => !['paid', 'rejected'].includes(c.status)

export function ClaimList({ claims }) {
  const [filter, setFilter] = useState('alle')
  const shown = claims.filter((c) => filter === 'alle' || (filter === 'aabne' ? isOpen(c) : !isOpen(c)))
  return (
    <>
      <PageHead title="Skader" intro="Se status på dine skader, og følg med i, hvad der sker i sagen." />
      <div className="toolbar">
        <div className="segmented" role="tablist">
          {[['alle', 'Alle'], ['aabne', 'Åbne'], ['afsluttede', 'Afsluttede']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>
              {l}
            </button>
          ))}
        </div>
        <a className="btn btn-small" href="#/skader/ny"><PlusIcon /> Anmeld skade</a>
      </div>
      {shown.length ? (
        <ul className="list">
          {shown.map((c) => {
            const p = policyById(c.policyId)
            const s = claimStatuses[c.status]
            return (
              <li key={c.id}>
                <a href={`#/skader/${c.id}`}>
                  <PolicyIcon type={p.icon} size={36} />
                  <span className="grow">
                    <strong>{c.title}</strong>
                    <small>{p.title} · Oprettet {fmtDate(c.created)}</small>
                  </span>
                  <Pill tone={s.tone}>{s.label}</Pill>
                  <ChevronIcon />
                </a>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="empty">Ingen skader her.</p>
      )}
    </>
  )
}

const steps = ['received', 'processing', 'approved', 'paid']

export function ClaimDetail({ id, claims }) {
  const c = claims.find((x) => x.id === id)
  const back = { path: '/skader', label: 'Skader' }
  if (!c) return <PageHead title="Skaden findes ikke" back={back} />
  const p = policyById(c.policyId)
  const s = claimStatuses[c.status]
  const stepIndex = steps.indexOf(c.status)

  return (
    <>
      <PageHead title={c.title} back={back} />
      <div className="status-row">
        <Pill tone={s.tone}>{s.label}</Pill>
        <span className="muted">Sagsnummer {c.id}</span>
      </div>

      <ol className="stepper" aria-label="Sagens forløb">
        {['Modtaget', 'Under behandling', 'Godkendt', 'Udbetalt'].map((label, i) => (
          <li key={label} className={i < stepIndex ? 'done' : i === stepIndex ? 'current' : ''}>
            <span className="step-dot" />
            <span>{label}</span>
          </li>
        ))}
      </ol>

      <div className="next-step">
        <strong>Næste skridt</strong>
        <p>{c.nextStep}</p>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Om skaden</h2>
          <Facts
            rows={[
              ['Forsikring', p.title],
              ['Skadedato', fmtDate(c.incident)],
              ['Oprettet', fmtDate(c.created)],
              ['Sted', c.location || 'Ikke angivet'],
              ['Sagsbehandler', c.handler || 'Tildeles snart'],
            ]}
          />
          <h3>Beskrivelse</h3>
          <p>{c.description}</p>
        </section>

        <section className="panel">
          <h2>Økonomi</h2>
          <Facts
            rows={[
              ['Anslået skade', c.estimate ? kr(c.estimate) : 'Afventer vurdering'],
              ['Din selvrisiko', kr(c.deductible)],
              ['Udbetalt', c.payout ? kr(c.payout) : 'Endnu ikke udbetalt'],
            ]}
          />
          <h3>Dokumenter</h3>
          {c.documents.length ? (
            <ul className="docs">
              {c.documents.map((d) => <li key={d}>{d}</li>)}
            </ul>
          ) : (
            <p className="muted">Ingen dokumenter endnu.</p>
          )}
        </section>
      </div>

      <section className="panel">
        <h2>Forløb</h2>
        <ul className="timeline">
          {[...c.timeline].reverse().map(([d, t]) => (
            <li key={d + t}>
              <time>{fmtDate(d)}</time>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="actions">
        <a className="btn" href={`#/kontakt/skriv?emne=${encodeURIComponent('Skade ' + c.id)}`}>Skriv til {c.handler || 'sagsbehandler'}</a>
      </div>
    </>
  )
}

export function NewClaim({ query, onCreate }) {
  const { state } = useStore()
  const policyIds = Object.keys(state.policies)
  const [form, setForm] = useState({
    policyId: policyIds.includes(query.get('forsikring')) ? query.get('forsikring') : policyIds[0],
    title: '',
    incident: new Date().toISOString().slice(0, 10),
    location: '',
    description: '',
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const today = new Date().toISOString().slice(0, 10)
    const id = 'SK-' + today.slice(0, 4) + '-' + String(Math.floor(10000 + Math.random() * 89999))
    onCreate({
      ...form,
      id,
      created: today,
      status: 'received',
      handler: '',
      estimate: null,
      deductible: state.policies[form.policyId].deductible,
      payout: null,
      documents: [],
      nextStep: 'Vi har modtaget din anmeldelse. En sagsbehandler kontakter dig inden for 2 hverdage.',
      timeline: [[today, 'Skade anmeldt i appen']],
    })
    navigate('/skader/' + id)
  }

  return (
    <>
      <PageHead title="Anmeld en skade" back={{ path: '/skader', label: 'Skader' }} intro="Udfyld så meget, du kan. Du kan altid sende flere oplysninger senere." />
      <form className="panel form" onSubmit={submit}>
        <label>
          Hvilken forsikring?
          <select value={form.policyId} onChange={set('policyId')}>
            {policyIds.map((id) => <option key={id} value={id}>{policyById(id).title}</option>)}
          </select>
        </label>
        <label>
          Hvad er der sket? (kort)
          <input required value={form.title} onChange={set('title')} placeholder="Fx Cykel stjålet" />
        </label>
        <div className="form-row">
          <label>
            Hvornår skete det?
            <input type="date" required value={form.incident} onChange={set('incident')} />
          </label>
          <label>
            Hvor skete det?
            <input value={form.location} onChange={set('location')} placeholder="Adresse eller sted" />
          </label>
        </div>
        <label>
          Beskriv skaden
          <textarea required rows={5} value={form.description} onChange={set('description')} placeholder="Hvad skete der, og hvad er beskadiget?" />
        </label>
        <button className="btn" type="submit">Send anmeldelse</button>
        <p className="note">Dette er en prototype – anmeldelsen gemmes kun i din browser.</p>
      </form>
    </>
  )
}
