import type { Metadata } from "next";
import { getPage, getShopConfig } from "@/lib/shopify-cms";
import { VerzendingContent } from "./VerzendingContent";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Verzending & Levering | Vino per Lei",
  description:
    "Informatie over verzending en levering bij Vino per Lei. Zorgvuldig verpakt en temperatuurgecontroleerd.",
  openGraph: {
    title: "Verzending & Levering | Vino per Lei",
    description:
      "Informatie over verzending en levering bij Vino per Lei. Zorgvuldig verpakt en temperatuurgecontroleerd.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function VerzendingPage() {
  const [page, shopConfig] = await Promise.all([
    getPage("verzending-levering"),
    getShopConfig(),
  ]);

  return (
    <VerzendingContent
      pageBody={page?.body ?? null}
      pageTitle={page?.title ?? null}
      shippingCost={shopConfig.shippingCost}
    />
  );
}
