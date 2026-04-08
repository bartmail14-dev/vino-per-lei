# Vino per Lei — Volgende Sessie Instructies

**Datum**: 8 april 2026 (na sessie 21)
**Status**: Prioriteit 1+2 COMPLEET — alle screenshots gekoppeld, TypeScript 0 errors

---

## EERSTE ACTIE: LEES DIT BESTAND

Project staat op een ongebruikelijke locatie (OneDrive, niet Desktop):

```
C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei
```

---

## INSTRUCTIE VOLGENDE SESSIE

### PRIORITEIT 1: Resterende screenshot-gaps dichten

De handleiding (`src/app/handleiding/HandleidingContent.tsx`) is grotendeels compleet.
Er zijn 61 screenshots in `public/handleiding/`. Check per sectie of er nog stappen zijn
die baat hebben bij een extra screenshot of websiteScreenshot.

**Stappen die nog GEEN websiteScreenshot hebben (overweeg toevoegen):**

| Sectie | Stap | Mogelijke websiteScreenshot |
|--------|------|---------------------------|
| Producten | Productvelden invullen | `website-product-detail.webp` (al beschikbaar) |
| Producten | Prijs wijzigen | `website-producten.webp` (al beschikbaar) |
| Klantervaringen | Review toevoegen | `website-reviews.webp` (al beschikbaar, staat bij stap 1) |
| Homepage cijfers | Cijfers instellen | `website-cijfers.webp` (al beschikbaar, staat bij stap 1) |
| Categorieen | Category Blocks vinden | heeft al websiteScreenshot ✓ |
| Instellingen | Site Instellingen openen | — (geen zinvolle website-variant) |
| Instellingen | Verzenddrempel | `website-verzending.webp` (al beschikbaar) |
| Bestellingen | Orders overzicht | — (geen publieke pagina) |
| Bestellingen | Bestelling verzenden | — (geen publieke pagina) |

**Stappen die GEEN admin screenshot hebben (bewust — geen visueel element):**
- Toegang stap 2 "Klik op Join now" — hergebruikt stap 1 screenshot (OK)
- Toegang stap 5 "Wacht op goedkeuring" — geen screenshot nodig (OK)

**Aanpak:**
1. Open HandleidingContent.tsx
2. Loop alle `steps` door
3. Waar een `websiteScreenshot` ontbreekt maar een passend bestand beschikbaar is → voeg toe
4. Build check: `npx tsc --noEmit`

### PRIORITEIT 2: Carla's feedback verwerken

Uit eerdere sessies — codewijzigingen nodig:
- [ ] **Prijsfilter <€10 verwijderen** — WijnenClient.tsx filter opties aanpassen
- [ ] **Barolo→Barbera correctie** — check product data / teksten
- [ ] **Over Ons pagina → wij-vorm** — tekst aanpassen (komt uit Shopify Pages, dus via Admin)
- [ ] **Pinterest link verwijderen** — footer / site-instellingen

### PRIORITEIT 3: Inventory tracking

11 producten moeten inventory tracking aan krijgen in Shopify Admin:
1. Ga naar Products in Shopify Admin
2. Open elk product → scroll naar Inventory
3. Zet "Track quantity" aan
4. Vul voorraadaantal in
5. Save

Dit moet via Playwright MCP in Shopify Admin.

### PRIORITEIT 4: Overige TODO's

- [ ] GA4 tracking ID instellen (PostHog env vars op Vercel)
- [ ] Web3Forms API key koppelen (contactformulier stuurt nu niks)
- [ ] Domein vinoperlei.nl koppelen aan Vercel
- [ ] Shopify API-token roteren (staat in git history)
- [ ] Push naar master (VEEL uncommitted werk van sessie 20+21)

---

## WAT ER SESSIE 21 IS GEDAAN (8 april 2026)

### Prioriteit 1: HandleidingContent.tsx bijgewerkt (18 wijzigingen totaal)

**12 screenshot-koppelingen bijgewerkt/toegevoegd:**
- Producten stap 1: screenshot → `admin-producten-overzicht.webp`, websiteScreenshot → `website-producten-grid.webp`
- Producten stap 4: screenshot → `admin-product-prijs-voorraad.webp`
- Homepage stap 1: screenshot → `admin-content-metaobjects.webp`
- Homepage stap 3 (Announcement): screenshot → `admin-announcement-bar-entry.webp`
- Homepage stap 4 (USP): screenshot → `admin-usp-item-entry.webp`, websiteScreenshot → `website-kaart.webp`
- Homepage stap 2 (Hero): screenshot → `admin-homepage-hero-entry.webp`
- Klantervaringen stap 3: screenshot `admin-testimonial-bewerken.webp` NIEUW
- FAQ stap 2: websiteScreenshot `website-faq-items.webp` NIEUW
- Blog stap 1: websiteScreenshot → `website-nieuwsbrief.webp`
- Blog stap 2: screenshot `admin-blog-nieuw.webp` + websiteScreenshot `website-blog-pagina.webp` NIEUW
- Juridisch stap 2: screenshot `admin-paginas.webp` + websiteScreenshot `website-voorwaarden.webp` NIEUW
- Bestellingen stap 1: screenshot → `admin-orders.webp`
- Verzending stap 1: websiteScreenshot `website-verzending.webp` NIEUW
- Instellingen stap 2: screenshot → `admin-site-instellingen-entry.webp`, websiteScreenshot → `website-footer.webp`
- Cijfers stap 2: screenshot → `admin-homepage-cijfer-entry.webp`
- Categorieen stap 2: screenshot → `admin-categorie-blok-entry.webp`

### Prioriteit 2: 6 metaobject entry-screenshots genomen via Playwright
- `admin-homepage-cijfer-entry.webp` — "Wijnen" entry
- `admin-site-instellingen-entry.webp` — "Main 1" entry
- `admin-categorie-blok-entry.webp` — "Rode Wijn" entry
- `admin-usp-item-entry.webp` — "Gratis Verzending" entry
- `admin-announcement-bar-entry.webp` — "Main 1" entry
- `admin-homepage-hero-entry.webp` — "Main" entry

### TypeScript: 0 errors na alle wijzigingen

---

## WAT ER SESSIE 20 IS GEDAAN (8 april 2026)

### Screenshots genomen via Playwright MCP

**18 website-screenshots** van vino-per-lei.vercel.app:
1. `website-hero.webp` — Homepage hero + announcement bar + navigatie
2. `website-usp-balk.webp` — USP balk + "Onze Favorieten" productkaarten
3. `website-kaart.webp` — Italië kaart + Carla Daniels quote
4. `website-cijfers.webp` — Reviews "Reacties van de proeverij"
5. `website-categorieen.webp` — Categorieblokken
6. `website-blog.webp` — Blog sectie "Achter het etiket" op homepage
7. `website-nieuwsbrief.webp` — Nieuwsbrief aanmelding + footer
8. `website-footer.webp` — Volledige footer
9. `website-producten.webp` — /wijnen pagina
10. `website-producten-grid.webp` — Productgrid met filters sidebar
11. `website-product-detail.webp` — Productdetail Montaribaldi Barolo DOCG
12. `website-over-ons.webp` — Over Ons pagina
13. `website-faq.webp` — FAQ pagina hero + categorie-tabs
14. `website-faq-items.webp` — FAQ vragen lijst
15. `website-contact.webp` — Contact pagina
16. `website-blog-pagina.webp` — Blog overzichtspagina
17. `website-verzending.webp` — Verzending & Levering
18. `website-voorwaarden.webp` — Algemene Voorwaarden

**13 admin-screenshots** van Shopify Admin + 6 entry-screenshots (sessie 21)

### Totaal: 61 WebP bestanden in public/handleiding/

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify Admin** | `https://admin.shopify.com/store/vino-per-lei-2` |
| **Klant** | Carla Daniels |
| **Laatste commit** | `2a50695` (niet gepusht, veel uncommitted werk) |
| **Handleiding** | `src/app/handleiding/HandleidingContent.tsx` |
| **Screenshots** | `public/handleiding/` (61 bestanden) |

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **NOOIT blanket `taskkill //IM`** — alleen specifieke PIDs
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Playwright:** Sluit ALLE Chrome vensters voordat je Playwright MCP start
- **Build check:** `npm run build` of `npx tsc --noEmit` — NOOIT `next dev`
- **OneDrive sync:** Bestanden staan in OneDrive, kan soms langzamer zijn dan Desktop

## Env vars (nog instellen op Vercel)
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog analytics
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog host
- `NEXT_PUBLIC_WEB3FORMS_KEY` — Web3Forms contactformulier
