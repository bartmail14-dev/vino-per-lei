"use client";

import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { SavingsBadge } from "./Badge";

export interface PriceDisplayProps {
  currentPrice: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  showSavings?: boolean;
  className?: string;
}

export function PriceDisplay({
  currentPrice,
  originalPrice,
  size = "md",
  showSavings = false,
  className,
}: PriceDisplayProps) {
  const hasSale = originalPrice && originalPrice > currentPrice;
  const discount = hasSale ? calculateDiscount(originalPrice, currentPrice) : 0;
  const savings = hasSale ? originalPrice - currentPrice : 0;

  const sizes = {
    sm: {
      current: "text-base font-semibold",
      original: "text-xs",
    },
    md: {
      current: "text-lg font-semibold",
      original: "text-sm",
    },
    lg: {
      current: "text-2xl font-bold",
      original: "text-base",
    },
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            sizes[size].current,
            "text-charcoal tabular-nums"
          )}
        >
          {formatPrice(currentPrice)}
        </span>

        {hasSale && (
          <span
            className={cn(
              sizes[size].original,
              "text-grey line-through tabular-nums"
            )}
          >
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {hasSale && showSavings && (
        <SavingsBadge amount={savings} percentage={discount} />
      )}
    </div>
  );
}
