import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout";
import { mockProducts } from "@/data/mockProducts";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ handle: string }>;
}

function findProduct(handle: string) {
  return mockProducts.find((p) => p.handle === handle) || null;
}

function getRelatedProducts(handle: string) {
  const product = findProduct(handle);
  if (!product) return [];
  return mockProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.wineType === product.wineType || p.region === product.region)
    )
    .slice(0, 8);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = findProduct(handle);

  if (!product) {
    return {
      title: "Product niet gevonden | Vino per Lei",
    };
  }

  const wineTypeNL =
    product.wineType === "red"
      ? "Rode Wijn"
      : product.wineType === "white"
        ? "Witte Wijn"
        : product.wineType === "rose"
          ? "Rosé"
          : "Mousserende Wijn";

  const title = `${product.title} | ${wineTypeNL} | Vino per Lei`;
  const description =
    product.description ||
    `${product.title} — ${wineTypeNL} uit ${product.region}, ${product.country}. ${product.grapeVarieties.join(", ")}. Bestel nu bij Vino per Lei.`;

  return {
    title,
    description,
    openGraph: {
      title: product.title,
      description,
      type: "website",
      locale: "nl_NL",
      siteName: "Vino per Lei",
      images: product.images[0]
        ? [
            {
              url: product.images[0].url,
              alt: product.images[0].altText || product.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { handle } = await params;
  const product = findProduct(handle);

  if (!product) {
    return (
      <Section background="default" spacing="xl">
        <div className="text-center py-16">
          <h1 className="font-serif text-3xl font-semibold mb-4">
            Product niet gevonden
          </h1>
          <p className="text-grey mb-6">
            De wijn die je zoekt bestaat niet of is niet meer beschikbaar.
          </p>
          <Link
            href="/wijnen"
            className="inline-flex items-center justify-center font-semibold uppercase tracking-wide h-12 px-8 text-sm rounded bg-wine text-white hover:bg-wine-dark transition-colors"
          >
            Bekijk alle wijnen
          </Link>
        </div>
      </Section>
    );
  }

  const relatedProducts = getRelatedProducts(handle);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: {
      "@type": "Brand",
      name: "Vino per Lei",
    },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Vino per Lei",
      },
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviewCount || 0,
        bestRating: "5",
        worstRating: "1",
      },
    }),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Wijntype",
        value: product.wineType,
      },
      {
        "@type": "PropertyValue",
        name: "Regio",
        value: product.region,
      },
      {
        "@type": "PropertyValue",
        name: "Land",
        value: product.country,
      },
      {
        "@type": "PropertyValue",
        name: "Druivenras",
        value: product.grapeVarieties.join(", "),
      },
      ...(product.vintage !== "NV"
        ? [
            {
              "@type": "PropertyValue",
              name: "Jaargang",
              value: String(product.vintage),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
