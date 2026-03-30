# Vino per Lei — Volgende Sessie Instructies

**Datum**: 26 maart 2026
**Prioriteit**: HANDLEIDING SCREENSHOTS — alle placeholders vervangen door echte screenshots met highlights

---

## LEES DIT EERST

De handleiding (`/handleiding`) heeft **~27 stappen met placeholder-screenshots** (grijs vlak met "Screenshot wordt nog toegevoegd"). Er liggen ook **14 admin-screenshots op disk die NIET gekoppeld zijn** in de code. Dit moet in één sessie gefixed worden.

---

## STAP 1: Bestaande screenshots koppelen

Er staan al screenshots in `public/handleiding/` die NIET gebruikt worden in `src/app/handleiding/HandleidingContent.tsx`. Koppel deze EERST door de `screenshot` property toe te voegen aan de juiste stap:

| Bestaand bestand | Koppelen aan sectie → stap |
|---|---|
| `producten-overzicht.png` | **Producten beheren** → Stap 1 "Ga naar Producten" |
| `product-velden.png` | **Producten beheren** → Stap 3 "Productvelden invullen" |
| `content-metaobjects.png` | **Homepage teksten** → Stap 1 "Ga naar Content" |
| `homepage-hero.png` | **Homepage teksten** → Stap 2 "Hero tekst aanpassen" |
| `announcement-bar.png` | **Homepage teksten** → Stap 3 "Announcement Bar" |
| `usp-items.png` | **Homepage teksten** → Stap 4 "USP punten" |
| `faq-overzicht.png` | **FAQ beheren** → Stap 1 "FAQ items vinden" |
| `categorie-blokken.png` | **Wijn categorieën** → Stap 1 "Category Blocks vinden" |
| `site-instellingen.png` | **Site instellingen** → Stap 1 "Site Instellingen openen" |
| `bedrijfsgegevens.png` | **Site instellingen** → Stap 2 "Bedrijfsgegevens aanpassen" |
| `orders-overzicht.png` | **Bestellingen bekijken** → Stap 1 "Orders overzicht" |

Na het koppelen: **3 admin-screenshots op disk die niet direct koppelbaar zijn** (site-instellingen-top.png, preview-handleiding.png, website-usp-balk.png) — bewaar deze, mogelijk bruikbaar als extra context.

---

## STAP 2: Website screenshots maken met Playwright MCP

Start de site lokaal en maak screenshots van alle website-secties die in de handleiding worden getoond. **Voeg rode highlights/markeringen toe** via JavaScript voordat je de screenshot neemt.

### Opstart

```bash
cd /c/Users/BartVisser/Desktop/vino-per-lei
npx --yes kill-port 3099
npm run build && npx next start --port 3099
```

**NOOIT `next dev` draaien** — crasht de sessie.

### Playwright workflow per screenshot

1. `browser_navigate` naar `http://localhost:3099/[pagina]`
2. `browser_evaluate` om highlight-overlays toe te voegen via JS:

```javascript
// Voorbeeld: rode border + label toevoegen rond een element
const el = document.querySelector('[data-target-selector]');
if (el) {
  el.style.outline = '3px solid #dc2626';
  el.style.outlineOffset = '4px';
  el.style.borderRadius = '8px';
  // Label toevoegen
  const label = document.createElement('div');
  label.textContent = 'Label tekst hier';
  label.style.cssText = 'position:absolute;top:-30px;right:0;background:#dc2626;color:white;padding:4px 12px;border-radius:6px;font-size:13px;font-weight:600;z-index:9999;font-family:system-ui';
  el.style.position = 'relative';
  el.appendChild(label);
}
```

3. `browser_take_screenshot` — sla op als PNG

### Te maken website screenshots

**Let op**: sommige bestaan al maar moeten opnieuw gemaakt worden omdat Cadeaus er nu af is (bijv. website-categorieen.png toont nog "Cadeaus" blok).

| Bestandsnaam | URL | Wat highlighten | Sectie |
|---|---|---|---|
| `website-producten.png` | `/wijnen` | Productgrid met kaarten, rode border + label "Producten uit Shopify" | Producten → Stap 1 |
| `website-product-detail.png` | `/wijnen/montaribaldi-barolo-2019` | Product hero section, label "Titel, beschrijving en prijs uit Shopify" | Producten → Stap 2 |
| `website-announcement-bar.png` | `/` | Announcement bar bovenaan, rode border + label "Announcement Bar" | Homepage → Stap 2 |
| `website-hero.png` | `/` | Hero sectie (titel + knoppen), label "Hero teksten uit Shopify" | Homepage → Stap 2 (extra) |
| `website-usp-balk.png` | `/` | USP balk onder hero, label "USP punten uit Shopify" | Homepage → Stap 4 |
| `website-reviews.png` | `/` | Testimonials sectie, label "Klantervaringen uit Shopify" | Klantervaringen → Stap 1 |
| `website-cijfers.png` | `/` | Stats/cijfers balk, label "Homepage cijfers uit Shopify" | Homepage cijfers → Stap 1 |
| `website-categorieen.png` | `/` | Category blocks (nu ZONDER Cadeaus!), label "Categorie Blokken" | Categorieën → Stap 1 |
| `website-faq.png` | `/klantenservice/faq` | FAQ accordion, label "FAQ items uit Shopify" | FAQ → Stap 1 |
| `website-bedrijfsgegevens.png` | `/` (footer) | Footer met KvK/BTW/adres, label "Bedrijfsgegevens uit Shopify" | Instellingen → Stap 2 |
| `website-over-ons.png` | `/over-ons` | Over Ons pagina content, label "Over Ons pagina" | Juridisch → Stap 1 |
| `website-contact.png` | `/contact` | Contact pagina, label "Contactgegevens uit Shopify" | (extra, handig) |

### Scroll-techniek voor secties die niet bovenaan staan

```javascript
// Scroll naar specifieke sectie voordat je screenshot maakt
document.querySelector('h2')?.scrollIntoView({ block: 'center' });
// Of specifieke sectie op basis van tekst:
[...document.querySelectorAll('h2')].find(h => h.textContent.includes('Weet je wat je zoekt'))?.scrollIntoView({ block: 'start' });
window.scrollBy(0, -100); // beetje ruimte boven
```

---

## STAP 3: Ontbrekende admin screenshots

De volgende admin screenshots ontbreken en KUNNEN NIET met Playwright gemaakt worden (geen inloggegevens). Gebruik placeholder-screenshots met **duidelijke instructie-tekst** als tijdelijke oplossing, OF neem ze handmatig.

### Stappen die nog admin screenshots missen

| Sectie | Stap | Wat moet erin |
|---|---|---|
| Producten beheren | Stap 4 "Prijs of voorraad snel wijzigen" | Product edit scherm met prijs/voorraad velden gehighlight |
| Klantervaringen | Stap 2 "Een review toevoegen" | Metaobjects → Testimonial → Add entry form |
| Klantervaringen | Stap 3 "Review bewerken of verwijderen" | Testimonial entry met Delete knop |
| Homepage cijfers | Stap 2 "Cijfers zelf instellen" | Metaobjects → Homepage Cijfer entries |
| FAQ beheren | Stap 2 "Vraag bewerken of toevoegen" | FAQ Item entry formulier |
| Categorieën | Stap 2 "Categorie aanpassen" | Category Block entry formulier |
| Instellingen | Stap 3 "Verzenddrempel & kosten" | Site Instellingen met verzendvelden |
| Blog schrijven | Stap 2 "Nieuw artikel schrijven" | Blog post editor |
| Juridisch | Stap 2 "Pagina aanmaken of bewerken" | Pages editor met handle veld |
| Bestellingen | Stap 2 "Bestelling inzien en verzenden" | Order detail met Fulfill knop |
| Verzending | Stap 1 "Verzendtarieven in Shopify" | Settings → Shipping and delivery |
| Toegang | Stap 6 "Wacht op goedkeuring" | Kan een simpele "check je e-mail" illustratie zijn |

**Optie**: Als Bart ingelogd is op Shopify Admin in de browser, kan Playwright MCP de admin-pagina's WEL screenshotten:
1. `browser_navigate` naar `https://vino-per-lei-2.myshopify.com/admin/products`
2. Als de sessie actief is → screenshot nemen
3. Zo niet → placeholder genereren

---

## STAP 4: Code aanpassen in HandleidingContent.tsx

Na het maken/koppelen van alle screenshots, update de `screenshot` property in elke stap. Voorbeeld:

```typescript
{
  title: "Ga naar Producten",
  description: "...",
  screenshot: "/handleiding/producten-overzicht.png",  // ← TOEVOEGEN
  websiteScreenshot: "/handleiding/website-producten.png",
}
```

### Checklist per sectie

- [ ] **Toegang** (7 stappen) — 6/7 hebben screenshots, stap 6 mist nog
- [ ] **Producten** (4 stappen) — 0/4 admin screenshots gekoppeld (2 bestaan op disk!)
- [ ] **Homepage** (4 stappen) — 0/4 admin screenshots gekoppeld (4 bestaan op disk!)
- [ ] **Klantervaringen** (3 stappen) — 0/3 screenshots
- [ ] **Homepage cijfers** (2 stappen) — 0/2 screenshots
- [ ] **FAQ** (2 stappen) — 0/2 admin screenshots gekoppeld (1 bestaat op disk!)
- [ ] **Categorieën** (2 stappen) — 0/2 admin screenshots gekoppeld (1 bestaat op disk!)
- [ ] **Instellingen** (3 stappen) — 0/3 admin screenshots gekoppeld (2 bestaan op disk!)
- [ ] **Blog** (2 stappen) — 0/2 admin screenshots
- [ ] **Juridisch** (2 stappen) — 0/2 screenshots
- [ ] **Bestellingen** (2 stappen) — 0/2 admin screenshots gekoppeld (1 bestaat op disk!)
- [ ] **Verzending** (1 stap) — 0/1 screenshots

### Website screenshots die opnieuw gemaakt moeten worden

- [ ] `website-categorieen.png` — toont nog "Cadeaus" blok, moet opnieuw (nu 4 categorieën)

---

## STAP 5: Build & verify

```bash
npm run build && npx next start --port 3099
```

Open `http://localhost:3099/handleiding` in Playwright en scroll door ELKE sectie om te verifiëren dat:
- Geen enkele placeholder meer zichtbaar is
- Highlights/labels leesbaar zijn
- Screenshots relevant zijn voor de stap

---

## Samenvatting vorige sessie (26 mrt 2026)

### Wat er gedaan is
1. **Cadeaus + Blog tijdelijk verwijderd** uit navigatie, footer, homepage, sitemap, middleware, CMS defaults
2. **Filters dynamisch gemaakt** — opties met 0 producten worden verborgen
3. **"Niet goed geld terug" / proefgarantie verwijderd** uit alle pagina's en componenten
4. **Telefoonnummer verwijderd** uit header, footer, contact pagina, handleiding, CMS defaults
5. **Handleiding "Toegang" sectie herschreven** — duidelijke stappen voor koppelen aan vino-per-lei-2.myshopify.com

### Niet gecommit
Alle wijzigingen staan UNCOMMITTED. Commit na het voltooien van de screenshots.

### Technische details
- **Build**: succesvol (0 errors)
- **Port**: 3099 (`npx next start --port 3099`)
- **NOOIT** `next dev` draaien
- Blog/cadeaus routes bestaan nog als bestanden — alleen uit navigatie verwijderd
