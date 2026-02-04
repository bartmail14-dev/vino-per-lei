# Design Analyse - Vino per Lei

## Samenvatting Referentiesites

### 1. Taylors Wines (Heritage & Premium)
**Sterktes om over te nemen:**
- Warme, aardse kleurenpalet (cream, beige, donkerbruin)
- Serif typography (Playfair Display) voor premium uitstraling
- Timeline sectie voor storytelling
- Member pricing duidelijk zichtbaar
- Mega-menu met promotionele afbeeldingen

**Kleuren:**
- Cream/off-white: #FFFBF6
- Dark brown: #231F20
- Beige: #F6F3E8
- Gold accents

**Fonts:**
- Headings: Playfair Display (serif)
- Body: Instrument Sans (sans-serif)

---

### 2. Privios (Artistiek & Modern)
**Sterktes om over te nemen:**
- Donker/zwart thema voor luxe uitstraling
- Geanimeerde flesrotaties
- Full-screen video hero
- Minimalistisch, veel whitespace
- Age gate als eerste interactie

**Kleuren:**
- Background: #1A1C1E (bijna zwart)
- Text: #FFFFFF
- Coral accent: #FFA38B (voor CTAs)

**Sfeer:**
- "Sophisticated irreverence"
- Premium maar speels
- Zeer visueel, weinig tekst

---

### 3. Wijnvoordeel (Conversie & UX)
**Sterktes om over te nemen:**
- Uitgebreide mega-menu met categorieën
- Product cards met doorgestreepte prijzen
- Trust elementen (gratis verzending, retourneren)
- Faceted filtering (land, druif, prijs)
- Smaakprofiel quiz
- Review integratie

**Kleuren:**
- Primary: Burgundy/wine red #CA7865
- Background: White
- Text: Dark

**Conversie-elementen:**
- Gratis thuisbezorgd
- Gratis retourneren
- Bekroonde wijnen badges
- Vivino ratings

---

## Gekozen Design Richting voor Vino per Lei

### Kleurenpalet
```css
/* Light mode (primary) */
--background: #FAF9F7;        /* Warm off-white */
--foreground: #1A1A1A;        /* Near black */
--wine-primary: #722F37;      /* Bordeaux red */
--wine-dark: #5A252C;         /* Darker wine */
--gold-accent: #C9A227;       /* Gold for CTAs */
--cream: #F5F0E8;             /* Cream voor sections */

/* Dark mode sections (Privios-inspired hero) */
--dark-bg: #1A1C1E;
--dark-text: #FFFFFF;
--coral-accent: #FFA38B;
```

### Typography
- **Headings:** Playfair Display (elegant, wijn-passend)
- **Body:** Inter of Instrument Sans (modern, leesbaar)
- **Prijzen:** Tabular nums, bold

### Layout Structuur
1. Age Gate (Privios style) - eerste bezoek
2. Announcement bar (kortingscode)
3. Header met mega-menu (Wijnvoordeel complexity)
4. Hero sectie (keuze: video of carousel)
5. Product carousels met tabs
6. USP/Trust sectie
7. Footer

### Must-have Features
- [ ] Age verification modal
- [ ] Mega-menu met landen/druiven
- [ ] Product cards met:
  - Doorgestreepte prijzen
  - Member pricing
  - Hover animatie
- [ ] Filter sidebar
- [ ] Trust badges
- [ ] Mobile-first responsive

---

## Volgende Stappen

1. **Handmatige screenshots** - Jij maakt screenshots van specifieke elementen
2. **Design system** - Tailwind config + shadcn/ui setup
3. **Components bouwen** - In volgorde van dependency
4. **Pagina's assembleren**

---

## Screenshots om te maken (door jou)

### Taylors Wines
- [ ] Homepage hero
- [ ] Product card met member pricing
- [ ] Mega-menu open
- [ ] Timeline sectie
- [ ] Footer

### Privios
- [ ] Age gate
- [ ] Video hero
- [ ] Bottle hover effect
- [ ] Dark theme algemeen

### Wijnvoordeel
- [ ] Product card volledig
- [ ] Mega-menu met categorieën
- [ ] Filter sidebar
- [ ] Trust badges footer
- [ ] Prijsweergave met korting
