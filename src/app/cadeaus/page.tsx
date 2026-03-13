import Link from "next/link";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { GiftBoxIcon } from "./GiftBoxIcon";

import type { Metadata } from "next";

export const revalidate = 60;

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

function WineGlassesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M5.5 2h5l-.5 5a3.5 3.5 0 0 1-4 0L5.5 2z" />
      <path d="M8 7v5" />
      <path d="M5 14h6" />
      <path d="M13.5 2h5l-.5 5a3.5 3.5 0 0 1-4 0L13.5 2z" />
      <path d="M16 7v5" />
      <path d="M13 14h6" />
    </svg>
  );
}

const giftIdeas = [
  {
    icon: "bottle",
    title: "Enkele Fles",
    description: "Een zorgvuldig geselecteerde wijn, prachtig verpakt in een geschenkdoos.",
    price: "Vanaf €12",
  },
  {
    icon: "duo",
    title: "Duo Pakket",
    description: "Twee complementaire wijnen — perfect voor een avond vol Italiaans genieten.",
    price: "Vanaf €25",
  },
  {
    icon: "box",
    title: "Proeverij Box",
    description: "Drie of zes wijnen uit verschillende regio's. Ideaal voor de ontdekker.",
    price: "Vanaf €40",
  },
];

export default async function CadeausPage() {
  const allProducts = await getProducts();
  // Show award-winning and premium wines as gift suggestions
  const giftWines = allProducts
    .filter((p) => p.inStock && (p.hasAward || p.price >= 30))
    .slice(0, 4);
  // Fallback to featured products
  const displayProducts =
    giftWines.length >= 2
      ? giftWines
      : allProducts.filter((p) => p.isFeatured && p.inStock).slice(0, 4);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.1),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <GiftBoxIcon className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-semibold text-white mb-4 leading-[1.1]">
            Wijn <span className="text-gold">Cadeau</span> Geven
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Verras iemand met een authentieke Italiaanse wijn. Elke fles wordt
            met zorg verpakt en kan voorzien worden van een persoonlijk bericht.
          </p>
        </div>
      </section>

      {/* Gift Ideas */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {giftIdeas.map((idea) => (
            <div
              key={idea.title}
              className="bg-white rounded-xl p-6 shadow-lg border border-sand/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-wine/10 flex items-center justify-center mx-auto mb-4">
                {idea.icon === "duo" ? (
                  <WineGlassesIcon className="w-6 h-6 text-wine" />
                ) : idea.icon === "box" ? (
                  <GiftBoxIcon className="w-7 h-7 text-wine" />
                ) : (
                  <svg
                    className="w-6 h-6 text-wine"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M8 2h8l-1 8a5 5 0 0 1-6 0L8 2z" />
                    <path d="M12 10v8" />
                    <path d="M8 22h8" />
                  </svg>
                )}
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                {idea.title}
              </h3>
              <p className="text-sm text-grey leading-relaxed mb-3">
                {idea.description}
              </p>
              <p className="text-wine font-semibold text-sm">{idea.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gift-worthy Products */}
      {displayProducts.length > 0 && (
        <Section background="default" spacing="lg">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-label text-wine mb-2 tracking-[0.15em]">
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
              className="inline-flex items-center justify-center h-12 px-8 border-2 border-wine text-wine font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine hover:text-white transition-colors"
            >
              Bekijk Alle Wijnen
            </Link>
          </div>
        </Section>
      )}

      {/* Contact CTA for custom gifts */}
      <Section background="warm" spacing="lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-4">
            Op Zoek naar Iets Speciaals?
          </h2>
          <p className="text-grey leading-relaxed mb-8">
            We stellen graag een persoonlijk wijncadeau voor je samen. Neem
            contact op en vertel ons de gelegenheid — wij doen de rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors"
            >
              Neem Contact Op
            </Link>
            <Link
              href="/wijnen"
              className="inline-flex items-center justify-center h-12 px-8 border-2 border-wine text-wine font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine hover:text-white transition-colors"
            >
              Bekijk Alle Wijnen
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
