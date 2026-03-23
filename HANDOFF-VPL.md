# Vino per Lei — Overdracht volgende sessie

**Datum:** 23 maart 2026 (sessie 4)
**Laatste sessie:** Handleiding pagina gebouwd met Shopify Admin screenshots via Playwright MCP.

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
| **Laatste commit** | `ed536d8` — replace hardcoded €35 with CMS-driven values |
| **Git status** | 3 oude commits + handleiding pagina UNCOMMITTED |
| **Vercel deploy** | `npx vercel --prod --force` (git push alleen triggert NIET altijd) |

---

## Wat er sessie 4 is gedaan

### 1. Handleiding pagina (`/handleiding`) — GEBOUWD, UNCOMMITTED
- **Nieuwe bestanden:**
  - `src/app/handleiding/page.tsx` — Server component met `robots: noindex`
  - `src/app/handleiding/HandleidingContent.tsx` — Client component met alle logica
  - `public/handleiding/` — 13 Shopify Admin screenshots (PNG)
- **Features:**
  - Navy hero met "Beheer je webshop" + directe link naar Shopify Admin
  - Zoekfunctie over alle secties en stappen
  - Snelle links pills voor directe navigatie
  - 8 collapsible secties met Framer Motion animaties
  - Genummerde stappen met screenshots en tip-boxen
  - "Hulp nodig?" footer met email link
- **8 secties:** Producten, Homepage teksten, FAQ, Categorieën, Site instellingen, Blog, Bestellingen, Verzending
- **13 screenshots** via Playwright MCP van Shopify Admin:
  - `producten-overzicht.png`, `product-velden.png`
  - `content-metaobjects.png`, `homepage-hero.png`, `announcement-bar.png`
  - `faq-overzicht.png`, `categorie-blokken.png`, `usp-items.png`
  - `bedrijfsgegevens.png`, `site-instellingen.png`, `site-instellingen-top.png`
  - `orders-overzicht.png`
  - `preview-handleiding.png` (eigen pagina preview, niet nodig in productie)
- **Build:** clean, 0 errors, 0 warnings
- **Getest:** localhost:3099/handleiding werkt correct

---

## TODO's volgende sessie (prioriteit)

### #1 HIGH — Commit + push + deploy
```bash
cd C:\Users\BartVisser\Desktop\vino-per-lei
git add src/app/handleiding/ public/handleiding/ HANDOFF-VPL.md
git commit -m "feat: add Shopify handleiding page with admin screenshots"
git push origin master
npx vercel --prod --force
```
Er staan ook nog 3 oudere commits klaar die gepusht moeten worden.

### #2 HIGH — Handleiding grondig uitbreiden
De huidige handleiding is een goede basis maar kan veel grondiger:

**A. Meer screenshots per sectie:**
- Screenshot van "Add product" lege formulier (nu ontbreekt)
- Screenshot van individuele FAQ entry (bewerken-view)
- Screenshot van individuele Categorie Blok entry
- Screenshot van Blog Post entries overzicht + individuele entry
- Screenshot van Shipping settings pagina
- Screenshot van individueel order detail (zodra er een testorder is)

**B. Interactieve verbeteringen:**
- Lightbox/zoom functie op screenshots (klik om te vergroten)
- "Kopieer link" button per sectie voor delen
- Print-vriendelijke versie (CSS `@media print`)
- Eventueel video walkthroughs (Loom embeds)

**C. Extra secties toevoegen:**
- **Kortingscodes** — Discounts aanmaken en beheren
- **Klanten** — Klantenoverzicht bekijken
- **Collecties** — Productcollecties aanmaken/bewerken
- **Wijnregio's** — Wijnregio metaobjects beheren (9 entries)

### #3 HIGH — Shopify Order Notifications naar Carla
**Doel:** Carla krijgt automatisch een e-mail wanneer er een nieuwe bestelling binnenkomt.

**Aanpak via Shopify Admin (GEEN code nodig):**

1. **Shopify Notification Settings:**
   - Settings → Notifications → Staff order notifications
   - Voeg Carla's e-mailadres toe (VRAAG BART OM HET ADRES)
   - Shopify stuurt dan automatisch bij elke nieuwe order een email

2. **Shopify Flow (gratis app, krachtigere workflows):**
   - Installeer "Shopify Flow" vanuit de App Store (gratis voor alle plannen)
   - Maak een workflow: Trigger "Order created" → Action "Send email"
   - Kan custom templates, meerdere ontvangers, filters (bijv. alleen orders > €X)

3. **Alternatief: Webhook + eigen email API:**
   - Shopify webhook `orders/create` → Next.js API route → Mailgun
   - Meer controle over format/template maar complexer
   - Mailgun is al gepland (TODO #7 vorige sessie)
   - Route: `POST /api/webhooks/shopify/order-created`
   - Verificatie via HMAC-SHA256 met Shopify webhook secret

**Aanbeveling:** Start met optie 1 (simpelste), upgrade later naar optie 2 of 3 als meer controle nodig is.

**E-mailadres:** Nog niet vastgesteld — Bart moet dit vragen aan Carla. Waarschijnlijk `carla@vinoperlei.nl` of een persoonlijk adres.

### #4 HIGH — Key mismatch checken + fixen (OVERGENOMEN UIT SESSIE 3)
De code in `getSiteSettings()` leest `f.free_shipping_threshold` en `f.shipping_cost`, maar Shopify genereert keys uit labels. Check of de keys in `src/lib/shopify-cms.ts` matchen met de werkelijke Shopify field keys (`gratis_verzending_drempel` en `verzendkosten`).

### #5 HIGH — Carla staff account aanmaken
1. Shopify Admin → Settings → Users and permissions → Add staff
2. **VRAAG BART OM CARLA'S EMAIL!**
3. Rechten: Products, Content (pages/blog/metaobjects), Orders (view)
4. Uitnodiging versturen

### #6 HIGH — Shopify API-token roteren
Het huidige Storefront token staat in git history. Nieuw token genereren, oud intrekken, updaten in `.env.local` + Vercel env.

### #7 MEDIUM — RATE_LIMIT_SECRET naar Vercel
```bash
npx vercel env add RATE_LIMIT_SECRET
# Plak: i0B7wWUKqw3L/Dz1yUL37Aq/Xq+UVvWfXq5c0aupjvs=
```

### #8 MEDIUM — Mailgun opzetten
1. Mailgun account aanmaken (gratis tier)
2. Domein `mg.vinoperlei.nl` verifiëren (SPF, DKIM, MX records)
3. Env vars: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_LIST`
4. Kan ook gebruikt worden voor order notification emails (TODO #3 optie 3)

### #9 MEDIUM — DNS vinoperlei.nl → Vercel
1. Domein toevoegen in Vercel dashboard
2. CNAME records instellen
3. HTTPS automatisch via Vercel

---

## Architectuur na sessie 4

```
src/
├── app/
│   ├── handleiding/              ← NIEUW sessie 4
│   │   ├── page.tsx              ← Server component, noindex
│   │   └── HandleidingContent.tsx ← Client component, 8 secties
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
└── handleiding/                  ← NIEUW: 13 Shopify Admin screenshots
```

---

## Claude Code notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099` (oude next processen blokkeren soms)
- **Vercel deploy:** `npx vercel --prod --force`
- **Playwright MCP:** Sluit ALLE Chrome vensters voor gebruik, anders crasht de browser launch
- **Shopify Admin:** `https://vino-per-lei-2.myshopify.com/admin`
- **Shopify login:** Bart logt zelf in via Playwright, dan kan Claude verder navigeren
- **Geen hardcoded bedragen** — alles CMS-driven via ShopConfigProvider
- **Key mismatch risico:** Shopify genereert keys uit Nederlandse labels — check of code keys matchen
- **Handleiding screenshots:** Genomen via Playwright MCP op 23 maart 2026, updaten als Shopify UI verandert
