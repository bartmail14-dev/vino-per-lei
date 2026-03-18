"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { getShopifyCartUrl } from "@/lib/shopify";
import { paymentSchema, validateSection } from "@/lib/validation";
import { Checkbox, Button } from "@/components/ui";
import { Wine } from "lucide-react";

// Payment method selection is handled by Shopify hosted checkout.
// We only need age verification before redirecting.

export function PaymentSection() {
  const { payment, setPayment, errors, setError, clearError } =
    useCheckoutStore();
  const items = useCartStore((state) => state.items);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validate payment section
    const validationErrors = validateSection(paymentSchema, payment);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(`payment.${field}`, message);
      });
      return;
    }

    // Redirect to Shopify cart permalink
    setIsSubmitting(true);
    const lineItems = items.map((item) => ({
      variantId: item.product.variantId,
      quantity: item.quantity,
    }));
    window.location.href = getShopifyCartUrl(lineItems);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Age verification - REQUIRED */}
      <div className="p-4 bg-wine/5 border border-wine/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Wine className="w-6 h-6 text-wine flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="font-medium text-charcoal mb-2">
              Leeftijdsverificatie
            </p>
            <Checkbox
              label="Ik bevestig dat ik 18 jaar of ouder ben"
              checked={payment.ageVerified}
              onChange={(e) => {
                setPayment({ ageVerified: e.target.checked });
                clearError("payment.ageVerified");
              }}
            />
            {errors["payment.ageVerified"] && (
              <p className="text-sm text-error mt-1">
                {errors["payment.ageVerified"]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="p-4 bg-warm-white rounded-lg border border-sand">
        <p className="text-sm text-charcoal mb-2 font-medium">
          Betaalmethode kiezen
        </p>
        <p className="text-sm text-grey">
          Je wordt doorgestuurd naar de beveiligde Shopify checkout waar je kunt betalen met iDEAL, creditcard, PayPal en meer.
        </p>
      </div>

      {/* Error message */}
      {localError && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {localError}
        </div>
      )}

      {/* Submit button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={!payment.ageVerified}
        >
          {isSubmitting ? "Doorsturen naar betaling..." : "Afrekenen via Shopify"}
        </Button>
        <p className="text-xs text-grey text-center mt-3">
          Door te bestellen ga je akkoord met onze{" "}
          <a href="/voorwaarden" className="text-wine hover:underline">
            algemene voorwaarden
          </a>
        </p>
      </div>
    </form>
  );
}

