"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useRecentlyViewedStore } from "@/stores/recentlyViewedStore";
import { Button, QuantitySelector } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/types";
import { type Product } from "@/types";

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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

/** Compact suggestion card for cross-sell in the cart slide-out */
function SuggestionCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-sand/40 hover:border-sand/70 transition-colors duration-200">
      <div className="relative w-12 h-16 bg-gradient-to-b from-champagne/40 to-warm-white rounded-md overflow-hidden flex-shrink-0">
        {product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-grey">
            <ShoppingBagIcon className="w-5 h-5 opacity-30" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-charcoal line-clamp-1">
          {product.title}
        </p>
        <p className="text-[11px] text-grey">{product.region}</p>
        <p className="text-sm font-semibold text-charcoal mt-0.5">
          {formatPrice(product.price)}
        </p>
      </div>
      <button
        onClick={() => onAdd(product)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-wine/8 text-wine rounded-full hover:bg-wine hover:text-white transition-all duration-200 hover:scale-105"
        aria-label={`Voeg ${product.title} toe`}
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
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
  const addItem = useCartStore((state) => state.addItem);

  const getSuggestedProducts = useRecentlyViewedStore(
    (state) => state.getSuggestedProducts
  );
  const getEmptyCartSuggestions = useRecentlyViewedStore(
    (state) => state.getEmptyCartSuggestions
  );

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

  // Get cross-sell suggestions
  const cartProductIds = items.map((item) => item.product.id);
  const suggestedProducts =
    items.length > 0
      ? getSuggestedProducts(cartProductIds, 3)
      : [];
  const emptyCartSuggestions = items.length === 0 ? getEmptyCartSuggestions(4) : [];

  const handleAddSuggestion = (product: Product) => {
    addItem(product);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[101] flex flex-col shadow-[-8px_0_30px_rgba(0,0,0,0.12)]"
            role="dialog"
            aria-modal="true"
            aria-label="Winkelmand"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-sand/70">
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Winkelmand
                {itemCount > 0 && (
                  <span className="text-grey font-normal text-base ml-1">({itemCount})</span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 hover:bg-sand/40 rounded-full transition-colors duration-200"
                aria-label="Sluit winkelmand"
              >
                <CloseIcon className="w-5 h-5 text-grey" />
              </button>
            </div>

            {/* Free Shipping Progress Bar - always visible when cart has items */}
            {items.length > 0 && (
              <div className="px-6 py-3.5 bg-warm-white/60 border-b border-sand/40">
                {hasFreeShipping ? (
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-emerald-700">
                      Je komt in aanmerking voor gratis verzending!
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <TruckIcon className="w-4 h-4 text-gold flex-shrink-0" />
                      <p className="text-sm text-charcoal">
                        Nog{" "}
                        <span className="font-semibold text-charcoal">
                          {formatPrice(amountUntilFreeShipping)}
                        </span>{" "}
                        voor{" "}
                        <span className="font-semibold">gratis verzending</span>
                      </p>
                    </div>
                    <div className="h-1.5 bg-sand/70 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full gold-shimmer rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${freeShippingProgress}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content */}
            {items.length === 0 ? (
              /* Empty State - warm and inviting */
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col items-center justify-center px-8 pt-16 pb-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-warm-white flex items-center justify-center mb-6">
                    <ShoppingBagIcon className="w-10 h-10 text-sand" />
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-charcoal">
                    Je winkelmand is leeg
                  </h3>
                  <p className="text-sm text-grey mb-8 leading-relaxed max-w-xs">
                    Ontdek onze zorgvuldig geselecteerde Italiaanse wijnen en vind jouw perfecte fles.
                  </p>
                  <Button onClick={closeCart} variant="primary" size="md">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Ontdek onze wijnen
                  </Button>
                </div>

                {/* Suggestions in empty cart */}
                {emptyCartSuggestions.length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-sand/60" />
                      <h4 className="text-xs font-semibold text-grey uppercase tracking-wide flex-shrink-0">
                        Populaire keuzes
                      </h4>
                      <div className="h-px flex-1 bg-sand/60" />
                    </div>
                    <div className="space-y-2">
                      {emptyCartSuggestions.map((product) => (
                        <SuggestionCard
                          key={product.id}
                          product={product}
                          onAdd={handleAddSuggestion}
                        />
                      ))}
                    </div>
                  </div>
                )}
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

                  {/* Cross-sell / Upsell Suggestions */}
                  {suggestedProducts.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-sand/60">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-sand/40" />
                        <h4 className="text-xs font-semibold text-grey uppercase tracking-wide flex-shrink-0">
                          Past hier goed bij
                        </h4>
                        <div className="h-px flex-1 bg-sand/40" />
                      </div>
                      <div className="space-y-2">
                        {suggestedProducts.map((product) => (
                          <SuggestionCard
                            key={product.id}
                            product={product}
                            onAdd={handleAddSuggestion}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-sand/70 px-6 py-5 space-y-4 bg-gradient-to-b from-warm-white/30 to-warm-white/60">
                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-grey">Subtotaal</span>
                      <span className="tabular-nums">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grey">Verzending</span>
                      <span className={cn(
                        "tabular-nums",
                        hasFreeShipping && "text-emerald-600 font-medium"
                      )}>
                        {hasFreeShipping ? "Gratis" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-sand/60 text-base font-semibold text-charcoal">
                      <span>Totaal</span>
                      <span className="tabular-nums">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout" onClick={closeCart}>
                    <Button
                      variant="primary"
                      fullWidth
                      size="lg"
                    >
                      Veilig afrekenen
                    </Button>
                  </Link>

                  {/* Continue Shopping */}
                  <button
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-wine rounded-md hover:bg-wine/5 transition-colors duration-200"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Verder winkelen
                  </button>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-grey/70">
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 text-gold" />
                      Proefgarantie
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 text-gold" />
                      Veilig betalen
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 text-gold" />
                      1-2 werkdagen
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
