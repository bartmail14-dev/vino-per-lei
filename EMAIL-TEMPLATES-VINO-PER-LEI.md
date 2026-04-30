# Vino per Lei - Mailtemplates

Deze templates zijn geschreven in de stijl van Vino per Lei: persoonlijk, rustig, deskundig en warm. Geen grote beloftes, geen schreeuwerige kortingstaal, geen telefoonnummer. De afzender mag voelen als Carla: iemand die weet wat ze kiest en graag helpt.

## Stijlregels

- Spreek de klant aan met `je` en `jij`.
- Houd zinnen kort en helder.
- Vermijd woorden als magie, passie, ontdek de wereld van, exclusief genieten en ultieme wijnbeleving.
- Benoem concreet wat iemand kan verwachten.
- Sluit af met Carla Daniels en Vino per Lei.
- Gebruik als CTA liever een rustige, duidelijke actie: `Bekijk je bestelling`, `Rond je bestelling af`, `Vraag advies aan Carla`.

## 1. Bestelling Bevestigd

**Onderwerp:** Bestelling bevestigd - {{ name }}

**Preheader:** We hebben je bestelling ontvangen en gaan ermee aan de slag.

```text
Hoi {{ customer.first_name | default: "daar" }},

Dank je wel voor je bestelling bij Vino per Lei.

We hebben je bestelling goed ontvangen. Hieronder vind je een overzicht van wat je hebt besteld. Zodra je pakket is ingepakt en onderweg gaat, ontvang je automatisch een verzendbevestiging.

We pakken elke fles zorgvuldig in, zodat je bestelling netjes en veilig aankomt.

Bestelling: {{ name }}

[Bekijk je bestelling]

Heb je nog iets door te geven over je bestelling? Reageer dan op deze mail. Dan kijken we met je mee.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 2. Bestelling Onderweg

**Onderwerp:** Je bestelling is onderweg - {{ name }}

**Preheader:** Je wijn is ingepakt en overgedragen aan de bezorger.

```text
Hoi {{ customer.first_name | default: "daar" }},

Goed nieuws: je bestelling is onderweg.

Je wijn is zorgvuldig ingepakt en overgedragen aan de bezorger. Via de track & trace kun je volgen wanneer het pakket wordt geleverd.

Bestelling: {{ name }}
Track & trace: {{ fulfillment.tracking_url }}

[Volg je pakket]

Tip van Carla: laat rode wijn na ontvangst even tot rust komen voordat je hem opent. Zeker na transport smaakt hij vaak mooier als hij een dag heeft kunnen staan.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 3. Bestelling Bezorgd

**Onderwerp:** Je bestelling is bezorgd - {{ name }}

**Preheader:** Veel plezier met je Italiaanse wijnen.

```text
Hoi {{ customer.first_name | default: "daar" }},

Je bestelling is bezorgd.

We hopen dat alles netjes is aangekomen en dat de flessen snel een goed moment krijgen. Of dat nu een uitgebreid diner is, een cadeau of gewoon een rustige avond thuis.

Is er iets niet goed gegaan met de levering? Reageer dan op deze mail. Dan lossen we het zorgvuldig op.

[Bekijk je bestelling]

Veel plezier met je wijn.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 4. Verlaten Winkelmand

**Onderwerp:** Je winkelmand wacht nog op je

**Preheader:** Je selectie staat nog klaar, zodat je rustig kunt afronden.

```text
Hoi {{ customer.first_name | default: "daar" }},

Je was bezig met een bestelling bij Vino per Lei. We bewaren je winkelmand nog even, zodat je later rustig kunt afronden.

Twijfel je nog tussen twee wijnen? Kies dan de fles die het beste past bij het moment:

- Frisse witte wijn voor borrel, vis en lichte gerechten.
- Barbera of Valpolicella voor pasta, risotto en doordeweekse diners.
- Barolo, Amarone of Ripasso voor avonden waarop de wijn wat meer aandacht mag krijgen.

[Rond je bestelling af]

Heb je liever persoonlijk advies? Reageer op deze mail en vertel kort wat je zoekt.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 5. Welkom Nieuwe Klant

**Onderwerp:** Welkom bij Vino per Lei

**Preheader:** Je account is aangemaakt. Wijn kiezen wordt vanaf nu eenvoudiger.

```text
Hoi {{ customer.first_name | default: "daar" }},

Welkom bij Vino per Lei.

Je account is aangemaakt. Vanaf nu kun je je bestellingen makkelijker terugvinden en later sneller afrekenen.

Bij Vino per Lei houden we de selectie bewust klein. Geen eindeloze schappen, maar Italiaanse wijnen die we zelf zouden schenken. Vooral van kleine wijnhuizen, aangevuld met een beperkt aantal wijnen via een importeur die we vertrouwen.

[Ga naar mijn account]

Fijn dat je er bent.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 6. Nieuwsbrief Welkom

**Onderwerp:** Welkom bij de Vino per Lei nieuwsbrief

**Preheader:** Af en toe een goede fles, een seizoentip en nieuws uit de collectie.

```text
Hoi,

Leuk dat je je hebt ingeschreven voor de nieuwsbrief van Vino per Lei.

Je krijgt geen wekelijkse stroom aanbiedingen. We sturen alleen iets als er echt wat te melden is: een nieuwe wijn, een seizoentip, een kleine selectie voor een diner of een fles die tijdelijk terug is.

Wat je kunt verwachten:

- Italiaanse wijnen die Carla zelf selecteert.
- Korte, bruikbare tips zonder wijnjargon.
- Advies voor eten, cadeau en gelegenheid.
- Geen spam.

[Bekijk de collectie]

Tot snel in je inbox.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 7. Contactformulier Bevestiging

**Onderwerp:** Bedankt voor je bericht - Vino per Lei

**Preheader:** We hebben je bericht ontvangen en reageren zo snel mogelijk.

```text
Hoi {{ naam }},

Dank je wel voor je bericht.

We hebben je vraag ontvangen en reageren meestal binnen 1-2 werkdagen. Gaat je bericht over een bestelling? Stuur dan, als je dat nog niet hebt gedaan, je ordernummer mee. Dan kunnen we sneller meekijken.

In de tussentijd kun je alvast door de collectie bladeren of de veelgestelde vragen bekijken.

[Bekijk onze wijnen]

Met warme groet,
Carla Daniels
Vino per Lei
```

## 8. Auto-reply Info Mailbox

**Onderwerp:** We hebben je bericht ontvangen

**Preheader:** Dank je wel voor je mail aan Vino per Lei.

```text
Hoi,

Dank je wel voor je bericht aan Vino per Lei.

We hebben je mail ontvangen en reageren meestal binnen 1-2 werkdagen. Gaat je vraag over een bestelling? Stuur dan, als je dat nog niet hebt gedaan, je ordernummer mee. Dan kunnen we sneller met je meekijken.

Zoek je wijnadvies? Vertel kort voor welk moment je een fles zoekt, welk budget je ongeveer in gedachten hebt en of je liever rood, wit, rosé of mousserend drinkt.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 9. Mail Bij Voorraad - Bevestiging

**Onderwerp:** We houden je op de hoogte

**Preheader:** Je ontvangt een mail zodra deze wijn weer beschikbaar is.

```text
Hoi,

We hebben je aanvraag ontvangen.

Je krijgt een mail zodra deze wijn weer beschikbaar is:

{{ product.title }}

Sommige wijnen komen in beperkte aantallen binnen. Als je een melding krijgt, is het dus verstandig om niet te lang te wachten.

[Bekijk vergelijkbare wijnen]

Met warme groet,
Carla Daniels
Vino per Lei
```

## 10. Voorraad Terug

**Onderwerp:** {{ product.title }} is weer op voorraad

**Preheader:** De wijn waar je op wachtte is weer beschikbaar.

```text
Hoi,

Goed nieuws: {{ product.title }} is weer op voorraad.

Deze wijn is opnieuw beschikbaar in de webshop. Omdat we bewust klein inkopen, kan de voorraad beperkt zijn.

[Bekijk en bestel]

Wil je eerst weten of deze wijn past bij je diner of cadeau? Reageer op deze mail, dan denkt Carla met je mee.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 11. Wijnadvies Follow-up

**Onderwerp:** Een paar wijnen die goed bij je vraag passen

**Preheader:** Carla heeft een korte selectie voor je gemaakt.

```text
Hoi {{ naam }},

Dank je wel voor je vraag. Op basis van wat je zoekt, zou ik deze richting kiezen:

1. {{ wijn_1 }}
Waarom: {{ reden_1 }}

2. {{ wijn_2 }}
Waarom: {{ reden_2 }}

3. {{ wijn_3 }}
Waarom: {{ reden_3 }}

Als je twijfelt, zou ik voor {{ beste_keuze }} gaan. Dat is de veiligste keuze voor jouw moment.

[Bekijk de wijnen]

Met warme groet,
Carla Daniels
Vino per Lei
```

## 12. Bedankmail Na Eerste Bestelling

**Onderwerp:** Dank je wel voor je eerste bestelling

**Preheader:** Fijn dat je voor Vino per Lei hebt gekozen.

```text
Hoi {{ customer.first_name | default: "daar" }},

Dank je wel voor je eerste bestelling bij Vino per Lei.

We vinden het belangrijk dat online wijn kopen niet voelt als gokken. Daarom houden we de collectie klein en kiezen we alleen flessen waar we echt achter staan.

Na ontvangst van je bestelling horen we graag wat je ervan vindt. Geen uitgebreid formulier, gewoon een korte reactie als je daar zin in hebt.

[Bekijk je bestelling]

Veel plezier met je wijn.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 13. Review Verzoek

**Onderwerp:** Hoe beviel je wijn?

**Preheader:** Een korte reactie helpt ons en andere wijnliefhebbers.

```text
Hoi {{ customer.first_name | default: "daar" }},

We zijn benieuwd hoe je wijn is bevallen.

Een korte reactie helpt ons om de selectie scherp te houden. En het helpt andere klanten om met meer vertrouwen een fles te kiezen.

Je hoeft geen wijnkenner te zijn. Een simpele zin is genoeg:

"Mooi bij pasta."
"Frisser dan verwacht."
"Gekocht als cadeau en viel goed in de smaak."

[Laat een reactie achter]

Dank je wel.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 14. Cadeaubon

**Onderwerp:** Je cadeaubon van Vino per Lei

**Preheader:** Een rustig gekozen cadeau voor iemand die van goede wijn houdt.

```text
Hoi,

Je cadeaubon van Vino per Lei staat klaar.

Met deze bon kiest de ontvanger zelf een Italiaanse wijn uit onze collectie. Handig als je wel iets moois wilt geven, maar niet precies weet welke fles het beste past.

Code: {{ gift_card.code }}
Waarde: {{ gift_card.initial_value }}

[Bekijk de collectie]

Met warme groet,
Carla Daniels
Vino per Lei
```

## 15. Seizoensmail - Voorjaarsselectie

**Onderwerp:** Drie wijnen voor lichtere avonden

**Preheader:** Frisse Italiaanse flessen voor voorjaar, borrel en tafel.

```text
Hoi,

De avonden worden lichter, en dat vraagt vaak om andere wijn.

Voor dit seizoen zou ik kiezen voor wijnen die fris blijven, maar niet dun worden. Denk aan een zuivere witte wijn, een rosé met genoeg karakter of een mousserende wijn die niet te zoet is.

Mijn korte selectie:

- {{ wijn_1 }} - voor borrel en lichte gerechten.
- {{ wijn_2 }} - voor salade, vis of gegrilde groenten.
- {{ wijn_3 }} - voor als er iets te vieren is zonder dat het groot hoeft te worden.

[Bekijk de selectie]

Met warme groet,
Carla Daniels
Vino per Lei
```

## 16. Seizoensmail - Decemberselectie

**Onderwerp:** Wijnen voor diners, cadeaus en lange avonden

**Preheader:** Carla's selectie voor de decembertafel.

```text
Hoi,

December vraagt om wijnen die iets kunnen dragen.

Niet per se zwaar of duur, wel flessen met genoeg karakter voor een diner, een cadeau of een avond waarop er wat langer aan tafel wordt gezeten.

Mijn selectie voor deze maand:

- {{ wijn_1 }} - bij stoof, paddenstoelen of rijke pasta.
- {{ wijn_2 }} - als cadeau voor iemand die graag rood drinkt.
- {{ wijn_3 }} - voor het aperitief of oudejaarsavond.

Wil je dat ik even meedenk over jouw menu? Reageer op deze mail met wat je gaat eten.

[Bekijk de decemberselectie]

Met warme groet,
Carla Daniels
Vino per Lei
```

## 17. Order Geannuleerd

**Onderwerp:** Je bestelling is geannuleerd - {{ name }}

**Preheader:** We bevestigen hierbij de annulering van je bestelling.

```text
Hoi {{ customer.first_name | default: "daar" }},

Je bestelling {{ name }} is geannuleerd.

Als er al een betaling is gedaan, wordt de terugbetaling verwerkt via dezelfde betaalmethode. Afhankelijk van je bank kan het enkele werkdagen duren voordat het bedrag zichtbaar is.

Was dit niet de bedoeling of heb je een vraag over de annulering? Reageer dan op deze mail.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 18. Terugbetaling

**Onderwerp:** Terugbetaling verwerkt - {{ name }}

**Preheader:** We hebben de terugbetaling voor je bestelling verwerkt.

```text
Hoi {{ customer.first_name | default: "daar" }},

We hebben de terugbetaling voor bestelling {{ name }} verwerkt.

Het bedrag wordt teruggestort via de betaalmethode waarmee je hebt betaald. Meestal staat het binnen enkele werkdagen op je rekening.

Heb je hier vragen over? Reageer gerust op deze mail.

Met warme groet,
Carla Daniels
Vino per Lei
```

## 19. Wachtwoord Reset

**Onderwerp:** Stel je wachtwoord opnieuw in

**Preheader:** Gebruik deze link om een nieuw wachtwoord te kiezen.

```text
Hoi {{ customer.first_name | default: "daar" }},

We hebben een verzoek ontvangen om je wachtwoord opnieuw in te stellen.

Via onderstaande knop kun je een nieuw wachtwoord kiezen. Heb je dit verzoek niet gedaan? Dan hoef je niets te doen.

[Nieuw wachtwoord kiezen]

Met warme groet,
Carla Daniels
Vino per Lei
```

## 20. Account Uitnodiging

**Onderwerp:** Activeer je account bij Vino per Lei

**Preheader:** Maak je account actief en bekijk je gegevens op één plek.

```text
Hoi {{ customer.first_name | default: "daar" }},

Je bent uitgenodigd om je account bij Vino per Lei te activeren.

Met een account kun je je bestellingen terugvinden en later sneller afrekenen.

[Activeer mijn account]

Fijn dat je klant bent bij Vino per Lei.

Met warme groet,
Carla Daniels
Vino per Lei
```

## Korte onderwerpregel-set Voor Shopify

```text
Bestelling bevestigd - {{ name }}
Je bestelling is bijgewerkt - {{ name }}
Je bestelling is geannuleerd - {{ name }}
Terugbetaling verwerkt - {{ name }}
Factuur voor je bestelling bij Vino per Lei
Je bestelling is onderweg - {{ name }}
Update over je verzending - {{ name }}
Je bestelling wordt vandaag bezorgd - {{ name }}
Je bestelling is bezorgd - {{ name }}
Activeer je account bij Vino per Lei
Welkom bij Vino per Lei
Stel je wachtwoord opnieuw in
Je winkelmand wacht nog op je
Je cadeaubon van Vino per Lei
```
