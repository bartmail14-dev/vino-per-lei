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

/** Hardcoded Dutch Algemene Voorwaarden fallback (BW 6:230f compliant). */
function VoorwaardenFallback() {
  const prose =
    "prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2";

  return (
    <div className={prose}>
      <h2>Artikel 1 &mdash; Identiteit van de ondernemer</h2>
      <p>
        <strong>Vino per Lei</strong><br />
        Pastorielaan 56, 5504 CR Veldhoven<br />
        KvK: 98874977<br />
        BTW: NL005360033B10<br />
        E-mail: <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>
      </p>

      <h2>Artikel 2 &mdash; Toepasselijkheid</h2>
      <ol>
        <li>Deze algemene voorwaarden zijn van toepassing op elk aanbod van Vino per Lei en op elke tot stand gekomen overeenkomst op afstand.</li>
        <li>Door het plaatsen van een bestelling accepteert de klant deze voorwaarden.</li>
        <li>Vino per Lei behoudt zich het recht voor deze voorwaarden te wijzigen. De meest actuele versie is altijd beschikbaar op deze pagina.</li>
      </ol>

      <h2>Artikel 3 &mdash; Aanbod en prijzen</h2>
      <ol>
        <li>Alle prijzen op de website zijn in euro&apos;s en inclusief BTW.</li>
        <li>Verzendkosten zijn niet inbegrepen in de prijs en worden apart vermeld bij het afrekenen.</li>
        <li>Vino per Lei kan niet gehouden worden aan prijzen die berusten op een kennelijke vergissing of drukfout.</li>
        <li>Aanbiedingen gelden zolang de voorraad strekt en kunnen zonder voorafgaande kennisgeving worden gewijzigd.</li>
      </ol>

      <h2>Artikel 4 &mdash; Bestelprocedure</h2>
      <ol>
        <li>De klant voegt producten toe aan de winkelwagen en doorloopt het afrekenproces.</li>
        <li>Na het plaatsen van de bestelling ontvangt de klant een bevestigingsmail met het ordernummer.</li>
        <li>De overeenkomst komt tot stand op het moment dat Vino per Lei de bestelling bevestigt.</li>
        <li>Bij het plaatsen van een bestelling bevestigt de klant minimaal 18 jaar oud te zijn.</li>
      </ol>

      <h2>Artikel 5 &mdash; Herroepingsrecht</h2>
      <ol>
        <li>De klant heeft het recht de overeenkomst binnen <strong>14 dagen</strong> na ontvangst van het product zonder opgave van redenen te ontbinden (EU Wet Koop op Afstand / Richtlijn 2011/83/EU).</li>
        <li>Tijdens de bedenktijd zal de klant zorgvuldig omgaan met het product en de verpakking.</li>
        <li>Om het herroepingsrecht uit te oefenen, stuurt de klant een e-mail naar <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a> met het ordernummer en de reden van retour.</li>
        <li>Na goedkeuring stuurt de klant het product retour. De kosten van retourzending zijn voor rekening van de klant.</li>
        <li>Vino per Lei betaalt het aankoopbedrag (inclusief heenzendings&shy;kosten) binnen 14 dagen na ontvangst van de retour terug.</li>
      </ol>

      <h2>Artikel 6 &mdash; Uitzonderingen herroepingsrecht</h2>
      <p>Het herroepingsrecht is <strong>niet</strong> van toepassing op:</p>
      <ul>
        <li>Flessen die geopend, beschadigd of niet in originele verpakking zijn geretourneerd</li>
        <li>Producten die door hun aard niet kunnen worden teruggestuurd (bederfelijke waren)</li>
        <li>Op maat gemaakte of gepersonaliseerde cadeauverpakkingen</li>
      </ul>

      <h2>Artikel 7 &mdash; Betaling</h2>
      <ol>
        <li>Betaling geschiedt via het beveiligde betalingsplatform van Shopify.</li>
        <li>Beschikbare betaalmethoden: iDEAL, creditcard (Visa, Mastercard), PayPal en Bancontact.</li>
        <li>Betaling vindt plaats op het moment van bestellen. De bestelling wordt pas verwerkt na ontvangst van betaling.</li>
      </ol>

      <h2>Artikel 8 &mdash; Levering</h2>
      <ol>
        <li>Levertijd bedraagt 1&ndash;3 werkdagen na ontvangst van betaling (Nederland). Voor Belgi&euml; geldt een levertijd van 2&ndash;3 werkdagen.</li>
        <li>Gratis verzending bij bestellingen vanaf &euro;35 (Nederland).</li>
        <li>Vino per Lei verzendt met PostNL. De klant ontvangt een track &amp; trace code per e-mail.</li>
        <li>Bij aflevering wordt door de bezorger om <strong>legitimatie</strong> gevraagd. Alleen personen van 18 jaar en ouder mogen de bestelling in ontvangst nemen.</li>
        <li>Indien niemand aanwezig is of geen geldig legitimatiebewijs kan tonen, wordt de bestelling niet afgeleverd en opnieuw aangeboden of retour gestuurd.</li>
      </ol>

      <h2>Artikel 9 &mdash; Alcohol en leeftijdsverificatie</h2>
      <ol>
        <li>Vino per Lei verkoopt uitsluitend alcoholhoudende dranken aan personen van <strong>18 jaar en ouder</strong>, conform de Drank- en Horecawet.</li>
        <li>Bij het plaatsen van een bestelling bevestigt de klant de leeftijd van 18 jaar of ouder.</li>
        <li>Bij aflevering vindt leeftijdsverificatie plaats door de bezorger middels een geldig legitimatiebewijs (paspoort, ID-kaart of rijbewijs).</li>
        <li>Vino per Lei adviseert verantwoord alcoholgebruik. Neem voor vragen contact op met het Alcoholinfo-nummer: 0900-500 2021.</li>
      </ol>

      <h2>Artikel 10 &mdash; Klachtenprocedure</h2>
      <ol>
        <li>Klachten kunnen worden ingediend via <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>.</li>
        <li>Vino per Lei streeft ernaar klachten binnen 14 dagen af te handelen.</li>
        <li>Indien wij er samen niet uitkomen, kan de klant een geschil voorleggen aan de <a href="https://www.degeschillencommissie.nl" target="_blank" rel="noopener noreferrer">Geschillencommissie</a> of het <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">Europees ODR-platform</a>.</li>
      </ol>

      <h2>Artikel 11 &mdash; Aansprakelijkheid</h2>
      <ol>
        <li>De aansprakelijkheid van Vino per Lei is beperkt tot het bedrag dat door de klant is betaald voor de betreffende bestelling.</li>
        <li>Vino per Lei is niet aansprakelijk voor indirecte schade, gevolgschade of schade door onjuist gebruik van alcohol.</li>
        <li>Vino per Lei is niet aansprakelijk voor schade als gevolg van overmacht, waaronder maar niet beperkt tot stakingen, natuurrampen of storingen bij bezorgdiensten.</li>
      </ol>

      <h2>Artikel 12 &mdash; Privacy</h2>
      <p>
        Vino per Lei respecteert de privacy van haar klanten. Lees ons{" "}
        <Link href="/privacy">privacybeleid</Link> voor meer informatie over hoe wij met persoonsgegevens omgaan.
      </p>

      <h2>Artikel 13 &mdash; Toepasselijk recht en geschillen</h2>
      <ol>
        <li>Op alle overeenkomsten tussen Vino per Lei en de klant is <strong>Nederlands recht</strong> van toepassing.</li>
        <li>Geschillen worden bij voorkeur in onderling overleg opgelost. Indien dit niet mogelijk is, wordt het geschil voorgelegd aan de bevoegde rechter in het arrondissement Oost-Brabant.</li>
      </ol>
    </div>
  );
}
