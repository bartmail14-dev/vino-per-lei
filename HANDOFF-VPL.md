# Vino per Lei — Overdracht & Instructies Volgende Sessie

**Datum:** 13 maart 2026
**Laatste sessie:** Handle mismatch fix, blog artikelen + footer-shop menu aangemaakt

---

## Project Info

- **Locatie:** `C:\Users\BartVisser\Desktop\vino-per-lei`
- **GitHub:** `bartmail14-dev/vino-per-lei` (PRIVATE repo, master branch)
- **Tech:** Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion + Shopify Storefront API
- **Vercel:** vino-per-lei.vercel.app
- **Shopify:** `vino-per-lei-2.myshopify.com`
- **Klant:** Carla Daniels, Vino per Lei (eenmanszaak), Pastorielaan 56, 5504 CR Veldhoven
- **KvK:** 98874977 | **BTW:** NL005360033B10

---

## Status

Laatste commit: zie `git log --oneline -1` na commit hieronder.

### Handle mismatch GEFIXT
De 5 `getPage()` calls in de code zijn aangepast naar de Shopify handles:

| Bestand | Was | Nu |
|---------|-----|-----|
| `src/app/privacy/page.tsx` | `getPage('privacy')` | `getPage('privacybeleid')` |
| `src/app/voorwaarden/page.tsx` | `getPage('voorwaarden')` | `getPage('algemene-voorwaarden')` |
| `src/app/cookies/page.tsx` | `getPage('cookies')` | `getPage('cookiebeleid')` |
| `src/app/klantenservice/verzending/page.tsx` | `getPage('verzending')` | `getPage('verzending-levering')` |
| `src/app/klantenservice/retourneren/page.tsx` | `getPage('retourneren')` | `getPage('retourbeleid')` |

### Shopify Pages (6/6 KLAAR)

| # | Pagina | Handle | Status |
|---|--------|--------|--------|
| 1 | Privacybeleid | `privacybeleid` | Visible |
| 2 | Algemene Voorwaarden | `algemene-voorwaarden` | Visible |
| 3 | Cookiebeleid | `cookiebeleid` | Visible |
| 4 | Verzending & Levering | `verzending-levering` | Visible |
| 5 | Retourbeleid | `retourbeleid` | Visible |
| 6 | Over Ons | `over-ons` | Visible |

### Blog "Wijn Verhalen" — Artikelen (6/6 KLAAR)

| # | Artikel | Handle | Tags | Status |
|---|---------|--------|------|--------|
| 1 | Barolo: De Koning der Italiaanse Wijnen | `barolo-de-koning-der-italiaanse-wijnen` | wijnkennis, piemonte | Visible |
| 2 | Toscana: De Ultieme Wijngids | `toscana-de-ultieme-wijngids` | regiogids, toscana | Visible |
| 3 | Het Geheim van Amarone | `het-geheim-van-amarone` | wijnkennis, veneto | Visible |
| 4 | Prosecco vs. Champagne: De Verschillen | `prosecco-vs-champagne-de-verschillen` | wist-je-dat | Visible |
| 5 | Piemonte: Meer dan Alleen Barolo | `piemonte-meer-dan-alleen-barolo` | regiogids, piemonte | Visible |
| 6 | Wijn & Spijs: De Perfecte Italiaanse Match | `wijn-spijs-de-perfecte-italiaanse-match` | tips-en-tricks | Visible |

**Let op:** Tags zijn via combobox ingevuld maar mogelijk niet opgeslagen door Shopify UI. Controleer in Admin of tags zichtbaar zijn.

### Navigatie Menu's (1/3 KLAAR)

| Menu | Handle | Items | Status |
|------|--------|-------|--------|
| footer-shop | `footer-shop` | Alle Wijnen, Rode Wijn, Witte Wijn, Rosé, Cadeaus | KLAAR |
| footer-service | — | — | **NOG AANMAKEN** |
| footer-about | — | — | **NOG AANMAKEN** |

---

## TODO's volgende sessie (prioriteit)

### 1. Navigatie menu's aanmaken (2 stuks)
In Shopify Admin → Content → Menus → Create menu.
Links moeten als volledige URL (`https://vino-per-lei.vercel.app/...`) worden ingevoerd.

**footer-service:**
- Verzending → `https://vino-per-lei.vercel.app/klantenservice/verzending`
- Retourneren → `https://vino-per-lei.vercel.app/klantenservice/retourneren`
- FAQ → `https://vino-per-lei.vercel.app/klantenservice/faq`
- Contact → `https://vino-per-lei.vercel.app/contact`

**footer-about:**
- Ons Verhaal → `https://vino-per-lei.vercel.app/over-ons`
- Blog → `https://vino-per-lei.vercel.app/blog`

### 2. Blog tags controleren
Check in Shopify Admin of tags daadwerkelijk zijn opgeslagen bij de 5 nieuwe artikelen. Zo niet, handmatig toevoegen.

### 3. Overige TODO's
- **Telefoonnummer Carla** updaten in Shopify Admin → Content → Metaobjects → Site Instellingen
- **Shopify Payments activeren** — iDEAL, creditcard etc.
- **E2E checkout test** op Vercel
- **DNS vinoperlei.nl** koppelen aan Vercel
- **Contact form backend** koppelen (Web3Forms of Shopify)
- **Newsletter** koppelen aan Klaviyo/Mailchimp
- **Blog detail pagina's** bouwen (`/blog/[slug]`)
- **Admin API token upgraden** met `write_content` scope (dan kan het setup script alles automatisch)

---

## Belangrijke bestanden

| Bestand | Wat het is |
|---------|-----------|
| `src/lib/shopify-cms.ts` | **KERN** — Alle CMS queries + types + defaults |
| `src/lib/shopify.ts` | Product queries + checkout |
| `scripts/setup-shopify-cms.ts` | Setup script + ALLE content voor artikelen/pages |
| `src/components/layout/FooterWrapper.tsx` | Server wrapper die Footer voedt |
| `src/components/layout/HeaderWrapper.tsx` | Server wrapper die Header voedt |
| `.env.local` | Shopify tokens (NIET committen) |

---

## Architectuur: CMS Data Flow

```
Shopify Admin (Carla beheert)
    ↓ (metaobjects, pages, blog, menus)
Storefront API (read-only, public token)
    ↓ (GraphQL queries in shopify-cms.ts)
Server Components (FooterWrapper, HeaderWrapper, page.tsx)
    ↓ (props)
Client Components (Footer, Header)
    ↓ (ISR revalidate=60)
Vercel CDN → Gebruiker
```

Fallback keten: CMS data → DEFAULT_* constants → hardcoded in JSX

---

## Lees dit EERST volgende sessie
```
Lees HANDOFF-VPL.md in C:\Users\BartVisser\Desktop\vino-per-lei
TODO: 2 menu's aanmaken (footer-service, footer-about) via Playwright MCP
TODO: Blog tags controleren
Links invoeren als volledige URL (https://vino-per-lei.vercel.app/...)
```
