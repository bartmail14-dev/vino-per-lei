# Vino per Lei — Overdracht volgende sessie

**Datum:** 25 maart 2026 (sessie 7)
**Laatste sessie:** Shopify API fixes, premium filter/toolbar/menu redesign, visual QA via Playwright.

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
| **Carla's email** | `vinoperlei@outlook.com` (tijdelijk) |
| **KvK** | 98874977 — **BTW:** NL005360033B10 |
| **Laatste commit** | `e8eea04` — fix hamburger button |
| **Git status** | Clean, up to date met origin/master |

---

## Wat er sessie 7 is gedaan

### 1. Shopify API fixes — 3 kritieke bugs opgelost
- **Producten waren onzichtbaar**: `totalInventory` veld verwijderd uit GraphQL query (vereiste onbeschikbare scope, brak hele query stil)
- **Blog artikelen ontbraken**: API versie `2026-01` → `2025-01` (ongeldig), `authorV2.bio` verwijderd (niet op Storefront API)
- **Hero overlap gebroken**: USP bar margin `-mt-8` → `-mt-16`, hero gradient `h-16/80%` → `h-10/40%`
- Bestanden: `shopify.ts`, `shopify-cms.ts`, `page.tsx`, `HomeAnimations.tsx`

### 2. Premium filter/toolbar redesign
- **FilterSidebar desktop**: Cream card, serif headers, gouden chevrons, champagne map card, gold left-border actieve groepen
- **FilterSidebar mobile**: Wine-gradient header, grain texture, verfijnde actieknoppen
- **Checkbox**: Wine-gradient fill, gouden vinkje, champagne count-pills
- **Select**: Compact h-10, gouden chevron/focus ring, inner shadow
- **Toolbar**: Gouden zoekicoon, rounded-xl search, wine-gradient view toggle, serif resultaat-teller
- **ActiveFilterTags**: Champagne/goud tags, serif italic label
- **Empty state**: Champagne card met goud border
- Bestanden: `FilterSidebar.tsx`, `Checkbox.tsx`, `Select.tsx`, `WijnenClient.tsx`

### 3. Premium mobile menu redesign
- Wine-gradient header met logo + "ITALIAANSE WIJNEN" tagline
- Cream achtergrond, spring animatie, staggered entry items
- Gouden accent submenu met gold left-border
- Premium inlog-knop met avatar cirkel
- Klikbare contact links (tel/email) met champagne icoon-containers
- Clean hamburger button (geen achtergrond-vlak)
- Bestanden: `Header.tsx`

### 4. Overige verbeteringen
- Homepage revalidation 300s → 60s (aligned met blog)
- Fallback blog dates bijgewerkt naar 2026
- Betere error logging in shopify.ts en shopify-cms.ts
- Handleiding: Shopify Partners toegang-sectie toegevoegd

---

## Commits deze sessie (4 stuks)

```
e8eea04 fix: clean hamburger button — remove background box, opacity hover only
6933897 feat: premium mobile menu redesign
9465fb1 feat: premium redesign filters, toolbar, select and checkboxes
ed10f1e fix: restore products, blog articles and hero overlap
```

---

## TODO's volgende sessie (prioriteit)

### #1 HIGH — Shopify API-token roteren
- Huidig Storefront token staat in git history
- Nieuw token genereren in Shopify Admin → Settings → Apps → Headless
- Update in `.env.local` + Vercel env vars
- Oud token intrekken
- Test dat producten, checkout en CMS nog werken

### #2 HIGH — Carla's Shopify staff account
- Email: `vinoperlei@outlook.com`
- Shopify Admin → Settings → Users → Add users
- Rechten: Products, Content, Orders (view)

### #3 HIGH — Shopify Order Notifications
- Settings → Notifications → Staff order notifications
- Voeg `vinoperlei@outlook.com` toe

### #4 MEDIUM — Mailgun + DNS
1. Mailgun: `mg.vinoperlei.nl` verifiëren (SPF, DKIM, MX)
2. DNS: `vinoperlei.nl` → Vercel (CNAME)
3. Vraag Bart of domein al geregistreerd is

### #5 MEDIUM — Web3Forms contact form
- Contact form stuurt nog niks
- Web3Forms API key koppelen

### #6 LOW — Visuele polish
- Wijnen submenu in mobile menu: test dat accordion + gouden border goed werken
- Tablet breakpoint (768px) check op /wijnen filters
- Homepage hero "Ons Verhaal" button styling kan nog wat strakker

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy. Alternatief: `npx vercel --prod --force`
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Shopify API versie:** `2025-01` (NIET 2026-01, die bestaat niet)
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik
- **Lettertype mobile menu:** Inter (modern, leesbaar) — Bart wil dit behouden

---

## Design systeem quick reference

| Element | Waarde |
|---------|--------|
| Primary | wine-burgundy `#1a1f3d` |
| Accent | gold `#c9a227` |
| Background | cream `#faf9f7` |
| Border | sand `#e8e0d5` |
| Serif | Playfair Display |
| Sans | Inter |
| Gradient | `wine-gradient` (135deg navy) |
| Radius | rounded-lg to rounded-2xl |

---

## URLs voor Carla

- **Website:** https://vino-per-lei.vercel.app
- **Handleiding:** https://vino-per-lei.vercel.app/handleiding
- **Showcase:** https://vino-per-lei.vercel.app/showcase
