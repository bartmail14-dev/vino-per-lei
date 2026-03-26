# Vino per Lei — Overdracht volgende sessie

**Datum:** 26 maart 2026 (sessie 15)
**Laatste sessie:** Screenshots handleiding + duplicate CMS entries opgeruimd + Vercel deploy.

---

## INSTRUCTIE VOLGENDE SESSIE

> **PRIORITEIT 1: Inventory tracking AFMAKEN — nog 15 producten**
>
> 5 van 20 producten zijn KLAAR. De overige 15 moeten nog.
>
> **Stappen:**
> 1. Lees deze HANDOFF-VPL.md volledig door
> 2. Sluit ALLE Chrome vensters
> 3. Navigeer met Playwright MCP naar: `https://admin.shopify.com/store/vino-per-lei-2/products`
> 4. Bart moet inloggen in Shopify Admin (Playwright kan dat niet automatisch)
> 5. Per product (15 resterende): tracking aan + voorraad 48 + save
> 6. Na alle producten: build + test om te verifiëren dat badges werken
> 7. Commit + push naar Vercel
>
> **PRIORITEIT 2: Handleiding screenshots overige secties**
> - Sectie 1 "Toegang tot Shopify" is KLAAR (5 screenshots)
> - Secties 2-12 hebben deels websiteScreenshots maar GEEN Shopify Admin screenshots
> - Neem per sectie screenshots van de relevante Shopify Admin pagina's
> - Voeg `screenshot` property toe aan de stappen in HandleidingContent.tsx
>
> **PRIORITEIT 3: Functionele tests (als tijd over)**
> - Age gate popup testen
> - Checkout redirect (Shopify checkout)
> - Zoekfunctionaliteit
> - Mobile menu (hamburger)
>
> **PRIORITEIT 4: Overige TODO's**
> - Placeholders invullen als Carla info heeft gegeven: GA4 code, telefoonnummer, Web3Forms key
> - "Mail bij voorraad" koppelen aan email service (Klaviyo of vergelijkbaar)
>
> **LET OP:** NOOIT `next dev` draaien — crasht Claude Code. Gebruik altijd prod server.
> **PLAYWRIGHT:** Sluit ALLE Chrome vensters voordat je Playwright MCP start.

---

## WAT ER DEZE SESSIE IS GEDAAN (sessie 15)

### 1. Screenshots handleiding sectie "Toegang tot Shopify"
- 5 screenshots genomen met Playwright MCP van Shopify Partners + Admin:
  - `toegang-stap1-partners-website.png` — partners.shopify.com homepage
  - `toegang-stap2-aanmelden.png` — aanmeld/registratieformulier
  - `toegang-stap4-inloggen.png` — account kiezen scherm
  - `toegang-stap4-dashboard.png` — Partners organisatie keuze
  - `toegang-stap7-admin-panel.png` — Shopify Admin beheerpaneel
- Screenshots gekoppeld aan stappen in `HandleidingContent.tsx` via `screenshot` property
- Stap 6 ("Wacht op goedkeuring") heeft bewust geen screenshot
- **LET OP:** Screenshots tonen Bart Visser account — later eventueel vervangen

### 2. Duplicate CMS entries verwijderd
- **USP Items:** 4 duplicaten verwijderd (hadden " 1" suffix, aangemaakt 10:36 am vandaag)
  - Gratis Verzending 1, Gratis Retour 1, Expert Selectie 1, Veilig Betalen 1
  - Nu 4 correcte entries over
- **Categorie Blokken:** 5 duplicaten verwijderd (zelfde " 1" suffix patroon)
  - Rode Wijn 1, Witte Wijn 1, Rose 1, Bubbels 1, Cadeaus 1
  - Nu 5 correcte entries over
- **Oorzaak:** Waarschijnlijk dubbel aangemaakt via Headless Setup app
- **Fix is direct zichtbaar** — site haalt live data uit Shopify API, geen redeploy nodig

### 3. Deploy
- Commit `46a7a8f` — screenshots + HandleidingContent.tsx + Footer.tsx
- Gepusht naar master → Vercel auto-deploy
- Daarnaast `npx vercel --prod` gedraaid voor zekerheid
- **Live op:** https://vino-per-lei.vercel.app

### 4. SEO / Vindbaarheid check
- Site is NIET geïndexeerd door Google (nog)
- Robots.txt en metadata staan correct (`index: true, follow: true`)
- **Probleem:** `metadataBase` en sitemap wijzen naar `vinoperlei.nl` — domein nog niet gekoppeld
- **Nodig:** Domein koppelen + Google Search Console instellen + sitemap indienen

---

## INVENTORY TRACKING STATUS

### ✅ KLAAR (5 producten — tracking AAN + voorraad ingesteld)
1. **Asolo Prosecco Superiore DOCG Extra Brut** — had al tracking (18 available, 24 on hand)
2. **Prosecco Superiore Valdobbiadene DOCG** — tracking AAN, 48 stuks
3. **Cerasuolo d'Abruzzo Rosé DOC** — tracking AAN, 48 stuks
4. **Bardolino Chiaretto Rosé DOC** — tracking AAN, 48 stuks
5. **Vermentino Toscana IGT** — tracking AAN, 48 stuks

### ⬜ NOG TE DOEN (15 producten)
De volgorde in Shopify Admin (van boven naar beneden na Vermentino):
6. Pinot Grigio delle Venezie DOC
7. Montaribaldi Langhe Chardonnay
8. San Marzano Il Pumo Primitivo
9. Jo Primitivo Salento IGT
10. Refosco dal Peduncolo Rosso DOC
11. Teroldego Rotaliano DOC
12. Tenuta Val d'Ombra 'Ombra Alta'
13. Valpolicella Ripasso Superiore DOC
14. Rubinelli Vajol Valpolicella Ripasso
15. Amarone della Valpolicella DOCG
16. Nebbiolo Langhe DOC
17. Barolo Classico DOCG
18. Montaribaldi Barbera d'Alba
19. Montaribaldi Barolo DOCG
20. (check of er nog meer zijn)

> **LET OP:** Productnamen en volgorde kunnen afwijken. Gebruik de Shopify Admin als bron van waarheid.

---

## EXACTE STAPPEN PER PRODUCT (bewezen workflow sessie 14)

Dit is de exacte flow die werkt — **geen varianten nodig**, alles zit direct op de productpagina:

1. **Open product** (klik op productnaam of gebruik "Next" knop rechtsboven)
2. **Scroll naar "Inventory" sectie** — je ziet `checkbox "Inventory not tracked"`
3. **Klik de checkbox** → verandert naar `"Inventory tracked" [checked]`
4. **Inventory tabel verschijnt** met Pastorielaan 56, alle waarden op 0
5. **Klik op "0" bij Available** (4e kolom) → popup opent met "Adjust by" en "New" velden
6. **Klik op "New" spinbutton** en type `48`
7. **Klik "Save"** in de inventory popup → toast "Quantity updated"
8. **Klik "Save"** onderaan de productpagina (of in de toolbar bovenaan) → toast "Product saved"
9. **Klik "Next"** (→ pijltje rechtsboven) om naar het volgende product te gaan
10. Herhaal stappen 2-9

### Tips
- De "Save" knop in de inventory popup zit in `#PolarisPortalsContainer`
- De "Save" knop voor het product zit in `#AppFrameScrollable`
- Na het aanvinken van tracking verschijnt ook "Sell when out of stock: Off" — dat is goed, laat staan
- De "Next" knop ref verandert elke keer, gebruik altijd een verse snapshot

---

## Na alle producten: Build + Test

```bash
cd /c/Users/BartVisser/Desktop/vino-per-lei
npx --yes kill-port 3099
npm run build && npx next start --port 3099 > /dev/null 2>&1 &
```

Gebruik Playwright MCP om te verifiëren:
- Open `http://localhost:3099/wijnen` → producten moeten "Op voorraad" badge tonen
- Open een productdetail → "In Winkelmand" knop moet actief zijn
- Test: wijzig in Shopify Admin één product naar voorraad 3 → moet "Nog 3 flessen" tonen
- Test: wijzig naar voorraad 0 → moet "Uitverkocht" + "Mail bij voorraad" tonen

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion v12 + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify** | `vino-per-lei-2.myshopify.com` (CMS + products) |
| **Shopify Admin** | `https://admin.shopify.com/store/vino-per-lei-2` |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **Laatste commit** | `46a7a8f` — screenshots handleiding + footer fix |

---

## Gewijzigde bestanden (alles GECOMMIT)

Geen uncommitted changes na sessie 15.

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Shopify API versie:** `2025-01`

---

## Design systeem quick reference

| Element | Waarde |
|---------|--------|
| Primary | wine-burgundy `#1a1f3d` |
| Accent | gold `#c9a227` |
| Background | cream `#faf9f7` |
| Border | sand `#e8e0d5` |
| Wine type rood | wine-red `#8B1A32` |
| Serif | Playfair Display |
| Sans | Inter |

---

## Nog te doen voor livegang (volledig overzicht)

1. ⬜ **Inventory tracking AFMAKEN** — 15 resterende producten, elk "Track quantity" AAN + voorraad 48
2. ⬜ **Handleiding screenshots** — secties 2-12 nog Shopify Admin screenshots toevoegen
3. ⬜ **Functionele tests** — age gate, checkout redirect, zoek, mobile menu
4. ⬜ **GA4 tracking ID** invullen
5. ⬜ **Telefoonnummer** invullen (040-XXX XXXX → echt nummer van Carla)
6. ⬜ **Web3Forms key** invullen voor contactformulier
7. ⬜ **"Mail bij voorraad"** koppelen aan email service (Klaviyo of vergelijkbaar)
8. ⬜ **Domein vinoperlei.nl** koppelen aan Vercel + Google Search Console
9. ✅ ~~Duplicate Shopify entries opruimen~~ — DONE (sessie 15)
10. ✅ ~~Footer fix committen~~ — DONE (sessie 15)
11. ✅ ~~Screenshots handleiding sectie 1~~ — DONE (sessie 15)
