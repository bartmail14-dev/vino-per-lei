"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, PriceDisplay, QuantitySelector } from "@/components/ui";
import { cn } from "@/lib/utils";
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsVisible(heroBottom < 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const savings = isOnSale ? product.originalPrice! - product.price : 0;

  return (
    <>
      {/* Desktop Sticky Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-40 hidden lg:block"
          >
            <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-sand">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-6">
                  {/* Product Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <h2 className="font-serif text-lg font-semibold truncate">
                      {product.title}
                    </h2>
                    {product.vintage && (
                      <span className="text-grey flex-shrink-0">
                        {product.vintage === "NV" ? "NV" : product.vintage}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <PriceDisplay
                        currentPrice={product.price}
                        originalPrice={product.originalPrice}
                        size="md"
                      />
                      {isOnSale && (
                        <p className="text-sm text-success">
                          Je bespaart €{savings.toFixed(2)}
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
                        Op voorraad
                      </span>
                    ) : (
                      <span className="text-sm text-error">Uitverkocht</span>
                    )}

                    {/* Quantity */}
                    <QuantitySelector
                      value={quantity}
                      onChange={onQuantityChange}
                      min={1}
                      max={product.stockQuantity || 99}
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
                          "min-w-[180px]",
                          justAdded && "bg-success hover:bg-success"
                        )}
                      >
                        {justAdded ? (
                          <>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Toegevoegd!
                          </>
                        ) : (
                          "In Winkelmand"
                        )}
                      </Button>
                    ) : (
                      <Button variant="secondary" className="min-w-[180px]">
                        Notify me
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fixed Bottom Bar - Enhanced */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white border-t border-sand shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="px-4 py-3">
            {/* Row 1: Price and Stock */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <PriceDisplay
                  currentPrice={product.price}
                  originalPrice={product.originalPrice}
                  size="md"
                />
              </div>
              {product.inStock ? (
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  Op voorraad
                </span>
              ) : (
                <span className="text-xs text-error font-medium">Uitverkocht</span>
              )}
            </div>

            {/* Row 2: Quantity and Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Quantity Selector - Compact for mobile */}
              {product.inStock && (
                <div className="flex-shrink-0">
                  <QuantitySelector
                    value={quantity}
                    onChange={onQuantityChange}
                    min={1}
                    max={product.stockQuantity || 99}
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
                    "flex-1 min-h-[48px]",
                    justAdded && "bg-success hover:bg-success"
                  )}
                >
                  {justAdded ? (
                    <>
                      <CheckIcon className="w-5 h-5 mr-2" />
                      Toegevoegd!
                    </>
                  ) : (
                    "In Winkelmand"
                  )}
                </Button>
              ) : (
                <Button variant="secondary" size="lg" className="flex-1 min-h-[48px]">
                  Notify Me
                </Button>
              )}
            </div>
          </div>
          {/* Safe area padding for iOS */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </div>
    </>
  );
}

