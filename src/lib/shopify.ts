import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { type Product, type ProductImage } from '@/types';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2026-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// --- GraphQL fragments ---

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  availableForSale
  priceRange {
    minVariantPrice { amount currencyCode }
  }
  compareAtPriceRange {
    maxVariantPrice { amount currencyCode }
  }
  images(first: 5) {
    edges { node { url altText width height } }
  }
  variants(first: 1) {
    edges { node { id title price { amount currencyCode } } }
  }
  wineType: metafield(namespace: "custom", key: "wine_type") { value }
  grapeVarieties: metafield(namespace: "custom", key: "grape_varieties") { value }
  country: metafield(namespace: "custom", key: "country") { value }
  region: metafield(namespace: "custom", key: "region") { value }
  vintage: metafield(namespace: "custom", key: "vintage") { value }
  rating: metafield(namespace: "custom", key: "rating") { value }
  reviewCount: metafield(namespace: "custom", key: "review_count") { value }
  isFeatured: metafield(namespace: "custom", key: "is_featured") { value }
  isNew: metafield(namespace: "custom", key: "is_new") { value }
  hasAward: metafield(namespace: "custom", key: "has_award") { value }
  awardText: metafield(namespace: "custom", key: "award_text") { value }
  collectionName: metafield(namespace: "custom", key: "collection_name") { value }
  tasteDrySweet: metafield(namespace: "custom", key: "taste_dry_sweet") { value }
  tasteLightFull: metafield(namespace: "custom", key: "taste_light_full") { value }
  tasteSoftTannic: metafield(namespace: "custom", key: "taste_soft_tannic") { value }
  tasteFruitySpicy: metafield(namespace: "custom", key: "taste_fruity_spicy") { value }
  tasteFreshSoft: metafield(namespace: "custom", key: "taste_fresh_soft") { value }
`;

// --- Mapper ---

interface MetafieldNode {
  value: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapShopifyProduct(node: any): Product {
  const mf = (field: MetafieldNode | null | undefined): string | null =>
    field?.value ?? null;

  const images: ProductImage[] =
    node.images?.edges?.map((e: { node: { url: string; altText: string | null; width?: number; height?: number } }) => ({
      url: e.node.url,
      altText: e.node.altText,
      width: e.node.width,
      height: e.node.height,
    })) ?? [];

  const compareAt = parseFloat(node.compareAtPriceRange?.maxVariantPrice?.amount ?? '0');
  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  return {
    id: node.id.split('/').pop()!,
    handle: node.handle,
    title: node.title,
    description: node.description,
    collection: mf(node.collectionName) ?? undefined,
    wineType: (mf(node.wineType) ?? 'red') as Product['wineType'],
    grapeVarieties: node.grapeVarieties?.value
      ? JSON.parse(node.grapeVarieties.value)
      : [],
    country: mf(node.country) ?? 'Italië',
    region: mf(node.region) ?? '',
    vintage: node.vintage?.value
      ? node.vintage.value === 'NV'
        ? 'NV'
        : parseInt(node.vintage.value)
      : 'NV',
    price,
    originalPrice: compareAt > price ? compareAt : undefined,
    tasteProfile: {
      drySweet: parseInt(mf(node.tasteDrySweet) ?? '3'),
      lightFull: parseInt(mf(node.tasteLightFull) ?? '3'),
      ...(node.tasteSoftTannic?.value
        ? { softTannic: parseInt(node.tasteSoftTannic.value) }
        : {}),
      ...(node.tasteFreshSoft?.value
        ? { freshSoft: parseInt(node.tasteFreshSoft.value) }
        : {}),
      ...(node.tasteFruitySpicy?.value
        ? { fruitySpicy: parseInt(node.tasteFruitySpicy.value) }
        : {}),
    },
    images,
    rating: node.rating?.value ? parseFloat(node.rating.value) : undefined,
    reviewCount: node.reviewCount?.value
      ? parseInt(node.reviewCount.value)
      : undefined,
    inStock: node.availableForSale ?? true,
    isNew: node.isNew?.value === 'true',
    isFeatured: node.isFeatured?.value === 'true',
    hasAward: node.hasAward?.value === 'true',
    awardText: mf(node.awardText) ?? undefined,
    variantId: node.variants?.edges?.[0]?.node?.id ?? '',
  };
}

// --- Public API ---

export async function getProducts(first: number = 50): Promise<Product[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  `;

  const { data } = await client.request(query, { variables: { first } });
  return (
    data?.products?.edges?.map(
      (edge: { node: unknown }) => mapShopifyProduct(edge.node)
    ) ?? []
  );
}

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        ${PRODUCT_FIELDS}
      }
    }
  `;

  const { data } = await client.request(query, { variables: { handle } });
  if (!data?.productByHandle) return null;
  return mapShopifyProduct(data.productByHandle);
}

export async function createCheckout(
  variantId: string,
  quantity: number = 1
) {
  const query = `
    mutation createCheckout($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const { data } = await client.request(query, {
    variables: {
      input: {
        lineItems: [{ variantId, quantity }],
      },
    },
  });

  return data?.checkoutCreate?.checkout;
}
