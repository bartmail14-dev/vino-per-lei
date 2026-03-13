# Vino per Lei — Overdracht & Instructies Volgende Sessie

**Datum:** 13 maart 2026
**Laatste sessie:** Menu's aangemaakt, blog tags gefixt, handle mismatch gefixt

---

## Project Info

- **Locatie:** `C:\Users\BartVisser\Desktop\vino-per-lei`
- **GitHub:** `bartmail14-dev/vino-per-lei` (PRIVATE repo, master branch)
- **Tech:** Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion + Shopify Storefront API
- **Vercel:** vino-per-lei.vercel.app
- **Shopify:** `vino-per-lei-2.myshopify.com` (alleen CMS backend, NIET de frontend)
- **Klant:** Carla Daniels, Vino per Lei (eenmanszaak), Pastorielaan 56, 5504 CR Veldhoven
- **KvK:** 98874977 | **BTW:** NL005360033B10

---

## Status — ALLES KLAAR in Shopify Admin

### Handle mismatch GEFIXT (commit `29a6694`)
De 5 `getPage()` calls in de code zijn aangepast naar de Shopify handles.

### Shopify Pages (6/6 KLAAR)

| # | Pagina | Handle | Status |
|---|--------|--------|--------|
| 1 | Privacybeleid | `privacybeleid` | Visible |
| 2 | Algemene Voorwaarden | `algemene-voorwaarden` | Visible |
| 3 | Cookiebeleid | `cookiebeleid` | Visible |
| 4 | Verzending & Levering | `verzending-levering` | Visible |
| 5 | Retourbeleid | `retourbeleid` | Visible |
| 6 | Over Ons | `over-ons` | Visible |

### Blog "Wijn Verhalen" — Artikelen (6/6 KLAAR + TAGS GEFIXT)

| # | Artikel | Handle | Tags | Status |
|---|---------|--------|------|--------|
| 1 | Barolo: De Koning der Italiaanse Wijnen | `barolo-de-koning-der-italiaanse-wijnen` | wijnkennis, piemonte | Visible |
| 2 | Toscana: De Ultieme Wijngids | `toscana-de-ultieme-wijngids` | regiogids, toscana | Visible |
| 3 | Het Geheim van Amarone | `het-geheim-van-amarone` | wijnkennis, veneto | Visible |
| 4 | Prosecco vs. Champagne: De Verschillen | `prosecco-vs-champagne-de-verschillen` | wist-je-dat | Visible |
| 5 | Piemonte: Meer dan Alleen Barolo | `piemonte-meer-dan-alleen-barolo` | regiogids, piemonte | Visible |
| 6 | Wijn & Spijs: De Perfecte Italiaanse Match | `wijn-spijs-de-perfecte-italiaanse-match` | tips-en-tricks | Visible |

### Navigatie Menu's (3/3 KLAAR)

| Menu | Handle | Items | Status |
|------|--------|-------|--------|
| footer-shop | `footer-shop` | Alle Wijnen, Rode Wijn, Witte Wijn, Rosé, Cadeaus | KLAAR |
| footer-service | `footer-service` | Verzending, Retourneren, FAQ, Contact | KLAAR |
| footer-about | `footer-about` | Ons Verhaal, Blog | KLAAR |

---

## TODO's volgende sessie (prioriteit)

### 1. Blog detail pagina's bouwen (`/blog/[slug]`)
- Route: `src/app/blog/[slug]/page.tsx`
- Gebruik `getArticle(slug)` uit `shopify-cms.ts` (functie bestaat al)
- Blog listing pagina (`/blog`) met `getArticles()` — check of die al bestaat
- Styled met dezelfde prose classes als de juridische pagina's

### 2. Contact form backend koppelen
- Huidige contact pagina: `src/app/contact/page.tsx`
- Koppel aan Web3Forms (gratis, geen backend nodig)
- API key aanmaken op web3forms.com, email instellen naar Carla

### 3. Overige TODO's (Carla/extern)
- **Telefoonnummer Carla** updaten in Shopify Admin → Content → Metaobjects → Site Instellingen
- **Shopify Payments activeren** — iDEAL, creditcard etc.
- **E2E checkout test** op Vercel
- **DNS vinoperlei.nl** koppelen aan Vercel
- **Newsletter** koppelen aan Klaviyo/Mailchimp
- **Admin API token upgraden** met `write_content` scope

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
TODO: Blog detail pagina's bouwen (/blog en /blog/[slug])
TODO: Contact form koppelen (Web3Forms)
Shopify = alleen CMS backend, frontend draait op Vercel (Next.js)
```
