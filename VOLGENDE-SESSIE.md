# Vino per Lei — Volgende Sessie Instructies

**Datum**: 8 april 2026 (na sessie 23)
**Status**: Handleiding COMPLEET, Mailgun code klaar, site technisch af

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
- Visueel geverifieerd op live site via Playwright MCP
- **Commit**: `fa99d21`

### 2. Web3Forms → Mailgun migratie — CODE COMPLEET
- `src/lib/mailgun.ts` — shared utility (EU region, FormData API)
- Contact + notify-me routes herschreven, privacy pagina updated
- **⚠ Nog niet actief** — Mailgun env vars + domein verificatie komen later
- **Commit**: `a4635ec`

### 3. Carla's feedback — GECHECKT
- Barolo/Barbera: alle code correct, vraag Carla wat ze bedoelt
- Over Ons wij-vorm: fallback al correct, CMS moet via Shopify Admin

---

## VOLGENDE SESSIE: Klantervaring & communicatie

### 1. Shopify klant login portaal
- Klantaccounts activeren in Shopify Admin
- Login/registratie flow op de website
- Account pagina: ordergeschiedenis, adresgegevens
- Integratie met de bestaande website (header "Inloggen" knop werkt al)

### 2. Bevestigingsmails designen
- Shopify email templates customizen (Shopify Admin → Settings → Notifications):
  - Orderbevestiging
  - Verzendbevestiging (met tracking)
  - Account welkom
  - Wachtwoord reset
- Branding: Vino per Lei logo, kleuren, tone of voice
- Taal: alles in het Nederlands

### 3. Nieuwsbrief opzetten
- Nieuwsbrief aanmeldflow werkt al op de website (footer)
- Backend koppeling: Mailgun mailing list of Shopify Email
- Welkomstmail na aanmelding
- Template voor periodieke nieuwsbrief (max 2x/maand, staat in footer)
- Afmeldlink

### 4. Transactionele e-mails via Mailgun
- Contactformulier (code klaar, env vars instellen)
- Voorraadmelding ("Mail bij voorraad")
- Eventueel: abandoned cart reminder

---

## LATER (technische setup)

- [ ] Mailgun env vars op Vercel + domein `mg.vinoperlei.nl` verifiëren
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
| **Laatste commit** | `5505ec9` — docs: update VOLGENDE-SESSIE.md |
| **E-mail utility** | `src/lib/mailgun.ts` (Mailgun REST API, EU region) |
| **Handleiding** | Alle 18 screenshots geannoteerd, live op Vercel |

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **NOOIT blanket `taskkill //IM`** — alleen specifieke PIDs
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Playwright:** Sluit ALLE Chrome vensters voordat je Playwright MCP start
- **Build check:** `npx tsc --noEmit` — NOOIT `next dev`
- **OneDrive:** File locks workaround: schrijf naar Desktop/temp, dan kopiëren
- **Deploy**: `npx vercel --prod`
