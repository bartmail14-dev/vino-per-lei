"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { useUiCopy } from "@/components/providers";

const COOKIE_NAME = "vpl_age_verified";
const COOKIE_EXPIRY = 30; // days

export interface AgeGateProps {
  onVerified?: () => void;
}

export function AgeGate({ onVerified }: AgeGateProps) {
  const t = useUiCopy();
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
    Cookies.set(COOKIE_NAME, "true", { expires: COOKIE_EXPIRY, secure: true, sameSite: "Lax" });

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
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Background video with overlay */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/hero-banner.webp"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
          </div>

          {/* Content Card */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-10 py-14 sm:px-16 sm:py-20 text-center max-w-lg mx-4 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            {/* Decorative top accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />

            {/* Logo */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Logo variant="full" color="#ffffff" className="h-32 sm:h-40 w-auto mx-auto opacity-90" />
            </motion.div>

            {/* Divider */}
            <div className="w-12 h-px bg-gold/40 mb-8" />

            {/* Question */}
            <motion.h2
              className="font-serif text-xl sm:text-2xl text-white mb-3 leading-snug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {t("agegate.title")}
            </motion.h2>
            <motion.p
              className="text-sm text-white/50 mb-10 max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              {t("agegate.subtitle")}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col gap-3 w-full max-w-[260px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                onClick={handleConfirm}
                className={cn(
                  "w-full h-13 rounded-lg",
                  "bg-gold text-wine-dark",
                  "font-semibold text-sm uppercase tracking-widest",
                  "transition-all duration-300",
                  "hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20",
                  "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-transparent"
                )}
              >
                {t("agegate.confirm")}
              </button>

              <button
                onClick={handleDeny}
                className={cn(
                  "w-full h-13 rounded-lg",
                  "border border-white/20 text-white/60",
                  "font-medium text-sm tracking-wide",
                  "transition-all duration-300",
                  "hover:border-white/40 hover:text-white/80",
                  "focus:outline-none focus:ring-2 focus:ring-white/30"
                )}
              >
                {t("agegate.deny")}
              </button>
            </motion.div>
          </motion.div>

          {/* Legal Text */}
          <motion.p
            className="absolute bottom-6 sm:bottom-8 left-0 right-0 px-6 text-center text-xs text-white/30 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {t("agegate.legal")}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
