# Vino per Lei — Volgende Sessie Instructies

**Datum**: 8 april 2026 (na sessie 23)
**Status**: Handleiding COMPLEET (annotaties + screenshots), Mailgun geïntegreerd

---

## EERSTE ACTIE: LEES DIT BESTAND

Project staat op een ongebruikelijke locatie (OneDrive, niet Desktop):

```
C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei
```

---

## WAT ER SESSIE 23 IS GEDAAN

### 1. Screenshot annotaties — COMPLEET
- Alle 18 admin screenshots geannoteerd met rode cirkels + genummerde labels
- Coördinaten van sessie 22 waren verkeerd — alle 18 visueel gecheckt en gecorrigeerd
- `add-annotations.cjs` herschreven: schrijft nu naar Desktop temp-map (OneDrive lock workaround)
- Visueel geverifieerd op live site via Playwright MCP — alle cirkels op juiste UI-elementen
- **Commits**: `fa99d21` (annotaties) + `a4635ec` (Mailgun)
- **Deployed** op Vercel ✓

### 2. Web3Forms → Mailgun migratie — COMPLEET
- Nieuwe `src/lib/mailgun.ts` — shared utility, EU region, FormData API
- `src/app/api/contact/route.ts` — herschreven voor Mailgun
- `src/app/api/notify-me/route.ts` — herschreven voor Mailgun
- `src/app/privacy/page.tsx` — Web3Forms verwijderd, Mailgun toegevoegd
- `.env.example` + `.env.local` — updated met Mailgun vars
- **⚠ NIET WERKEND** — Mailgun env vars moeten nog op Vercel + domein moet geverifieerd

### 3. Carla's feedback — GECHECKT
- ✅ **Barolo/Barbera**: Alle code-referenties gecontroleerd — alles correct. Geen mismatch gevonden. Vraag aan Carla welk specifiek product of tekst ze bedoelt.
- ✅ **Over Ons wij-vorm**: Fallback content in `OverOnsContent.tsx` is al in wij-vorm. Als Carla eigen content via Shopify Pages heeft ingevuld, moet dat daar aangepast worden.

---

## PRIORITEIT 1: Mailgun activeren

### Stap 1: Mailgun account + domein
1. Log in op https://app.mailgun.com (of maak account aan)
2. Voeg domein toe: `mg.vinoperlei.nl` (sending domain)
3. Voeg de DNS records toe die Mailgun geeft (SPF, DKIM, MX) bij de domeinregistrar
4. Wacht op verificatie (kan paar minuten tot uren duren)

### Stap 2: Vercel env vars instellen
Ga naar Vercel dashboard → Project → Settings → Environment Variables:
```
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.vinoperlei.nl
MAILGUN_REGION=eu
CONTACT_EMAIL=info@vinoperlei.nl
```
Redeploy na instellen: `npx vercel --prod`

### Stap 3: Test
Stuur een testbericht via https://vino-per-lei.vercel.app/contact

---

## PRIORITEIT 2: Domein vinoperlei.nl koppelen aan Vercel

1. Ga naar Vercel dashboard → Project → Settings → Domains
2. Voeg `vinoperlei.nl` en `www.vinoperlei.nl` toe
3. Volg Vercel's DNS instructies bij de domeinregistrar
4. Check of metadata `metadataBase` in `src/app/layout.tsx` al `https://vinoperlei.nl` is (ja, dat klopt)

---

## PRIORITEIT 3: Inventory tracking (11 producten)

Via Shopify Admin (https://admin.shopify.com/store/vino-per-lei-2):
1. Ga naar Products
2. Open elk product → scroll naar Inventory
3. Zet "Track quantity" aan
4. Vul voorraadaantal in
5. Save

---

## PRIORITEIT 4: Overige TODO's

- [ ] GA4 tracking ID instellen
- [ ] Shopify API-token roteren (staat in git history)
- [ ] Barolo/Barbera: vraag Carla wat ze precies bedoelt

---

## Project info

| Veld | Waarde |
|------|--------|
| **Locatie** | `C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei` |
| **GitHub** | `bartmail14-dev/vino-per-lei` (PRIVATE, master branch) |
| **Vercel** | vino-per-lei.vercel.app (auto-deploy vanuit master) |
| **Shopify Admin** | `https://admin.shopify.com/store/vino-per-lei-2` |
| **Klant** | Carla Daniels |
| **Laatste commit** | `a4635ec` — feat: replace Web3Forms with Mailgun |
| **Handleiding** | `src/app/handleiding/HandleidingContent.tsx` |
| **Screenshots** | `public/handleiding/` — alle 18 admin screenshots geannoteerd |
| **Annotatie-script** | `add-annotations.cjs` (output naar Desktop temp-map) |
| **E-mail** | `src/lib/mailgun.ts` — shared Mailgun utility |

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **NOOIT blanket `taskkill //IM`** — alleen specifieke PIDs
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Playwright:** Sluit ALLE Chrome vensters voordat je Playwright MCP start
- **Build check:** `npm run build` of `npx tsc --noEmit` — NOOIT `next dev`
- **OneDrive sync:** Bestanden staan in OneDrive, kan file locks geven. Workaround: schrijf naar Desktop/temp, dan kopiëren.
- **Deploy**: `npx vercel --prod` (git push triggert auto-deploy, maar handmatig is sneller)
