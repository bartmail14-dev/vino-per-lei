# Vino per Lei — Volgende Sessie Instructies

**Datum**: 8 april 2026 (na sessie 25)
**Status**: Alles gecommit en gepushed, Vercel auto-deploy actief

---

## EERSTE ACTIE: LEES DIT BESTAND

Project staat op een ongebruikelijke locatie (OneDrive, niet Desktop):

```
C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei
```

---

## WAT ER SESSIE 25 IS GEDAAN

### 1. Sessie 24 werk gecommit + gepushed
- Alles van sessie 24 (auth, account, emails, cookie banner) was uncommitted
- Gecommit als `f86ffd4` en gepushed naar master

### 2. Email templates — PREMIUM REDESIGN (3 iteraties)
- **Iteratie 1** (`81e7b9d`): Eerste redesign met gradient headers, serif typografie, decoratieve elementen
- **Iteratie 2** (`e9e9c64`): Volledig aligned met website design:
  - Navy blue (#1a1f3d) header + footer — matcht website navbar/footer
  - Gold (#c9a227) CTA buttons — zelfde als website
  - Cream/warm-white achtergrond
  - Product cards met Shopify CDN foto's in stock-notification en notify-me
  - Stock notification toont product image + naam + prijs
  - Notify-me toont product image + naam
  - Outline button variant voor secundaire acties
  - Logo 120px in header (klikbaar), 48px in footer
  - Instagram link in footer
- **Notify-me route** (`src/app/api/notify-me/route.ts`): accepteert nu optioneel `productImageUrl` en `productHandle`
- **Preview route** (`src/app/api/email-preview/route.ts`): Updated met echte Shopify product image URLs

### 3. CSP fix voor logo (`771734c`)
- Logo laadde niet in lokale preview: CSP `img-src` stond alleen `self` en `cdn.shopify.com` toe
- Fix: `vino-per-lei.vercel.app` en `*.vinoperlei.nl` toegevoegd aan CSP `img-src`
- In echte emails was dit nooit een probleem (email clients hebben geen CSP)

### 4. Announcement bar default (`771734c`)
- Default tekst gewijzigd van "Welkom! Gebruik code WELKOM10..." naar "Gratis verzending vanaf €35 — Italiaanse wijnen rechtstreeks van de producent"
- **LET OP**: Als Shopify CMS een announcement_bar metaobject heeft (bijv. "nu open"), overschrijft dat de default. Check Shopify Admin → Content → Metaobjects → announcement_bar

---

## VOLGENDE SESSIE: Prioriteiten

### 1. Shopify CMS: Announcement bar checken
- [ ] Check of "nu open" nog in Shopify Admin → Content → Metaobjects → announcement_bar staat
- [ ] Verander naar iets relevants of verwijder het metaobject (dan pakt hij de code default)

### 2. Mailgun configuratie
- [ ] Mailgun account aanmaken op app.mailgun.com
- [ ] Domein `mg.vinoperlei.nl` toevoegen en DNS records instellen
- [ ] Echte API key + domein in `.env.local` en Vercel env vars
- [ ] Test mails versturen naar bart.mail14@gmail.com
- [ ] Verifieer dat logo + product images correct laden in echte emails

### 3. Shopify Admin: klantaccounts activeren
- [ ] Shopify Admin → Settings → Customer accounts → Activeren
- [ ] Testen: registreren via de website, inloggen, orders bekijken

### 4. Shopify notification templates (orderbevestiging etc.)
- [ ] Shopify Admin → Settings → Notifications
- [ ] Templates customizen met Vino per Lei branding + NL teksten
- [ ] Orderbevestiging, verzendbevestiging, account welkom, wachtwoord reset

### 5. `/api/email-preview` route beveiligen of verwijderen
- [ ] Gate achter auth of verwijder voor productie
- [ ] Staat nu open voor iedereen

---

## LATER (technische setup)

- [ ] Domein `vinoperlei.nl` koppelen aan Vercel
- [ ] GA4 tracking ID instellen
- [ ] Inventory tracking 11 producten (Shopify Admin)
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
| **Laatste commit** | `771734c` — fix: CSP img-src + announcement bar default |
| **Uncommitted** | Alleen `annotate.mjs` (dev script, niet nodig) |
| **E-mail utility** | `src/lib/mailgun.ts` (Mailgun REST API, EU region, HTML support) |
| **Email templates** | `src/lib/email-templates.ts` (5 templates, website-aligned design) |
| **Email preview** | `/api/email-preview?template=newsletter\|contact\|notify-me\|account-welcome\|stock-notification` |

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Playwright:** Sluit ALLE Chrome vensters voordat je Playwright MCP start
- **Build check:** `npx tsc --noEmit` — NOOIT `next dev`
