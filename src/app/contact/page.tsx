import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact | Vino per Lei",
  description:
    "Neem contact op met Vino per Lei. Wij helpen je graag met vragen over onze wijnen, bestellingen of wijnadvies.",
};

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default async function ContactPage() {
  const settings = (await getSiteSettings()) ?? DEFAULT_SITE_SETTINGS;

  return (
    <div className="bg-background">
      {/* Hero header */}
      <div className="relative bg-dark-bg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative">
          <p className="text-gold/80 text-xs font-medium tracking-[0.2em] uppercase mb-4">Contact</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            Neem Contact Op
          </h1>
          <p className="text-white/60 max-w-lg text-sm sm:text-base leading-relaxed">
            Heb je een vraag, opmerking of wil je advies over onze wijnen? We
            horen graag van je.
          </p>
        </div>
      </div>

      {/* Contact info cards strip */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-sand/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
              <MailIcon className="w-5 h-5 text-wine" />
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">E-mail</p>
              <a
                href={`mailto:${settings.email}`}
                className="text-sm text-wine hover:text-wine-dark transition-colors"
              >
                {settings.email}
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-sand/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
              <PhoneIcon className="w-5 h-5 text-wine" />
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">Telefoon</p>
              <p className="text-sm text-grey">{settings.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-sand/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-5 h-5 text-wine" />
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">Adres</p>
              <p className="text-sm text-grey">
                {settings.addressStreet}, {settings.addressPostal}{" "}
                {settings.addressCity}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-sand/50">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-6">
                Stuur ons een bericht
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-warm-white rounded-xl p-6 border border-sand">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-4 h-4 text-gold" />
                </div>
                <h2 className="font-serif text-lg font-semibold text-charcoal">
                  Openingstijden
                </h2>
              </div>
              <div className="space-y-2.5 text-sm text-grey">
                <div className="flex justify-between">
                  <span>Maandag - Vrijdag</span>
                  <span className="font-semibold text-charcoal">
                    {settings.hoursWeekday}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Zaterdag</span>
                  <span className="font-semibold text-charcoal">
                    {settings.hoursSaturday}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Zondag</span>
                  <span className="text-grey">{settings.hoursSunday}</span>
                </div>
              </div>
              <p className="text-xs text-grey/70 mt-4 pt-3 border-t border-sand">
                Online bestellen kan 24/7. E-mails worden binnen 1 werkdag
                beantwoord.
              </p>
            </div>

            <div className="relative bg-gradient-to-br from-wine to-wine-dark rounded-xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-[60px]" />
              <h2 className="font-serif text-lg font-semibold text-white mb-2">
                Snel antwoord nodig?
              </h2>
              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                Bekijk eerst onze veelgestelde vragen — misschien staat het
                antwoord er al bij.
              </p>
              <Link
                href="/klantenservice/faq"
                className="inline-flex items-center gap-2 text-sm text-white font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg transition-colors"
              >
                Bekijk FAQ &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-sand">
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
