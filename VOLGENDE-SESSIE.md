# Vino per Lei — Volgende Sessie Instructies

**Datum**: 8 april 2026 (na sessie 24)
**Status**: Auth + account + emails + cookie banner gebouwd, NIET gecommit

---

## EERSTE ACTIE: LEES DIT BESTAND

Project staat op een ongebruikelijke locatie (OneDrive, niet Desktop):

```
C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei
```

---

## WAT ER SESSIE 24 IS GEDAAN

### 1. Shopify Customer Account API — COMPLEET
- `src/lib/shopify-customer.ts` — Login, register, password reset, get customer+orders, logout
- Gebruikt Storefront API mutations (public token, geen extra setup)
- Access token in httpOnly cookie (`vpl_customer_token`)

### 2. Auth API routes — COMPLEET
- `/api/auth/login` — Login + httpOnly cookie
- `/api/auth/register` — Registratie + auto-login + welkomstmail
- `/api/auth/recover` — Wachtwoord reset (anti-enumeration)
- `/api/auth/me` — Klantdata ophalen (profiel, adressen, orders)
- `/api/auth/logout` — Token revoken + cookie wissen
- Rate limiting op alle auth routes via middleware

### 3. LoginModal rewrite — COMPLEET
- 4 views: Inloggen, Registreren, Wachtwoord vergeten, Bevestiging verstuurd
- Animated transitions, wachtwoord oog-toggle, error handling
- Visueel gecheckt desktop + mobile (390px)

### 4. Account pagina — COMPLEET
- `src/app/account/page.tsx` — 3 tabs: Bestellingen, Adressen, Profiel
- Redirect naar homepage + login modal als niet ingelogd
- Order line items met product images + status badges
- Uitlog functionaliteit

### 5. Header update — COMPLEET
- Ingelogd: account icon (wine kleur) linkt naar /account
- Uitgelogd: opent login modal
- Werkt op desktop + mobile hamburger menu

### 6. Email templates — CODE COMPLEET, DESIGN BASIC
- `src/lib/email-templates.ts` — 5 templates met HTML + text fallback
- `src/lib/mailgun.ts` — HTML support toegevoegd
- Templates: newsletter welkom, contact bevestiging, notify-me bevestiging, account welkom, stock notification
- Preview route: `/api/email-preview?template=newsletter|contact|notify-me|account-welcome|stock-notification`
- **⚠ DESIGN IS TE BASIC** — Bart vindt ze "heel heel heel extreem basic"
- Moeten VEEL mooier: betere typografie, wijn-sfeer, kleurverlopen, afbeeldingen, meer visuele flair

### 7. Newsletter + contact + notify-me routes — UPDATED
- Newsletter: stuurt nu welkomstmail na aanmelding
- Contact: stuurt bevestigingsmail naar afzender
- Notify-me: stuurt bevestigingsmail naar klant
- Alles non-blocking (`.catch()` zodat het formulier niet faalt als mail niet lukt)

### 8. Cookie banner redesign — COMPLEET
- Was: full-width banner onderin, overlapte modals op mobile
- Nu: compacte card rechtsonder (desktop) / full-width onderin (mobile)
- Toggle switches i.p.v. checkboxes
- Icons per categorie (Shield, BarChart3, Megaphone)
- Uitklapbaar details panel
- Visueel gecheckt desktop + mobile

---

## VOLGENDE SESSIE: Prioriteiten

### 1. ⚠ COMMIT + PUSH (EERSTE ACTIE)
Alles van sessie 24 is UNCOMMITTED. Veel gewijzigde + nieuwe bestanden:
- 9 gewijzigde bestanden
- 5 nieuwe mappen/bestanden (auth routes, account page, email templates, shopify-customer)
- Commit alles, push naar master (auto-deploy Vercel)

### 2. 🎨 Email templates REDESIGN (HOGE PRIORITEIT)
De huidige templates zijn te basic. Maak ze premium:
- **Meer visuele flair**: wijn-gerelateerde sfeerbeelden, decoratieve elementen
- **Betere typografie**: serif headings (Playfair-achtig via web-safe fallbacks), grotere hero tekst
- **Kleurverlopen**: wine-to-dark gradients in de header
- **Product afbeeldingen**: in stock-notification en notify-me templates
- **Sociale icons**: Instagram link in footer
- **Separator elementen**: decoratieve lijnen, wijn-glas iconografie
- **Responsief**: 100% mobile-ready (alle email clients)
- Bekijk de huidige previews: `/api/email-preview?template=newsletter`
- **Verwijder `/api/email-preview` route voor productie** of gate achter auth

### 3. Mailgun configuratie
- [ ] Mailgun account aanmaken op app.mailgun.com
- [ ] Domein `mg.vinoperlei.nl` toevoegen en DNS records instellen
- [ ] Echte API key + domein in `.env.local` en Vercel env vars
- [ ] Test mails versturen naar bart.mail14@gmail.com

### 4. Shopify Admin: klantaccounts activeren
- [ ] Shopify Admin → Settings → Customer accounts → Activeren
- [ ] Testen: registreren via de website, inloggen, orders bekijken

### 5. Shopify notification templates (orderbevestiging etc.)
- [ ] Shopify Admin → Settings → Notifications
- [ ] Templates customizen met Vino per Lei branding + NL teksten
- [ ] Orderbevestiging, verzendbevestiging, account welkom, wachtwoord reset

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
| **Laatste commit** | `35367a6` — docs: update handoff (sessie 23) |
| **NIET gecommit** | ALLES van sessie 24 (auth, account, emails, cookie banner) |
| **E-mail utility** | `src/lib/mailgun.ts` (Mailgun REST API, EU region, HTML support) |
| **Email preview** | `/api/email-preview?template=newsletter\|contact\|notify-me\|account-welcome\|stock-notification` |
| **Handleiding** | Alle 18 screenshots geannoteerd, live op Vercel |

## Nieuwe bestanden sessie 24

```
src/lib/shopify-customer.ts      — Shopify Customer API (Storefront mutations)
src/lib/email-templates.ts       — 5 HTML email templates
src/app/api/auth/login/route.ts  — Login endpoint
src/app/api/auth/register/route.ts — Register + auto-login + welkomstmail
src/app/api/auth/recover/route.ts  — Password reset
src/app/api/auth/me/route.ts      — Get customer data
src/app/api/auth/logout/route.ts   — Logout + token revoke
src/app/api/email-preview/route.ts — DEV ONLY: email template preview
src/app/account/page.tsx           — Account pagina (orders, adressen, profiel)
```

## Belangrijke regels

- **NOOIT `next dev` in foreground draaien** — crasht Claude Code
- **Production test:** `npm run build && npx next start --port 3099 > /dev/null 2>&1 &`
- **Port killen:** `npx --yes kill-port 3099`
- **Vercel deploy:** Git push triggert auto-deploy
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- **Playwright:** Sluit ALLE Chrome vensters voordat je Playwright MCP start
- **Build check:** `npx tsc --noEmit` — NOOIT `next dev`
- **OneDrive:** File locks workaround: schrijf naar Desktop/temp, dan kopiëren
