"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { formatPrice, cn, wineImagePresets } from "@/lib/utils";
import { DiscountCode } from "./DiscountCode";
import { TrustSignals } from "./TrustSignals";
import { ChevronDownIcon } from "@/components/icons";
import { useUiCopy } from "@/components/providers";
import { useShopConfig } from "@/components/providers/ShopConfigProvider";

interface OrderSummaryProps {
  className?: string;
}

export function OrderSummary({ className }: OrderSummaryProps) {
  const t = useUiCopy();
  const { items, subtotal } = useCartStore();
  const { shipping, gift, discountApplied } = useCheckoutStore();
  const { giftWrappingCost } = useShopConfig();
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate totals
  const giftCost = gift.wrapping ? giftWrappingCost : 0;
  const shippingCost = shipping.cost;

  const discountAmount = discountApplied
    ? discountApplied.type === "percentage"
      ? Math.round((subtotal * discountApplied.amount) / 100 * 100) / 100
      : discountApplied.amount
    : 0;

  const total = Math.max(0, subtotal + shippingCost + giftCost - discountAmount);

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
        <h2 className="font-serif text-xl font-semibold">{t("checkout.order_title")}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-grey">{items.length} artikelen</span>
          <ChevronDownIcon
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
                        src={wineImagePresets.cart(item.product.images[0].url)}
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

            {/* Price breakdown */}
            <div className="space-y-2 text-sm border-t border-sand pt-4">
              <div className="flex justify-between">
                <span className="text-grey">{t("checkout.subtotal")}</span>
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
                  <span className="text-grey">{t("checkout.gift_wrapping")}</span>
                  <span className="text-charcoal">{formatPrice(giftCost)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-grey">{t("checkout.shipping")}</span>
                <span className="text-charcoal">
                  {formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-sand text-base font-semibold">
                <span>{t("checkout.total")}</span>
                <span className="text-wine">{formatPrice(total)}</span>
              </div>

              <p className="text-xs text-grey pt-1">{t("checkout.incl_btw")}</p>
            </div>

            {/* Trust signals */}
            <TrustSignals className="mt-6 pt-4 border-t border-sand" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile collapsed view - always show total */}
      {!isExpanded && (
        <div className="lg:hidden flex justify-between font-semibold">
          <span>{t("checkout.total")}</span>
          <span className="text-wine">{formatPrice(total)}</span>
        </div>
      )}
    </div>
  );
}

