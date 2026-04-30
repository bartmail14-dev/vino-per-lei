# Vino per Lei — Volgende Sessie Instructies

**Datum**: 22 april 2026 (na sessie 27)
**Status**: UNCOMMITTED wijzigingen — API versie fix + 22 transparante product-PNG's + bg-removal script

---

## COPY-PASTE INSTRUCTIE VOLGENDE SESSIE

Kopieer dit blok in één keer naar Claude Code om direct verder te gaan:

```
Lees EERST het bestand VOLGENDE-SESSIE.md in het project:
C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei\VOLGENDE-SESSIE.md

Dit is het Vino per Lei project (Italiaanse wijnwebshop, Shopify headless).

SESSIE 27 SAMENVATTING:
- Shopify API versie geüpdatet: 2025-01 → 2026-01 (src/lib/shopify.ts regel 15 + 309)
- Full audit gedaan met Playwright — ALLES werkt (auth, cart, responsive, alle pagina's)
- Carla's feedback was AL verwerkt in eerdere sessies
- 22 product-PNG's met transparante achtergrond gegenereerd via rembg → public/images/products/
- Script: scripts/remove-bg.py

VANDAAG MOETEN WE:

1. PRODUCTCARDS UPGRADEN met transparante PNG's
   - De 22 PNG's staan in public/images/products/<handle>.png
   - ProductCard component moet lokale PNG gebruiken ipv Shopify CDN (met Shopify als fallback)
   - CSS gradient achtergrond toevoegen aan productcard afbeelding-container
   - Voorbeeld gradient: radial-gradient(ellipse at center bottom, rgba(201,162,39,0.08), transparent 70%)
   - Dit geldt voor: homepage favorieten, wijnen listing, product detail pagina, gerelateerde wijnen
   - Bestanden: src/components/product/ProductCard.tsx, src/app/wijnen/[handle]/ProductDetailClient.tsx

2. CATEGORIE CARDS UPGRADEN
   - "Weet je wat je zoekt?" sectie op homepage — cards met Rode Wijn/Witte Wijn/Rosé/Bubbels
   - Nu kleine iconen op lege achtergrond → sfeervoller maken met gradient achtergronden
   - Bestand: src/app/page.tsx (onderaan, zoek "Shop per type")

3. VERCEL ENV VARS TOEVOEGEN
   - SHOPIFY_ADMIN_ACCESS_TOKEN moet op Vercel → via dashboard of CLI
   - Waarde staat in .env.example
   - Mailgun komt later, niet nu

4. COMMIT + DEPLOY
   - Commit alles: API fix + PNG's + script + component wijzigingen
   - git push + npx vercel --prod (git push triggert NIET auto-deploy!)

5. VISUELE VERIFICATIE
   - Production build: npm run build && npx next start --port 3099 > /dev/null 2>&1 &
   - Playwright screenshots op 375px, 768px, 1024px, 1440px
   - Check of transparante PNG's correct renderen met gradient achtergrond
   - Check of Shopify CDN fallback werkt als lokale PNG ontbreekt

Doe het volgende:
1. Lees VOLGENDE-SESSIE.md volledig door
2. Check git status — er zijn uncommitted wijzigingen van sessie 27
3. Start met de ProductCard component upgrade
4. Test via production build + Playwright
5. Commit + push + vercel deploy
```

---

## WAT ER SESSIE 27 IS GEDAAN

### 1. Shopify API versie geüpdatet
- `src/lib/shopify.ts` regel 15: `2025-01` → `2026-01` (Storefront API)
- `src/lib/shopify.ts` regel 309: `2025-01` → `2026-01` (Admin API)
- Build succesvol — geen deprecation warnings meer

### 2. Full audit met Playwright MCP
Alle flows getest op 4 viewports (375px, 768px, 1024px, 1440px):

| Test | Resultaat |
|------|-----------|
| Age gate popup | OK |
| Cookie banner | OK |
| Login modal + testaccount | OK |
| Account pagina (3 tabs) | OK |
| Wijnen pagina (22 producten) | OK |
| Filters + sortering + zoeken | OK |
| Product detail (PDP) | OK |
| Smaakprofiel radarkaart | OK |
| Proefervaring 3-stappen | OK |
| Winkelmand (toevoegen/+/-) | OK |
| Gratis verzending melding | OK |
| Over Ons (wij-vorm) | OK |
| Klantenservice | OK |
| Contact | OK |
| 404 pagina | OK |
| Voorwaarden | OK |
| Mobile hamburger menu | OK |
| Responsive alle viewports | OK |

### 3. Carla's feedback — AL verwerkt
- Prijsfilter "onder €10" — al verwijderd
- Barolo → Barbera — al aangepast
- Over Ons wij-vorm + kleine wijnhuizen — al herschreven
- Pinterest link — al verwijderd

### 4. Visueel oordeel: 7.5/10
**Wat goed is**: Hero, smaakprofiel, proefervaring, kaart, kleurenpalet, sticky product bar
**Wat beter kan**: Productfoto's (kale achtergrond), categorie cards (te leeg), te veel witte ruimte

### 5. Background removal — 22 transparante PNG's
- Script `scripts/remove-bg.py` geschreven (gebruikt rembg + Pillow)
- Alle 22 Shopify productafbeeldingen gedownload en achtergrond verwijderd
- Opgeslagen in `public/images/products/<handle>.png`
- Kwaliteit is excellent — schone transparante flesuitsnedes
- **NOG NIET geïntegreerd in de code** — dat is de hoofdtaak voor sessie 28

---

## UNCOMMITTED WIJZIGINGEN (sessie 27)

```
modified:   src/lib/shopify.ts          (API versie 2025-01 → 2026-01)
modified:   .env.example
modified:   CLAUDE.md
modified:   VOLGENDE-SESSIE.md
modified:   src/app/api/email-preview/route.ts
modified:   src/app/over-ons/OverOnsContent.tsx
modified:   src/components/layout/Header.tsx
new file:   scripts/remove-bg.py
new file:   public/images/products/*.png  (22 bestanden)
new file:   annotate.mjs
```

---

## ARCHITECTUUR: HOE PNG's INTEGREREN

### ProductCard component
```tsx
// Huidige situatie: Shopify CDN URL
<Image src={product.featuredImage.url} ... />

// Gewenste situatie: lokale PNG met gradient achtergrond, Shopify als fallback
const localImg = `/images/products/${product.handle}.png`;
// Container krijgt gradient achtergrond:
// bg-gradient-to-b from-transparent via-wine/5 to-wine/10
// of een radial gradient voor premium feel
```

### Betreffende bestanden
| Component | Bestand | Wat aanpassen |
|-----------|---------|---------------|
| ProductCard | `src/components/product/ProductCard.tsx` | Afbeelding source + container styling |
| Favorieten homepage | `src/app/page.tsx` | Gebruikt ProductCard |
| Wijnen listing | `src/app/wijnen/WijnenClient.tsx` | Gebruikt ProductCard |
| Product detail | `src/app/wijnen/[handle]/ProductDetailClient.tsx` | Hoofdafbeelding |
| Gerelateerde wijnen | Onderdeel van PDP | Gebruikt ProductCard |

### Aandachtspunten
- Gebruik `onError` fallback naar Shopify CDN URL als lokale PNG niet bestaat
- Transparante PNG's zijn groter dan JPG — overweeg next/image optimalisatie
- De 3 nieuwste wijnen (valpolicella-ripasso, nizza-riserva, passo-del-cardinale) hebben lagere resolutie

---

## BEKENDE ISSUES

| Issue | Ernst | Locatie |
|-------|-------|---------|
| `SHOPIFY_ADMIN_ACCESS_TOKEN` mist op Vercel | ⚠️ Geen inventory data live | Vercel env vars |
| Middleware deprecation warning | ℹ️ Werkt nog | `src/middleware.ts` |
| Announcement bar toont "WELKOM10" ipv default | ℹ️ CMS overschrijft | Shopify Metaobjects |
| CSP blokkeert auth op localhost | ℹ️ Alleen dev | connect-src policy |
| Vercel deploy triggert NIET bij git push | ⚠️ Handmatig | Altijd `npx vercel --prod` |

---

## PRIORITEITEN SESSIE 28

1. **ProductCard upgrade** — transparante PNG's + gradient achtergrond (HOOFDTAAK)
2. **Categorie cards** — "Weet je wat je zoekt?" visueel upgraden
3. **Commit + push** — alle sessie 27 + 28 wijzigingen
4. **Vercel env vars** — SHOPIFY_ADMIN_ACCESS_TOKEN toevoegen
5. **Deploy** — `npx vercel --prod`
6. **Visuele verificatie** — Playwright op 4 viewports

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Vercel** | vino-per-lei.vercel.app (HANDMATIG deploy: `npx vercel --prod`) |
| **Shopify Admin** | `https://admin.shopify.com/store/vino-per-lei-2` |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **Laatste commit** | `bcd0838` — docs: update handoff for session 26 |
| **Testaccount** | `test-vpl@bluewiremedia.nl` / `TestWijn2026!` |

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** `npx vercel --prod` (git push triggert NIET auto-deploy!)
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Build check:** `npx tsc --noEmit`

## Design systeem

| Element | Waarde |
|---------|--------|
| Primary | wine-burgundy `#1a1f3d` |
| Accent | gold `#c9a227` |
| Background | cream `#faf9f7` |
| Border | sand `#e8e0d5` |
| Wine type rood | wine-red `#8B1A32` |
| Serif | Playfair Display |
| Sans | Inter |
