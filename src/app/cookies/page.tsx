import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookiebeleid | Vino per Lei",
  description:
    "Lees welke cookies Vino per Lei gebruikt en hoe je deze kunt beheren.",
};

export default function CookiesPage() {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Juridisch</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Cookiebeleid
          </h1>
          <p className="text-grey text-sm">
            Laatst bijgewerkt: 12 maart 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Wat zijn cookies?
            </h2>
            <p className="text-grey leading-relaxed">
              Cookies zijn kleine tekstbestanden die op je apparaat worden
              opgeslagen wanneer je een website bezoekt. Ze helpen de website om
              jouw voorkeuren te onthouden en de site goed te laten
              functioneren. Sommige cookies zijn essentieel voor de werking van
              de website, terwijl andere helpen bij het verbeteren van je
              ervaring.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Welke cookies gebruiken wij?
            </h2>

            {/* Functional Cookies */}
            <div className="mb-8">
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                1. Functionele cookies (noodzakelijk)
              </h3>
              <p className="text-grey leading-relaxed mb-4">
                Deze cookies zijn nodig om de website goed te laten werken. Ze
                kunnen niet worden uitgeschakeld.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-sand rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-warm-white">
                      <th className="text-left p-3 font-semibold text-charcoal border-b border-sand">
                        Cookie
                      </th>
                      <th className="text-left p-3 font-semibold text-charcoal border-b border-sand">
                        Doel
                      </th>
                      <th className="text-left p-3 font-semibold text-charcoal border-b border-sand">
                        Bewaartermijn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-grey">
                    <tr className="border-b border-sand/50">
                      <td className="p-3 font-mono text-xs">
                        vpl_age_verified
                      </td>
                      <td className="p-3">
                        Onthoudt dat je hebt bevestigd 18 jaar of ouder te zijn
                      </td>
                      <td className="p-3">Sessie</td>
                    </tr>
                    <tr className="border-b border-sand/50">
                      <td className="p-3 font-mono text-xs">
                        vpl_cookie_consent
                      </td>
                      <td className="p-3">
                        Slaat je cookievoorkeuren op
                      </td>
                      <td className="p-3">1 jaar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* localStorage */}
            <div className="mb-8">
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                2. Lokale opslag (functioneel)
              </h3>
              <p className="text-grey leading-relaxed mb-4">
                Naast cookies gebruiken wij{" "}
                <span className="font-mono text-xs bg-warm-white px-1.5 py-0.5 rounded">
                  localStorage
                </span>{" "}
                voor de volgende doeleinden. Deze gegevens worden alleen in jouw
                browser opgeslagen en niet naar onze servers verstuurd.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-sand rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-warm-white">
                      <th className="text-left p-3 font-semibold text-charcoal border-b border-sand">
                        Sleutel
                      </th>
                      <th className="text-left p-3 font-semibold text-charcoal border-b border-sand">
                        Doel
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-grey">
                    <tr className="border-b border-sand/50">
                      <td className="p-3 font-mono text-xs">Winkelwagen</td>
                      <td className="p-3">
                        Je winkelwagen inhoud zodat deze bewaard blijft
                      </td>
                    </tr>
                    <tr className="border-b border-sand/50">
                      <td className="p-3 font-mono text-xs">Verlanglijst</td>
                      <td className="p-3">
                        Je opgeslagen favoriete wijnen
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-xs">
                        Checkout gegevens
                      </td>
                      <td className="p-3">
                        Tijdelijke opslag van je bestelgegevens tijdens het
                        afreken-proces
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="mb-8">
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                3. Analytische cookies
              </h3>
              <p className="text-grey leading-relaxed">
                Op dit moment
                gebruiken wij geen analytische cookies. Wanneer wij dit in de
                toekomst wel doen (bijv. Google Analytics of een
                privacy-vriendelijk alternatief), zullen wij dit cookiebeleid
                bijwerken en je toestemming vragen via de cookiebanner.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                4. Marketing cookies
              </h3>
              <p className="text-grey leading-relaxed">
                Op dit
                moment gebruiken wij geen marketing- of trackingcookies. Mocht
                dit veranderen, dan wordt dit beleid bijgewerkt en vragen wij
                vooraf je toestemming.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Hoe kun je cookies beheren?
            </h2>
            <p className="text-grey leading-relaxed mb-3">
              Je kunt cookies beheren via de instellingen van je browser. In de
              meeste browsers kun je:
            </p>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>Alle cookies bekijken en verwijderen</li>
              <li>Cookies van bepaalde websites blokkeren</li>
              <li>Alle cookies van derden blokkeren</li>
              <li>Alle cookies wissen bij het sluiten van de browser</li>
            </ul>
            <p className="text-grey leading-relaxed mt-3">
              Let op: als je functionele cookies blokkeert, kan het zijn dat
              bepaalde onderdelen van de website niet goed werken (bijv. de
              leeftijdsverificatie of je winkelwagen).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Wijzigingen
            </h2>
            <p className="text-grey leading-relaxed">
              Wij behouden ons het recht voor om dit cookiebeleid aan te passen.
              De meest actuele versie vind je altijd op deze pagina.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Vragen?
            </h2>
            <p className="text-grey leading-relaxed">
              Heb je vragen over ons gebruik van cookies? Neem dan{" "}
              <Link
                href="/contact"
                className="text-wine underline hover:text-wine-dark"
              >
                contact
              </Link>{" "}
              met ons op of lees ons{" "}
              <Link
                href="/privacy"
                className="text-wine underline hover:text-wine-dark"
              >
                privacybeleid
              </Link>
              .
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
