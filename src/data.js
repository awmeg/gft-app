// Indhold baseret på fagprøve-konceptet "Nu med app!" – selskabet GFT Forsikring, kunden og alle tal er fiktive

export const company = {
  name: 'GFT Forsikring',
  phone: '+4512345678',
  phoneDisplay: '+45 12 34 56 78',
  emergencyPhone: '+4512345679',
  emergencyPhoneDisplay: '+45 12 34 56 79',
  address: 'Forsikringsvej 1, 8000 Aarhus C',
  hours: [
    ['Mandag–torsdag', '8.00–17.00'],
    ['Fredag', '8.00–16.00'],
    ['Lørdag–søndag', 'Lukket'],
  ],
}

// Faste oplysninger om forsikringstyperne. Kundens konkrete policer ligger i store.jsx (redigeres i TIA Admin)
export const policyMeta = [
  { id: 'indbo', title: 'Indboforsikring', icon: 'indbo', coverage: ['Brand, vand og tyveri', 'Ansvarsforsikring', 'Retshjælp', 'Genhusning'] },
  { id: 'ulykke', title: 'Ulykkesforsikring', icon: 'ulykke', coverage: ['Varigt mén', 'Tandskade', 'Behandlingsudgifter', 'Dødsfaldssum'] },
  { id: 'hus', title: 'Husforsikring', icon: 'hus', coverage: ['Brand', 'Husejeransvar', 'Kasko (storm, rørskade m.m.)', 'Svamp og insekt'] },
  { id: 'bil', title: 'Bilforsikring', icon: 'bil', coverage: ['Lovpligtig ansvar', 'Kasko', 'Vejhjælp', 'Glasdækning'] },
]

export const policyById = (id) => policyMeta.find((p) => p.id === id)

export const importantIntro = {
  title: 'Hvornår skal du kontakte dit selskab?',
  text:
    'Der er mange oplysninger, som er afgørende for din dækning ved skader. Disse oplysninger får vi ikke automatisk ind, så du skal selv være opmærksom på, at dine oplysninger er korrekte, for at sikre dig dækning ved skader.',
}

// "Vigtig info til dig" – ét kort pr. forsikring
export const importantInfo = {
  indbo: {
    when: 'Hvis din sum ikke længere passer til dine værdier i hjemmet, eller hvis der kommer flere i husstanden.',
    why: 'Hvis dette ikke står korrekt, kan du komme ud for underforsikring og risikere en nedsat erstatning ved skader.',
    importance:
      'Den dækker ved brand, vand og tyveri. Det er også her, du har din ansvarsforsikring, som dækker dig, hvis du gør skade på andre personer eller andre personers ting. Den hjælper dig også, hvis du skal genhuses. Den kan altså redde dig fra et enormt økonomisk tab.',
  },
  bil: {
    when: 'Hvis du kører flere kilometer årligt end noteret, hvis primær bruger ændrer sig, eller hvis en ung fører under 26 år får lov at låne bilen.',
    why: 'Hvis dette ikke står korrekt, kan der ske nedsat erstatning eller være højere selvrisiko ved skader.',
    importance:
      'Ansvar dækker skade påført med bilen på andre personer og andre personers ting. Dette er lovpligtigt. Kasko hjælper dig, hvis der sker skade på selve bilen, og kan spare dig for rigtig mange penge, hvis uheldet er ude.',
  },
  hus: {
    when: 'Hvis du laver ændringer på dit hus, ved at lave tilbygning, skifte til andet tag, få et ekstra toilet, eller hvis du skifter opvarmningsform. Det kan også være, hvis du begynder at leje dit hus ud eller beslutter at bruge dele til erhverv.',
    why: 'Hvis dette ikke står korrekt, kan der ske nedsat erstatning eller slet ikke være dækning ved visse skader.',
    importance:
      'Dækker som minimum ved brand, så du ikke selv skal betale millioner for et nyt hus. Har du kasko på, er det også her, du har dit husejeransvar. Alle tilvalg hjælper dig mod store udgifter.',
  },
  ulykke: {
    when: 'Hvis du skifter job eller påbegynder en ny farlig sport eller hobby.',
    why: 'Hvis dette ikke står korrekt, kan der ske nedsat erstatning eller slet ikke være dækning ved visse skader, hvis der ikke er tilvalgt ekstra dækning.',
    importance:
      'Sikrer dig økonomisk støtte, hvis du kommer ud for en ulykke, der giver varige mén. Det kan hjælpe dig godt videre og gøre hverdagen lettere på trods af nedsat funktion.',
    sports: true,
  },
}

// Skader
export const claimStatuses = {
  received: { label: 'Modtaget', tone: 'neutral' },
  processing: { label: 'Under behandling', tone: 'warn' },
  approved: { label: 'Godkendt', tone: 'ok' },
  paid: { label: 'Godkendt og udbetalt', tone: 'ok' },
  rejected: { label: 'Afvist', tone: 'bad' },
}

export const claims = [
  {
    id: 'SK-2026-11877',
    policyId: 'bil',
    title: 'Parkeringsskade på bil',
    created: '2026-10-03',
    incident: '2026-10-01',
    status: 'processing',
    handler: 'Peter Holm',
    location: 'Parkeringskælder, Aarhus C',
    description:
      'Bilen blev ramt af en anden bil under parkering. Venstre bagdør og bagskærm er bulet, og lakken er ridset. Modparten efterlod en seddel med navn og telefonnummer.',
    estimate: 14800,
    deductible: 4000,
    payout: null,
    documents: ['Fotos af skaden (4)', 'Seddel fra modpart', 'Tilbud fra værksted'],
    nextStep: 'Vi venter på svar fra modpartens forsikringsselskab. Du hører fra os senest 24. oktober.',
    timeline: [
      ['2026-10-03', 'Skade anmeldt i appen'],
      ['2026-10-04', 'Sagsbehandler Peter Holm tilknyttet'],
      ['2026-10-07', 'Tilbud fra værksted modtaget'],
      ['2026-10-09', 'Modpartens selskab kontaktet'],
    ],
  },
  {
    id: 'SK-2026-09412',
    policyId: 'indbo',
    title: 'Vandskade i køkken',
    created: '2026-08-12',
    incident: '2026-08-11',
    status: 'paid',
    handler: 'Sara Lund',
    location: 'Lærkevej 4, 2. th., 8000 Aarhus C',
    description:
      'Slangen til opvaskemaskinen sprang, og vandet løb ud over køkkengulvet i løbet af natten. Køkkenskabe, gulvtæppet i stuen og en kaffemaskine blev beskadiget.',
    estimate: 20950,
    deductible: 2500,
    payout: 18450,
    documents: ['Fotos af skaden (7)', 'Kvittering for kaffemaskine', 'Rapport fra skadeservice'],
    nextStep: 'Sagen er afsluttet. Erstatningen er udbetalt til din NemKonto.',
    timeline: [
      ['2026-08-12', 'Skade anmeldt telefonisk'],
      ['2026-08-13', 'Skadeservice sendt ud til affugtning'],
      ['2026-08-20', 'Taksator besigtigede skaden'],
      ['2026-08-27', 'Skaden godkendt'],
      ['2026-08-29', '18.450 kr. udbetalt til NemKonto'],
    ],
  },
]

// Betalinger
export const paymentMethod = 'Betalingsservice ****4471'

const quarter = (indbo) => [['Indboforsikring', indbo], ['Ulykkesforsikring', 350], ['Bilforsikring', 1300]]

// Betalingshistorik. Den kommende betaling beregnes ud fra kundens aktuelle policer (se Payments.jsx)
export const paymentHistory = [
  { id: 'B-2026-10', due: '2026-10-01', paidOn: '2026-10-01', period: '1. oktober – 31. december 2026', lines: quarter(798) },
  { id: 'B-2026-07', due: '2026-07-01', paidOn: '2026-07-01', period: '1. juli – 30. september 2026', lines: quarter(798) },
  { id: 'B-2026-04', due: '2026-04-01', paidOn: '2026-04-02', period: '1. april – 30. juni 2026', lines: quarter(771) },
  { id: 'B-2026-01', due: '2026-01-02', paidOn: '2026-01-02', period: '1. januar – 31. marts 2026', lines: quarter(771) },
  { id: 'B-2025-10', due: '2025-10-01', paidOn: '2025-10-01', period: '1. oktober – 31. december 2025', lines: quarter(771) },
]

export const paymentTotal = (p) => p.lines.reduce((s, [, v]) => s + v, 0)

// Overskudsdeling
export const surplus = {
  current: { year: 2026, amount: 1845, paidOn: '2026-05-15' },
  history: [
    { year: 2022, amount: 1210 },
    { year: 2023, amount: 1380 },
    { year: 2024, amount: 1520 },
    { year: 2025, amount: 1690 },
    { year: 2026, amount: 1845 },
  ],
  explanation:
    'Hos GFT Forsikring deler vi overskuddet med vores kunder. Når året har givet overskud, får du en del af det tilbage – beregnet ud fra din samlede præmie, og hvor længe du har været kunde.',
}

// Mine fordele (fiktive partnere)
export const benefits = [
  {
    id: 'cykel',
    title: '15% på cykelhjelme',
    partner: 'Cykelkælderen',
    category: 'Sikkerhed',
    text: 'Få 15% rabat på alle cykelhjelme og cykellygter. Gælder i butik og online.',
    code: 'GFT15CYKEL',
  },
  {
    id: 'roegalarm',
    title: 'Gratis røgalarm',
    partner: 'TrygtHjem',
    category: 'Bolig',
    text: 'Som kunde med indboforsikring får du en gratis røgalarm med 10 års batteri.',
    code: 'ROEG-2026-4471',
  },
  {
    id: 'vejhjaelp',
    title: '20% på udvidet vejhjælp',
    partner: 'VejHjælp Danmark',
    category: 'Bil',
    text: 'Udvid din vejhjælp med dækning i hele Europa og lånebil i op til 3 dage.',
    code: 'GFTVEJ20',
  },
  {
    id: 'vandstop',
    title: '500 kr. rabat på vandstop',
    partner: 'AquaSikring',
    category: 'Bolig',
    text: 'En automatisk vandstopper lukker for vandet, hvis der opstår en lækage. Få 500 kr. rabat på montering.',
    code: 'AQUA500',
  },
]

export const nav = [
  { path: '/', label: 'Overblik' },
  { path: '/vigtig-info', label: 'Vigtig info til dig', isNew: true },
  { path: '/forsikringer', label: 'Forsikringer' },
  { path: '/skader', label: 'Skader' },
  { path: '/betaling', label: 'Betaling' },
  { path: '/overskudsdeling', label: 'Overskudsdeling' },
  { path: '/fordele', label: 'Mine fordele' },
  { path: '/kontakt', label: 'Kontakt' },
]
