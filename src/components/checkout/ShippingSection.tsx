"use client";

import { useCheckoutStore, calculateEstimatedDelivery, calculateShippingCost } from "@/stores/checkoutStore";
import { Button } from "@/components/ui";
import type { ShippingMethod } from "@/types/checkout";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TruckIcon, ThermometerIcon, ClockIcon, SunIcon } from "@/components/icons";
import { useUiCopy } from "@/components/providers";
import { useShopConfig } from "@/components/providers/ShopConfigProvider";

interface ShippingSectionProps {
  onComplete: () => void;
}

export function ShippingSection({ onComplete }: ShippingSectionProps) {
  const t = useUiCopy();
  const { shipping, setShipping } = useCheckoutStore();
  const { shippingCost, shippingCostTemperature } = useShopConfig();

  const shippingOptions: {
    method: ShippingMethod;
    title: string;
    description: string;
    deliveryTime: string;
    icon: React.ReactNode;
  }[] = [
    {
      method: "standard",
      title: t("checkout.shipping.standard_title"),
      description: t("checkout.shipping.standard_desc"),
      deliveryTime: t("checkout.shipping.standard_time"),
      icon: <TruckIcon className="w-6 h-6" />,
    },
    {
      method: "temperature",
      title: t("checkout.shipping.temp_title"),
      description: t("checkout.shipping.temp_desc"),
      deliveryTime: t("checkout.shipping.temp_time"),
      icon: <ThermometerIcon className="w-6 h-6" />,
    },
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const handleMethodChange = (method: ShippingMethod) => {
    const cost = calculateShippingCost(method, shippingCost, shippingCostTemperature);
    const estimatedDate = calculateEstimatedDelivery(method);
    setShipping({ method, cost, estimatedDate });
  };

  const getShippingPrice = (method: ShippingMethod): string => {
    return formatPrice(calculateShippingCost(method, shippingCost, shippingCostTemperature));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Shipping options */}
      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const isSelected = shipping.method === option.method;
          const price = getShippingPrice(option.method);

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
                    <span className="font-semibold text-charcoal">
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
            {t("checkout.shipping.estimated")}{" "}
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
            <p className="text-sm font-medium text-charcoal">{t("checkout.shipping.summer_title")}</p>
            <p className="text-xs text-grey">
              {t("checkout.shipping.summer_text")}
            </p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth>
          {t("checkout.shipping.continue")}
        </Button>
      </div>
    </form>
  );
}
