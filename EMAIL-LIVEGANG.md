# Vino per Lei - e-mail livegang

## Telefoonnummer

Geen actie. Het telefoonnummer wordt niet op de website getoond en hoeft voor livegang niet alsnog toegevoegd te worden.

## 1. Testmails controleren

Test minimaal in Gmail en Outlook, zowel desktop als mobiel.

Site-e-mails die via de code/Mailgun lopen:

- Nieuwsbrief welkom
- Contactformulier bevestiging
- Mail bij voorraad bevestiging
- Account welkom
- Voorraad weer beschikbaar
- Verlaten winkelmand

Gebruik voor lokale testverzending:

```bash
EMAIL_TEST_RECIPIENTS="gmail-adres@example.com,outlook-adres@example.com" npm run email:test
```

Checklist per inbox:

- Logo laadt correct.
- Layout blijft binnen de mailbreedte op mobiel.
- CTA-knoppen zijn zichtbaar en klikbaar.
- Productafbeeldingen laden of vallen netjes weg.
- Preheader is niet zichtbaar in de mailbody.
- Afzender, reply-to en onderwerp zijn correct.
- Geen rare tekens in eurotekens, apostrofs, streepjes of accenten.
- Mail komt niet in spam/promoties terecht, of SPF/DKIM/DMARC moet nog worden gecontroleerd.

Preview route:

```text
/api/email-preview?template=newsletter&key=EMAIL_PREVIEW_SECRET
/api/email-preview?template=contact&key=EMAIL_PREVIEW_SECRET
/api/email-preview?template=notify-me&key=EMAIL_PREVIEW_SECRET
/api/email-preview?template=account-welcome&key=EMAIL_PREVIEW_SECRET
/api/email-preview?template=stock-notification&key=EMAIL_PREVIEW_SECRET
/api/email-preview?template=abandoned-cart&key=EMAIL_PREVIEW_SECRET
/api/email-preview?template=subjects&key=EMAIL_PREVIEW_SECRET
```

## 2. Shopify onderwerpregels naar Nederlands

Shopify-notificatieonderwerpen staan in Shopify Admin, niet in de Next.js-codebase. Zet deze in:

| Shopify notificatie | Nederlandse onderwerpregel |
|---|---|
| Order confirmation | `Bestelling bevestigd - {{ name }}` |
| Order edited | `Je bestelling is bijgewerkt - {{ name }}` |
| Order cancelled | `Je bestelling is geannuleerd - {{ name }}` |
| Refund created | `Terugbetaling verwerkt - {{ name }}` |
| Draft order invoice | `Factuur voor je bestelling bij Vino per Lei` |
| Shipping confirmation | `Je bestelling is onderweg - {{ fulfillment.tracking_company }}` |
| Shipping update | `Update over je verzending - {{ name }}` |
| Out for delivery | `Je bestelling wordt vandaag bezorgd - {{ name }}` |
| Delivered | `Je bestelling is bezorgd - {{ name }}` |
| Customer account invite | `Activeer je account bij Vino per Lei` |
| Customer account welcome | `Welkom bij Vino per Lei` |
| Customer password reset | `Stel je wachtwoord opnieuw in` |
| Abandoned checkout | `Je winkelmand wacht nog op je` |
| Gift card created | `Je cadeaubon van Vino per Lei` |

Route in Shopify Admin:

```text
Settings -> Notifications -> Customer notifications -> open template -> Subject
```

Na aanpassen: stuur per template een testmail vanuit Shopify naar Gmail en Outlook.

## 3. Auto-reply op info@vinoperlei.nl

Directe mails naar `info@vinoperlei.nl` worden niet door deze website afgehandeld. Zet een auto-reply in bij de mailprovider of in de mailbox zelf.

Voorstel:

```text
Onderwerp: We hebben je bericht ontvangen

Hoi,

Dank je wel voor je bericht aan Vino per Lei. We hebben je mail ontvangen en reageren meestal binnen 1-2 werkdagen.

Gaat je vraag over een bestelling? Stuur dan, als je dat nog niet hebt gedaan, je ordernummer mee. Dan kunnen we sneller met je meekijken.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 4. Overige templates

Voor livegang is dit optioneel. Welkomstmail en voorraadmails staan al in de code. Verlaten winkelmand is nu ook voorbereid als lokale template, maar Shopify's native abandoned checkout mail moet nog in Shopify Admin worden geactiveerd en getest.
