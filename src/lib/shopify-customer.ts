/**
 * Shopify Storefront API — Customer mutations & queries.
 * Uses the public Storefront API token (same as product fetching).
 * Access tokens are returned on login/register and stored in httpOnly cookies.
 */

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";
const API_VERSION = "2025-01";

async function storefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// --- Types ---

export interface CustomerUserError {
  field: string[] | null;
  message: string;
}

interface AccessTokenResponse {
  data: {
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

interface CustomerCreateResponse {
  data: {
    customerCreate: {
      customer: { id: string; email: string; firstName: string; lastName: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

interface CustomerRecoverResponse {
  data: {
    customerRecover: {
      customerUserErrors: CustomerUserError[];
    };
  };
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          image: { url: string; altText: string | null } | null;
          price: { amount: string; currencyCode: string };
        } | null;
      };
    }>;
  };
  statusUrl: string;
}

export interface ShopifyAddress {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  defaultAddress: ShopifyAddress | null;
  addresses: { edges: Array<{ node: ShopifyAddress }> };
  orders: { edges: Array<{ node: ShopifyOrder }> };
}

// --- Mutations ---

export async function customerLogin(
  email: string,
  password: string
): Promise<{ accessToken: string; expiresAt: string } | { errors: CustomerUserError[] }> {
  const result = await storefrontFetch<AccessTokenResponse>(
    `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }`,
    { input: { email, password } }
  );

  const { customerAccessToken, customerUserErrors } =
    result.data.customerAccessTokenCreate;

  if (customerUserErrors.length > 0) {
    return { errors: customerUserErrors };
  }

  if (!customerAccessToken) {
    return { errors: [{ field: null, message: "Onbekende fout bij inloggen" }] };
  }

  return {
    accessToken: customerAccessToken.accessToken,
    expiresAt: customerAccessToken.expiresAt,
  };
}

export async function customerRegister(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<
  | { customer: { id: string; email: string; firstName: string; lastName: string } }
  | { errors: CustomerUserError[] }
> {
  const result = await storefrontFetch<CustomerCreateResponse>(
    `mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          field
          message
        }
      }
    }`,
    { input }
  );

  const { customer, customerUserErrors } = result.data.customerCreate;

  if (customerUserErrors.length > 0) {
    return { errors: customerUserErrors };
  }

  if (!customer) {
    return { errors: [{ field: null, message: "Onbekende fout bij registratie" }] };
  }

  return { customer };
}

export async function customerRecover(
  email: string
): Promise<{ success: true } | { errors: CustomerUserError[] }> {
  const result = await storefrontFetch<CustomerRecoverResponse>(
    `mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
        }
      }
    }`,
    { email }
  );

  const { customerUserErrors } = result.data.customerRecover;

  if (customerUserErrors.length > 0) {
    return { errors: customerUserErrors };
  }

  return { success: true };
}

export async function getCustomer(
  accessToken: string
): Promise<ShopifyCustomer | null> {
  const result = await storefrontFetch<{
    data: { customer: ShopifyCustomer | null };
  }>(
    `query getCustomer($token: String!) {
      customer(customerAccessToken: $token) {
        id
        email
        firstName
        lastName
        phone
        defaultAddress {
          id address1 address2 city province country zip phone firstName lastName
        }
        addresses(first: 10) {
          edges {
            node {
              id address1 address2 city province country zip phone firstName lastName
            }
          }
        }
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount currencyCode }
              statusUrl
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image { url altText }
                      price { amount currencyCode }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { token: accessToken }
  );

  return result.data.customer;
}

export async function customerAccessTokenDelete(
  accessToken: string
): Promise<boolean> {
  const result = await storefrontFetch<{
    data: {
      customerAccessTokenDelete: {
        deletedAccessToken: string | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(
    `mutation customerAccessTokenDelete($token: String!) {
      customerAccessTokenDelete(customerAccessToken: $token) {
        deletedAccessToken
        userErrors { field message }
      }
    }`,
    { token: accessToken }
  );

  return !!result.data.customerAccessTokenDelete.deletedAccessToken;
}
