# Vino per Lei — Volgende Sessie Instructies

**Datum**: 30 maart 2026 (na sessie 18)
**Prioriteit**: INVENTORY AFMAKEN (8) + CADEAUS UIT CMS + ADMIN SCREENSHOTS

---

## LEES DIT EERST

Code wijzigingen (Carla's feedback) zijn NIET gecommit. Inventory tracking is voor 2 extra producten gedaan.

---

## STAP 1: Inventory tracking afmaken (8 producten)

### Opstart
1. Sluit ALLE Chrome vensters
2. Start Playwright MCP
3. Navigeer naar `https://admin.shopify.com/store/vino-per-lei-2/products`
4. Bart logt in

### Producten (alle: tracking AAN + voorraad 48)
Per product: open → checkbox "Inventory not tracked" → klik Available "0" → New = 48 → Save popup → Save product → Next

1. Tenuta Val d'Ombra 'Ombra Alta'
2. Valpolicella Ripasso Superiore DOC
3. Rubinelli Vajol Valpolicella Ripasso
4. Amarone della Valpolicella DOCG
5. Nebbiolo Langhe DOC
6. Barolo Classico DOCG
7. Montaribaldi Barbera d'Alba
8. Montaribaldi Barolo DOCG

---

## STAP 2: Carla's feedback — CMS wijziging

### In Shopify CMS (via Playwright)
1. Content → Metaobjects → Categorie Blok → **"Cadeaus" entry verwijderen**

### Code "Cadeaus" link in Footer — AL VERWIJDERD (sessie 16, hardcoded links bevatten geen Cadeaus meer)

---

## STAP 3: Admin screenshots handleiding (als Bart ingelogd is)

Zie HANDOFF-VPL.md sectie "ONTBREKENDE ADMIN SCREENSHOTS" voor exacte lijst (12 screenshots).

---

## STAP 4: Build, commit & push

```bash
cd /c/Users/BartVisser/Desktop/vino-per-lei
npx --yes kill-port 3099
npm run build && npx next start --port 3099 > /dev/null 2>&1 &
```

Verifieer met Playwright:
- `/wijnen` → producten moeten "Op voorraad" badge tonen
- Productdetail → "In Winkelmand" knop actief
- Over Ons → wij-vorm tekst
- Footer → geen Pinterest icon

```bash
git add -A
git commit -m "feat: inventory tracking + carla feedback (filters, over-ons, footer)"
git push origin master
```

---

## WAT ER SESSIE 18 IS GEDAAN

### Code-wijzigingen (Carla's feedback) — NIET GECOMMIT
1. **Prijsfilter "Tot €10" verwijderd** — WijnenClient.tsx (bucket, opties, filter logic) + Header.tsx
2. **Barolo → Barbera** in "Authentieke Italiaanse Wijnen" SEO-sectie op /wijnen
3. **Over Ons herschreven naar wij-vorm** — hero, values, timeline, principes + "kleine wijnhuizen en importeur"
4. **Pinterest verwijderd uit Footer** — Instagram + Facebook behouden
5. **Metadata Over Ons** — ook naar wij-vorm
6. **Build succesvol** — alle wijzigingen compileren

### Inventory tracking (Shopify Admin)
- **Refosco dal Peduncolo Rosso DOC** — tracking AAN, 48 stuks ✅
- **Teroldego Rotaliano DOC** — tracking AAN, 48 stuks ✅

---

## Technische details
- **Build**: `npm run build`
- **Port**: 3099 (`npx next start --port 3099`)
- **NOOIT** `next dev` draaien — crasht Claude Code
- **Project locatie**: `C:\Users\BartVisser\Desktop\vino-per-lei`
- **Shopify Admin**: `https://admin.shopify.com/store/vino-per-lei-2`
