"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { paymentSchema, validateSection } from "@/lib/validation";
import { Select, Checkbox, Button } from "@/components/ui";
import { IDEAL_BANKS, type PaymentMethod } from "@/types/checkout";
import { cn } from "@/lib/utils";

const paymentMethods: {
  method: PaymentMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    method: "ideal",
    title: "iDEAL",
    description: "Betaal direct via je eigen bank",
    icon: <IdealIcon className="h-8" />,
  },
  {
    method: "card",
    title: "Creditcard",
    description: "Visa, Mastercard, American Express",
    icon: <CardIcon className="h-8" />,
  },
  {
    method: "paypal",
    title: "PayPal",
    description: "Betaal met je PayPal account",
    icon: <PaypalIcon className="h-8" />,
  },
  {
    method: "klarna",
    title: "Klarna",
    description: "Betaal achteraf of in termijnen",
    icon: <KlarnaIcon className="h-8" />,
  },
];

export function PaymentSection() {
  const router = useRouter();
  const { payment, setPayment, errors, setError, clearError, submitOrder, isSubmitting } =
    useCheckoutStore();
  const clearCart = useCartStore((state) => state.clearCart);
  const [localError, setLocalError] = useState<string | null>(null);

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

    // Submit order
    const result = await submitOrder();

    if (result.success && result.orderId) {
      // Redirect first, then clear cart to prevent data loss on navigation failure
      router.push(`/checkout/success?order=${result.orderId}`);
      setTimeout(() => clearCart(), 200);
    } else {
      setLocalError(result.error || "Er is een fout opgetreden. Probeer het opnieuw.");
    }
  };

  const handleMethodChange = (method: PaymentMethod) => {
    setPayment({ method, idealBank: "" });
    clearError("payment.method");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Age verification - REQUIRED */}
      <div className="p-4 bg-wine/5 border border-wine/20 rounded-lg">
        <div className="flex items-start gap-3">
          <WineIcon className="w-6 h-6 text-wine flex-shrink-0 mt-0.5" />
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

      {/* Payment methods */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-3">
          Selecteer betaalmethode
        </label>
        <div className="space-y-3">
          {paymentMethods.map((option) => {
            const isSelected = payment.method === option.method;

            return (
              <label
                key={option.method}
                className={cn(
                  "block p-4 border-2 rounded-lg cursor-pointer transition-all",
                  isSelected
                    ? "border-wine bg-wine/5"
                    : "border-sand hover:border-wine/50"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Radio button */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected ? "border-wine" : "border-grey"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-wine" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value={option.method}
                    checked={isSelected}
                    onChange={() => handleMethodChange(option.method)}
                    className="sr-only"
                  />

                  {/* Icon */}
                  <div className="flex-shrink-0">{option.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <span className="font-medium text-charcoal">
                      {option.title}
                    </span>
                    <p className="text-sm text-grey">{option.description}</p>
                  </div>
                </div>

                {/* iDEAL bank selector */}
                <AnimatePresence>
                  {option.method === "ideal" && isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 ml-9 overflow-hidden"
                    >
                      <Select
                        label="Selecteer je bank"
                        options={IDEAL_BANKS.map((bank) => ({
                          value: bank.value,
                          label: bank.label,
                        }))}
                        value={payment.idealBank}
                        onChange={(e) => setPayment({ idealBank: e.target.value })}
                        placeholder="Kies een bank"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </label>
            );
          })}
        </div>
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
          {isSubmitting ? "Bestelling verwerken..." : "Bestelling plaatsen"}
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

// Payment method icons
function IdealIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#CC0066" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        iDEAL
      </text>
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <rect x="2" y="4" width="44" height="24" rx="4" fill="#1A1F71" />
      <rect x="2" y="10" width="44" height="4" fill="#4A5568" />
      <rect x="6" y="18" width="12" height="3" rx="1" fill="#A0AEC0" />
    </svg>
  );
}

function PaypalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#003087" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        PayPal
      </text>
    </svg>
  );
}

function KlarnaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#FFB3C7" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="#0A0B09"
        fontSize="9"
        fontWeight="bold"
      >
        Klarna
      </text>
    </svg>
  );
}

function WineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 22h8M12 11v11M12 11a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" />
    </svg>
  );
}
