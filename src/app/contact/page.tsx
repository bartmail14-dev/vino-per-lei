import type { Metadata } from "next";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";
import { ContactPageContent } from "./ContactPageContent";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Contact | Vino per Lei",
  description:
    "Neem contact op met Vino per Lei. Wij helpen je graag met vragen over onze wijnen, bestellingen of wijnadvies.",
  alternates: {
    canonical: "https://vinoperlei.nl/contact",
  },
  openGraph: {
    title: "Contact | Vino per Lei",
    description:
      "Neem contact op met Vino per Lei. Wij helpen je graag met vragen over onze wijnen, bestellingen of wijnadvies.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function ContactPage() {
  const settings = (await getSiteSettings()) ?? DEFAULT_SITE_SETTINGS;

  return (
    <ContactPageContent
      email={settings.email}
      phone={settings.phone}
      addressStreet={settings.addressStreet}
      addressPostal={settings.addressPostal}
      addressCity={settings.addressCity}
      hoursWeekday={settings.hoursWeekday}
      hoursSaturday={settings.hoursSaturday}
      hoursSunday={settings.hoursSunday}
      freeShippingThreshold={settings.freeShippingThreshold}
    />
  );
}
