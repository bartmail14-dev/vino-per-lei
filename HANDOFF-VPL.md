# Vino per Lei — Overdracht volgende sessie

**Datum:** 22 maart 2026
**Laatste sessie:** Showcase pagina gebouwd, icon cleanup, cadeaus page upgrade, CTA tekst gewijzigd. Alles gecommit, gepusht en live op Vercel.

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
| **Laatste commit** | `11c98ab` — CTA 'Over Vino per Lei' |
| **Build** | clean, 0 errors, 0 warnings |
| **Vercel deploy** | `npx vercel --prod --force` (git push alleen triggert NIET altijd) |

---

## Wat er deze sessie is gedaan

### 1. Showcase pagina (nieuw)
- `public/showcase.html` (static, 404 op Vercel) → `src/app/showcase/page.tsx` (Next.js route)
- Haalt live productdata op uit Shopify (`getProducts()`, featured wines)
- Filter demo links (Piemonte, Veneto, Toscana, Rood, Wit)
- Hergebruikt `ProductCard`, `Section`, `AnimatedSection` componenten
- `noindex` — alleen voor klant Carla, niet vindbaar in Google
- **URL:** `vino-per-lei.vercel.app/showcase`

### 2. Showcase next steps gesplitst
- **"Dit regelen wij"** (7 items met statusbadges: Gepland / Wacht op info)
  - Token roteren, Mailgun, DNS, telefoonnummer, blog foto's, responsive check, ordernotificaties
- **"Jouw enige stap"** — Betalingen activeren (iDEAL/creditcard/Bancontact)
  - Goud-omrand, opvallend, met uitleg waarom alleen Carla dit kan

### 3. Icon cleanup
- 12 inline SVG duplicaten verwijderd uit page.tsx, showcase/page.tsx, CadeausContent.tsx
- Alles gecentraliseerd in `src/components/icons.tsx` + `src/components/icons/WineCategoryIcons.tsx`
- `src/app/cadeaus/GiftBoxIcon.tsx` verwijderd (was dubbel)
- Hardcoded `#1a1f3d` kleuren → `currentColor`
- Lucide re-exports toegevoegd: `BoltIcon` (Zap), `NewspaperIcon` (Newspaper)

### 4. Premium category icons
- Nieuw bestand: `src/components/icons/WineCategoryIcons.tsx`
- `viewBox="0 0 64 64"` voor meer detail (was 48x48)
- RedWineIcon (Bordeaux glas, #722F37 vulling), WhiteWineIcon (gouden vulling), RoseWineIcon (tulpvorm, coral), BubblesIcon (fluit met bubbels), GiftBoxIcon (lint+strik+textuur), TuscanyIcon (cipres)

### 5. Cadeaus landing page upgrade
- Hero: Grotere typografie, goud sparkle particles, decoratieve wijnfles SVG
- Gift cards: Gradient header, "Populair" badge op Duo Pakket, "Stel samen" CTA-buttons (linken naar /contact?onderwerp=...)
- "Zo Werkt Het": Horizontale timeline met Lucide icons (Wine, PenLine, Truck)
- Nieuw: "Waarom Vino per Lei" trust signals (4 items)
- Contact CTA: Zwevende animatie + "Reactietijd: binnen 24 uur"

### 6. CTA tekst gewijzigd
- Hero fallback: "Wie is Carla?" → "Over Vino per Lei"
- **LET OP:** Als Shopify CMS `homepage_hero` metaobject `cta_secondary_text` gevuld heeft, overschrijft dat de fallback. Check in Shopify Admin of daar ook "Wie is Carla?" staat en pas het aan naar "Over Vino per Lei".

---

## KRITIEK — Volgende sessie EERST checken

### 1. Wijnen verdwenen van homepage?
Bart meldde dat de wijnen "ineens helemaal weg" zijn. Mogelijke oorzaken:
- **Scroll-animaties**: Secties onder de fold zijn scroll-triggered (AnimateOnScroll/InView). In Playwright screenshots renderen ze als leeg/zwart. In de browser zelf zouden ze moeten infaden. **Check eerst visueel in de browser.**
- **WineCategoryIcons viewBox change**: Van `0 0 48 48` naar `0 0 64 64`. De icons worden met `w-12 h-12` / `w-16 h-16` classes gerenderd — zou moeten werken, maar visueel verifiëren.
- **ProductCard rendering**: De `featuredProducts` array wordt gevuld via `allProducts.filter(p => p.isFeatured).slice(0, 4)`. Als Shopify geen `is_featured` metafield heeft op producten, is de array leeg.

**Actie:** Open `vino-per-lei.vercel.app` in de browser, scroll door de hele homepage, en verifieer:
1. "Onze Favorieten" sectie toont 4 productkaarten
2. "Shop per type" sectie toont 5 categorie-knoppen met nieuwe icons
3. Wijnregio's kaart + regio-knoppen werken

Als wijnen echt weg zijn, check:
```bash
# Test Shopify API lokaal
cd /c/Users/BartVisser/Desktop/vino-per-lei
node -e "require('./src/lib/shopify').getProducts().then(p => console.log(p.length, 'products,', p.filter(x=>x.isFeatured).length, 'featured'))"
```

### 2. Shopify CMS hero text
Check of `cta_secondary_text` in Shopify Admin → Content → `homepage_hero` metaobject nog "Wie is Carla?" bevat. Zo ja, wijzig naar "Over Vino per Lei".

---

## TODO's volgende sessie (prioriteit)

### HIGH — Visuele verificatie
- [ ] Homepage volledig doorlopen in browser (wijnen, icons, categorie-knoppen)
- [ ] Cadeaus pagina visueel checken (hero, gift cards, trust signals)
- [ ] Showcase pagina checken (`/showcase`)
- [ ] Mobiele responsive check (375px, 768px) met Playwright screenshots

### HIGH — Shopify CMS hero text
- [ ] Shopify Admin: `homepage_hero` metaobject → `cta_secondary_text` → "Over Vino per Lei"

### HIGH — Shopify API-token roteren
- [ ] Shopify Admin → Settings → Apps → custom app → nieuw token genereren
- [ ] `.env.local` updaten: `SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_NIEUW`
- [ ] Vercel env vars updaten
- [ ] Testen of Storefront API nog werkt

### HIGH — Mailgun opzetten
- [ ] Mailgun account aanmaken (EU endpoint: api.eu.mailgun.net)
- [ ] Domein mg.vinoperlei.nl verifiëren (SPF, DKIM, MX records)
- [ ] `.env.local` + Vercel env vars: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_LIST`
- [ ] Contactformulier + nieuwsbrief end-to-end testen

### HIGH — DNS vinoperlei.nl → Vercel
- [ ] CNAME record naar `cname.vercel-dns.com` bij domeinprovider
- [ ] Domein toevoegen in Vercel dashboard
- [ ] HTTPS automatisch via Let's Encrypt

### MEDIUM — Ordernotificaties
- [ ] Shopify Notifications instellen (push + e-mail bij nieuwe bestelling)
- [ ] Escalerende herinneringen na 1, 4, 8 uur

### MEDIUM — Content
- [ ] Telefoonnummer Carla invoeren in Shopify CMS
- [ ] Blog hero-afbeeldingen uploaden (16:9, min 1200px)
- [ ] Betalingen activeren — **Carla moet dit zelf doen** (Shopify Admin → Settings → Payments)

---

## Architectuur na deze sessie

```
src/
├── app/
│   ├── showcase/page.tsx      ← NIEUW: Next.js showcase met live Shopify data
│   ├── cadeaus/
│   │   ├── page.tsx           ← Product fetch + heading update
│   │   └── CadeausContent.tsx ← UPGRADED: hero, cards, trust signals, CTA
│   │   (GiftBoxIcon.tsx VERWIJDERD — verplaatst naar icons)
│   └── page.tsx               ← Icons nu via import uit @/components/icons
├── components/
│   ├── icons.tsx              ← Gecentraliseerd: 60+ Lucide + 7 custom wine icons
│   └── icons/
│       └── WineCategoryIcons.tsx ← NIEUW: Premium 64x64 wine category icons
└── lib/
    └── shopify-cms.ts         ← Fallback CTA: "Over Vino per Lei"
```

Verwijderde bestanden:
- `public/showcase.html` (vervangen door Next.js route)
- `public/showcase-before.png`, `public/showcase-hero-old.png`
- `src/app/cadeaus/GiftBoxIcon.tsx` (verplaatst naar icons.tsx)

---

## Claude Code notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3000 > /dev/null 2>&1 &`
- **Vercel deploy:** `npx vercel --prod --force` (git push alleen is niet betrouwbaar)
- **Chrome Playwright:** Chrome moet eerst gesloten worden + SingletonLock verwijderen
- **Tailwind v4 cache:** Bij rare CSS errors, verwijder `.next/` en herstart
- **Windows paths** voor Claude tools, **Unix paths** voor Bash
