"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { createCheckout } from "@/lib/shopify";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ExpressCheckoutProps {
  className?: string;
}

export function ExpressCheckout({ className }: ExpressCheckoutProps) {
  const items = useCartStore((state) => state.items);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShopifyCheckout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const lineItems = items.map((item) => ({
        variantId: item.product.variantId,
        quantity: item.quantity,
      }));
      const checkout = await createCheckout(lineItems);
      if (checkout?.webUrl) {
        window.location.href = checkout.webUrl;
      } else {
        setError("Kan checkout niet starten. Probeer het opnieuw.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Express checkout failed:", err);
      setError("Er ging iets mis. Probeer het later opnieuw.");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm text-grey text-center">Snel afrekenen</p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      <Button
        variant="primary"
        fullWidth
        size="lg"
        disabled={isLoading || items.length === 0}
        onClick={handleShopifyCheckout}
      >
        {isLoading ? "Doorsturen naar betaling..." : "Afrekenen via Shopify"}
      </Button>

      <p className="text-xs text-grey text-center">
        Je kunt betalen met iDEAL, creditcard, PayPal en meer
      </p>
    </div>
  );
}
