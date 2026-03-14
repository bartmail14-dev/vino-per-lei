# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 14 maart 2026
**Laatste sessie:** Blog redesign, scroll-animaties, testimonials upgrade, contact redesign

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
8d13a51 feat: blog redesign — magazine listing, rich detail page, category filter
c562a87 feat: scroll-animaties, testimonials upgrade, contact redesign + product shimmer
495df64 feat: SVG logo component + favicon + integratie Header/Footer/AgeGate
141a082 feat: frontend upgrades — Over Ons redesign, Cadeaus met producten, testimonials, Blog nav
```

---

## Wat is KLAAR

### Blog Systeem (nieuw deze sessie)
- **Blog listing** (`/blog`) — magazine-style met featured hero, categorie filter (tags), rijke cards
- **Blog detail** (`/blog/[slug]`) — fullscreen hero, auteur info, leestijd, share buttons, gerelateerde artikelen
- **Backend** — `shopify-cms.ts` uitgebreid: authorV2, seo, readingTimeMinutes, getBlogArticlesByTag, getBlogTags
- **Categorie filter** — client component `BlogCategoryFilter.tsx` met URL params (`/blog?tag=piemonte`)
- **Share buttons** — WhatsApp, Facebook, X, kopieer link
- **6 artikelen** in Shopify (wijn-verhalen blog), auteur: Bart Visser
- **Carla kan verhalen schrijven** via Shopify Admin → Online Store → Blog posts → "Wijn Verhalen"

### Scroll-animaties (nieuw deze sessie)
- `AnimateOnScroll` + `StaggerChildren` + `StaggerItem` componenten (`src/components/ui/AnimateOnScroll.tsx`)
- Homepage secties animeren bij scrollen (fadeUp, fadeLeft, fadeRight, scaleIn, stagger)

### Testimonials upgrade
- Grote quote marks, initialen avatars met wine gradient, italic tekst, decoratief hoekje

### Contact redesign
- Donkere hero, overlappende info cards met icons, formulier in card, wine-gradient FAQ blok

### ProductCard shimmer
- Image loading skeleton placeholder

### Eerdere features (al klaar)
- Logo SVG, Footer redesign, Over Ons, Cadeaus, AgeGate, Cookie consent
- 40 pagina's, 19 Shopify producten, checkout gekoppeld

---

## TODO's Volgende Sessie (prioriteit)

### 1. Web3Forms API Key
- Ga naar web3forms.com → maak API key → stel email in naar Carla
- Invullen in `.env.local` als `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables zetten

### 2. Frontend Design Verbeteringen
- **Klantenservice pagina's**: Verzending/Retourneren kunnen visueel rijker (timeline, icons)
- **Scroll animaties**: Over Ons, Cadeaus, wijnen listing — dezelfde AnimateOnScroll toepassen
- **Mobile fine-tuning**: 390px viewport check op alle pagina's

### 3. Blog Content voor Carla
- Carla kan nu zelf artikelen schrijven in Shopify Admin
- Tags gebruiken voor categorisatie (piemonte, regiogids, tips-en-tricks, etc.)
- Afbeeldingen uploaden per artikel (featured image)
- SEO titel/beschrijving invullen per artikel

### 4. Shopify / Carla TODO's (extern)
- **Telefoonnummer Carla** — staat als `040-XXX XXXX` overal (grep: `040-XXX`)
- **Shopify Payments activeren** — iDEAL, creditcard etc.
- **DNS vinoperlei.nl** koppelen aan Vercel
- **Newsletter** koppelen aan Klaviyo/Mailchimp

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
| `src/lib/shopify-cms.ts` | CMS queries + blog + types + defaults |
| `src/lib/shopify.ts` | Product queries + checkout |
| `src/components/ui/AnimateOnScroll.tsx` | Scroll-animatie componenten |
| `src/components/home/HomeAnimations.tsx` | Homepage client wrappers |
| `src/app/blog/BlogCategoryFilter.tsx` | Blog categorie filter (client) |
| `src/app/blog/[slug]/ShareButtons.tsx` | Social share buttons (client) |
| `src/components/ui/Logo.tsx` | SVG logo (traced, grain filter) |
| `src/stores/cartStore.ts` | Zustand winkelwagen |
| `.env.local` | Shopify tokens + Web3Forms key |

---

## Bekende Issues

- **Web3Forms key ontbreekt** — contact form stuurt nog niks
- **Telefoon placeholder** — `040-XXX XXXX` op meerdere plekken
- **Newsletter** — frontend staat klaar, backend (Klaviyo) niet gekoppeld
- **Hydration warning** — bestaand issue, niet blokkerend

---

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code door output overload
- **Shopify tokens** staan in `.env.local` — NIET committen
- **Playwright MCP** gebruikt voor visuele verificatie
