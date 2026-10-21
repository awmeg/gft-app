import { policyById, importantInfo, claimStatuses } from '../data.js'
import { PolicyIcon, ChevronIcon } from '../icons.jsx'
import { PageHead, Facts, Pill, kr, fmtDate } from '../lib.jsx'
import { useStore } from '../store.jsx'
import { FIELDS, fmtField, yearlyPrice, totalYearly } from '../rules.js'

export function PolicyList() {
  const { state } = useStore()
  const ids = Object.keys(state.policies)
  return (
    <>
      <PageHead title="Forsikringer" intro={`Du har ${ids.length} forsikringer hos os. Samlet pris: ${kr(totalYearly(state))} om året.`} />
      <ul className="list policy-list">
        {ids.map((id) => {
          const meta = policyById(id)
          const p = state.policies[id]
          return (
            <li key={id}>
              <a href={`#/forsikringer/${id}`}>
                <PolicyIcon type={meta.icon} />
                <span className="grow">
                  <strong>{meta.title}</strong>
                  <small>Police {p.policyNo}</small>
                </span>
                <span className="amount">{kr(yearlyPrice(id, p))}<small>pr. år</small></span>
                <ChevronIcon />
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export function PolicyDetail({ id, claims }) {
  const { state } = useStore()
  const meta = policyById(id)
  const p = state.policies[id]
  const back = { path: '/forsikringer', label: 'Forsikringer' }
  if (!meta || !p) return <PageHead title="Forsikringen findes ikke" back={back} />
  const related = claims.filter((c) => c.policyId === id)
  const extra = id === 'indbo' ? [['Adresse', state.customer.address], ['Husstand', `${state.household.length} personer`]] : id === 'hus' ? [['Adresse', state.customer.address]] : []

  return (
    <>
      <PageHead title={meta.title} back={back} />
      <div className="grid-2">
        <section className="panel">
          <div className="panel-icon"><PolicyIcon type={meta.icon} size={52} /></div>
          <Facts
            rows={[
              ['Policenummer', p.policyNo],
              ['Pris pr. år', kr(yearlyPrice(id, p))],
              ['Selvrisiko', p.deductible ? kr(p.deductible) : 'Ingen'],
              ['Kunde siden', fmtDate(p.since)],
              ...extra,
            ]}
          />
        </section>
        <section className="panel">
          <h2>Dine oplysninger</h2>
          <Facts rows={FIELDS[id].map((f) => [f.label, fmtField(f, p[f.key], state)])} />
          <h3>Det dækker forsikringen altid</h3>
          <ul className="checks">
            {meta.coverage.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>
      </div>

      <section className="callout">
        <span className="badge">VIGTIGT</span>
        <h2>Står dine oplysninger korrekt?</h2>
        <p>{importantInfo[id].when} {importantInfo[id].why}</p>
      </section>

      <h2 className="section-title">Skader på denne forsikring</h2>
      {related.length ? (
        <ul className="list">
          {related.map((c) => (
            <li key={c.id}>
              <a href={`#/skader/${c.id}`}>
                <span className="grow">
                  <strong>{c.title}</strong>
                  <small>{c.id} · {fmtDate(c.created)}</small>
                </span>
                <Pill tone={claimStatuses[c.status].tone}>{claimStatuses[c.status].label}</Pill>
                <ChevronIcon />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Ingen skader anmeldt.</p>
      )}

      <div className="actions">
        <a className="btn" href={`#/skader/ny?forsikring=${id}`}>Anmeld en skade</a>
        <a className="btn btn-ghost" href={`#/kontakt/skriv?emne=${encodeURIComponent('Ændring af ' + meta.title.toLowerCase())}`}>Skriv til GFT</a>
      </div>
    </>
  )
}
