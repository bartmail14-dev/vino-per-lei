import type { Metadata } from "next";
import { getPage } from "@/lib/shopify-cms";
import { VerzendingContent } from "./VerzendingContent";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Verzending & Levering | Vino per Lei",
  description:
    "Informatie over verzending en levering bij Vino per Lei. Gratis verzending vanaf \u20AC35. Zorgvuldig verpakt en temperatuurgecontroleerd.",
  openGraph: {
    title: "Verzending & Levering | Vino per Lei",
    description:
      "Informatie over verzending en levering bij Vino per Lei. Gratis verzending vanaf \u20AC35. Zorgvuldig verpakt en temperatuurgecontroleerd.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function VerzendingPage() {
  const page = await getPage("verzending-levering");

  return <VerzendingContent pageBody={page?.body ?? null} pageTitle={page?.title ?? null} />;
}
