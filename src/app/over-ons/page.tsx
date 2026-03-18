import { getPage, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";
import { OverOnsContent } from "./OverOnsContent";

import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Over Ons | Vino per Lei",
  description:
    "Carla Daniels importeert 19 Italiaanse wijnen rechtstreeks van familieproducenten in Piemonte, Veneto en Toscane.",
  openGraph: {
    title: "Over Ons | Vino per Lei",
    description:
      "Carla Daniels importeert 19 Italiaanse wijnen rechtstreeks van familieproducenten in Piemonte, Veneto en Toscane.",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function OverOnsPage() {
  const [page, settings] = await Promise.all([
    getPage("over-ons"),
    getSiteSettings(),
  ]);
  const site = settings ?? DEFAULT_SITE_SETTINGS;

  return (
    <OverOnsContent
      pageBody={page?.body ?? null}
      email={site.email}
    />
  );
}
