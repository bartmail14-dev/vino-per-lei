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

export default async function ContactPage() {
  const settings = (await getSiteSettings()) ?? DEFAULT_SITE_SETTINGS;

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Contact</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Neem Contact Op
          </h1>
          <p className="text-grey">
            Heb je een vraag, opmerking of wil je advies over onze wijnen? We
            horen graag van je.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-warm-white rounded-lg p-6 border border-sand">
              <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">
                Contactgegevens
              </h2>
              <div className="space-y-4 text-sm text-grey">
                <div>
                  <p className="font-semibold text-charcoal mb-1">E-mail</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-wine hover:text-wine-dark transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-charcoal mb-1">Telefoon</p>
                  <p>{settings.phone}</p>
                </div>
                <div>
                  <p className="font-semibold text-charcoal mb-1">Adres</p>
                  <p>
                    {settings.addressStreet}, {settings.addressPostal}{" "}
                    {settings.addressCity}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-warm-white rounded-lg p-6 border border-sand">
              <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">
                Openingstijden
              </h2>
              <div className="space-y-2 text-sm text-grey">
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
              <p className="text-xs text-grey/70 mt-4">
                Online bestellen kan 24/7. E-mails worden binnen 1 werkdag
                beantwoord.
              </p>
            </div>

            <div className="bg-wine/5 rounded-lg p-6 border border-wine/20">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-2">
                Snel antwoord nodig?
              </h2>
              <p className="text-sm text-grey mb-3">
                Bekijk eerst onze veelgestelde vragen — misschien staat het
                antwoord er al bij.
              </p>
              <Link
                href="/klantenservice/faq"
                className="text-sm text-wine font-semibold hover:text-wine-dark transition-colors"
              >
                Bekijk FAQ &rarr;
              </Link>
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
