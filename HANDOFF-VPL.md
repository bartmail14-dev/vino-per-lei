# Vino per Lei — Overdracht volgende sessie

**Datum:** 18 maart 2026
**Laatste sessie:** 3 rondes audit + fix (15 agents, 44 commits). Alles gecommit en gepusht.

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
| **Laatste commit** | `0b8c728` — merge: fix-agent 5 |
| **Build** | clean, `npm run build` slaagt |

---

## Wat er deze sessie is gedaan

### Ronde 1 — 5 fix-agents (21 commits)
Audit + parallel fix van de 15 kritieke issues uit AUDIT-OVERDRACHT.md:

| Agent | Commits | Wat gefixt |
|-------|---------|------------|
| Webshop Fixer | 5 | Checkout → Shopify cart permalink, fake reviews weg, Thuiswinkel badge weg, rate limiting, KvK/BTW, variants first:10 |
| Filter & Performance | 4 | Werkende filters (region/type/grape/price), zoekbalk, "Naam A-Z" sort, video 4.1→1.5MB, caching |
| Wijn Data | 2 | Fake vinificatie/proefnotities/pairings weg, temperaturen druif-aware, "Bevat sulfieten" |
| Copy Rewriter | 5 | Homepage eerlijk (19 wijnen), Over Ons = Carla's verhaal, CTA's persoonlijk, footer tagline |
| UI/UX Polish | 5 | Navy→burgundy #722f37, aria-labels, focus rings, border-radius, reduced-motion 150ms |

### Ronde 2 — 5 fix-agents (23 commits)
Fix van issues uit de eerste audit-ronde:

| Agent | Commits | Wat gefixt |
|-------|---------|------------|
| Build & Cleanup | 6 | /offerte weg (build fix!), dead account dropdown weg, /over-ons/selectie link weg, unused deps weg, footer params rood→red, Shopify lazy-init |
| Checkout & Data | 4 | Mock postcode API → handmatige invoer, placeholder telefoon weg, ExpressCheckout verwijderd, testimonials als "proefklanten" |
| A11y & Design | 5 | Touch targets 44px, H4→serif, footer contrast verhoogd, radius-lg 12px, focus ring token |
| SEO & Meta | 4 | OG metadata op 6 pagina's, default OG image, JSON-LD (Organization+Breadcrumb+BlogPosting), cookie consent HTTP cookie |
| Security | 4 | Cookie-based rate limiting (serverless), Mailgun placeholder detectie + Zod, .env.example, error boundary hardening |

### Ronde 3 — 5 audit-agents (verificatie, geen commits)
Finale audit bevestigt: site van ~2.5/10 → **8.0/10**.

---

## Huidige scores (ronde 3 audit)

| Categorie | Score | Status |
|-----------|-------|--------|
| Webshop Flow | 8.7/10 | Checkout werkt, 0 dode links, 0 fake data |
| Content & Copy | 8.8/10 | Tone of voice consistent, wijn-expertise klopt |
| SEO & Code | 8.0/10 | Metadata + JSON-LD op bijna alle pagina's |
| A11y & UX | 7.6/10 | Touch targets + keyboard nav goed, contrast issue |
| Security | 6.9/10 | Headers goed, XSS blocker onopgelost |

---

## TODO's volgende sessie (prioriteit)

### BLOCKER — Fix voor livegang

#### 1. XSS: DOMPurify toevoegen voor CMS content
7 bestanden gebruiken `dangerouslySetInnerHTML` zonder sanitization:
- `src/app/blog/[slug]/page.tsx:262`
- `src/app/cookies/page.tsx:41`
- `src/app/privacy/page.tsx:41`
- `src/app/voorwaarden/page.tsx:41`
- `src/app/over-ons/OverOnsContent.tsx:243`
- `src/app/klantenservice/retourneren/RetournerenContent.tsx:112`
- `src/app/klantenservice/verzending/VerzendingContent.tsx:135`

**Fix:**
```bash
npm install isomorphic-dompurify
```
Maak `src/lib/sanitize.ts`:
```typescript
import DOMPurify from 'isomorphic-dompurify';
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p','a','h1','h2','h3','h4','br','strong','em','ul','ol','li','blockquote','img','hr','span','div','table','thead','tbody','tr','th','td'],
    ALLOWED_ATTR: ['href','title','alt','src','class','id','target','rel']
  });
}
```
Wrap alle `dangerouslySetInnerHTML={{ __html: content }}` met `sanitizeHtml(content)`.

#### 2. Footer contrast nog te laag (WCAG AA)
text-wine/50 op #f0e8da achtergrond = 2.1:1 contrast (moet 4.5:1).
Vorige fix ging van /40→/60 maar dat is niet genoeg op de warme achtergrond.

**Fix:** Verhoog alle footer label-opaciteiten agressiever:
- `text-wine/50` → `text-wine/80`
- `text-wine/40` → `text-wine/70`
- `text-wine/35` → `text-wine/60`
- `text-wine/60` → `text-wine/80` (voor body text)

Bestanden: `src/components/layout/Footer.tsx` (regels 174, 179, 289, 357, 369, 371, 375, 384, 418, 421)

### HIGH — Moet voor livegang

#### 3. Checkout pages missen metadata
- `src/app/checkout/page.tsx` — geen title/description/OG
- `src/app/checkout/success/page.tsx` — geen title/description/OG

#### 4. Newsletter form honeypot toevoegen
`src/components/newsletter/NewsletterForm.tsx` mist honeypot (contact form heeft het wel).

#### 5. Input validation alignment
Frontend `bericht.max(2000)` vs API `bericht.max(5000)`. Kies één limiet (2000).
- `src/app/contact/ContactForm.tsx:11`
- `src/app/api/contact/route.ts:22`

#### 6. error.tsx: `<a>` → `<Link>`
`src/app/error.tsx:46` — gebruikt `<a href="/">` ipv Next.js `<Link>`.

#### 7. 27 unused import warnings
Run `npm run lint` en fix alle unused imports. Grootste hits:
- `ReactNode`, `useTransform`, `BookOpenIcon`, `Grid`, `ClockIcon`, `MapPinIcon`
- Unused Zod schemas in `checkoutStore.ts`

### MEDIUM — Na livegang

#### 8. A11y polish
- QuickViewModal mist `aria-label` (regel 62)
- FilterSidebar mobile mist focus trap (regel 181-186)
- ProductCard wishlist button 32px (niet 44px, regel 100)
- CookieConsent buttons 40px (niet 44px, regel 88-99)
- Decoratieve icons missen `aria-hidden="true"` (Footer.tsx:27-49, ProductCard.tsx:112)

#### 9. 2 AI-clichés vervangen
- WijnenClient.tsx:497 — "passie" → "persoonlijke proefingen"
- WijnenClient.tsx:498 — "authentieke" → "echte"

#### 10. Rate limiting verbeteren
Cookie-based rate limiter is omzeilbaar (client kan cookie wissen).
Ideaal: migreer naar Vercel KV of Upstash Redis.
Default secret `"vpl-rl-default-secret"` in middleware.ts:20 moet via env var.

### KLANT (Carla moet doen)

#### 11. Shopify Admin token roteren
Token is gelekt in git history. **MOET geroteerd worden.**
1. Shopify Admin → Settings → Apps → custom app → Configuration
2. Enable `read_content` + `write_content` scopes
3. Save → Reinstall → kopieer nieuw token
4. Update `.env.local`: `SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_NIEUW`
5. Update Vercel env vars

#### 12. Mailgun credentials
`.env.local` heeft placeholder keys. Zodra Mailgun account er is:
- `MAILGUN_API_KEY=key-xxx`
- `MAILGUN_DOMAIN=mg.vinoperlei.nl`
- `MAILGUN_LIST=newsletter@mg.vinoperlei.nl`
- Ook in Vercel env vars zetten

#### 13. Shopify Payments activeren
iDEAL, creditcard, Bancontact in Shopify Admin → Settings → Payments.

#### 14. DNS vinoperlei.nl → Vercel
CNAME record naar cname.vercel-dns.com.

#### 15. Echt telefoonnummer
Carla's telefoonnummer invoeren in Shopify CMS settings (site toont nu alleen email).

#### 16. Featured images blog
Hero-foto's uploaden per blog artikel (16:9, min 1200px breed).

---

## Architectuur (key bestanden)

```
src/
├── app/
│   ├── layout.tsx           → Root layout, metadataBase, fonts, OG image
│   ├── page.tsx             → Homepage (Organization JSON-LD, testimonials)
│   ├── globals.css          → Design tokens, prose-wine, animations
│   ├── sitemap.ts           → Dynamisch: producten + blog + statisch
│   ├── robots.ts            → Disallow /checkout/, /account/
│   ├── error.tsx            → Error boundary (generic NL message)
│   ├── not-found.tsx        → Custom 404
│   ├── wijnen/
│   │   ├── page.tsx         → Product listing (revalidate=300)
│   │   ├── WijnenClient.tsx → Filters, sorting, search (client component)
│   │   └── [handle]/
│   │       └── page.tsx     → Product detail (Product + Breadcrumb JSON-LD)
│   ├── blog/
│   │   ├── page.tsx         → Blog listing (revalidate=60)
│   │   └── [slug]/
│   │       └── page.tsx     → Blog detail (BlogPosting JSON-LD)
│   ├── checkout/
│   │   ├── page.tsx         → Checkout → Shopify cart permalink redirect
│   │   └── success/page.tsx → Order confirmation
│   ├── api/
│   │   ├── contact/route.ts → Mailgun email (Zod, honeypot)
│   │   └── newsletter/route.ts → Mailgun subscribe (Zod)
│   └── (overige pagina's: over-ons, cadeaus, contact, klantenservice/*, privacy, voorwaarden, cookies)
├── components/
│   ├── layout/
│   │   ├── Header.tsx       → Mega menu, mobile menu, cart, login button
│   │   └── Footer.tsx       → Newsletter, social, compliance, contact
│   ├── product/
│   │   ├── WineDetailsAccordion.tsx  → Technische details + "Bevat sulfieten"
│   │   ├── EnhancedTasteProfile.tsx  → Radar chart (geen fake notities)
│   │   ├── FoodPairingGallery.tsx    → Pairings (leeg tot metafield), temperatuur druif-specifiek
│   │   ├── ReviewSection.tsx         → Placeholder "Nog geen reviews"
│   │   └── ProductCard.tsx
│   ├── checkout/
│   │   ├── DeliverySection.tsx → Handmatige adresinvoer (geen mock API)
│   │   └── index.ts
│   ├── ui/
│   │   ├── CookieConsent.tsx → localStorage + HTTP cookie sync
│   │   ├── AgeGate.tsx       → Leeftijdsverificatie
│   │   ├── Button.tsx        → focus-visible:ring-wine token
│   │   └── Input.tsx         → aria-invalid, aria-describedby
│   └── newsletter/
│       └── NewsletterForm.tsx → Gedeeld form (dark/light)
├── lib/
│   ├── shopify.ts           → Storefront API (lazy-init, 10 variants)
│   ├── shopify-cms.ts       → CMS content (lazy-init, fallbacks)
│   └── tag-utils.ts         → 30+ tag labels
├── stores/
│   ├── cartStore.ts         → Zustand + localStorage
│   ├── checkoutStore.ts     → Shopify cart permalink redirect
│   ├── authStore.ts         → PLACEHOLDER (non-functional, duidelijk gemarkeerd)
│   └── wishlistStore.ts     → localStorage-only
├── middleware.ts             → Cookie-based rate limiting, CSP, HSTS, security headers
└── hooks/
    └── useFocusTrap.ts      → Focus trap voor modals
```

---

## Design systeem

| Token | Waarde |
|-------|--------|
| `--wine-burgundy` | `#722f37` (was navy #1a1f3d, gefixt) |
| `--wine-dark` | `#501e24` |
| `--wine-light` | `#8e4a52` |
| `--gold` | `#c9a227` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` (was 8px, gefixt) |
| Fonts | Inter (body) + Playfair Display (headings) |
| Icons | Lucide React |
| Animaties | Framer Motion |
| Smooth scroll | Lenis (disabled bij reduced-motion) |

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
- **Worktree cleanup**: oude worktree branches soms locked door permission denied — `git worktree prune` lost het op
