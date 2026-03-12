"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function LoginModal() {
  const { showLoginModal, closeLoginModal } = useAuthStore();

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
            onClick={closeLoginModal}
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
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-wine/5 p-6 text-center">
                <button
                  onClick={closeLoginModal}
                  className="absolute top-4 right-4 p-2 hover:bg-wine/10 rounded-full transition-colors"
                  aria-label="Sluiten"
                >
                  <CloseIcon className="w-5 h-5 text-charcoal" />
                </button>

                <div className="w-12 h-12 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HeartIcon className="w-6 h-6 text-wine" />
                </div>

                <h2 className="font-serif text-xl font-semibold text-charcoal">
                  Account
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <p className="text-grey text-sm sm:text-base mb-4">
                  Account aanmaken en inloggen komt binnenkort beschikbaar.
                </p>
                <p className="text-grey text-sm">
                  Je kunt je verlanglijstje al gebruiken zonder account — deze wordt lokaal opgeslagen in je browser.
                </p>
                <button
                  onClick={closeLoginModal}
                  className="mt-6 w-full py-3 bg-wine text-white rounded-lg font-medium hover:bg-wine-dark transition-colors"
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
