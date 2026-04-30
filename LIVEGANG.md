# Vino per Lei — Livegangdocumentatie

**Laatst bijgewerkt:** 30 april 2026
**Status:** PRE-LAUNCH — domein nog niet gekoppeld aan Vercel
**Huidige URL:** https://vino-per-lei.vercel.app
**Doel URL:** https://vinoperlei.nl

---

## 1. Shopify-Frontend Koppeling (GEVERIFIEERD)

De koppeling tussen Shopify (backend) en de Next.js storefront (frontend) is volledig werkend en end-to-end getest op 30 april 2026.

### Hoe het werkt

```
Carla wijzigt product in Shopify Admin
        ↓
Shopify stuurt webhook (JSON POST)
        ↓
/api/revalidate endpoint ontvangt webhook
        ↓
Next.js ISR revalideert: homepage, /wijnen, /wijnen/[handle], layout (mega menu)
        ↓
Bezoeker ziet direct de bijgewerkte content
```

### Wat is geconfigureerd

| Component | Detail | Status |
|-----------|--------|--------|
| Webhook endpoint | `/api/revalidate` (HMAC + secret auth) | LIVE |
| Webhook secret | `SHOPIFY_WEBHOOK_SECRET` in Vercel env vars | INGESTELD |
| Webhook 1 | `products/create` → `vino-per-lei.vercel.app/api/revalidate` | ACTIEF |
| Webhook 2 | `products/update` → `vino-per-lei.vercel.app/api/revalidate` | ACTIEF |
| Webhook 3 | `products/delete` → `vino-per-lei.vercel.app/api/revalidate` | ACTIEF |
| Shopify API versie | 2026-01 | CORRECT |
| ISR fallback | `dynamicParams = true` — nieuwe producten direct beschikbaar | ACTIEF |

### End-to-end test (30 apr 2026)

| Stap | Actie | Resultaat |
|------|-------|-----------|
| 1 | Testproduct "Brunello di Montalcino" aangemaakt (regio: Toscane, prijs: 49.95) | Product in Shopify |
| 2 | Productpagina `/wijnen/test-brunello-di-montalcino` gecontroleerd | 200 OK, content correct |
| 3 | Wijnenpagina: Toscane verschijnt in filters | Correct |
| 4 | Homepage: Toscane verschijnt op kaart + regio-knoppen | Correct (8x) |
| 5 | Testproduct verwijderd uit Shopify | HTTP 200 |
| 6 | Productpagina toont "niet gevonden" + 404 | Correct |
| 7 | Wijnenpagina: Brunello = 0 resultaten | Correct |

### Wat wordt automatisch bijgewerkt

- Homepage: SVG kaart (actieve regio's), regio-knoppen, featured products
- Mega menu: dynamische REGIO kolom met links
- Wijnenpagina: filters (regio/type/druif), productgrid, counts, subtitle
- Productpagina's: prijs, beschrijving, voorraadstatus, regio-spotlight
- SEO metadata wijnenpagina: dynamische regiovermelding in description

### Risico's en aandachtspunten

| Risico | Impact | Mitigatie |
|--------|--------|-----------|
| Region naam mismatch | Nieuwe regio verschijnt niet op kaart/filters | `.trim()` vangt spaties op. Spelfouten niet. Bekende 22 regio's + aliassen in `src/lib/region-utils.ts`. Bij problemen: log `product.region` en voeg alias toe. |
| Shopify API downtime | Pagina toont oude (gecachte) data | ISR cache serveert stale content. Geen pagina-crash. |
| Webhook secret lekt | Ongeautoriseerde revalidatie | Secret is alleen in Vercel env vars, nooit in code of git. |

---

## 2. DNS: Domein koppelen aan Vercel

### ACTIE BIJ LIVEGANG

Het domein `vinoperlei.nl` wijst momenteel naar TransIP hosting (37.97.254.27). Dit moet naar Vercel.

#### Stap 1: Vercel domein toevoegen

```bash
cd "C:/Users/BartVisser/OneDrive - Blue Wire Media/Archief/Oude-Projecten/Vino-Per-Lei"
npx vercel domains add vinoperlei.nl
npx vercel domains add www.vinoperlei.nl
```

#### Stap 2: TransIP DNS records aanpassen

Login: https://www.transip.nl/cp/ (account: vinoperlei)

| Type | Naam | Huidige waarde | Nieuwe waarde |
|------|------|---------------|---------------|
| A | @ | 37.97.254.27 | 76.76.21.21 |
| AAAA | @ | 2a01:7c8:3:1337::27 | VERWIJDEREN |
| CNAME | www | - | cname.vercel-dns.com. |

Behoud de bestaande MX, SPF, DKIM en DMARC records (e-mail via M365).

#### Stap 3: Shopify webhooks updaten

Na DNS propagatie moeten de 3 webhook-adressen worden bijgewerkt:

```bash
# Webhook IDs (aangemaakt 30 apr 2026):
# 2190242906439 (products/create)
# 2190243201351 (products/update)
# 2190243430727 (products/delete)
#
# Update via Shopify Admin API of via:
# https://admin.shopify.com/store/vino-per-lei-2/settings/notifications
#
# Wijzig: vino-per-lei.vercel.app/api/revalidate → vinoperlei.nl/api/revalidate
```

#### Stap 4: SSL certificaat

Vercel regelt automatisch een Let's Encrypt SSL certificaat na DNS propagatie. Controleer na 10-15 minuten:

```bash
curl -I https://vinoperlei.nl
# Verwacht: HTTP/2 200, strict-transport-security header
```

---

## 3. Shopify Store: Password Protection verwijderen

De store staat op wachtwoord. Dit verklaart waarom de checkout niet werkt voor bezoekers.

```
Shopify Admin → Online Store → Preferences → Password protection → Uitschakelen
```

---

## 4. Shopify Payments activeren

**Vereist actie van Carla.** Zonder Shopify Payments kan niemand betalen.

```
Shopify Admin → Settings → Payments → Shopify Payments activeren
```

Benodigde gegevens:
- KvK-nummer
- Bankrekening (IBAN)
- Legitimatiebewijs (ID/paspoort)
- BSN (voor belastingverificatie)

Na activatie werken automatisch: iDEAL, creditcard, Bancontact, Apple Pay, Google Pay.

---

## 5. DMARC Record (TransIP DNS)

Voorkomt dat e-mails van @vinoperlei.nl als spam worden gemarkeerd.

| Type | Naam | Waarde |
|------|------|--------|
| TXT | _dmarc | `v=DMARC1; p=quarantine; rua=mailto:Carla@vinoperlei.nl; pct=100` |

---

## 6. E-mail Templates

18 Shopify notification templates zijn vertaald naar Nederlands (subject lines).
4 custom HTML templates zijn geïnjecteerd (order confirmation, shipping confirmation, shipping update, refund).

### Verificatie voor livegang

- [ ] Stuur testbestelling via Shopify Admin
- [ ] Controleer order confirmation e-mail (layout, logo, product images)
- [ ] Controleer shipping confirmation e-mail na markeren als verzonden

### E-mail setup status

| Component | Status |
|-----------|--------|
| Sender: orders@vinoperlei.nl | Geverifieerd in Shopify |
| SPF + DKIM (Shopify) | Authenticated (groen) |
| SPF + DKIM (M365) | Werkend |
| Forwarding Carla → vinoperlei@outlook.com | Actief |
| Shared mailboxen (info@, facturatie@, orders@) | Aangemaakt |

---

## 7. WELKOM10 Announcement Bar

De WELKOM10 promotiebanner is momenteel uit de frontend gefilterd (code toont fallback "Gratis verzending vanaf EUR100"). Om dit schoon op te lossen:

```
Shopify Admin → Content → Metaobjects → announcement_bar → "main"
→ Zet "enabled" op false
→ Of vervang de WELKOM10 tekst door een nieuw bericht
```

---

## 8. Openstaande items (vereist Carla)

| # | Item | Status | Wie |
|---|------|--------|-----|
| 1 | Shopify Payments activeren | WACHT OP CARLA | Carla (KvK, bank, ID) |
| 2 | "Ons Verhaal" tekst voor Over Ons pagina | WACHT OP CARLA | Carla |
| 3 | e-Boekhouden koppeling | WACHT OP CARLA | Carla |
| 4 | M365 transport rules updaten (handtekeningen) | WACHT OP MFA | Carla (MFA login) |
| 5 | Password protection verwijderen | VOOR LIVEGANG | Carla/Bart |
| 6 | DNS omzetten naar Vercel | VOOR LIVEGANG | Bart |
| 7 | DMARC record toevoegen | VOOR LIVEGANG | Bart |
| 8 | Shopify webhooks → vinoperlei.nl updaten | NA DNS | Bart |

---

## 9. Livegang Checklist

### Dag van livegang (in deze volgorde)

- [ ] **DNS**: TransIP A-record → 76.76.21.21, www CNAME → cname.vercel-dns.com
- [ ] **Vercel**: `npx vercel domains add vinoperlei.nl` + `www.vinoperlei.nl`
- [ ] **SSL**: Wacht 10-15 min, controleer `curl -I https://vinoperlei.nl`
- [ ] **Webhooks**: Update 3 webhook-adressen naar `vinoperlei.nl/api/revalidate`
- [ ] **Shopify**: Password protection uitschakelen
- [ ] **Shopify**: Shopify Payments activeren (als nog niet gedaan)
- [ ] **DMARC**: TXT record toevoegen in TransIP
- [ ] **Test**: Bezoek homepage, wijnenpagina, productpagina
- [ ] **Test**: Plaats testbestelling (checkout flow)
- [ ] **Test**: Controleer order confirmation e-mail
- [ ] **Test**: Wijzig product in Shopify → controleer of site bijwerkt (webhook)
- [ ] **WELKOM10**: Announcement bar opschonen in Shopify CMS

### Na livegang

- [ ] Google Search Console: site claimen + sitemap indienen
- [ ] Google Analytics: property aanmaken + script toevoegen
- [ ] Seizoenstip aanpasbaar maken vanuit Shopify (metafield)
- [ ] Over Ons pagina vullen met Carla's tekst

---

## 10. Inloggegevens

| Systeem | URL | Account |
|---------|-----|---------|
| Shopify Admin (Partner) | https://partners.shopify.com | b.visser@bluewiremedia.nl |
| Shopify Admin (Store) | https://admin.shopify.com/store/vino-per-lei-2 | Via Partner access |
| TransIP DNS | https://www.transip.nl/cp/ | vinoperlei |
| M365 Admin | https://admin.cloud.microsoft | Carla@vinoperlei.nl |
| Vercel Dashboard | https://vercel.com | bartmail14-dev |
| GitHub | https://github.com/bartmail14-dev/vino-per-lei | bartmail14-dev |

---

## 11. Technische referentie

| Veld | Waarde |
|------|--------|
| Codebase | `C:\Users\BartVisser\OneDrive - Blue Wire Media\Archief\Oude-Projecten\Vino-Per-Lei\` |
| Build commando | `npm run build && npx next start --port 3099` |
| Port cleanup | `npx --yes kill-port 3099` |
| NOOIT draaien | `next dev` (crasht sessie) |
| Vercel project | `prj_cPx7xKK0P3NC1NkkXGeaEnHLLeDr` |
| Shopify Storefront API | via `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` |
| Shopify Admin API | via `SHOPIFY_ADMIN_ACCESS_TOKEN` |
| Webhook secret | via `SHOPIFY_WEBHOOK_SECRET` (alleen in Vercel prod env) |
| Webhook IDs | 2190242906439, 2190243201351, 2190243430727 |
| Regio mapping | `src/lib/region-utils.ts` (22 regio's + aliassen) |
| Revalidatie endpoint | `src/app/api/revalidate/route.ts` |
