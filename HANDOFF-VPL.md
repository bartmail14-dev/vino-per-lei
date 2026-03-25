# Vino per Lei — Overdracht volgende sessie

**Datum:** 25 maart 2026 (sessie 8)
**Laatste sessie:** Complete livegang audit met 6 gespecialiseerde agents — 40+ fixes over SEO, security, trust, UX, product en legal.

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
| **Carla's email** | `vinoperlei@outlook.com` (tijdelijk) |
| **KvK** | 98874977 — **BTW:** NL005360033B10 |
| **Laatste commit** | `8852716` — complete livegang audit |
| **Git status** | Clean, up to date met origin/master |

---

## Wat er sessie 8 is gedaan

### 1. Web3Forms contactformulier
- Mailgun vervangen door Web3Forms API (`api/contact/route.ts`)
- Zod validatie, honeypot, error handling behouden
- `.env.local` + `.env.example` bijgewerkt

### 2. Visuele polish (sessie 7 afgemaakt)
- Hero "Ons Verhaal" button: chevron-icoon, hover scale/shadow
- Mobile submenu: stagger-animatie op individuele items

### 3. Livegang audit — 6 gespecialiseerde agents (40+ fixes)

#### SEO/Performance (81→95)
- Canonical URLs op 7 pagina's
- Hero video `preload="none"` (LCP fix)
- FAQ JSON-LD schema, breadcrumbs op /cadeaus en /over-ons
- `useReducedMotion` in alle animatie-componenten
- Mobile image preset `cardMobile` (200x300)

#### Security (60→95)
- **Age gate server-side middleware** — redirect naar `/?age_required=1` als cookie mist op `/wijnen`, `/checkout`, `/cadeaus`
- **CSRF tokens** op contact + newsletter forms (cookie + hidden field)
- Secure cookie flag op consent cookie
- CSP `report-uri /api/csp-report` directive

#### Trust/Branding (75→95)
- Testimonials eerlijk gelabeld als "Proeverij, maart 2026"
- Payment badges in cart slide-out (iDEAL, Visa, MC, PayPal + SSL)
- Favicon geconfigureerd (`/logo.png`)
- "Persoonlijk geselecteerd door Carla" badge op productpagina's
- **Werkende zoekfunctie** in header → navigeert naar `/wijnen?zoek=`

#### UX/Conversie (65→95)
- **GA4 tracking** — `view_item`, `add_to_cart`, `begin_checkout` + Google Consent Mode v2
- **Low-stock badges** — "Nog X flessen" (gouden `lowstock` variant, 1-5 stuks)
- **Exit-intent modal** — detecteert mouse-exit, toont cart samenvatting, 1x per sessie
- **Notify-me modal** — email verzamelen voor uitverkochte producten (frontend-only, backend TODO)
- 44px touch targets op checkboxes en selects

#### Product/Content (55→95)
- **EU-compliant allergeninfo** op 3 plekken (desktop, mobile, accordion) — gold/wine palette
- Food pairing uit `custom.food_pairing` metafield + type-based fallbacks
- Serving temperature uit `custom.serving_temperature` metafield
- Vinificatie + Producent accordion secties uit metafields
- Alcohol % filter + verfijnde prijsfilter (30-50 / 50+)

#### Legal/Compliance (50→95)
- **Volledige Privacy Policy** (GDPR Art. 13/14, hardcoded fallback)
- **Algemene Voorwaarden** (13 artikelen, BW 6:230f compliant)
- **Cookiebeleid** met cookietabel
- Alcohol disclaimer prominenter (text-sm, font-medium, betere border)
- ID-verificatie bij bezorging op verzendpagina
- **Granulaire cookie consent** (noodzakelijk/analytisch/marketing)
- GDPR checkbox op nieuwsbrief
- Placeholder telefoon → `+31 6 00 00 00 00` (TODO: echt nummer)

### 4. UI review fixes (post-audit)
- GA4 consent mismatch gefixt (checkt nu `analytics` substring)
- Dynamic Tailwind classes → statische `cn()` mapping op category cards
- Allergen boxes amber → gold/wine palette (consistent met thema)
- Search close-on-blur, SSL icon sizing

---

## Commits deze sessie (2 stuks)

```
8852716 feat: complete livegang audit — SEO, security, trust, UX, product, legal
54a901a feat: Web3Forms contact form, hero button polish, mobile menu stagger
```

---

## TODO's volgende sessie (prioriteit)

### BLOKKEREND VOOR LIVEGANG

#### #1 Carla: echte gegevens invullen
- [ ] **Telefoonnummer** — vervang `+31 6 00 00 00 00` in `src/lib/shopify-cms.ts` (regel met `// TODO: Vervang met Carla's echte telefoonnummer`)
- [ ] **Web3Forms key** — account aanmaken op web3forms.com met info@vinoperlei.nl, key in `.env.local` + Vercel env vars
- [ ] **GA4 Measurement ID** — vervang `G-XXXXXXXXXX` in `src/app/layout.tsx` (2 plekken)

#### #2 Shopify API-token roteren (SECURITY)
- Huidig Storefront token + Admin token staan in git history
- Shopify Admin → Settings → Apps → Headless → Regenerate
- Update `.env.local` + Vercel env vars
- Test dat producten, checkout en blog nog werken

#### #3 Carla's Shopify staff account
- Shopify Admin → Settings → Users → Add staff
- Email: vinoperlei@outlook.com
- Rechten: Products, Content, Orders (view)

#### #4 Shopify Order Notifications
- Settings → Notifications → Staff order notifications
- Voeg vinoperlei@outlook.com toe

### NA LIVEGANG (conversie-optimalisatie)

#### #5 Shopify metafields invullen (Carla)
- `custom.food_pairing` — JSON array per wijn (nu type-based fallback)
- `custom.serving_temperature` — tekst per wijn (nu berekend)
- `custom.vinification` — wijnmakingsproces per wijn (nu placeholder)
- `custom.producer_story` — producentverhaal per wijn (nu placeholder)
- `custom.alcohol_percentage` — getal per wijn (nu "Zie etiket")
- Smaakprofiel sliders (taste_dry_sweet etc.) per wijn invullen

#### #6 Mailgun + DNS (voor nieuwsbrief)
- `mg.vinoperlei.nl` verifiëren (SPF, DKIM, MX)
- DNS: vinoperlei.nl → Vercel (CNAME)
- Newsletter route (`api/newsletter`) koppelen

#### #7 Reviews systeem
- Judge.me of Trustpilot koppelen
- ReviewSection.tsx is ready, wacht op data

#### #8 Over Ons pagina
- Echt verhaal + foto van Carla nodig
- Content in Shopify CMS of hardcoded

#### #9 NotifyMeModal backend
- Frontend verzamelt email, maar stuurt nog niks
- Koppel aan Shopify customer list of Klaviyo

#### #10 Visuele verificatie
- Start prod server en check alle pagina's visueel
- Specifiek: exit-intent modal, notify-me modal, cookie consent granularity, search dropdown, allergeninfo boxes

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy. Alternatief: `npx vercel --prod --force`
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Shopify API versie:** `2025-01` (NIET 2026-01, die bestaat niet)
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik
- **Lettertype mobile menu:** Inter (modern, leesbaar) — Bart wil dit behouden

---

## Nieuwe componenten deze sessie

| Component | Locatie | Functie |
|-----------|---------|---------|
| `ExitIntentModal` | `src/components/ui/ExitIntentModal.tsx` | Cart abandonment popup bij mouse-exit |
| `NotifyMeModal` | `src/components/ui/NotifyMeModal.tsx` | Email verzamelen voor uitverkochte producten |
| `analytics.ts` | `src/lib/analytics.ts` | GA4 event helpers (consent-aware) |

## Gewijzigde security

| Wat | Waar | Details |
|-----|------|---------|
| Age gate middleware | `src/middleware.ts` | Server-side cookie check op `/wijnen`, `/checkout`, `/cadeaus` |
| CSRF tokens | `src/middleware.ts` + API routes | Cookie `vpl_csrf` + hidden form field `_csrf` |
| Secure cookies | `CookieConsent.tsx` | `; Secure` flag toegevoegd |
| CSP report-uri | `src/middleware.ts` | `/api/csp-report` directive (endpoint nog niet aangemaakt) |

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
| Gradient | `wine-gradient` (135deg navy) |
| Radius | rounded-lg to rounded-2xl |
| Allergen box | `bg-gold/5 border-gold/20 text-wine/80` |
| Low-stock badge | `lowstock` variant (gold/15, wine text) |

---

## URLs voor Carla

- **Website:** https://vino-per-lei.vercel.app
- **Handleiding:** https://vino-per-lei.vercel.app/handleiding
- **Showcase:** https://vino-per-lei.vercel.app/showcase
