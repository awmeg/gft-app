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

export const customer = {
  name: 'Mette Sørensen',
  customerNo: '1048 2297',
  address: 'Strandvejen 12, 8240 Risskov',
}

export const policies = [
  {
    id: 'indbo',
    title: 'Indboforsikring',
    icon: 'indbo',
    policyNo: '62-118-4471',
    yearly: 2964,
    deductible: 2500,
    since: '2015-03-01',
    details: [['Indbosum', '850.000 kr.'], ['Adresse', 'Strandvejen 12, 8240 Risskov'], ['Husstand', '3 personer']],
    coverage: ['Brand, vand og tyveri', 'Ansvarsforsikring', 'Retshjælp', 'Genhusning', 'Elektronikdækning (tilvalg)'],
  },
  {
    id: 'ulykke',
    title: 'Ulykkesforsikring',
    icon: 'ulykke',
    policyNo: '62-118-4472',
    yearly: 1488,
    deductible: 0,
    since: '2015-03-01',
    details: [['Forsikringssum', '1.000.000 kr.'], ['Beskæftigelse', 'Kontorarbejde'], ['Dækker', 'Fritid og arbejde']],
    coverage: ['Varigt mén', 'Tandskade', 'Behandlingsudgifter', 'Dødsfaldssum', 'Farlig sport (ikke tilvalgt)'],
  },
  {
    id: 'hus',
    title: 'Husforsikring',
    icon: 'hus',
    policyNo: '62-118-4473',
    yearly: 6312,
    deductible: 5000,
    since: '2024-06-01',
    details: [['Boligareal', '142 m²'], ['Tag', 'Tegl'], ['Opvarmning', 'Fjernvarme']],
    coverage: ['Brand', 'Husejeransvar', 'Kasko (bygningsbrand, storm, rørskade)', 'Svamp og insekt (tilvalg)'],
  },
  {
    id: 'bil',
    title: 'Bilforsikring',
    icon: 'bil',
    policyNo: '62-118-4474',
    yearly: 5196,
    deductible: 4000,
    since: '2019-09-15',
    details: [['Bil', 'Skoda Octavia Combi, AB 12 345'], ['Kørsel pr. år', '20.000 km'], ['Primær bruger', 'Mette Sørensen']],
    coverage: ['Lovpligtig ansvar', 'Kasko', 'Vejhjælp', 'Glasdækning'],
  },
]

export const policyById = (id) => policies.find((p) => p.id === id)

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
    location: 'Strandvejen 12, 8240 Risskov',
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

const quarter = (indbo, hus) => [['Indboforsikring', indbo], ['Ulykkesforsikring', 372], ['Husforsikring', hus], ['Bilforsikring', 1299]]

export const payments = [
  { id: 'B-2027-01', due: '2027-01-02', status: 'upcoming', period: '1. januar – 31. marts 2027', lines: quarter(741, 1578) },
  { id: 'B-2026-10', due: '2026-10-01', status: 'paid', paidOn: '2026-10-01', period: '1. oktober – 31. december 2026', lines: quarter(741, 1578) },
  { id: 'B-2026-07', due: '2026-07-01', status: 'paid', paidOn: '2026-07-01', period: '1. juli – 30. september 2026', lines: quarter(741, 1578) },
  { id: 'B-2026-04', due: '2026-04-01', status: 'paid', paidOn: '2026-04-02', period: '1. april – 30. juni 2026', lines: quarter(718, 1544) },
  { id: 'B-2026-01', due: '2026-01-02', status: 'paid', paidOn: '2026-01-02', period: '1. januar – 31. marts 2026', lines: quarter(718, 1544) },
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

// Beskeder – personlige påmindelser
export const messages = [
  {
    id: 'ung-foerer',
    date: '2026-10-14',
    title: 'Ung fører i hjemmet – undgå forhøjet selvrisiko',
    body: [
      'Vi kan se, at I nu både har bil og en 18-årig i hjemmet. Hvis en person under 26 år laver en skade, vil der være en forhøjet selvrisiko på 6.000 kroner ud over egen selvrisiko.',
      'Denne kan I undgå ved at tilvælge “selvrisikosikring for ung fører”.',
      'I kan også hjælpe jeres unge bilist med at optjene anciennitet og samtidig sikre jer mod den forhøjede selvrisiko ved at tilvælge “superelitebarn”.',
      'Du er velkommen til at kontakte os for yderligere information, eller hvis du ønsker en af disse tilvalgt.',
    ],
  },
  {
    id: 'fyldt-18',
    date: '2026-10-14',
    title: 'En i husstanden er fyldt 18 år',
    body: [
      'Vi kan se, at en i husstanden er fyldt 18 år. Skal dit barn blive boende hjemme? Flytter dit barn ud? Det skal rettes til på husstanden. Du har også muligheden for at hjælpe dem godt på vej med dækningen “udeboende barn under 26”.',
      'Dit voksne barn skal også have en voksenulykkesforsikring i eget navn og med korrekt beskæftigelse på.',
    ],
  },
  {
    id: 'nyt-hus',
    date: '2024-06-03',
    title: 'Nyt hus – passer din indbosum stadig?',
    body: [
      'Vi kan se, at du er flyttet fra lejlighed til hus. Måske har du flere kvadratmeter at fylde ud og dermed flere værdier, der skal dækkes på din indboforsikring. Tjek gerne, om din indbosum stadig passer.',
    ],
  },
  {
    id: 'adresseskift-koersel',
    date: '2024-06-03',
    title: 'Adresseskift – har du samme kørselsbehov?',
    body: ['Hvis din nye adresse er længere fra dit arbejde, kan det være, at dit årlige kilometerforbrug skal sættes op.'],
  },
  {
    id: 'adresseskift-indbo',
    date: '2024-06-03',
    title: 'Adresseskift – passer din indbosum stadig?',
    body: [
      'Vi kan se, at du har skiftet adresse. Måske har du flere kvadratmeter at fylde ud eller har købt nye indbogenstande og dermed flere værdier, der skal dækkes på din indboforsikring. Tjek gerne, om din indbosum stadig passer.',
    ],
  },
  {
    id: 'erhverv',
    date: '2024-02-19',
    title: 'Erhvervsforsikringer på samme adresse som hus',
    body: ['Husk, at dette skal noteres på din husforsikring.'],
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
