// Google Analytics 4 event helpers
// Replace G-XXXXXXXXXX with your actual GA4 Measurement ID

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function hasConsent(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(/(?:^|;\s*)vpl_cookie_consent=([^;]*)/);
  if (!match) return false;
  // Support legacy "all" value and new granular format
  return match[1] === "all" || match[1].includes("analytics");
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag && hasConsent()) {
    window.gtag("event", eventName, params);
  }
}

export function trackViewItem(product: {
  title: string;
  id: string;
  price: number;
  category?: string;
}) {
  trackEvent("view_item", {
    currency: "EUR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.price,
      },
    ],
  });
}

export function trackAddToCart(product: {
  title: string;
  id: string;
  price: number;
  quantity: number;
}) {
  trackEvent("add_to_cart", {
    currency: "EUR",
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

export function trackBeginCheckout(
  value: number,
  items: Array<{ id: string; title: string; price: number; quantity: number }>
) {
  trackEvent("begin_checkout", {
    currency: "EUR",
    value,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.title,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

export function trackPurchase(
  transactionId: string,
  value: number,
  items: Array<{ id: string; title: string; price: number; quantity: number }>
) {
  trackEvent("purchase", {
    transaction_id: transactionId,
    currency: "EUR",
    value,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.title,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}
