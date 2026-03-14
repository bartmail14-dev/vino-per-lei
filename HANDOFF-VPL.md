# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 14 maart 2026
**Laatste sessie:** Blog contrast/spacing fix, detail page upgrade

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
4d5a8d1 fix: blog redesign — proper contrast, no-image fallbacks, better spacing
1289279 docs: handoff update — blog redesign + design verbeteringen samengevat
8d13a51 feat: blog redesign — magazine listing, rich detail page, category filter
c562a87 feat: scroll-animaties, testimonials upgrade, contact redesign + product shimmer
```

---

## Wat is KLAAR

### Blog Redesign (deze sessie — `4d5a8d1`)
- **Listing `/blog`**: Featured article = donkere navy card met goud accenten (geen lege image placeholder). Grid cards met navy accent bar + categorie als er geen foto is, image card als er wel een foto is.
- **Detail `/blog/[slug]`**: Meer ademruimte hero (grotere paddings), pipe-scheiders in meta (auteur | datum | leestijd), grotere artikeltekst (17px, 1.85 line-height), fallback auteur bio.
- **Related cards**: Consistent navy accent bar design.
- **Category filter**: Horizontaal scrollbaar op mobile, subtielere hover states.
- **Kernprincipe**: Geen image placeholders — als er geen foto is, wordt het een text-only card met donkere accent. Goed contrast overal.

### Blog Systeem (vorige sessie)
- Blog listing + detail + categorie filter + share buttons
- Backend: `shopify-cms.ts` met authorV2, seo, readingTimeMinutes, getBlogArticlesByTag, getBlogTags
- 6 artikelen in Shopify, auteur: Bart Visser
- Carla kan zelf schrijven via Shopify Admin → Blog posts → "Wijn Verhalen"

### Eerdere features (al klaar)
- Scroll-animaties (AnimateOnScroll, StaggerChildren, StaggerItem)
- Testimonials upgrade, Contact redesign, ProductCard shimmer
- Logo SVG, Footer, Over Ons, Cadeaus, AgeGate, Cookie consent
- 40 pagina's, 19 Shopify producten, checkout gekoppeld

---

## TODO's Volgende Sessie (prioriteit)

### 1. Blog foto's uploaden (HOGE PRIORITEIT)
- De artikelen hebben geen featured images → alles toont de navy fallback
- Carla (of jij) moet per artikel een foto uploaden in Shopify Admin
- Zodra er foto's zijn zien de cards er veel rijker uit (image card variant is al gebouwd)

### 2. Web3Forms API Key
- web3forms.com → API key maken → email naar Carla
- `.env.local`: `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables

### 3. Frontend Design Verbeteringen
- **Klantenservice pagina's**: Verzending/Retourneren visueel rijker (timeline, icons)
- **Scroll animaties**: Over Ons, Cadeaus, wijnen listing — AnimateOnScroll toepassen
- **Mobile fine-tuning**: 390px viewport check op alle pagina's

### 4. Shopify / Carla TODO's (extern)
- **Telefoonnummer** — `040-XXX XXXX` placeholder overal (grep: `040-XXX`)
- **Shopify Payments** — iDEAL, creditcard activeren
- **DNS vinoperlei.nl** → Vercel
- **Newsletter** → Klaviyo/Mailchimp koppelen

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
| `src/app/blog/page.tsx` | Blog listing (featured + grid cards) |
| `src/app/blog/[slug]/page.tsx` | Blog detail (hero + article + related) |
| `src/app/blog/BlogCategoryFilter.tsx` | Categorie filter (client) |
| `src/app/blog/[slug]/ShareButtons.tsx` | Social share buttons (client) |
| `src/components/ui/AnimateOnScroll.tsx` | Scroll-animatie componenten |
| `src/components/ui/Logo.tsx` | SVG logo (traced, grain filter) |
| `src/stores/cartStore.ts` | Zustand winkelwagen |
| `.env.local` | Shopify tokens + Web3Forms key |

---

## Bekende Issues

- **Web3Forms key ontbreekt** — contact form stuurt nog niks
- **Telefoon placeholder** — `040-XXX XXXX` op meerdere plekken
- **Newsletter** — frontend klaar, backend (Klaviyo) niet gekoppeld
- **Hydration warning** — bestaand, niet blokkerend
- **Blog foto's** — alle 6 artikelen missen featured images

---

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Shopify tokens** in `.env.local` — NIET committen
- **Playwright MCP** voor visuele verificatie
- **Blog design les**: Geen image placeholders met onzichtbare decoraties op lichte achtergronden. Als er geen foto is → donkere accent bar met categorie tekst, rest text-only. Altijd goed contrast.
