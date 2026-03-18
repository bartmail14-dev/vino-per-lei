# Vino per Lei — Overdracht volgende sessie

**Datum:** 18 maart 2026
**Laatste sessie:** Alle audit TODO's gefixt + kleurschema navy gradient + footer compact + blog fixes. Alles gecommit en gepusht.

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
| **KvK** | 98874977 — **BTW:** NL005360033B10 |
| **Laatste commit** | `7886b4d` — blog + footer + images fix |
| **Build** | clean, 0 errors, 0 warnings |
| **Lint** | clean, 0 errors, 0 warnings |

---

## Wat er deze sessie is gedaan

### Ronde 4 — Alle audit TODO's gefixt (4 agents parallel)
| Fix | Details |
|-----|---------|
| XSS DOMPurify | `isomorphic-dompurify` op 7 bestanden, `src/lib/sanitize.ts` |
| Footer contrast | Opaciteiten verhoogd naar WCAG AA (60-80%) |
| Checkout metadata | noindex + title/description op checkout + success |
| Newsletter honeypot | Hidden "company" field, fake success bij bot |
| Validation alignment | Zod bericht max 2000 frontend + API |
| error.tsx Link | `<a>` → Next.js `<Link>` |
| Unused imports | 27 warnings → 0 |
| A11y polish | QuickViewModal aria-label, FilterSidebar focus trap, touch targets 44px, CookieConsent 44px, aria-hidden decoratieve icons |
| Rate limiting | Hardcoded secret → `crypto.randomUUID()` fallback |
| AI-clichés | "passie"→"persoonlijke proefingen", "authentieke"→"echte" |
| Lint errors | 3x set-state-in-effect → useRef/useSyncExternalStore |

### Ronde 5 — Kleurschema + design (2 agents parallel)
| Wijziging | Details |
|-----------|---------|
| Navy gradient | Burgundy (#722f37) → Navy (#1a1f3d) + gradient variabelen |
| Gradient toegepast | Navbar, buttons, newsletter, blog cards, region CTA, announcement bar |
| Hardcoded hex | 10 bestanden: favicon, layout, header, footer, map, taste profile, confetti, newsletter SVG |

### Ronde 6 — Blog + Footer (3 agents parallel)
| Wijziging | Details |
|-----------|---------|
| Blog sticky menu | FloatingShareBar verborgen onder xl, bottom bar op mobiel/tablet |
| Blog CMS images | `figure`/`figcaption` + `width`/`height`/`loading`/`style` in sanitizer |
| Footer compact | Newsletter inline, links strakker, bottom bar op 1 regel, decoraties weg |

---

## TODO's volgende sessie

### HIGH — Shopify order notificatie systeem
Carla doet dit ZZP naast haar baan. Ze moet dezelfde avond nog bestellingen verwerken.
- **Shopify Flow** of **Shopify Notifications** instellen voor escalerende herinneringen
- Push notificaties via Shopify app op telefoon
- Herinnering na 1 uur, 4 uur, 8 uur als order niet verwerkt
- Overweeg: Shopify Flow + email/SMS escalatie
- **Dit is Shopify Admin configuratie, geen code**

### HIGH — Shopify blog afbeeldingen testen
- Sanitizer staat nu `figure`/`figcaption`/`img` toe
- Testen of Shopify blog editor correct `<figure>` + `<figcaption>` genereert
- Eventueel blog editor instructies voor Carla schrijven

### MEDIUM — Visuele polish
- Verdere UI/UX audit met Playwright screenshots
- Mobiele responsive check (375px, 768px)
- Product detail pagina visueel checken

### KLANT (Carla moet doen)

#### 1. Shopify Admin token roteren
Token is gelekt in git history. **MOET geroteerd worden.**
1. Shopify Admin → Settings → Apps → custom app → Configuration
2. Enable `read_content` + `write_content` scopes
3. Save → Reinstall → kopieer nieuw token
4. Update `.env.local`: `SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_NIEUW`
5. Update Vercel env vars

#### 2. Mailgun credentials
`.env.local` heeft placeholder keys. Zodra Mailgun account er is:
- `MAILGUN_API_KEY=key-xxx`
- `MAILGUN_DOMAIN=mg.vinoperlei.nl`
- `MAILGUN_LIST=newsletter@mg.vinoperlei.nl`
- Ook in Vercel env vars zetten

#### 3. Shopify Payments activeren
iDEAL, creditcard, Bancontact in Shopify Admin → Settings → Payments.

#### 4. DNS vinoperlei.nl → Vercel
CNAME record naar cname.vercel-dns.com.

#### 5. Echt telefoonnummer
Carla's telefoonnummer invoeren in Shopify CMS settings.

#### 6. Featured images blog
Hero-foto's uploaden per blog artikel (16:9, min 1200px breed).

---

## Design systeem

| Token | Waarde |
|-------|--------|
| `--wine-burgundy` | `#1a1f3d` (navy blauw) |
| `--wine-dark` | `#12152b` |
| `--wine-light` | `#2d3454` |
| `--wine-gradient` | `135deg, #1a1f3d → #2d3454 → #3d4a6b` |
| `--gold` | `#c9a227` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| Fonts | Inter (body) + Playfair Display (headings) |
| Icons | Lucide React |
| Animaties | Framer Motion |
| Smooth scroll | Lenis (disabled bij reduced-motion) |

---

## Architectuur (key bestanden)

```
src/
├── app/
│   ├── layout.tsx           → Root layout, metadataBase, fonts, OG image
│   ├── page.tsx             → Homepage (Organization JSON-LD, testimonials)
│   ├── globals.css          → Design tokens, gradient utilities, prose-wine, animations
│   ├── sitemap.ts           → Dynamisch: producten + blog + statisch
│   ├── robots.ts            → Disallow /checkout/, /account/
│   ├── error.tsx            → Error boundary (Next.js Link)
│   ├── not-found.tsx        → Custom 404
│   ├── wijnen/              → Product listing + detail
│   ├── blog/                → Blog listing + detail (FloatingShareBar, TableOfContents)
│   ├── checkout/            → Shopify cart permalink redirect + success (noindex)
│   ├── api/                 → Contact (Mailgun, Zod, honeypot) + Newsletter (Zod)
│   └── (overige: over-ons, cadeaus, contact, klantenservice/*, privacy, voorwaarden, cookies)
├── components/
│   ├── layout/Header.tsx    → Mega menu, mobile menu, cart, login button
│   ├── layout/Footer.tsx    → Compact: newsletter inline, links, compliance
│   ├── product/             → Cards, carousel, accordion, taste profile, pairings
│   ├── checkout/            → Delivery, payment, order summary
│   ├── ui/                  → Button (gradient), CookieConsent, AgeGate, Input
│   ├── newsletter/          → NewsletterForm (honeypot)
│   └── filters/             → FilterSidebar (focus trap)
├── lib/
│   ├── shopify.ts           → Storefront API (lazy-init, 10 variants)
│   ├── shopify-cms.ts       → CMS content (lazy-init, fallbacks)
│   ├── sanitize.ts          → DOMPurify (figure, figcaption, img + attrs)
│   └── tag-utils.ts         → 30+ tag labels
├── stores/                  → Zustand: cart, checkout, auth (placeholder), wishlist
├── middleware.ts             → Rate limiting (random secret), CSP, HSTS, security headers
└── hooks/useFocusTrap.ts    → Focus trap voor modals
```

---

## Claude Code notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3000 > /dev/null 2>&1 &`
- **Server stoppen:** `powershell.exe -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id \$_ -Force -ErrorAction SilentlyContinue }"`
- **Shopify tokens** in `.env.local` — NIET committen
- **Tailwind v4**: scanner pikt class-achtige patterns op uit ALLE bestanden incl .md
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` en herstart
- **Framer Motion + React 19:** `useScroll({ target })` crasht tijdens hydration
- **Windows paths** voor Claude tools, **Unix paths** voor Bash
- **Mailgun EU endpoint**: `api.eu.mailgun.net`
- **CSP `unsafe-inline`**: nodig voor Tailwind v4 + Next.js, niet te vermijden
- **Chrome Playwright**: Chrome moet eerst gesloten worden, SingletonLock verwijderen
