import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
}

export async function getProducts(first: number = 12): Promise<Product[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await client.request(query, { variables: { first } });
  return data?.products?.edges?.map((edge: { node: Product }) => edge.node) || [];
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await client.request(query, { variables: { handle } });
  return data?.productByHandle || null;
}

export async function createCheckout(variantId: string, quantity: number = 1) {
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

export async function getCollections(): Promise<Collection[]> {
  const query = `
    query getCollections {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
          }
        }
      }
    }
  `;

  const { data } = await client.request(query);
  return data?.collections?.edges?.map((edge: { node: Collection }) => edge.node) || [];
}
