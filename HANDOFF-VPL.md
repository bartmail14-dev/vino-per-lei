# Vino per Lei — Overdracht volgende sessie

**Datum:** 17 maart 2026
**Laatste sessie:** Commit+push, Playwright visuele verificatie, excerpt script, Shopify token fix

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion v12 + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify** | `vino-per-lei-2.myshopify.com` (alleen CMS backend) |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **KvK** | 98874977 — **BTW:** NL005360033B10 |

---

## Huidige git staat

**Alles gecommit en gepusht.**

```
672f823 feat: add excerpt update script for all Shopify blog articles
1def350 feat: mailgun integration, related articles upgrade, tag-utils expansion
f34ba74 feat: blog visual upgrade + article page premium experience
d366ddc feat: shared newsletter component + blog tag polish
4d6f1d6 fix: Tailwind v4 build crash + visual verification all pages
```

**Build:** clean, `npm run build` slaagt.

---

## Acties volgende sessie

### 1. Shopify Admin API token roteren + scopes toevoegen
Het oude token is gelekt in git history en **moet geroteerd worden**.

**Stappen:**
1. Shopify Admin → Settings → Apps and sales channels → [custom app]
2. Configuration → Admin API access scopes → enable `read_content` + `write_content`
3. **Save** → **Reinstall app** → kopieer nieuw token
4. Update `.env.local`: `SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_NIEUW`
5. Update Vercel env vars als nodig

### 2. Excerpts toevoegen via script
Na token-rotatie:
```bash
SHOPIFY_ADMIN_TOKEN=shpat_NIEUW node scripts/update-excerpt.mjs
```
Vult excerpt voor alle 7 artikelen → site volledig vanuit Shopify beheerbaar.

### 3. Mailgun account + keys
Zodra Mailgun account er is: keys in `.env.local` + Vercel env vars.

---

## Visuele verificatie — GEDAAN (17 maart 2026)

Playwright MCP verificatie voltooid:

#### Blog listing (`/blog`) ✅
- [x] Barolo-artikel als featured hero
- [x] Bento grid layout (1e card = large 2-col)
- [x] Category filter met juiste counts
- [x] No-image cards: floating circles + grain texture
- [x] Inline newsletter CTA na 3e artikel
- [x] Mobiel: cards stapelen, category pills scrollbaar, geen overflow

#### Artikelpagina ✅
- [x] Lead paragraph (grotere tekst)
- [x] Gold diamond dividers vóór h2
- [x] Blockquotes: gold border-left, cream bg
- [x] Lijsten: wine-colored bullets
- [x] Floating share bar (desktop sidebar, mobile bottom)
- [x] Reading progress bar + resterende leestijd
- [x] Newsletter CTA onderaan (light variant)
- [x] Related articles met floating circles
- [x] Scroll-to-top knop
- [x] Mobiel: prose leesbaar, geen overflow

#### Contact (`/contact`) ✅
- [x] Formulier met alle velden + onderwerp dropdown
- [x] Stuurt naar `/api/contact`
- [x] Openingstijden sidebar + FAQ CTA

#### Newsletter (4 plekken) ✅
- [x] Footer, blog listing inline, artikelpagina
- [x] Alle submits → `/api/newsletter`

---

## Wat er deze sessie gedaan is

### Mailgun integratie
- `src/app/api/newsletter/route.ts` — voegt subscriber toe aan Mailgun mailing list (EU endpoint)
- `src/app/api/contact/route.ts` — stuurt contactformulier als email (HTML + plaintext, honeypot, XSS-escaping)
- `NewsletterForm.tsx` — fake timeout vervangen door echte API call
- `ContactForm.tsx` — Web3Forms verwijderd, nu via eigen API route
- Geen tokens meer client-side exposed (was `NEXT_PUBLIC_WEB3FORMS_KEY`)

### Related articles upgrade
- `[slug]/page.tsx` RelatedCard no-image: floating circles, grain, radial glows, gold accent ipv platte gradient

### Tag-utils uitgebreid
- 7 → 30+ tags: Italiaanse regio's (Sicilië, Puglia, Campania...), druivenrassen (Nebbiolo, Sangiovese...), wijntypes (rood, wit, rosé, bubbels), extra categorieën

### Rich demo-artikel in Shopify
- "De ultieme gids voor Barolo: van druif tot glas" aangemaakt via Shopify Admin
- Tags: piemonte, wijnkennis, regiogids
- Content: 5x h2, 1x h3, 2x blockquote, meerdere lijsten, bold/italic, hr
- Visibility: visible, blog: Wijn Verhalen

### Shopify Admin API scope
- Token `shpat_...` mist `read_content` + `write_content` scopes
- Seed script (`scripts/seed-article.mjs`) staat klaar maar werkt pas na scope-uitbreiding
- Fix: Shopify Admin → Settings → Apps → custom app → Configuration → enable read_content + write_content

---

## Wat NIET via Shopify beheersbaar is (hardcoded)

| Pagina | Hardcoded content |
|--------|-------------------|
| **Homepage** | Trust stats, testimonials, wijnregio-links |
| **Over ons** | Values, timeline, filosofie (~80%) |
| **Klantenservice** | Alles (0% CMS) |
| **Verzending** | Kosten, stappen, features |
| **Retourneren** | Stappen, voorwaarden |
| **Cadeaus** | Pakketten, gelegenheden, stappen |
| **Header** | Navigatie, regio's, promo |
| **Footer** | Fallback links, legal tekst |

Wél dynamisch: blog, producten, FAQ, hero, USPs, aankondigingsbalk, contact-gegevens, privacy/voorwaarden.

---

## TODO's

### Prioriteit
1. **Shopify token roteren** — gelekt in git, moet vervangen (zie "Acties volgende sessie")
2. **Excerpts invullen** — `node scripts/update-excerpt.mjs` na token-rotatie
3. **Mailgun account + domain** — keys invullen in `.env.local` + Vercel env vars
4. **Featured images** — Carla moet hero-foto's uploaden per artikel (16:9, min 1200px)

### Shopify / Carla
- Telefoonnummer (040-XXX XXXX placeholder overal)
- Shopify Payments activeren (iDEAL, creditcard)
- DNS vinoperlei.nl naar Vercel
- Overige artikelen uitbreiden met koppen, blockquotes, meer tekst

### Optioneel
- Blog listing met foto's visueel verifiëren zodra Carla foto's upload
- Table of contents testen (moet werken met 5+ headings van Barolo-artikel)
- Meer hardcoded content naar Shopify metaobjects migreren (klantenservice, verzending etc.)

---

## Architectuur blog

```
Shopify Admin (blog "wijn-verhalen")
    | Storefront API (GraphQL)
    | shopify-cms.ts (getBlogArticles, getBlogTags, etc.)
Server Components (page.tsx — revalidate=60)
    | props
Client Components:
    BlogClientComponents.tsx — FeaturedHero, ArticleCard, ArticleGrid, InlineNewsletterCTA
    BlogCategoryFilter.tsx — tag pills met Framer Motion layoutId
    BlogBottomNewsletter.tsx — bottom newsletter wrapper
    BlogAnimations.tsx — 17+ animatie-componenten + ArticleContentEnhancer
    [slug]/page.tsx — Article page layout + ImageLightbox
    [slug]/ArticleHero.tsx — Article header (parallax + floating circles)
    [slug]/ImageLightbox.tsx — Fullscreen image viewer (CustomEvent-based)
    [slug]/FloatingShareBar.tsx — Share sidebar/bottom bar
    [slug]/TableOfContents.tsx — Sticky heading navigator (xl+, 3+ headings)
    [slug]/NewsletterCTA.tsx — Article page newsletter (light variant)
API Routes:
    api/newsletter/route.ts — Mailgun mailing list subscribe (EU endpoint)
    api/contact/route.ts — Mailgun transactional email (honeypot + XSS escaping)
Shared:
    components/newsletter/NewsletterForm.tsx — gedeeld form (dark/light)
    lib/tag-utils.ts — tag slug → display name mapping (30+ tags)
```

---

## Componentenkaart

```
src/app/api/newsletter/route.ts              → Mailgun mailing list subscribe (NIEUW)
src/app/api/contact/route.ts                 → Mailgun contact email (NIEUW)
src/components/newsletter/NewsletterForm.tsx  → Gedeeld newsletter form (dark/light/socialProof)
src/lib/tag-utils.ts                         → Tag display name mapping + getTagLabel()
src/app/blog/page.tsx                        → Blog listing layout, tagCounts berekening
src/app/blog/BlogClientComponents.tsx        → FeaturedHero, ArticleCard, ArticleGrid, InlineNewsletterCTA
src/app/blog/BlogCategoryFilter.tsx          → Category pills met counts
src/app/blog/BlogBottomNewsletter.tsx        → Bottom newsletter client wrapper
src/app/blog/BlogAnimations.tsx              → 17+ animatie-componenten + ArticleContentEnhancer
src/app/blog/[slug]/page.tsx                 → Article page layout + RelatedCard
src/app/blog/[slug]/ArticleHero.tsx          → Article header (parallax + floating circles fallback)
src/app/blog/[slug]/ImageLightbox.tsx        → Fullscreen image lightbox
src/app/blog/[slug]/FloatingShareBar.tsx     → Share sidebar (desktop) / bottom bar (mobile)
src/app/blog/[slug]/TableOfContents.tsx      → Sticky heading navigator (xl+)
src/app/blog/[slug]/NewsletterCTA.tsx        → Article newsletter (light variant)
src/app/contact/ContactForm.tsx              → Contact form (Mailgun, was Web3Forms)
src/components/layout/Footer.tsx             → Footer met newsletter (dark variant)
src/app/globals.css                          → Design tokens, prose-wine, animations, .bg-grain
scripts/seed-article.mjs                     → Shopify blog seed script (needs scope fix)
scripts/check-articles.mjs                   → Fetch + inspect bestaande artikelen
scripts/update-excerpt.mjs                   → Update excerpts voor alle artikelen via Admin API
```

---

## Playwright MCP — visuele verificatie

Gebruik dit voor de grondige check:
1. `browser_navigate` naar de pagina
2. `browser_snapshot` voor accessibility tree (content check)
3. `browser_take_screenshot` voor visuele check (fullPage: true)
4. Na code changes: `npm run build` → server herstarten → screenshot vergelijken

**Server starten (production):**
```bash
npm run build && npx next start --port 3000 > /dev/null 2>&1 &
```

**Server stoppen:**
```bash
powershell.exe -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id \$_ -Force -ErrorAction SilentlyContinue }"
```

---

## Claude Code notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** altijd `npm run build` eerst, dan `npx next start`
- **Shopify tokens** in `.env.local` — NIET committen
- **Lucide React** beschikbaar — `import { IconName } from 'lucide-react'`
- **`.bg-grain`** class voor grain texture overlay
- **Tailwind v4 LET OP**: scanner pikt class-achtige patterns op uit ALLE bestanden incl .md
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` en herstart
- **Framer Motion + React 19:** `useScroll({ target })` crasht tijdens hydration — gebruik handmatige scroll listeners
- **`getTagLabel()`** in `src/lib/tag-utils.ts` — gebruik voor alle tag displays
- **ImageLightbox** werkt via `CustomEvent("open-lightbox")`
- **ArticleContentEnhancer** is DOM-based (niet React) — post-processed `dangerouslySetInnerHTML` content
- **Mailgun EU endpoint**: `api.eu.mailgun.net` (niet api.mailgun.net)
- **Geen title case** — gewoon normaal Nederlands schrijven
