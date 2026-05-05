"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button, PriceDisplay, QuantitySelector } from "@/components/ui";
import { useUiCopy } from "@/components/providers";
import { cn, wineImagePresets } from "@/lib/utils";
import { getOrderIncrement, getOrderMaximum, getOrderMinimum, getOrderUnitText, getPriceUnitText } from "@/lib/order-rules";
import { CheckIcon, CheckCircleIcon } from "@/components/icons";
import type { Product } from "@/types";

interface StickyPurchaseBarProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  isAdding: boolean;
  justAdded: boolean;
  heroRef: React.RefObject<HTMLElement | null>;
}

export function StickyPurchaseBar({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAdding,
  justAdded,
  heroRef,
}: StickyPurchaseBarProps) {
  const t = useUiCopy();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsVisible(heroBottom < 80);

        // Progress bar based on page scroll
        const scrolled = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docHeight > 0 ? (scrolled / docHeight) * 100 : 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const savings = isOnSale ? product.originalPrice! - product.price : 0;
  const orderMinimum = getOrderMinimum(product);
  const orderIncrement = getOrderIncrement(product);
  const orderMaximum = getOrderMaximum(product);
  const orderUnitText = getOrderUnitText(product);
  const priceUnitText = getPriceUnitText(product);

  return (
    <>
      {/* Desktop Sticky Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 left-0 right-0 z-40 hidden lg:block"
          >
            {/* Scroll progress indicator */}
            <div className="h-0.5 bg-sand/30">
              <motion.div
                className="h-full bg-wine"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            <div className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-sand/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-6">
                  {/* Product Info with thumbnail */}
                  <div className="flex items-center gap-3 min-w-0">
                    {product.images[0] && (
                      <div className="relative w-10 h-12 flex-shrink-0 rounded overflow-hidden bg-champagne/20">
                        <Image
                          src={wineImagePresets.thumbnail(product.images[0].url)}
                          alt={product.title}
                          fill
                          className="object-contain p-0.5"
                          sizes="40px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="font-serif text-base font-semibold truncate">
                        {product.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-grey">
                        {product.vintage && (
                          <span>{product.vintage === t("product.details.vintage_code_non_vintage") ? t("product.details.vintage_code_non_vintage") : product.vintage}</span>
                        )}
                        {product.region && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-grey" />
                            <span>{product.region}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <PriceDisplay
                        currentPrice={product.price}
                        originalPrice={product.originalPrice}
                        size="md"
                      />
                      {(priceUnitText || product.purchaseUnit) && (
                        <p className="text-xs text-grey">
                          {priceUnitText ?? `per ${product.purchaseUnit?.toLowerCase()}`}
                        </p>
                      )}
                      {isOnSale && (
                        <p className="text-xs text-success font-medium">
                          {t("product.savings", { amount: savings.toFixed(2).replace(".", ",") })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    {/* Stock Status */}
                    {product.inStock ? (
                      <span className="flex items-center gap-1.5 text-sm text-success">
                        <CheckCircleIcon className="w-4 h-4" />
                        {t("product.stock.in_stock")}
                      </span>
                    ) : (
                      <span className="text-sm text-error font-medium">{t("product.stock.out_of_stock")}</span>
                    )}

                    {/* Quantity */}
                    <QuantitySelector
                      value={quantity}
                      onChange={onQuantityChange}
                      min={orderMinimum}
                      max={orderMaximum}
                      step={orderIncrement}
                      disabled={!product.inStock}
                    />

                    {/* Add to Cart */}
                    {product.inStock ? (
                      <Button
                        variant="primary"
                        onClick={onAddToCart}
                        isLoading={isAdding}
                        disabled={isAdding}
                        className={cn(
                          "min-w-[180px] relative overflow-hidden",
                          justAdded && "bg-success hover:bg-success"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {justAdded ? (
                            <motion.span
                              key="added"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center"
                            >
                              <CheckIcon className="w-4 h-4 mr-2" />
                              {t("product.added_exclamation")}
                            </motion.span>
                          ) : (
                            <motion.span
                              key="default"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {t("product.in_cart")}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    ) : (
                      <Button variant="secondary" className="min-w-[180px]">
                        {t("product.notify_stock")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white/95 backdrop-blur-lg border-t border-sand shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <div className="px-4 py-3">
            {/* Row 1: Price and Stock */}
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <PriceDisplay
                  currentPrice={product.price}
                  originalPrice={product.originalPrice}
                  size="md"
                />
                {(priceUnitText || product.purchaseUnit) && (
                  <p className="text-xs text-grey mt-0.5">
                    {priceUnitText ?? `per ${product.purchaseUnit?.toLowerCase()}`}
                  </p>
                )}
                {isOnSale && (
                  <p className="text-xs text-success font-medium mt-0.5">
                    {t("product.savings", { amount: savings.toFixed(2).replace(".", ",") })}
                  </p>
                )}
              </div>
              {product.inStock ? (
                <span className="flex items-center gap-1 text-xs text-success font-medium bg-success/10 px-2 py-0.5 rounded-full">
                  <CheckCircleIcon className="w-3 h-3" />
                  {t("product.stock.in_stock")}
                </span>
              ) : (
                <span className="text-xs text-error font-medium bg-error/10 px-2 py-0.5 rounded-full">
                  {t("product.stock.out_of_stock")}
                </span>
              )}
            </div>

            {/* Row 2: Quantity and Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              {product.inStock && (
                <div className="flex-shrink-0">
                  <QuantitySelector
                    value={quantity}
                    onChange={onQuantityChange}
                    min={orderMinimum}
                    max={orderMaximum}
                    step={orderIncrement}
                    size="sm"
                  />
                </div>
              )}

              {/* Add to Cart */}
              {product.inStock ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onAddToCart}
                  isLoading={isAdding}
                  disabled={isAdding}
                  className={cn(
                    "flex-1 min-h-[48px] relative overflow-hidden",
                    justAdded && "bg-success hover:bg-success"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center"
                      >
                        <CheckIcon className="w-5 h-5 mr-2" />
                        {t("product.added_exclamation")}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {t("product.in_cart")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              ) : (
                <Button variant="secondary" size="lg" className="flex-1 min-h-[48px]">
                  {t("product.notify_stock")}
                </Button>
              )}
            </div>
            {orderUnitText && product.inStock && (
              <p className="text-[11px] text-grey mt-2 text-center">
                {t("product.order.per_unit", { unit: orderUnitText })}
              </p>
            )}
          </div>
          {/* Safe area padding for iOS */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </div>
    </>
  );
}
