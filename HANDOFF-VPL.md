# Vino per Lei — Overdracht volgende sessie

**Datum:** 26 maart 2026 (sessie 12)
**Laatste sessie:** Badge kleur gefixt, inventory systeem gebouwd, Storefront API scope aangezet, gecommit + gepusht naar Vercel.

---

## INSTRUCTIE VOLGENDE SESSIE

> **PRIORITEIT 1: Bereid Carla-call samen voor (zie sectie hieronder)**
>
> **PRIORITEIT 2: Inventory tracking aanzetten**
> 1. Lees deze HANDOFF-VPL.md volledig door
> 2. Ga naar Shopify Admin → Products → elk product → variant → "Track quantity" AAN + voorraad 48
>    OF: update Admin API token scopes (write_inventory + read_locations) en draai:
>    `node scripts/enable-inventory-tracking.mjs 48`
> 3. Verifieer op de site dat voorraad badges werken (low-stock, uitverkocht)
> 4. Build + test: `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
>
> **PRIORITEIT 3: Visuele + functionele tests**
> 5. Loop alle pagina's af met Playwright MCP (zie checklist onderaan)
> 6. Test: age gate, winkelwagen, checkout redirect, zoek, mobile menu
> 7. Test responsive: 375px, 768px, 1440px
>
> **LET OP:** NOOIT `next dev` draaien — crasht Claude Code. Gebruik altijd prod server.
> **PLAYWRIGHT:** Sluit ALLE Chrome vensters voordat je Playwright MCP start.

---

## CARLA-CALL VOORBEREIDING (URGENT — 40 min)

Bart heeft over 40 minuten een call met Carla. Bereid een beknopt overzicht voor dat Bart kan gebruiken om Carla bij te praten. Structuur:

### Wat er deze sessie is gedaan (sessie 12):
1. **Wijntype badge kleur gefixt** — Het bolletje naast "Rode Wijn" op productpagina's was blauw (design-fout), nu is het echt wijnrood. Ziet er professioneel uit.
2. **Wijntype normalisatie** — Carla kan nu zowel Nederlands als Engels invullen in Shopify (Rood/red, Wit/white, Rosé/rose, Bubbels/sparkling). De site herkent beide automatisch.
3. **Inventory systeem gebouwd** — De site kan nu voorraad bijhouden:
   - Producten met voorraad → "Op voorraad" + groene badge + "In Winkelmand"
   - Producten met ≤5 flessen → "Nog X flessen" gouden badge (urgentie)
   - Producten zonder voorraad → "Uitverkocht" + "Mail bij voorraad" knop
4. **Shopify API permissions** aangepast zodat voorraaddata doorkomt naar de website
5. **Setup script** gemaakt om voorraad in te stellen voor alle producten in één keer

### Wat er vorige sessie is gedaan (sessie 11):
- Volledige E2E test: product aanmaken in Shopify Admin → 17/17 velden correct op website
- Alle metafields werken (smaakprofiel, druiven, regio, beoordeling, food pairing, etc.)
- Testproduct aangemaakt en weer verwijderd

### Wat Carla moet weten:
- **Voorraad bijhouden**: Zodra tracking aan staat, wordt voorraad automatisch bijgewerkt bij verkoop via Shopify checkout
- **Wijntype invullen**: Mag in NL of EN — site herkent het automatisch
- **Smaakwaarden**: Schaal 0-5 (niet 0-100)
- **"Mail bij voorraad"**: De knop bestaat, maar stuurt nog GEEN echte emails — dat is een TODO

### Nog te doen voor livegang:
1. Inventory tracking aanzetten + startvoorraad instellen (48 flessen per product)
2. Visuele test alle pagina's
3. Functionele tests (age gate, winkelwagen, checkout)
4. Responsive tests (mobiel, tablet, desktop)
5. Placeholders invullen: GA4 code, telefoonnummer, Web3Forms key
6. "Mail bij voorraad" koppelen aan echte email service (Klaviyo of vergelijkbaar)
7. Duplicate Shopify entries opruimen

### Vraag aan Carla:
- Wat is de startvoorraad per product? (suggestie: 48 per wijn)
- Wil ze "Mail bij voorraad" emails ontvangen? Zo ja, via welk emailadres?
- Is het telefoonnummer 040-XXX XXXX definitief, of komt er een ander nummer?

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion v12 + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify** | `vino-per-lei-2.myshopify.com` (CMS + products) |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **Laatste commit** | `561c090` — badge kleur + inventory systeem |

---

## Wat er sessie 12 is gedaan

### 1. Wijntype badge kleur gefixt
- Nieuwe CSS kleur `--wine-red: #8B1A32` (echt wijnrood) toegevoegd
- `bg-wine` (was navy #1a1f3d) → `bg-wine-red` in HeroSection.tsx en ProductCard.tsx
- Visueel geverifieerd met Playwright: bolletje is nu donkerrood op alle plekken

### 2. WineType normalisatie gecommit
- `normalizeWineType()` in shopify.ts accepteert NL en EN input
- Fallback "Wijn" i.p.v. "Mousserende Wijn" als type onbekend

### 3. Inventory systeem gebouwd
- **Admin API enrichment**: `enrichWithInventory()` in shopify.ts
- Haalt `totalInventory` + `tracked` status op via Admin API
- Automatisch ingebouwd in `getProducts()` en `getProductByHandle()`
- Cached met 60 seconden revalidatie
- **Setup script**: `scripts/enable-inventory-tracking.mjs` — zet tracking aan + stelt voorraad in

### 4. Storefront API scope aangezet
- Via Shopify Admin → Headless → Storefront API → Edit
- `unauthenticated_read_product_inventory` is nu ENABLED
- Opgeslagen en bevestigd

### 5. Wat NIET werkt (nog)
- **Inventory tracking staat UIT** op alle 19 producten (`tracked: false`)
- Admin API token mist `write_inventory` + `read_locations` scopes → script kan tracking niet aanzetten
- Moet handmatig per product OF token scopes updaten

---

## Gewijzigde bestanden (sessie 12, commit 561c090)

- `src/app/globals.css` — `--wine-red` kleur + Tailwind mapping
- `src/components/product/HeroSection.tsx` — `bg-wine` → `bg-wine-red`
- `src/components/product/ProductCard.tsx` — `bg-wine` → `bg-wine-red`
- `src/lib/shopify.ts` — normalizeWineType() + Admin API inventory enrichment
- `src/app/wijnen/[handle]/page.tsx` — fallback "Wijn"
- `src/types/product.ts` — type cleanup
- `scripts/enable-inventory-tracking.mjs` — inventory setup script (NIEUW)

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Shopify API versie:** `2025-01`
- **Smaakwaarden:** Integer schaal 0-5
- **Wijntype:** Carla mag NL of EN invullen

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
| Wijntype kleuren | red=`bg-wine-red`, white=`bg-gold`, rosé=`bg-coral`, sparkling=`bg-champagne` |

---

## Visuele test checklist (Prio 3)

- [ ] **Homepage** — hero, USP-balk, producten, wijnkaart, testimonials, cijfers, categorieën, blog
- [ ] **`/wijnen`** — filters, zoek, productkaarten, wijntype dots (rood/goud/koraal/champagne)
- [ ] **`/wijnen/[handle]`** — productdetail, food pairing, smaakprofiel, badge kleur, inventory status
- [ ] **`/cadeaus`** — cadeaupakketten, filters
- [ ] **`/blog`** — artikeloverzicht, tag filtering
- [ ] **`/blog/[slug]`** — artikeldetail, leestijd, author
- [ ] **`/over-ons`** — CMS content of fallback, hero, CTA
- [ ] **`/contact`** — formulier, bedrijfsgegevens, openingstijden
- [ ] **`/klantenservice/faq`** — categorieën, accordion
- [ ] **`/klantenservice/verzending`** — verzendinfo
- [ ] **`/klantenservice/retourneren`** — retourbeleid
- [ ] **`/privacy`**, **`/voorwaarden`**, **`/cookies`** — juridische pagina's
- [ ] **`/handleiding`** — alle 13 secties
- [ ] **`/showcase`** — projectshowcase
