# Handleiding leesbaarheidscontrole

Datum: 2026-05-02  
Scope: alle zichtbare onderdelen van `/handleiding` na herschrijven van Shopify `page_content/handleiding`.

## Controlecriteria

Per sectie is gecontroleerd:

- Staat er snel duidelijk wat Carla moet doen?
- Staat er niet te veel tekst tussen screenshots?
- Heeft de sectie een screenshot, tabel of ander concreet actieanker?
- Staat bij screenshots duidelijk wat Carla ziet?
- Staat na de uitleg een controlepunt of veldtabel?
- Zijn de cruciale Shopify-velden nog aanwezig?

## Resultaat

Alle 16 secties zijn gecontroleerd. Er zijn geen secties meer gevonden met:

- alinea's langer dan 240 tekens;
- meer dan 420 tekens tekst voor het eerste screenshot of de eerste tabel;
- ontbrekend actieanker;
- onduidelijke lange tekstblokken tussen afbeeldingen.

## Sectiematrix

| # | Sectie | Screenshots | Tabellen | Oordeel |
|---|---|---:|---:|---|
| 1 | Begin hier | 0 | 1 | Goed: routekaart, geen screenshot nodig |
| 2 | Producten vinden | 1 | 1 | Goed |
| 3 | Basisgegevens van een wijn aanpassen | 1 | 1 | Goed |
| 4 | Prijs en voorraad controleren | 1 | 1 | Goed |
| 5 | Bestellen per doos van 6 instellen | 1 | 1 | Goed |
| 6 | Productdetails aanpassen | 1 | 1 | Goed, de Carla-vraag staat expliciet benoemd |
| 7 | Labels en fallbackteksten aanpassen | 1 | 1 | Goed |
| 8 | Homepage hero aanpassen | 2 | 1 | Goed: admin screenshot + websitecontrole |
| 9 | Homepageblokken aanpassen | 4 | 1 | Goed, maar dit is de dichtste screenshotsectie |
| 10 | FAQ aanpassen | 2 | 1 | Goed |
| 11 | Pagina's aanpassen | 1 | 1 | Goed |
| 12 | Site-instellingen aanpassen | 1 | 1 | Goed |
| 13 | Menu's aanpassen | 0 | 1 | Inhoudelijk goed; actueel screenshot ontbreekt nog |
| 14 | Verzending controleren | 1 | 1 | Goed |
| 15 | Bestellingen bekijken | 2 | 1 | Goed |
| 16 | Altijd na afloop controleren | 0 | 1 | Goed: eindcheck, geen screenshot nodig |

## Belangrijkste aandachtspunten

### Menu's aanpassen

De sectie is tekstueel duidelijk en bevat de juiste links:

- `/`
- `/wijnen`
- `/contact`
- `/klantenservice/faq`

Maar er is nog geen specifiek screenshot van Shopify Navigation beschikbaar in `public/handleiding`. Zodra Shopify Navigation visueel geopend kan worden, is dit de enige sectie waar een extra screenshot nuttig is.

### Homepageblokken aanpassen

Deze sectie heeft vier screenshots achter elkaar. Dat is acceptabel omdat elk screenshot een ander metaobject toont, maar dit is het drukste onderdeel. De begeleidende tekst is kort gehouden en de tabel erna bundelt de betekenis.

## Cruciale velden opnieuw gecontroleerd

De handleiding bevat nog steeds:

- `custom.order_minimum`
- `custom.order_increment`
- `custom.order_unit_size`
- `custom.order_unit_label`
- `custom.price_unit_label`
- `custom.alcohol_percentage`
- `custom.bottle_volume`
- `custom.closure`
- `custom.allergens`
- `custom.serving_temperature`
- `custom.decant_time`
- `custom.decant_note`
- `custom.vinification`
- `custom.storage_advice`
- `custom.producer_story`
- `product.alcohol_percentage.see_label`

## Conclusie

De tekst tussen de afbeeldingen is nu over alle onderdelen heen goed te volgen. De handleiding is geen lange teksthandleiding meer, maar een praktische routekaart met korte instructies, screenshots en veldtabellen.

Nog niet perfect: een actueel screenshot van Shopify Navigation ontbreekt nog. De inhoud van die sectie is wel correct.

