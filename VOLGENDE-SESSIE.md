# Vino per Lei — Volgende Sessie Instructies

**Datum**: 31 maart 2026 (na sessie 19)
**Status**: Alle inventory + Carla feedback + screenshots + analytics KLAAR

---

## WAT ER NOG MOET GEBEUREN

### Prioriteit 1: Env vars instellen (Bart)
Stel de volgende env vars in op Vercel (Settings → Environment Variables):

1. **`NEXT_PUBLIC_POSTHOG_KEY`** — PostHog project API key (maak account op posthog.com, kies EU cloud)
2. **`NEXT_PUBLIC_POSTHOG_HOST`** — `https://eu.i.posthog.com` (default, hoeft alleen als anders)
3. **`WEB3FORMS_ACCESS_KEY`** — Haal op bij web3forms.com (gratis, voor contactformulier + notify-me)

### Prioriteit 2: Domein vinoperlei.nl koppelen
1. Voeg domein toe in Vercel (Settings → Domains)
2. Stel DNS in bij de registrar (A-record + CNAME)
3. Google Search Console koppelen

### Prioriteit 3: Tekst "hoe het allemaal begon" (wacht op Carla)
Carla levert aanvullende tekst aan voor de Over Ons pagina.

---

## WAT ER SESSIE 19 IS GEDAAN

### Shopify Admin (via Playwright)
- **Inventory tracking COMPLEET** — alle 20 producten: tracking AAN + 48 stuks ✅
- **"Cadeaus" verwijderd uit CMS** — Categorie Blok: 4 entries over (Bubbels, Rosé, Witte Wijn, Rode Wijn) ✅
- **12 Admin screenshots** gemaakt voor handleiding ✅

### Code-wijzigingen (4 commits gepusht)
1. **`a458e44`** — Carla's feedback + inventory tracking
   - Prijsfilter "Tot €10" verwijderd
   - Barolo → Barbera in SEO sectie
   - Over Ons herschreven naar wij-vorm
   - Pinterest verwijderd uit footer
   - Cadeaus + Blog gefilterd uit footer CMS links
2. **`d75b44c`** — 12 Shopify Admin screenshots voor handleiding
3. **`1f3d2ff`** — PostHog, notify-me API, redirects, WebP, cleanup
   - GA4 vervangen door PostHog (cookie consent geïntegreerd)
   - `/api/notify-me` endpoint aangemaakt (Web3Forms)
   - Redirects: /cadeaus → /wijnen, /blog → /, /showcase → /
   - 43 handleiding PNGs → WebP (9.3MB bespaard)
   - `critters` dependency verwijderd
   - Cookie consent tekst: "Google Analytics" → "Anonieme statistieken"

---

## Technische details
- **Build**: `npm run build`
- **Port**: 3099 (`npx next start --port 3099`)
- **NOOIT** `next dev` draaien — crasht Claude Code
- **Project locatie**: `C:\Users\BartVisser\Desktop\vino-per-lei`
- **Shopify Admin**: `https://admin.shopify.com/store/vino-per-lei-2`
- **Laatste commit**: `1f3d2ff` (gepusht naar master, Vercel auto-deploy)
