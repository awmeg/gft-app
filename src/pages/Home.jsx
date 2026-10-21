import { policyById, surplus } from '../data.js'
import { PolicyIcon, ChevronIcon } from '../icons.jsx'
import { kr, fmtDate } from '../lib.jsx'
import { useStore } from '../store.jsx'
import { upcomingPayment } from './Payments.jsx'
import { paymentTotal } from '../data.js'

export default function Home({ claims, unread, adviceCount }) {
  const { state } = useStore()
  const next = upcomingPayment(state)
  const openClaims = claims.filter((c) => !['paid', 'rejected'].includes(c.status)).length
  const firstName = state.customer.name.split(' ')[0]

  return (
    <>
      <div className="page-head">
        <h1>Hej {firstName}</h1>
        <p>Her er dit overblik over forsikringer, skader og betalinger.</p>
      </div>

      <div className="tiles">
        <a className="tile" href="#/betaling">
          <span className="tile-label">Næste betaling</span>
          <strong>{kr(paymentTotal(next))}</strong>
          <span className="tile-sub">{fmtDate(next.due)}</span>
        </a>
        <a className="tile" href="#/skader">
          <span className="tile-label">Åbne skader</span>
          <strong>{openClaims}</strong>
          <span className="tile-sub">{claims.length} skader i alt</span>
        </a>
        <a className="tile" href="#/overskudsdeling">
          <span className="tile-label">Overskudsdeling {surplus.current.year}</span>
          <strong>{kr(surplus.current.amount)}</strong>
          <span className="tile-sub">Udbetalt {fmtDate(surplus.current.paidOn)}</span>
        </a>
        <a className="tile" href="#/beskeder">
          <span className="tile-label">Ulæste beskeder</span>
          <strong>{unread}</strong>
          <span className="tile-sub">Gode råd til korrekt dækning</span>
        </a>
      </div>

      <div className="row-head">
        <h2>Dine forsikringer</h2>
        <a className="link" href="#/forsikringer">Se din forsikringsoversigt</a>
      </div>
      <ul className="list policy-list">
        {Object.entries(state.policies).map(([id, p]) => {
          const meta = policyById(id)
          return (
            <li key={id}>
              <a href={`#/forsikringer/${id}`}>
                <PolicyIcon type={meta.icon} />
                <span className="grow">
                  <strong>{meta.title}</strong>
                  <small>Police {p.policyNo}</small>
                </span>
                <ChevronIcon />
              </a>
            </li>
          )
        })}
      </ul>

      <div className="two-col">
        <a className={`tip ${adviceCount ? 'tip-alert' : ''}`} href="#/vigtig-info">
          <strong>
            Vigtig info til dig
            {adviceCount > 0 && <span className="count">{adviceCount}</span>}
          </strong>
          <span>
            {adviceCount > 0
              ? `Der er sket ændringer, som kan have betydning for din dækning. Du har ${adviceCount} ${adviceCount === 1 ? 'punkt' : 'punkter'}, du bør tjekke.`
              : 'Vi anbefaler, at du kigger under “Vigtig info til dig” i menuen. Her er hjælp til, hvordan du sikrer dig, at dine oplysninger er korrekte.'}
          </span>
          <span className="tip-cta">{adviceCount > 0 ? 'Se hvad du skal tjekke →' : 'Læs mere →'}</span>
        </a>
        <div className="banner">
          <h3>Mangler der noget?</h3>
          <p>
            Måske står nogle af husstandens forsikringer ikke i dit navn. For at få et bedre overblik anbefaler vi, at
            alle i husstanden giver tilladelse til at se hinandens forsikringer.
          </p>
        </div>
      </div>
    </>
  )
}
