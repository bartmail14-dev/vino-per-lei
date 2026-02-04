# VINO PER LEI
## Complete UI/UX Masterplan

**Versie:** 1.0
**Datum:** 3 februari 2026
**Status:** Draft voor Review

---

# DEEL 1: STRATEGIE & RESEARCH

---

## 1.1 PROJECT SCOPE

### Business Context
Vino per Lei is een nieuwe online wijnwinkel die zich richt op een specifieke niche: vrouwen die van kwalitatieve wijn houden en wijn vaak kopen als cadeau. De webshop moet concurreren met gevestigde spelers (Wijnvoordeel, Gall & Gall) maar zich onderscheiden door:

1. **Curated selectie** - Niet 10.000 wijnen, maar een zorgvuldig samengestelde collectie
2. **Persoonlijke benadering** - Alsof een vriendin je adviseert
3. **Cadeau-focus** - Eerste klas geschenkverpakking en service
4. **Premium uitstraling** - Zonder pretentieus te zijn

### Project Doelstellingen

| Doelstelling | KPI | Target |
|--------------|-----|--------|
| Conversie | Conversion rate | >2.5% |
| Engagement | Time on site | >3 min |
| Retentie | Return visitors | >30% |
| Tevredenheid | NPS score | >50 |
| Gemiddelde order | AOV | >€45 |

### Technische Scope

**In scope:**
- Volledige e-commerce website (Next.js + Shopify backend)
- Responsive design (mobile-first)
- Age verification
- Product filtering & zoeken
- Winkelwagen & checkout (via Shopify)
- Nieuwsbrief integratie
- Basic SEO optimalisatie

**Out of scope (fase 1):**
- Membership/loyalty programma
- Wijn abonnement box
- Account/login systeem (komt via Shopify)
- Blog/content sectie
- Multi-language
- 3D product views (later toe te voegen)

---

## 1.2 DOELGROEP ANALYSE

### Primaire Persona: "Sophie"

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  SOPHIE VAN DEN BERG                                           │
│  "De Bewuste Genieter"                                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  DEMOGRAFISCH                                                   │
│  • Leeftijd: 34 jaar                                           │
│  • Woonplaats: Randstad (Utrecht)                              │
│  • Opleiding: HBO/WO                                           │
│  • Inkomen: €45.000 - €65.000                                  │
│  • Relatie: Samenwonend, geen kinderen                         │
│  • Beroep: Marketing manager                                   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  GEDRAG & LIFESTYLE                                            │
│  • Koopt wijn 2-3x per maand                                   │
│  • Budget: €10-25 per fles                                     │
│  • Koopt vaak wijn als cadeau (verjaardagen, etentjes)        │
│  • Wil graag meer leren over wijn, maar geen expert worden    │
│  • Waardeert kwaliteit boven kwantiteit                        │
│  • Shopt voornamelijk online (70%) vs fysieke winkel (30%)    │
│  • Gebruikt Instagram & Pinterest voor inspiratie              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  FRUSTRATIES (PAIN POINTS)                                     │
│  • "Er is zoveel keuze, ik weet niet waar te beginnen"        │
│  • "Wijnbeschrijvingen zijn vaak te technisch"                 │
│  • "Ik wil niet dom overkomen bij de wijnwinkel"              │
│  • "Online wijn kopen voelt als gokken"                        │
│  • "Cadeauverpakking is vaak lelijk of te duur"               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  BEHOEFTEN & WENSEN                                            │
│  • Begrijpelijke uitleg zonder jargon                          │
│  • Vertrouwen dat de wijn lekker is                           │
│  • Mooie presentatie (ook als cadeau)                          │
│  • Gemakkelijk kunnen filteren op smaak                        │
│  • Inspiratie voor food pairing                                │
│  • Snelle levering                                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  QUOTE                                                         │
│  "Ik hoef geen sommelier te worden, ik wil gewoon             │
│   een lekkere fles wijn kunnen uitkiezen zonder               │
│   me onzeker te voelen."                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Secundaire Persona: "Linda"

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  LINDA JANSEN                                                  │
│  "De Cadeau-Gever"                                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  DEMOGRAFISCH                                                   │
│  • Leeftijd: 52 jaar                                           │
│  • Woonplaats: Brabant                                         │
│  • Gezin: Getrouwd, 2 volwassen kinderen                       │
│  • Beroep: Office manager                                      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  GEDRAG                                                        │
│  • Koopt wijn vooral als cadeau (80% van aankopen)            │
│  • Zoekt "iets speciaals" voor verjaardagen, Kerst            │
│  • Budget: €20-40 per cadeau                                   │
│  • Waardeert service en persoonlijk contact                    │
│  • Minder tech-savvy, moet intuïtief werken                   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  FRUSTRATIES                                                   │
│  • "Websites zijn vaak te ingewikkeld"                         │
│  • "Ik wil zeker weten dat het mooi verpakt aankomt"          │
│  • "Ik heb geen idee welke wijn ik moet kiezen"               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  BEHOEFTEN                                                     │
│  • Duidelijke cadeau-sectie                                    │
│  • Foto's van de verpakking                                    │
│  • Mogelijkheid voor persoonlijk kaartje                       │
│  • Telefonische klantenservice                                 │
│  • Levering op specifieke datum                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tertiaire Persona: "Mark"

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  MARK DE VRIES                                                 │
│  "De Partner die een Cadeau Zoekt"                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  DEMOGRAFISCH                                                   │
│  • Leeftijd: 38 jaar                                           │
│  • Relatie: Getrouwd                                           │
│  • Beroep: IT consultant                                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  GEDRAG                                                        │
│  • Koopt wijn als cadeau voor partner/moeder/schoonmoeder     │
│  • Weet weinig van wijn, wil snel beslissen                    │
│  • Budget: €25-50                                              │
│  • Zoekt "premium" uitstraling                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────│
│                                                                 │
│  BEHOEFTEN                                                     │
│  • "Veilige keuze" suggesties                                  │
│  • Bestsellers / populaire keuzes                              │
│  • Snelle checkout                                             │
│  • Geen gedoe, gewoon werken                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.3 COMPETITIEVE ANALYSE

### Directe Concurrenten

| Aspect | Wijnvoordeel | Gall & Gall | Vino per Lei (doel) |
|--------|--------------|-------------|---------------------|
| **Positionering** | Volume, kortingen | Breed assortiment | Premium selectie |
| **Prijsniveau** | Laag-midden | Midden | Midden-hoog |
| **Assortiment** | 2000+ wijnen | 1500+ wijnen | 100-200 wijnen |
| **USP** | Altijd korting | Overal verkrijgbaar | Persoonlijk, cadeau |
| **Doelgroep** | Prijsbewust | Algemeen | Kwaliteitsbewuste vrouw |
| **Tone of voice** | Commercieel | Neutraal | Warm, persoonlijk |
| **Design** | Functioneel/druk | Standaard | Premium/elegant |

### Inspiratie Concurrenten (Internationaal)

| Website | Wat we overnemen | Wat we vermijden |
|---------|------------------|------------------|
| **Taylors Wines** | Member pricing display, smaakprofiel, heritage feel | Te corporate |
| **Privios** | Age gate design, donker thema hero, bottle presentatie | Te minimalistisch voor conversie |
| **Wijnvoordeel** | Filter functionaliteit, trust badges, product info | Te druk, te veel korting-focus |

### Onderscheidende Factoren Vino per Lei

1. **Curated over Chaos** - Minder is meer, elke wijn is geselecteerd
2. **Begrijpelijk over Jargon** - Geen pretentieuze beschrijvingen
3. **Cadeau-First** - Verpakking en service zijn geen afterthought
4. **Vrouwelijke Stem** - Niet de typische mannelijke wijn-expert toon
5. **Visueel Premium** - Maar niet ontoegankelijk

---

## 1.4 CONTENT STRATEGIE

### Tone of Voice

**Kenmerken:**
- Warm maar niet té casual
- Deskundig maar niet pretentieus
- Behulpzaam zonder betuttelend te zijn
- Enthousiast maar niet schreeuwerig

**Voorbeelden:**

| ❌ Niet zo | ✅ Wel zo |
|-----------|----------|
| "Deze exquise Grand Cru met complexe tertiaire aroma's..." | "Een rijk, vol karakter met tonen van zwarte kers en een vleugje vanille" |
| "MEGA KORTING! NU 50% OFF!!!" | "Nu €18 (was €24) - Je bespaart €6" |
| "Perfect bij uw gastronomische creaties" | "Heerlijk bij pasta, gegrild vlees of gewoon een gezellig avondje" |
| "Koop nu!" | "Voeg toe aan winkelmand" |

### Content Hiërarchie per Pagina

**Homepage:**
1. Waardepropositie (wat maakt ons uniek)
2. Vertrouwen opbouwen (USPs)
3. Inspireren (uitgelichte wijnen)
4. Cadeau mogelijkheid tonen
5. Nieuwsbrief (blijf verbonden)

**Product Listing:**
1. Oriëntatie (waar ben ik, hoeveel opties)
2. Filteren (verfijn je keuze)
3. Vergelijken (productkaarten)
4. Actie (toevoegen aan winkelmand)

**Product Detail:**
1. Bevestiging (dit is wat je zoekt)
2. Overtuiging (waarom deze wijn)
3. Informatie (alle details)
4. Actie (kopen)
5. Alternatieven (andere opties)

### Productbeschrijving Template

```
[WIJN NAAM]
[JAAR] • [REGIO], [LAND]

[1-2 zinnen die de wijn "verkopen" - emotioneel, niet technisch]

SMAAKT NAAR
[3-4 smaaknotities in begrijpelijke taal]

LEKKER BIJ
[2-3 concrete food pairing suggesties]

DETAILS
Druivenras: [druif]
Alcohol: [%]
Serveertemperatuur: [temp]
Bewaaradvies: [advies]
```

**Voorbeeld:**

```
CHÂTEAU MARGAUX
2019 • Bordeaux, Frankrijk

Een elegante dame van een wijn. Rijk en vol, maar met de gratie
van een klassieke Bordeaux. Perfect voor dat speciale diner.

SMAAKT NAAR
Zwarte kers • Cederhout • Een vleugje vanille • Zijdezachte afdronk

LEKKER BIJ
Biefstuk • Lamsbout • Gerijpte kaas

DETAILS
Druivenras: Cabernet Sauvignon, Merlot
Alcohol: 13.5%
Serveertemperatuur: 16-18°C
Bewaaradvies: Kan nog 10-15 jaar rijpen
```

---

# DEEL 2: INFORMATION ARCHITECTURE

---

## 2.1 SITEMAP

```
VINO PER LEI
│
├── Homepage
│
├── Wijnen
│   ├── Alle Wijnen
│   ├── Rode Wijn
│   │   ├── [Filter: Land]
│   │   ├── [Filter: Druivenras]
│   │   ├── [Filter: Smaak]
│   │   └── [Filter: Prijs]
│   ├── Witte Wijn
│   │   └── [zelfde filters]
│   ├── Rosé
│   │   └── [zelfde filters]
│   ├── Mousserende Wijn
│   │   └── [zelfde filters]
│   └── [Product Detail Pagina]
│       ├── Beschrijving Tab
│       ├── Proefnotities Tab
│       └── Combineer Met Tab
│
├── Cadeaus
│   ├── Cadeau Collectie
│   ├── Geschenksets
│   └── Cadeaubon
│
├── Over Ons
│   ├── Ons Verhaal
│   ├── Onze Selectie
│   └── Contact
│
├── Klantenservice
│   ├── Verzending & Levering
│   ├── Retourneren
│   ├── Veelgestelde Vragen
│   └── Contact
│
├── [Winkelwagen] (slide-out)
│
├── [Checkout] (Shopify hosted)
│
└── [Footer Pages]
    ├── Algemene Voorwaarden
    ├── Privacy Policy
    └── Cookie Policy
```

## 2.2 NAVIGATIE STRUCTUUR

### Primaire Navigatie (Header)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [LOGO]     Wijnen ▼    Cadeaus    Over Ons    [🔍] [👤] [🛒3] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ MEGA MENU - WIJNEN                                              │
│                                                                 │
│  WIJNTYPE          LAND              SMAAK           POPULAIR  │
│  ─────────         ────              ─────           ────────  │
│  Rode Wijn         Frankrijk         Licht & Fris   Bestsellers│
│  Witte Wijn        Italië            Fruitig        Nieuw      │
│  Rosé              Spanje            Vol & Rijk     Aanbiedingen│
│  Mousserende       Portugal          Zoet           │
│                    Chili                            │
│                    Argentinië        PRIJS          │
│                                      ─────          │
│  ┌─────────────────────────────┐    Tot €10        │
│  │  [PROMOTIONAL IMAGE]        │    €10 - €20      │
│  │  "Ontdek onze rosé selectie │    €20 - €30      │
│  │   voor de zomer"            │    €30+           │
│  │  [Bekijk Rosé →]            │                   │
│  └─────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Navigatie

```
┌─────────────────────────────────────────┐
│  [☰]    [LOGO]              [🔍] [🛒3] │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│                                    [X]  │
│                                         │
│  Wijnen                            [>]  │
│  ───────────────────────────────────── │
│  Cadeaus                           [>]  │
│  ───────────────────────────────────── │
│  Over Ons                          [>]  │
│  ───────────────────────────────────── │
│  Klantenservice                    [>]  │
│  ───────────────────────────────────── │
│                                         │
│                                         │
│  [Account]                              │
│                                         │
│                                         │
│  ─────────────────────────────────────  │
│  📞 Vragen? Bel 020-123 4567           │
│  ✉️ info@vinoperlei.nl                 │
│                                         │
└─────────────────────────────────────────┘
```

### Breadcrumb Logica

```
Homepage
└── Wijnen
    └── Rode Wijn
        └── Château Margaux 2019

Weergave: Home > Rode Wijn > Château Margaux 2019
          ↑      ↑           ↑
       Klikbaar Klikbaar    Niet klikbaar (huidige pagina)
```

---

## 2.3 URL STRUCTUUR

```
/                                    Homepage
/wijnen                              Alle wijnen
/wijnen/rood                         Rode wijnen
/wijnen/wit                          Witte wijnen
/wijnen/rose                         Rosé wijnen
/wijnen/mousserende                  Mousserende wijnen
/wijnen/[product-slug]               Product detail
/cadeaus                             Cadeau overzicht
/cadeaus/geschenksets                Geschenksets
/cadeaus/cadeaubon                   Cadeaubon
/over-ons                            Over ons
/klantenservice                      Klantenservice hub
/klantenservice/verzending           Verzending info
/klantenservice/retourneren          Retour info
/klantenservice/faq                  FAQ
/contact                             Contact pagina
/voorwaarden                         Algemene voorwaarden
/privacy                             Privacy policy
```

---

# DEEL 3: USER FLOWS & JOURNEYS

---

## 3.1 PRIMAIRE USER FLOW: EERSTE AANKOOP

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  TRIGGER: Sophie zoekt een lekkere rode wijn voor een etentje  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 1: LANDING                                                 │
│                                                                 │
│ • Komt binnen via Google "rode wijn kopen online"               │
│ • Of via Instagram advertentie                                  │
│ • Ziet Age Gate                                                 │
│                                                                 │
│ EMOTIE: Nieuwsgierig                                           │
│ ACTIE: Bevestigt leeftijd                                      │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Age gate laadt binnen 1 seconde                              │
│ □ Duidelijke vraag en buttons                                  │
│ □ Geen verwarring over wat te doen                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 2: HOMEPAGE / LANDING                                     │
│                                                                 │
│ • Eerste indruk van het merk                                   │
│ • Ziet hero met waardepropositie                               │
│ • Scant USP bar (gratis verzending, etc.)                      │
│ • Ziet uitgelichte wijnen                                      │
│                                                                 │
│ EMOTIE: "Dit ziet er mooi en betrouwbaar uit"                  │
│ ACTIE: Klikt op "Rode Wijn" of "Bekijk alles"                  │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Waardepropositie is binnen 5 sec duidelijk                   │
│ □ Navigatie naar wijnen is obvious                             │
│ □ Geen overweldigende hoeveelheid informatie                   │
│ □ Premium maar toegankelijke uitstraling                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 3: PRODUCT LISTING (Rode Wijn)                            │
│                                                                 │
│ • Ziet overzicht van rode wijnen                               │
│ • Oriënteert zich: hoeveel opties, prijsrange                  │
│ • Gebruikt eventueel filters (prijs, land)                     │
│ • Scant productkaarten                                         │
│                                                                 │
│ EMOTIE: "Overzichtelijk, niet te veel keuze"                   │
│ ACTIE: Klikt op een wijn die aanspreekt                        │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Aantal resultaten is zichtbaar                               │
│ □ Filters zijn intuïtief                                       │
│ □ Productkaarten geven genoeg info om te kiezen                │
│ □ Prijzen zijn duidelijk zichtbaar                             │
│ □ Pagina laadt snel, ook met afbeeldingen                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 4: PRODUCT DETAIL                                         │
│                                                                 │
│ • Bekijkt productfoto's                                        │
│ • Leest beschrijving                                           │
│ • Checkt smaakprofiel                                          │
│ • Bekijkt prijs                                                │
│ • Leest "lekker bij" suggesties                                │
│                                                                 │
│ EMOTIE: "Dit klinkt precies als wat ik zoek"                   │
│ BARRIÈRE: "Is deze wijn echt lekker?"                          │
│                                                                 │
│ OVERTUIGING NODIG:                                              │
│ • Proefgarantie zichtbaar maken                                │
│ • Reviews/ratings indien beschikbaar                           │
│ • Trust badges                                                  │
│                                                                 │
│ ACTIE: Klikt "Toevoegen aan winkelmand"                        │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Alle info beschikbaar zonder te scrollen (above the fold)    │
│ □ Smaakprofiel is begrijpelijk                                 │
│ □ Proefgarantie is zichtbaar                                   │
│ □ Add to cart button is prominent                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 5: CART SLIDE-OUT                                         │
│                                                                 │
│ • Cart opent van rechts                                        │
│ • Ziet toegevoegd product                                      │
│ • Ziet subtotaal en verzendkosten                              │
│ • Optie: verder winkelen of afrekenen                          │
│                                                                 │
│ EMOTIE: "Mooi, dat ging makkelijk"                             │
│ BARRIÈRE: "Misschien nog even rondkijken?"                     │
│                                                                 │
│ ACTIE A: Klikt "Verder winkelen" → terug naar listing          │
│ ACTIE B: Klikt "Afrekenen" → checkout                          │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Cart opent smooth (animatie)                                 │
│ □ Product info is correct                                      │
│ □ Totaal is duidelijk                                          │
│ □ Beide opties (verder/afrekenen) zijn duidelijk               │
│ □ Gratis verzending drempel is zichtbaar                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 6: CHECKOUT (Shopify)                                     │
│                                                                 │
│ • Vult contactgegevens in                                      │
│ • Kiest verzendmethode                                         │
│ • Kiest betaalmethode                                          │
│ • Bevestigt bestelling                                         │
│                                                                 │
│ EMOTIE: "Standaard checkout, vertrouwd"                        │
│ BARRIÈRE: "Moet ik een account aanmaken?"                      │
│                                                                 │
│ BELANGRIJK:                                                     │
│ • Guest checkout mogelijk                                       │
│ • iDEAL prominent                                               │
│ • Trust badges zichtbaar                                        │
│                                                                 │
│ ACTIE: Rondt betaling af                                       │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Checkout laadt snel                                          │
│ □ Geen verplicht account                                       │
│ □ Bekende betaalmethodes                                       │
│ □ Totaalbedrag klopt                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 7: BEVESTIGING                                            │
│                                                                 │
│ • Ziet bevestigingspagina                                      │
│ • Ontvangt email bevestiging                                   │
│                                                                 │
│ EMOTIE: "Gelukt! Nu afwachten"                                 │
│                                                                 │
│ OPVOLGING:                                                      │
│ • Track & trace email                                          │
│ • Levering binnen 1-2 dagen                                    │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Duidelijke bevestiging op scherm                             │
│ □ Email binnen 5 minuten                                       │
│ □ Ordernummer zichtbaar                                        │
│ □ Verwachte leverdatum                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.2 SECUNDAIRE USER FLOW: CADEAU KOPEN

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  TRIGGER: Linda zoekt een verjaardagscadeau voor haar zus      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 1-2: LANDING & HOMEPAGE                                   │
│                                                                 │
│ • Zelfde als primaire flow                                     │
│ • MAAR: moet duidelijk "Cadeaus" sectie zien                   │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Cadeau optie is zichtbaar in navigatie                       │
│ □ Cadeau banner op homepage                                    │
│ □ "Perfect als cadeau" messaging                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 3: CADEAU PAGINA                                          │
│                                                                 │
│ • Ziet cadeau-specifieke collectie                             │
│ • Geschenksets prominent                                        │
│ • Prijsranges voor verschillende budgetten                      │
│ • Foto's van verpakking                                         │
│                                                                 │
│ EMOTIE: "Oh, dit ziet er mooi uit als cadeau"                  │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Verpakking is zichtbaar                                      │
│ □ Verschillende prijspunten (€20, €30, €50)                    │
│ □ Duidelijk wat je krijgt                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 4: PRODUCT DETAIL (Cadeau variant)                        │
│                                                                 │
│ • Zelfde als normale PDP                                       │
│ • PLUS: Geschenkverpakking optie                               │
│ • PLUS: Persoonlijk kaartje optie                              │
│ • PLUS: Foto van hoe het er verpakt uitziet                    │
│                                                                 │
│ EXTRA OPTIES:                                                   │
│ ☑ Geschenkverpakking (+€3,50)                                 │
│ ☑ Persoonlijk kaartje (gratis)                                │
│   [Tekstinvoer voor boodschap]                                  │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ Geschenkopties zijn duidelijk                                │
│ □ Meerprijs is transparant                                     │
│ □ Preview van eindresultaat                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAP 5: CHECKOUT (Cadeau variant)                              │
│                                                                 │
│ • Zelfde checkout                                              │
│ • PLUS: Apart bezorgadres mogelijk                             │
│ • PLUS: Leverdatum kiezen                                      │
│ • PLUS: Bevestiging dat kaartje is toegevoegd                  │
│                                                                 │
│ SUCCESS CRITERIA:                                               │
│ □ "Versturen als cadeau" optie                                 │
│ □ Ander bezorgadres mogelijk                                   │
│ □ Geen prijsinfo op pakbon                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.3 ERROR FLOWS & EDGE CASES

### Age Gate - "Nee" Path

```
User klikt "Nee, ik ben jonger dan 18"
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Sorry, je moet 18 jaar of ouder zijn                          │
│  om deze website te bezoeken.                                   │
│                                                                 │
│  Meer informatie over verantwoord drinken:                      │
│  [NIX18.nl]                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Product Niet op Voorraad

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [PRODUCT CARD]                                                │
│  ┌─────────────────┐                                           │
│  │                 │                                           │
│  │    [DIMMED      │                                           │
│  │     IMAGE]      │                                           │
│  │                 │                                           │
│  └─────────────────┘                                           │
│                                                                 │
│  [BADGE: UITVERKOCHT]                                          │
│                                                                 │
│  Château Margaux                                               │
│  2019                                                          │
│                                                                 │
│  €24,99                                                        │
│                                                                 │
│  [═══════════════════════════]                                 │
│  [    MAIL MIJ BIJ VOORRAAD  ]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Filter Geen Resultaten

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Geen wijnen gevonden                                          │
│                                                                 │
│  Je filters:                                                   │
│  • Land: Nieuw-Zeeland                                         │
│  • Prijs: Tot €10                                              │
│                                                                 │
│  Probeer:                                                      │
│  • [Filters wissen]                                            │
│  • [Alle rode wijnen bekijken]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cart is Leeg

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Je winkelmand is leeg                                         │
│                                                                 │
│  [🍷]                                                          │
│                                                                 │
│  Ontdek onze wijnen en voeg je favorieten toe.                 │
│                                                                 │
│  [BEKIJK ONZE WIJNEN]                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# DEEL 4: WIREFRAMES & LAYOUTS

---

## 4.1 RESPONSIVE GRID SYSTEEM

### Breakpoints

```
MOBILE (xs):    0 - 639px      → 4 kolommen, 16px gutter
TABLET (sm):    640 - 767px    → 8 kolommen, 24px gutter
TABLET (md):    768 - 1023px   → 8 kolommen, 24px gutter
DESKTOP (lg):   1024 - 1279px  → 12 kolommen, 24px gutter
LARGE (xl):     1280 - 1535px  → 12 kolommen, 32px gutter
X-LARGE (2xl):  1536px+        → 12 kolommen, 32px gutter

MAX CONTENT WIDTH: 1280px
CONTAINER PADDING: 16px (mobile) / 24px (tablet) / 32px (desktop)
```

### Grid Voorbeelden

```
MOBILE (4 kolommen)
┌────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │
├────┴────┴────┴────┤
│    Full width     │  ← Product card
├───────────────────┤
│    Full width     │  ← Product card
└───────────────────┘

TABLET (8 kolommen)
┌────┬────┬────┬────┬────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │
├────┴────┴────┴────┼────┴────┴────┴────┤
│   Product card    │   Product card    │  ← 2 per rij
├───────────────────┼───────────────────┤
│   Product card    │   Product card    │
└───────────────────┴───────────────────┘

DESKTOP (12 kolommen)
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │
├────┴────┴────┼────┴────┴────┴────┴────┴────┴────┴────┴────┤
│   Filter     │              Product grid                  │
│   Sidebar    │  ┌────────┬────────┬────────┬────────┐    │
│   (3 col)    │  │ Card   │ Card   │ Card   │ Card   │    │
│              │  └────────┴────────┴────────┴────────┘    │
└──────────────┴────────────────────────────────────────────┘
```

---

## 4.2 HOMEPAGE WIREFRAME (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│ [ANNOUNCEMENT BAR - 40px height]                                          [X]  │
│ "Welkom! Gebruik code WELKOM10 voor 10% korting op je eerste bestelling"       │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [HEADER - 80px height]                                                         │
│                                                                                 │
│  ┌──────────┐                                                    ┌────────────┐│
│  │  LOGO    │    Wijnen ▼    Cadeaus    Over Ons               │ 🔍  👤  🛒 ││
│  └──────────┘                                                    └────────────┘│
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [HERO SECTION - 600px height]                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────────┐│
│ │                                                                             ││
│ │                    [BACKGROUND: Video of lifestyle image]                   ││
│ │                                                                             ││
│ │                                                                             ││
│ │                         "Wijn met karakter,                                 ││
│ │                          speciaal voor jou"                                 ││
│ │                                                                             ││
│ │                    [══════════════════════════]                             ││
│ │                    [   ONTDEK ONZE WIJNEN    ]                             ││
│ │                                                                             ││
│ │                              ↓                                              ││
│ │                                                                             ││
│ └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [USP BAR - 60px height]                                                        │
│                                                                                 │
│     🚚 Gratis verzending        ↩️ Gratis retour         ⭐ 100% Proefgarantie │
│        vanaf €35                   binnen 14 dagen          Niet lekker? Geld terug│
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [CATEGORY QUICK LINKS - 120px height]                                          │
│                                                                                 │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│   │   🍷      │  │   🥂      │  │   🌸      │  │   🍾      │  │   🎁      │  │
│   │ Rode Wijn │  │Witte Wijn │  │   Rosé    │  │ Bubbels   │  │ Cadeaus   │  │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [FEATURED PRODUCTS SECTION]                                                    │
│                                                                                 │
│   "Onze Favorieten"                                        [Bekijk alles →]   │
│                                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│   │             │  │   [NIEUW]   │  │             │  │             │         │
│   │   [IMAGE]   │  │   [IMAGE]   │  │   [IMAGE]   │  │   [IMAGE]   │         │
│   │             │  │             │  │             │  │             │         │
│   │ Bordeaux    │  │ Rioja       │  │ Chardonnay  │  │ Prosecco    │         │
│   │ Supérieur   │  │ Reserva     │  │ Bourgogne   │  │ Extra Dry   │         │
│   │ 2020        │  │ 2018        │  │ 2021        │  │ NV          │         │
│   │             │  │             │  │             │  │             │         │
│   │ ★★★★☆ (24) │  │ ★★★★★ (89) │  │ ★★★★☆ (45) │  │ ★★★★★ (156)│         │
│   │             │  │             │  │             │  │             │         │
│   │ €12,99      │  │ €18,50      │  │ €15,99      │  │ €9,99       │         │
│   │             │  │             │  │             │  │             │         │
│   │[+ WINKELMAND]│ │[+ WINKELMAND]│ │[+ WINKELMAND]│ │[+ WINKELMAND]│         │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [GIFT BANNER - 400px height]                                                   │
│ ┌─────────────────────────────────────────────────────────────────────────────┐│
│ │                                                                             ││
│ │  ┌─────────────────────────────┐   ┌───────────────────────────────────┐   ││
│ │  │                             │   │                                   │   ││
│ │  │   "Het perfecte cadeau      │   │                                   │   ││
│ │  │    voor wijnliefhebbers"    │   │        [LIFESTYLE IMAGE]          │   ││
│ │  │                             │   │        Mooie gift box met wijn    │   ││
│ │  │   Inclusief geschenkverpakking   │                                   │   ││
│ │  │   en persoonlijk kaartje    │   │                                   │   ││
│ │  │                             │   │                                   │   ││
│ │  │   [BEKIJK CADEAUS →]        │   │                                   │   ││
│ │  │                             │   │                                   │   ││
│ │  └─────────────────────────────┘   └───────────────────────────────────┘   ││
│ │                                                                             ││
│ └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [WINE TYPES - 3 Columns]                                                       │
│                                                                                 │
│   "Ontdek op Smaak"                                                            │
│                                                                                 │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐         │
│   │                   │  │                   │  │                   │         │
│   │   [LIFESTYLE      │  │   [LIFESTYLE      │  │   [LIFESTYLE      │         │
│   │    IMAGE]         │  │    IMAGE]         │  │    IMAGE]         │         │
│   │                   │  │                   │  │                   │         │
│   │   RODE WIJN       │  │   WITTE WIJN      │  │   ROSÉ            │         │
│   │                   │  │                   │  │                   │         │
│   │   Vol & Rijk      │  │   Fris & Fruitig  │  │   Licht & Zomers  │         │
│   │                   │  │                   │  │                   │         │
│   │   [Ontdek →]      │  │   [Ontdek →]      │  │   [Ontdek →]      │         │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘         │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [NEWSLETTER SECTION - 200px height]                                            │
│ ┌─────────────────────────────────────────────────────────────────────────────┐│
│ │                       Background: cream/warm                                ││
│ │                                                                             ││
│ │            "Blijf op de hoogte"                                             ││
│ │   Ontvang als eerste nieuwe wijnen en exclusieve aanbiedingen               ││
│ │                                                                             ││
│ │   ┌────────────────────────────────────┐  ┌─────────────┐                   ││
│ │   │  je@email.nl                       │  │ AANMELDEN   │                   ││
│ │   └────────────────────────────────────┘  └─────────────┘                   ││
│ │                                                                             ││
│ └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [FOOTER]                                                                       │
│                                                                                 │
│   VINO PER LEI          SHOP              KLANTENSERVICE        VOLG ONS      │
│                                                                                 │
│   Over ons              Alle Wijnen       Verzending            [IG] [FB]     │
│   Ons verhaal           Rode Wijn         Retourneren                         │
│   Contact               Witte Wijn        FAQ                                 │
│                         Rosé              Contact                              │
│                         Cadeaus                                                │
│                                                                                 │
│   ─────────────────────────────────────────────────────────────────────────── │
│                                                                                 │
│   [iDEAL] [Mastercard] [Visa] [PayPal]              [Thuiswinkel] [NIX18]     │
│                                                                                 │
│   © 2026 Vino per Lei  •  Voorwaarden  •  Privacy  •  Cookies                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.3 HOMEPAGE WIREFRAME (Mobile)

```
┌─────────────────────────────────┐
│ [ANNOUNCEMENT]            [X]   │
│ Welkom! Code WELKOM10...        │
├─────────────────────────────────┤
│                                 │
│ [☰]    [LOGO]        [🔍] [🛒] │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [HERO - 70vh]                   │
│                                 │
│                                 │
│    "Wijn met karakter,          │
│     speciaal voor jou"          │
│                                 │
│   [═══════════════════]         │
│   [ ONTDEK ONZE WIJNEN ]        │
│                                 │
│              ↓                  │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [USP BAR - Horizontal scroll]   │
│                                 │
│ 🚚 Gratis  │ ↩️ Gratis │ ⭐ 100%│
│ verzending │ retour    │ Proef- │
│            │           │garantie│
│                                 │
├─────────────────────────────────┤
│                                 │
│ [CATEGORY LINKS - 2x3 grid]     │
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │🍷 Rood  │  │🥂 Wit   │      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │🌸 Rosé  │  │🍾Bubbels│      │
│  └─────────┘  └─────────┘      │
│  ┌─────────────────────┐       │
│  │    🎁 Cadeaus       │       │
│  └─────────────────────┘       │
│                                 │
├─────────────────────────────────┤
│                                 │
│ "Onze Favorieten"               │
│                         [Alles]│
│                                 │
│ [═══════════════════════════]   │
│ │ Horizontal scroll cards   │   │
│ │ ┌───────┐ ┌───────┐ ┌─── │   │
│ │ │ Card  │ │ Card  │ │    │   │
│ │ └───────┘ └───────┘ └─── │   │
│ [═══════════════════════════]   │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [GIFT BANNER - Stacked]         │
│                                 │
│  ┌─────────────────────────┐   │
│  │     [LIFESTYLE IMAGE]    │   │
│  └─────────────────────────┘   │
│                                 │
│  "Het perfecte cadeau"          │
│  voor wijnliefhebbers           │
│                                 │
│  [══════════════════════]       │
│  [    BEKIJK CADEAUS    ]       │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [WINE TYPES - Full width cards] │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [IMG]  RODE WIJN        │   │
│  │        Vol & Rijk    →  │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ [IMG]  WITTE WIJN       │   │
│  │        Fris & Fruitig → │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ [IMG]  ROSÉ             │   │
│  │        Licht & Zomers → │   │
│  └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [NEWSLETTER]                    │
│                                 │
│  "Blijf op de hoogte"           │
│                                 │
│  ┌─────────────────────────┐   │
│  │  je@email.nl            │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │      AANMELDEN          │   │
│  └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [FOOTER - Accordions]           │
│                                 │
│  VINO PER LEI                   │
│  ─────────────────────────────  │
│  Shop                      [+]  │
│  ─────────────────────────────  │
│  Klantenservice            [+]  │
│  ─────────────────────────────  │
│                                 │
│  [IG] [FB]                      │
│                                 │
│  [Payment icons]                │
│                                 │
│  © 2026 Vino per Lei            │
│                                 │
└─────────────────────────────────┘
```

---

## 4.4 PRODUCT LISTING PAGE WIREFRAME (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [HEADER]                                                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [BREADCRUMB]                                                                   │
│ Home  >  Wijnen  >  Rode Wijn                                                  │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [PAGE HEADER]                                                                   │
│                                                                                 │
│ Rode Wijnen                                                                    │
│ Ontdek onze selectie van 48 rode wijnen uit de mooiste wijnregio's            │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [ACTIVE FILTERS]                                                               │
│ Actieve filters:  Land: Frankrijk [X]  •  Prijs: €10-€20 [X]  •  [Wis alles]  │
│                                                                                 │
├───────────────────────┬─────────────────────────────────────────────────────────┤
│                       │                                                         │
│ [FILTER SIDEBAR]      │ [TOOLBAR]                                              │
│ Width: 280px          │ 36 wijnen                              Sorteer: Populair ▼│
│                       │                                                         │
│ ─────────────────     │ ────────────────────────────────────────────────────── │
│                       │                                                         │
│ ▼ Wijntype            │ [PRODUCT GRID - 4 columns]                             │
│                       │                                                         │
│   ☑ Rood (48)         │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   ☐ Wit (36)          │  │              │  │   [NIEUW]    │  │              │  │
│   ☐ Rosé (12)         │  │   [IMAGE]    │  │   [IMAGE]    │  │   [IMAGE]    │  │
│                       │  │              │  │              │  │              │  │
│ ─────────────────     │  │ Premium      │  │ Reserva      │  │ Estate       │  │
│                       │  │ Bordeaux     │  │ Rioja        │  │ Shiraz       │  │
│ ▼ Land                │  │ Supérieur    │  │ 2018         │  │ 2020         │  │
│                       │  │ 2020         │  │              │  │              │  │
│   ☑ Frankrijk (24)    │  │              │  │ Spanje       │  │ Australië    │  │
│   ☐ Italië (18)       │  │ Frankrijk    │  │              │  │              │  │
│   ☐ Spanje (15)       │  │              │  │ ★★★★★ (89)   │  │ ★★★★☆ (34)   │  │
│   ☐ Australië (8)     │  │ ★★★★☆ (24)   │  │              │  │              │  │
│   ☐ Chili (6)         │  │              │  │ €18,50       │  │ €14,99       │  │
│   ☐ Argentinië (4)    │  │ €15,99 €18,99│  │              │  │              │  │
│                       │  │ ~~~~~~       │  │              │  │              │  │
│   [+ Toon meer]       │  │              │  │ [+ WINKEL-   │  │ [+ WINKEL-   │  │
│                       │  │ [+ WINKEL-   │  │    MAND]     │  │    MAND]     │  │
│ ─────────────────     │  │    MAND]     │  │              │  │              │  │
│                       │  └──────────────┘  └──────────────┘  └──────────────┘  │
│ ▼ Druivenras          │                                                         │
│                       │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   ☐ Merlot (15)       │  │              │  │   [SALE]     │  │              │  │
│   ☐ Cabernet S. (12)  │  │   [IMAGE]    │  │   [IMAGE]    │  │   [IMAGE]    │  │
│   ☐ Pinot Noir (10)   │  │              │  │              │  │              │  │
│   ☐ Syrah (8)         │  │ ...          │  │ ...          │  │ ...          │  │
│   ☐ Tempranillo (6)   │  │              │  │              │  │              │  │
│                       │  │              │  │ €12,99 €16,99│  │              │  │
│   [+ Toon meer]       │  │              │  │ ~~~~~~       │  │              │  │
│                       │  │              │  │ -24%         │  │              │  │
│ ─────────────────     │  │              │  │              │  │              │  │
│                       │  │ [+ WINKEL-   │  │ [+ WINKEL-   │  │ [+ WINKEL-   │  │
│ ▼ Smaakprofiel        │  │    MAND]     │  │    MAND]     │  │    MAND]     │  │
│                       │  └──────────────┘  └──────────────┘  └──────────────┘  │
│   ☐ Licht (12)        │                                                         │
│   ☐ Medium (18)       │                                                         │
│   ☐ Vol (15)          │                                                         │
│   ☐ Krachtig (8)      │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│                       │  │              │  │              │  │  [UITVER-    │  │
│ ─────────────────     │  │   [IMAGE]    │  │   [IMAGE]    │  │   KOCHT]     │  │
│                       │  │              │  │              │  │   [IMAGE]    │  │
│ ▼ Prijs               │  │ ...          │  │ ...          │  │   (dimmed)   │  │
│                       │  │              │  │              │  │              │  │
│   [●═══════════○]     │  │              │  │              │  │ ...          │  │
│   €5      €100        │  │              │  │              │  │              │  │
│                       │  │ [+ WINKEL-   │  │ [+ WINKEL-   │  │ [MAIL MIJ]   │  │
│   Min: €5             │  │    MAND]     │  │    MAND]     │  │              │  │
│   Max: €50            │  └──────────────┘  └──────────────┘  └──────────────┘  │
│                       │                                                         │
│ ─────────────────     │                                                         │
│                       │ [PAGINATION]                                            │
│ [FILTERS WISSEN]      │                                                         │
│                       │ [←]  1  2  3  4  5  ...  12  [→]                       │
│                       │                                                         │
├───────────────────────┴─────────────────────────────────────────────────────────┤
│                                                                                 │
│ [SEO CONTENT]                                                                   │
│                                                                                 │
│ Over Rode Wijn                                                                 │
│ ─────────────────────────────────────────────────────────────────────────────  │
│ Rode wijn wordt gemaakt van blauwe druiven waarbij de schillen mee vergist     │
│ worden. Dit geeft de wijn zijn karakteristieke kleur en tannines...            │
│                                                                                 │
│ [Lees meer]                                                                    │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.5 PRODUCT DETAIL PAGE WIREFRAME (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [HEADER]                                                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [BREADCRUMB]                                                                   │
│ Home  >  Rode Wijn  >  Château Margaux 2019                                    │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [PRODUCT SECTION - 2 Columns]                                                  │
│                                                                                 │
│  ┌────────────────────────────────┐   ┌──────────────────────────────────────┐ │
│  │                                │   │                                      │ │
│  │                                │   │  [COLLECTION LABEL]                  │ │
│  │                                │   │  Premium Selection                   │ │
│  │                                │   │                                      │ │
│  │                                │   │  [PRODUCT NAME]                      │ │
│  │      [MAIN PRODUCT IMAGE]      │   │  Château Margaux                     │ │
│  │                                │   │  2019                                │ │
│  │      800 x 1000 px             │   │                                      │ │
│  │      Aspect ratio 4:5          │   │  [REGION]                            │ │
│  │                                │   │  Bordeaux, Frankrijk                 │ │
│  │                                │   │                                      │ │
│  │                                │   │  [RATING]                            │ │
│  │                                │   │  ★★★★☆  4.2  (128 reviews)          │ │
│  │                                │   │                                      │ │
│  │                                │   │  ──────────────────────────────────  │ │
│  │                                │   │                                      │ │
│  │                                │   │  [SHORT DESCRIPTION]                 │ │
│  │                                │   │  Een elegante Bordeaux met rijp      │ │
│  │                                │   │  fruit, subtiele eiken en            │ │
│  │                                │   │  fluweelzachte tannines.             │ │
│  │                                │   │                                      │ │
│  │                                │   │  ──────────────────────────────────  │ │
│  ├────────────────────────────────┤   │                                      │ │
│  │                                │   │  [PRICE DISPLAY]                     │ │
│  │  [THUMBNAILS]                  │   │                                      │ │
│  │   ┌────┐  ┌────┐  ┌────┐      │   │  €18,99        €24,99                │ │
│  │   │ ●  │  │ ○  │  │ ○  │      │   │  ─────         ~~~~~~                │ │
│  │   └────┘  └────┘  └────┘      │   │  Actieprijs    Was                   │ │
│  │                                │   │                                      │ │
│  └────────────────────────────────┘   │  [SAVINGS BADGE]                     │ │
│                                       │  Je bespaart €6,00 (24%)             │ │
│                                       │                                      │ │
│                                       │  ──────────────────────────────────  │ │
│                                       │                                      │ │
│                                       │  [QUANTITY SELECTOR]                 │ │
│                                       │                                      │ │
│                                       │  Aantal:  [ - ]  1  [ + ]            │ │
│                                       │                                      │ │
│                                       │  [ADD TO CART BUTTON]                │ │
│                                       │  ┌──────────────────────────────────┐│ │
│                                       │  │                                  ││ │
│                                       │  │    TOEVOEGEN AAN WINKELMAND      ││ │
│                                       │  │                                  ││ │
│                                       │  └──────────────────────────────────┘│ │
│                                       │                                      │ │
│                                       │  [TRUST SIGNALS]                     │ │
│                                       │  ✓ Gratis verzending vanaf €35      │ │
│                                       │  ✓ 100% Proefgarantie               │ │
│                                       │  ✓ Binnen 1-2 dagen bezorgd         │ │
│                                       │                                      │ │
│                                       └──────────────────────────────────────┘ │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [TASTE PROFILE SECTION]                                                        │
│                                                                                 │
│   Smaakprofiel                                                                 │
│   ─────────────────────────────────────────────────────────────────────────── │
│                                                                                 │
│   Droog      [●][●][●][●][○][○]  Zoet                                         │
│   Licht      [●][●][○][○][○][○]  Vol                                          │
│   Fris       [●][●][●][○][○][○]  Zacht                                        │
│   Fruitig    [●][●][●][●][●][○]  Kruidig                                      │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [TABS SECTION]                                                                  │
│                                                                                 │
│ ┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐      │
│ │  Beschrijving   │  Proefnotities  │  Lekker bij     │   Details       │      │
│ │     [active]    │                 │                 │                 │      │
│ └─────────────────┴─────────────────┴─────────────────┴─────────────────┘      │
│                                                                                 │
│ [TAB CONTENT - Beschrijving]                                                   │
│                                                                                 │
│ Een elegante dame van een wijn uit het hart van Bordeaux. De Château          │
│ Margaux 2019 biedt een prachtige balans tussen rijp donker fruit,             │
│ subtiele vanille van de eiken rijping, en fluweelzachte tannines die          │
│ deze wijn nu al toegankelijk maken, maar ook potentie voor rijping geven.     │
│                                                                                 │
│ De wijn heeft een diepe robijnrode kleur en geuren van zwarte bes,            │
│ cassis en een hint van cederhout. In de mond is hij vol en rond, met          │
│ een lange, elegante afdronk.                                                   │
│                                                                                 │
│ Perfect voor een speciaal diner of om te bewaren voor een bijzondere          │
│ gelegenheid.                                                                   │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [PRODUCT DETAILS BOX]                                                          │
│ ┌─────────────────────────────────────────────────────────────────────────────┐│
│ │                                                                             ││
│ │  Druivenras          Cabernet Sauvignon (65%), Merlot (35%)                ││
│ │  Alcohol             13.5%                                                  ││
│ │  Inhoud              750ml                                                  ││
│ │  Serveertemperatuur  16-18°C                                               ││
│ │  Bewaaradvies        Kan nog 10-15 jaar rijpen                             ││
│ │  Sluiting            Kurk                                                   ││
│ │                                                                             ││
│ └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [RELATED PRODUCTS]                                                             │
│                                                                                 │
│   "Anderen bekeken ook"                                                        │
│                                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│   │  [Product]  │  │  [Product]  │  │  [Product]  │  │  [Product]  │          │
│   │   Card      │  │   Card      │  │   Card      │  │   Card      │          │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

*Document gaat verder in deel 2...*
