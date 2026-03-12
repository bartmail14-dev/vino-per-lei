import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verzending & Levering | Vino per Lei",
  description:
    "Informatie over verzending en levering bij Vino per Lei. Gratis verzending vanaf €35. Zorgvuldig verpakt en temperatuurgecontroleerd.",
};

export default function VerzendingPage() {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Klantenservice</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Verzending & Levering
          </h1>
          <p className="text-grey">
            Jouw wijn, veilig en snel bezorgd.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {/* Shipping Options */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-6">
              Verzendopties
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Standard */}
              <div className="bg-warm-white rounded-lg p-6 border border-sand">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-charcoal">
                    Standaard verzending
                  </h3>
                  <span className="text-wine font-semibold">&euro;4,95</span>
                </div>
                <ul className="text-grey text-sm leading-relaxed space-y-1">
                  <li>Levertijd: 1-2 werkdagen</li>
                  <li>Bezorging door PostNL/DPD</li>
                  <li>Track & Trace inbegrepen</li>
                </ul>
              </div>

              {/* Free shipping */}
              <div className="bg-wine/5 rounded-lg p-6 border border-wine/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-charcoal">
                    Gratis verzending
                  </h3>
                  <span className="text-success font-semibold">Gratis</span>
                </div>
                <ul className="text-grey text-sm leading-relaxed space-y-1">
                  <li>
                    Bij bestellingen vanaf <strong>&euro;35,00</strong>
                  </li>
                  <li>Levertijd: 1-2 werkdagen</li>
                  <li>Track & Trace inbegrepen</li>
                </ul>
              </div>

              {/* Evening delivery */}
              <div className="bg-warm-white rounded-lg p-6 border border-sand">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-charcoal">
                    Avondlevering
                  </h3>
                  <span className="text-wine font-semibold">&euro;7,95</span>
                </div>
                <ul className="text-grey text-sm leading-relaxed space-y-1">
                  <li>Bezorging tussen 18:00 - 22:00</li>
                  <li>Bestel voor 14:00, vanavond bezorgd</li>
                  <li>Beschikbaar in de meeste regio&apos;s</li>
                </ul>
              </div>

              {/* Belgium */}
              <div className="bg-warm-white rounded-lg p-6 border border-sand">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-charcoal">
                    Verzending Belgi&euml;
                  </h3>
                  <span className="text-wine font-semibold">&euro;8,95</span>
                </div>
                <ul className="text-grey text-sm leading-relaxed space-y-1">
                  <li>Levertijd: 2-3 werkdagen</li>
                  <li>Track & Trace inbegrepen</li>
                  <li>Gratis vanaf &euro;75,00</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Zorgvuldige verpakking
            </h2>
            <p className="text-grey leading-relaxed mb-3">
              Wijn is kwetsbaar — daarom besteden wij extra aandacht aan de
              verpakking van je bestelling:
            </p>
            <ul className="text-grey leading-relaxed space-y-2 list-disc list-inside ml-2">
              <li>
                <strong>Speciale wijnverpakkingen:</strong> elke fles wordt
                individueel beschermd in een stevige kartonnen wijnverpakking
              </li>
              <li>
                <strong>Temperatuurgecontroleerd:</strong> bij extreme
                warmte of kou nemen wij extra maatregelen om de kwaliteit van je
                wijn te waarborgen
              </li>
              <li>
                <strong>Duurzaam:</strong> onze verpakkingsmaterialen zijn
                recyclebaar
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Verzendgebied
            </h2>
            <p className="text-grey leading-relaxed">
              Wij verzenden momenteel naar:
            </p>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2 mt-2">
              <li>
                <strong>Nederland:</strong> geheel Nederland, inclusief de
                Waddeneilanden
              </li>
              <li>
                <strong>Belgi&euml;:</strong> geheel Belgi&euml;
              </li>
            </ul>
            <p className="text-grey leading-relaxed mt-3 text-sm">
              Woon je buiten deze gebieden en wil je toch bestellen? Neem{" "}
              <Link
                href="/contact"
                className="text-wine underline hover:text-wine-dark"
              >
                contact
              </Link>{" "}
              met ons op — we kijken graag naar de mogelijkheden.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Leeftijdscontrole bij levering
            </h2>
            <div className="bg-warm-white rounded-lg p-6 border border-sand">
              <p className="text-grey leading-relaxed">
                Omdat wij alcoholhoudende dranken verkopen, kan de bezorger bij
                aflevering om een geldig legitimatiebewijs vragen. Als de
                ontvanger niet kan aantonen 18 jaar of ouder te zijn, wordt het
                pakket <strong>niet</strong> afgegeven. In dat geval wordt het
                pakket teruggestuurd en nemen wij contact met je op.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Niet thuis bij bezorging?
            </h2>
            <p className="text-grey leading-relaxed">
              Als je niet thuis bent bij bezorging, laat de bezorger een bericht
              achter en wordt het pakket aangeboden bij een afhaalpunt in de
              buurt of de volgende werkdag opnieuw bezorgd. Via Track & Trace kun
              je de bezorging volgen en eventueel een ander aflevermoment kiezen.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Vragen over je bezorging?
            </h2>
            <p className="text-grey leading-relaxed">
              Heb je vragen over je bestelling of loopt de bezorging vertraging
              op? Neem dan{" "}
              <Link
                href="/contact"
                className="text-wine underline hover:text-wine-dark"
              >
                contact
              </Link>{" "}
              met ons op. Wij helpen je graag verder.
            </p>
          </section>
        </div>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-sand flex flex-wrap gap-4 justify-between">
          <Link
            href="/klantenservice"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar Klantenservice
          </Link>
          <Link
            href="/klantenservice/retourneren"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            Retourbeleid &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
