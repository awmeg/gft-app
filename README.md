# GFT Forsikring – kundeapp (prototype)

Klikbar prototype bygget ud fra fagprøve-konceptet "Nu med app!" (præsentation fra 6. juni 2023) med den nye
funktion **"Vigtig info til dig"**. Selskabet **GFT Forsikring**, kunden og alle data er fiktive.

**Se den live:** https://awmeg.github.io/gft-app/

Appen tilpasser sig skærmen: på mobil er der topbar og burger-menu, på PC en fast sidemenu og bredere layout.

## Indhold

| Side | Hvad kan man |
|---|---|
| Overblik | Næste betaling, åbne skader, overskudsdeling, ulæste beskeder og dine forsikringer |
| Vigtig info til dig | Pr. forsikring: hvornår og hvorfor du skal kontakte os (ulykke viser risiko-/højrisikosport) |
| Forsikringer | Oversigt og detaljer pr. police: pris, selvrisiko, dækning og skader |
| Skader | Liste med filter (alle/åbne/afsluttede), detaljer med status, forløb, økonomi og dokumenter, samt "Anmeld skade" |
| Betaling | Næste betaling, betalingsoplysninger, historik pr. år og specifikation pr. opkrævning |
| Overskudsdeling | Årets andel, beregning og udvikling over 5 år |
| Mine fordele | Rabatter hos (fiktive) partnere med rabatkode, der kan kopieres |
| Kontakt | Ring til +45 12 34 56 78, "Skriv til GFT", åbningstider og døgnvagt |
| Beskeder | Personlige påmindelser, der kan markeres læst/ulæst |

## TIA Admin – rådgiverens side

Nederst i menuen ligger et nedtonet punkt **TIA Admin** (eller gå direkte til `#/tia`). Den simulerer
forsikringssystemet, hvor en rådgiver retter kundens oplysninger: adresse, boligtype, husstand og felterne på hver police.

Når rådgiveren gemmer, sammenligner en regelmotor (`src/rules.js`) før og efter og sender automatisk de relevante
beskeder. Rådgivningspunkterne styrer **"Vigtig info til dig"** hos kunden. Eksempler:

| Ændring i TIA | Det får kunden |
|---|---|
| Barn fylder 18 | "Emma er fyldt 18 år" + "Ung fører i hjemmet", hvis der er bil |
| Lejlighed → hus | "Nyt hus – passer din indbosum?", kørselsbehov og ny husforsikring |
| Adresseskift | "Passer din indbosum?" + "Har du samme kørselsbehov?" |
| Erhverv på adressen | "Erhverv på samme adresse som dit hus" |
| Nyt job / ny risikosport | Påmindelse om korrekt dækning på ulykkesforsikringen |
| Felter på en police | Bekræftelse med ændringerne og ny årlig pris |
| Ny eller fraflyttet person | "Passer din indbosum?" / "udeboende barn under 26" |

Kunden starter **uden beskeder**. Kunden kan markere et punkt som "Det er på plads", og rådgiveren kan se status under
Kommunikation. Åbn admin og app i hver sin fane i samme browser for at se beskederne komme live. "Nulstil demo" sætter alt
tilbage til start.

Alle data gemmes kun i browseren (localStorage), så demoen er personlig for hver browser. Tekster og dummy-data ligger i
`src/data.js`, kundens startdata i `src/store.jsx`.

## Kør lokalt

```bash
npm install
npm run dev
```

Åbn http://localhost:5173.

## Udgivelse

Hvert push til `main` bygger og udgiver appen til GitHub Pages via `.github/workflows/deploy.yml`.
