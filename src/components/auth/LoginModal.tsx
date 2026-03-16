"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { X as CloseIcon, Heart } from "lucide-react";

function HeartIconFilled({ className }: { className?: string }) {
  return <Heart className={className} fill="currentColor" strokeWidth={0} aria-hidden="true" />;
}

export function LoginModal() {
  const { showLoginModal, closeLoginModal } = useAuthStore();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap: focus close button on open, handle Escape
  useEffect(() => {
    if (!showLoginModal) return;

    // Focus close button on open
    const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);

    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLoginModal();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLoginModal, closeLoginModal]);

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLoginModal}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Account"
            >
              {/* Header */}
              <div className="relative bg-wine/5 p-6 text-center">
                <button
                  ref={closeButtonRef}
                  onClick={closeLoginModal}
                  className="absolute top-4 right-4 p-2 hover:bg-wine/10 rounded-full transition-colors duration-150"
                  aria-label="Sluiten"
                >
                  <CloseIcon className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
                </button>

                <div className="w-12 h-12 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HeartIconFilled className="w-6 h-6 text-wine" />
                </div>

                <h2 className="font-serif text-xl font-semibold text-charcoal">
                  Account
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <p className="text-grey text-sm sm:text-base mb-4 leading-relaxed">
                  Account aanmaken en inloggen komt binnenkort beschikbaar.
                </p>
                <p className="text-grey text-sm leading-relaxed">
                  Je kunt je verlanglijstje al gebruiken zonder account — deze wordt lokaal opgeslagen in je browser.
                </p>
                <button
                  onClick={closeLoginModal}
                  className="mt-6 w-full py-3 bg-wine text-white rounded-lg text-button uppercase hover:bg-wine-dark active:scale-[0.98] transition-all duration-200"
                >
                  Sluiten
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
