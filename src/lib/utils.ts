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
