import { getPage, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";
import { getProducts } from "@/lib/shopify";
import { OverOnsContent } from "./OverOnsContent";

import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Over Ons | Vino per Lei",
  description:
    "Wij importeren Italiaanse wijnen rechtstreeks van familieproducenten in Piemonte, Veneto en Toscane. Voornamelijk kleine wijnhuizen, persoonlijk geselecteerd.",
  alternates: {
    canonical: "https://vinoperlei.nl/over-ons",
  },
  openGraph: {
    title: "Over Ons | Vino per Lei",
    description:
      "Wij importeren Italiaanse wijnen rechtstreeks van familieproducenten in Piemonte, Veneto en Toscane. Voornamelijk kleine wijnhuizen, persoonlijk geselecteerd.",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function OverOnsPage() {
  const [page, settings, products] = await Promise.all([
    getPage("over-ons"),
    getSiteSettings(),
    getProducts(),
  ]);
  const site = settings ?? DEFAULT_SITE_SETTINGS;

  // JSON-LD: BreadcrumbList schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vinoperlei.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Over Ons",
        item: "https://vinoperlei.nl/over-ons",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <OverOnsContent
        pageBody={page?.body ?? null}
        email={site.email}
        wineCount={products.length}
      />
    </>
  );
}
