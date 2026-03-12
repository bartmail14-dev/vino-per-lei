import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Retourbeleid | Vino per Lei",
  description:
    "Informatie over retourneren bij Vino per Lei. 14 dagen bedenktijd op ongeopende producten.",
};

export default function RetournerenPage() {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Klantenservice</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Retourbeleid
          </h1>
          <p className="text-grey">
            Niet tevreden? Wij helpen je graag met een retour.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              14 dagen bedenktijd
            </h2>
            <p className="text-grey leading-relaxed">
              Conform de Europese wetgeving heb je als consument het recht om je
              bestelling binnen <strong>14 dagen na ontvangst</strong> zonder
              opgave van redenen te retourneren. De bedenktijd gaat in op de dag
              nadat je de bestelling hebt ontvangen.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Uitzonderingen
            </h2>
            <div className="bg-warm-white rounded-lg p-6 border border-sand">
              <p className="text-grey leading-relaxed mb-3">
                Vanwege de aard van onze producten gelden de volgende
                uitzonderingen:
              </p>
              <ul className="text-grey leading-relaxed space-y-2 list-disc list-inside">
                <li>
                  <strong>Geopende flessen:</strong> Alcoholproducten waarvan de
                  verzegeling is verbroken, kunnen niet worden geretourneerd.
                  Dit is conform artikel 6:230p sub f BW.
                </li>
                <li>
                  <strong>Beschadigde verpakking:</strong> Producten die
                  duidelijk zijn gebruikt of waarvan de verpakking zodanig
                  beschadigd is dat de waarde is verminderd, kunnen geheel of
                  gedeeltelijk worden geweigerd.
                </li>
                <li>
                  <strong>Onjuiste opslag:</strong> Wijn die aantoonbaar
                  verkeerd is bewaard (bijv. blootgesteld aan extreme
                  temperaturen) na ontvangst kan niet worden geretourneerd.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Retourprocedure
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wine text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">
                    Meld je retour aan
                  </h3>
                  <p className="text-grey leading-relaxed">
                    Stuur een e-mail naar{" "}
                    <a
                      href="mailto:info@vinoperlei.nl"
                      className="text-wine underline hover:text-wine-dark"
                    >
                      info@vinoperlei.nl
                    </a>{" "}
                    met je bestelnummer en de reden van retour. Wij sturen je
                    binnen 2 werkdagen een retourbevestiging.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wine text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">
                    Verpak het product
                  </h3>
                  <p className="text-grey leading-relaxed">
                    Verpak de wijn zorgvuldig in de originele verpakking (of een
                    vergelijkbare doos). Zorg ervoor dat de flessen goed
                    beschermd zijn tegen breuk tijdens transport.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wine text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">
                    Verstuur het pakket
                  </h3>
                  <p className="text-grey leading-relaxed">
                    Stuur het pakket retour naar het adres dat in de
                    retourbevestiging staat vermeld. Bewaar het verzendbewijs
                    totdat de retour is verwerkt.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Retourkosten
            </h2>
            <p className="text-grey leading-relaxed">
              De kosten voor het retourneren zijn voor rekening van de consument,
              tenzij het product beschadigd of foutief geleverd is. In dat
              geval nemen wij de retourkosten op ons.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Terugbetaling
            </h2>
            <p className="text-grey leading-relaxed">
              Na ontvangst en controle van de retourzending ontvang je binnen{" "}
              <strong>14 dagen</strong> het aankoopbedrag terug op dezelfde
              betaalmethode waarmee je hebt betaald. Bij gedeeltelijke
              retourzendingen worden alleen de geretourneerde producten
              terugbetaald.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Beschadigd ontvangen?
            </h2>
            <p className="text-grey leading-relaxed">
              Heb je een beschadigd product ontvangen? Neem dan zo snel mogelijk
              (binnen 48 uur) contact met ons op via{" "}
              <a
                href="mailto:info@vinoperlei.nl"
                className="text-wine underline hover:text-wine-dark"
              >
                info@vinoperlei.nl
              </a>{" "}
              met foto&apos;s van de schade. Wij zorgen dan voor een passende
              oplossing — een nieuw product of volledige terugbetaling.
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
            href="/klantenservice/verzending"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            Verzending & Levering &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
