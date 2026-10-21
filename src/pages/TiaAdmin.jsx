import { useEffect, useMemo, useState } from 'react'
import { policyById, policyMeta } from '../data.js'
import { Modal, fmtDate, kr } from '../lib.jsx'
import { useStore, clone, newHousePolicy } from '../store.jsx'
import { FIELDS, computeChanges, yearlyPrice, totalYearly } from '../rules.js'

const RELATIONS = ['Forsikringstager', 'Ægtefælle', 'Samlever', 'Barn', 'Andet']

// Færdige scenarier til demo – de ændrer kun kladden; rådgiveren gemmer selv
const SCENARIOS = [
  { label: 'Emma fylder 18 år', run: (n) => { const e = n.household.find((m) => m.id === 'emma'); if (e) e.age = Math.max(e.age, 18) } },
  { label: 'Familien flytter til hus', run: (n) => { n.customer.address = 'Strandvejen 12, 8240 Risskov'; n.customer.housing = 'hus'; n.policies.hus ??= newHousePolicy() } },
  { label: 'Driver erhverv fra huset', needs: (n) => !!n.policies.hus, run: (n) => { n.policies.hus.business = true } },
  { label: 'Nyt job som håndværker', run: (n) => { if (n.policies.ulykke) n.policies.ulykke.occupation = 'Håndværker' } },
  { label: 'Begynder til motorsport', run: (n) => { const u = n.policies.ulykke; if (u && !u.sports.includes('Motorsport')) u.sports.push('Motorsport') } },
  { label: 'Kører 30.000 km om året', run: (n) => { if (n.policies.bil) n.policies.bil.kmYear = 30000 } },
  { label: 'Emma flytter hjemmefra', run: (n) => { n.household = n.household.filter((m) => m.id !== 'emma') } },
  { label: 'Ny person flytter ind', run: (n) => { if (!n.household.some((m) => m.id === 'karen')) n.household.push({ id: 'karen', name: 'Karen Sørensen', relation: 'Andet', age: 72 }) } },
]

export default function TiaAdmin() {
  const { state, save, reset } = useStore()
  const [draft, setDraft] = useState(() => clone(state))
  const [tab, setTab] = useState('kunde')
  const [reviewing, setReviewing] = useState(false)
  const [toast, setToast] = useState(null)

  // Ny kladde, når de gemte data ændrer sig (efter gem, nulstil eller ændring i en anden fane)
  useEffect(() => setDraft(clone(state)), [state])

  const { changes, messages } = useMemo(() => computeChanges(state, draft), [state, draft])
  const dirty = changes.length > 0
  const update = (fn) => setDraft((d) => { const n = clone(d); fn(n); return n })

  const commit = () => {
    const res = computeChanges(state, draft)
    const at = new Date().toISOString()
    save({
      ...draft,
      messages: [...res.messages, ...state.messages],
      log: [...res.changes.map(([area, field, from, to]) => ({ at, area, field, from, to })), ...state.log],
    })
    setReviewing(false)
    setToast(`${res.changes.length} ${res.changes.length === 1 ? 'ændring' : 'ændringer'} gemt i TIA · ${res.messages.length} ${res.messages.length === 1 ? 'besked' : 'beskeder'} sendt til kunden`)
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(t)
  }, [toast])

  const customerAppUrl = window.location.pathname + '#/beskeder'

  return (
    <div className="tia">
      <header className="tia-top">
        <div className="tia-brand">
          <span className="tia-mark">TIA</span>
          <span>
            <strong>TIA Admin</strong>
            <small>Policeadministration</small>
          </span>
          <span className="tia-env">SIMULERING</span>
        </div>
        <div className="tia-user">
          <span>Rådgiver: Lars Nielsen</span>
          <a href="#/">← Til kundens app</a>
        </div>
      </header>

      <div className="tia-body">
        <aside className="tia-side">
          <section className="tia-box">
            <h3>Kunde</h3>
            <strong>{state.customer.name}</strong>
            <span>Kundenr. {state.customer.customerNo}</span>
            <span>{state.customer.address}</span>
            <span>{Object.keys(state.policies).length} policer · {kr(totalYearly(state))}/år</span>
          </section>

          <section className="tia-box">
            <h3>Scenarier</h3>
            <p className="tia-hint">Klik for at lave ændringen i kladden. Gem derefter for at sende beskeder.</p>
            {SCENARIOS.map((s) => {
              const disabled = s.needs && !s.needs(draft)
              return (
                <button key={s.label} className="tia-scenario" disabled={disabled} title={disabled ? 'Kræver husforsikring' : ''} onClick={() => update(s.run)}>
                  {s.label}
                </button>
              )
            })}
          </section>

          <section className="tia-box">
            <h3>Demo</h3>
            <a className="tia-btn tia-btn-ghost" href={customerAppUrl} target="_blank" rel="noreferrer">Åbn kundens app i ny fane ↗</a>
            <button className="tia-btn tia-btn-danger" onClick={() => { if (confirm('Nulstil alle data og beskeder til start?')) { reset(); setToast('Demo nulstillet') } }}>
              Nulstil demo
            </button>
          </section>
        </aside>

        <main className="tia-main">
          <nav className="tia-tabs" role="tablist">
            {[
              ['kunde', 'Kunde & husstand'],
              ['policer', 'Policer'],
              ['kommunikation', `Kommunikation (${state.messages.length})`],
              ['log', 'Hændelseslog'],
            ].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
            ))}
          </nav>

          {tab === 'kunde' && <CustomerTab draft={draft} update={update} />}
          {tab === 'policer' && <PoliciesTab draft={draft} saved={state} update={update} />}
          {tab === 'kommunikation' && <CommsTab messages={state.messages} handled={state.handled ?? []} />}
          {tab === 'log' && <LogTab log={state.log} />}
        </main>
      </div>

      {dirty && (
        <div className="tia-bar">
          <span>
            <strong>{changes.length} {changes.length === 1 ? 'ændring' : 'ændringer'}</strong> i kladden ·{' '}
            {messages.length} automatiske {messages.length === 1 ? 'besked' : 'beskeder'} til kunden
          </span>
          <span className="tia-bar-actions">
            <button className="tia-btn tia-btn-ghost" onClick={() => setDraft(clone(state))}>Fortryd</button>
            <button className="tia-btn" onClick={() => setReviewing(true)}>Gennemse og gem</button>
          </span>
        </div>
      )}

      {toast && (
        <div className="tia-toast" role="status">
          {toast} <a href={customerAppUrl} target="_blank" rel="noreferrer">Se kundens beskeder ↗</a>
        </div>
      )}

      {reviewing && (
        <Modal onClose={() => setReviewing(false)} label="Gennemse ændringer">
          <div className="tia-review">
            <h2>Gennemse ændringer</h2>
            <table className="tia-table">
              <thead><tr><th>Område</th><th>Felt</th><th>Før</th><th>Efter</th></tr></thead>
              <tbody>
                {changes.map(([a, f, from, to], i) => (
                  <tr key={i}><td>{a}</td><td>{f}</td><td className="tia-old">{from}</td><td className="tia-new">{to}</td></tr>
                ))}
              </tbody>
            </table>
            <h3>Beskeder der sendes automatisk ({messages.length})</h3>
            {messages.length ? (
              <ul className="tia-msgs">
                {messages.map((m) => (
                  <li key={m.id}>
                    <span className={`tia-kind tia-kind-${m.kind === 'råd' ? 'raad' : 'bekr'}`}>{m.kind === 'råd' ? 'Rådgivning' : 'Bekræftelse'}</span>
                    <strong>{m.title}</strong>
                    <p>{m.body[0]}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tia-hint">Ingen regler blev udløst – ændringen gemmes uden besked til kunden.</p>
            )}
            <button className="tia-btn tia-btn-wide" onClick={commit}>
              Gem i TIA{messages.length ? ` og send ${messages.length} ${messages.length === 1 ? 'besked' : 'beskeder'}` : ''}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function CustomerTab({ draft, update }) {
  const [newPerson, setNewPerson] = useState({ name: '', relation: 'Barn', age: '' })
  const c = draft.customer

  const setHousing = (housing) =>
    update((n) => {
      n.customer.housing = housing
      if (housing === 'hus') n.policies.hus ??= newHousePolicy()
      else delete n.policies.hus
    })

  const addPerson = (e) => {
    e.preventDefault()
    update((n) => n.household.push({ id: 'p' + Date.now(), name: newPerson.name, relation: newPerson.relation, age: Number(newPerson.age) }))
    setNewPerson({ name: '', relation: 'Barn', age: '' })
  }

  return (
    <>
      <section className="tia-panel">
        <h2>Kundeoplysninger</h2>
        <div className="tia-grid">
          <label>Navn<input value={c.name} disabled /></label>
          <label>Kundenummer<input value={c.customerNo} disabled /></label>
          <label className="tia-span2">Adresse<input value={c.address} onChange={(e) => update((n) => { n.customer.address = e.target.value })} /></label>
          <label>
            Boligtype
            <select value={c.housing} onChange={(e) => setHousing(e.target.value)}>
              <option value="lejlighed">Lejlighed</option>
              <option value="hus">Hus</option>
            </select>
          </label>
        </div>
        {c.housing === 'hus' && <p className="tia-hint">Boligtype “Hus” opretter automatisk en husforsikring. Skift tilbage for at opsige den.</p>}
      </section>

      <section className="tia-panel">
        <h2>Husstand</h2>
        <table className="tia-table tia-edit">
          <thead><tr><th>Navn</th><th>Relation</th><th>Alder</th><th /></tr></thead>
          <tbody>
            {draft.household.map((m, i) => (
              <tr key={m.id}>
                <td><input value={m.name} onChange={(e) => update((n) => { n.household[i].name = e.target.value })} /></td>
                <td>
                  <select value={m.relation} disabled={m.relation === 'Forsikringstager'} onChange={(e) => update((n) => { n.household[i].relation = e.target.value })}>
                    {RELATIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="tia-age">
                  <input type="number" min="0" max="120" value={m.age} onChange={(e) => update((n) => { n.household[i].age = Number(e.target.value) })} />
                </td>
                <td>
                  {m.relation !== 'Forsikringstager' && (
                    <button className="tia-link" onClick={() => update((n) => { n.household.splice(i, 1) })}>Fraflyt</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form className="tia-add" onSubmit={addPerson}>
          <input required placeholder="Navn" value={newPerson.name} onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })} />
          <select value={newPerson.relation} onChange={(e) => setNewPerson({ ...newPerson, relation: e.target.value })}>
            {RELATIONS.filter((r) => r !== 'Forsikringstager').map((r) => <option key={r}>{r}</option>)}
          </select>
          <input required type="number" min="0" max="120" placeholder="Alder" value={newPerson.age} onChange={(e) => setNewPerson({ ...newPerson, age: e.target.value })} />
          <button className="tia-btn" type="submit">Tilføj person</button>
        </form>
      </section>
    </>
  )
}

function PoliciesTab({ draft, saved, update }) {
  return (
    <>
      {policyMeta.map(({ id, title }) => {
        const p = draft.policies[id]
        if (!p) {
          return (
            <section key={id} className="tia-panel tia-muted">
              <h2>{title}</h2>
              <p className="tia-hint">Kunden har ikke denne forsikring.{id === 'hus' && ' Opret den ved at sætte boligtype til “Hus”.'}</p>
            </section>
          )
        }
        const before = saved.policies[id] ? yearlyPrice(id, saved.policies[id]) : null
        const now = yearlyPrice(id, p)
        return (
          <section key={id} className="tia-panel">
            <div className="tia-panel-head">
              <h2>{title}</h2>
              <span className="tia-meta">Police {p.policyNo} · Årlig pris <strong>{kr(now)}</strong>{before !== null && before !== now && <em> (før {kr(before)})</em>}</span>
            </div>
            <div className="tia-grid">
              {FIELDS[id].map((f) => (
                <Field key={f.key} field={f} value={p[f.key]} household={draft.household} onChange={(v) => update((n) => { n.policies[id][f.key] = v })} />
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}

function Field({ field, value, household, onChange }) {
  switch (field.type) {
    case 'bool':
      return (
        <label className="tia-check">
          <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      )
    case 'select':
      return (
        <label>{field.label}
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
      )
    case 'driver':
      return (
        <label>{field.label}
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            {household.filter((m) => m.age >= 18).map((m) => <option key={m.id} value={m.id}>{m.name} ({m.age} år)</option>)}
          </select>
        </label>
      )
    case 'multi':
      return (
        <fieldset className="tia-span2 tia-multi">
          <legend>{field.label}</legend>
          {field.options.map((o) => (
            <label key={o} className="tia-check">
              <input type="checkbox" checked={value.includes(o)} onChange={(e) => onChange(e.target.checked ? [...value, o] : value.filter((x) => x !== o))} />
              {o}
            </label>
          ))}
        </fieldset>
      )
    case 'number':
      return (
        <label>{field.label}
          <input type="number" step={field.step} min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} />
        </label>
      )
    default:
      return (
        <label>{field.label}
          <input value={value} onChange={(e) => onChange(e.target.value)} />
        </label>
      )
  }
}

function CommsTab({ messages, handled }) {
  if (!messages.length) return <section className="tia-panel"><p className="tia-hint">Der er ikke sendt beskeder til kunden endnu. Lav en ændring og gem for at udløse regler.</p></section>
  return (
    <section className="tia-panel">
      <h2>Sendt til kunden</h2>
      <table className="tia-table">
        <thead><tr><th>Dato</th><th>Type</th><th>Emne</th><th>Police</th><th>Status hos kunden</th></tr></thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{fmtDate(m.date)}</td>
              <td><span className={`tia-kind tia-kind-${m.kind === 'råd' ? 'raad' : 'bekr'}`}>{m.kind === 'råd' ? 'Rådgivning' : 'Bekræftelse'}</span></td>
              <td>{m.title}</td>
              <td>{policyById(m.policyId)?.title}</td>
              <td>{m.kind !== 'råd' ? 'Sendt' : handled.includes(m.id) ? <span className="tia-ok">Håndteret af kunden</span> : <span className="tia-open">Åben i Vigtig info</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function LogTab({ log }) {
  if (!log.length) return <section className="tia-panel"><p className="tia-hint">Ingen hændelser endnu.</p></section>
  const time = new Intl.DateTimeFormat('da-DK', { dateStyle: 'short', timeStyle: 'short' })
  return (
    <section className="tia-panel">
      <h2>Hændelseslog</h2>
      <table className="tia-table">
        <thead><tr><th>Tidspunkt</th><th>Område</th><th>Felt</th><th>Før</th><th>Efter</th></tr></thead>
        <tbody>
          {log.map((l, i) => (
            <tr key={i}><td>{time.format(new Date(l.at))}</td><td>{l.area}</td><td>{l.field}</td><td className="tia-old">{l.from}</td><td className="tia-new">{l.to}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
