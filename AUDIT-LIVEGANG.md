# Vino per Lei — Livegang Audit & Stappenplan

**Datum:** 12 maart 2026
**Auditor:** Claude Code (6 parallelle agents)
**Scope:** Code Quality, SEO, Security, Performance, UX/A11y, Shopify/E-commerce, Legal/NL Compliance

---

## Samenvatting

De site ziet er visueel sterk uit en de Shopify Storefront API integratie werkt. Maar er zijn **fundamentele blokkades** voor livegang: de checkout doet niets (mock), er zijn 12+ dode links naar niet-bestaande pagina's, wettelijk verplichte pagina's ontbreken, en er is geen cookie consent. Dit document bevat het volledige stappenplan.

**Telling:**
| Severity | Aantal |
|----------|--------|
| BLOKKER (moet voor livegang) | 18 |
| HOOG (zou moeten voor livegang) | 14 |
| MEDIUM (kort na livegang) | 16 |
| LAAG (nice to have) | 10 |

---

## FASE 1: BLOKKERS (Moet voor livegang)

### 1.1 Checkout & Betalingen
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| B1 | **Checkout is 100% mock** | `checkoutStore.ts:281` | `submitOrder()` is een `setTimeout(1000)` met fake order ID. `createCheckout()` in `shopify.ts` bestaat maar wordt NERGENS aangeroepen. Koppel aan Shopify Checkout of Shopify Storefront Checkout API. |
| B2 | **Express checkout buttons doen niets** | `ExpressCheckout.tsx:11-26` | iDEAL, Apple Pay, Google Pay tonen alleen `alert()`. Verwijder of implementeer via Shopify Payments. |
| B3 | **Kortingscodes zijn hardcoded mock** | `checkoutStore.ts:189` | 3 fake codes (WELKOM10, ZOMER15, GRATIS5). Koppel aan Shopify discount API of verwijder. |

### 1.2 Wettelijk Verplichte Pagina's (NL/EU)
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| B4 | **Geen Privacy Policy** | `/privacy` → 404 | Gelinkt vanuit Footer, LoginModal. GDPR/AVG verplichting. |
| B5 | **Geen Algemene Voorwaarden** | `/voorwaarden` → 404 | Gelinkt vanuit Footer, AgeGate, Checkout, LoginModal. Wettelijk verplicht. |
| B6 | **Geen Retourbeleid** | `/klantenservice/retourneren` → 404 | EU: 14 dagen bedenktijd moet gedocumenteerd zijn. |
| B7 | **Geen Cookiebeleid** | `/cookies` → 404 | Gelinkt vanuit Footer. ePrivacy verplichting. |
| B8 | **Geen Cookie Consent Banner** | Ontbreekt volledig | Site zet cookies zonder consent. Telecomwet/ePrivacy vereist dit. |

### 1.3 Bedrijfsgegevens & Alcohol
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| B9 | **Geen KvK-nummer** | Nergens op site | Wettelijk verplicht voor NL webshops. |
| B10 | **Geen BTW-nummer** | Nergens op site | Wettelijk verplicht voor NL webshops. |
| B11 | **Geen bedrijfsadres** | Nergens op site | BW 6:230f vereist volledige bedrijfsgegevens. |
| B12 | **Alcohol disclaimer ontbreekt** | Nergens op site | "Het is verboden alcoholhoudende dranken te verkopen aan personen onder de 18 jaar" — standaard voor NL alcoholwebshops. |
| B13 | **Thuiswinkel Waarborg badge is NEPPE** | `Footer.tsx:372-375` | Badge wordt getoond zonder lidmaatschap. Dit is misleidend en potentieel strafbaar (oneerlijke handelspraktijken). **Verwijder direct.** |
| B14 | **Placeholder contactgegevens** | `Footer.tsx` | `020-123 4567` is duidelijk nep. Vervang door echte gegevens. |

### 1.4 Dode Links & Routes
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| B15 | **12+ navigatielinks naar 404** | Header, Footer | `/contact`, `/klantenservice`, `/klantenservice/faq`, `/klantenservice/verzending`, `/account/verlanglijst`, `/account/bestellingen`, `/account/instellingen`, `/over-ons/selectie` — allemaal 404. |
| B16 | **Wijn-categorie routes broken** | Header, Footer, Homepage | `/wijnen/rood`, `/wijnen/wit`, `/wijnen/rose`, `/wijnen/mousserende` worden opgevangen door `[handle]` en tonen "Product niet gevonden". |
| B17 | **Blog detail routes broken** | Homepage | Links naar `/blog/barolo-...` etc. maar er is geen `blog/[slug]` route. |
| B18 | **Geen custom 404 pagina** | `src/app/not-found.tsx` ontbreekt | Bezoekers zien default Next.js 404. |

---

## FASE 2: HOOG PRIORITEIT (Zou moeten voor livegang)

### 2.1 Security
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| H1 | **Geen security headers** | `next.config.ts` | Geen CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Voeg toe via headers() of middleware.ts. |
| H2 | **Auth systeem is fake** | `authStore.ts:46` | Login accepteert ELKE email/wachtwoord combo. Verwijder login feature of koppel aan Shopify Customer Accounts. |
| H3 | **Reviews zijn fake** | `ReviewSection.tsx:162` | `generateMockReviews()` met random namen en scores. Misleidend voor consumenten. Verwijder of koppel aan Shopify/Judge.me. |

### 2.2 Performance
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| H4 | **Hero video is 14 MB** | `public/hero-video.mp4` | Geen lazy loading, laadt ook achter de age gate. Comprimeer naar 2-3 MB. |
| H5 | **31 MB aan ongeoptimaliseerde wine PNGs** | `public/wines/*.png` | 19 flessen, elk 2+ MB. Converteer naar WebP (~200-400 KB per stuk). |
| H6 | **Geen Shopify API error handling** | `shopify.ts` | `getProducts()`, `getProductByHandle()`, `createCheckout()` hebben GEEN try/catch. API down = pagina crasht. |
| H7 | **`JSON.parse` zonder try/catch** | `shopify.ts:79` | `grapeVarieties` metafield met ongeldige JSON crasht de hele productmapping. |

### 2.3 SEO
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| H8 | **Geen sitemap.xml** | Ontbreekt | Crawlers kunnen pagina's niet discoveren. Maak `src/app/sitemap.ts`. |
| H9 | **Geen robots.txt** | Ontbreekt | Geen crawl-instructies. Maak `src/app/robots.ts`. |
| H10 | **Geen metadataBase** | `layout.tsx` | Canonical URLs worden niet gegenereerd. Voeg `metadataBase: new URL("https://vinoperlei.nl")` toe. |
| H11 | **Geen default OG image** | Ontbreekt | Social shares van homepage/collectie tonen geen preview. |

### 2.4 Accessibility
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| H12 | **Mega menu keyboard-ontoegankelijk** | `Header.tsx:225-243` | Opent alleen op `mouseEnter`. Keyboard users kunnen er niet bij. |
| H13 | **Geen `prefers-reduced-motion`** | Nergens | Uitgebreide animaties (Framer Motion, Lenis, CSS keyframes, confetti) zonder opt-out voor motion-gevoelige gebruikers. |
| H14 | **Geen skip-to-content link** | `layout.tsx` | Keyboard users moeten door hele header tabben. |

---

## FASE 3: MEDIUM PRIORITEIT (Kort na livegang)

### 3.1 Code Quality
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| M1 | `Math.random()` in render | `QuickViewModal.tsx:180` | Hydration mismatch. Gebruik `useState` + `useEffect`. |
| M2 | 3x `console.log` | `ExpressCheckout.tsx:12,18,24` | Verwijder voor productie. |
| M3 | Unused `@tanstack/react-query` | `package.json` | ~50 KB ongebruikt. Verwijder. |
| M4 | 20+ unused imports | Diverse bestanden | `cn`, `Link`, `TruckIcon`, `useRef`, `ACTIVE_REGIONS`, etc. |
| M5 | Missing `useEffect` dependency | `WijnenClient.tsx:168` | `activeFilters.region` ontbreekt. |
| M6 | Unescaped apostrophes | `page.tsx:366`, `WijnenClient.tsx:310` | Gebruik `&apos;`. |

### 3.2 UX Completeness
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| M7 | **Search doet niets** | `Header.tsx:258` | Zoek-icoon zonder functionaliteit. Verwijder of implementeer. |
| M8 | **Grape/price filters werken niet** | `WijnenClient.tsx:181-222` | Filters worden gebouwd maar niet toegepast op `filteredProducts`. |
| M9 | **Over Ons is placeholder** | `over-ons/page.tsx` | "Binnenkort Beschikbaar" — maar hero linkt hier met "Ons Verhaal" CTA. |
| M10 | **Blog/Cadeaus zijn placeholders** | `blog/page.tsx`, `cadeaus/page.tsx` | "Binnenkort Beschikbaar" maar prominent gelinkt. |
| M11 | **Newsletter is mock** | `Footer.tsx:218` | `setTimeout` i.p.v. echte service (Klaviyo/Mailchimp). |
| M12 | **Geen double opt-in newsletter** | Ontbreekt | GDPR vereist bevestigingsmail. |

### 3.3 Overige SEO/Meta
| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| M13 | Geen Twitter Card metadata | Alle pagina's | `twitter:card`, `twitter:title` etc. ontbreken. |
| M14 | OG tags ontbreken op 3 pagina's | Over Ons, Blog, Cadeaus | Alleen root layout OG, niet page-specifiek. |
| M15 | Checkout heeft geen metadata | `checkout/page.tsx` | Client component, geen title/description. |
| M16 | Geen `loading.tsx` bestanden | `src/app/` | Geen route-level loading states voor streaming SSR. |

---

## FASE 4: LAAG PRIORITEIT (Nice to have)

| # | Issue | Locatie | Toelichting |
|---|-------|---------|-------------|
| L1 | Age gate content flash | `AgeGate.tsx` | Content kort zichtbaar voor cookie-check klaar is. |
| L2 | Geen officieel NIX18 logo | `Footer.tsx:378` | Custom SVG i.p.v. officieel beeldmerk. |
| L3 | "Incl. BTW" niet bij productprijzen | ProductCard, WijnenClient | Alleen in checkout OrderSummary. |
| L4 | `stockQuantity` nooit uit Shopify | `shopify.ts` | Quantity selector staat altijd max=99. |
| L5 | LoginModal mist focus trap + ARIA | `LoginModal.tsx` | Geen `role="dialog"`, `aria-modal`, focus trap. |
| L6 | AgeGate mist focus trap + ARIA | `AgeGate.tsx` | Zelfde als LoginModal. |
| L7 | Color contrast issues | Footer (white/40, white/20) | `text-white/40` op `#111111` faalt WCAG AA. |
| L8 | 7+ "use client" componenten zijn puur display | Section, Container, Grid, Badge, etc. | Kunnen Server Components zijn voor kleinere bundle. |
| L9 | 30+ dev artifacts in project root | `*.mjs`, `screenshot*.png`, `test-results/` | Opruimen voor clean repo. |
| L10 | Cart slaat volledige Product objecten op | `cartStore.ts:111` | Bloat localStorage. Alleen essentieel velden nodig. |

---

## Aanbevolen Aanpak

### Sprint 1: Legal & Compliance (1-2 dagen)
1. Schrijf/genereer: Privacy Policy, Algemene Voorwaarden, Retourbeleid, Cookiebeleid
2. Maak routes: `/privacy`, `/voorwaarden`, `/cookies`, `/klantenservice/retourneren`, `/klantenservice/verzending`, `/contact`, `/klantenservice/faq`
3. Voeg cookie consent banner toe
4. Voeg KvK, BTW, bedrijfsadres toe aan footer
5. Voeg alcohol disclaimer toe
6. **Verwijder neppe Thuiswinkel Waarborg badge**
7. Vervang placeholder contactgegevens

### Sprint 2: Checkout & Betalingen (2-3 dagen)
1. Koppel checkout aan Shopify Checkout API (redirect naar Shopify hosted checkout)
2. Of: implementeer Shopify Storefront Checkout + betalingsprovider
3. Verwijder of koppel kortingscodes aan Shopify
4. Verwijder of koppel express checkout buttons
5. Verwijder fake auth systeem (of koppel aan Shopify Customers)
6. Verwijder fake reviews (of koppel aan Judge.me / Shopify reviews)

### Sprint 3: Broken Routes & SEO (1 dag)
1. Fix categorie-routes (`/wijnen/rood` etc.) — filter-parameter of eigen pagina's
2. Maak `not-found.tsx` en `error.tsx`
3. Verwijder of bouw blog detail routes
4. Maak `sitemap.ts` en `robots.ts`
5. Voeg `metadataBase` toe
6. Maak default OG image
7. Voeg security headers toe (middleware.ts)

### Sprint 4: Performance & Code Quality (1 dag)
1. Comprimeer hero video (14 MB → 2-3 MB)
2. Converteer wine PNGs naar WebP (31 MB → ~5 MB)
3. Voeg try/catch toe aan Shopify API calls
4. Fix ESLint errors (Math.random, console.logs, unused imports)
5. Verwijder `@tanstack/react-query`
6. Ruim dev artifacts op

### Sprint 5: A11y & UX Polish (1 dag)
1. Keyboard-toegankelijk mega menu
2. `prefers-reduced-motion` support
3. Skip-to-content link
4. Fix grape/price filters
5. Verwijder of implementeer search
6. Vul placeholder pagina's (Over Ons, Blog, Cadeaus) of verwijder links

---

## Quick Wins (< 30 min totaal)
- [ ] Verwijder Thuiswinkel Waarborg badge
- [ ] Verwijder 3x console.log uit ExpressCheckout
- [ ] Verwijder unused `@tanstack/react-query`
- [ ] Voeg `metadataBase` toe aan layout.tsx
- [ ] Maak `not-found.tsx` met on-brand design
- [ ] Vervang placeholder telefoon/email
- [ ] Voeg alcohol disclaimer toe aan footer
