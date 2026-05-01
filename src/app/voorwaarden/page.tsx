import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/shopify-cms";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Vino per Lei",
  description:
    "De algemene voorwaarden van Vino per Lei. Informatie over bestellen, levering, retourneren en meer.",
};

export default async function VoorwaardenPage() {
  const page = await getPage("algemene-voorwaarden");

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Juridisch</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {page?.title ?? "Algemene Voorwaarden"}
          </h1>
          <p className="text-grey text-sm">
            Laatst bijgewerkt:{" "}
            {page?.updatedAt
              ? new Date(page.updatedAt).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "25 maart 2026"}
          </p>
        </div>

        {/* Content */}
        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.body) }}
          />
        ) : (
          <VoorwaardenFallback />
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-sand">
          <Link
            href="/"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar de homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Hardcoded Dutch Algemene Voorwaarden fallback — compliant with BW 6:230f, Distance Selling Directive 2011/83/EU, Drank- en Horecawet, and Consumer Rights Act. */
function VoorwaardenFallback() {
  const prose =
    "prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2";

  return (
    <div className={prose}>
      <h2>Artikel 1 &mdash; Definities</h2>
      <p>In deze algemene voorwaarden wordt verstaan onder:</p>
      <ol>
        <li><strong>Ondernemer</strong>: Vino per Lei, gevestigd te Veldhoven, ingeschreven bij de Kamer van Koophandel onder nummer 98874977.</li>
        <li><strong>Consument</strong>: de natuurlijke persoon die niet handelt in de uitoefening van beroep of bedrijf en een overeenkomst op afstand aangaat met de ondernemer.</li>
        <li><strong>Overeenkomst op afstand</strong>: een overeenkomst waarbij uitsluitend gebruik wordt gemaakt van technieken voor communicatie op afstand (de website).</li>
        <li><strong>Herroepingsrecht</strong>: de mogelijkheid voor de consument om binnen de bedenktijd af te zien van de overeenkomst op afstand.</li>
        <li><strong>Bedenktijd</strong>: de termijn van 14 dagen waarbinnen de consument gebruik kan maken van zijn herroepingsrecht.</li>
        <li><strong>Dag</strong>: kalenderdag.</li>
      </ol>

      <h2>Artikel 2 &mdash; Identiteit van de ondernemer</h2>
      <p>
        <strong>Vino per Lei</strong><br />
        Pastorielaan 56, 5504 CR Veldhoven<br />
        Telefoon: op aanvraag via e-mail<br />
        E-mail: <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a><br />
        KvK-nummer: 98874977<br />
        BTW-identificatienummer: NL005360033B10
      </p>

      <h2>Artikel 3 &mdash; Toepasselijkheid</h2>
      <ol>
        <li>Deze algemene voorwaarden zijn van toepassing op elk aanbod van de ondernemer en op elke tot stand gekomen overeenkomst op afstand tussen ondernemer en consument.</li>
        <li>Voordat de overeenkomst op afstand wordt gesloten, wordt de tekst van deze algemene voorwaarden aan de consument beschikbaar gesteld.</li>
        <li>Afwijking van deze voorwaarden is slechts mogelijk indien dit uitdrukkelijk schriftelijk is overeengekomen.</li>
        <li>Situaties die niet in deze algemene voorwaarden zijn geregeld, dienen te worden beoordeeld naar de geest van deze algemene voorwaarden.</li>
      </ol>

      <h2>Artikel 4 &mdash; Het aanbod</h2>
      <ol>
        <li>Alle aanbiedingen zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld. De ondernemer is gerechtigd het aanbod te wijzigen of in te trekken.</li>
        <li>Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden producten. Kennelijke vergissingen of fouten in het aanbod binden de ondernemer niet.</li>
        <li>Afbeeldingen bij producten zijn een zo waarheidsgetrouw mogelijke weergave. De ondernemer kan niet garanderen dat weergegeven kleuren exact overeenkomen met de werkelijke kleuren.</li>
        <li>Elk aanbod bevat zodanige informatie dat het voor de consument duidelijk is welke rechten en verplichtingen aan de aanvaarding zijn verbonden.</li>
      </ol>

      <h2>Artikel 5 &mdash; De overeenkomst</h2>
      <ol>
        <li>De overeenkomst komt tot stand op het moment dat de consument het aanbod aanvaardt en voldoet aan de daarbij gestelde voorwaarden.</li>
        <li>De ondernemer bevestigt de ontvangst van de aanvaarding per e-mail. Zolang de ontvangst niet is bevestigd, kan de consument de overeenkomst ontbinden.</li>
        <li>De ondernemer treft passende technische en organisatorische maatregelen ter beveiliging van de elektronische overdracht van gegevens en zorgt voor een veilige webomgeving (SSL/TLS-encryptie).</li>
      </ol>

      <h2>Artikel 6 &mdash; Leeftijdsverificatie</h2>
      <ol>
        <li>Op grond van de Drank- en Horecawet is het verboden om alcoholhoudende dranken te verkopen aan personen jonger dan 18 jaar.</li>
        <li>Door een bestelling te plaatsen, verklaart de consument 18 jaar of ouder te zijn.</li>
        <li>De ondernemer behoudt zich het recht voor om bij aflevering een geldig legitimatiebewijs te vragen (paspoort, ID-kaart of rijbewijs). Indien de ontvanger jonger dan 18 jaar blijkt of geen geldig legitimatiebewijs kan tonen, wordt de bestelling niet afgeleverd.</li>
        <li>In geval van niet-aflevering op grond van lid 3 worden de betaalde bedragen, na aftrek van de verzendkosten, teruggestort.</li>
        <li>Vino per Lei adviseert verantwoord alcoholgebruik. Neem voor vragen contact op met het Alcoholinfo-nummer: 0900-500 2021.</li>
      </ol>

      <h2>Artikel 7 &mdash; Herroepingsrecht</h2>
      <ol>
        <li>De consument kan een overeenkomst met betrekking tot de aankoop van een product gedurende een bedenktijd van <strong>14 dagen</strong> zonder opgave van redenen ontbinden (conform EU Richtlijn 2011/83/EU).</li>
        <li>De bedenktijd gaat in op de dag nadat de consument, of een vooraf door de consument aangewezen derde, het product heeft ontvangen.</li>
        <li>Om het herroepingsrecht uit te oefenen, stuurt de consument een ondubbelzinnige verklaring per e-mail naar <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a> met het ordernummer.</li>
        <li>Tijdens de bedenktijd zal de consument zorgvuldig omgaan met het product en de verpakking. De consument zal het product slechts uitpakken voor zover nodig om de aard en kenmerken van het product vast te stellen.</li>
      </ol>

      <h2>Artikel 8 &mdash; Uitzonderingen herroepingsrecht</h2>
      <p>Het herroepingsrecht is <strong>uitgesloten</strong> voor:</p>
      <ul>
        <li>Producten die na opening niet kunnen worden teruggestuurd om redenen van gezondheidsbescherming of hygi&euml;ne en waarvan de verzegeling na levering is verbroken (geopende flessen);</li>
        <li>Producten die door hun aard onherroepelijk vermengd zijn met andere producten;</li>
        <li>Op maat gemaakte of gepersonaliseerde cadeauverpakkingen.</li>
      </ul>
      <p>Ongeopende flessen wijn kunnen worden geretourneerd mits de verzegeling intact is en de fles onbeschadigd is.</p>

      <h2>Artikel 9 &mdash; Verplichtingen bij herroeping</h2>
      <ol>
        <li>De consument zendt het product zo snel mogelijk, maar uiterlijk binnen 14 dagen na de herroepingsmelding, terug. De consument draagt de directe kosten van retourzending.</li>
        <li>Het product wordt teruggestuurd met alle geleverde toebehoren, in originele staat en verpakking, voor zover redelijkerwijs mogelijk.</li>
        <li>Het risico en de bewijslast voor de juiste en tijdige uitoefening van het herroepingsrecht ligt bij de consument.</li>
        <li>De ondernemer vergoedt alle betalingen van de consument, inclusief de standaard leveringskosten, uiterlijk binnen 14 dagen volgend op de dag van herroepingsmelding. De ondernemer mag wachten met terugbetaling tot het product is terugontvangen.</li>
        <li>De ondernemer gebruikt voor terugbetaling hetzelfde betaalmiddel als door de consument is gebruikt, tenzij de consument instemt met een andere methode. De terugbetaling is kosteloos.</li>
      </ol>

      <h2>Artikel 10 &mdash; Prijzen</h2>
      <ol>
        <li>Alle prijzen zijn in euro&apos;s en inclusief BTW.</li>
        <li>Verzendkosten zijn niet inbegrepen en worden apart vermeld bij het afrekenen.</li>
        <li>Prijswijzigingen zijn voorbehouden. De prijs die gold op het moment van bestelling is bindend.</li>
        <li>De ondernemer kan niet gehouden worden aan prijzen die berusten op een kennelijke vergissing of drukfout.</li>
      </ol>

      <h2>Artikel 11 &mdash; Betaling</h2>
      <ol>
        <li>Betaling geschiedt via de betaalmethoden die op de website worden aangeboden (o.a. iDEAL, creditcard, Bancontact). De betaling wordt verwerkt door Shopify Payments.</li>
        <li>Betaling vindt plaats op het moment van bestellen. De bestelling wordt pas verwerkt na ontvangst van betaling.</li>
        <li>De consument heeft de plicht om onjuistheden in verstrekte betaalgegevens onverwijld aan de ondernemer te melden.</li>
        <li>In geval van wanbetaling heeft de ondernemer, behoudens wettelijke beperkingen, het recht om redelijke buitengerechtelijke incassokosten in rekening te brengen conform het Besluit vergoeding voor buitengerechtelijke incassokosten.</li>
      </ol>

      <h2>Artikel 12 &mdash; Levering</h2>
      <ol>
        <li>De ondernemer zal de grootst mogelijke zorgvuldigheid in acht nemen bij de uitvoering van bestellingen.</li>
        <li>Als plaats van levering geldt het adres dat de consument aan de ondernemer kenbaar heeft gemaakt.</li>
        <li>Levertijd bedraagt <strong>1&ndash;3 werkdagen</strong> na ontvangst van betaling (Nederland). Voor Belgi&euml; geldt 2&ndash;3 werkdagen. De uiterste leveringstermijn is 30 dagen, tenzij anders overeengekomen.</li>
        <li>Verzendkosten worden berekend bij het afrekenen en zijn afhankelijk van de gekozen verzendmethode.</li>
        <li>Verzending geschiedt via PostNL of een vergelijkbare bezorgdienst. De consument ontvangt een track &amp; trace code per e-mail.</li>
        <li>Het risico van beschadiging en/of vermissing van producten berust bij de ondernemer tot het moment van bezorging.</li>
        <li>Indien de bezorging vertraging ondervindt of niet kan worden uitgevoerd, ontvangt de consument hierover uiterlijk 30 dagen bericht. De consument heeft in dat geval het recht om de overeenkomst kosteloos te ontbinden.</li>
      </ol>

      <h2>Artikel 13 &mdash; Conformiteit en garantie</h2>
      <ol>
        <li>De ondernemer staat ervoor in dat de producten voldoen aan de overeenkomst, de in het aanbod vermelde specificaties en aan de redelijke eisen van deugdelijkheid.</li>
        <li>Indien een product bij levering beschadigd of gebrekkig is, dient de consument dit binnen 48 uur na ontvangst te melden aan <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>, bij voorkeur vergezeld van foto&apos;s.</li>
        <li>Bij gegronde klachten wordt het product kosteloos vervangen of wordt het aankoopbedrag volledig gerestitueerd.</li>
        <li>Wijn is een natuurproduct. Natuurlijke variaties in smaak, kleur of aroma zijn geen gebreken en vormen geen grond voor retourzending.</li>
      </ol>

      <h2>Artikel 14 &mdash; Klachtenregeling</h2>
      <ol>
        <li>Klachten over de uitvoering van de overeenkomst moeten zo spoedig mogelijk, volledig en duidelijk omschreven, worden ingediend via <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>.</li>
        <li>Bij de ondernemer ingediende klachten worden binnen een termijn van <strong>14 dagen</strong> beantwoord. Indien een klacht een langere verwerkingstijd vraagt, wordt binnen 14 dagen geantwoord met een bevestiging en een indicatie van wanneer een uitvoeriger antwoord kan worden verwacht.</li>
        <li>Indien de klacht niet in onderling overleg kan worden opgelost, kan de consument zich wenden tot de <a href="https://www.degeschillencommissie.nl" target="_blank" rel="noopener noreferrer">Geschillencommissie</a> of het <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">Europees ODR-platform</a>.</li>
      </ol>

      <h2>Artikel 15 &mdash; Intellectueel eigendom</h2>
      <ol>
        <li>Alle content op de website van Vino per Lei, waaronder teksten, afbeeldingen, logo&apos;s en productbeschrijvingen, is eigendom van Vino per Lei of haar licentiegevers en wordt beschermd door auteursrecht en andere intellectuele eigendomsrechten.</li>
        <li>Het is niet toegestaan om content van de website te kopi&euml;ren, verspreiden of op andere wijze te gebruiken zonder voorafgaande schriftelijke toestemming.</li>
      </ol>

      <h2>Artikel 16 &mdash; Aansprakelijkheid</h2>
      <ol>
        <li>De aansprakelijkheid van de ondernemer is beperkt tot het factuurbedrag van de betreffende bestelling, dan wel tot het bedrag dat in het desbetreffende geval door de aansprakelijkheidsverzekering wordt gedekt, vermeerderd met het eigen risico.</li>
        <li>De ondernemer is niet aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst of gemiste besparingen.</li>
        <li>De ondernemer is niet aansprakelijk voor schade als gevolg van overmatig of onverantwoord alcoholgebruik.</li>
      </ol>

      <h2>Artikel 17 &mdash; Overmacht</h2>
      <ol>
        <li>In geval van overmacht is de ondernemer niet gehouden tot het nakomen van enige verplichting jegens de consument.</li>
        <li>Onder overmacht wordt verstaan elke van de wil van de ondernemer onafhankelijke omstandigheid waardoor de nakoming geheel of gedeeltelijk wordt verhinderd, waaronder maar niet beperkt tot: natuurrampen, pandemie&euml;n, stakingen, overheidsmaatregelen, transport- en leveringsproblemen bij toeleveranciers, en storingen bij bezorgdiensten.</li>
        <li>Indien de overmacht langer dan 60 dagen voortduurt, heeft zowel de ondernemer als de consument het recht de overeenkomst te ontbinden, zonder verplichting tot schadevergoeding.</li>
      </ol>

      <h2>Artikel 18 &mdash; Privacy</h2>
      <p>
        Vino per Lei respecteert de privacy van haar klanten en verwerkt persoonsgegevens conform de AVG (GDPR). Lees ons{" "}
        <Link href="/privacy">privacybeleid</Link> voor uitgebreide informatie over hoe wij met persoonsgegevens omgaan.
      </p>

      <h2>Artikel 19 &mdash; Toepasselijk recht en geschillen</h2>
      <ol>
        <li>Op deze algemene voorwaarden en alle overeenkomsten is uitsluitend <strong>Nederlands recht</strong> van toepassing.</li>
        <li>Het Weens Koopverdrag (CISG) is niet van toepassing.</li>
        <li>Geschillen worden bij voorkeur in onderling overleg opgelost. Indien dit niet mogelijk is, wordt het geschil voorgelegd aan de bevoegde rechter in het arrondissement Oost-Brabant, tenzij de wet dwingend anders voorschrijft.</li>
      </ol>

      <h2>Artikel 20 &mdash; Wijzigingen</h2>
      <p>
        De ondernemer behoudt zich het recht voor om deze algemene voorwaarden te wijzigen. Wijzigingen treden in werking 30 dagen na publicatie op de website. De meest actuele versie is altijd te vinden op deze pagina.
      </p>
    </div>
  );
}
