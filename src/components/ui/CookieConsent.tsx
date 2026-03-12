"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "vpl_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't flash on page load
    const timer = setTimeout(() => {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        setVisible(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "all");
    setVisible(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem(CONSENT_KEY, "necessary");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[9990] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-sand p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Text */}
              <div className="flex-1">
                <p className="text-sm text-charcoal font-semibold mb-1">
                  Wij gebruiken cookies
                </p>
                <p className="text-sm text-grey leading-relaxed">
                  Wij gebruiken cookies om je ervaring te verbeteren en onze
                  website goed te laten functioneren.{" "}
                  <Link
                    href="/cookies"
                    className="text-wine underline hover:text-wine-dark"
                  >
                    Meer informatie
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
                <button
                  onClick={handleNecessaryOnly}
                  className="h-10 px-5 text-sm font-semibold text-grey border border-sand rounded-lg hover:border-wine/30 hover:text-charcoal transition-colors"
                >
                  Alleen noodzakelijk
                </button>
                <button
                  onClick={handleAccept}
                  className="h-10 px-5 text-sm font-semibold text-white bg-wine rounded-lg hover:bg-wine-dark transition-colors"
                >
                  Accepteren
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
