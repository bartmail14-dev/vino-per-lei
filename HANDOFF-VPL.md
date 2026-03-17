# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 17 maart 2026
**Laatste sessie:** Blog hydration fix + grain texture CSS variable + build fixes

---

## Project Info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify** | `vino-per-lei-2.myshopify.com` (alleen CMS backend) |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **KvK** | 98874977 — **BTW:** NL005360033B10 |

---

## Huidige Git Staat

**Alles gepusht naar GitHub.** Geen uncommitted changes.

```
539f181 fix: blog hydration crash + grain texture CSS variable
25ec1f3 docs: overdracht update — grain fix, product card redesign, build fix
1f10d3f feat: premium product cards + grain texture centralisatie
79f0d4d feat: complete design overhaul — product cards, blog redesign, UI refinements
```

**Build:** Clean, `npm run build` slaagt (46 pagina's).

---

## Wat is GEDAAN (sessies 17 maart)

### 1. Blog Hydration Crash — GEFIXT
- **Was:** `/blog` crashte met "Target ref is defined but no element was found"
- **Root cause:** Framer Motion `useScroll({ target: ref })` in `FeaturedHero` crashte tijdens hydration — ref was nog niet aan DOM element gehangen
- **Fix:** `useScroll` vervangen door handmatige scroll listener met `useMotionValue` + `useEffect` in `BlogClientComponents.tsx` — zelfde parallax effect, geen hydration crash
- **Bestand:** `src/app/blog/BlogClientComponents.tsx`

### 2. Grain Texture als CSS Variable
- **Was:** `.bg-grain` class was uitgeschakeld (build crashte op lege `url()`)
- **Root cause:** Tailwind v4 scande `url()` uit bronbestanden en genereerde een lege CSS rule → Turbopack crash
- **Fix:** Grain texture SVG verplaatst naar CSS variable `--grain-texture` in `:root` (globals.css). `.bg-grain` class gebruikt nu `var(--grain-texture)` — Tailwind scant geen CSS variables
- **Bestanden:** `src/app/globals.css`

### 3. Build Fixes
- `critters` package geinstalleerd (vereist door `optimizeCss: true` in next.config.ts)
- Tailwind-class-achtige patterns verwijderd uit HANDOFF markdown

### 4. Eerdere sessie (ook 17 maart)
- **ProductCard premium redesign** — grotere images, gold accents, editorial small-caps region, outline buttons
- **Grain texture centralisatie** — van inline `backgroundImage` naar `.bg-grain` CSS class
- **Alle commits gepusht naar GitHub**

---

## TODO's Volgende Sessie (prioriteit)

### 1. Visuele verificatie ALLE pagina's met Playwright
Screenshot elke pagina op 390px (mobile) en 1280px (desktop):

| Pagina | Status |
|--------|--------|
| `/` (homepage) | Niet gecheckt — product cards hebben nieuw design |
| `/blog` | WERKT in production (getest met `next start`) |
| `/blog/[slug]` | Niet gecheckt — heeft ook `useScroll({ target })` in ArticleHero.tsx! |
| `/wijnen` | GEVERIFIEERD — ziet er goed uit |
| `/wijnen/[handle]` | Niet gecheckt |
| `/over-ons` | Niet gecheckt |
| `/contact` | Niet gecheckt |
| `/cadeaus` | Niet gecheckt |
| `/klantenservice/*` | Niet gecheckt |

**LET OP:** `src/app/blog/[slug]/ArticleHero.tsx` en `src/app/blog/BlogAnimations.tsx` gebruiken ook `useScroll({ target: ref })` — dezelfde fix nodig als FeaturedHero als die pagina's ook hydration errors hebben.

### 2. Dev Mode Hydration Warning
- In `next dev` zijn er minor Framer Motion hydration attribute mismatches (Framer Motion zet `style` attributes tijdens hydration die niet op de server stonden)
- In production (`next start` / Vercel) is dit GEEN probleem
- Optioneel: `suppressHydrationWarning` toevoegen op motion components, of Framer Motion `initial={false}` gebruiken

### 3. Blog foto's (extern — Carla)
- Alle 6 artikelen missen featured images → navy gradient fallback
- Carla moet per artikel een foto uploaden in Shopify Admin

### 4. Web3Forms API Key
- web3forms.com → API key maken → email naar Carla
- `.env.local`: `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables

### 5. Shopify / Carla TODO's (extern)
- **Telefoonnummer** — `040-XXX XXXX` placeholder overal
- **Shopify Payments** — iDEAL, creditcard activeren
- **DNS vinoperlei.nl** → Vercel
- **Newsletter backend** → Klaviyo/Mailchimp koppelen

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

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Node killen:** gebruik `powershell.exe -Command "Stop-Process -Id PID -Force"` of `kill PID`. NIET `taskkill /F` in Git Bash (de `/F` flag wordt als pad geinterpreteerd)
- **Dev server starten:** altijd background: `npx next dev --port 3000 > /dev/null 2>&1 &`
- **Build EERST:** draai altijd `npm run build` voordat je `npm run dev` start — als de build faalt, fix eerst de error
- **Shopify tokens** in `.env.local` — NIET committen
- **Playwright MCP** voor visuele verificatie
- **Lucide React** is geinstalleerd — `import { IconName } from 'lucide-react'`
- **`.prose-wine`** class beschikbaar voor article content styling
- **`.bg-grain`** class voor grain texture overlay — gebruikt CSS variable, veilig voor Tailwind v4
- **Tailwind v4 LET OP**: Scanner pikt class-achtige patterns op uit ALLE bestanden incl .md — schrijf nooit Tailwind syntax (zoals `bg-[url(...)]`) in docs!
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` folder en herstart dev server
- **`optimizeCss: true`** in next.config.ts — vereist `critters` package (al geinstalleerd)
- **Framer Motion + React 19:** `useScroll({ target: ref })` crasht tijdens hydration. Gebruik handmatige scroll listeners met `useMotionValue` als alternatief (zie FeaturedHero als voorbeeld)
