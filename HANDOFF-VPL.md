# Vino per Lei — Overdracht volgende sessie

**Datum:** 23 maart 2026 (sessie 5)
**Laatste sessie:** Handleiding pagina + live website screenshots met rode annotaties.

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
| **Laatste commit** | `51d9285` — handleiding page with Shopify + live website screenshots |
| **Git status** | Clean, up to date met origin/master |
| **Vercel deploy** | NIET gedaan — moet nog: `npx vercel --prod --force` |

---

## Wat er sessie 4+5 is gedaan

### 1. Handleiding pagina (`/handleiding`) — COMMITTED + PUSHED
- `src/app/handleiding/page.tsx` — Server component, `robots: noindex`
- `src/app/handleiding/HandleidingContent.tsx` — Client component, 8 secties
- `public/handleiding/` — 13 Shopify Admin + 7 live website screenshots

### 2. Live website screenshots met rode annotaties
Per handleiding-stap ziet Carla nu twee screenshots:
1. **Shopify Admin** — waar ze het aanpast
2. **"Op de website"** — hoe het er op de live site uitziet, met rode kaders + labels

| Screenshot | Wat het toont |
|---|---|
| `website-announcement-bar.png` | Hero + announcement bar met ❶❷ labels |
| `website-usp-balk.png` | USP vertrouwenspunten ❸ |
| `website-producten.png` | Productkaarten homepage ❹ |
| `website-product-detail.png` | Productpagina: titel, beschrijving, foto |
| `website-categorieen.png` | Categorie blokken ❺ |
| `website-blog.png` | Blog sectie ❻ |
| `website-bedrijfsgegevens.png` | Footer: contact ❼ + KvK/BTW ❽ |
| `website-faq.png` | FAQ pagina met vragen |

---

## TODO's volgende sessie (prioriteit)

### #1 HIGH — Vercel deployen
```bash
cd C:\Users\BartVisser\Desktop\vino-per-lei
npx vercel --prod --force
```
Daarna check: `https://vino-per-lei.vercel.app/handleiding`

### #2 HIGH — Mobile-friendly check handleiding + hele site
**Doel:** Carla bekijkt de site en handleiding op haar telefoon. Alles moet goed werken.

**Aanpak via Playwright MCP (mobile viewport):**
1. Resize browser naar iPhone viewport (390×844)
2. Loop door alle pagina's: `/`, `/wijnen`, `/wijnen/[handle]`, `/cadeaus`, `/over-ons`, `/blog`, `/klantenservice/faq`, `/contact`, `/handleiding`
3. Check per pagina:
   - Hamburger menu werkt
   - Geen horizontale overflow/scroll
   - Screenshots in handleiding schalen goed mee
   - Tekst is leesbaar (niet te klein)
   - Knoppen zijn tap-friendly (min 44×44px touch target)
   - Collapsible secties in handleiding openen/sluiten correct
4. Fix eventuele issues

**Bekende aandachtspunten handleiding mobile:**
- Screenshots zijn breed (1280px oorsprong) — moeten goed schalen in `max-w-4xl` container
- "Op de website" pill + caption tekst mag niet wrappen op rare plekken
- Zoekbalk en snelle links pills moeten op mobile wrappen
- Tip-boxen (amber) moeten niet te breed worden

### #3 HIGH — Key mismatch checken + fixen
De code in `getSiteSettings()` leest `f.free_shipping_threshold` en `f.shipping_cost`, maar Shopify genereert keys uit labels. Check of de keys in `src/lib/shopify-cms.ts` matchen met de werkelijke Shopify field keys (`gratis_verzending_drempel` en `verzendkosten`).

### #4 HIGH — Shopify Order Notifications naar Carla
**Simpelste aanpak (geen code):**
- Shopify Admin → Settings → Notifications → Staff order notifications
- Voeg Carla's e-mailadres toe (VRAAG BART OM HET ADRES)

### #5 HIGH — Carla staff account aanmaken
1. Shopify Admin → Settings → Users and permissions → Add staff
2. **VRAAG BART OM CARLA'S EMAIL!**
3. Rechten: Products, Content (pages/blog/metaobjects), Orders (view)
4. Uitnodiging versturen

### #6 HIGH — Shopify API-token roteren
Huidig Storefront token staat in git history. Nieuw token genereren, oud intrekken, updaten in `.env.local` + Vercel env.

### #7 MEDIUM — Handleiding uitbreiden
- Lightbox/zoom op screenshots (klik om te vergroten)
- Extra secties: Kortingscodes, Collecties, Wijnregio's
- Meer screenshots per sectie (individuele entries)

### #8 MEDIUM — RATE_LIMIT_SECRET naar Vercel
```bash
npx vercel env add RATE_LIMIT_SECRET
# Plak: i0B7wWUKqw3L/Dz1yUL37Aq/Xq+UVvWfXq5c0aupjvs=
```

### #9 MEDIUM — Mailgun + DNS
1. Mailgun: `mg.vinoperlei.nl` verifiëren
2. DNS: `vinoperlei.nl` → Vercel (CNAME records)

---

## Architectuur

```
src/
├── app/
│   ├── handleiding/
│   │   ├── page.tsx              ← Server component, noindex
│   │   └── HandleidingContent.tsx ← Client, 8 secties, search, website previews
│   └── layout.tsx                ← async, ShopConfigProvider
├── components/providers/
│   └── ShopConfigProvider.tsx    ← React context CMS shipping config
├── lib/
│   └── shopify-cms.ts           ← getShopConfig() + getSiteSettings()
├── stores/
│   ├── cartStore.ts             ← fallback FREE_SHIPPING_THRESHOLD
│   └── checkoutStore.ts         ← calculateShippingCost()
└── middleware.ts                ← Security headers + rate limiting

public/
└── handleiding/                  ← 13 Shopify Admin + 7 website screenshots
```

---

## Claude Code notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** `npx vercel --prod --force`
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik
- **Shopify Admin:** `https://vino-per-lei-2.myshopify.com/admin`
- **Shopify login:** Bart logt zelf in via Playwright, dan kan Claude verder navigeren
- **Geen hardcoded bedragen** — alles CMS-driven via ShopConfigProvider
- **Key mismatch risico:** Shopify genereert keys uit Nederlandse labels — check of code keys matchen
- **Screenshots:** Genomen via Playwright MCP op 23 maart 2026, updaten als Shopify UI of website verandert
- **Website screenshots** bevatten rode annotaties (injected via JS in Playwright, niet in de code zelf)
