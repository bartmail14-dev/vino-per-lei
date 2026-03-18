import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import { WijnenContent, WijnenLoading } from "./WijnenClient";

export const revalidate = 300; // 5 min — product data from Shopify

export const metadata: Metadata = {
  title: "Onze Wijnen | Vino per Lei",
  description:
    "19 Italiaanse wijnen uit Piemonte, Veneto en Toscane. Filter op regio, druif of prijs. Gratis verzending vanaf 35 euro.",
  openGraph: {
    title: "Onze Wijnen | Vino per Lei",
    description:
      "19 Italiaanse wijnen rechtstreeks van familieproducenten. Filter op regio, druif of prijs.",
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
