import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { type Product, type ProductImage } from '@/types';

// Lazy-init: avoid throwing at module evaluation when env vars are missing (e.g. build without .env)
let _client: ReturnType<typeof createStorefrontApiClient> | null = null;
function getClient() {
  if (!_client) {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!domain || !token) {
      throw new Error('Missing Shopify env vars: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN must be set');
    }
    _client = createStorefrontApiClient({
      storeDomain: domain,
      apiVersion: '2025-01',
      publicAccessToken: token,
    });
  }
  return _client;
}

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
  variants(first: 10) {
    edges { node { id title price { amount currencyCode } availableForSale } }
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
  foodPairing: metafield(namespace: "custom", key: "food_pairing") { value }
  servingTemperature: metafield(namespace: "custom", key: "serving_temperature") { value }
  alcoholPercentage: metafield(namespace: "custom", key: "alcohol_percentage") { value }
  vinification: metafield(namespace: "custom", key: "vinification") { value }
  producerStory: metafield(namespace: "custom", key: "producer_story") { value }
`;

// --- Types ---

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: Array<{ node: { url: string; altText: string | null; width?: number; height?: number } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale?: boolean } }> };
  // Metafields — dynamic keys via GraphQL aliases
  [key: string]: unknown;
}

interface MetafieldNode {
  value: string;
}

// --- Helpers ---

function parseFoodPairing(value: string | null | undefined): string[] | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Could be comma-separated string
    if (value.includes(',')) return value.split(',').map((s: string) => s.trim()).filter(Boolean);
    if (value.trim()) return [value.trim()];
  }
  return undefined;
}

// --- Mapper ---

function mapShopifyProduct(node: ShopifyProductNode): Product {
  const mf = (field: MetafieldNode | null | undefined): string | null =>
    field?.value ?? null;

  const images: ProductImage[] =
    node.images?.edges?.map((e) => ({
      url: e.node.url,
      altText: e.node.altText,
      width: e.node.width,
      height: e.node.height,
    })) ?? [];

  const compareAt = parseFloat(node.compareAtPriceRange?.maxVariantPrice?.amount ?? '0');
  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  // Safe parse grape varieties JSON
  let grapeVarieties: string[] = [];
  try {
    grapeVarieties = JSON.parse((node.grapeVarieties as MetafieldNode | null)?.value || '[]');
  } catch {
    grapeVarieties = [];
  }

  return {
    id: node.id.split('/').pop()!,
    handle: node.handle,
    title: node.title,
    description: node.description,
    collection: mf(node.collectionName as MetafieldNode | null) ?? undefined,
    wineType: (mf(node.wineType as MetafieldNode | null) ?? 'red') as Product['wineType'],
    grapeVarieties,
    country: mf(node.country as MetafieldNode | null) ?? 'Italië',
    region: mf(node.region as MetafieldNode | null) ?? '',
    vintage: (node.vintage as MetafieldNode | null)?.value
      ? (node.vintage as MetafieldNode).value === 'NV'
        ? 'NV'
        : parseInt((node.vintage as MetafieldNode).value)
      : 'NV',
    price,
    originalPrice: compareAt > price ? compareAt : undefined,
    tasteProfile: {
      drySweet: parseInt(mf(node.tasteDrySweet as MetafieldNode | null) ?? '3'),
      lightFull: parseInt(mf(node.tasteLightFull as MetafieldNode | null) ?? '3'),
      ...((node.tasteSoftTannic as MetafieldNode | null)?.value
        ? { softTannic: parseInt((node.tasteSoftTannic as MetafieldNode).value) }
        : {}),
      ...((node.tasteFreshSoft as MetafieldNode | null)?.value
        ? { freshSoft: parseInt((node.tasteFreshSoft as MetafieldNode).value) }
        : {}),
      ...((node.tasteFruitySpicy as MetafieldNode | null)?.value
        ? { fruitySpicy: parseInt((node.tasteFruitySpicy as MetafieldNode).value) }
        : {}),
    },
    images,
    rating: (node.rating as MetafieldNode | null)?.value ? parseFloat((node.rating as MetafieldNode).value) : undefined,
    reviewCount: (node.reviewCount as MetafieldNode | null)?.value
      ? parseInt((node.reviewCount as MetafieldNode).value)
      : undefined,
    inStock: node.availableForSale ?? true,
    stockQuantity: undefined,
    isNew: (node.isNew as MetafieldNode | null)?.value === 'true',
    isFeatured: (node.isFeatured as MetafieldNode | null)?.value === 'true',
    hasAward: (node.hasAward as MetafieldNode | null)?.value === 'true',
    awardText: mf(node.awardText as MetafieldNode | null) ?? undefined,
    // Metafield-driven content
    foodPairing: parseFoodPairing((node.foodPairing as MetafieldNode | null)?.value),
    servingTemperature: mf(node.servingTemperature as MetafieldNode | null) ?? undefined,
    alcoholPercentage: mf(node.alcoholPercentage as MetafieldNode | null) ?? undefined,
    vinification: mf(node.vinification as MetafieldNode | null) ?? undefined,
    producerStory: mf(node.producerStory as MetafieldNode | null) ?? undefined,
    variants: node.variants?.edges?.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      price: parseFloat(e.node.price.amount),
      availableForSale: e.node.availableForSale ?? true,
    })) ?? [],
    // Default to first available variant, or first variant if none available
    variantId:
      node.variants?.edges?.find((e) => e.node.availableForSale !== false)?.node?.id ??
      node.variants?.edges?.[0]?.node?.id ??
      '',
  };
}

// --- Public API ---

/**
 * Fetch all products from Shopify Storefront API.
 * Caching: requests are deduped by Next.js fetch cache; consider adding
 * { next: { revalidate: 300 } } if migrating to raw fetch calls.
 */
export async function getProducts(first: number = 50): Promise<Product[]> {
  try {
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

    const { data } = await getClient().request(query, { variables: { first } });
    return (
      data?.products?.edges?.map(
        (edge: { node: ShopifyProductNode }) => mapShopifyProduct(edge.node)
      ) ?? []
    );
  } catch (error) {
    console.error('[Shopify] Failed to fetch products:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.message) {
      console.error('[Shopify] Full error details:', JSON.stringify(error, null, 2));
    }
    return [];
  }
}

/**
 * Fetch a single product by its handle.
 * Caching: same strategy as getProducts — client-level dedup only.
 */
export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  try {
    const query = `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ${PRODUCT_FIELDS}
        }
      }
    `;

    const { data } = await getClient().request(query, { variables: { handle } });
    if (!data?.productByHandle) return null;
    return mapShopifyProduct(data.productByHandle);
  } catch (error) {
    console.error(`[Shopify] Failed to fetch product "${handle}":`, error instanceof Error ? error.message : error);
    if (error instanceof Error && error.message) {
      console.error('[Shopify] Full error details:', JSON.stringify(error, null, 2));
    }
    return null;
  }
}

/**
 * Build a Shopify cart permalink URL and redirect the user.
 * Format: https://{shop}/cart/{variantId}:{qty},{variantId}:{qty}
 * This bypasses the deprecated Checkout API and sends users directly
 * to Shopify's hosted checkout with their cart pre-filled.
 */
export function getShopifyCartUrl(
  lineItems: Array<{ variantId: string; quantity: number }>
): string {
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;

  const cartParts = lineItems.map((item) => {
    // Shopify variant GIDs look like "gid://shopify/ProductVariant/12345"
    // The cart permalink needs just the numeric ID
    const numericId = item.variantId.includes('/')
      ? item.variantId.split('/').pop()!
      : item.variantId;
    return `${numericId}:${item.quantity}`;
  });

  return `https://${shop}/cart/${cartParts.join(',')}`;
}
