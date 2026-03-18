import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import { WijnenContent, WijnenLoading } from "./WijnenClient";

export const revalidate = 300; // 5 min — product data from Shopify

export const metadata: Metadata = {
  title: "Onze Wijnen | Vino per Lei",
  description:
    "Ontdek onze zorgvuldig geselecteerde collectie authentieke Italiaanse wijnen. Filter op regio, druivenras, prijs en smaakprofiel. Gratis verzending vanaf €35.",
  openGraph: {
    title: "Onze Wijnen | Vino per Lei",
    description:
      "Authentieke Italiaanse wijnen uit Piemonte, Veneto, Toscana en meer. Bestel online met gratis verzending vanaf €35.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function WijnenPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<WijnenLoading />}>
      <WijnenContent products={products} />
    </Suspense>
  );
}
