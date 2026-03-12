import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Vino per Lei",
  description:
    "De algemene voorwaarden van Vino per Lei. Informatie over bestellen, levering, retourneren en meer.",
};

export default function VoorwaardenPage() {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Juridisch</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Algemene Voorwaarden
          </h1>
          <p className="text-grey text-sm">
            Laatst bijgewerkt: 12 maart 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 1 — Definities
            </h2>
            <ul className="text-grey leading-relaxed space-y-2 list-disc list-inside ml-2">
              <li>
                <strong>Ondernemer:</strong> Vino per Lei (eenmanszaak),
                gevestigd te Pastorielaan 56, 5504 CR Veldhoven, ingeschreven bij de KvK onder
                nummer 98874977, BTW-nummer NL005360033B10.
              </li>
              <li>
                <strong>Consument:</strong> de natuurlijke persoon die niet
                handelt in de uitoefening van beroep of bedrijf en een
                overeenkomst op afstand aangaat met de ondernemer.
              </li>
              <li>
                <strong>Overeenkomst op afstand:</strong> een overeenkomst
                waarbij gebruik wordt gemaakt van het systeem van de ondernemer
                voor verkoop op afstand via de website vinoperlei.nl.
              </li>
              <li>
                <strong>Bedenktijd:</strong> de termijn waarbinnen de consument
                gebruik kan maken van zijn herroepingsrecht.
              </li>
              <li>
                <strong>Herroepingsrecht:</strong> de mogelijkheid voor de
                consument om binnen de bedenktijd af te zien van de overeenkomst
                op afstand.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 2 — Identiteit van de ondernemer
            </h2>
            <ul className="text-grey leading-relaxed space-y-1 list-none ml-2">
              <li>Handelsnaam: Vino per Lei</li>
              <li>Bedrijfsnaam: Vino per Lei (eenmanszaak)</li>
              <li>Adres: Pastorielaan 56, 5504 CR Veldhoven</li>
              {/* TODO: Carla moet telefoonnummer aanleveren */}
              <li>Telefoon: 040-XXX XXXX</li>
              <li>E-mail: info@vinoperlei.nl</li>
              <li>KvK-nummer: 98874977</li>
              <li>BTW-nummer: NL005360033B10</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 3 — Toepasselijkheid
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                Deze algemene voorwaarden zijn van toepassing op elk aanbod van
                de ondernemer en op elke tot stand gekomen overeenkomst op
                afstand.
              </li>
              <li>
                Voordat de overeenkomst op afstand wordt gesloten, wordt de
                tekst van deze algemene voorwaarden aan de consument beschikbaar
                gesteld.
              </li>
              <li>
                Door het plaatsen van een bestelling accepteert de consument deze
                algemene voorwaarden.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 4 — Het aanbod
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                Het aanbod bevat een volledige en nauwkeurige omschrijving van
                de aangeboden producten. Kennelijke vergissingen of fouten in het
                aanbod binden de ondernemer niet.
              </li>
              <li>
                Afbeeldingen bij producten zijn een waarheidsgetrouwe
                weergave. Kleine kleurafwijkingen door beeldschermen kunnen
                voorkomen.
              </li>
              <li>
                Alle producten zijn beschikbaar zolang de voorraad strekt.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 5 — De overeenkomst
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                De overeenkomst komt tot stand op het moment van aanvaarding door
                de consument van het aanbod en het voldoen aan de daarbij
                gestelde voorwaarden.
              </li>
              <li>
                De ondernemer bevestigt de ontvangst van de aanvaarding van het
                aanbod per e-mail.
              </li>
              <li>
                De ondernemer kan zich — binnen wettelijke kaders — op de hoogte
                stellen of de consument aan zijn betalingsverplichtingen kan
                voldoen, alsmede van feiten en factoren die van belang zijn voor
                een verantwoord aangaan van de overeenkomst op afstand.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 6 — Leeftijdsverificatie
            </h2>
            <div className="bg-warm-white rounded-lg p-6 border border-sand">
              <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside">
                <li>
                  De verkoop van alcoholhoudende dranken is uitsluitend
                  toegestaan aan personen van 18 jaar en ouder.
                </li>
                <li>
                  Bij het bezoeken van de website wordt de consument gevraagd te
                  bevestigen dat hij/zij 18 jaar of ouder is.
                </li>
                <li>
                  Bij levering kan de bezorger om een geldig legitimatiebewijs
                  vragen ter verificatie van de leeftijd. Indien de ontvanger
                  niet kan aantonen 18 jaar of ouder te zijn, wordt het pakket
                  niet afgegeven.
                </li>
                <li>
                  De ondernemer behoudt zich het recht voor bestellingen te
                  weigeren indien er twijfel bestaat over de leeftijd van de
                  consument.
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 7 — Herroepingsrecht
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                De consument heeft het recht de overeenkomst binnen{" "}
                <strong>14 dagen</strong> zonder opgave van redenen te
                ontbinden (bedenktijd). Deze termijn gaat in op de dag na
                ontvangst van het product.
              </li>
              <li>
                Tijdens de bedenktijd dient de consument zorgvuldig om te gaan
                met het product en de verpakking. Het product mag slechts worden
                uitgepakt voor zover dat nodig is om de aard en eigenschappen
                te beoordelen.
              </li>
              <li>
                <strong>Uitzonderingen op het herroepingsrecht:</strong>
              </li>
            </ol>
            <div className="bg-warm-white rounded-lg p-6 border border-sand mt-3">
              <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside">
                <li>
                  Geopende flessen wijn of andere alcoholproducten waarvan de
                  verzegeling is verbroken, kunnen niet worden geretourneerd
                  (conform art. 6:230p sub f BW)
                </li>
                <li>
                  Producten die door hun aard niet kunnen worden teruggezonden
                  (bijv. bederfelijke waren of producten die aan
                  temperatuurschommelingen zijn blootgesteld)
                </li>
              </ul>
            </div>
            <p className="text-grey leading-relaxed mt-3 ml-2">
              Zie ons{" "}
              <Link
                href="/klantenservice/retourneren"
                className="text-wine underline hover:text-wine-dark"
              >
                retourbeleid
              </Link>{" "}
              voor de volledige retourprocedure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 8 — Prijzen
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                Alle genoemde prijzen zijn in euro&apos;s en inclusief BTW.
              </li>
              <li>
                Verzendkosten zijn niet inbegrepen in de productprijs en worden
                apart vermeld bij het afrekenen. Zie ons{" "}
                <Link
                  href="/klantenservice/verzending"
                  className="text-wine underline hover:text-wine-dark"
                >
                  verzendbeleid
                </Link>{" "}
                voor actuele tarieven.
              </li>
              <li>
                De ondernemer behoudt zich het recht voor prijzen te wijzigen.
                Prijswijzigingen hebben geen invloed op reeds geplaatste
                bestellingen.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 9 — Betaling
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                Betaling geschiedt op het moment van bestelling via een van de
                aangeboden betaalmethodes: iDEAL, creditcard (Visa,
                Mastercard), PayPal of Bancontact.
              </li>
              <li>
                De consument heeft de plicht om onjuistheden in verstrekte
                betaalgegevens onverwijld aan de ondernemer te melden.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 10 — Levering
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                De ondernemer zal de grootst mogelijke zorgvuldigheid in acht
                nemen bij het in ontvangst nemen en bij de uitvoering van
                bestellingen.
              </li>
              <li>
                Levering vindt plaats op het door de consument opgegeven adres.
              </li>
              <li>
                De levertijd bedraagt doorgaans 1-2 werkdagen na ontvangst van
                de betaling, tenzij anders aangegeven.
              </li>
              <li>
                Het risico van beschadiging en/of vermissing van producten
                berust bij de ondernemer tot het moment van bezorging aan de
                consument.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 11 — Klachtenregeling
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                Klachten over de uitvoering van de overeenkomst moeten zo snel
                mogelijk, volledig en duidelijk omschreven worden ingediend bij
                de ondernemer via{" "}
                <a
                  href="mailto:info@vinoperlei.nl"
                  className="text-wine underline hover:text-wine-dark"
                >
                  info@vinoperlei.nl
                </a>
                .
              </li>
              <li>
                Bij de ondernemer ingediende klachten worden binnen 14 dagen
                beantwoord. Als een klacht een langere verwerkingstijd vraagt,
                wordt binnen 14 dagen geantwoord met een ontvangstbevestiging en
                een indicatie wanneer de consument een inhoudelijk antwoord kan
                verwachten.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 12 — Toepasselijk recht
            </h2>
            <ol className="text-grey leading-relaxed space-y-2 list-decimal list-inside ml-2">
              <li>
                Op alle overeenkomsten is uitsluitend Nederlands recht van
                toepassing.
              </li>
              <li>
                Geschillen worden bij uitsluiting voorgelegd aan de bevoegde
                rechter in het arrondissement van de vestigingsplaats van de
                ondernemer, tenzij de wet dwingend anders bepaalt.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Artikel 13 — Aanvullende bepalingen
            </h2>
            <p className="text-grey leading-relaxed">
              Aanvullende dan wel afwijkende bepalingen mogen niet ten nadele van
              de consument zijn en dienen schriftelijk te worden vastgelegd dan
              wel zodanig dat deze door de consument op een toegankelijke
              manier kunnen worden opgeslagen.
            </p>
          </section>
        </div>

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
