import { policies, policyById, importantInfo, claimStatuses } from '../data.js'
import { PolicyIcon, ChevronIcon } from '../icons.jsx'
import { PageHead, Facts, Pill, kr, fmtDate } from '../lib.jsx'

export function PolicyList() {
  const total = policies.reduce((s, p) => s + p.yearly, 0)
  return (
    <>
      <PageHead title="Forsikringer" intro={`Du har ${policies.length} forsikringer hos os. Samlet pris: ${kr(total)} om året.`} />
      <ul className="list policy-list">
        {policies.map((p) => (
          <li key={p.id}>
            <a href={`#/forsikringer/${p.id}`}>
              <PolicyIcon type={p.icon} />
              <span className="grow">
                <strong>{p.title}</strong>
                <small>Police {p.policyNo}</small>
              </span>
              <span className="amount">{kr(p.yearly)}<small>pr. år</small></span>
              <ChevronIcon />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

export function PolicyDetail({ id, claims }) {
  const p = policyById(id)
  if (!p) return <PageHead title="Forsikringen findes ikke" back={{ path: '/forsikringer', label: 'Forsikringer' }} />
  const related = claims.filter((c) => c.policyId === p.id)
  return (
    <>
      <PageHead title={p.title} back={{ path: '/forsikringer', label: 'Forsikringer' }} />
      <div className="grid-2">
        <section className="panel">
          <div className="panel-icon"><PolicyIcon type={p.icon} size={52} /></div>
          <Facts
            rows={[
              ['Policenummer', p.policyNo],
              ['Pris pr. år', kr(p.yearly)],
              ['Selvrisiko', p.deductible ? kr(p.deductible) : 'Ingen'],
              ['Kunde siden', fmtDate(p.since)],
              ...p.details,
            ]}
          />
        </section>
        <section className="panel">
          <h2>Det dækker forsikringen</h2>
          <ul className="checks">
            {p.coverage.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>
      </div>

      <section className="callout">
        <span className="badge">VIGTIGT</span>
        <h2>Hvornår skal du kontakte os?</h2>
        <p>{importantInfo[p.id].when}</p>
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
        <a className="btn" href={`#/skader/ny?forsikring=${p.id}`}>Anmeld en skade</a>
        <a className="btn btn-ghost" href={`#/kontakt/skriv?emne=${encodeURIComponent('Ændring af ' + p.title.toLowerCase())}`}>Skriv til GFT</a>
      </div>
    </>
  )
}
