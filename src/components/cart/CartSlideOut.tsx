"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { Button, QuantitySelector } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/types";

// Icons
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CartSlideOut() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.itemCount);
  const subtotal = useCartStore((state) => state.subtotal);
  const shipping = useCartStore((state) => state.shipping);
  const total = useCartStore((state) => state.total);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const panelRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  // Focus trap
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const amountUntilFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Winkelmand"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
              <h2 className="font-serif text-xl font-semibold">
                Winkelmand
                {itemCount > 0 && (
                  <span className="text-grey font-normal"> ({itemCount})</span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 hover:bg-sand/50 rounded-md transition-colors"
                aria-label="Sluit winkelmand"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <ShoppingBagIcon className="w-16 h-16 text-sand mb-4" />
                <h3 className="font-serif text-lg mb-2">
                  Je winkelmand is leeg
                </h3>
                <p className="text-sm text-grey mb-6">
                  Ontdek onze wijnen en voeg je favorieten toe.
                </p>
                <Button onClick={closeCart} variant="primary">
                  Bekijk onze wijnen
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-4 pb-4 border-b border-sand last:border-0"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-24 bg-warm-white rounded overflow-hidden flex-shrink-0">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.title}
                              fill
                              sizes="80px"
                              className="object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-grey">
                              <ShoppingBagIcon className="w-8 h-8 opacity-30" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/wijnen/${item.product.handle}`}
                            onClick={closeCart}
                            className="font-serif text-sm font-medium text-charcoal hover:text-wine line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          {item.product.vintage && (
                            <p className="text-xs text-grey mt-0.5">
                              {item.product.vintage === "NV"
                                ? "Non-Vintage"
                                : item.product.vintage}
                            </p>
                          )}
                          <p className="text-sm font-semibold mt-2">
                            {formatPrice(item.product.price)}
                            {item.quantity > 1 && (
                              <span className="font-normal text-grey">
                                {" "}
                                x {item.quantity} ={" "}
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            )}
                          </p>

                          {/* Quantity & Remove */}
                          <div className="flex items-center justify-between mt-3">
                            <QuantitySelector
                              value={item.quantity}
                              onChange={(q) => updateQuantity(item.id, q)}
                              min={1}
                              max={99}
                              size="sm"
                            />
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-grey hover:text-error transition-colors"
                              aria-label={`Verwijder ${item.product.title}`}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t border-sand px-6 py-4 space-y-4 bg-warm-white/50">
                  {/* Free Shipping Progress */}
                  <div className="bg-white rounded-lg p-3">
                    {hasFreeShipping ? (
                      <div className="flex items-center gap-2 text-sm text-success">
                        <CheckIcon className="w-4 h-4" />
                        <span>Gefeliciteerd! Je komt in aanmerking voor gratis verzending</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-charcoal mb-2">
                          Nog{" "}
                          <span className="font-semibold">
                            {formatPrice(amountUntilFreeShipping)}
                          </span>{" "}
                          voor gratis verzending
                        </p>
                        <div className="h-1.5 bg-sand rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-wine rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${freeShippingProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-grey">Subtotaal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grey">Verzending</span>
                      <span className={cn(hasFreeShipping && "text-success")}>
                        {hasFreeShipping ? "Gratis" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-sand text-base font-semibold">
                      <span>Totaal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout" onClick={closeCart}>
                    <Button
                      variant="primary"
                      fullWidth
                      size="lg"
                    >
                      Afrekenen
                    </Button>
                  </Link>

                  {/* Continue Shopping */}
                  <button
                    onClick={closeCart}
                    className="w-full text-center text-sm text-wine hover:underline"
                  >
                    Verder winkelen
                  </button>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-grey">
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" />
                      100% Proefgarantie
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" />
                      Veilig betalen
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
