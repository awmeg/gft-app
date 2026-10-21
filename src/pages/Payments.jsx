import { useState } from 'react'
import { paymentHistory, paymentTotal, paymentMethod, policyById } from '../data.js'
import { ChevronIcon } from '../icons.jsx'
import { PageHead, Facts, Pill, kr, fmtDate } from '../lib.jsx'
import { useStore } from '../store.jsx'
import { yearlyPrice, totalYearly } from '../rules.js'

// Næste opkrævning beregnes ud fra kundens aktuelle policer, så ændringer i TIA Admin slår igennem
export const upcomingPayment = (state) => ({
  id: 'B-2027-01',
  due: '2027-01-02',
  status: 'upcoming',
  period: '1. januar – 31. marts 2027',
  lines: Object.entries(state.policies).map(([id, p]) => [policyById(id).title, Math.round(yearlyPrice(id, p) / 4)]),
})

const allPayments = (state) => [upcomingPayment(state), ...paymentHistory.map((p) => ({ ...p, status: 'paid' }))]

const statusPill = (p) => (p.status === 'paid' ? <Pill tone="ok">Betalt</Pill> : <Pill tone="warn">Kommende</Pill>)

export function PaymentList() {
  const { state } = useStore()
  const next = upcomingPayment(state)
  const history = allPayments(state).filter((p) => p.status === 'paid')
  const years = [...new Set(history.map((p) => p.due.slice(0, 4)))]
  const [year, setYear] = useState(years[0])
  const yearly = totalYearly(state)

  return (
    <>
      <PageHead title="Betaling" intro="Se dine kommende og tidligere betalinger." />
      <div className="grid-2">
        <a className="panel hero" href={`#/betaling/${next.id}`}>
          <span className="tile-label">Næste betaling</span>
          <strong className="big">{kr(paymentTotal(next))}</strong>
          <span>Trækkes {fmtDate(next.due)}</span>
          <span className="muted">{next.period}</span>
        </a>
        <section className="panel">
          <h2>Betalingsoplysninger</h2>
          <Facts rows={[['Betalingsmåde', paymentMethod], ['Betales', 'Kvartalsvis'], ['Samlet pris pr. år', kr(yearly)]]} />
        </section>
      </div>

      <div className="toolbar">
        <h2 className="section-title">Tidligere betalinger</h2>
        <div className="segmented">
          {years.map((y) => (
            <button key={y} className={y === year ? 'on' : ''} aria-pressed={y === year} onClick={() => setYear(y)}>{y}</button>
          ))}
        </div>
      </div>
      <ul className="list">
        {history.filter((p) => p.due.startsWith(year)).map((p) => (
          <li key={p.id}>
            <a href={`#/betaling/${p.id}`}>
              <span className="grow">
                <strong>{p.period}</strong>
                <small>Betalt {fmtDate(p.paidOn)}</small>
              </span>
              <span className="amount">{kr(paymentTotal(p))}</span>
              {statusPill(p)}
              <ChevronIcon />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

export function PaymentDetail({ id }) {
  const { state } = useStore()
  const p = allPayments(state).find((x) => x.id === id)
  const back = { path: '/betaling', label: 'Betaling' }
  const [sent, setSent] = useState(false)
  if (!p) return <PageHead title="Betalingen findes ikke" back={back} />
  return (
    <>
      <PageHead title={p.status === 'paid' ? 'Betaling' : 'Kommende betaling'} back={back} />
      <section className="panel">
        <div className="status-row">
          {statusPill(p)}
          <span className="muted">Opkrævning {p.id}</span>
        </div>
        <Facts
          rows={[
            ['Periode', p.period],
            ['Forfaldsdato', fmtDate(p.due)],
            ['Betalt', p.paidOn ? fmtDate(p.paidOn) : 'Ikke betalt endnu'],
            ['Betalingsmåde', paymentMethod],
          ]}
        />
        <h3>Specifikation</h3>
        <table className="spec">
          <tbody>
            {p.lines.map(([name, amount]) => (
              <tr key={name}><td>{name}</td><td>{kr(amount)}</td></tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td>I alt</td><td>{kr(paymentTotal(p))}</td></tr>
          </tfoot>
        </table>
        {p.status === 'paid' && (
          <div className="actions">
            <button className="btn btn-ghost" onClick={() => setSent(true)} disabled={sent}>
              {sent ? 'Kvitteringen er sendt til din e-Boks' : 'Send kvittering til e-Boks'}
            </button>
          </div>
        )}
      </section>
    </>
  )
}
