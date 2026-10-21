import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Kundens data, som rådgiveren kan ændre i TIA Admin. Gemmes i localStorage og synkroniseres
// mellem faner, så kundens app opdaterer sig live, når der gemmes i admin.
const KEY = 'gft-state-v1'
// Andre demo-nøgler, der også ryddes ved "Nulstil demo"
const DEMO_KEYS = ['gft-read-messages', 'gft-new-claims', 'gft-sent-messages']

export const initialState = {
  customer: {
    name: 'Mette Sørensen',
    customerNo: '1048 2297',
    address: 'Lærkevej 4, 2. th., 8000 Aarhus C',
    housing: 'lejlighed',
  },
  household: [
    { id: 'mette', name: 'Mette Sørensen', relation: 'Forsikringstager', age: 44 },
    { id: 'jakob', name: 'Jakob Sørensen', relation: 'Ægtefælle', age: 46 },
    { id: 'emma', name: 'Emma Sørensen', relation: 'Barn', age: 17 },
  ],
  policies: {
    indbo: { policyNo: '62-118-4471', since: '2015-03-01', deductible: 2500, sum: 650000, elektronik: true },
    ulykke: { policyNo: '62-118-4472', since: '2015-03-01', deductible: 0, sum: 1000000, occupation: 'Kontorarbejde', sports: [], farligSport: false },
    bil: {
      policyNo: '62-118-4474', since: '2019-09-15', deductible: 4000, car: 'Skoda Octavia Combi, AB 12 345',
      kmYear: 20000, primaryDriver: 'mette', youngDriverCover: false, superelitebarn: false,
    },
  },
  messages: [],
  handled: [], // id'er på rådgivningspunkter, kunden har markeret som håndteret
  log: [],
}

export const newHousePolicy = () => ({
  policyNo: '62-118-' + String(4480 + Math.floor(Math.random() * 500)),
  since: new Date().toISOString().slice(0, 10),
  deductible: 5000,
  area: 142,
  roof: 'Tegl',
  heating: 'Fjernvarme',
  toilets: 1,
  rentedOut: false,
  business: false,
})

const clone = (x) => JSON.parse(JSON.stringify(x))

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : clone(initialState)
  } catch {
    return clone(initialState)
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY || e.key === null) setState(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = useCallback((next) => {
    setState(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const reset = useCallback(() => {
    try {
      DEMO_KEYS.forEach((k) => localStorage.removeItem(k))
    } catch {}
    save(clone(initialState))
  }, [save])

  return <Ctx.Provider value={{ state, save, reset }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
export { clone }
