# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 17 maart 2026
**Laatste sessie:** Grain texture centralisatie + ProductCard premium redesign

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

### Laatste commits (lokaal, niet gepusht):

```
1f10d3f feat: premium product cards + grain texture centralisatie
79f0d4d feat: complete design overhaul — product cards, blog redesign, UI refinements
```

**Let op:** commit `79f0d4d` bevat 71+ bestanden van eerdere sessies (12 design agents). Alles is gecommit, niets uncommitted.

---

## Wat is GEDAAN (deze sessie — 17 maart)

### 1. Grain Texture Centralisatie
- **Was:** `GRAIN_BG_IMAGE` const in BlogClientComponents.tsx + inline `backgroundImage` url in Footer.tsx
- **Nu:** `.bg-grain` CSS class in globals.css — alle componenten gebruiken `className="bg-grain"`
- **Bestanden:** globals.css, BlogClientComponents.tsx (4 plekken), Footer.tsx (1 plek)

### 2. Build Error Fix — Tailwind class-patronen in Markdown + Grain Texture CSS Variable
- **Root cause:** Tailwind v4 scande ALLE bestanden incl. markdown. Elke `url()` in bronbestanden werd opgepikt.
- **Fix 1:** Tekst in HANDOFF herschreven zodat er geen Tailwind-class-achtige patterns in staan.
- **Fix 2:** Grain texture verplaatst naar CSS variable `--grain-texture` in `:root` (globals.css). `.bg-grain` class gebruikt nu `var(--grain-texture)` — Tailwind scant geen CSS variables.
- **Fix 3:** `critters` package geïnstalleerd (vereist door `optimizeCss: true` in next.config).
- **LET OP:** Tailwind v4 scant ALLE bestanden in het project (inclusief .md). Schrijf nooit Tailwind class syntax in markdown bestanden!

### 3. ProductCard Premium Redesign
- **Grotere image area** (h-36/h-48 ipv h-28/h-40) — flessen steken eleganter uit
- **Gold accent lijnen** — subtiele gouden gradient divider boven kaart en tussen image/content
- **Region als editorial small-caps** — `PUGLIA · 2022` (tracking-[0.15em]) ipv "Puglia Selection | Puglia" + losse vintage
- **Titel line-clamp-2** — namen als "Amarone della Valpolicella DOCG" worden niet meer afgeknipt
- **Outline button** — `bg-wine/[0.04] border border-wine/20` → filled bij hover (was: zware navy blok)
- **Grain texture** op image achtergrond via `bg-grain` class
- **Wine type pill** toont label op ALLE schermformaten (was: hidden op mobile)
- **Rounded-2xl** ipv rounded-xl voor meer premium feel
- **Verfijnde font sizes** — 13px mobile titels, 10px buttons

---

## TODO's Volgende Sessie (prioriteit)

### 1. ~~PUSHEN NAAR GITHUB~~ — DONE

### 2. Blog Hydration Bug — GEFIXT
- **Was:** `/blog` crashte met "Target ref is defined but no element was found"
- **Root cause:** Framer Motion `useScroll({ target: ref })` in `FeaturedHero` crashte tijdens hydration (ref nog niet aan DOM element)
- **Fix:** `useScroll` vervangen door handmatige scroll listener met `useMotionValue` + `useEffect` — zelfde parallax effect, geen hydration crash
- **Status:** Build clean, production (`next start`) werkt perfect. Dev mode heeft minor hydration attribute warnings (Framer Motion `initial` styles) — dit is dev-only en heeft geen impact op production/Vercel

### 3. Alle 12 pagina's visueel verifiëren met Playwright
Screenshot ELKE pagina op 390px (mobile) en 1280px (desktop):
- `/` (homepage) — product cards nu nieuw design, moet gecheckt
- `/blog` — CRASHT, zie punt 2
- `/blog/[slug]` — niet gecheckt
- `/wijnen` — GEVERIFIEERD desktop + mobile, ziet er goed uit
- `/wijnen/[handle]` — niet gecheckt
- `/over-ons`, `/contact`, `/cadeaus` — niet gecheckt
- `/klantenservice/*` — niet gecheckt

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
- **Playwright MCP** voor visuele verificatie (Chrome mag niet al open zijn — sluit via: `taskkill /F /IM chrome.exe`)
- **Dev server**: check welke port — kan 3000 of 3001 zijn als 3000 bezet is
- **Lucide React** is geïnstalleerd — gebruik `import { IconName } from 'lucide-react'`
- **`.prose-wine`** class beschikbaar voor article content styling
- **`.bg-grain`** class voor grain texture overlay — gebruik op divs, niet inline style
- **Tailwind v4 LET OP**: Scanner pikt class-achtige patterns op uit ALLE bestanden incl .md — schrijf nooit Tailwind syntax in docs!
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` folder en herstart dev server
- **Node killen**: altijd `taskkill /F /IM node.exe` — NOOIT PowerShell Stop-Process
