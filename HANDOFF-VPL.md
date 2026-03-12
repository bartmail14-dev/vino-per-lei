# Vino per Lei — Overdracht & Instructies Volgende Sessie

**Datum:** 12 maart 2026
**Laatste sessie:** Shopify CMS integratie (alle content beheerbaar vanuit Shopify)

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

## Status: GECOMMIT & GEPUSHT

Laatste commit: `f0962cd` — Shopify CMS integratie.
Vercel auto-deploy zou nu moeten draaien.

---

## Wat er is gedaan deze sessie

### Wave 1: Audit-fixes committen (9+1 commits)
Alle 143 uncommitted files uit de vorige sessie netjes opgesplitst gecommit:
1. Legal pages + cookie consent
2. Error pages + SEO (404, sitemap, robots, loading)
3. Footer compliance (bedrijfsgegevens, alcohol disclaimer)
4. Security hardening (CSP, cookie flags, cart guards, PII)
5. Shopify hosted checkout + fake reviews/auth verwijderd
6. Code quality + SEO meta
7. A11y + routes (keyboard mega menu, reduced motion, filters)
8. Image optimization (PNGs→WebP, hero video gecomprimeerd)
9. Dev artifacts opgeruimd (screenshots, scripts)
10. Docs + Shopify utility scripts

### Wave 2: Technische fixes
- Footer categorie-links → `/wijnen?type=X`
- npm audit fix → 0 vulnerabilities
- hero-banner.png → WebP (1.5MB → 91KB)
- hero-video-original.mp4 verwijderd (14MB)

### Wave 3: Shopify CMS integratie (GROTE REFACTOR)

**Nieuwe bestanden:**
| Bestand | Wat het is |
|---------|-----------|
| `src/lib/shopify-cms.ts` | Storefront API queries voor metaobjects, pages, blog, menus |
| `src/components/layout/FooterWrapper.tsx` | Server Component die CMS data fetcht voor Footer |
| `src/components/layout/HeaderWrapper.tsx` | Server Component die CMS data fetcht voor Header |
| `scripts/setup-shopify-cms.ts` | Admin API script: metaobject-definities + seed data |

**7 metaobject-types aangemaakt in Shopify:**
1. `site_settings` — bedrijfsgegevens, contact, social URLs, openingstijden
2. `homepage_hero` — hero tekst, CTAs
3. `announcement_bar` — bericht, aan/uit toggle, link
4. `usp_item` — 4 trust signals (gratis verzending, retour, expert, betalen)
5. `faq_item` — 17 FAQ items in 6 categorieën
6. `wine_region` — 9 Italiaanse wijnregio's
7. `category_block` — 5 categorie-blokken (rood, wit, rosé, bubbels, cadeaus)

**Pagina's geüpdatet (14 bestanden):**
- Homepage: hero, USPs, categorieën, blog nu uit CMS
- FAQ: items uit metaobjects, gegroepeerd per categorie
- Contact: telefoon/email/adres/openingstijden uit CMS
- Privacy, Voorwaarden, Cookies, Verzending, Retourneren, Over Ons: uit Shopify Pages
- Footer: bedrijfsgegevens, social links, navigatie uit CMS
- Header: announcement bar en contactinfo uit CMS
- layout.tsx: Wrapper components voor server-side data fetching

**ISR:** Alle CMS-pagina's hebben `revalidate = 60` (wijzigingen live binnen 1 minuut)

**Fallbacks:** Alle hardcoded content blijft als fallback wanneer CMS nog niet gevuld is.

---

## Shopify Admin API Token Scope Issue

De huidige Admin API token mist de `write_content` / `write_online_store_pages` scope.
Hierdoor konden Pages, Blog en Navigatie NIET automatisch worden aangemaakt via het script.

**Oplossing A (snel):** Maak Pages, Blog en Menu's handmatig aan in Shopify Admin (zie taken hieronder)
**Oplossing B (structureel):** Maak een nieuwe custom app aan in Shopify Admin → Settings → Apps → Develop apps met de scopes: `write_content`, `write_online_store_pages`, `read_metaobjects`, `write_metaobjects`. Gebruik het nieuwe token en draai het script opnieuw: `npx tsx scripts/setup-shopify-cms.ts`

---

## Waar Carla content beheert

| Content | Waar in Shopify Admin |
|---------|----------------------|
| Bedrijfsgegevens, telefoon, email, openingstijden | Content → Metaobjects → Site Instellingen |
| Homepage hero tekst & knoppen | Content → Metaobjects → Homepage Hero |
| Announcement bar (boven navigatie) | Content → Metaobjects → Announcement Bar |
| USP balk (gratis verzending etc.) | Content → Metaobjects → USP Items |
| FAQ vragen & antwoorden | Content → Metaobjects → FAQ Items |
| Wijnregio's | Content → Metaobjects → Wijnregio's |
| Categorie-blokken homepage | Content → Metaobjects → Categorie Blokken |
| Privacy, Voorwaarden, Cookies, etc. | Online Store → Pages |
| Blog artikelen | Online Store → Blog Posts |
| Navigatie (footer links) | Online Store → Navigation |
| Producten & prijzen | Products |

---

## TODO's volgende sessie (prioriteit)

### BLOKKERS voor livegang
1. **Shopify Pages aanmaken** — privacy, voorwaarden, cookies, verzending, retourneren, over-ons (content staat in `scripts/setup-shopify-cms.ts`)
2. **Blog "Wijn Verhalen" aanmaken** + 6 artikelen (content in setup script)
3. **Navigatie menu's aanmaken** — footer-shop, footer-service, footer-about (handles + links in setup script)
4. **Telefoonnummer Carla** updaten in Shopify Admin → Content → Site Instellingen
5. **Shopify Payments activeren** — iDEAL, creditcard etc. in Admin → Settings → Payments
6. **E2E checkout test** op Vercel (Shopify test mode)
7. **DNS vinoperlei.nl** koppelen aan Vercel (Carla moet domein registreren)

### HOOG
8. **Admin API token upgraden** met `write_content` scope zodat het setup script alles kan
9. **Contact form backend** koppelen (Web3Forms of Shopify) + rate limiting
10. **Newsletter** koppelen aan Klaviyo/Mailchimp (nu een stub in Footer)
11. **Blog detail pagina's** bouwen (`/blog/[slug]` route met `getBlogArticleByHandle()`)

### MEDIUM
12. **Kortingscodes** via Shopify API (`checkoutDiscountCodeApplyV2`)
13. **Nonce-based CSP** voor script-src
14. **Cadeaus pagina** vullen met content of Shopify collection koppelen

### LAAG
15. LoginModal a11y (focus trap, role="dialog")
16. Color contrast fixes (footer white/40 op dark)
17. `use client` verwijderen van pure display components

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

## Belangrijke bestanden

| Bestand | Wat het is |
|---------|-----------|
| `src/lib/shopify-cms.ts` | **KERN** — Alle CMS queries + types + defaults |
| `src/lib/shopify.ts` | Product queries + checkout |
| `scripts/setup-shopify-cms.ts` | Setup script (Admin API) — eenmalig draaien |
| `src/components/layout/FooterWrapper.tsx` | Server wrapper die Footer voedt |
| `src/components/layout/HeaderWrapper.tsx` | Server wrapper die Header voedt |
| `.env.local` | Shopify tokens (NIET committen) |
| `.env.example` | Template voor env vars |
| `src/middleware.ts` | Security headers (CSP) |
| `AUDIT-LIVEGANG.md` | Volledige audit rapport |

---

## Lees dit EERST volgende sessie
```
Lees HANDOFF-VPL.md in C:\Users\BartVisser\Desktop\vino-per-lei
Shopify CMS integratie KLAAR — check of Vercel deploy geslaagd is
TODO: Pages + Blog + Menu's aanmaken in Shopify Admin (of token upgraden + script opnieuw)
```
