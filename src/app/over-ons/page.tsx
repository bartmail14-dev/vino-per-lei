import Link from "next/link";
import { getPage, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";

import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Over Ons | Vino per Lei",
  description:
    "Ontdek het verhaal achter Vino per Lei — onze passie voor authentieke Italiaanse wijnen.",
  openGraph: {
    title: "Over Ons | Vino per Lei",
    description:
      "Ontdek het verhaal achter Vino per Lei — onze passie voor authentieke Italiaanse wijnen.",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

function WineGlassIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M8 2h8l-1 8a5 5 0 0 1-6 0L8 2z" />
      <path d="M12 10v8" />
      <path d="M8 22h8" />
    </svg>
  );
}

function HeartHandIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.833-4.5 2.045C10.832 3.833 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

const values = [
  {
    Icon: WineGlassIcon,
    title: "Handgeselecteerd",
    description:
      "Elke wijn in onze collectie is persoonlijk geproefd en geselecteerd. We werken alleen met familiewijngaarden die generaties lang dezelfde passie delen.",
  },
  {
    Icon: HeartHandIcon,
    title: "Met Liefde",
    description:
      "Vino per Lei betekent 'Wijn voor Haar'. We geloven dat elke fles een verhaal vertelt — van de wijngaard tot jouw tafel.",
  },
  {
    Icon: LeafIcon,
    title: "Duurzaam & Eerlijk",
    description:
      "Onze producenten werken met respect voor het land. Veel van onze wijnen zijn biologisch of biodynamisch geproduceerd.",
  },
  {
    Icon: TruckIcon,
    title: "Direct uit Italië",
    description:
      "Geen tussenpersonen. Wij importeren rechtstreeks van de wijngaard naar jouw deur, zodat je de beste prijs-kwaliteitverhouding krijgt.",
  },
];

export default async function OverOnsPage() {
  const [page, settings] = await Promise.all([
    getPage("over-ons"),
    getSiteSettings(),
  ]);
  const site = settings ?? DEFAULT_SITE_SETTINGS;

  return (
    <div className="bg-background">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <svg
          className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-[400px] text-white/[0.03] hidden lg:block"
          viewBox="0 0 120 260"
          fill="currentColor"
        >
          <rect x="48" y="0" width="24" height="14" rx="3" />
          <path d="M52 14h16v20l10 16v120c0 12-8 20-18 20H60c-10 0-18-8-18-20V50l10-16V14z" />
        </svg>

        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 lg:py-36">
          <p className="text-gold/80 text-xs font-medium tracking-[0.2em] uppercase mb-4">
            Ons Verhaal
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-semibold text-white mb-6 leading-[1.1]">
            Passie voor
            <br />
            <span className="text-gold">Italiaanse Wijn</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed">
            Achter elke fles schuilt een verhaal van generaties, terroir en
            vakmanschap. Wij brengen de mooiste Italiaanse wijnen naar jouw
            tafel — met zorg geselecteerd, met liefde geleverd.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-xl p-6 shadow-lg border border-sand/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-wine/10 flex items-center justify-center mb-4">
                <v.Icon className="w-6 h-6 text-wine" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-grey leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CMS Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <div className="space-y-12">
            {/* Intro text when no CMS content */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-4">
                Wie zijn wij?
              </h2>
              <p className="text-grey leading-relaxed mb-4">
                Vino per Lei is opgericht vanuit een diepe liefde voor de
                Italiaanse wijncultuur. We reizen regelmatig naar de
                wijnregio&apos;s van Italië om de beste familiewijngaarden te
                ontdekken — van de heuvels van Piemonte tot de kust van Puglia.
              </p>
              <p className="text-grey leading-relaxed">
                Elke wijn in onze collectie is persoonlijk geproefd en
                geselecteerd. We werken zonder tussenpersonen, rechtstreeks met
                de producenten, zodat jij kunt genieten van authentieke
                Italiaanse wijnen tegen een eerlijke prijs.
              </p>
            </div>

            <div className="bg-warm-white rounded-2xl p-8 sm:p-12 border border-sand">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-4">
                Onze Belofte
              </h2>
              <p className="text-grey leading-relaxed mb-6">
                Elke fles die je bij ons bestelt wordt zorgvuldig verpakt en
                snel verzonden. Ben je niet tevreden? Dan krijg je zonder
                gedoe je geld terug. Dat is onze 100% proefgarantie.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <p className="font-serif text-3xl font-bold text-wine mb-1">
                    100%
                  </p>
                  <p className="text-sm text-grey">Proefgarantie</p>
                </div>
                <div className="text-center p-4">
                  <p className="font-serif text-3xl font-bold text-wine mb-1">
                    19+
                  </p>
                  <p className="text-sm text-grey">Authentieke Wijnen</p>
                </div>
                <div className="text-center p-4">
                  <p className="font-serif text-3xl font-bold text-wine mb-1">
                    6
                  </p>
                  <p className="text-sm text-grey">Italiaanse Regio&apos;s</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-wine/5 rounded-2xl p-8 sm:p-12 border border-wine/10 text-center">
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-3">
            Vragen? Neem contact op
          </h2>
          <p className="text-grey mb-6 max-w-lg mx-auto">
            We helpen je graag met wijnadvies, bestellingen of andere
            vragen. Je kunt ons bereiken via e-mail of telefoon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors"
            >
              Contact Opnemen
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center justify-center h-12 px-8 border-2 border-wine text-wine font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine hover:text-white transition-colors"
            >
              {site.email}
            </a>
          </div>
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
