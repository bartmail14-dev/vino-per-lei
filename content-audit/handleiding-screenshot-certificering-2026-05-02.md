# Handleiding screenshot-certificering

Datum: 2026-05-02  
Scope: alle screenshots die live in `/handleiding` worden gebruikt.

## Uitgevoerde correcties

- Oude storefront-screenshots vervangen door actuele screenshots vanaf `http://localhost:3099`:
  - `website-product-detail.webp`
  - `website-faq-items.webp`
- Het oude homepage-screenshot `website-hero.webp` uit de handleiding verwijderd, omdat het actuele screenshot de hero-tekstvelden niet duidelijk genoeg liet zien.
- `admin-bestellingen.webp` uit de handleiding verwijderd, omdat dit geen orderdetail toonde maar opnieuw een leeg orders-overzicht.
- Het orders-screenshot is expliciet gelabeld als voorbeeld zonder klantgegevens.

## Huidige live screenshots

| # | Bestand | Alt-tekst | Status |
|---:|---|---|---|
| 1 | `admin-producten-overzicht.webp` | Producten overzicht in Shopify | Goedgekeurd |
| 2 | `admin-product-bewerken.webp` | Product bewerken in Shopify | Goedgekeurd |
| 3 | `admin-product-prijs-voorraad.webp` | Prijs en voorraad in Shopify | Goedgekeurd |
| 4 | `website-product-detail.webp` | Productpagina controle voor doosbestelling | Nieuw actueel storefront-screenshot |
| 5 | `website-product-detail.webp` | Productdetails op de website | Nieuw actueel storefront-screenshot |
| 6 | `admin-content-metaobjects.webp` | Metaobjects overzicht voor UI copy | Goedgekeurd |
| 7 | `admin-homepage-hero-entry.webp` | Homepage hero entry in Shopify | Goedgekeurd |
| 8 | `admin-announcement-bar-entry.webp` | Announcement bar entry | Goedgekeurd |
| 9 | `admin-usp-item-entry.webp` | USP item entry | Goedgekeurd |
| 10 | `admin-categorie-blok-entry.webp` | Categorie blok entry | Goedgekeurd |
| 11 | `admin-homepage-cijfer-entry.webp` | Homepage cijfer entry | Goedgekeurd |
| 12 | `admin-faq-overzicht.webp` | FAQ items in Shopify | Goedgekeurd |
| 13 | `website-faq-items.webp` | FAQ op website | Nieuw actueel storefront-screenshot |
| 14 | `admin-paginas.webp` | Shopify Pages overzicht | Goedgekeurd |
| 15 | `admin-site-instellingen-entry.webp` | Site settings in Shopify | Goedgekeurd |
| 16 | `admin-verzending.webp` | Shipping and delivery in Shopify | Goedgekeurd |
| 17 | `admin-orders.webp` | Orders overzicht zonder klantgegevens | Goedgekeurd als veilig voorbeeld |

## Technische controle

Alle 17 gebruikte screenshots:

- bestaan in `public/handleiding`;
- zijn echte WebP-bestanden;
- hebben geldige dimensies;
- worden door de live Shopify-handleiding gerefereerd;
- bevatten geen bewust opgenomen klant-PII.

De actuele contact sheet staat op:

`content-audit/handleiding-screenshot-contactsheet-current.png`

## Begrenzing van de garantie

De screenshots kloppen voor de handleiding zoals die op 2026-05-02 is gecontroleerd. Shopify kan de Admin UI later wijzigen. Als Shopify de UI wijzigt, moet de screenshot-certificering opnieuw worden uitgevoerd.

Voor nu zijn alle gebruikte screenshots gecontroleerd of vervangen. Screenshots die niet verdedigbaar waren, zijn uit de handleiding gehaald.

