"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export function NotifyMeModal({ isOpen, onClose, productTitle }: NotifyMeModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setStatus("idle");
      setErrorMessage("");
      // Focus email input after animation
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Vul een geldig e-mailadres in");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/notify-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productTitle }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setErrorMessage("Er ging iets mis. Probeer het opnieuw.");
      setStatus("error");
    }
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
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[9997]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9998] w-[90vw] max-w-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Melding bij voorraad"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-sand/40">
              {/* Header */}
              <div className="bg-[linear-gradient(135deg,#1a1f3d_0%,#2d1b3d_50%,#1a1f3d_100%)] px-6 py-5 text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  aria-label="Sluiten"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="text-gold/70 text-xs uppercase tracking-[0.2em] font-medium mb-1">
                  Tijdelijk uitverkocht
                </p>
                <h2 className="font-serif text-lg sm:text-xl font-semibold text-white leading-snug">
                  Mail bij voorraad
                </h2>
              </div>

              {/* Body */}
              <div className="bg-[#faf9f7] px-6 py-5">
                {status === "success" ? (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-serif font-semibold text-charcoal mb-1">Je staat op de lijst!</p>
                    <p className="text-sm text-grey leading-relaxed">
                      We mailen je zodra de <span className="font-medium text-charcoal">{productTitle}</span> weer op voorraad is.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-5 h-10 min-h-[44px] px-8 text-sm font-semibold text-wine border border-wine/20 rounded-lg hover:bg-wine hover:text-white transition-all duration-200"
                    >
                      Sluiten
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-grey leading-relaxed mb-4">
                      Laat je e-mailadres achter en we sturen je een bericht zodra de{" "}
                      <span className="font-medium text-charcoal">{productTitle}</span>{" "}
                      weer beschikbaar is.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <input
                          ref={inputRef}
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === "error") setStatus("idle");
                          }}
                          placeholder="je@email.nl"
                          className="w-full h-11 min-h-[44px] px-4 text-sm bg-white border border-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all placeholder:text-grey/40"
                          aria-label="E-mailadres"
                          required
                        />
                        {status === "error" && errorMessage && (
                          <p className="mt-1.5 text-xs text-red-500">{errorMessage}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full h-11 min-h-[44px] bg-gold hover:bg-gold/90 text-wine-dark font-bold uppercase tracking-wider text-xs rounded-lg transition-all duration-200 shadow-md shadow-gold/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                      >
                        {status === "loading" ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Even geduld...
                          </span>
                        ) : (
                          "Houd me op de hoogte"
                        )}
                      </button>
                    </form>

                    <p className="text-[11px] text-grey/50 text-center mt-3">
                      We sturen maximaal 1 e-mail. Geen spam, beloofd.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
