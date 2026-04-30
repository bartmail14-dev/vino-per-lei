import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import { WijnenContent, WijnenLoading } from "./WijnenClient";

export const revalidate = 300; // 5 min — product data from Shopify

function getUniqueRegions(products: { region?: string }[]): string[] {
  const regions = new Set<string>();
  products.forEach((p) => {
    if (p.region?.trim()) regions.add(p.region.trim());
  });
  return Array.from(regions).sort();
}

function formatRegionList(regions: string[]): string {
  if (regions.length === 0) return "Italië";
  if (regions.length === 1) return regions[0];
  return regions.slice(0, -1).join(", ") + " en " + regions[regions.length - 1];
}

export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts();
  const regionList = formatRegionList(getUniqueRegions(products));

  return {
    title: "Onze Wijnen | Vino per Lei",
    description: `Italiaanse wijnen uit ${regionList}. Filter op regio, druif of prijs. Gratis verzending vanaf 100 euro.`,
    alternates: {
      canonical: "https://vinoperlei.nl/wijnen",
    },
    openGraph: {
      title: "Onze Wijnen | Vino per Lei",
      description:
        "Italiaanse wijnen rechtstreeks van familieproducenten. Filter op regio, druif of prijs.",
      type: "website",
      locale: "nl_NL",
      siteName: "Vino per Lei",
    },
  };
}

export default async function WijnenPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<WijnenLoading />}>
      <WijnenContent products={products} />
    </Suspense>
  );
}
