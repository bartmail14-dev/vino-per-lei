"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { GIFT_WRAPPING_COST } from "@/types/checkout";
import { FREE_SHIPPING_THRESHOLD } from "@/types/cart";
import { DiscountCode } from "./DiscountCode";
import { TrustSignals } from "./TrustSignals";

interface OrderSummaryProps {
  className?: string;
}

export function OrderSummary({ className }: OrderSummaryProps) {
  const { items, subtotal } = useCartStore();
  const { shipping, gift, discountApplied } = useCheckoutStore();
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate totals
  const giftCost = gift.wrapping ? GIFT_WRAPPING_COST : 0;
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD && shipping.method === "standard"
      ? 0
      : shipping.cost;

  const discountAmount = discountApplied
    ? discountApplied.type === "percentage"
      ? (subtotal * discountApplied.amount) / 100
      : discountApplied.amount
    : 0;

  const total = subtotal + shippingCost + giftCost - discountAmount;

  const freeShippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-sand p-6 sticky top-6",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4 lg:cursor-default"
      >
        <h2 className="font-serif text-xl font-semibold">Bestelling</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-grey">{items.length} artikelen</span>
          <ChevronIcon
            className={cn(
              "w-5 h-5 text-grey lg:hidden transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Items */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-20 bg-warm-white rounded flex-shrink-0">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        fill
                        className="object-contain p-1"
                      />
                    )}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal line-clamp-1">
                      {item.product.title}
                    </p>
                    {item.product.vintage && (
                      <p className="text-xs text-grey">{item.product.vintage}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-charcoal">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Discount code */}
            <DiscountCode className="mb-4" />

            {/* Free shipping progress */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="mb-4 p-3 bg-warm-white rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-grey">Nog {formatPrice(amountToFreeShipping)} voor gratis verzending</span>
                  <TruckIcon className="w-4 h-4 text-wine" />
                </div>
                <div className="h-2 bg-sand rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-wine rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2 text-sm border-t border-sand pt-4">
              <div className="flex justify-between">
                <span className="text-grey">Subtotaal</span>
                <span className="text-charcoal">{formatPrice(subtotal)}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-success">
                  <span>Korting ({discountApplied.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {gift.wrapping && (
                <div className="flex justify-between">
                  <span className="text-grey">Geschenkverpakking</span>
                  <span className="text-charcoal">{formatPrice(giftCost)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-grey">Verzending</span>
                <span className="text-charcoal">
                  {shippingCost === 0 ? (
                    <span className="text-success">Gratis</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-sand text-base font-semibold">
                <span>Totaal</span>
                <span className="text-wine">{formatPrice(total)}</span>
              </div>

              <p className="text-xs text-grey pt-1">Inclusief BTW</p>
            </div>

            {/* Trust signals */}
            <TrustSignals className="mt-6 pt-4 border-t border-sand" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile collapsed view - always show total */}
      {!isExpanded && (
        <div className="lg:hidden flex justify-between font-semibold">
          <span>Totaal</span>
          <span className="text-wine">{formatPrice(total)}</span>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
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
