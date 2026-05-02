import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import { getUiCopy } from "@/lib/shopify-cms";
import { formatUiCopy, type UiCopyMap } from "@/lib/ui-copy";
import { WijnenContent, WijnenLoading } from "./WijnenClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getUniqueRegions(products: { region?: string }[]): string[] {
  const regions = new Set<string>();
  products.forEach((p) => {
    if (p.region?.trim()) regions.add(p.region.trim());
  });
  return Array.from(regions).sort();
}

function formatRegionList(regions: string[], uiCopy: UiCopyMap): string {
  if (regions.length === 0) return formatUiCopy(uiCopy, "collection.region.default_country");
  if (regions.length === 1) return regions[0];
  return regions.slice(0, -1).join(", ") + formatUiCopy(uiCopy, "collection.region.joiner") + regions[regions.length - 1];
}

export async function generateMetadata(): Promise<Metadata> {
  const [products, uiCopy] = await Promise.all([getProducts(), getUiCopy()]);
  const regionList = formatRegionList(getUniqueRegions(products), uiCopy);
  const title = formatUiCopy(uiCopy, "collection.meta.title");
  const description = formatUiCopy(uiCopy, "collection.meta.description", { regions: regionList });

  return {
    title,
    description,
    alternates: {
      canonical: "https://vinoperlei.nl/wijnen",
    },
    openGraph: {
      title,
      description: formatUiCopy(uiCopy, "collection.meta.og_description"),
      type: "website",
      locale: "nl_NL",
      siteName: formatUiCopy(uiCopy, "site.name"),
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
