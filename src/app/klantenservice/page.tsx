import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Klantenservice | Vino per Lei",
  description:
    "Hoe kunnen wij je helpen? Vind informatie over verzending, retourneren, veelgestelde vragen en meer.",
};

const serviceLinks = [
  {
    title: "Veelgestelde Vragen",
    description:
      "Vind snel antwoord op de meest gestelde vragen over bestellen, betalen, verzenden en meer.",
    href: "/klantenservice/faq",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round" />
        <path d="M12 17h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Verzending & Levering",
    description:
      "Alles over verzendkosten, levertijden, verpakking en verzendgebieden.",
    href: "/klantenservice/verzending",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="1" y="6" width="15" height="12" rx="1" />
        <path d="M16 10h4l3 3v5h-7V10z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Retourneren",
    description:
      "Informatie over ons retourbeleid, 14 dagen bedenktijd en hoe je een retour aanmeldt.",
    href: "/klantenservice/retourneren",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
      </svg>
    ),
  },
  {
    title: "Contact",
    description:
      "Stuur ons een bericht, bel ons of vind onze contactgegevens en openingstijden.",
    href: "/contact",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function KlantenservicePage() {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-label text-gold mb-3">Klantenservice</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Hoe kunnen wij je helpen?
          </h1>
          <p className="text-grey max-w-lg mx-auto">
            Bij Vino per Lei staan wij voor je klaar. Vind hieronder snel de
            informatie die je nodig hebt.
          </p>
        </div>

        {/* Service Links Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {serviceLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-lg p-6 border border-sand hover:border-wine/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-wine/5 text-wine flex items-center justify-center group-hover:bg-wine/10 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-charcoal mb-1 group-hover:text-wine transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-grey text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Contact */}
        <div className="mt-16 bg-warm-white rounded-lg p-8 text-center border border-sand">
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">
            Direct contact
          </h2>
          <p className="text-grey mb-6">
            Liever persoonlijk contact? Wij staan voor je klaar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:info@vinoperlei.nl"
              className="inline-flex items-center justify-center h-12 px-6 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors"
            >
              E-mail Ons
            </a>
            <div className="text-sm text-grey">
              <span className="font-semibold text-charcoal">Ma-Vr</span>{" "}
              09:00 - 17:00
            </div>
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
