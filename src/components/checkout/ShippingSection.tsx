"use client";

import { useCheckoutStore, calculateShippingCost, calculateEstimatedDelivery } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui";
import { SHIPPING_COSTS, type ShippingMethod } from "@/types/checkout";
import { FREE_SHIPPING_THRESHOLD } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ShippingSectionProps {
  onComplete: () => void;
}

const shippingOptions: {
  method: ShippingMethod;
  title: string;
  description: string;
  deliveryTime: string;
  icon: React.ReactNode;
}[] = [
  {
    method: "standard",
    title: "Standaard verzending",
    description: "Bezorging door PostNL",
    deliveryTime: "1-2 werkdagen",
    icon: <TruckIcon className="w-6 h-6" />,
  },
  {
    method: "temperature",
    title: "Temperatuur-gecontroleerd",
    description: "Gekoelde verzending voor optimale kwaliteit",
    deliveryTime: "1-2 werkdagen",
    icon: <ThermometerIcon className="w-6 h-6" />,
  },
  {
    method: "evening",
    title: "Avondlevering",
    description: "Bezorging tussen 18:00 - 22:00",
    deliveryTime: "Volgende werkdag",
    icon: <MoonIcon className="w-6 h-6" />,
  },
];

export function ShippingSection({ onComplete }: ShippingSectionProps) {
  const { shipping, setShipping } = useCheckoutStore();
  const { subtotal } = useCartStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const handleMethodChange = (method: ShippingMethod) => {
    const cost = calculateShippingCost(method, subtotal);
    const estimatedDate = calculateEstimatedDelivery(method);
    setShipping({ method, cost, estimatedDate });
  };

  const getShippingPrice = (method: ShippingMethod): string => {
    if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) {
      return "Gratis";
    }
    return formatPrice(SHIPPING_COSTS[method]);
  };

  const isFreeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Free shipping banner */}
      {isFreeShippingEligible && (
        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg text-success">
          <CheckIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            Je komt in aanmerking voor gratis standaard verzending!
          </span>
        </div>
      )}

      {/* Shipping options */}
      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const isSelected = shipping.method === option.method;
          const price = getShippingPrice(option.method);
          const isFree = price === "Gratis";

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
              <div className="flex items-start gap-4">
                {/* Radio button */}
                <div className="mt-1">
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
                    name="shipping"
                    value={option.method}
                    checked={isSelected}
                    onChange={() => handleMethodChange(option.method)}
                    className="sr-only"
                  />
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isSelected ? "text-wine" : "text-grey"
                  )}
                >
                  {option.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-charcoal">
                      {option.title}
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        isFree ? "text-success" : "text-charcoal"
                      )}
                    >
                      {price}
                    </span>
                  </div>
                  <p className="text-sm text-grey">{option.description}</p>
                  <p className="text-sm text-grey mt-1">
                    <ClockIcon className="w-3.5 h-3.5 inline mr-1" />
                    {option.deliveryTime}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Estimated delivery */}
      {shipping.estimatedDate && (
        <div className="p-3 bg-warm-white rounded-lg">
          <p className="text-sm text-grey">
            Geschatte bezorging:{" "}
            <span className="font-medium text-charcoal">
              {shipping.estimatedDate}
            </span>
          </p>
        </div>
      )}

      {/* Temperature warning - show in summer months */}
      {shipping.method !== "temperature" && (
        <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <SunIcon className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-charcoal">Zomertip</p>
            <p className="text-xs text-grey">
              Overweeg temperatuur-gecontroleerde verzending voor optimale
              wijnkwaliteit bij warm weer.
            </p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth>
          Doorgaan naar betaling
        </Button>
      </div>
    </form>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ThermometerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
