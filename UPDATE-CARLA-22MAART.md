# Vino per Lei — Voortgangsupdate

**Datum:** 22 maart 2026
**Van:** Bart Visser, Blue Wire Media
**Voor:** Carla Daniels

---

Hoi Carla,

Hierbij een overzicht van alles wat er de afgelopen weken aan je webshop is gebeurd. Er is flink wat werk verzet — van de technische fundering tot aan de teksten en het design.

---

## Wat is er gedaan?

### 1. Webshop werkt nu echt
- De checkout is volledig werkend gekoppeld aan Shopify — klanten worden doorgestuurd naar een veilige betaalpagina
- Productvarianten (flesgrootte, jaargang) worden correct opgehaald en meegegeven
- Nep-reviews en placeholder-badges zijn verwijderd — alles wat je bezoekers zien is echt

### 2. Professionele copy — geen AI-teksten meer
- **Homepage, Over Ons, Cadeaus** en alle knoppen zijn volledig herschreven
- De teksten klinken nu als jij: warm, kennisrijk, zonder cliches
- CTA's zijn specifiek gemaakt ("Vraag advies aan Carla" ipv "Neem contact op")
- De footer heeft een nieuwe, krachtige tagline

### 3. Wijndata op orde
- Nep-proefnotities en template-teksten zijn verwijderd
- Serveertemperaturen zijn nu specifiek per wijntype (niet meer "16-18 graden" voor alles)
- Food pairings zijn productspecifiek gemaakt
- **"Bevat sulfieten"** staat nu bij elk product (EU-verplichting)

### 4. Filters en zoeken werken
- Bezoekers kunnen nu echt filteren op regio, wijntype, druivenras en prijs
- Sorteren werkt: prijs, nieuwste, naam
- Er is een zoekbalk toegevoegd

### 5. Nieuw kleurenschema
- Het design is omgezet naar een stijlvol navy-blauw gradient
- Doorgevoerd op de hele site: navigatie, knoppen, nieuwsbrief, blog, kaart

### 6. Veiligheid en compliance
- KvK-nummer en BTW-nummer staan zichtbaar in de footer
- Beveiligingsheaders zijn aangescherpt (XSS-bescherming op 7 plekken)
- Rate limiting op contact- en nieuwsbriefformulieren (tegen spam)
- Cookie consent banner toegevoegd
- Nieuwsbriefformulier heeft bot-bescherming
- SEO: Google kan nu ook je blog vinden (sitemap uitgebreid)
- JSON-LD structured data voor betere Google-weergave

### 7. Toegankelijkheid verbeterd
- Knoppen zijn groot genoeg voor mobiel gebruik (44px minimum)
- Toetsenbordnavigatie werkt overal
- Screenreaders kunnen de site goed voorlezen
- Contrastverhouding voldoet aan WCAG AA-norm

### 8. Blog verbeteringen
- Afbeeldingen uit Shopify CMS worden nu correct weergegeven
- Deelknoppen zijn mobiel-vriendelijk (onder aan het scherm ipv zwevend)
- Inhoudsopgave bij langere artikelen

---

## Wat staat er nog open?

### Wat ik nog ga doen
- Visuele check op mobiel (375px en 768px)
- Product detail pagina extra doorlopen
- Eventueel instructies schrijven voor het plaatsen van blogartikelen

### Wat jij nog moet doen

| Actie | Waarom | Hoe |
|-------|--------|-----|
| **Shopify token vernieuwen** | Veiligheid — het oude token is zichtbaar geweest | Shopify Admin > Settings > Apps > custom app |
| **Mailgun instellen** | Voor werkende nieuwsbrief en contactformulier e-mails | Ik help je hiermee |
| **Betalingen activeren** | iDEAL, creditcard, Bancontact | Shopify Admin > Settings > Payments |
| **DNS instellen** | vinoperlei.nl koppelen aan de site | CNAME naar Vercel — ik help je |
| **Telefoonnummer** | Staat nog als placeholder | Invullen in Shopify CMS |
| **Blog foto's** | Hero-afbeeldingen per artikel | Uploaden in Shopify (16:9, min 1200px breed) |

---

## De site in cijfers

| Onderdeel | Status |
|-----------|--------|
| Build | 0 errors, 0 warnings |
| Lint | 0 errors, 0 warnings |
| Beveiliging | CSP, HSTS, rate limiting, XSS-bescherming |
| SEO | Sitemap, robots.txt, OG images, JSON-LD |
| Toegankelijkheid | WCAG AA compliant |
| Performance | Caching op alle Shopify data |

---

## Hoe verder?

Zodra jij de bovenstaande punten hebt afgerond (token, betalingen, DNS), kunnen we live gaan. Ik plan graag een moment om samen de laatste stappen door te lopen.

Heb je vragen? Stuur me gerust een berichtje.

Groet,
Bart
