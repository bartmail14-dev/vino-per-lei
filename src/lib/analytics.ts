// PostHog analytics helpers
// Requires NEXT_PUBLIC_POSTHOG_KEY env var

import posthog from "posthog-js";

let initialized = false;

function hasConsent(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(/(?:^|;\s*)vpl_cookie_consent=([^;]*)/);
  if (!match) return false;
  return match[1] === "all" || match[1].includes("analytics");
}

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // we handle this manually
    persistence: hasConsent() ? "localStorage+cookie" : "memory",
    loaded: (ph) => {
      if (!hasConsent()) {
        ph.opt_out_capturing();
      }
    },
  });

  initialized = true;
}

export function updatePostHogConsent(analyticsAllowed: boolean) {
  if (!initialized) {
    if (analyticsAllowed) {
      initPostHog();
      posthog.opt_in_capturing();
      posthog.set_config({ persistence: "localStorage+cookie" });
    }
    return;
  }
  if (analyticsAllowed) {
    posthog.opt_in_capturing();
    posthog.set_config({ persistence: "localStorage+cookie" });
  } else {
    posthog.opt_out_capturing();
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (initialized && hasConsent()) {
    posthog.capture(eventName, params);
  }
}

export function trackPageView(url: string) {
  if (initialized && hasConsent()) {
    posthog.capture("$pageview", { $current_url: url });
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
    item_id: product.id,
    item_name: product.title,
    item_category: product.category,
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
    item_id: product.id,
    item_name: product.title,
    quantity: product.quantity,
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
