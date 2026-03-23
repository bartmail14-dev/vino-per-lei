# Vino per Lei — Overdracht volgende sessie

**Datum:** 23 maart 2026 (sessie 6)
**Laatste sessie:** Deploy, mobile fixes, CMS key fix, showcase update, handleiding projectoverzicht.

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
| **Laatste commit** | `0b220fc` — fix \u2014 literal in JSX |
| **Git status** | Clean, up to date met origin/master |

---

## Wat er sessie 6 is gedaan

### 1. Vercel productie-deploy — DONE
- Site live op https://vino-per-lei.vercel.app
- RATE_LIMIT_SECRET toegevoegd aan Vercel env vars
- 23 routes, 0 build errors

### 2. Mobile-friendly check (8 pagina's) — DONE
- Alle pagina's getest op iPhone 390×844 viewport via Playwright MCP
- **Fix 1:** Homepage wine regions sectie had horizontale overflow door `x: -30` animatie → `overflow-hidden` op Section
- **Fix 2:** PriceDisplay kortingsbadge overflow op smalle productkaarten → `flex-wrap` + `whitespace-nowrap`
- Bestanden: `src/app/page.tsx`, `src/components/ui/PriceDisplay.tsx`

### 3. Shopify CMS key mismatch — DONE
- `f.free_shipping_threshold` → `f.gratis_verzending_drempel`
- `f.shipping_cost` → `f.verzendkosten`
- Setup script ook bijgewerkt met juiste field definitions + seed values
- Bestanden: `src/lib/shopify-cms.ts`, `scripts/setup-shopify-cms.ts`

### 4. Handleiding projectoverzicht — DONE
- Sectie toegevoegd onderaan `/handleiding` met 3 blokken:
  - Afgerond (15 punten, groene checks)
  - Nog te doen (4 punten, oranje klokken)
  - Nodig van jou (3 items: email, notifications, domein)
- Bestand: `src/app/handleiding/HandleidingContent.tsx`

### 5. Showcase pagina update — DONE
- Timeline stap 9 toegevoegd (handleiding, mobile, deploy)
- **DATA GECORRIGEERD**: Timeline start nu op 3 maart (was fout februari)
- **AI-REFERENTIES VERWIJDERD**: Alle mentions van agents, AI, Playwright, fix-agents
- 5 items gemarkeerd als "Afgerond" (groen), 3 als "Wacht op info" (oranje)
- Stats: 3 weken, 150+ commits, 19 pagina's
- Em-dash bug gefixt (`\u2014` literal in JSX → `&mdash;`)
- Bestand: `src/app/showcase/page.tsx`

---

## TODO's volgende sessie (prioriteit)

### #1 HIGH — Carla's Shopify staff account aanmaken
**Status:** Halverwege — Settings → Users pagina is al open in Playwright.
**Email:** `vinoperlei@outlook.com`
**Aanpak:**
1. Open Shopify Admin → Settings → Users → "Add users"
2. Vul `vinoperlei@outlook.com` in
3. Rechten: Products, Content (pages/blog/metaobjects), Orders (view)
4. Verstuur uitnodiging

### #2 HIGH — Shopify Order Notifications naar Carla
- Shopify Admin → Settings → Notifications → Staff order notifications
- Voeg `vinoperlei@outlook.com` toe
- Zo krijgt Carla een mail bij elke nieuwe bestelling

### #3 HIGH — Shopify API-token roteren
- Huidig Storefront token staat in git history
- Nieuw token genereren in Shopify Admin → Settings → Apps → Headless
- Update in `.env.local` + Vercel env vars
- Oud token intrekken
- Test dat producten, checkout en CMS nog werken

### #4 MEDIUM — Mailgun + DNS
1. Mailgun: `mg.vinoperlei.nl` verifiëren (SPF, DKIM, MX records)
2. DNS: `vinoperlei.nl` → Vercel (CNAME records)
3. Vraag Bart of domein al geregistreerd is + DNS-toegang

### #5 MEDIUM — Handleiding uitbreiden
- Lightbox/zoom op screenshots (klik om te vergroten)
- Extra secties: Kortingscodes, Collecties

### #6 LOW — Shopify CMS hero tekst
- Check of homepage_hero metaobject nog "Wie is Carla?" bevat
- Wijzig naar "Over Vino per Lei"

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy. Alternatief: `npx vercel --prod --force`
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content (showcase, handleiding, emails)
- **Timeline start 3 maart** — niet februari. Git commits in feb waren prototype/demo.
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik
- **Shopify login:** Bart logt zelf in via Playwright, dan kan Claude verder navigeren

---

## URLs voor Carla

- **Website:** https://vino-per-lei.vercel.app
- **Handleiding:** https://vino-per-lei.vercel.app/handleiding
- **Showcase (technisch dossier):** https://vino-per-lei.vercel.app/showcase
