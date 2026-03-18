// Checkout page redirects to Shopify hosted checkout.
// All payment processing happens on Shopify's side.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { getShopifyCartUrl } from "@/lib/shopify";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.itemCount);

  useEffect(() => {
    if (itemCount === 0) {
      router.push("/wijnen");
      return;
    }

    // Redirect to Shopify cart permalink
    const lineItems = items.map((item) => ({
      variantId: item.product.variantId,
      quantity: item.quantity,
    }));
    window.location.href = getShopifyCartUrl(lineItems);
  }, [itemCount, items, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-wine border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-grey text-sm">Doorsturen naar betaling...</p>
      </div>
    </div>
  );
}
