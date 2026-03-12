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
  totalInventory
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

// --- Types ---

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  totalInventory?: number;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: Array<{ node: { url: string; altText: string | null; width?: number; height?: number } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string } } }> };
  // Metafields — dynamic keys via GraphQL aliases
  [key: string]: unknown;
}

interface MetafieldNode {
  value: string;
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
    stockQuantity: node.totalInventory ?? undefined,
    isNew: (node.isNew as MetafieldNode | null)?.value === 'true',
    isFeatured: (node.isFeatured as MetafieldNode | null)?.value === 'true',
    hasAward: (node.hasAward as MetafieldNode | null)?.value === 'true',
    awardText: mf(node.awardText as MetafieldNode | null) ?? undefined,
    variantId: node.variants?.edges?.[0]?.node?.id ?? '',
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

    const { data } = await client.request(query, { variables: { first } });
    return (
      data?.products?.edges?.map(
        (edge: { node: ShopifyProductNode }) => mapShopifyProduct(edge.node)
      ) ?? []
    );
  } catch (error) {
    console.error('Failed to fetch products from Shopify:', error);
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

    const { data } = await client.request(query, { variables: { handle } });
    if (!data?.productByHandle) return null;
    return mapShopifyProduct(data.productByHandle);
  } catch (error) {
    console.error(`Failed to fetch product "${handle}" from Shopify:`, error);
    return null;
  }
}

/**
 * Create a Shopify checkout with one or more line items.
 * Returns { id, webUrl } where webUrl is the Shopify hosted checkout page.
 * The user is redirected to webUrl to complete payment (iDEAL, credit card, etc.).
 */
export async function createCheckout(
  lineItems: Array<{ variantId: string; quantity: number }>
) {
  try {
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
        input: { lineItems },
      },
    });

    const errors = data?.checkoutCreate?.checkoutUserErrors;
    if (errors && errors.length > 0) {
      console.error('Shopify checkout errors:', errors);
      return null;
    }

    return data?.checkoutCreate?.checkout ?? null;
  } catch (error) {
    console.error('Failed to create Shopify checkout:', error);
    return null;
  }
}
