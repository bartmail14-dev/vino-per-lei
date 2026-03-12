import type { Metadata } from "next";
import Link from "next/link";
import { FAQAccordion } from "./FAQAccordion";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen | Vino per Lei",
  description:
    "Antwoorden op veelgestelde vragen over bestellen, betalen, verzenden en retourneren bij Vino per Lei.",
};

const faqCategories = [
  {
    title: "Bestellen",
    items: [
      {
        question: "Hoe plaats ik een bestelling?",
        answer:
          "Blader door ons assortiment, voeg wijnen toe aan je winkelwagen en ga naar de checkout. Vul je gegevens in, kies een betaalmethode en bevestig je bestelling. Je ontvangt direct een orderbevestiging per e-mail.",
      },
      {
        question: "Kan ik mijn bestelling nog wijzigen of annuleren?",
        answer:
          "Dat kan, zolang je bestelling nog niet is verzonden. Neem zo snel mogelijk contact met ons op via info@vinoperlei.nl met je bestelnummer. Wij doen ons best om je verzoek te verwerken.",
      },
      {
        question: "Is het mogelijk om als cadeau te bestellen?",
        answer:
          "Ja! Bij het afrekenen kun je aangeven dat het om een cadeau gaat. We voegen dan geen factuur toe aan het pakket. Je kunt ook een persoonlijk bericht toevoegen.",
      },
    ],
  },
  {
    title: "Betalen",
    items: [
      {
        question: "Welke betaalmethodes accepteren jullie?",
        answer:
          "Wij accepteren iDEAL, creditcard (Visa en Mastercard), PayPal en Bancontact. Alle betalingen worden veilig verwerkt via een SSL-beveiligde verbinding.",
      },
      {
        question: "Is betalen bij Vino per Lei veilig?",
        answer:
          "Absoluut. Onze website is volledig SSL-beveiligd en betalingen worden verwerkt door gecertificeerde betalingsproviders. Wij slaan zelf geen betalingsgegevens op.",
      },
    ],
  },
  {
    title: "Verzending",
    items: [
      {
        question: "Wat zijn de verzendkosten?",
        answer:
          "Standaard verzending kost \u20AC4,95. Bij bestellingen vanaf \u20AC35 is verzending gratis. Avondlevering kost \u20AC7,95. Verzending naar Belgi\u00EB kost \u20AC8,95 (gratis vanaf \u20AC75).",
      },
      {
        question: "Hoe lang duurt de levering?",
        answer:
          "Bestellingen die voor 14:00 worden geplaatst, worden dezelfde dag verzonden. De levertijd is 1-2 werkdagen voor Nederland en 2-3 werkdagen voor Belgi\u00EB.",
      },
      {
        question: "Hoe worden de flessen verpakt?",
        answer:
          "Elke fles wordt zorgvuldig verpakt in speciale wijnverpakkingen die beschermen tegen breuk. Bij extreme temperaturen nemen wij extra maatregelen om de kwaliteit te waarborgen.",
      },
      {
        question: "Kan ik mijn bestelling volgen?",
        answer:
          "Ja, zodra je bestelling is verzonden ontvang je een Track & Trace code per e-mail waarmee je de bezorging live kunt volgen.",
      },
    ],
  },
  {
    title: "Retourneren",
    items: [
      {
        question: "Kan ik mijn bestelling retourneren?",
        answer:
          "Ja, je hebt 14 dagen bedenktijd na ontvangst. De flessen moeten ongeopend en in goede staat zijn. Geopende flessen kunnen helaas niet worden geretourneerd. Zie ons retourbeleid voor de volledige voorwaarden.",
      },
      {
        question: "Hoe lang duurt het voordat ik mijn geld terugkrijg?",
        answer:
          "Na ontvangst en controle van je retourzending ontvang je binnen 14 dagen het aankoopbedrag terug op dezelfde betaalmethode waarmee je hebt betaald.",
      },
      {
        question: "Wat als ik een beschadigde fles heb ontvangen?",
        answer:
          "Neem binnen 48 uur contact met ons op via info@vinoperlei.nl met foto\u2019s van de schade. Wij zorgen dan voor een passende oplossing \u2014 een nieuwe fles of volledige terugbetaling.",
      },
    ],
  },
  {
    title: "Leeftijdsverificatie",
    items: [
      {
        question: "Waarom moet ik mijn leeftijd bevestigen?",
        answer:
          "De Nederlandse wet verbiedt de verkoop van alcohol aan personen onder de 18 jaar. Wij zijn wettelijk verplicht om de leeftijd van onze klanten te verifi\u00EBren.",
      },
      {
        question: "Wordt mijn leeftijd ook bij bezorging gecontroleerd?",
        answer:
          "Ja, de bezorger kan bij aflevering om een geldig legitimatiebewijs vragen. Als de ontvanger niet kan aantonen 18 jaar of ouder te zijn, wordt het pakket niet afgegeven.",
      },
    ],
  },
  {
    title: "Wijn bewaren",
    items: [
      {
        question: "Hoe bewaar ik wijn het beste thuis?",
        answer:
          "Bewaar wijn op een koele (12-16\u00B0C), donkere plek met een constante temperatuur. Leg flessen met een kurk horizontaal zodat de kurk vochtig blijft. Vermijd trillingen en sterke geuren in de buurt.",
      },
      {
        question: "Hoe lang kan ik wijn bewaren?",
        answer:
          "Dit verschilt sterk per wijn. De meeste wijnen die wij verkopen zijn klaar om te drinken. Bij elke wijn vermelden wij een drinkadvies. Heb je specifieke vragen? Neem gerust contact met ons op.",
      },
      {
        question: "Op welke temperatuur serveer ik wijn?",
        answer:
          "Rode wijn: 16-18\u00B0C (even koelen is vaak beter dan kamertemperatuur). Witte wijn: 8-12\u00B0C. Ros\u00E9: 8-10\u00B0C. Mousserende wijn: 6-8\u00B0C.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Klantenservice</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Veelgestelde Vragen
          </h1>
          <p className="text-grey">
            Vind snel antwoord op je vraag. Staat je vraag er niet bij?{" "}
            <Link
              href="/contact"
              className="text-wine underline hover:text-wine-dark"
            >
              Neem contact op
            </Link>
            .
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-10">
          {faqCategories.map((category) => (
            <section key={category.title}>
              <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                {category.title}
              </h2>
              <div className="bg-white rounded-lg border border-sand overflow-hidden">
                <div className="px-6">
                  {category.items.map((item) => (
                    <FAQAccordion
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-warm-white rounded-lg p-8 text-center border border-sand">
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">
            Vraag niet gevonden?
          </h2>
          <p className="text-grey mb-6">
            Ons team staat voor je klaar om je te helpen.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors"
          >
            Neem Contact Op
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-sand">
          <Link
            href="/klantenservice"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar Klantenservice
          </Link>
        </div>
      </div>
    </div>
  );
}
