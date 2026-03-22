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
    "Geef Italiaanse wijn cadeau die je niet in de supermarkt vindt. Enkele fles, duo of proeverij box, met persoonlijk kaartje.",
  openGraph: {
    title: "Cadeaus | Vino per Lei",
    description:
      "Geef Italiaanse wijn cadeau die je niet in de supermarkt vindt. Enkele fles, duo of proeverij box, met persoonlijk kaartje.",
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-3">
              Meest Cadeau Gegeven
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Populaire Cadeauwijnen
            </h2>
            <p className="text-grey text-sm sm:text-base mt-2 max-w-lg mx-auto">
              Deze wijnen worden het vaakst cadeau gegeven — en dat is geen toeval.
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
              Alle 19 wijnen bekijken
            </Link>
          </div>
        </Section>
      )}
    </CadeausContent>
  );
}
