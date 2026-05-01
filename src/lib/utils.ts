import { clsx, type ClassValue } from "clsx";

/**
 * Utility function to merge class names
 * Combines clsx for conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format price in EUR
 */
export function formatPrice(price: number, locale: string = "nl-NL"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  originalPrice: number,
  salePrice: number
): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Format rating to display string
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

/**
 * Shopify CDN Image Optimizer
 *
 * Transforms Shopify CDN URLs to include size, crop, and format parameters.
 * This ensures that ANY image Carla uploads in Shopify Admin is automatically
 * served in the optimal size and format — no manual processing needed.
 *
 * Shopify CDN supports these URL params:
 * - width / height: resize
 * - crop: center, top, bottom, left, right
 * - format: webp, jpg, png (auto-negotiated via Accept header too)
 *
 * @see https://shopify.dev/docs/api/liquid/filters/image_url
 */
export function optimizeShopifyImage(
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: "center" | "top" | "bottom" | "left" | "right";
    format?: "webp" | "jpg" | "png";
  } = {}
): string {
  if (!url || !url.includes("cdn.shopify.com")) return url;

  try {
    const imageUrl = new URL(url);

    if (options.width) imageUrl.searchParams.set("width", String(options.width));
    if (options.height) imageUrl.searchParams.set("height", String(options.height));
    if (options.crop) imageUrl.searchParams.set("crop", options.crop);
    if (options.format) imageUrl.searchParams.set("format", options.format);

    return imageUrl.toString();
  } catch {
    return url;
  }
}

/**
 * Generate a background-removal API URL for a Shopify product image.
 * Proxies through /api/remove-bg which calls the remove.bg API.
 */
export function removeBgUrl(shopifyUrl: string): string {
  if (!shopifyUrl || !shopifyUrl.includes("cdn.shopify.com")) return shopifyUrl;
  return `/api/remove-bg?v=6&url=${encodeURIComponent(shopifyUrl)}`;
}

/**
 * Preset image sizes for consistent wine bottle display.
 * Product images are routed through /api/remove-bg for transparent backgrounds.
 * Non-product images (OG) use Shopify CDN directly.
 */
export const wineImagePresets = {
  /** ProductCard thumbnail (small grid) */
  card: (url: string) =>
    removeBgUrl(optimizeShopifyImage(url, { width: 400, height: 600, crop: "center" })),

  /** ProductCard large (hover/detail) */
  cardLarge: (url: string) =>
    removeBgUrl(optimizeShopifyImage(url, { width: 600, height: 900, crop: "center" })),

  /** Product detail hero image */
  hero: (url: string) =>
    removeBgUrl(optimizeShopifyImage(url, { width: 800, height: 1200, crop: "center" })),

  /** Product detail thumbnail gallery */
  thumbnail: (url: string) =>
    removeBgUrl(optimizeShopifyImage(url, { width: 120, height: 180, crop: "center" })),

  /** Cart/checkout small preview */
  cart: (url: string) =>
    removeBgUrl(optimizeShopifyImage(url, { width: 160, height: 240, crop: "center" })),

  /** OG image / social share — no bg removal (needs solid background for social) */
  og: (url: string) =>
    optimizeShopifyImage(url, { width: 1200, height: 630, crop: "center" }),

  /** Mobile card — smaller for faster LCP on mobile devices */
  cardMobile: (url: string) =>
    removeBgUrl(optimizeShopifyImage(url, { width: 200, height: 300, crop: "center" })),
} as const;
