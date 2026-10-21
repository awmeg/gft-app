import { surplus } from '../data.js'
import { PageHead, Facts, kr, fmtDate } from '../lib.jsx'

export default function Surplus() {
  const max = Math.max(...surplus.history.map((h) => h.amount))
  const total = surplus.history.reduce((s, h) => s + h.amount, 0)
  return (
    <>
      <PageHead title="Overskudsdeling" intro={surplus.explanation} />
      <div className="grid-2">
        <section className="panel hero">
          <span className="tile-label">Din andel for {surplus.current.year}</span>
          <strong className="big">{kr(surplus.current.amount)}</strong>
          <span>Udbetalt til din NemKonto {fmtDate(surplus.current.paidOn)}</span>
        </section>
        <section className="panel">
          <h2>Sådan beregnes din andel</h2>
          <Facts
            rows={[
              ['Grundlag', 'Din samlede årlige præmie'],
              ['Anciennitet', 'Kunde siden 2015 (+10%)'],
              ['Udbetaling', 'Hvert år i maj'],
              [`I alt siden ${surplus.history[0].year}`, kr(total)],
            ]}
          />
        </section>
      </div>
      <section className="panel">
        <h2>Udvikling</h2>
        <div className="bars" role="img" aria-label="Overskudsdeling pr. år">
          {surplus.history.map((h) => (
            <div key={h.year} className="bar-col">
              <span className="bar-val">{kr(h.amount)}</span>
              <div className={`bar ${h.year === surplus.current.year ? 'bar-now' : ''}`} style={{ height: `${(h.amount / max) * 100}%` }} />
              <span className="bar-year">{h.year}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
