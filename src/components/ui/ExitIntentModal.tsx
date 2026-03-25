"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

const SESSION_KEY = "vpl_exit_intent_shown";

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.itemCount);
  const subtotal = useCartStore((state) => state.subtotal);
  const openCart = useCartStore((state) => state.openCart);
  const isHydrated = useCartStore((state) => state.isHydrated);

  const handleOpen = useCallback(() => {
    if (
      items.length === 0 ||
      !isHydrated ||
      sessionStorage.getItem(SESSION_KEY)
    ) {
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setIsOpen(true);
  }, [items.length, isHydrated]);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY < 0) {
        handleOpen();
      }
    };

    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [handleOpen]);

  const handleGoToCart = () => {
    setIsOpen(false);
    openCart();
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const handleDontShowAgain = () => {
    setIsOpen(false);
    // Persist across sessions too
    try {
      localStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Ignore
    }
  };

  // Also check localStorage on mount to honor "don't show again"
  useEffect(() => {
    try {
      if (localStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[9995]"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9996] w-[90vw] max-w-md"
            role="dialog"
            aria-modal="true"
            aria-label="Je hebt nog wijnen in je mandje"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-sand/40">
              {/* Header — wine gradient */}
              <div className="bg-[linear-gradient(135deg,#1a1f3d_0%,#2d1b3d_50%,#1a1f3d_100%)] px-6 py-5 text-center">
                <p className="text-gold/70 text-xs uppercase tracking-[0.2em] font-medium mb-1">
                  Wacht even
                </p>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white leading-snug">
                  Je hebt nog wijnen<br />in je mandje
                </h2>
              </div>

              {/* Body — cream */}
              <div className="bg-[#faf9f7] px-6 py-5">
                {/* Cart summary */}
                <div className="bg-white rounded-xl border border-sand/50 p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-grey">
                      {itemCount} {itemCount === 1 ? "fles" : "flessen"}
                    </span>
                    <span className="font-serif font-semibold text-charcoal">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {/* Show first 3 items */}
                  <div className="space-y-1.5">
                    {items.slice(0, 3).map((item) => (
                      <p
                        key={item.id}
                        className="text-xs text-grey truncate"
                      >
                        {item.quantity}x {item.product.title}
                      </p>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-gold font-medium">
                        + {items.length - 3} meer
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleGoToCart}
                  className="w-full h-12 min-h-[44px] bg-gold hover:bg-gold/90 text-wine-dark font-bold uppercase tracking-wider text-sm rounded-lg transition-all duration-200 shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30 active:scale-[0.98]"
                >
                  Bekijk winkelmand
                </button>

                {/* Dismiss */}
                <button
                  onClick={handleDismiss}
                  className="w-full mt-3 h-10 min-h-[44px] text-sm text-grey hover:text-charcoal transition-colors"
                >
                  Ik ga verder met rondkijken
                </button>
              </div>

              {/* Footer — don't show again */}
              <div className="px-6 pb-4 bg-[#faf9f7]">
                <button
                  onClick={handleDontShowAgain}
                  className="w-full text-xs text-grey/50 hover:text-grey transition-colors underline underline-offset-2"
                >
                  Niet meer tonen
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
