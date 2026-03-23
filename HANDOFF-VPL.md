# Vino per Lei — Overdracht volgende sessie

**Datum:** 23 maart 2026
**Laatste sessie:** Showcase massaal uitgebreid, product fallbacks, responsive fixes, Over Ons CMS-driven, alle "19 wijnen" hardcoding verwijderd, Shop per type sectie opgeschoond.

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
| **KvK** | 98874977 — **BTW:** NL005360033B10 |
| **Laatste commit** | `2264f2e` — shop per type icons + cards |
| **Build** | clean, 0 errors, 0 warnings |
| **Vercel deploy** | `npx vercel --prod --force` (git push alleen triggert NIET altijd) |

---

## Wat er deze sessie is gedaan

### 1. Showcase pagina massaal uitgebreid
- **Hero**: Professioneel "Technisch Dossier — Maart 2026", Blue Wire Media branding
- **Stats bar**: 8 metrics (147 commits, 21.720 regels code, 128 bronbestanden, 18 pagina's, 59 componenten, 0 errors, 7 weken, WCAG AA)
- **Timeline**: 8 gedetailleerde rondes met 5-8 tags per ronde
- **Features grid**: Van 6 naar 10 kaarten (beveiliging, SEO, performance, WCAG, Shopify, compliance, responsive, blog, UX, code kwaliteit)
- **NIEUW**: "Elke pagina, met zorg gebouwd" — 18-pagina grid met beschrijvingen
- **NIEUW**: "De technische architectuur" — 4-koloms tech stack diagram (dark section)
- **NIEUW**: "Gebouwd met oog voor detail" — 10 micro-detail kaarten (18+ gate, cookie consent, mega menu, etc.)
- **Next Steps**: Van 7 naar 10 items met uitgebreide beschrijvingen, warmere Carla-stap
- Showcase product count fallback (minimum 19)

### 2. Product fallbacks (homepage niet meer leeg)
- **Featured products**: Als geen `isFeatured` metafield in Shopify → toon eerste 4 producten
- **Category blocks**: Hardcoded defaults (Rode Wijn, Witte Wijn, Rosé, Mousserend, Cadeaus) als CMS leeg
- **Blog sectie**: Werkt nu met 1-2 artikelen (was: minimum 3). Grid past zich aan.

### 3. Responsive fixes
- `overflow-x: hidden` op `<html>` element — fixt 15px horizontal scroll op 375px
- AnimatedCounter SSR-safe: rendert target value bij eerste render, animeert pas bij scroll
- Nav breakpoint was al correct (`lg:` = 1024px)

### 4. Over Ons pagina CMS-first
- **Structuur gewijzigd**: Als Shopify page body gevuld is → toon ALLEEN hero + CMS content + CTA
- Zonder CMS content → toon huidige fallback layout (values, timeline, brand philosophy)
- Alle hardcoded aantallen verwijderd ("drie gebieden", "19 wijnen", "6 regio's")
- Wijncount is dynamisch via `getProducts().length`

### 5. Alle "19 wijnen" hardcoding verwijderd
11 bestanden aangepast — nergens meer een hardcoded wijnaantal:
- `layout.tsx` (metadata), `page.tsx` (JSON-LD, counter, link), `wijnen/page.tsx` (metadata)
- `cadeaus/page.tsx`, `CartSlideOut.tsx`, `shopify-cms.ts` (DEFAULT_HERO)
- `showcase/page.tsx`, `over-ons/OverOnsContent.tsx`, `over-ons/page.tsx`

### 6. Shop per type sectie opgeschoond
- Icons vereenvoudigd: van complexe 64x64 SVGs met opacity fills naar clean 48x48 stroke icons
- Cards: witte achtergrond, sand border, uniforme hoogte via flex, betere gaps
- **MAAR**: Bart wil hier een unieke icon library voor — zie TODO #1

---

## TODO's volgende sessie (prioriteit)

### #1 HIGH — Unieke icon library voor "Shop per type"
**Bart wil GEEN custom SVG icons die we zelf tekenen.** In plaats daarvan moet er een externe, unieke icon library worden gebruikt voor de wijn-categorie icons (Rode Wijn, Witte Wijn, Rosé, Mousserende Wijn, Cadeaus).

**Opties om te onderzoeken:**
1. **Phosphor Icons** (`phosphor-react`) — 6000+ icons, 6 stijlen (thin/light/regular/bold/fill/duotone). Heeft `Wine`, `WineGlass`, `Champagne`, `Gift`, `Sparkle`. Duotone stijl is premium.
2. **Tabler Icons** (`@tabler/icons-react`) — 5000+ icons, consistent stroke style. Heeft `IconGlass`, `IconBottle`, `IconGift`, `IconSparkles`.
3. **Heroicons** (`@heroicons/react`) — Van Tailwind team, 300+ icons, outline/solid/mini stijlen. Beperktere selectie.
4. **Flaticon/Iconify** — Via `@iconify/react` kun je uit 200.000+ icons kiezen van duizenden sets. Zoek op "wine" voor gespecialiseerde wijn-icons.
5. **React Icons** (`react-icons`) — Bundelt 40+ libraries (Font Awesome, Material, Remix, etc.).

**Aanpak volgende sessie:**
- Kies een library met Bart
- Installeer via npm
- Vervang de 5 WineCategoryIcons (RedWine, WhiteWine, Rose, Bubbles, GiftBox)
- Optioneel: vervang ook de TuscanyIcon (cipres) als de library iets beters heeft
- Het bestand `src/components/icons/WineCategoryIcons.tsx` kan dan weg

**Huidige icon mapping in `src/app/page.tsx` (regel 37-43):**
```ts
const categoryIconMap = {
  red:       { Icon: RedWineIcon, ... },
  white:     { Icon: WhiteWineIcon, ... },
  rose:      { Icon: RoseWineIcon, ... },
  sparkling: { Icon: BubblesIcon, ... },
  gift:      { Icon: GiftBoxIcon, ... },
};
```

### #2 HIGH — Shopify data probleem (wijnen verdwenen)
De homepage toonde 0 producten en 0 categorieën. Oorzaak: Shopify metafields/metaobjects niet (meer) geconfigureerd. Fallbacks zijn nu ingebouwd, maar de echte fix is:
- Check of producten `custom.is_featured` metafield hebben (exact `"true"`)
- Check of `category_block` metaobjects bestaan in Shopify Admin
- Check of er ≥3 blogartikelen in blog "wijn-verhalen" staan
- Check server logs voor "Failed to fetch products" errors

### #3 HIGH — Shopify API-token roteren
Token in git history. Nieuw token genereren, `.env.local` + Vercel updaten.

### #4 HIGH — Mailgun opzetten
Credentials zijn placeholders. Account aanmaken, domein verifiëren, env vars invullen.

### #5 HIGH — DNS vinoperlei.nl → Vercel
CNAME record, domein toevoegen, HTTPS.

### #6 MEDIUM — `RATE_LIMIT_SECRET` genereren
`openssl rand -base64 32` → in `.env.local` + Vercel. Zonder dit reset rate limiting bij elke cold start.

### #7 MEDIUM — Ordernotificaties, telefoonnummer, blog foto's
Zie showcase pagina `/showcase` voor de volledige lijst.

### #8 LOW — Next.js 16 middleware → proxy migration
`middleware.ts` geeft deprecation warning. Migreren naar `proxy` convention.

---

## Architectuur na deze sessie

```
src/
├── app/
│   ├── showcase/page.tsx      ← UITGEBREID: 8 secties, ~600 regels
│   ├── over-ons/
│   │   ├── page.tsx           ← Fetcht nu ook getProducts() voor wineCount
│   │   └── OverOnsContent.tsx ← CMS-first: Shopify page body overschrijft fallback
│   ├── page.tsx               ← Product fallbacks, dynamische counter, category defaults
│   └── ...
├── components/
│   ├── icons/
│   │   └── WineCategoryIcons.tsx ← Vereenvoudigd 48x48, WORDT VERVANGEN door externe library
│   ├── home/
│   │   └── HomeAnimations.tsx    ← AnimatedCounter SSR-safe
│   └── ...
├── lib/
│   └── shopify-cms.ts           ← DEFAULT_CATEGORIES fallback, hero tekst zonder "19"
└── ...
```

---

## Claude Code notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3000 > /dev/null 2>&1 &`
- **Vercel deploy:** `npx vercel --prod --force` (git push alleen is niet betrouwbaar)
- **Tailwind v4 cache:** Bij rare CSS errors, verwijder `.next/` en herstart
- **Windows paths** voor Claude tools, **Unix paths** voor Bash
- **Geen hardcoded aantallen** — wijncount, regio's, producenten etc. moeten altijd dynamisch zijn of generiek geschreven
