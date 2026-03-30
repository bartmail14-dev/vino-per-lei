# Vino per Lei — Overdracht volgende sessie

**Datum:** 30 maart 2026 (sessie 17)
**Laatste sessie:** 4 producten inventory tracking afgerond via Playwright + Carla's feedback ontvangen.

---

## INSTRUCTIE VOLGENDE SESSIE

> **PRIORITEIT 1: Inventory tracking AFMAKEN — nog 11 producten**
>
> 9 van 20 producten zijn KLAAR. De overige 11 moeten nog.
>
> **LET OP: Refosco dal Peduncolo Rosso DOC** heeft tracking AAN maar voorraad = 0. Moet nog op 48 gezet worden.
>
> **Stappen:**
> 1. Lees deze HANDOFF-VPL.md volledig door
> 2. Sluit ALLE Chrome vensters
> 3. Navigeer met Playwright MCP naar: `https://admin.shopify.com/store/vino-per-lei-2/products`
> 4. Bart moet inloggen in Shopify Admin (Playwright kan dat niet automatisch)
> 5. Per product (11 resterende): tracking aan + voorraad 48 + save
> 6. Na alle producten: build + test om te verifiëren dat badges werken
> 7. Commit + push naar Vercel
>
> **TIP:** Gebruik `browser_run_code` met dit patroon per product:
> ```js
> // 1. Klik checkbox "Inventory not tracked"
> // 2. Klik Available "0" via: page.locator('table').getByRole('row').last().getByRole('cell').nth(3).getByRole('button').click()
> // 3. Klik New spinbutton, fill '48'
> // 4. Save popup via #PolarisPortalsContainer
> // 5. Save product via #AppFrameScrollable
> ```
> Let op: de "Next" knop kan vastlopen als er unsaved changes zijn. Altijd eerst save/discard.
>
> **PRIORITEIT 2: Carla's feedback verwerken (code wijzigingen)**
> Carla stuurde een mail met wensen. Verwerk deze in de code:
>
> 1. **Prijsfilter "onder €10" verwijderen** — uit FilterSidebar.tsx
> 2. **Barolo → Barbera** in "authentieke Italiaanse wijnen" sectie op homepage (page.tsx)
> 3. **Over Ons herschrijven**: 3e persoon → wij-vorm + toevoegen: "werkt voornamelijk met kleine wijnhuizen en op beperkte schaal met een importeur"
> 4. **Pinterest link verwijderen** — Instagram behouden (Carla heeft al een account)
> 5. **"Cadeaus" uit Shopify CMS verwijderen** — Content → Metaobjects → Categorie Blok
> 6. **"Cadeaus" link uit Footer.tsx verwijderen** (hardcoded onder "Shop")
>
> **Al gedaan in eerdere sessies (controleer of compleet):**
> - Cadeaus + Blog uit navigatie/footer/homepage/sitemap/middleware
> - "Niet tevreden geld terug" / proefgarantie verwijderd
> - Telefoonnummer verwijderd
>
> **WACHT OP CARLA:**
> - Tekst "hoe het allemaal begon" — Carla levert aanvullende info aan
>
> **PRIORITEIT 3: Admin screenshots handleiding secties 2-12**
> - Sectie 1 "Toegang tot Shopify" is KLAAR (5 admin screenshots)
> - Website screenshots voor secties 2-12 zijn KLAAR (sessie 16)
> - Wat ONTBREEKT: Shopify Admin screenshots voor stappen die admin-schermen tonen
> - Bart moet ingelogd zijn in Shopify Admin, dan kan Playwright de admin pagina's screenshotten
> - Zie "ONTBREKENDE ADMIN SCREENSHOTS" hieronder voor exacte lijst
>
> **PRIORITEIT 4: Functionele tests (als tijd over)**
> - Age gate popup testen
> - Checkout redirect (Shopify checkout)
> - Zoekfunctionaliteit
> - Mobile menu (hamburger)
>
> **PRIORITEIT 5: Overige TODO's**
> - GA4 tracking ID invullen
> - Web3Forms key invullen voor contactformulier
> - "Mail bij voorraad" koppelen aan email service
> - Domein vinoperlei.nl koppelen aan Vercel + Google Search Console
>
> **LET OP:** NOOIT `next dev` draaien — crasht Claude Code. Gebruik altijd prod server.
> **PLAYWRIGHT:** Sluit ALLE Chrome vensters voordat je Playwright MCP start.

---

## WAT ER DEZE SESSIE IS GEDAAN (sessie 17)

### 1. Inventory tracking (4 producten afgerond)
Via Playwright MCP in Shopify Admin:
- **Pinot Grigio delle Venezie DOC** — tracking AAN, 48 stuks
- **Montaribaldi Langhe Chardonnay** — tracking AAN, 48 stuks
- **San Marzano Il Pumo Primitivo** — tracking AAN, 48 stuks
- **Jo Primitivo Salento IGT** — tracking AAN, 48 stuks

### 2. Refosco dal Peduncolo Rosso DOC — DEELS
- Tracking is AAN gezet maar voorraad bleef op 0 (script crashte)
- Moet nog op 48 gezet worden

### 3. Carla's feedback ontvangen (niet verwerkt)
Mail van Carla met wensen — nog niet in code verwerkt. Zie PRIORITEIT 2.

---

## INVENTORY TRACKING STATUS

### KLAAR (9 producten — tracking AAN + voorraad ingesteld)
1. **Asolo Prosecco Superiore DOCG Extra Brut** — 18 available, 24 on hand
2. **Prosecco Superiore Valdobbiadene DOCG** — 48 stuks
3. **Cerasuolo d'Abruzzo Rosé DOC** — 48 stuks
4. **Bardolino Chiaretto Rosé DOC** — 48 stuks
5. **Vermentino Toscana IGT** — 48 stuks
6. **Pinot Grigio delle Venezie DOC** — 48 stuks (sessie 17)
7. **Montaribaldi Langhe Chardonnay** — 48 stuks (sessie 17)
8. **San Marzano Il Pumo Primitivo** — 48 stuks (sessie 17)
9. **Jo Primitivo Salento IGT** — 48 stuks (sessie 17)

### NOG TE DOEN (11 producten)
10. **Refosco dal Peduncolo Rosso DOC** — tracking AAN, voorraad = 0 (MOET 48 WORDEN)
11. Teroldego Rotaliano DOC
12. Tenuta Val d'Ombra 'Ombra Alta'
13. Valpolicella Ripasso Superiore DOC
14. Rubinelli Vajol Valpolicella Ripasso
15. Amarone della Valpolicella DOCG
16. Nebbiolo Langhe DOC
17. Barolo Classico DOCG
18. Montaribaldi Barbera d'Alba
19. Montaribaldi Barolo DOCG
20. (check of er nog meer zijn)

### Exacte stappen per product (bewezen workflow)
1. Open product (klik op naam of "Next" knop)
2. Scroll naar "Inventory" sectie → checkbox "Inventory not tracked"
3. Klik de checkbox → verandert naar "Inventory tracked"
4. Inventory tabel verschijnt → klik op "0" bij Available
5. Popup opent → klik op "New" spinbutton → type `48`
6. Klik "Save" in inventory popup → toast "Quantity updated"
7. Klik "Save" onderaan productpagina → toast "Product saved"
8. Klik "Next" → volgende product

---

## CARLA'S FEEDBACK (mail 30 maart 2026)

Letterlijk uit haar mail:
1. ~~Kopje cadeaus en blogs verwijderen~~ — code DONE (sessie 16), CMS nog niet
2. **Zoeken op prijs onder de €10 verwijderen** — FilterSidebar.tsx
3. **Onder "authentieke Italiaanse wijnen" de barolo vervangen door barbera** — page.tsx
4. ~~Niet tevreden, geld terug verwijderen~~ — DONE (sessie 16)
5. **"Over ons" herschrijven naar wij-vorm** + toevoeging kleine wijnhuizen + importeur
6. ~~Telefoonnummer niet benoemen op de site~~ — DONE (sessie 16)
7. **Tekst "hoe het allemaal begon"** — WACHT OP CARLA (levert info aan)
8. **Instagram behouden, Pinterest verwijderen** — Footer.tsx
9. ~~Blogs verwijderen~~ — DONE (sessie 16)

---

## ONTBREKENDE ADMIN SCREENSHOTS

Deze screenshots kunnen ALLEEN gemaakt worden als Bart is ingelogd in Shopify Admin:

| Sectie | Stap | Wat moet erin | Shopify URL |
|---|---|---|---|
| Producten | Stap 2 "Nieuw product" | Add product formulier | `/admin/products/new` |
| Producten | Stap 4 "Prijs wijzigen" | Product edit met prijs/voorraad | `/admin/products/[id]` |
| Klantervaringen | Stap 2 "Review toevoegen" | Testimonial → Add entry | `/admin/content/entries/testimonial` |
| Klantervaringen | Stap 3 "Review bewerken" | Testimonial entry met Delete | `/admin/content/entries/testimonial/[id]` |
| Homepage cijfers | Stap 2 "Cijfers instellen" | Homepage Cijfer entries | `/admin/content/entries/homepage_cijfer` |
| FAQ | Stap 2 "Vraag toevoegen" | FAQ Item entry formulier | `/admin/content/entries/faq_item` |
| Categorieën | Stap 2 "Categorie aanpassen" | Categorie Blok entry | `/admin/content/entries/categorie_blok` |
| Instellingen | Stap 3 "Verzenddrempel" | Site Instellingen verzendvelden | `/admin/content/entries/site_instellingen` |
| Blog | Stap 2 "Artikel schrijven" | Blog post editor | `/admin/articles/new` |
| Juridisch | Stap 2 "Pagina bewerken" | Pages editor met handle | `/admin/pages` |
| Bestellingen | Stap 2 "Verzenden" | Order detail met Fulfill knop | `/admin/orders/[id]` |
| Verzending | Stap 1 "Tarieven" | Shipping and delivery settings | `/admin/settings/shipping` |

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion v12 + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify** | `vino-per-lei-2.myshopify.com` (CMS + products) |
| **Shopify Admin** | `https://admin.shopify.com/store/vino-per-lei-2` |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **Laatste commit** | `2a50695` — cadeaus/blog/proefgarantie verwijderd + screenshots handleiding |
| **NIET gepusht** | Commit `2a50695` staat nog niet op master |

---

## Nog te doen voor livegang (volledig overzicht)

1. ⬜ **Inventory tracking AFMAKEN** — 11 resterende producten (incl. Refosco fix)
2. ⬜ **Carla's feedback verwerken** — prijsfilter, barolo→barbera, over ons, pinterest
3. ⬜ **"Cadeaus" uit Shopify CMS verwijderen**
4. ⬜ **Admin screenshots handleiding** — 12 ontbrekende Shopify Admin screenshots
5. ⬜ **Functionele tests** — age gate, checkout redirect, zoek, mobile menu
6. ⬜ **GA4 tracking ID** invullen
7. ⬜ **Web3Forms key** invullen voor contactformulier
8. ⬜ **"Mail bij voorraad"** koppelen aan email service
9. ⬜ **Domein vinoperlei.nl** koppelen aan Vercel + Google Search Console
10. ⬜ **Push naar master** — commit `2a50695` nog niet gepusht
11. ✅ ~~Cadeaus/blog/proefgarantie/telefoon verwijderd~~ — DONE (sessie 16)
12. ✅ ~~Website screenshots handleiding~~ — DONE (sessie 16)
13. ✅ ~~4 producten inventory tracking~~ — DONE (sessie 17)

---

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Shopify API versie:** `2025-01`

## Design systeem quick reference

| Element | Waarde |
|---------|--------|
| Primary | wine-burgundy `#1a1f3d` |
| Accent | gold `#c9a227` |
| Background | cream `#faf9f7` |
| Border | sand `#e8e0d5` |
| Wine type rood | wine-red `#8B1A32` |
| Serif | Playfair Display |
| Sans | Inter |
