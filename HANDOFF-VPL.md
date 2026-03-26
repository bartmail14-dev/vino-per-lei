# Vino per Lei — Overdracht volgende sessie

**Datum:** 26 maart 2026 (sessie 9)
**Laatste sessie:** Alle content CMS-gestuurd gemaakt + handleiding volledig herschreven.

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
| **Git status** | 4 gewijzigde bestanden, NIET gecommit |

---

## Wat er sessie 9 is gedaan

### 1. Alle content CMS-gestuurd gemaakt
- **Testimonials** → nieuw Shopify Metaobject `testimonial` aangemaakt via Admin API
  - 3 seed reviews (Marloes, Peter, Sandra) aangemaakt in Shopify
  - `getTestimonials()` in `shopify-cms.ts` met fallback naar defaults
  - Homepage `page.tsx` haalt reviews nu uit CMS i.p.v. hardcoded array

- **Homepage cijfers** → nieuw Shopify Metaobject `homepage_stat` aangemaakt via Admin API
  - 4 seed stats aangemaakt in Shopify (wijnen, regio's, producenten, levering)
  - `getHomeStats()` in `shopify-cms.ts`
  - **Dynamische fallback**: als geen CMS stats → telt `allProducts.length` en unieke regio's automatisch uit Shopify producten

- **Setup script** (`scripts/setup-shopify-cms.ts`) bijgewerkt met beide nieuwe definities + seed data

### 2. Handleiding volledig herschreven
- **Toegang-sectie**: 7 gedetailleerde stappen (was 5) — van partners.shopify.com account aanmaken tot inloggen op beheerpaneel
- **13 secties totaal**, allemaal herschreven in duidelijke, niet-technische taal:
  1. Toegang tot Shopify (account aanmaken)
  2. Producten beheren
  3. Homepage teksten (hero, announcement, USP)
  4. Klantervaringen (reviews) — NIEUW
  5. Homepage cijfers — NIEUW
  6. FAQ beheren
  7. Wijn categorieën
  8. Site instellingen (bedrijfsgegevens)
  9. Blog schrijven
  10. Juridische pagina's — NIEUW
  11. Bestellingen bekijken
  12. Verzending instellen
- **Projectoverzicht** bijgewerkt: "Wat je zelf kunt beheren" lijst + genummerde actiepunten
- Blog sectie gecorrigeerd naar "Online Store → Blog Posts" (was foutief Metaobjects)

### 3. Overzicht: wat Carla nu ALLEMAAL kan beheren

| Content | Shopify locatie | Type |
|---------|----------------|------|
| Producten, prijzen, voorraad | Products | Native |
| Hero tekst + CTA's | Metaobjects → Homepage Hero | Metaobject |
| Announcement bar | Metaobjects → Announcement Bar | Metaobject |
| USP-punten | Metaobjects → USP Item | Metaobject |
| Categorieblokken homepage | Metaobjects → Categorie Blok | Metaobject |
| FAQ vragen | Metaobjects → FAQ Item | Metaobject |
| Wijnregio's | Metaobjects → Wijnregio | Metaobject |
| **Klantervaringen** | Metaobjects → Testimonial | Metaobject (NIEUW) |
| **Homepage cijfers** | Metaobjects → Homepage Cijfer | Metaobject (NIEUW) |
| Bedrijfsgegevens + verzendkosten | Metaobjects → Site Instellingen | Metaobject |
| Blog artikelen | Online Store → Blog Posts | Native |
| Privacy, Voorwaarden, Cookies | Online Store → Pages | Pages |
| Over Ons, Verzending, Retour | Online Store → Pages | Pages |
| Bestellingen | Orders | Native |
| Footer menu's | Online Store → Navigation | Native |

---

## Gewijzigde bestanden (uncommitted)

```
M scripts/setup-shopify-cms.ts      — testimonial + homepage_stat definities + seed
M src/lib/shopify-cms.ts            — getTestimonials() + getHomeStats() + types
M src/app/page.tsx                  — CMS testimonials + dynamic stats
M src/app/handleiding/HandleidingContent.tsx — volledig herschreven (13 secties)
```

---

## Volgende sessie: ALLES TESTEN

### Stap 0: Commit + deploy
- [ ] Commit alle wijzigingen
- [ ] Push naar master → auto-deploy Vercel
- [ ] Wacht op deploy, check build logs

### Stap 1: Playwright — visuele test alle pagina's
Start prod server en test ELKE pagina visueel met Playwright MCP:
- [ ] **Homepage** — hero, USP-balk, producten, wijnkaart, testimonials, cijfers, categorieën, blog
- [ ] **`/wijnen`** — filters, zoek, productkaarten, low-stock badges, allergeninfo
- [ ] **`/wijnen/[handle]`** — productdetail, food pairing, smaakprofiel, add to cart
- [ ] **`/cadeaus`** — cadeaupakketten, filters
- [ ] **`/blog`** — artikeloverzicht, tag filtering
- [ ] **`/blog/[slug]`** — artikeldetail, leestijd, author
- [ ] **`/over-ons`** — CMS content of fallback, hero, CTA
- [ ] **`/contact`** — formulier, bedrijfsgegevens, openingstijden
- [ ] **`/klantenservice/faq`** — categorieën, accordion
- [ ] **`/klantenservice/verzending`** — verzendinfo
- [ ] **`/klantenservice/retourneren`** — retourbeleid
- [ ] **`/privacy`** — privacybeleid (CMS of fallback)
- [ ] **`/voorwaarden`** — algemene voorwaarden (CMS of fallback)
- [ ] **`/cookies`** — cookiebeleid (CMS of fallback)
- [ ] **`/handleiding`** — alle 13 secties openen en lezen
- [ ] **`/showcase`** — projectshowcase

### Stap 2: Functionele tests
- [ ] **Age gate** — eerste bezoek moet leeftijdsbevestiging tonen
- [ ] **Zoekfunctie** — zoek in header, navigeert naar `/wijnen?zoek=`
- [ ] **Winkelwagen** — product toevoegen, hoeveelheid wijzigen, verwijderen
- [ ] **Cart slide-out** — payment badges, gratis verzending balk
- [ ] **Checkout** — redirect naar Shopify checkout
- [ ] **Exit-intent modal** — mouse uit viewport, toont cart samenvatting (1x per sessie)
- [ ] **Notify-me modal** — uitverkocht product, email invoer
- [ ] **Cookie consent** — granulaire opties (noodzakelijk/analytisch/marketing)
- [ ] **Mobile menu** — hamburger, stagger-animatie, submenu's
- [ ] **Newsletter** — formulier submit, GDPR checkbox

### Stap 3: CMS-koppeling verifiëren
- [ ] **Testimonials** — wijzig een review in Shopify Admin → check of homepage bijwerkt
- [ ] **Homepage stats** — wijzig een cijfer → check homepage
- [ ] **Hero tekst** — wijzig titel in Shopify → check homepage
- [ ] **Announcement bar** — wijzig tekst + zet uit → check header
- [ ] **USP items** — wijzig tekst → check USP-balk
- [ ] **FAQ** — voeg vraag toe → check FAQ pagina
- [ ] **Blog** — check of artikelen laden vanuit Shopify Blog
- [ ] **Site Settings** — wijzig telefoon → check footer + contact

### Stap 4: Responsive tests
- [ ] **Mobile (375px)** — alle pagina's
- [ ] **Tablet (768px)** — alle pagina's
- [ ] **Desktop (1440px)** — alle pagina's
- [ ] **Touch targets** — minimaal 44px op interactieve elementen

### Stap 5: Performance + SEO
- [ ] **Lighthouse** — score check op homepage en productpagina
- [ ] **JSON-LD** — Organization, FAQ, BreadcrumbList schema's
- [ ] **Canonical URLs** — check op alle pagina's
- [ ] **Meta tags** — title + description op elke pagina
- [ ] **Sitemap** — `/sitemap.xml` bevat alle pagina's

### Stap 6: Security check
- [ ] **Age gate middleware** — direct naar `/wijnen` zonder cookie → redirect
- [ ] **CSRF tokens** — contact + newsletter formulieren
- [ ] **CSP headers** — check response headers
- [ ] **Rate limiting** — spam contact formulier
- [ ] **Honeypot** — check dat hidden field werkt

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Shopify API versie:** `2025-01`
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik
- **Lettertype mobile menu:** Inter (behouden)

---

## Bekende issues / aandachtspunten

1. **Shopify Pages** konden niet via script worden aangemaakt (API token mist `write_content` scope) — fallback-teksten werken, maar Carla moet pages handmatig aanmaken in Shopify Admin als ze ze wil aanpassen
2. **Telefoonnummer** is nog placeholder `+31 6 00 00 00 00` — Carla moet dit invullen via Site Instellingen
3. **GA4 Measurement ID** is nog `G-XXXXXXXXXX` — moet worden ingevuld
4. **Web3Forms key** — moet nog worden aangemaakt en ingevuld
5. **CSP report endpoint** (`/api/csp-report`) is als directive geconfigureerd maar de endpoint bestaat nog niet
6. **NotifyMe modal** — frontend-only, stuurt nog geen email (backend TODO)

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
