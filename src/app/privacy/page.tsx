import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/shopify-cms";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Privacybeleid | Vino per Lei",
  description:
    "Lees hoe Vino per Lei omgaat met jouw persoonsgegevens. Transparant en conform de AVG.",
};

export default async function PrivacyPage() {
  const page = await getPage("privacybeleid");

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Juridisch</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {page?.title ?? "Privacybeleid"}
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
          <PrivacyFallback />
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

/** Hardcoded GDPR-compliant Dutch privacy policy fallback when CMS returns null. */
function PrivacyFallback() {
  const prose =
    "prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2";

  return (
    <div className={prose}>
      <h2>1. Wie zijn wij?</h2>
      <p>
        <strong>Vino per Lei</strong><br />
        Pastorielaan 56, 5504 CR Veldhoven<br />
        KvK: 98874977<br />
        BTW: NL005360033B10<br />
        E-mail: <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>
      </p>
      <p>
        Vino per Lei is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid.
      </p>

      <h2>2. Welke persoonsgegevens verwerken wij?</h2>
      <p>Wij verwerken de volgende persoonsgegevens wanneer je onze diensten gebruikt:</p>
      <ul>
        <li><strong>Naam</strong> (voor- en achternaam)</li>
        <li><strong>E-mailadres</strong></li>
        <li><strong>Adresgegevens</strong> (bij bestelling: straat, huisnummer, postcode, woonplaats)</li>
        <li><strong>Telefoonnummer</strong> (optioneel, bij bestelling)</li>
        <li><strong>Betaalgegevens</strong> (verwerkt via Shopify Payments; wij slaan geen creditcardnummers op)</li>
        <li><strong>Geboortedatum of leeftijdsbevestiging</strong> (i.v.m. de wettelijke leeftijdsgrens van 18 jaar voor alcohol)</li>
        <li><strong>IP-adres en browsergegevens</strong> (automatisch bij websitebezoek)</li>
      </ul>

      <h2>3. Doeleinden van verwerking</h2>
      <p>Wij verwerken jouw gegevens voor de volgende doeleinden:</p>
      <ul>
        <li><strong>Uitvoering van je bestelling</strong> &mdash; verwerking, verzending en facturering</li>
        <li><strong>Klantenservice</strong> &mdash; beantwoording van vragen en klachten</li>
        <li><strong>Nieuwsbrief</strong> &mdash; alleen met jouw uitdrukkelijke toestemming</li>
        <li><strong>Wettelijke verplichtingen</strong> &mdash; zoals belastingadministratie en leeftijdsverificatie</li>
        <li><strong>Websiteverbetering</strong> &mdash; anonieme analyse van bezoekgedrag (alleen met toestemming)</li>
      </ul>

      <h2>4. Rechtsgrondslag</h2>
      <p>Wij verwerken jouw gegevens op basis van:</p>
      <ul>
        <li><strong>Uitvoering van een overeenkomst</strong> &mdash; noodzakelijk voor het verwerken van je bestelling</li>
        <li><strong>Toestemming</strong> &mdash; voor het verzenden van de nieuwsbrief en het plaatsen van analytische cookies</li>
        <li><strong>Wettelijke verplichting</strong> &mdash; fiscale bewaarplicht en leeftijdsverificatie (Drank- en Horecawet)</li>
        <li><strong>Gerechtvaardigd belang</strong> &mdash; beveiliging van de website en fraudepreventie</li>
      </ul>

      <h2>5. Bewaartermijnen</h2>
      <ul>
        <li><strong>Bestelgegevens</strong>: 7 jaar (wettelijke fiscale bewaarplicht)</li>
        <li><strong>Klantaccountgegevens</strong>: tot je het account verwijdert of ons verzoekt dit te doen</li>
        <li><strong>Nieuwsbriefgegevens</strong>: tot je je uitschrijft</li>
        <li><strong>Contactformulier</strong>: maximaal 12 maanden na afhandeling</li>
        <li><strong>Websitelogboeken</strong>: maximaal 26 maanden</li>
      </ul>

      <h2>6. Jouw rechten</h2>
      <p>Op grond van de AVG (GDPR) heb je de volgende rechten:</p>
      <ul>
        <li><strong>Recht op inzage</strong> &mdash; je mag opvragen welke gegevens wij van je hebben</li>
        <li><strong>Recht op correctie</strong> &mdash; je mag onjuiste gegevens laten aanpassen</li>
        <li><strong>Recht op verwijdering</strong> &mdash; je mag ons verzoeken je gegevens te verwijderen</li>
        <li><strong>Recht op beperking</strong> &mdash; je mag ons vragen de verwerking te beperken</li>
        <li><strong>Recht op dataportabiliteit</strong> &mdash; je mag je gegevens in een gangbaar formaat opvragen</li>
        <li><strong>Recht op bezwaar</strong> &mdash; je mag bezwaar maken tegen verwerking op basis van gerechtvaardigd belang</li>
        <li><strong>Recht om toestemming in te trekken</strong> &mdash; je kunt je toestemming voor de nieuwsbrief of cookies altijd intrekken</li>
      </ul>
      <p>
        Om een verzoek in te dienen, stuur een e-mail naar{" "}
        <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>. Wij reageren binnen 30 dagen.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Onze website maakt gebruik van cookies. Lees meer over welke cookies wij gebruiken en hoe je
        deze kunt beheren in ons{" "}
        <Link href="/cookies">cookiebeleid</Link>.
      </p>

      <h2>8. Derde partijen</h2>
      <p>Wij delen persoonsgegevens met de volgende derde partijen, uitsluitend voor de genoemde doeleinden:</p>
      <ul>
        <li><strong>Shopify</strong> &mdash; webshopplatform, betalingsverwerking en orderafhandeling</li>
        <li><strong>PostNL / DHL</strong> &mdash; bezorging van bestellingen</li>
        <li><strong>Vercel</strong> &mdash; hosting van de website</li>
        <li><strong>Web3Forms</strong> &mdash; verwerking van contactformulieren</li>
        <li><strong>Mailgun</strong> &mdash; verzending van transactionele e-mails en nieuwsbrieven</li>
        <li><strong>Google Analytics</strong> &mdash; websiteanalyse (alleen met jouw toestemming)</li>
      </ul>
      <p>
        Alle bovengenoemde partijen zijn gevestigd in de EU of werken onder adequaatbeidsbesluiten
        of standaard contractbepalingen (SCC&apos;s) conform de AVG.
      </p>

      <h2>9. Beveiliging</h2>
      <p>
        Wij nemen passende technische en organisatorische maatregelen om jouw gegevens te beschermen,
        waaronder SSL-encryptie, beveiligde servers en toegangscontrole.
      </p>

      <h2>10. Klachten</h2>
      <p>
        Heb je een klacht over hoe wij met jouw gegevens omgaan? Neem dan eerst contact met ons op
        via <a href="mailto:info@vinoperlei.nl">info@vinoperlei.nl</a>. Je hebt ook het recht om een
        klacht in te dienen bij de{" "}
        <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
          Autoriteit Persoonsgegevens
        </a>
        , de Nederlandse toezichthouder voor gegevensbescherming.
      </p>

      <h2>11. Wijzigingen</h2>
      <p>
        Wij kunnen dit privacybeleid van tijd tot tijd aanpassen. De meest actuele versie is altijd
        te vinden op deze pagina. Bij significante wijzigingen informeren wij je per e-mail.
      </p>
    </div>
  );
}
