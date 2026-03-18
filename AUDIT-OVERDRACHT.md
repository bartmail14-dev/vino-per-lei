# Vino per Lei — Audit Overdracht & Agent Instructies

**Datum:** 18 maart 2026
**Doel:** 5 gespecialiseerde agents lanceren die parallel de kritieke issues fixen

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion v12 + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify** | `vino-per-lei-2.myshopify.com` (CMS + products) |
| **Laatste commit** | `472c80e` — docs: update handoff |

---

## Audit samenvatting (5 experts, 18 maart 2026)

Er is een vernietigende audit gedaan door 5 gespecialiseerde agents. Hieronder de kernbevindingen per expert, gevolgd door concrete agent-instructies.

### Scores

| Expert | Score | Kernprobleem |
|--------|-------|-------------|
| Webshop Architect | 2.4/10 | Checkout is fake, security lek, geen caching |
| Conversie Expert | 3.5/10 | Fake reviews, broken filters, geen urgency |
| Wijn Expert | 3/10 | Fake proefnotities, hardcoded pairings, geen terroir |
| Copywriter | 3/10 | AI-clichés, geen merkpersoonlijkheid |
| UI/UX Designer | 2/10 | Navy ≠ burgundy, accessibility fails, generieke tokens |

---

## TOP 15 KRITIEKE ISSUES

### BLOCKER (site kan niet live zonder dit)

1. **CHECKOUT IS FAKE** — `createCheckout()` gebruikt deprecated Shopify API. Kortingscodes hardcoded. Express checkout buttons doen `alert()`. Klanten kunnen niets kopen.
   - Bestanden: `src/lib/shopify.ts:208`, `src/app/checkout/`, `src/stores/checkoutStore.ts`

2. **NEPPE REVIEWS** — `generateMockReviews()` in `ReviewSection.tsx:162` genereert fake 5-sterren reviews met random namen. Wettelijk risico.
   - Bestanden: `src/components/product/ReviewSection.tsx`

3. **NEPPE THUISWINKEL WAARBORG BADGE** — Footer toont Thuiswinkel Waarborg logo zonder lidmaatschap. Misleidend.
   - Bestanden: `src/components/layout/Footer.tsx` (rond regel 372)

4. **SECURITY: TOKENS GELEKT** — Shopify Admin + Storefront tokens in git history. Auth accepteert elke email+wachtwoord.
   - Bestanden: `.env.local`, `src/stores/authStore.ts:46`, `scripts/seed-article.mjs` (al gefixt)

5. **COMPLIANCE ONTBREEKT** — Geen echte privacy policy, voorwaarden, retourbeleid. Geen KvK/BTW zichtbaar. Geen allergeninformatie (EU-verplichting voor wijn).

### HIGH PRIORITY (conversie + geloofwaardigheid)

6. **FILTERS WERKEN NIET** — `WijnenClient.tsx` bouwt filter-UI met counts, maar `filteredProducts` returnt altijd ALLE producten. Sort doet ook niets. Zoeken bestaat niet.
   - Bestanden: `src/app/wijnen/WijnenClient.tsx` (rond regel 65-88, en de useMemo)

7. **PRODUCT DATA IS FAKE** — Alle vinificatie = zelfde template ("Handgeplukt in de vroege ochtenduren"). Proefnotities algoritmisch gegenereerd. Serveertemperatuur hardcoded per type.
   - Bestanden: `src/components/product/WineDetailsAccordion.tsx`, `src/components/product/EnhancedTasteProfile.tsx`, `src/components/product/FoodPairingGallery.tsx`

8. **PERFORMANCE** — Hero video 14MB ongecomprimeerd. 19 wijnflessen als 2MB PNG's (31MB totaal). Geen WebP. ~250KB JS bundle.
   - Bestanden: `public/` directory, `src/components/home/HeroSection.tsx`

9. **GEEN ABANDONED CART RECOVERY** — Cart is localStorage-only. Geen server-side persistence. Geen email triggers. Geen exit-intent popup.
   - Bestanden: `src/stores/cartStore.ts`

10. **COPY IS AI-GENERIEK** — "Passie voor Italiaanse wijn", "van wijngaard tot tafel", "ontdek de magie". Geen merkpersoonlijkheid. Over Ons = clichés.
    - Bestanden: alle `page.tsx`, `src/data/blogPosts.ts`

### MEDIUM (design + UX)

11. **KLEURENPALET MISLEIDEND** — `--wine-burgundy: #1a1f3d` is navy blue, geen burgundy. Hele branding mist wijnkleuren.
    - Bestanden: `src/app/globals.css` (regels 11-47)

12. **ACCESSIBILITY** — Geen aria-labels op veel buttons. Focus-visible contrast faalt WCAG AAA. Geen aria-live op cart updates. Touch targets te klein (icon buttons 32px, moet 44px+).
    - Bestanden: `src/components/ui/Button.tsx`, `src/components/layout/Header.tsx`

13. **TYPOGRAFIE INCONSISTENT** — 7+ heading levels zonder coherente schaal. H4 is sans-serif terwijl rest serif is. Line-heights springen willekeurig.
    - Bestanden: `src/app/globals.css` (typografie secties)

14. **SITEMAP MIST BLOG** — `sitemap.ts` genereert URLs voor producten en pagina's maar NIET voor blog artikelen. Google kan blog niet indexeren.
    - Bestanden: `src/app/sitemap.ts`

15. **VARIANT HANDLING BROKEN** — Query haalt maar 1 variant op (`first: 1`). Klant kan geen bottle size/jaargang kiezen.
    - Bestanden: `src/lib/shopify.ts` (product query)

---

## AGENT INSTRUCTIES — Parallel Lanceren

### Hoe te lanceren

Start een nieuw gesprek en plak dit:

```
Lees AUDIT-OVERDRACHT.md in C:\Users\BartVisser\Desktop\vino-per-lei en lanceer
de 5 agents zoals beschreven. Elke agent werkt in een eigen git worktree (isolation: "worktree")
zodat ze niet conflicteren. Na afloop merge ik de branches handmatig.
```

### De 5 agents

---

### AGENT 1: "Webshop Fixer" (architectuur + security + compliance)

**Subagent type:** general-purpose
**Isolation:** worktree
**Mode:** plan (laat plan goedkeuren voor uitvoering)

**Opdracht:**
```
Je bent een senior webshop architect. Fix de volgende kritieke issues in Vino per Lei
(C:\Users\BartVisser\Desktop\vino-per-lei). Lees eerst AUDIT-OVERDRACHT.md voor context.

TAAK 1 — CHECKOUT FIX:
- src/lib/shopify.ts: createCheckout() gebruikt deprecated API
- Vervang door directe redirect naar Shopify checkout URL
  (cart permalink: https://{shop}/cart/{variantId}:{qty},{variantId}:{qty})
- Verwijder de nep checkout pagina (src/app/checkout/) of maak er een redirect van
- Verwijder fake kortingscodes uit checkoutStore.ts
- Verwijder fake express checkout buttons (ExpressCheckout.tsx)

TAAK 2 — FAKE CONTENT VERWIJDEREN:
- ReviewSection.tsx: verwijder generateMockReviews() volledig
- Toon "Nog geen reviews" placeholder of verwijder reviews sectie
- Footer.tsx: verwijder neppe Thuiswinkel Waarborg badge (rond regel 372)
- authStore.ts: verwijder fake login systeem of markeer als "coming soon"

TAAK 3 — SECURITY:
- middleware.ts: versterk CSP headers (verwijder unsafe-inline waar mogelijk)
- Voeg rate limiting toe aan API routes (contact + newsletter)
  Simpele in-memory rate limiter: max 5 requests per IP per minuut

TAAK 4 — COMPLIANCE:
- Voeg KvK (98874977) en BTW (NL005360033B10) toe aan Footer, zichtbaar
- Voeg allergeninformatie toe aan product detail pagina ("Bevat sulfieten")
- Zorg dat sitemap.ts ook blog artikelen bevat (gebruik getBlogArticles())

TAAK 5 — PRODUCT VARIANTS:
- shopify.ts: wijzig variants query van first:1 naar first:10
- Zorg dat variantId correct wordt doorgegeven bij add-to-cart

Commit elke taak apart met conventionele commits. Build moet slagen.
```

---

### AGENT 2: "Filter & Performance Fixer"

**Subagent type:** general-purpose
**Isolation:** worktree
**Mode:** plan

**Opdracht:**
```
Je bent een frontend performance engineer. Fix filters en performance in Vino per Lei
(C:\Users\BartVisser\Desktop\vino-per-lei). Lees eerst AUDIT-OVERDRACHT.md voor context.

TAAK 1 — FILTERS FIXEN (wijnen pagina):
- src/app/wijnen/WijnenClient.tsx: de filteredProducts useMemo returnt altijd ALLE producten
- Implementeer ECHTE filtering op: region, wineType, grape, priceRange
- Implementeer ECHTE sorting: prijs laag-hoog, hoog-laag, nieuwste, naam A-Z
- Test dat filter counts kloppen na filtering

TAAK 2 — ZOEKEN:
- Voeg een werkende zoekbalk toe op de wijnen pagina
- Zoek op: titel, regio, druivenras
- Gebruik client-side filtering (geen API nodig, producten zijn al geladen)

TAAK 3 — PERFORMANCE:
- Converteer alle PNG wijnflessen in public/ naar WebP (gebruik sharp of cwebp)
- Als video in public/ staat: comprimeer naar max 3MB
- Voeg lazy loading toe aan afbeeldingen die below-the-fold zijn
- Check dat next.config.ts image optimization correct is geconfigureerd

TAAK 4 — CACHING:
- Voeg revalidate toe aan alle Shopify data fetches:
  - Producten: revalidate = 300 (5 min)
  - Blog: revalidate = 60 (al gedaan)
  - CMS content (hero, FAQ, etc.): revalidate = 3600 (1 uur)
- Voeg revalidatePath toe waar nodig

Commit elke taak apart. npm run build moet slagen.
```

---

### AGENT 3: "Wijn Data & Content Fixer"

**Subagent type:** general-purpose
**Isolation:** worktree
**Mode:** plan

**Opdracht:**
```
Je bent een wijn-expert en content specialist. Fix alle fake/placeholder wijndata in
Vino per Lei (C:\Users\BartVisser\Desktop\vino-per-lei). Lees eerst AUDIT-OVERDRACHT.md.

TAAK 1 — FAKE PRODUCTDATA VERVANGEN:
- src/components/product/WineDetailsAccordion.tsx:
  Verwijder hardcoded template teksten ("Handgeplukt in de vroege ochtenduren", etc.)
  Vervang door data uit Shopify metafields OF toon niets als data ontbreekt
  Geen generieke placeholder tekst meer — liever leeg dan fake

- src/components/product/EnhancedTasteProfile.tsx:
  De algoritmische proefnotities (value <= 2 ? "Rijp fruit") zijn fake
  Verwijder de gegenereerde beschrijvingen, toon alleen de slider-waarden
  Of vervang door een metafield "tasting_notes" als die bestaat

- src/components/product/FoodPairingGallery.tsx:
  Hardcoded pairings per wijntype (alle rode = biefstuk) zijn onzin
  Maak pairings afhankelijk van het specifieke product
  Gebruik een metafield "food_pairing" als die bestaat, anders toon niets

TAAK 2 — SERVEERTEMPERATUUR SPECIFIEK MAKEN:
- FoodPairingGallery.tsx regels 219-226: hardcoded "16-18°C" voor alle rood
- Maak temperatuur afhankelijk van wijntype + body:
  - Lichte rood (Barbera): 14-16°C
  - Medium rood (Chianti): 16-17°C
  - Zware rood (Barolo, Amarone): 17-18°C
  - Lichte wit: 8-10°C
  - Volle wit: 10-12°C
  - Rosé: 8-10°C
  - Bubbels: 6-8°C

TAAK 3 — PRODUCENT INFO:
- WineDetailsAccordion.tsx: "Dit familiewijngoed, al generaties..." is template
- Vervang door: toon alleen als er echte producent-data is in Shopify
- Als metafield "producer_description" bestaat: toon die
- Anders: toon NIETS (beter dan fake)

TAAK 4 — ALLERGENINFORMATIE:
- Voeg "Bevat sulfieten" toe aan alle wijnproduct pagina's (EU-verplichting)
- Toon dit duidelijk bij de productdetails, niet verstopt

Commit elke taak apart. Build moet slagen.
```

---

### AGENT 4: "Copy Rewriter"

**Subagent type:** general-purpose
**Isolation:** worktree
**Mode:** plan

**Opdracht:**
```
Je bent een senior copywriter voor premium merken. Herschrijf alle generieke AI-copy in
Vino per Lei (C:\Users\BartVisser\Desktop\vino-per-lei). Lees eerst AUDIT-OVERDRACHT.md.

REGELS:
- Schrijf in het Nederlands
- Geen clichés: NIET "passie", "ontdek", "beleef", "van wijngaard tot tafel", "magie"
- Wees specifiek en opinionated — durf iets te zeggen
- Tone of voice: warm maar kennisrijk, als een bevriende sommelier
- Kort en puntig, geen wollige zinnen

TAAK 1 — HOMEPAGE COPY:
- src/app/page.tsx of gerelateerde componenten:
  - Hero subtitle/description: vervang generieke tekst
  - "Onze Favorieten" sectie: specifiekere intro
  - Blog sectie: betere kop dan "Wijn Verhalen"
  - Alle CTA's: "Ontdek Selectie" → specifieker ("Bekijk 19 wijnen" of iets beters)

TAAK 2 — OVER ONS:
- src/app/over-ons/page.tsx:
  - Verwijder ALLE clichés ("passie voor", "generaties", "van wijngaard tot tafel")
  - Schrijf een echt verhaal: wie is Carla? Waarom Italië? Wat maakt haar selectie anders?
  - Timeline: specifieke details ipv generieke romantiek
  - Values: concreet, niet abstract

TAAK 3 — CADEAUS PAGINA:
- src/app/cadeaus/page.tsx:
  - Gift box beschrijvingen: specifiek, niet "authentiek" en "ontdekker"
  - Geef echte redenen waarom iemand hier wijn cadeau zou doen ipv bij Albert Heijn

TAAK 4 — CTA TEKSTEN DOOR HELE SITE:
- Zoek alle "Ontdek", "Bekijk alles", "Neem Contact Op" buttons
- Vervang door specifiekere, conversie-gedreven teksten
- Voorbeeld: "Bekijk alles →" → "Alle 19 wijnen bekijken"
- Voorbeeld: "Neem Contact Op" → "Vraag advies aan Carla"

TAAK 5 — FOOTER TAGLINE:
- "Zorgvuldig geselecteerde Italiaanse wijnen van familiebedrijven met passie voor hun vak"
- Herschrijf: één krachtige zin die Vino per Lei onderscheidt van anderen

Commit elke taak apart. Build moet slagen.
```

---

### AGENT 5: "UI/UX Polish"

**Subagent type:** general-purpose
**Isolation:** worktree
**Mode:** plan

**Opdracht:**
```
Je bent een senior UI/UX designer. Fix design tokens, accessibility en inconsistenties in
Vino per Lei (C:\Users\BartVisser\Desktop\vino-per-lei). Lees eerst AUDIT-OVERDRACHT.md.

TAAK 1 — KLEURENPALET FIXEN:
- src/app/globals.css regels 11-47:
  --wine-burgundy is #1a1f3d (navy blue) — dit moet een ECHTE burgundy/wijnkleur worden
  Voorstel: --wine: #4a1942 of #722f37 (echte donkere wijnkleur)
  --wine-dark: nog donkerder variant
  --wine-light: subtiele tint voor achtergronden
  PAS OP: dit raakt de hele site, test goed! Alle bg-wine, text-wine, border-wine classes
  veranderen mee. Zorg dat contrast overal goed blijft.

TAAK 2 — ACCESSIBILITY:
- Button.tsx: voeg focus-visible styling toe die WCAG AAA haalt
  (focus ring moet 4.5:1 contrast ratio hebben)
- Header.tsx: voeg aria-labels toe aan alle icon buttons
  (zoek-icoon, account-icoon, cart-icoon moeten aria-label hebben)
- Cart updates: voeg aria-live="polite" toe aan cart count badge
- Touch targets: alle icon buttons moeten minimaal 44x44px zijn (p-2 → p-3)

TAAK 3 — BORDER-RADIUS CONSISTENTIE:
- Tokens: --radius-lg van 12px → 8px (premium = scherper)
- Buttons: rounded-lg → rounded-md overal
- Cards: consistent rounded-lg of rounded-xl, niet mixed

TAAK 4 — TYPOGRAFIE OPSCHONEN:
- globals.css: verwijder ongebruikte heading levels als die er zijn
- Zorg dat heading sizes een logische schaal volgen (1.25x ratio)
- Fix line-height body-lg: 1.75 → 1.6 (te veel whitespace)

TAAK 5 — PREFERS-REDUCED-MOTION:
- globals.css: animatie-duration van 0.01ms → 150ms
  (0.01ms is te abrupt, 150ms is gentle maar niet flashy)

Commit elke taak apart. npm run build moet slagen.
Verifieer kleurwijzigingen visueel met Playwright MCP screenshots.
```

---

## MERGE STRATEGIE

Na afloop van alle agents:

```bash
cd /c/Users/BartVisser/Desktop/vino-per-lei

# Check welke worktree branches er zijn
git branch -a | grep audit

# Merge per agent (in volgorde van minste conflicten)
git merge agent-1-webshop-fixer --no-ff
git merge agent-2-filter-performance --no-ff
git merge agent-3-wijn-data --no-ff
git merge agent-4-copy-rewriter --no-ff
git merge agent-5-ui-ux-polish --no-ff  # deze laatst, raakt globals.css

# Bij merge conflicts: handmatig oplossen
# Build check na elke merge
npm run build
```

---

## BELANGRIJKE CONTEXT VOOR ALLE AGENTS

### Technische gotchas
- **Tailwind v4**: scanner pikt class-achtige patterns op uit ALLE bestanden incl .md
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` en herstart
- **NOOIT `next dev` in foreground** — crasht Claude Code. Gebruik `npm run dev > /dev/null 2>&1 &`
- **Framer Motion + React 19**: `useScroll({ target })` crasht tijdens hydration
- **Windows paths**: gebruik Unix paths in Bash (`/c/Users/...`), Windows paths in Claude tools

### Shopify
- Store: `vino-per-lei-2.myshopify.com`
- Storefront token: in `.env.local` (NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN)
- Admin token: MOET GEROTEERD WORDEN (gelekt)
- Blog handle: `wijn-verhalen`
- Metafield namespace: `custom`

### Design systeem
- Fonts: Inter (body) + Playfair Display (headings)
- Icons: Lucide React
- Animaties: Framer Motion
- Smooth scroll: Lenis

### Klant
- Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven
- KvK: 98874977, BTW: NL005360033B10
- Italiaanse wijnen, alleen Noord-Italië + Toscane (klant-keuze)
