# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 14 maart 2026
**Laatste sessie:** Blog baanbrekend redesign — animaties, reading progress, newsletter CTA, editorial details

---

## Project Info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app |
| **Shopify** | `vino-per-lei-2.myshopify.com` (alleen CMS backend) |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **KvK** | 98874977 — **BTW:** NL005360033B10 |

---

## Huidige Git Staat

### Alles gepusht, working tree clean (behalve dit bestand)

Laatste commits:
```
b6fde4a feat: animated category filter + share buttons upgrade
3d28949 feat: blog baanbrekend — scroll animations, reading progress, newsletter CTA, editorial details
7b2c907 feat: blog design upgrade — decorative motifs, richer cards, visual hierarchy
4d5a8d1 fix: blog redesign — proper contrast, no-image fallbacks, better spacing
```

---

## TODO's Volgende Sessie (prioriteit)

### 1. LOGO GROTER MAKEN (HOGE PRIORITEIT — klantverzoek)

Het logo moet overal significant groter. Dit is een site-brede aanpassing.

**Waar het logo gebruikt wordt:**
- `src/components/ui/Logo.tsx` — SVG logo component (traced, grain filter). Check `width`/`height` props en defaults.
- `src/components/layout/Header.tsx` — Logo in de navbar (desktop + mobile). Nu waarschijnlijk ~40-50px, moet groter.
- `src/components/layout/Footer.tsx` — Logo in de footer.
- `src/app/blog/page.tsx` — Geen logo, maar check of het in de blog hero past als het groter wordt.
- **AgeGate** — Logo in de leeftijdsverificatie overlay. Zoek in components naar AgeGate.
- **Favicon** — Mogelijk ook groter/beter zichtbaar maken.

**Aanpak:**
1. Lees eerst `Logo.tsx` — begrijp de SVG structuur en huidige sizing
2. Vergroot de default props (width/height) in `Logo.tsx`
3. Per plek waar Logo gebruikt wordt: check of de omringende container/spacing meeschaalt
4. Header: logo groter → navbar hoogte meeschaalt → check dat menu items nog kloppen
5. Footer: logo groter → check spacing
6. AgeGate: logo groter → check modal sizing
7. Test op mobile (390px) EN desktop (1280px+) — logo mag niet overflow veroorzaken
8. Gebruik Playwright MCP voor visuele verificatie

### 2. Blog foto's uploaden
- Alle 6 artikelen missen featured images → alles toont navy fallback
- Carla moet per artikel een foto uploaden in Shopify Admin
- Image card variant is al gebouwd en klaar

### 3. Web3Forms API Key
- web3forms.com → API key maken → email naar Carla
- `.env.local`: `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables

### 4. Frontend Design Verbeteringen
- **Klantenservice pagina's**: Verzending/Retourneren visueel rijker (timeline, icons)
- **Scroll animaties**: Over Ons, Cadeaus, wijnen listing — AnimateOnScroll toepassen
- **Mobile fine-tuning**: 390px viewport check op alle pagina's

### 5. Shopify / Carla TODO's (extern)
- **Telefoonnummer** — `040-XXX XXXX` placeholder overal (grep: `040-XXX`)
- **Shopify Payments** — iDEAL, creditcard activeren
- **DNS vinoperlei.nl** → Vercel
- **Newsletter backend** → Klaviyo/Mailchimp koppelen (frontend CTA staat klaar in blog + footer)

---

## Wat is KLAAR

### Blog Baanbrekend Redesign (deze sessie)

**Nieuwe componenten:**
- `src/app/blog/BlogAnimations.tsx` — BlogFadeIn, BlogStagger, BlogStaggerItem, AnimatedDivider, RevealText, ParallaxHero
- `src/app/blog/ReadingProgress.tsx` — Gouden progress bar + glow + percentage indicator

**Listing `/blog`:**
- RevealText letter-by-letter hero animatie
- Radial glow achtergrond effect
- Animated gold divider (lijn + diamant accent)
- Staggered grid cards (fade+scale entrance)
- Newsletter CTA sectie (donker, wijnfles silhouet, email signup, gradient gold button)
- Category filter met Framer Motion layoutId pill animatie
- Featured card: druiventros patroon, gouden hoeklijnen, "Lees het verhaal" CTA
- No-image cards: druiventros decoratie + wine glass icon in accent bar
- Eerste grid card spant 2 kolommen (sm:col-span-2) als 3+ artikelen

**Detail `/blog/[slug]`:**
- Reading progress bar (goud + glow + "30%" indicator desktop)
- Drop cap (first-letter 5xl serif wine kleur)
- Fade-in hero secties (gestaffeerd)
- Featured image grotere overlap (-mt-8) + shadow-2xl
- Animated gold divider tussen content en share
- Author card: gradient accent bar links, "Geschreven door" label, serif naam, ring avatar
- Related articles: wine glass icon + staggered card entrance
- Share buttons: bordered circles, platform-kleuren hover, scale effect, "Gekopieerd!" tooltip

### Eerdere features (al klaar)
- Blog systeem: listing + detail + categorie filter + share buttons
- Backend: `shopify-cms.ts` met authorV2, seo, readingTimeMinutes
- 6 artikelen in Shopify, auteur: Bart Visser
- Scroll-animaties (AnimateOnScroll, StaggerChildren, StaggerItem)
- Testimonials upgrade, Contact redesign, ProductCard shimmer
- Logo SVG, Footer, Over Ons, Cadeaus, AgeGate, Cookie consent
- 40 pagina's, 19 Shopify producten, checkout gekoppeld

---

## Architectuur

```
Shopify Admin (Carla beheert content + blog)
    ↓ Storefront API (GraphQL, read-only)
    ↓ shopify-cms.ts (metaobjects, pages, blog, menus)
    ↓ shopify.ts (products, checkout)
Server Components (async, revalidate=60)
    ↓ props
Client Components (Framer Motion, Zustand cart/auth)
    ↓ ISR
Vercel CDN → Gebruiker
```

### Key bestanden
| Bestand | Rol |
|---------|-----|
| `src/components/ui/Logo.tsx` | SVG logo (traced, grain filter) — **VERGROOT DIT** |
| `src/components/layout/Header.tsx` | Navbar met logo — **LOGO GROTER** |
| `src/components/layout/Footer.tsx` | Footer met logo — **LOGO GROTER** |
| `src/lib/shopify-cms.ts` | CMS queries + blog + types + defaults |
| `src/lib/shopify.ts` | Product queries + checkout |
| `src/app/blog/page.tsx` | Blog listing (featured + grid + newsletter CTA) |
| `src/app/blog/[slug]/page.tsx` | Blog detail (hero + article + related) |
| `src/app/blog/BlogAnimations.tsx` | Scroll animatie componenten (blog) |
| `src/app/blog/ReadingProgress.tsx` | Reading progress bar |
| `src/app/blog/BlogCategoryFilter.tsx` | Categorie filter met layoutId animatie |
| `src/app/blog/[slug]/ShareButtons.tsx` | Share buttons met "Gekopieerd!" feedback |
| `src/components/ui/AnimateOnScroll.tsx` | Generieke scroll-animatie componenten |
| `src/stores/cartStore.ts` | Zustand winkelwagen |
| `.env.local` | Shopify tokens + Web3Forms key |

---

## Bekende Issues

- **Web3Forms key ontbreekt** — contact form stuurt nog niks
- **Telefoon placeholder** — `040-XXX XXXX` op meerdere plekken
- **Newsletter** — frontend klaar (blog + footer), backend (Klaviyo) niet gekoppeld
- **Hydration warning** — bestaand, niet blokkerend
- **Blog foto's** — alle 6 artikelen missen featured images

---

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Shopify tokens** in `.env.local` — NIET committen
- **Playwright MCP** voor visuele verificatie (Chrome mag niet al open zijn)
- **Blog design les**: Geen image placeholders met onzichtbare decoraties op lichte achtergronden. Als er geen foto is → donkere accent bar met categorie tekst, rest text-only. Altijd goed contrast.
- **Dev server**: draait mogelijk al op port 3000 — check met `netstat -ano | grep :3000` voordat je een nieuwe start
