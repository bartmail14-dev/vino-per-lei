# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 13 maart 2026
**Laatste sessie:** Logo SVG integratie afgerond, footer/header/agegate geüpdatet

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

### 4 commits NIET gepusht naar origin/master:
```
141a082 feat: frontend upgrades — Over Ons redesign, Cadeaus met producten, testimonials, Blog nav
f01e010 feat: blog listing + detail pages, Web3Forms contact form
2397556 docs: handoff update — menu's + blog tags klaar
29a6694 fix: Shopify page handle mismatch + handoff update
```

### 8 uncommitted bestanden:
| Bestand | Status | Beschrijving |
|---------|--------|-------------|
| `src/components/ui/Logo.tsx` | **NIEUW** | SVG logo component (traced van PNG, full + icon variant, grain filter) |
| `src/app/favicon.svg` | **NIEUW** | Favicon SVG (icon-variant van logo) |
| `src/components/layout/Header.tsx` | Modified | Logo component geïntegreerd (was PNG Image) |
| `src/components/layout/Footer.tsx` | Modified | Logo component + paper texture redesign |
| `src/components/ui/AgeGate.tsx` | Modified | Logo component geïntegreerd |
| `package.json` | Modified | `potrace` devDependency toegevoegd |
| `package-lock.json` | Modified | Lock file update |
| `HANDOFF-VPL.md` | Modified | Dit bestand |

### Commit strategie volgende sessie:
```bash
# 1. Commit logo werk
git add src/components/ui/Logo.tsx src/app/favicon.svg src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/ui/AgeGate.tsx package.json package-lock.json
git commit -m "feat: SVG logo component + favicon + integratie Header/Footer/AgeGate"

# 2. Push alles
git push origin master
```

---

## Wat is KLAAR

### Logo SVG Component (`src/components/ui/Logo.tsx`)
- Twee varianten: `"full"` (1024x1024, met tekst) en `"icon"` (500x720, zonder tekst)
- Props: `className`, `color` (default `currentColor`), `variant`
- SVG grain filter via `feTurbulence` + `feDisplacementMap` voor hand-drawn textuur
- `useId()` voor unieke filter ID's (hydration-safe)
- Geïntegreerd in: **Header** (icon variant, navy), **Footer** (full variant, navy), **AgeGate** (full variant, wit)

### Footer Redesign
- Warm beige paper texture (`#f0e8da`) met SVG noise overlay
- Decoratieve wine stain ring, gradient overlays
- Accordion navigatie (mobile) / altijd zichtbaar (desktop)
- Newsletter sectie met wine gradient + gouden CTA
- Payment icons (iDEAL, Mastercard, Visa, PayPal, Bancontact)
- Trust badges (NIX18, SSL)
- Bedrijfsgegevens + juridische links

### Pagina's (in lokale commits, nog niet op Vercel)
- **Blog listing** (`/blog`) + **Blog detail** (`/blog/[slug]`) — haalt artikelen uit Shopify Blog API
- **Contact** (`/contact`) — Web3Forms formulier (key placeholder in `.env.local`)
- **Over Ons** (`/over-ons`) — redesigned met storytelling layout
- **Cadeaus** (`/cadeaus`) — redesigned met Shopify producten
- **Homepage** — testimonials sectie, blog magazine sectie
- **Header** — Blog link toegevoegd aan navigatie

### Overige features
- **Cookie consent** component
- **Shopify checkout** gekoppeld (createCheckout API)
- **AgeGate** met video background + cookie persistence
- **40 pagina's** totaal, **19 Shopify producten** met metafields
- **Build: CLEAN** — 0 errors, 0 warnings

---

## TODO's Volgende Sessie (prioriteit)

### 1. COMMIT + PUSH (5 min)
Zie commit strategie hierboven. Vercel loopt 4+ commits achter.

### 2. Frontend Design Verbeteringen
De site is functioneel compleet maar kan visueel nog sterker. Suggesties:
- **Homepage hero**: Subtielere animaties, mogelijk parallax scroll effect
- **Product cards**: Hover states verfijnen, image loading shimmer
- **Klantenservice pagina's**: Basis template — kunnen visueel rijker (FAQ accordion, verzending timeline)
- **Contact pagina**: Functioneel maar kan een kaart/visual element gebruiken
- **Scroll animaties**: Intersection Observer voor fade-in secties (nu alleen CSS delays op hero)
- **Mobile responsive**: Alles werkt maar fine-tuning op 390px viewport

### 3. Web3Forms API Key
- Ga naar web3forms.com → maak API key → stel email in naar Carla
- Invullen in `.env.local` als `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables zetten

### 4. Shopify / Carla TODO's (extern)
- **Telefoonnummer Carla** — staat als `040-XXX XXXX` overal (grep: `040-XXX`)
- **Shopify Payments activeren** — iDEAL, creditcard etc.
- **DNS vinoperlei.nl** koppelen aan Vercel
- **Newsletter** koppelen aan Klaviyo/Mailchimp
- **Content**: Blog artikelen, Over Ons tekst, Cadeaus beschrijvingen (Carla moet aanleveren)

---

## Architectuur

```
Shopify Admin (Carla beheert content)
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
| `src/lib/shopify-cms.ts` | CMS queries + types + defaults |
| `src/lib/shopify.ts` | Product queries + checkout |
| `src/components/ui/Logo.tsx` | SVG logo (traced, grain filter) |
| `src/stores/cartStore.ts` | Zustand winkelwagen |
| `src/stores/authStore.ts` | Zustand auth state |
| `.env.local` | Shopify tokens + Web3Forms key |

---

## Bekende Issues

- **Vercel loopt achter** — 4+ commits + uncommitted logo werk niet gepusht
- **Web3Forms key ontbreekt** — contact form stuurt nog niks
- **Telefoon placeholder** — `040-XXX XXXX` op meerdere plekken
- **Newsletter** — frontend staat klaar, backend (Klaviyo) niet gekoppeld
- **Filter counts op /wijnen** — sommige counts zijn hardcoded fallbacks (Shopify heeft geen echte filter counts in Storefront API)

---

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code door output overload. Gebruik `npm run build` voor verificatie.
- **Shopify tokens** staan in `.env.local` — NIET committen
- **potrace** is devDependency — alleen nodig voor logo re-trace, niet voor runtime
