# Vino per Lei — Overdracht & Instructies Volgende Sessie

**Datum:** 12 maart 2026
**Laatste sessie:** Mega livegang-audit + alle fixes + security hardening

---

## Project Info

- **Locatie:** `C:\Users\BartVisser\Desktop\vino-per-lei`
- **GitHub:** `bartmail14-dev/vino-per-lei` (PRIVATE repo, verifieer!)
- **Tech:** Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion + Shopify Storefront API
- **Vercel:** vino-per-lei.vercel.app
- **Shopify:** `vino-per-lei-2.myshopify.com`
- **Klant:** Carla Daniels, Vino per Lei (eenmanszaak), Pastorielaan 56, 5504 CR Veldhoven
- **KvK:** 98874977 | **BTW:** NL005360033B10

---

## Status: NIET GECOMMIT — 142 bestanden gewijzigd

Alle wijzigingen uit deze sessie staan UNCOMMITTED. Eerste actie volgende sessie:

```bash
cd /c/Users/BartVisser/Desktop/vino-per-lei
git status
git diff --stat
```

### Commit strategie (suggestie):
```bash
# 1. Legal pages + cookie consent
git add src/app/privacy/ src/app/voorwaarden/ src/app/cookies/ src/app/klantenservice/ src/app/contact/ src/components/ui/CookieConsent.tsx
git commit -m "feat: wettelijk verplichte pagina's + cookie consent banner"

# 2. Error pages + SEO
git add src/app/not-found.tsx src/app/error.tsx src/app/sitemap.ts src/app/robots.ts src/app/loading.tsx src/app/wijnen/loading.tsx
git commit -m "feat: 404/error pages, sitemap, robots.txt, loading states"

# 3. Footer + Layout compliance
git add src/components/layout/Footer.tsx src/app/layout.tsx
git commit -m "fix: bedrijfsgegevens, alcohol disclaimer, skip-to-content, metadataBase"

# 4. Security hardening
git add src/middleware.ts src/components/ui/AgeGate.tsx src/stores/checkoutStore.ts src/stores/cartStore.ts .env.example
git commit -m "security: CSP hardening, cookie flags, cart guards, PII cleanup"

# 5. Shopify checkout + mock removal
git add src/lib/shopify.ts src/components/cart/CartSlideOut.tsx src/components/checkout/ src/components/product/ReviewSection.tsx src/components/auth/ src/stores/authStore.ts
git commit -m "feat: Shopify hosted checkout, fake reviews/auth verwijderd"

# 6. Code quality + SEO meta
git add src/components/product/QuickViewModal.tsx src/app/over-ons/ src/app/blog/ src/app/cadeaus/ src/app/checkout/layout.tsx
git commit -m "fix: ESLint errors, unused deps, OG/Twitter meta op alle pagina's"

# 7. A11y + Routes
git add src/components/layout/Header.tsx src/app/wijnen/WijnenClient.tsx src/app/page.tsx src/app/globals.css src/components/providers/SmoothScrollProvider.tsx
git commit -m "fix: keyboard mega menu, reduced motion, categorie-routes, filters"

# 8. Image optimization
git add public/wines/ public/hero-video.mp4 src/lib/utils.ts src/components/product/ src/components/cart/ src/components/checkout/OrderSummary.tsx
git commit -m "perf: wine PNGs→WebP (31→2.4MB), hero video gecomprimeerd, CDN presets"

# 9. Cleanup
git add -u  # stages deletions of dev artifacts
git commit -m "chore: dev screenshots en utility scripts opgeruimd"
```

---

## Wat er is gedaan deze sessie

### Audit (6 agents parallel)
- Code quality & build
- SEO & meta tags
- Security & performance
- UX, responsive & a11y
- Shopify & e-commerce
- Legal & NL compliance

### Fixes (6+3+1 agents)
1. **10 nieuwe pagina's:** privacy, voorwaarden, cookies, retourbeleid, verzending, FAQ, contact, klantenservice, not-found (404), error
2. **Cookie consent banner** met Framer Motion animatie
3. **Footer:** Thuiswinkel badge weg, alcohol disclaimer, KvK/BTW/adres Carla, "incl. BTW" note
4. **Layout:** metadataBase, skip-to-content link, noarchive robots
5. **SEO:** sitemap.ts, robots.ts, Twitter cards, OG tags op alle pagina's, checkout metadata
6. **Shopify checkout:** `createCheckout()` gekoppeld aan CartSlideOut + PaymentSection → redirect naar Shopify hosted checkout
7. **Fake reviews verwijderd** → "binnenkort beschikbaar"
8. **Fake auth verwijderd** → wishlist werkt zonder login
9. **Code quality:** Math.random fix, console.logs weg, unused deps/imports, ESLint errors
10. **A11y:** keyboard mega menu, prefers-reduced-motion, skip-to-content, loading skeletons
11. **Routes:** `/wijnen?type=X` i.p.v. `/wijnen/rood`, grape/price filters werkend
12. **Images:** 31 MB PNGs → 2.4 MB WebP, 14 MB video → 4.1 MB, Shopify CDN presets (6 formaten)
13. **Security:** CSP gehardend, cookie flags, hardcoded discounts weg, cart guards, honeypot, Zod validatie, order ID check, PII uit localStorage, .env.example

### Security audit resultaat
- **0 productie-kwetsbaarheden** (npm audit)
- **Geen gelekte tokens** in git history
- **GraphQL veilig** (geparametriseerd)
- **Checkout veilig** (alleen variantId+quantity naar Shopify)
- **CSP gehardend** (unsafe-eval verwijderd)

---

## TODO's volgende sessie (prioriteit)

### BLOKKERS voor livegang
1. **COMMIT ALLES** — 142 uncommitted files (zie strategie hierboven)
2. **Push naar GitHub** en Vercel auto-deploy checken
3. **Shopify Payments activeren** — iDEAL, creditcard etc. in Shopify Admin → Settings → Payments
4. **Telefoonnummer Carla** — staat nu als `040-XXX XXXX`, zoek: `grep -r "040-XXX" src/`
5. **Testen op Vercel** — checkout flow end-to-end (Shopify test mode)
6. **DNS vinoperlei.nl** koppelen aan Vercel (Carla moet domein registreren, art. 6.5 contract)

### HOOG
7. **Content vullen:** Over Ons, Blog, Cadeaus zijn nog "binnenkort beschikbaar" — Carla moet tekst/foto's aanleveren
8. **Contact form backend** koppelen (Web3Forms of Shopify) + rate limiting
9. **Newsletter** koppelen aan Klaviyo/Mailchimp (nu is het een stub)
10. **Footer categorie-links** updaten naar `/wijnen?type=X` (Header + Homepage al gedaan, Footer nog niet)
11. **`npm audit fix`** draaien voor dev-only kwetsbaarheden

### MEDIUM
12. **Kortingscodes** via Shopify API (`checkoutDiscountCodeApplyV2`) i.p.v. client-side
13. **Nonce-based CSP** voor script-src (vervangt unsafe-inline)
14. **Hero banner** (`public/hero-banner.png` 1.5 MB) → WebP
15. **Backup video verwijderen** (`public/hero-video-original.mp4` 14 MB)

### LAAG
16. LoginModal a11y (focus trap, role="dialog")
17. Color contrast fixes (footer white/40 op dark)
18. `use client` verwijderen van pure display components (Section, Container, Badge etc.)

---

## Belangrijke bestanden

| Bestand | Wat het is |
|---------|-----------|
| `AUDIT-LIVEGANG.md` | Volledige audit met alle findings |
| `HANDOFF-VPL.md` | Dit bestand |
| `.env.local` | Shopify tokens (NIET committen) |
| `.env.example` | Template voor env vars |
| `src/middleware.ts` | Security headers (CSP) |
| `src/lib/shopify.ts` | Shopify API + createCheckout |
| `src/stores/checkoutStore.ts` | Checkout state (mock submitOrder nog aanwezig als referentie) |
| `public/hero-video-original.mp4` | Backup originele video (14 MB, kan weg) |

---

## Lees dit EERST volgende sessie
```
Lees HANDOFF-VPL.md in C:\Users\BartVisser\Desktop\vino-per-lei
142 uncommitted files — commit EERST, dan verder met TODO's
```
