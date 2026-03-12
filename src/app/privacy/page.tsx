import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacybeleid | Vino per Lei",
  description:
    "Lees hoe Vino per Lei omgaat met jouw persoonsgegevens. Transparant en conform de AVG.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Juridisch</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Privacybeleid
          </h1>
          <p className="text-grey text-sm">
            Laatst bijgewerkt: 12 maart 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose-wine space-y-10">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              1. Wie zijn wij?
            </h2>
            <p className="text-grey leading-relaxed mb-3">
              Vino per Lei is een online wijnwinkel gespecialiseerd in
              authentieke Italiaanse wijnen.
            </p>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>
                Bedrijfsnaam: Vino per Lei (eenmanszaak)
              </li>
              <li>KvK-nummer: 98874977</li>
              <li>Adres: Pastorielaan 56, 5504 CR Veldhoven</li>
              <li>E-mail: info@vinoperlei.nl</li>
              <li>
                Verantwoordelijke: Carla Daniels
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              2. Welke gegevens verzamelen wij?
            </h2>
            <p className="text-grey leading-relaxed mb-3">
              Wij verzamelen de volgende persoonsgegevens wanneer je onze
              webshop gebruikt:
            </p>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>
                <strong>Accountgegevens:</strong> naam, e-mailadres, wachtwoord
                (versleuteld)
              </li>
              <li>
                <strong>Bestelgegevens:</strong> naam, afleveradres,
                factuuradres, telefoonnummer
              </li>
              <li>
                <strong>Betalingsgegevens:</strong> worden verwerkt door onze
                betalingsprovider en niet door ons opgeslagen
              </li>
              <li>
                <strong>Leeftijdsverificatie:</strong> wij slaan op dat je hebt
                bevestigd 18 jaar of ouder te zijn (via cookie)
              </li>
              <li>
                <strong>Communicatie:</strong> berichten die je ons stuurt via
                het contactformulier of e-mail
              </li>
              <li>
                <strong>Technische gegevens:</strong> IP-adres, browsertype,
                apparaatinformatie (alleen via cookies, zie ons{" "}
                <Link href="/cookies" className="text-wine underline hover:text-wine-dark">
                  cookiebeleid
                </Link>
                )
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              3. Waarvoor gebruiken wij jouw gegevens?
            </h2>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>Het verwerken en verzenden van je bestellingen</li>
              <li>Het aanmaken en beheren van je account</li>
              <li>Klantenservice en communicatie over je bestelling</li>
              <li>
                Het versturen van onze nieuwsbrief (alleen met jouw
                toestemming)
              </li>
              <li>Wettelijke verplichtingen (bijv. leeftijdsverificatie)</li>
              <li>Verbetering van onze website en dienstverlening</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              4. Grondslagen voor verwerking
            </h2>
            <p className="text-grey leading-relaxed mb-3">
              Wij verwerken jouw gegevens op basis van:
            </p>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>
                <strong>Uitvoering van een overeenkomst:</strong> voor het
                verwerken van bestellingen
              </li>
              <li>
                <strong>Wettelijke verplichting:</strong> leeftijdscontrole bij
                alcoholverkoop
              </li>
              <li>
                <strong>Toestemming:</strong> voor het versturen van de
                nieuwsbrief en niet-essentiële cookies
              </li>
              <li>
                <strong>Gerechtvaardigd belang:</strong> voor het verbeteren van
                onze website
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              5. Cookies
            </h2>
            <p className="text-grey leading-relaxed">
              Wij maken gebruik van cookies om onze website goed te laten
              functioneren en om je ervaring te verbeteren. Lees ons volledige{" "}
              <Link href="/cookies" className="text-wine underline hover:text-wine-dark">
                cookiebeleid
              </Link>{" "}
              voor meer informatie over welke cookies wij gebruiken en hoe je
              deze kunt beheren.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              6. Verwerkers en derde partijen
            </h2>
            <p className="text-grey leading-relaxed mb-3">
              Wij delen jouw gegevens alleen met derde partijen die noodzakelijk
              zijn voor onze dienstverlening:
            </p>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>
                <strong>Shopify:</strong> ons e-commerce platform voor het
                verwerken van bestellingen
              </li>
              <li>
                <strong>Betalingsproviders:</strong> voor het veilig afhandelen
                van betalingen (iDEAL, creditcard, etc.)
              </li>
              <li>
                <strong>Bezorgdiensten:</strong> voor het bezorgen van je
                bestelling
              </li>
              <li>
                <strong>E-mailserviceprovider:</strong> voor het versturen van
                bestelbevestigingen en de nieuwsbrief
              </li>
            </ul>
            <p className="text-grey leading-relaxed mt-3">
              Met al deze partijen hebben wij verwerkersovereenkomsten gesloten
              conform de AVG.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              7. Bewaartermijnen
            </h2>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>
                <strong>Accountgegevens:</strong> zolang je account actief is,
                plus maximaal 2 jaar na inactiviteit
              </li>
              <li>
                <strong>Bestelgegevens:</strong> 7 jaar (wettelijke
                bewaarplicht)
              </li>
              <li>
                <strong>Nieuwsbrief:</strong> tot je je uitschrijft
              </li>
              <li>
                <strong>Contactberichten:</strong> maximaal 1 jaar na
                afhandeling
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              8. Jouw rechten
            </h2>
            <p className="text-grey leading-relaxed mb-3">
              Op grond van de AVG heb je de volgende rechten:
            </p>
            <ul className="text-grey leading-relaxed space-y-1 list-disc list-inside ml-2">
              <li>
                <strong>Recht op inzage:</strong> je kunt opvragen welke
                gegevens wij van je hebben
              </li>
              <li>
                <strong>Recht op correctie:</strong> je kunt onjuiste gegevens
                laten aanpassen
              </li>
              <li>
                <strong>Recht op verwijdering:</strong> je kunt vragen om je
                gegevens te laten verwijderen
              </li>
              <li>
                <strong>Recht op beperking:</strong> je kunt vragen om de
                verwerking te beperken
              </li>
              <li>
                <strong>Recht op overdraagbaarheid:</strong> je kunt je gegevens
                in een standaardformaat ontvangen
              </li>
              <li>
                <strong>Recht van bezwaar:</strong> je kunt bezwaar maken tegen
                de verwerking van je gegevens
              </li>
            </ul>
            <p className="text-grey leading-relaxed mt-3">
              Neem contact met ons op via{" "}
              <a
                href="mailto:info@vinoperlei.nl"
                className="text-wine underline hover:text-wine-dark"
              >
                info@vinoperlei.nl
              </a>{" "}
              om een van deze rechten uit te oefenen. Wij reageren binnen 30
              dagen.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              9. Beveiliging
            </h2>
            <p className="text-grey leading-relaxed">
              Wij nemen de bescherming van jouw gegevens serieus en nemen
              passende technische en organisatorische maatregelen om misbruik,
              verlies, onbevoegde toegang en andere onrechtmatige verwerking
              tegen te gaan. Onze website maakt gebruik van SSL-encryptie.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              10. Klachten
            </h2>
            <p className="text-grey leading-relaxed">
              Heb je een klacht over hoe wij met jouw gegevens omgaan? Neem dan
              eerst contact met ons op. Je hebt ook altijd het recht om een
              klacht in te dienen bij de Autoriteit Persoonsgegevens:{" "}
              <a
                href="https://autoriteitpersoonsgegevens.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine underline hover:text-wine-dark"
              >
                autoriteitpersoonsgegevens.nl
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              11. Wijzigingen
            </h2>
            <p className="text-grey leading-relaxed">
              Wij behouden ons het recht voor om dit privacybeleid aan te
              passen. De meest actuele versie vind je altijd op deze pagina. Bij
              belangrijke wijzigingen informeren wij je via e-mail of een
              melding op onze website.
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
