# Vino per Lei — Overdracht volgende sessie

**Datum:** 26 maart 2026 (sessie 11)
**Laatste sessie:** Product-aanmaak E2E getest via Shopify Admin + Playwright MCP. WineType normalisatie-bug gevonden en gefixt.

---

## INSTRUCTIE VOLGENDE SESSIE

> **Doel:** Uncommitted code committen, visuele polish (wijntype badge kleur), en volledige site-validatie.
>
> 1. Lees deze HANDOFF-VPL.md volledig door
> 2. Commit de 2 uncommitted wijzigingen (wineType normalisatie fix)
> 3. **Fix wijntype badge kleur** — "Rode Wijn" badge op productdetailpagina heeft een BLAUW bolletje, moet ROOD zijn (zie Prio 1 hieronder)
> 4. Verwijder de duplicate `main-1` Homepage Hero entry in Shopify Admin
> 5. Build + start prod server: `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
> 6. Open Playwright MCP en loop **elke pagina** af (zie Prio 3 checklist)
> 7. Test functioneel: age gate, winkelwagen, zoek, checkout redirect, cookie consent, mobile menu
> 8. Test responsive: mobile 375px, tablet 768px, desktop 1440px
> 9. Fix gevonden issues direct
> 10. Als alles PASS: commit, push, verify op vino-per-lei.vercel.app
>
> **LET OP:** NOOIT `next dev` draaien — crasht Claude Code. Gebruik altijd prod server.
> **PLAYWRIGHT:** Sluit ALLE Chrome vensters voordat je Playwright MCP start.

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
| **Git status** | **2 bestanden UNCOMMITTED** (wineType normalisatie fix) |

---

## Wat er sessie 11 is gedaan

### Product-aanmaak E2E test (Shopify Admin → Website)

Via Playwright MCP ingelogd op Shopify Admin en een **compleet testproduct** aangemaakt:

| Veld | Ingevoerde waarde | Website output | Status |
|------|------------------|----------------|--------|
| Titel | Testproduct Chianti Classico DOCG 2020 | H1 heading correct | **PASS** |
| Beschrijving | Volledige tekst over Chianti | Zichtbaar onder titel | **PASS** |
| Prijs | €18.95 | € 18,95 | **PASS** |
| Afbeelding | barolo-classico-2018.webp | Fles zichtbaar in hero | **PASS** |
| Jaargang | 2020 | Badge "2020" naast titel | **PASS** |
| Regio | Toscane | "Toscane, Italië" + kaart + link | **PASS** |
| Beoordeling | 4.3 | 4.3 + sterren-rating | **PASS** |
| Druivensoorten | Sangiovese, Merlot (lijst) | Beide met druif-iconen | **PASS** |
| Wijntype | Rood | Badge + correct smaakprofiel | **PASS** (na fix) |
| Smaak Fris-Zacht | 2 | Balk op juiste positie | **PASS** |
| Smaak Fruitig-Kruidig | 4 | Balk op juiste positie | **PASS** |
| Smaak Zacht-Tannine | 4 | Balk op juiste positie | **PASS** |
| Smaak Licht-Vol | 4 | Balk op juiste positie | **PASS** |
| Smaak Droog-Zoet | 1 | Balk op juiste positie | **PASS** |
| Type | Red Wine | Product correct gecategoriseerd | **PASS** |
| Vendor | Vino per Lei | In technische details | **PASS** |
| Tags | red | Tag toegepast | **PASS** |
| Inventory | 0 | "Uitverkocht" + "Mail bij voorraad" | **PASS** |

**Automatisch gegenereerde secties** (op basis van wijntype):
- Smaakprofiel met rode-wijn assen (Tannine, Kruidig) ✅
- Proefervaring (Geur, Smaak, Afdronk) ✅
- Food pairing (Pasta, Gegrild vlees, Gerijpte kaas) ✅
- Serveertemperatuur 16-17°C + Decanteren 30-60 min ✅
- Wijnregio kaart met Toscane ✅
- "Ook interessant" met andere rode wijnen ✅

**Testproduct is na validatie weer verwijderd uit Shopify.**

### Bug gevonden en gefixt: WineType normalisatie

**Probleem:** Carla vult "Rood" in (NL) maar code verwachtte "red" (EN). Default was "Mousserende Wijn" → page title, smaakprofiel, serveeradvies en related products waren allemaal verkeerd.

**Fix:** `normalizeWineType()` helper in `src/lib/shopify.ts` regel 105-113. Accepteert nu:
- `red` / `rood` → `'red'`
- `white` / `wit` → `'white'`
- `rose` / `rosé` → `'rose'`
- `sparkling` / `mousserende` / `bubbels` → `'sparkling'`

**Gewijzigde bestanden (UNCOMMITTED):**
- `src/lib/shopify.ts` — `normalizeWineType()` functie + aangeroepen in `mapShopifyProduct()`
- `src/app/wijnen/[handle]/page.tsx` — default fallback "Wijn" i.p.v. "Mousserende Wijn"

### Smaakprofiel validatie-inzicht

Smaakwaarden zijn integers op schaal **0-5** (niet 0-100). Shopify valideert dit automatisch. Dit moet in de handleiding voor Carla staan.

---

## Volgende sessie: TODO's

### Prio 1: Uncommitted code committen + visuele polish

- [ ] **Commit wineType normalisatie fix** (2 bestanden, zie hierboven)
- [ ] **Fix wijntype badge kleur** — Op de productdetailpagina (`/wijnen/[handle]`) staat bij "Rode Wijn" een classificatie-badge. Het bolletje/dot naast de tekst is **blauw** maar zou **rood** moeten zijn voor rode wijn (en goud/champagne voor wit, koraal voor rosé, etc.). Zoek in `HeroSection.tsx` en/of `ProductDetailClient.tsx` naar de wijntype-badge styling. De `bg-wine` class wordt al conditioneel gezet op de ProductCard, maar op de detailpagina mist dit mogelijk.
- [ ] **Check alle plekken** waar wijntype-kleur wordt getoond (ProductCard, HeroSection, QuickViewModal) en zorg dat de kleuren consistent zijn: rood=bg-wine, wit=bg-gold, rosé=bg-coral, sparkling=bg-champagne

### Prio 2: Shopify opruimen

- [ ] **Verwijder duplicate `main-1` Homepage Hero entry** in Shopify Admin
- [ ] **Verwijder duplicate `main-1` entry** ook voor Announcement Bar (als die er is)

### Prio 3: Visuele test alle pagina's (Playwright MCP)

Start prod server en test ELKE pagina visueel:
- [ ] **Homepage** — hero, USP-balk, producten, wijnkaart, testimonials, cijfers, categorieën, blog
- [ ] **`/wijnen`** — filters, zoek, productkaarten, low-stock badges, allergeninfo
- [ ] **`/wijnen/[handle]`** — productdetail, food pairing, smaakprofiel, add to cart, wijntype badge kleur
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

### Prio 4: Functionele tests

- [ ] **Age gate** — eerste bezoek moet leeftijdsbevestiging tonen
- [ ] **Zoekfunctie** — zoek in header, navigeert naar `/wijnen?zoek=`
- [ ] **Winkelwagen** — product toevoegen, hoeveelheid wijzigen, verwijderen
- [ ] **Cart slide-out** — payment badges, gratis verzending balk
- [ ] **Checkout** — redirect naar Shopify checkout
- [ ] **Exit-intent modal** — mouse uit viewport (1x per sessie)
- [ ] **Cookie consent** — granulaire opties
- [ ] **Mobile menu** — hamburger, stagger-animatie, submenu's
- [ ] **Newsletter** — formulier submit, GDPR checkbox

### Prio 5: Responsive tests

- [ ] **Mobile (375px)**, **Tablet (768px)**, **Desktop (1440px)** — alle pagina's

### Prio 6: Bekende issues

- [ ] **CSP report endpoint** (`/api/csp-report`) — bestaat nog niet, maar is als directive geconfigureerd
- [ ] **GA4 Measurement ID** — nog `G-XXXXXXXXXX`, moet worden ingevuld
- [ ] **Web3Forms key** — moet nog worden aangemaakt
- [ ] **Telefoonnummer** — nog placeholder `040-XXX XXXX` / `+31 6 00 00 00 00`
- [ ] **NotifyMe modal** — frontend-only, stuurt nog geen email

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Shopify API versie:** `2025-01`
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik
- **Metaobjects worden opgehaald via handle** — bijv. `getMetaobject('homepage_hero', 'main', ...)`
- **Smaakwaarden:** Integer schaal 0-5 (niet 0-100)
- **Wijntype in Shopify:** Carla mag NL of EN invullen (Rood/red, Wit/white, Rosé/rose, Bubbels/sparkling)

---

## Design systeem quick reference

| Element | Waarde |
|---------|--------|
| Primary | wine-burgundy `#1a1f3d` |
| Accent | gold `#c9a227` |
| Background | cream `#faf9f7` |
| Border | sand `#e8e0d5` |
| Serif | Playfair Display |
| Sans | Inter |
| Wijntype kleuren | red=`bg-wine`, white=`bg-gold`, rosé=`bg-coral`, sparkling=`bg-champagne` |
