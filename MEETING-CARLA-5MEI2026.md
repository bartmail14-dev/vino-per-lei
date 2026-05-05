# Meeting Notities — Carla Daniels — 5 mei 2026

> Intern document, NIET publiceren. Feedback en wensen vanuit klantgesprek.

---

## 1. Productbeheer in Shopify (Carla kan te weinig zelf aanpassen)

### Probleem: Geen controle over productdetails
- **Decantheer- en serveertemperatuur** kan Carla NIET zelf wijzigen per wijn
- **Alle productdetails** (vinificatie, opslag, producent, etc.) zijn nergens bewerkbaar per Shopify-product
- **Recioto specifiek**: kan helemaal NIKS aanvullen aan detailinformatie
- **Actie**: Metafields per product beschikbaar maken in Shopify Admin zodat Carla alles zelf kan invullen

### Favorieten op homepage
- Carla wil **zelf bepalen welke wijnen op de homepage staan** (favorieten/uitgelicht)
- **Actie**: Selectiemechanisme bouwen (bijv. tag "featured" of metafield boolean per product)

### Verkoop per doos of per fles
- Carla wil **per wijn zelf kunnen kiezen** of die per doos of per fles verkocht wordt
- **Actie**: Metafield of variant-optie toevoegen per product

### Sterretjes/rating per product
- Carla wil **zelf de sterren-rating per product kunnen aanpassen**
- **Actie**: Metafield (nummer) per product voor rating

---

## 2. Homepage aanpassingen

### Counter/statistieken (DYNAMISCH maken)
- Moet dynamisch tonen op basis van echte productdata:
  - Aantal **geselecteerde wijnen** (totaal)
  - Aantal **gebieden**
  - Aantal **rode** wijnen
  - Aantal **witte** wijnen
  - Aantal **mousserende** wijnen
- **Actie**: Stats ophalen uit Shopify productdata ipv handmatige metaobjects

### USP bar (vlak onder de hero)
- Moet worden: **"Experte selectie"**, **"Veilig betalen"**, **"Bezorging door heel Nederland"**
- **Actie**: USP items updaten in Shopify CMS

### Video banner
- Carla wil andere beelden: **lange Italiaanse tafels, druiven plukken en persen** (ambachtelijk)
- **Actie**: Nieuw videomateriaal nodig van Carla, daarna vervangen

---

## 3. Footer aanpassingen

- Boven ieder rijtje staat nu "footer" als koptekst — **noemers normaal maken**
- **Tijdstippen voor mailen verwijderen** — "mailen kan altijd"
- Footer in de **juiste omgeving zetten** (layout/structuur opruimen)
- **Actie**: Footer headings + content updaten in CMS of code

---

## 4. Cadeaus DEFINITIEF verwijderen

- **Cadeauverpakking/cadeau-opties moeten OVERAL uit de site**
- Niet alleen verbergen maar volledig verwijderen uit code en CMS
- **Actie**: Alle cadeau-gerelateerde code, UI-elementen en CMS entries verwijderen

---

## 5. Contactpagina en contactformulier

### Adres verwijderen
- **Adres overal verwijderen** behalve op de pagina Algemene Voorwaarden
- **Actie**: Adres weghalen uit contactpagina, footer, en overige plekken

### Contactformulier moet werken
- Formulier stuurt momenteel NIET (Mailgun placeholder key)
- **Actie**: Mailgun configureren OF alternatief (Resend/SMTP) + testen

---

## 6. e-Boekhouden koppeling

- Koppeling opzetten met e-Boekhouden
- **Facturen en creditfacturen** ook testen
- **Actie**: Integratie onderzoeken + implementeren + test met proeforders

---

## 7. Productcards uitlijning

- **Knoppen in productcards** moeten netjes uitgelijnd zijn in het overzicht
- Op **alle viewports** consistent
- **Actie**: CSS fix — cards equal height, buttons naar bottom pinnen

---

## Samenvatting prioriteiten

| # | Taak | Blokkerend? | Wacht op |
|---|------|-------------|----------|
| 1 | Productdetails bewerkbaar maken (metafields) | Ja — Carla kan niks aanpassen | Dev |
| 2 | Contactformulier laten werken (Mailgun) | Ja — BLOCKER livegang | Dev |
| 3 | Cadeau-opties volledig verwijderen | Nee | Dev |
| 4 | Footer opschonen (headers, tijden) | Nee | Dev |
| 5 | Homepage counter dynamisch maken | Nee | Dev |
| 6 | USP bar teksten updaten | Nee | Dev |
| 7 | Favorieten/uitgelicht op homepage | Nee | Dev |
| 8 | Per doos/fles keuze per product | Nee | Dev |
| 9 | Sterretjes per product bewerkbaar | Nee | Dev |
| 10 | Adres verwijderen (behalve AV) | Nee | Dev |
| 11 | Productcards knoppen uitlijning | Nee | Dev |
| 12 | Video banner nieuwe beelden | Nee | Carla (videomateriaal) |
| 13 | e-Boekhouden koppeling + factuurtest | Nee | Dev + Carla (inloggegevens) |
| 14 | Shopify Payments activeren | Ja — BLOCKER livegang | Carla (KvK, IBAN, ID) |
