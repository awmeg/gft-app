// Regelmotor: sammenligner kundens data før og efter en ændring i TIA Admin
// og finder de beskeder, der automatisk skal sendes til kunden.
import { policyById } from './data.js'

const money = new Intl.NumberFormat('da-DK', { maximumFractionDigits: 0 })
const kr = (n) => `${money.format(n)} kr.`
const km = (n) => `${money.format(n)} km`

export const OCCUPATIONS = ['Kontorarbejde', 'Pædagog', 'Sygeplejerske', 'Håndværker', 'Landmand', 'Studerende', 'Selvstændig']
export const SPORTS = ['Motorsport', 'Luftsport/flyvning', 'Klatring', 'Hestesport', 'Kampsport', 'Vintersport i udlandet', 'Cykelsport (MTB/BMX)']

// Felter pr. police – bruges både til formularen i admin og til visningen i kundens app
export const FIELDS = {
  indbo: [
    { key: 'sum', label: 'Indbosum', type: 'number', step: 50000, fmt: kr },
    { key: 'elektronik', label: 'Tilvalg: elektronikdækning', type: 'bool' },
  ],
  ulykke: [
    { key: 'sum', label: 'Forsikringssum', type: 'number', step: 100000, fmt: kr },
    { key: 'occupation', label: 'Beskæftigelse', type: 'select', options: OCCUPATIONS },
    { key: 'sports', label: 'Risikosport', type: 'multi', options: SPORTS },
    { key: 'farligSport', label: 'Tilvalg: farlig sport', type: 'bool' },
  ],
  bil: [
    { key: 'car', label: 'Bil', type: 'text' },
    { key: 'kmYear', label: 'Kørsel pr. år', type: 'number', step: 5000, fmt: km },
    { key: 'primaryDriver', label: 'Primær bruger', type: 'driver' },
    { key: 'youngDriverCover', label: 'Tilvalg: selvrisikosikring for ung fører', type: 'bool' },
    { key: 'superelitebarn', label: 'Tilvalg: superelitebarn', type: 'bool' },
  ],
  hus: [
    { key: 'area', label: 'Boligareal', type: 'number', step: 5, fmt: (n) => `${n} m²` },
    { key: 'roof', label: 'Tag', type: 'select', options: ['Tegl', 'Eternit', 'Paptag', 'Stråtag'] },
    { key: 'heating', label: 'Opvarmning', type: 'select', options: ['Fjernvarme', 'Varmepumpe', 'Naturgas', 'Oliefyr', 'Brændeovn'] },
    { key: 'toilets', label: 'Antal toiletter', type: 'number', step: 1 },
    { key: 'rentedOut', label: 'Udlejes helt eller delvist', type: 'bool' },
    { key: 'business', label: 'Erhverv på adressen', type: 'bool' },
  ],
}

export function fmtField(field, value, state) {
  if (field.type === 'bool') return value ? 'Ja' : 'Nej'
  if (field.type === 'multi') return value.length ? value.join(', ') : 'Ingen'
  if (field.type === 'driver') return state.household.find((m) => m.id === value)?.name ?? 'Ukendt'
  return field.fmt ? field.fmt(value) : String(value)
}

// Simpel, fiktiv prismodel
export function yearlyPrice(id, p) {
  switch (id) {
    case 'indbo':
      return Math.round(p.sum * 0.0036 + (p.elektronik ? 384 : 0))
    case 'ulykke':
      return Math.round((p.sum / 1000) * 1.4 + (p.farligSport ? 720 : 0) + (p.occupation === 'Håndværker' || p.occupation === 'Landmand' ? 480 : 0))
    case 'bil':
      return Math.round(3800 + p.kmYear * 0.07 + (p.youngDriverCover ? 960 : 0) + (p.superelitebarn ? 1440 : 0))
    case 'hus':
      return Math.round(p.area * 42 + (p.heating === 'Oliefyr' ? 600 : 0) + (p.roof === 'Stråtag' ? 2400 : 0) + (p.toilets - 1) * 180 + (p.rentedOut ? 900 : 0) + (p.business ? 1200 : 0))
    default:
      return 0
  }
}

export const totalYearly = (state) => Object.entries(state.policies).reduce((s, [id, p]) => s + yearlyPrice(id, p), 0)

// ---------- Beskedskabeloner (tekster fra fagprøven) ----------
const T = {
  fyldt18: (m) => ({
    kind: 'råd', policyId: 'indbo',
    title: `${m.name.split(' ')[0]} er fyldt 18 år`,
    body: [
      `Vi kan se, at ${m.name} er fyldt 18 år. Skal ${m.name.split(' ')[0]} blive boende hjemme? Flytter ${m.name.split(' ')[0]} ud? Det skal rettes til på husstanden. Du har også muligheden for at hjælpe godt på vej med dækningen “udeboende barn under 26”.`,
      'Dit voksne barn skal også have en voksenulykkesforsikring i eget navn og med korrekt beskæftigelse på.',
    ],
  }),
  ungFoerer: () => ({
    kind: 'råd', policyId: 'bil',
    title: 'Ung fører i hjemmet – undgå forhøjet selvrisiko',
    body: [
      'Vi kan se, at I nu både har bil og en ung under 26 år i hjemmet. Hvis en person under 26 år laver en skade, vil der være en forhøjet selvrisiko på 6.000 kroner ud over egen selvrisiko.',
      'Denne kan I undgå ved at tilvælge “selvrisikosikring for ung fører”.',
      'I kan også hjælpe jeres unge bilist med at optjene anciennitet og samtidig sikre jer mod den forhøjede selvrisiko ved at tilvælge “superelitebarn”.',
      'Du er velkommen til at kontakte os for yderligere information, eller hvis du ønsker en af disse tilvalgt.',
    ],
  }),
  nyIHusstand: (m) => ({
    kind: 'råd', policyId: 'indbo',
    title: 'Ny i husstanden – passer din indbosum stadig?',
    body: [
      `Vi kan se, at ${m.name} er blevet en del af husstanden. Når der kommer flere i husstanden, kommer der ofte også flere ting i hjemmet.`,
      'Tjek gerne, om din indbosum stadig passer, så du undgår underforsikring og nedsat erstatning ved skader.',
    ],
  }),
  udeboende: (m) => ({
    kind: 'råd', policyId: 'indbo',
    title: `${m.name.split(' ')[0]} er flyttet hjemmefra`,
    body: [
      `Vi kan se, at ${m.name} ikke længere er en del af husstanden. Er ${m.name.split(' ')[0]} under 26 år, kan dækningen “udeboende barn under 26” give tryghed i den første tid i egen bolig.`,
      'Husk også, at en ulykkesforsikring skal stå i eget navn og med korrekt beskæftigelse.',
    ],
  }),
  nytHus: () => ({
    kind: 'råd', policyId: 'indbo',
    title: 'Nyt hus – passer din indbosum stadig?',
    body: [
      'Vi kan se, at du er flyttet fra lejlighed til hus. Måske har du flere kvadratmeter at fylde ud og dermed flere værdier, der skal dækkes på din indboforsikring. Tjek gerne, om din indbosum stadig passer.',
    ],
  }),
  adresseIndbo: () => ({
    kind: 'råd', policyId: 'indbo',
    title: 'Adresseskift – passer din indbosum stadig?',
    body: [
      'Vi kan se, at du har skiftet adresse. Måske har du flere kvadratmeter at fylde ud eller har købt nye indbogenstande og dermed flere værdier, der skal dækkes på din indboforsikring. Tjek gerne, om din indbosum stadig passer.',
    ],
  }),
  adresseKoersel: () => ({
    kind: 'råd', policyId: 'bil',
    title: 'Adresseskift – har du samme kørselsbehov?',
    body: ['Hvis din nye adresse er længere fra dit arbejde, kan det være, at dit årlige kilometerforbrug skal sættes op. Hvis det ikke står korrekt, kan der ske nedsat erstatning eller være højere selvrisiko ved skader.'],
  }),
  erhverv: () => ({
    kind: 'råd', policyId: 'hus',
    title: 'Erhverv på samme adresse som dit hus',
    body: [
      'Vi kan se, at der nu drives erhverv fra din adresse. Husk, at dette skal noteres på din husforsikring – ellers kan der ske nedsat erstatning eller slet ikke være dækning ved visse skader.',
      'Har du brug for en erhvervsforsikring, hjælper vi gerne.',
    ],
  }),
  nyBeskaeftigelse: (occ) => ({
    kind: 'råd', policyId: 'ulykke',
    title: 'Nyt job – er din ulykkesforsikring korrekt?',
    body: [
      `Din beskæftigelse er nu registreret som “${occ}”. Beskæftigelsen har betydning for din dækning på ulykkesforsikringen.`,
      'Hvis beskæftigelsen ikke står korrekt, kan der ske nedsat erstatning ved skader. Kontakt os, hvis noget ikke passer.',
    ],
  }),
  risikosport: (sports) => ({
    kind: 'råd', policyId: 'ulykke',
    title: 'Ny risikosport – er du dækket?',
    body: [
      `Vi kan se, at du nu dyrker ${sports.join(' og ').toLowerCase()}. Ulykker under risikosport og højrisikosport er ikke dækket, medmindre du har tilvalgt dækning for farlig sport.`,
      'Kontakt os, hvis du ønsker tilvalget, så du er sikret, hvis uheldet er ude.',
    ],
  }),
  velkommenHus: (p) => ({
    kind: 'bekræftelse', policyId: 'hus',
    title: 'Velkommen til din nye husforsikring',
    body: [`Din husforsikring (police ${p.policyNo}) er oprettet og gælder fra i dag.`, `Årlig pris: ${kr(yearlyPrice('hus', p))}.`],
  }),
  policeAendret: (id, lines, before, after) => ({
    kind: 'bekræftelse', policyId: id,
    title: `Din ${policyById(id).title.toLowerCase()} er ændret`,
    body: [
      'Vi har opdateret din forsikring med følgende ændringer:',
      ...lines.map((l) => '• ' + l),
      before !== after ? `Ny årlig pris: ${kr(after)} (før ${kr(before)}).` : 'Prisen er uændret.',
    ],
  }),
}

let seq = 0
const stamp = (m) => ({ ...m, id: `msg-${Date.now().toString(36)}-${seq++}`, date: new Date().toISOString().slice(0, 10) })

// Returnerer { changes: [[område, felt, før, efter]], messages: [...] }
export function computeChanges(prev, next) {
  const changes = []
  const messages = []
  const sent = new Set()
  const send = (key, m) => {
    if (!sent.has(key)) {
      sent.add(key)
      messages.push(m)
    }
  }
  const bil = next.policies.bil
  const youngInHome = (state) => state.household.some((m) => m.age >= 18 && m.age < 26)

  // Kunde
  const pc = prev.customer
  const nc = next.customer
  if (pc.address !== nc.address) changes.push(['Kunde', 'Adresse', pc.address, nc.address])
  if (pc.housing !== nc.housing) changes.push(['Kunde', 'Boligtype', pc.housing, nc.housing])
  const toHouse = pc.housing !== 'hus' && nc.housing === 'hus'
  if (toHouse) send('nytHus', T.nytHus())
  if (pc.address !== nc.address) {
    if (!toHouse) send('adresseIndbo', T.adresseIndbo())
    if (bil) send('koersel', T.adresseKoersel())
  }

  // Husstand
  const prevById = Object.fromEntries(prev.household.map((m) => [m.id, m]))
  const nextIds = new Set(next.household.map((m) => m.id))
  for (const m of next.household) {
    const p = prevById[m.id]
    if (!p) {
      changes.push(['Husstand', 'Ny person', '–', `${m.name} (${m.relation}, ${m.age} år)`])
      send('ny-' + m.id, T.nyIHusstand(m))
    } else {
      if (p.name !== m.name) changes.push(['Husstand', 'Navn', p.name, m.name])
      if (p.age !== m.age) changes.push(['Husstand', `Alder, ${m.name}`, `${p.age} år`, `${m.age} år`])
      if (p.relation !== m.relation) changes.push(['Husstand', `Relation, ${m.name}`, p.relation, m.relation])
    }
    const wasAdult = p ? p.age >= 18 : false
    if (m.age >= 18 && !wasAdult && m.relation === 'Barn') send('18-' + m.id, T.fyldt18(m))
  }
  for (const p of prev.household) {
    if (!nextIds.has(p.id)) {
      changes.push(['Husstand', 'Fraflyttet', p.name, '–'])
      if (p.relation === 'Barn' && p.age < 26) send('ude-' + p.id, T.udeboende(p))
    }
  }
  // Ung fører: bil + ung (18–25) i husstanden, som ikke var der før, og intet tilvalg
  if (bil && !bil.youngDriverCover && youngInHome(next) && !youngInHome(prev)) send('ungFoerer', T.ungFoerer())

  // Policer
  for (const id of Object.keys(FIELDS)) {
    const a = prev.policies[id]
    const b = next.policies[id]
    const title = policyById(id).title
    if (!a && b) {
      changes.push([title, 'Police', '–', 'Oprettet'])
      send('ny-' + id, id === 'hus' ? T.velkommenHus(b) : { kind: 'bekræftelse', policyId: id, title: `Din ${title.toLowerCase()} er oprettet`, body: [`Årlig pris: ${kr(yearlyPrice(id, b))}.`] })
      continue
    }
    if (a && !b) {
      changes.push([title, 'Police', 'Aktiv', 'Opsagt'])
      send('opsagt-' + id, { kind: 'bekræftelse', policyId: id, title: `Din ${title.toLowerCase()} er opsagt`, body: ['Forsikringen er opsagt. Kontakt os, hvis det er en fejl.'] })
      continue
    }
    if (!a || !b) continue

    const lines = []
    for (const f of FIELDS[id]) {
      if (JSON.stringify(a[f.key]) === JSON.stringify(b[f.key])) continue
      const from = fmtField(f, a[f.key], prev)
      const to = fmtField(f, b[f.key], next)
      changes.push([title, f.label, from, to])
      lines.push(`${f.label}: ${from} → ${to}`)
    }
    if (lines.length) send('ændret-' + id, T.policeAendret(id, lines, yearlyPrice(id, a), yearlyPrice(id, b)))

    // Rådgivningsregler pr. felt
    if (id === 'ulykke') {
      if (a.occupation !== b.occupation) send('job', T.nyBeskaeftigelse(b.occupation))
      const newSports = b.sports.filter((s) => !a.sports.includes(s))
      if (newSports.length && !b.farligSport) send('sport', T.risikosport(newSports))
    }
    if (id === 'hus' && !a.business && b.business) send('erhverv', T.erhverv())
    if (id === 'bil' && a.primaryDriver !== b.primaryDriver && !b.youngDriverCover) {
      const driver = next.household.find((m) => m.id === b.primaryDriver)
      if (driver && driver.age < 26) send('ungFoerer', T.ungFoerer())
    }
  }

  return { changes, messages: messages.map(stamp) }
}
