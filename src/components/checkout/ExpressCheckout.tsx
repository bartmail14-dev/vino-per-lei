"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { getShopifyCartUrl } from "@/lib/shopify";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ExpressCheckoutProps {
  className?: string;
}

export function ExpressCheckout({ className }: ExpressCheckoutProps) {
  const items = useCartStore((state) => state.items);
  const [isLoading, setIsLoading] = useState(false);

  const handleShopifyCheckout = () => {
    setIsLoading(true);
    const lineItems = items.map((item) => ({
      variantId: item.product.variantId,
      quantity: item.quantity,
    }));
    window.location.href = getShopifyCartUrl(lineItems);
  };

  return (
    <div className={cn("space-y-3", className)}>
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
