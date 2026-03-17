# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 17 maart 2026
**Laatste sessie:** Build fix + Playwright visuele verificatie alle pagina's

---

## Project Info

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

## Huidige Git Staat

**Laatste commit gepusht. 1 uncommitted change: deze HANDOFF update.**

```
bfb84d6 docs: overdracht update — hydration fix, grain CSS var, build fixes
539f181 fix: blog hydration crash + grain texture CSS variable
25ec1f3 docs: overdracht update — grain fix, product card redesign, build fix
1f10d3f feat: premium product cards + grain texture centralisatie
```

**Build:** Clean, `npm run build` slaagt (46 pagina's).

---

## Wat is GEDAAN (sessie 17 maart — middag)

### 1. Build Fix — Tailwind v4 HANDOFF Scanning
- **Was:** Build crashte met `Can't resolve '...'` — Turbopack error op globals.css
- **Root cause:** De HANDOFF-VPL.md zelf bevatte het Tailwind-patroon dat de scanner oppakte en als CSS class genereerde, wat resulteerde in een letterlijke `url(...)` in de compiled CSS
- **Fix:** Voorbeeld-patroon verwijderd uit de waarschuwingstekst in HANDOFF

### 2. Playwright Visuele Verificatie — ALLE pagina's OK

| Pagina | Desktop (1280px) | Mobile (390px) | Issues |
|--------|:-:|:-:|--------|
| `/` (homepage) | OK | OK | Counters "0+" (animate on scroll, niet in static) |
| `/blog` | OK | OK | Geen |
| `/blog/[slug]` | OK | OK | **Geen hydration crash** — ArticleHero werkt |
| `/wijnen` | OK | — | Al eerder geverifieerd |
| `/wijnen/[handle]` | OK | OK | Geen |
| `/over-ons` | OK | OK | Geen |
| `/contact` | OK | OK | Geen |
| `/cadeaus` | OK | OK | Geen |
| `/klantenservice/faq` | OK | OK | Geen |

**0 console errors, 0 hydration crashes** in production mode.

---

## TODO's Volgende Sessie (prioriteit)

### 1. NIEUWSBRIEF COMPONENT REDESIGN

Er zijn **4 nieuwsbrief instances** in de site. Ze werken visueel maar zijn nog basic. Doel: premium editorial feel, meer conversie.

**Bestanden:**
- `src/components/layout/Footer.tsx` (regel ~207-284) — footer newsletter
- `src/app/blog/page.tsx` (regel ~158-202) — blog bottom newsletter
- `src/app/blog/BlogClientComponents.tsx` (regel ~474-590) — `InlineNewsletterCTA` in article grid
- `src/app/blog/[slug]/NewsletterCTA.tsx` — article page newsletter panel

**Huidige staat:**
- Footer: gradient wine bg, gold button, animated pulse dot
- Blog inline: dark gradient + grain overlay, editorial 2-col layout, AnimatePresence success state
- Blog bottom: dark bg, radial gold glow, grape SVG decoratie
- Article page: light warm-white panel, rounded-full inputs, checkmark animation

**Verbeterideeeen:**
- Consistenter design language over alle 4 instances
- Micro-interacties op de input (focus glow, typing feedback)
- Premium hover states op de button (shine sweep, gradient shift)
- Betere mobile spacing — sommige instances voelen krap op 390px
- Overweeg 1 gedeeld `NewsletterForm` component ipv 4 losse implementaties
- Social proof element ("500+ wijnliefhebbers gingen je voor")
- Animated envelope/wine icon bij success state
- **Backend:** nog niet gekoppeld — Klaviyo of Mailchimp moet nog

### 2. BLOG SECTIE VERBETEREN

**Blog overzicht (`/blog`):**
- `src/app/blog/page.tsx` — main layout
- `src/app/blog/BlogClientComponents.tsx` — FeaturedHero, ArticleCard (3 sizes), ArticleGrid (bento)
- `src/app/blog/BlogCategoryFilter.tsx` — category pills met shared layout animation
- `src/app/blog/BlogAnimations.tsx` — 17+ animatie-componenten

**Huidige staat:**
- FeaturedHero: cinematic parallax (custom scroll listener, hydration-safe), gold accent lines, film grain, vignette
- ArticleCard sizes: "large" (2-col featured), "default" (standard), "horizontal" (wide)
- Bento grid: newsletter na 3e artikel, load-more pagination
- CategoryFilter: Framer Motion layoutId shared animation, scroll-snap mobile
- Alle artikelen missen featured images → navy gradient fallback

**Verbeterideeeen:**
- **Blog overzicht hero:** De "Wijn Verhalen" header kan meer impact — magazine-achtige typografie, animated wine illustration, of een subtiele video/cinemagraph achtergrond
- **Article cards:** Hover states kunnen rijker — image zoom, overlay reveal, card lift met shadow transition
- **Featured hero zonder foto:** Nu een platte gradient — kan interessanter met animated patterns, abstract wine shapes, of generative art
- **Category filter:** Toevoegen van artikel-count per categorie, animated underline ipv pill bg switch
- **Bento grid:** Meer variatie in card sizes, asymmetrisch magazine layout
- **Reading experience (`/blog/[slug]`):** ArticleHero kan groter/cinematischer, pull quotes styling, betere image captions
- **Lazy load images:** Skeleton shimmer states voor article card images
- **Empty states:** Wijn-gerelateerde illustraties ipv tekst-only

### 3. Blog foto's (extern — Carla)
- Alle 6 artikelen missen featured images → navy gradient fallback
- Carla moet per artikel een foto uploaden in Shopify Admin

### 4. Web3Forms API Key
- web3forms.com → API key maken → email naar Carla
- `.env.local`: `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables

### 5. Dev Mode Hydration Warning (laag)
- Minor Framer Motion attribute mismatches in `next dev`
- In production GEEN probleem
- Optioneel: `suppressHydrationWarning` of `initial={false}`

### 6. Shopify / Carla TODO's (extern)
- **Telefoonnummer** — `040-XXX XXXX` placeholder overal
- **Shopify Payments** — iDEAL, creditcard activeren
- **DNS vinoperlei.nl** naar Vercel
- **Newsletter backend** — Klaviyo/Mailchimp koppelen

---

## Architectuur

```
Shopify Admin (Carla beheert content + blog)
    | Storefront API (GraphQL, read-only)
    | shopify-cms.ts (metaobjects, pages, blog, menus)
    | shopify.ts (products, checkout)
Server Components (async, revalidate=60)
    | props
Client Components (Framer Motion, Zustand cart/auth)
    | ISR
Vercel CDN -> Gebruiker
```

---

## Componentenkaart Newsletter + Blog

```
src/components/layout/Footer.tsx        → Footer newsletter (gold gradient, pulse dot)
src/app/blog/page.tsx                   → Blog layout + bottom newsletter
src/app/blog/BlogClientComponents.tsx   → FeaturedHero, ArticleCard, ArticleGrid, InlineNewsletterCTA
src/app/blog/BlogAnimations.tsx         → 17+ animatie-componenten (BlogFadeIn, RevealText, etc.)
src/app/blog/BlogCategoryFilter.tsx     → Category pills (Framer Motion layoutId)
src/app/blog/[slug]/page.tsx            → Article page layout
src/app/blog/[slug]/NewsletterCTA.tsx   → Article page newsletter panel
src/app/blog/[slug]/ArticleHero.tsx     → Article header (parallax, metadata)
src/app/blog/[slug]/FloatingShareBar.tsx → Share buttons
src/app/blog/[slug]/TableOfContents.tsx  → TOC sidebar
src/app/globals.css                     → Design tokens, .prose-wine, .bg-grain, animaties
```

---

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Node killen:** `powershell.exe -Command "Stop-Process -Id PID -Force"` of `kill PID`. NIET `taskkill /F` in Git Bash
- **Dev server:** altijd background: `npx next dev --port 3000 > /dev/null 2>&1 &`
- **Production test:** `npm run build && npx next start --port 3000 > /dev/null 2>&1 &`
- **Build EERST:** draai altijd `npm run build` voor dev — fix errors eerst
- **Shopify tokens** in `.env.local` — NIET committen
- **Playwright MCP** voor visuele verificatie
- **Lucide React** beschikbaar — `import { IconName } from 'lucide-react'`
- **`.prose-wine`** class voor article content styling
- **`.bg-grain`** class voor grain texture overlay — CSS variable, veilig voor Tailwind v4
- **Tailwind v4 LET OP**: Scanner pikt class-achtige patterns op uit ALLE bestanden incl .md — schrijf nooit Tailwind-achtige syntax in docs!
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` en herstart
- **`optimizeCss: true`** in next.config.ts — vereist `critters` (al geinstalleerd)
- **Framer Motion + React 19:** `useScroll({ target: ref })` crasht tijdens hydration. Gebruik handmatige scroll listeners met `useMotionValue` als alternatief (zie FeaturedHero)
