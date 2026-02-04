"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

const COOKIE_NAME = "vpl_age_verified";
const COOKIE_EXPIRY = 30; // days

export interface AgeGateProps {
  onVerified?: () => void;
}

export function AgeGate({ onVerified }: AgeGateProps) {
  // State: null = not checked yet, true = show gate, false = verified
  const [gateState, setGateState] = useState<boolean | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Check cookie on mount to avoid hydration issues
  // This is a valid pattern for client-only state initialization
  useEffect(() => {
    const verified = Cookies.get(COOKIE_NAME);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGateState(!verified);
  }, []);

  const isVisible = gateState === true;

  // Handle body overflow when visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Don't render until we've checked the cookie (gateState is null initially)
  if (gateState === null) return null;

  const handleConfirm = () => {
    setIsExiting(true);
    Cookies.set(COOKIE_NAME, "true", { expires: COOKIE_EXPIRY });

    // Wait for exit animation
    setTimeout(() => {
      setGateState(false);
      document.body.style.overflow = "";
      onVerified?.();
    }, 400);
  };

  const handleDeny = () => {
    // Redirect to denial page or external site
    window.location.href = "https://www.nix18.nl";
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-dark-bg flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Content */}
          <motion.div
            className="relative flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Logo */}
            <div className="mb-12">
              <h1 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
                Vino per Lei
              </h1>
            </div>

            {/* Question */}
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-10">
              Ben je 18 jaar of ouder?
            </h2>

            {/* Primary Button */}
            <button
              onClick={handleConfirm}
              className={cn(
                "w-full max-w-[280px] h-14 rounded",
                "border-2 border-coral text-coral",
                "font-semibold text-sm uppercase tracking-wide",
                "transition-all duration-200",
                "hover:bg-coral hover:text-dark-bg",
                "focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:ring-offset-dark-bg"
              )}
            >
              Ja, ik ben 18+
            </button>

            {/* Secondary Link */}
            <button
              onClick={handleDeny}
              className={cn(
                "mt-4 text-sm text-light-grey",
                "transition-colors duration-200",
                "hover:text-white",
                "focus:outline-none focus:underline"
              )}
            >
              Nee, ik ben jonger
            </button>
          </motion.div>

          {/* Legal Text */}
          <motion.p
            className="absolute bottom-8 left-0 right-0 px-6 text-center text-xs text-grey max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Door verder te gaan bevestig je dat je 18 jaar of ouder bent en
            accepteer je onze{" "}
            <a
              href="/voorwaarden"
              className="underline hover:text-light-grey"
              onClick={(e) => e.stopPropagation()}
            >
              gebruiksvoorwaarden
            </a>
            .
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
