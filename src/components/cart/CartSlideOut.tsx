"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { getShopifyCartUrl } from "@/lib/shopify";
import { Button, QuantitySelector } from "@/components/ui";
import { formatPrice, wineImagePresets } from "@/lib/utils";
import { getOrderIncrement, getOrderMaximum, getOrderMinimum, getOrderUnitText, getPriceUnitText } from "@/lib/order-rules";
import { CloseIcon, TrashIcon, ShoppingBagIcon, CheckIcon } from "@/components/icons";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useShopConfig, useUiCopy } from "@/components/providers";

function useIsMobileCart() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function CartSlideOut() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.itemCount);
  const subtotal = useCartStore((state) => state.subtotal);
  const shipping = useCartStore((state) => state.shipping);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const isMobileCart = useIsMobileCart();
  const t = useUiCopy();
  const { freeShippingThreshold, shippingCost } = useShopConfig();
  const configuredShipping =
    items.length === 0
      ? 0
      : shippingCost > 0
        ? freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
          ? 0
          : shippingCost
        : shipping;
  const configuredTotal = subtotal + configuredShipping;
  const freeShippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, Math.max(0, (subtotal / freeShippingThreshold) * 100))
      : 0;

  const focusTrapRef = useFocusTrap<HTMLDivElement>({ active: isOpen, onEscape: closeCart });

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
            ref={focusTrapRef}
            initial={isMobileCart ? { y: "100%" } : { x: "100%" }}
            animate={isMobileCart ? { y: 0 } : { x: 0 }}
            exit={isMobileCart ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-auto max-h-[92dvh] w-full rounded-t-3xl bg-white z-[101] flex flex-col shadow-2xl sm:top-0 sm:right-0 sm:left-auto sm:bottom-0 sm:max-h-none sm:max-w-md sm:rounded-none"
            role="dialog"
            aria-modal="true"
            aria-label={t("cart.title")}
          >
            <div className="flex justify-center pt-3 sm:hidden" aria-hidden="true">
              <div className="h-1 w-11 rounded-full bg-sand" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-sand sm:px-6 sm:py-4">
              <h2 className="font-serif text-xl font-semibold">
                {t("cart.title")}
                {itemCount > 0 && (
                  <span className="text-grey font-normal"> ({itemCount})</span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-sand/50 rounded-md transition-colors"
                aria-label={t("common.close")}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center px-4 text-center sm:px-6">
                <ShoppingBagIcon className="w-16 h-16 text-sand mb-4" />
                <h3 className="font-serif text-lg mb-2">
                  {t("cart.empty.title")}
                </h3>
                <p className="text-sm text-grey mb-6">
                  Bekijk onze Italiaanse wijnen en kies je favoriet.
                </p>
                <Button onClick={closeCart} variant="primary">
                  Bekijk onze wijnen
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-3 pb-4 border-b border-sand last:border-0 sm:gap-4"
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-20 bg-warm-white rounded-lg overflow-hidden flex-shrink-0 sm:w-20 sm:h-24">
                          {item.product.images[0] ? (
                            <Image
                              src={wineImagePresets.cart(item.product.images[0].url)}
                              alt={item.product.title}
                              fill
                              sizes="(max-width: 640px) 64px, 80px"
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
                            className="font-serif text-sm font-medium text-charcoal hover:text-wine line-clamp-2 sm:line-clamp-1"
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
                            {getPriceUnitText(item.product) && (
                              <span className="font-normal text-grey"> {getPriceUnitText(item.product)}</span>
                            )}
                            {item.quantity > 1 && (
                              <span className="font-normal text-grey">
                                {" "}
                                x {item.quantity} ={" "}
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            )}
                          </p>
                          {getOrderUnitText(item.product) && (
                            <p className="text-xs text-grey mt-1">
                              Per {getOrderUnitText(item.product)}
                            </p>
                          )}

                          {/* Quantity & Remove */}
                          <div className="flex items-center justify-between mt-3">
                            <QuantitySelector
                              value={item.quantity}
                              onChange={(q) => updateQuantity(item.id, q)}
                              min={getOrderMinimum(item.product)}
                              max={getOrderMaximum(item.product)}
                              step={getOrderIncrement(item.product)}
                              size="sm"
                            />
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-grey hover:text-error transition-colors"
                              aria-label={`${t("cart.remove")} ${item.product.title}`}
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
                <div className="border-t border-sand bg-warm-white/50 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-4 sm:px-6 sm:pb-4">
                  {freeShippingThreshold > 0 && (
                    <div className="rounded-2xl border border-gold/15 bg-white px-3 py-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-grey">
                        <span className="font-medium text-charcoal">{t("cart.shipping")}</span>
                        <span>{formatPrice(Math.min(subtotal, freeShippingThreshold))} / {formatPrice(freeShippingThreshold)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-sand/60">
                        <div
                          className="h-full rounded-full bg-gold transition-[width] duration-500"
                          style={{ width: `${freeShippingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-grey">{t("cart.subtotal")}</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grey">{t("cart.shipping")}</span>
                      <span>{formatPrice(configuredShipping)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-sand text-base font-semibold">
                      <span>{t("cart.total")}</span>
                      <span>{formatPrice(configuredTotal)}</span>
                    </div>
                  </div>

                  {/* Checkout Button — redirects to Shopify cart permalink */}
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    className="cart-checkout-button"
                    disabled={isCheckingOut}
                    onClick={() => {
                      setIsCheckingOut(true);
                      const lineItems = items.map((item) => ({
                        variantId: item.product.variantId,
                        quantity: item.quantity,
                      }));
                      window.location.href = getShopifyCartUrl(lineItems);
                    }}
                  >
                    {isCheckingOut ? t("common.loading") : t("cart.checkout")}
                  </Button>

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
                      {t("product.secure_payment")}
                    </span>
                  </div>

                  {/* Payment Methods & Security */}
                  <div className="pt-3 border-t border-sand/40">
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {/* iDEAL */}
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-sand/30 rounded text-[10px] font-medium text-charcoal/70">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="#CC0066"/><path d="M9 12h6" stroke="currentColor" strokeWidth="1"/></svg>
                        iDEAL
                      </span>
                      {/* Visa */}
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-sand/30 rounded text-[10px] font-medium text-charcoal/70">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 4 2-6 2 6 2-4" stroke="#1A1F71" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Visa
                      </span>
                      {/* Mastercard */}
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-sand/30 rounded text-[10px] font-medium text-charcoal/70">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="9.5" cy="12" r="4" fill="#EB001B" opacity="0.8"/><circle cx="14.5" cy="12" r="4" fill="#F79E1B" opacity="0.8"/></svg>
                        MC
                      </span>
                      {/* PayPal */}
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-sand/30 rounded text-[10px] font-medium text-charcoal/70">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><path d="M7 20l1-6h3c4 0 6-2.5 6-5.5S15 3 11 3H6l-3 17h4z" stroke="#003087" strokeWidth="1.5"/><path d="M9 14l1-6h2c2.5 0 4 1 4 3s-1.5 3-4 3h-3z" fill="#003087" opacity="0.2"/></svg>
                        PayPal
                      </span>
                    </div>
                    {/* SSL Badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-grey/70">
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      SSL Beveiligd — Veilige verbinding
                    </div>
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
