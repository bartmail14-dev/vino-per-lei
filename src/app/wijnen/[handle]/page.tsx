import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout";
import { getProductByHandle, getProducts } from "@/lib/shopify";
import { getUiCopy } from "@/lib/shopify-cms";
import { getActiveRegionSlugsFromProducts } from "@/lib/region-utils";
import { formatUiCopy, type UiCopyMap } from "@/lib/ui-copy";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true; // Allow new products without rebuild

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const [product, uiCopy] = await Promise.all([getProductByHandle(handle), getUiCopy()]);
  const siteName = formatUiCopy(uiCopy, "site.name");

  if (!product) {
    return {
      title: formatUiCopy(uiCopy, "product.not_found.meta_title"),
    };
  }

  const wineTypeNL = getWineTypeLabel(product.wineType, uiCopy);

  const title = formatUiCopy(uiCopy, "product.meta.title", { title: product.title, wineType: wineTypeNL });
  const description =
    product.description ||
    formatUiCopy(uiCopy, "product.meta.description", {
      title: product.title,
      wineType: wineTypeNL,
      region: product.region,
      country: product.country,
      grapes: product.grapeVarieties.join(", "),
    });

  return {
    title,
    description,
    alternates: {
      canonical: `https://vinoperlei.nl/wijnen/${handle}`,
    },
    openGraph: {
      title: product.title,
      description,
      type: "website",
      locale: "nl_NL",
      siteName,
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
  const [product, uiCopy] = await Promise.all([getProductByHandle(handle), getUiCopy()]);

  if (!product) {
    return (
      <Section background="default" spacing="xl">
        <div className="text-center py-16">
          <h1 className="font-serif text-3xl font-semibold mb-4">
            {formatUiCopy(uiCopy, "product.not_found.title")}
          </h1>
          <p className="text-grey mb-6">
            {formatUiCopy(uiCopy, "product.not_found.body")}
          </p>
          <Link
            href="/wijnen"
            className="inline-flex items-center justify-center text-button uppercase h-12 px-8 text-sm rounded bg-wine text-white hover:bg-wine-dark transition-colors"
          >
            {formatUiCopy(uiCopy, "product.not_found.back_to_wines")}
          </Link>
        </div>
      </Section>
    );
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.wineType === product.wineType || p.region === product.region)
    )
    .slice(0, 8);

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: formatUiCopy(uiCopy, "collection.breadcrumb.home"),
        item: "https://vinoperlei.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: formatUiCopy(uiCopy, "collection.breadcrumb.wines"),
        item: "https://vinoperlei.nl/wijnen",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `https://vinoperlei.nl/wijnen/${handle}`,
      },
    ],
  };

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: {
      "@type": "Brand",
      name: formatUiCopy(uiCopy, "site.name"),
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
          name: formatUiCopy(uiCopy, "site.name"),
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
        name: formatUiCopy(uiCopy, "collection.filter.group.wine_type"),
        value: product.wineType,
      },
      {
        "@type": "PropertyValue",
        name: formatUiCopy(uiCopy, "product.details.region"),
        value: product.region,
      },
      {
        "@type": "PropertyValue",
        name: formatUiCopy(uiCopy, "product.details.country"),
        value: product.country,
      },
      {
        "@type": "PropertyValue",
        name: formatUiCopy(uiCopy, "product.details.grape"),
        value: product.grapeVarieties.join(", "),
      },
      ...(product.vintage !== "NV"
        ? [
            {
              "@type": "PropertyValue",
              name: formatUiCopy(uiCopy, "product.details.vintage"),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} activeRegionSlugs={getActiveRegionSlugsFromProducts(allProducts)} />
    </>
  );
}

function getWineTypeLabel(wineType: string, uiCopy: UiCopyMap): string {
  switch (wineType) {
    case "red":
      return formatUiCopy(uiCopy, "product.wine_type.red_full");
    case "white":
      return formatUiCopy(uiCopy, "product.wine_type.white_full");
    case "rose":
      return formatUiCopy(uiCopy, "product.wine_type.rose_full");
    case "sparkling":
      return formatUiCopy(uiCopy, "product.wine_type.sparkling_full");
    default:
      return formatUiCopy(uiCopy, "product.wine_type.default");
  }
}
