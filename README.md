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

Nye skader, sendte beskeder og læst-status gemmes kun i browseren (localStorage). Tekster og dummy-data ligger i `src/data.js`.

## Kør lokalt

```bash
npm install
npm run dev
```

Åbn http://localhost:5173.

## Udgivelse

Hvert push til `main` bygger og udgiver appen til GitHub Pages via `.github/workflows/deploy.yml`.
