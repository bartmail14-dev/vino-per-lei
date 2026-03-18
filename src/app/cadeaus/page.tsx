import Link from "next/link";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { CadeausContent } from "./CadeausContent";

import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Cadeaus | Vino per Lei",
  description:
    "Verras met een uniek wijncadeau — geschenksets en cadeaubonnen van Vino per Lei.",
  openGraph: {
    title: "Cadeaus | Vino per Lei",
    description:
      "Verras met een uniek wijncadeau — geschenksets en cadeaubonnen van Vino per Lei.",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function CadeausPage() {
  const allProducts = await getProducts();
  const giftWines = allProducts
    .filter((p) => p.inStock && (p.hasAward || p.price >= 30))
    .slice(0, 4);
  const displayProducts =
    giftWines.length >= 2
      ? giftWines
      : allProducts.filter((p) => p.isFeatured && p.inStock).slice(0, 4);

  return (
    <CadeausContent>
      {/* Gift-worthy Products */}
      {displayProducts.length > 0 && (
        <Section background="default" spacing="lg">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-label text-wine/40 mb-2">
              Onze Suggesties
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Perfecte Cadeauwijnen
            </h2>
            <p className="text-grey text-sm sm:text-base mt-2 max-w-lg mx-auto">
              Award-winnende en premium wijnen die altijd in de smaak vallen.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/wijnen"
              className="inline-flex items-center justify-center h-12 px-8 border-2 border-wine text-wine text-button uppercase rounded hover:bg-wine hover:text-white transition-colors"
            >
              Bekijk Alle Wijnen
            </Link>
          </div>
        </Section>
      )}
    </CadeausContent>
  );
}
