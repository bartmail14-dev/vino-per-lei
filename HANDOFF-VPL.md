# Vino per Lei — Overdracht Volgende Sessie

**Datum:** 17 maart 2026 (nacht, laat)
**Laatste sessie:** Blog visuele upgrade — listing + artikelpagina + lightbox + mobiel

---

## Project Info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\Desktop\vino-per-lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Tech** | Next.js 16.1.6 + React 19 + TypeScript + Tailwind v4 + Framer Motion v12 + Shopify Storefront API |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify** | `vino-per-lei-2.myshopify.com` (alleen CMS backend) |
| **Klant** | Carla Daniels, Pastorielaan 56, 5504 CR Veldhoven |
| **KvK** | 98874977 — **BTW:** NL005360033B10 |

---

## Huidige Git Staat

**UNCOMMITTED: blog visual upgrade + article page upgrade + HANDOFF. Moet nog gecommit + gepusht.**

```
[uncommitted] feat: blog visual upgrade + article page premium experience
d366ddc feat: shared newsletter component + blog tag polish
4d6f1d6 fix: Tailwind v4 build crash + visual verification all pages
bfb84d6 docs: overdracht update — hydration fix, grain CSS var, build fixes
539f181 fix: blog hydration crash + grain texture CSS variable
```

**Build:** Clean, `npm run build` slaagt (46 pagina's).

**Eerste actie volgende sessie:** commit + push!

---

## Wat is GEDAAN (sessie 17 maart — nacht)

### 1. Blog Listing Visuele Upgrade

#### A. Featured Hero Zonder Foto → Animated Abstract Pattern
- **Bestand:** `src/app/blog/BlogClientComponents.tsx` (FeaturedHero, no-image branch)
- Statische wine glass SVG vervangen door **animated floating circles** (Framer Motion)
- 3 grote cirkels met `animate={{ y, x, scale }}` op 8-12s loops — abstract grape/bubble motif
- 2 pulserende gouden accent dots
- **Diagonal gold accent line** rechtsboven
- **Gradient mesh**: meerdere overlappende radial gradients die shiften op hover
- **Vignette** + entrance animaties (staggered delays)
- CTA: "Lees het verhaal" + circular gold arrow button

#### B. Article Card Hover States → Premium Interactions
- **Bestand:** `src/app/blog/BlogClientComponents.tsx` (ArticleCard)
- Image cards: zoom `scale-[1.08]`, gradient overlay reveal, diepere shadows
- No-image cards: floating decorative circles, shimmer accent, radial glow shift, watermark opacity transitie, gold bottom accent line
- Category pill + CTA button animeren op hover

#### C. Bento Grid Variatie
- **Bestand:** `src/app/blog/BlogClientComponents.tsx` (ArticleGrid)
- 8e card = large (2-col), 12e card = horizontal (full-width)
- Werkt met elke hoeveelheid artikelen

### 2. Artikelpagina Premium Experience

#### A. Image Lightbox (NIEUW)
- **Nieuw bestand:** `src/app/blog/[slug]/ImageLightbox.tsx`
- Fullscreen image viewer — tap/click om foto's te vergroten
- Escape of click-buiten om te sluiten
- Animated entrance/exit (Framer Motion)
- Zoom-in cursor op afbeeldingen + hover hint icon (vergrootglas)
- Body scroll lock wanneer open
- Caption uit alt-text onderaan

#### B. ArticleContentEnhancer Upgrade
- **Bestand:** `src/app/blog/BlogAnimations.tsx` (ArticleContentEnhancer)
- **Lead paragraph**: eerste paragraaf automatisch groter (1.2em) + eleganter
- **Image wrappers**: afbeeldingen worden automatisch gewrapt met:
  - Rounded container met hover shadow
  - Zoom-hint icon (vergrootglas) zichtbaar op hover
  - Click opent ImageLightbox via CustomEvent
  - Hover scale 1.02 op de afbeelding
- **Decoratieve h2-dividers**: gold diamond + lijnen automatisch vóór elke h2 (behalve eerste)
- Scroll-animaties behouden (fade-up tekst, scale images, slide blockquotes)

#### C. No-image ArticleHero Upgrade
- **Bestand:** `src/app/blog/[slug]/ArticleHero.tsx`
- Platte gradient → floating circles + gradient mesh + grain + gold accent lines + vignette
- Consistent met blog listing hero styling

#### D. Mobile Prose Verbeteringen
- **Bestand:** `src/app/globals.css`
- Afbeeldingen breken uit content padding op mobiel (full-width feel)
- Betere font-size (1.0625rem) en line-height (1.8) op mobiel
- `.article-image-wrapper` hover shadow + mobile breakout

### 3. Eerdere sessie (avond): Newsletter + Tags
- Gedeeld NewsletterForm component (dark/light varianten)
- Alle 4 newsletter instances gerefactord
- Blog tag display names (`tag-utils.ts`)
- Artikel counts in category filter

---

## TODO's Volgende Sessie (prioriteit)

### 1. COMMIT + PUSH (eerste actie!)
```bash
cd C:\Users\BartVisser\Desktop\vino-per-lei
git add -A
git commit -m "feat: blog visual upgrade + article page premium experience"
git push origin master
```

### 2. Carla: Rijke Blog Content Schrijven in Shopify
**Dit is de #1 bottleneck.** De hele blog-infrastructuur is nu premium, maar de artikelen bevatten alleen 2 korte paragrafen zonder foto's.

**Instructies voor Carla (Shopify Admin → Blog → Wijn Verhalen):**
- **Featured images**: upload per artikel een hero foto (16:9, min 1200px breed)
- **Koppen gebruiken**: `Heading 2` voor secties, `Heading 3` voor subsecties
- **Afbeeldingen in tekst**: voeg foto's toe tussen paragrafen — ze worden automatisch:
  - Full-bleed op mobiel
  - Klikbaar voor fullscreen lightbox
  - Animated scroll reveal
  - Rounded met hover shadow op desktop
- **Blockquotes**: gebruik het aanhalingsteken-icoon — wordt premium gestyled met gold accent
- **Lijsten**: opsommingen krijgen automatisch wine-colored bullets
- **Lengte**: minimaal 500 woorden voor mooie reading experience + Table of Contents

### 3. Web3Forms API Key
- web3forms.com → API key maken → email naar Carla
- `.env.local`: `NEXT_PUBLIC_WEB3FORMS_KEY=...`
- Ook in Vercel environment variables zetten

### 4. Shopify / Carla TODO's (extern)
- **Telefoonnummer** — `040-XXX XXXX` placeholder overal
- **Shopify Payments** — iDEAL, creditcard activeren
- **DNS vinoperlei.nl** naar Vercel
- **Newsletter backend** — Klaviyo/Mailchimp koppelen (NewsletterForm heeft TODO comment)

### 5. Optionele Verbeteringen
- **Blog listing met foto's testen** — zodra Carla foto's upload, article cards visueel verifiëren
- **Related articles** zonder foto's: upgrade naar floating circles (nu nog platte gradient)
- **Table of Contents** verschijnt pas bij 3+ koppen — test met lang artikel
- **Tag-utils uitbreiden** als Carla nieuwe tags aanmaakt in Shopify

---

## Architectuur Blog

```
Shopify Admin (blog "wijn-verhalen")
    | Storefront API (GraphQL)
    | shopify-cms.ts (getBlogArticles, getBlogTags, etc.)
Server Components (page.tsx — revalidate=60)
    | props
Client Components:
    BlogClientComponents.tsx — FeaturedHero, ArticleCard, ArticleGrid, InlineNewsletterCTA
    BlogCategoryFilter.tsx — tag pills met Framer Motion layoutId
    BlogBottomNewsletter.tsx — bottom newsletter wrapper
    BlogAnimations.tsx — 17+ animatie-componenten + ArticleContentEnhancer
    [slug]/page.tsx — Article page layout + ImageLightbox
    [slug]/ArticleHero.tsx — Article header (parallax + floating circles)
    [slug]/ImageLightbox.tsx — Fullscreen image viewer (CustomEvent-based)
    [slug]/FloatingShareBar.tsx — Share sidebar/bottom bar
    [slug]/TableOfContents.tsx — Sticky heading navigator (xl+, 3+ headings)
    [slug]/NewsletterCTA.tsx — Article page newsletter (light variant)
Shared:
    components/newsletter/NewsletterForm.tsx — gedeeld form (dark/light)
    lib/tag-utils.ts — tag slug -> display name mapping
```

---

## Componentenkaart (snel navigeren)

```
src/components/newsletter/NewsletterForm.tsx  → Gedeeld newsletter form (dark/light/socialProof)
src/lib/tag-utils.ts                         → Tag display name mapping + getTagLabel()
src/app/blog/page.tsx                        → Blog listing layout, tagCounts berekening
src/app/blog/BlogClientComponents.tsx        → FeaturedHero, ArticleCard, ArticleGrid, InlineNewsletterCTA
src/app/blog/BlogCategoryFilter.tsx          → Category pills met counts
src/app/blog/BlogBottomNewsletter.tsx        → Bottom newsletter client wrapper
src/app/blog/BlogAnimations.tsx              → 17+ animatie-componenten + ArticleContentEnhancer
src/app/blog/[slug]/page.tsx                 → Article page layout
src/app/blog/[slug]/ArticleHero.tsx          → Article header (parallax + floating circles fallback)
src/app/blog/[slug]/ImageLightbox.tsx        → Fullscreen image lightbox (NEW)
src/app/blog/[slug]/FloatingShareBar.tsx     → Share sidebar (desktop) / bottom bar (mobile)
src/app/blog/[slug]/TableOfContents.tsx      → Sticky heading navigator (xl+)
src/app/blog/[slug]/NewsletterCTA.tsx        → Article newsletter (light variant)
src/components/layout/Footer.tsx             → Footer met newsletter (dark variant)
src/app/globals.css                          → Design tokens, prose-wine, animations, .bg-grain
```

---

## Hoe Shopify Blog Content Premium Rendert

Carla's content in Shopify wordt automatisch verrijkt:

| Shopify Element | Wat er gebeurt |
|----------------|----------------|
| **Paragraaf** | Scroll fade-up animatie, eerste paragraaf = lead (groter) |
| **Heading 2** | Gold diamond divider erboven, serif font, wine-kleur |
| **Heading 3** | Subtiel, serif, wine-kleur |
| **Afbeelding** | Wrapped in container, zoom-hint icon, klik = fullscreen lightbox, full-bleed op mobiel |
| **Blockquote** | Gold border-left, cream achtergrond, slide-from-left animatie |
| **Lijst** | Wine-colored bullets/numbers |
| **Link** | Gold underline, wine op hover |
| **Horizontale lijn** | Gold diamond center divider |
| **Code** | Champagne achtergrond |
| **Tabel** | Gold header accent, zebra striping |

---

## Playwright MCP — Visuele Verificatie

**De Playwright MCP is beschikbaar en heeft al een Chrome venster open.**

Gebruik dit voor visuele verificatie:
1. `browser_navigate` naar de pagina die je wilt checken
2. `browser_snapshot` voor accessibility tree (content check)
3. `browser_take_screenshot` voor visuele check (fullPage: true)
4. Na code changes: `npm run build` → server herstarten → screenshot vergelijken

**Server starten (production):**
```bash
npm run build && npx next start --port 3000 > /dev/null 2>&1 &
```

**Server stoppen:**
```bash
powershell.exe -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id \$_ -Force -ErrorAction SilentlyContinue }"
```

---

## Claude Code Notities

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** altijd `npm run build` eerst, dan `npx next start`
- **Shopify tokens** in `.env.local` — NIET committen
- **Lucide React** beschikbaar — `import { IconName } from 'lucide-react'`
- **`.bg-grain`** class voor grain texture overlay
- **Tailwind v4 LET OP**: Scanner pikt class-achtige patterns op uit ALLE bestanden incl .md
- **Tailwind v4 cache**: bij rare CSS errors, verwijder `.next/` en herstart
- **Framer Motion + React 19:** `useScroll({ target })` crasht tijdens hydration — gebruik handmatige scroll listeners
- **`getTagLabel()`** in `src/lib/tag-utils.ts` — gebruik voor alle tag displays, voeg nieuwe mappings toe als Carla nieuwe tags maakt
- **ImageLightbox** werkt via `CustomEvent("open-lightbox")` — ArticleContentEnhancer dispatcht dit bij image click
- **ArticleContentEnhancer** is DOM-based (niet React) omdat het `dangerouslySetInnerHTML` content post-processed
