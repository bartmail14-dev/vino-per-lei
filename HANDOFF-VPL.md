# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 16 maart 2026
**Laatste sessie:** Product card fix + blog redesign via 12 creatieve agents

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

### UNCOMMITTED — 71 bestanden gewijzigd + 12 nieuwe bestanden

Dit bevat TWEE sessies aan werk:
1. **Vorige sessie**: 12 design agents — volledige site overhaul (icons, typography, design system, content pages)
2. **Deze sessie**: Product card fix + blog redesign via 12 agents

Laatste commits (gepusht):
```
ee869f4 feat: logo significant groter in Header, Footer en AgeGate
b9dac5f docs: handoff update
b6fde4a feat: animated category filter + share buttons upgrade
3d28949 feat: blog baanbrekend — scroll animations, reading progress, newsletter CTA, editorial details
```

**59 modified files, 12 new files, ~4185 insertions, ~3453 deletions**

---

## Wat is GEDAAN (deze sessie — 16 maart)

### 1. Product Card Fix (ProductCard.tsx)
- **Probleem**: Flesafbeeldingen werden afgesneden door `overflow-hidden` op image container
- **Fix**: Container gesplitst in twee lagen:
  - Binnenste div met `overflow-hidden rounded-t-xl` voor gradient achtergrond + shine sweep
  - Buitenste div ZONDER overflow zodat flessen vrij uitsteken
- **Bestand**: `src/components/product/ProductCard.tsx`

### 2. Blog Runtime Bug Fix (BlogClientComponents.tsx)
- **Probleem**: "Target ref is defined but no element was found" — Framer Motion crash op /blog
- **Oorzaak**: `FeaturedHero` component had `useScroll({ target: ref })` maar `ref={ref}` ontbrak op de no-image `<article>` branch
- **Fix**: `ref={ref}` toegevoegd aan beide branches van FeaturedHero
- **Bestand**: `src/app/blog/BlogClientComponents.tsx` regel 179

### 3. Blog Redesign — 12 Agents

#### Art Director — Homepage Blog (page.tsx)
- "Il Giornale" editorial masthead met tracking-wide eyebrow
- "Wijn *Verhalen*" italic serif title accent
- "No. 01 / 02 / 03" editorial nummering (geen decoratieve SVGs meer)
- Drie oppervlakken: wine-dark (lead), cream (card 2), wine (card 3)
- Asymmetrisch grid, thin dividers, refined meta typography

#### UI Designer — Blog Listing (BlogClientComponents.tsx + blog/page.tsx)
- FeaturedHero: cinematic 3-layer gradient overlays, film grain (data URI via `style=`), gold accent line
- ArticleCard: 3:2 image ratios, hover slide-in CTA overlay, refined category pills
- InlineNewsletterCTA: grain texture, vertical gold accent, refined form
- LoadMoreButton: decorative wine glass divider
- BlogSkeleton: mirrors actual layout
- EmptyState: wine-themed, "In vino veritas" tagline

#### UX Designer — Blog Detail (blog/[slug]/ — 5 bestanden)
- ArticleHero: text-only category, compact meta line, reduced parallax (12%)
- FloatingShareBar: ghost-style buttons (w-9 h-9), dot separators, no "Delen" label
- TableOfContents: scroll-aware (appears/hides based on scroll), animated dot progress indicator
- NewsletterCTA: subtle light bg, natural in reading flow, wine-colored submit
- Related articles: 3:2 ratio, category as text, subtle hover, simplified author card

#### Graphic Designer — Typography (globals.css)
- `.prose-wine` verfijnd: line-height 1.85, tighter paragraph spacing (1.6em)
- Pull quotes: generous vertical padding
- H4: tighter letter-spacing (0.04em)
- Ordered list markers: 55% opacity (consistent met unordered)

#### 3x Gestalt Agents — 30+ fixes across all blog files
- **Hierarchy & Proximity**: heading sizes opgeschaald, CTA's altijd zichtbaar (niet hidden tot hover), metadata grouping
- **Continuity & Figure-Ground**: reading progress badge sterker, mobile share bar hoger contrast, TOC active states, article grid fade overlay, decoratieve SVG hover verwijderd
- **Similarity & Common Region**: CTA teksten gestandaardiseerd ("Lees meer"), border-radius consistent (rounded-2xl), badge styling uniform, related articles verbeterd

### 4. Build Fix — GRAIN_TEXTURE
- UI Designer gebruikte `bg-[url('${GRAIN_TEXTURE}')]` in Tailwind classes — werkt niet (Tailwind kan geen JS template literals parsen)
- Gefixt naar `style={{ backgroundImage: \`url('${GRAIN_TEXTURE}')\` }}` op 4 plekken
- `.next` cache moest verwijderd worden om oude Tailwind classes te clearen

---

## TODO's Volgende Sessie (prioriteit)

### 1. COMMITTEN EN PUSHEN (CRITICAL)
71 bestanden + 12 nieuwe bestanden staan lokaal. Commit in logische groepen of als één grote commit en push naar master.

### 2. Hydration Warning
Er is een hydration mismatch warning (niet critical, site werkt). Check console na commit.

### 3. Alle 12 pagina's visueel verifiëren met Playwright
Screenshot ELKE pagina op 390px (mobile) en 1280px (desktop):
- `/` (homepage) — WERKT, geverifieerd desktop
- `/blog` — Bug gefixed, niet visueel gecheckt
- `/blog/[slug]` — Redesigned, niet gecheckt
- `/wijnen` — niet gecheckt
- `/wijnen/[handle]` — niet gecheckt
- `/over-ons` — niet gecheckt
- `/contact` — niet gecheckt
- `/cadeaus` — niet gecheckt
- `/klantenservice` — niet gecheckt
- `/klantenservice/verzending` — niet gecheckt
- `/klantenservice/retourneren` — niet gecheckt
- `/klantenservice/faq` — niet gecheckt

### 4. Blog foto's uploaden
- Alle 6 artikelen missen featured images → navy gradient fallback
- Carla moet per artikel een foto uploaden in Shopify Admin

### 5. Web3Forms API Key
- web3forms.com → API key maken → email naar Carla
- `.env.local`: `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables

### 6. Shopify / Carla TODO's (extern)
- **Telefoonnummer** — `040-XXX XXXX` placeholder overal
- **Shopify Payments** — iDEAL, creditcard activeren
- **DNS vinoperlei.nl** → Vercel
- **Newsletter backend** → Klaviyo/Mailchimp koppelen

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

---

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Shopify tokens** in `.env.local` — NIET committen
- **Playwright MCP** voor visuele verificatie (Chrome mag niet al open zijn — sluit via PowerShell: `Get-Process chrome | Stop-Process -Force`)
- **Dev server**: draait mogelijk al op port 3000 — check met `netstat -ano | grep :3000`
- **Lucide React** is geïnstalleerd — gebruik `import { IconName } from 'lucide-react'` of via `@/components/icons`
- **`.prose-wine`** class beschikbaar voor article content styling
- **Typography utilities**: `.text-label`, `.text-button`, `.text-nav`, `.text-tagline` in globals.css
- **GRAIN_TEXTURE**: data URI in BlogClientComponents.tsx — gebruik `style={{ backgroundImage }}` NIET `bg-[url()]` met template literals
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` folder en herstart dev server
