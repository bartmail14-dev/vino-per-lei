# Vino per Lei — Overdracht volgende sessie

**Datum:** 23 maart 2026 (sessie 2)
**Laatste sessie:** Wine category icons vervangen (custom glasvormen), shipping config CMS-driven gemaakt, RATE_LIMIT_SECRET gegenereerd.

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
| **Laatste commit** | `dccdad2` — wine glass icons + shipping config CMS |
| **Build** | clean, 0 errors, 0 warnings |
| **Vercel deploy** | `npx vercel --prod --force` (git push alleen triggert NIET altijd) |

---

## Wat er deze sessie is gedaan

### 1. Wine category icons — custom glasvormen
De "Shop per type" icons zijn nu **herkenbare wijnglas-silhouetten** per categorie:
- **Rode Wijn** — Bordeaux glas (brede kelk, bold stroke)
- **Witte Wijn** — Tulip glas (smaller, hoger, eleganter)
- **Rosé** — Coupe glas (breed, ondiep — klassiek rosé)
- **Bubbels** — Flute glas (lang, smal + bubbels)
- **Cadeaus** — Geschenkdoos met strik
- **Toscane** — Cipres boom

Alle icons: 24x24 viewBox, strokeWidth 1.5, `currentColor` — consistent met Lucide icons.
Bestand: `src/components/icons/WineCategoryIcons.tsx`

**Geprobeerd en verworpen:**
- Phosphor Icons (`@phosphor-icons/react`) — maar 1 wijnglas icon, te beperkt
- Tabler Icons (`@tabler/icons-react`) — `IconGlassFull` was een tumbler, niet een wijnglas
- Conclusie: geen enkele icon library heeft genoeg wijn-specifieke variatie

### 2. Shipping config CMS-driven
- `SiteSettings` interface uitgebreid met `freeShippingThreshold` en `shippingCost`
- `getSiteSettings()` leest nu `free_shipping_threshold` en `shipping_cost` uit Shopify metaobject
- Nieuwe `getShopConfig()` helper geëxporteerd voor server components
- Fallbacks: €35 / €4.95 als Shopify metaobject niet geconfigureerd
- `DEFAULT_SITE_SETTINGS` bijgewerkt

### 3. RATE_LIMIT_SECRET
- Gegenereerd (`openssl rand -base64 32`) en toegevoegd aan `.env.local`
- **Moet nog naar Vercel**: `npx vercel env add RATE_LIMIT_SECRET`

---

## TODO's volgende sessie (prioriteit)

### #1 HIGH — Shopify Admin opzetten via Playwright MCP
**Open `https://vino-per-lei-2.myshopify.com/admin` met Playwright** en doe het volgende:

#### A. Carla een staff account geven
1. Settings → Users and permissions → Add staff
2. Email: Carla's email (vraag aan Bart)
3. Rechten: Products, Content (pages/blog/metaobjects), Orders (view)
4. Uitnodiging versturen

#### B. Metaobject `site_settings` velden toevoegen
De volgende velden moeten worden toegevoegd aan het bestaande `site_settings` metaobject:
- `free_shipping_threshold` (type: `number_decimal`, default: 35)
- `shipping_cost` (type: `number_decimal`, default: 4.95)

Dan in het `main` entry deze waarden invullen.

#### C. Check of deze metaobjects bestaan en correct zijn:
- `site_settings/main` — bedrijfsgegevens
- `homepage_hero/main` — hero tekst
- `announcement_bar/main` — top bar
- `usp_item/*` — 4 USP items
- `category_block/*` — 5 wijn-categorieën
- `faq_item/*` — FAQ items

Als ze niet bestaan: het script `npm run shopify:setup` zou ze moeten aanmaken, maar check eerst of het up-to-date is met de nieuwe velden.

### #2 HIGH — Hardcoded €35 doorlinken naar CMS
Nu de `getShopConfig()` helper bestaat, moeten deze bestanden geüpdatet worden om de CMS-waarde te gebruiken in plaats van hardcoded "€35":

| Bestand | Wat aanpassen |
|---------|---------------|
| `src/components/cart/CartSlideOut.tsx` | Free shipping progress bar |
| `src/components/checkout/OrderSummary.tsx` | Shipping progress |
| `src/components/checkout/ShippingSection.tsx` | Free shipping banner |
| `src/components/checkout/TrustSignals.tsx` | "Gratis verzending vanaf €35" |
| `src/components/product/QuickViewModal.tsx` | "Gratis vanaf €35" |
| `src/app/wijnen/[handle]/ProductDetailClient.tsx` | "Gratis vanaf €35" (2x) |
| `src/app/contact/ContactPageContent.tsx` | Trust signal tekst |
| `src/app/cadeaus/CadeausContent.tsx` | "Vanaf €35 bezorgen wij gratis" |
| `src/app/klantenservice/verzending/VerzendingContent.tsx` | Tarieftabel |
| `src/types/cart.ts` | `FREE_SHIPPING_THRESHOLD` + `SHIPPING_COST` |

**Aanpak:** Client components (cart, checkout) kunnen de waarde niet direct server-side fetchen. Opties:
1. Via `layout.tsx` als React context/provider doorsturen
2. Via een klein API route `/api/config` dat `getShopConfig()` cached
3. De cart store initialiseren met de waarden uit een `<script>` tag in layout

### #3 HIGH — Shopify API-token roteren
Het huidige Storefront token staat in git history. In Shopify Admin:
1. Settings → Apps and sales channels → "Headless" (of custom app)
2. Nieuw Storefront token genereren
3. Oud token intrekken
4. Nieuw token in `.env.local` + Vercel env vars

### #4 HIGH — Mailgun opzetten
Contact form en newsletter zijn placeholders. Nodig:
1. Mailgun account aanmaken (gratis tier)
2. Domein `mg.vinoperlei.nl` verifiëren (SPF, DKIM, MX records)
3. Env vars invullen: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_LIST`

### #5 HIGH — DNS vinoperlei.nl → Vercel
1. Domein toevoegen in Vercel dashboard
2. CNAME record `vinoperlei.nl` → `cname.vercel-dns.com`
3. `www` CNAME → zelfde
4. HTTPS wordt automatisch ingeregeld door Vercel

### #6 MEDIUM — RATE_LIMIT_SECRET naar Vercel
```bash
npx vercel env add RATE_LIMIT_SECRET
# Plak: i0B7wWUKqw3L/Dz1yUL37Aq/Xq+UVvWfXq5c0aupjvs=
```

### #7 MEDIUM — Ordernotificaties, telefoonnummer, blog foto's
Shopify Admin taken — zie `/showcase` pagina voor de volledige lijst.

### #8 LOW — Vercel deploy na alle wijzigingen
```bash
git push origin master
npx vercel --prod --force
```

---

## Architectuur na deze sessie

```
src/
├── components/icons/
│   └── WineCategoryIcons.tsx  ← NIEUW: custom glasvormen (Bordeaux/Tulip/Coupe/Flute)
├── lib/
│   └── shopify-cms.ts         ← GEWIJZIGD: SiteSettings + getShopConfig() met shipping velden
├── types/
│   └── cart.ts                ← FREE_SHIPPING_THRESHOLD = 35 (fallback, wordt CMS-driven)
└── ...
```

---

## Claude Code notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3000 > /dev/null 2>&1 &`
- **Vercel deploy:** `npx vercel --prod --force`
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik, anders crasht de browser launch
- **Shopify Admin:** `https://vino-per-lei-2.myshopify.com/admin` — gebruik Playwright om daar in te loggen en metaobjects te beheren
- **Geen hardcoded aantallen** — wijncount, verzenddrempels, etc. moeten CMS-driven zijn
- **Geen externe icon libraries nodig** — custom SVGs in Lucide-stijl werken het best voor wijn-specifieke icons
