# Security Audit — Vino per Lei (10 juni 2026)

Volledige audit van codebase + live site (vinoperlei.nl). Bouwt voort op sessie 47
(JSON-LD escaping + dedicated CSRF_SECRET).

## Scope
Dependencies, secrets, HTTP-headers, CSRF, rate limiting, alle API-routes,
XSS-sinks, SSRF, auth/cookies, webhook-verificatie. Live geverifieerd waar mogelijk.

## Resultaat: GEEN kritieke of hoge bevindingen

### Geverifieerd in orde
| Gebied | Bevinding |
|--------|-----------|
| Dependencies | `npm audit` 0 kwetsbaarheden; Next 16.2.6, React 19.2.3, sharp 0.34.5, sanitize-html 2.17.4, zod 4.3.6 — allemaal actueel |
| Secrets | Geen hardcoded secrets in `src/`; geen `.env`-files in git-historie; `.gitignore` dekt `.env*` (behalve `.env.example`) |
| Headers (live getest) | CSP (`frame-ancestors 'none'`, `object-src 'none'`, `form-action` beperkt, `base-uri 'self'`), HSTS preload 2j, X-Frame-Options DENY, nosniff, COOP, Referrer-Policy, Permissions-Policy |
| CSRF | HMAC-signed double-submit token (v1.nonce.expiry.sig), TTL 24u, timing-safe compare server-side. **Live getest: POST zonder token → 403** |
| Same-origin | Alle muterende API's eisen Origin/Referer match. **Live getest: POST zonder origin → 403** |
| Rate limiting | Cookie-based HMAC-signed (5 req/min) op contact/newsletter/notify-me/auth-routes |
| Input-validatie | Zod-schema's + body-size caps (8–128KB) + content-type checks op alle POST-routes; honeypot op contact |
| XSS | Alle `dangerouslySetInnerHTML`-sinks via `sanitize-html` (tag/attribuut-allowlist, alleen https/mailto/tel, img alleen cdn.shopify.com/unsplash) of `jsonLdScript()` (`<`-escaping). 2x `innerHTML` in BlogAnimations = statische SVG, geen user-data |
| SSRF | `/api/remove-bg` accepteert alleen `https://cdn.shopify.com`, 10s timeout, 8MB cap, content-type check |
| Auth | Customer token in httpOnly/secure/sameSite=strict cookie; generieke foutmeldingen (geen user-enumeration); `no-store` op auth-routes en /account |
| Webhook | `/api/revalidate`: timing-safe Shopify HMAC óf secret-header |
| Email | Mailgun via HTTPS API + URLSearchParams (geen SMTP header-injectie); replyTo is zod-gevalideerd e-mailadres |
| email-preview | Secret-gated (`EMAIL_PREVIEW_SECRET`), faalt dicht als env ontbreekt |
| Age gate | Server-side afgedwongen in proxy voor /wijnen en /checkout |

### Restpunten (laag, geaccepteerde trade-offs)
1. **Rate limiter is cookie-based** → bypassbaar door cookies te wissen. Bewuste keuze
   (geen Redis-dependency). Bij daadwerkelijk misbruik: Upstash Redis / Vercel KV.
2. **CSP `script-src 'unsafe-inline'`** — nodig voor Next.js hydration zonder
   nonce-setup. Gedocumenteerd in `proxy.ts`. `script-src-attr 'none'` beperkt impact.
3. **`/api/auth/me` geeft 401 voor gasten** → console-error-noise bij elke page load.
   Cosmetisch; overweeg `200 {authenticated:false}` (vereist ook authStore-aanpassing).
4. **Dev-fallback `"vpl-development-csrf-fallback"`** in code — productie gebruikt
   `CSRF_SECRET` (staat in Vercel env), dus geen risico; alleen relevant als env ooit leeg raakt.

## Advies onderhoudscadans
- `npm audit` + `npm outdated` bij elke sessie (of maandelijks)
- Next.js patch-releases volgen (security releases worden actief uitgebuit)
- Vercel env secrets niet hergebruiken tussen doeleinden (is nu al gescheiden: CSRF_SECRET / RATE_LIMIT_SECRET / SHOPIFY_WEBHOOK_SECRET)
