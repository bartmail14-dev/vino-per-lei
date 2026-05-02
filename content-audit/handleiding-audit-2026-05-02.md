# Vino per Lei - handleiding audit

Datum: 2026-05-02  
Scope: live `/handleiding`, Shopify `page_content/handleiding`, bestaande oude handleidingcomponent, bestaande screenshots in `public/handleiding`, en de huidige Shopify informatiestromen.

## Conclusie

De huidige live handleiding is onvoldoende. Technisch komt de pagina uit Shopify, maar inhoudelijk is het geen bruikbare handleiding: de live Shopify-content bevat alleen een titel en een korte alinea. Carla kan hier niet zelfstandig uit afleiden waar ze productdetails, PDP-velden, homepageblokken, navigatie, UI-copy, orderregels, juridische pagina's of verzendinstellingen moet wijzigen.

Er heeft eerder wel een uitgebreide hardcoded handleiding bestaan in `src/app/handleiding/HandleidingContent.tsx`, met 12 secties en tientallen screenshots. Die component is uit de frontend gehaald, maar de inhoud is niet gelijkwaardig teruggezet in Shopify. Daardoor is de handleiding functioneel vrijwel leeg geworden.

## Gecontroleerde feiten

- Route: `src/app/handleiding/page.tsx`
- Data-bron: `getPage("handleiding")`
- Fallback-bron: Shopify metaobject `page_content/handleiding`
- Live status lokaal: `http://localhost:3099/handleiding` geeft HTTP 200
- Live handleiding bevat 1 `h2`
- Live handleiding bevat 0 afbeeldingen
- Live handleiding bevat niet de oude titel `Beheer je webshop`
- Live handleiding bevat niet de relevante uitleg over `ui_copy`
- Live handleiding bevat wel de korte Shopify-body: producten, prijzen, voorraad, pagina-inhoud, FAQ-items en homepageblokken worden beheerd via Shopify.

## Kritieke fouten

### 1. Live handleiding is praktisch leeg

Huidige Shopify-content:

```html
<h2>Beheer via Shopify</h2>
<p>Producten, prijzen, voorraad, pagina-inhoud, FAQ-items en homepageblokken worden beheerd via Shopify.</p>
```

Dit is geen handleiding. Het vertelt niet:

- waar Carla moet klikken;
- welke Shopify-sectie welk websiteonderdeel aanstuurt;
- welke velden verplicht zijn;
- welke veldformaten verwacht worden;
- wat na opslaan zichtbaar moet worden;
- hoe snel wijzigingen zichtbaar zijn;
- wat ze moet doen als iets niet zichtbaar wordt;
- welke onderdelen via `ui_copy`, metaobjects, product-metafields, menus, pages of Shopify core productdata lopen.

### 2. Oude uitgebreide handleiding is verdwenen uit de live ervaring

In git bestaat de oude handleiding nog als verwijderde frontendcomponent. Die bevatte onder andere:

- Toegang tot Shopify
- Producten beheren
- Homepage teksten
- Klantervaringen
- Homepage cijfers
- FAQ beheren
- Wijn categorieen
- Site instellingen
- Blog schrijven
- Juridische pagina's
- Bestellingen bekijken
- Verzending instellen

Die inhoud is niet meer zichtbaar op `/handleiding`. De huidige Shopify-body vervangt dat met een minimale alinea.

### 3. De bestaande screenshotbibliotheek wordt niet gebruikt

Er staan 50+ handleiding-afbeeldingen in `public/handleiding`, waaronder:

- Shopify Admin screenshots voor producten, metaobjects, pagina's, bestellingen en verzending.
- Website screenshots voor hero, productdetail, productgrid, FAQ, footer, blog, contact en voorwaarden.
- Toegangsstappen voor Shopify Partners.

De live handleiding gebruikt 0 afbeeldingen. Daarmee mist Carla precies de visuele houvast die ze nodig heeft.

### 4. Belangrijke huidige Shopify-stromen ontbreken volledig

De handleiding noemt niet of onvoldoende:

- `ui_copy`: alle labels, knoppen, fallbackteksten en microcopy die nu vanuit Shopify kunnen komen.
- Product-orderregels: `order_minimum`, `order_increment`, `order_unit_label`, `order_unit_size`, `price_unit_label`.
- Product-PDP velden: serveertemperatuur, decanteren, alcoholpercentage, inhoud, sluiting, allergenen, vinificatie, opslag/drinkadvies, producent.
- Shopify taxonomy metafields: land, regio, druif, wijnzoetheid, dieetvoorkeuren.
- Custom productmetafields: wijnstijl, druiven, land/regio fallback, vintage, smaakprofielen, food pairing, awards.
- Metaobjecten: `site_settings`, `homepage_hero`, `announcement_bar`, `usp_item`, `faq_item`, `wine_region`, `category_block`, `testimonial`, `homepage_stat`, `page_content`, `ui_copy`.
- Menus/navigation: Shopify navigation stuurt de header/footer aan.
- Het verschil tussen Shopify Pages en `page_content` metaobjects.

### 5. Navigatie lijkt in Shopify verkeerd ingesteld

De lokaal gerenderde header bevat deze Shopify-menu-URLs:

- `https://vino-per-lei-2.myshopify.com/`
- `https://vino-per-lei-2.myshopify.com/collections/all`
- `https://vino-per-lei-2.myshopify.com/pages/contact`

Dat betekent dat de Shopify navigatie waarschijnlijk nog naar de standaard Shopify-theme URLs wijst, niet naar de headless storefront routes. De handleiding moet uitleggen hoe Carla menu-items beheert, maar de huidige handleiding noemt menus helemaal niet. Dit is tegelijk een inhoudelijk handleiding-gat en mogelijk een echte storefront-configuratiefout.

### 6. Oude handleiding bevat inmiddels verouderde of risicovolle claims

De oude hardcoded handleiding kan niet blind teruggezet worden. Voorbeelden:

- "Wijzigingen zijn binnen 1 uur zichtbaar" is te ruim/onduidelijk voor de huidige dynamische routes en revalidate-flow.
- "Als een pagina nog niet bestaat, wordt er automatisch een standaardtekst getoond" is gevaarlijk bij juridische content: Carla moet juist weten welke pagina's actief uit Shopify komen en wat fallbackgedrag betekent.
- "Je kunt alles beheren: producten, teksten, bestellingen, en meer" is te algemeen en maskeert dat sommige instellingen in metaobjects, sommige in Pages, sommige in productmetafields en sommige in Shopify Settings zitten.
- Productinstructies noemen `Product type` en `Tags`, maar missen de huidige metafields en taxonomyvelden die de frontend echt gebruikt.
- Verzendkosten worden genoemd als site-instelling, maar checkouttarieven zitten apart in Shopify Shipping. Die relatie moet strakker worden uitgelegd.

## Waarom Carla hierop vastloopt

Carla ziet in de storefront concrete teksten zoals "Serveertemperatuur", "Decanteren", "Vinificatie", "Opslag & Drinkadvies" en "Producent". De live handleiding vertelt haar nergens:

- welk product ze moet openen;
- dat ze naar product-metafields moet scrollen;
- welke exacte metafieldnamen ze moet aanpassen;
- wat het verschil is tussen een leeg veld en een fallbacktekst;
- welke labels via `ui_copy` komen;
- hoe ze controleert of haar wijziging op de productpagina zichtbaar is.

Voor haar voelt het daardoor alsof de site nog hardcoded is, ook als de technische koppeling inmiddels bestaat.

## Benodigde correcties

### A. Maak van `page_content/handleiding` een echte Shopify-handleiding

Vervang de huidige korte body door een volledige, statische HTML-handleiding in Shopify. Die moet minimaal deze onderdelen bevatten:

1. Snelstart: waar log je in, wat mag je aanpassen, wat moet je niet doen.
2. Producten: titel, beschrijving, prijs, voorraad, afbeeldingen.
3. Productmetafields: exacte veldnamen en waar ze zichtbaar worden.
4. Bestellen per doos: exacte uitleg voor order minimum/increment/unit fields.
5. Productdetailpagina: serveertemperatuur, decanteren, inhoud, sluiting, allergenen, vinificatie, opslag, producent.
6. Homepage: hero, announcement bar, USP's, categorieblokken, stats, reviews.
7. Pagina's: `page_content` en/of Shopify Pages per route.
8. UI-copy: labels, knoppen, fallbackteksten, lege-staatteksten.
9. Menus: header/footer navigatie en juiste headless storefront links.
10. FAQ en klantenservice.
11. Blog.
12. Verzendinstellingen: website-informatie versus echte checkouttarieven.
13. Orders: bekijken, fulfilment, track & trace.
14. Troubleshooting: wijziging niet zichtbaar, verkeerd veld, lege waarde, cache, verkeerde URL.

### B. Hergebruik de bestaande screenshots

De pagina-renderer staat `img` tags toe via `sanitizeHtml`, dus Shopify-body kan de bestaande `/handleiding/*.webp` screenshots tonen. De handleiding moet ze actief gebruiken bij de stappen waar Carla moet klikken.

### C. Voeg een veldreferentie toe

Er moet een tabel komen:

| Websiteonderdeel | Shopify-locatie | Technische sleutel | Opmerking |
| --- | --- | --- | --- |
| Serveertemperatuur | Product > Metafields | `custom.serving_temperature` | Alleen zichtbaar indien gevuld |
| Decanteren | Product > Metafields | `custom.decant_time`, `custom.decant_note` | Minuten + korte toelichting |
| Bestellen per doos | Product > Metafields | `custom.order_minimum`, `custom.order_increment`, `custom.order_unit_size`, `custom.order_unit_label` | Voor VPL meestal 6 |
| Labels/knoppen | Content > Metaobjects > UI Copy | `ui_copy` key | Niet in frontend wijzigen |

### D. Corrigeer Shopify menu-instellingen

Controleer en corrigeer de Shopify navigation menu items die nu naar `vino-per-lei-2.myshopify.com` wijzen. Voor de headless storefront moeten die naar de juiste publieke routes wijzen, bijvoorbeeld `/`, `/wijnen`, `/contact` of absolute storefront URLs.

### E. Maak de handleiding onderhoudbaar

Omdat alles via Shopify aanpasbaar moet zijn, hoort de handleiding zelf ook in Shopify te blijven. De frontend-route is daarvoor nu goed ingericht. De fout zit niet in de route, maar in de te arme Shopify-inhoud.

## Auditstatus

- Frontend-code aangepast: nee.
- Shopify-clouddata aangepast: ja, `page_content/handleiding` is vervangen door een volledige Shopify-handleiding.
- Live handleiding beoordeeld: ja.
- Oude handleiding teruggevonden: ja.
- Screenshotbibliotheek gecontroleerd: ja.
- Huidige Shopify informatiearchitectuur vergeleken: ja.
- Flowtest na correctie: ja, `npm run shopify:source-flow:test` haalde 79/79 checks.
- Content-audit na correctie: ja, `npm run content:audit` meldt `highRiskStrings: 0`.

## Correctie uitgevoerd op 2026-05-02

De live Shopify-handleiding was te leeg om Carla te helpen. Daarom is `page_content/handleiding` in Shopify direct aangepast. De nieuwe body bevat nu secties voor:

- starten in Shopify;
- producten beheren;
- bestellen per doos van zes;
- productmetafields voor PDP-details;
- labels, knoppen en fallbackteksten via `ui_copy`;
- homepage-metaobjects;
- pagina's en handles;
- FAQ;
- site-instellingen;
- menu's;
- verzending en checkout;
- bestellingen;
- flowtest na elke wijziging;
- waarschuwing om geen frontend-teksten hardcoded te zetten.

Na reload van `/handleiding` zijn deze controlepunten zichtbaar via de storefront:

- `Shopify Handleiding Vino per Lei`
- `custom.order_minimum`
- `custom.order_increment`
- `custom.serving_temperature`
- `custom.producer_story`
- `product.serving_temperature.title`
- `Online Store > Navigation`

## Restpunt: Shopify menuconfiguratie

De Storefront API levert voor `main-menu` nog:

- `Home` -> `https://vino-per-lei-2.myshopify.com/`
- `Catalog` -> `https://vino-per-lei-2.myshopify.com/collections/all`
- `Contact` -> `https://vino-per-lei-2.myshopify.com/pages/contact`

De frontend normaliseert deze nu naar:

- `/`
- `/collections/all`
- `/pages/contact`

Voor deze headless storefront hoort dat te zijn:

- `/`
- `/wijnen`
- `/contact`

Dit moet in Shopify worden aangepast via `Online Store > Navigation > Main menu`. De huidige Admin API-token heeft geen `read_online_store_navigation` / `write_online_store_navigation` scope; de Admin API geeft `Access denied for menus field`. Shopify documenteert voor `menuUpdate` dat de mutation een menu-id en menu-items nodig heeft en de juiste navigation scope vereist.

## Advies

Niet de oude hardcoded component terugzetten. Dat zou opnieuw tegen het projectprincipe ingaan. Wel de oude inhoud gebruiken als bronmateriaal, actualiseren tegen de huidige Shopify-velden, en daarna als HTML-body in Shopify `page_content/handleiding` plaatsen.
