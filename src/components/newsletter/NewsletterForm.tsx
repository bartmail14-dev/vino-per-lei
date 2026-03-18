"use client";

import { useState, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Variant = "dark" | "light";

interface NewsletterFormProps {
  variant?: Variant;
  /** Layout direction */
  layout?: "inline" | "stacked";
  /** Show social proof text */
  socialProof?: boolean;
  className?: string;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Shared newsletter form with premium micro-interactions.
 * Two visual variants: "dark" (wine/gold on dark bg) and "light" (wine on warm-white bg).
 */
export function NewsletterForm({
  variant = "dark",
  layout = "stacked",
  socialProof = false,
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uniqueId = useId();
  const inputId = `newsletter-${uniqueId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detected — silently return success
    if (honeypot) {
      setStatus("success");
      setEmail("");
      return;
    }

    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const isDark = variant === "dark";

  // Shared styles per variant
  const styles = {
    input: isDark
      ? `bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/20
         focus:border-gold/40 focus:bg-white/[0.09]`
      : `bg-white border-sand/80 text-charcoal placeholder:text-grey/35
         focus:border-wine/30`,
    button: isDark
      ? "bg-gradient-to-r from-gold to-gold-light text-wine-dark"
      : "bg-wine text-white hover:bg-wine-dark",
    error: isDark ? "text-red-400/70" : "text-error/70",
    disclaimer: isDark ? "text-white/20" : "text-grey/35",
    socialProof: isDark ? "text-white/25" : "text-grey/40",
    successHeading: isDark ? "text-gold" : "text-wine",
    successText: isDark ? "text-white/40" : "text-grey",
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className={`text-center ${layout === "inline" ? "lg:text-left" : ""} py-2`}
          >
            {/* Animated checkmark circle */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="drop-shadow-lg">
                  <motion.circle
                    cx="16" cy="16" r="14"
                    stroke={isDark ? "#c9a227" : "#1a1f3d"}
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
                  />
                  <motion.path
                    d="M10 16.5L14 20.5L22 12.5"
                    stroke={isDark ? "#c9a227" : "#1a1f3d"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.5 }}
                  />
                </svg>
              </motion.div>
              <p className={`font-serif text-lg font-semibold ${styles.successHeading}`}>
                Welkom!
              </p>
            </div>
            <p className={`text-sm font-light tracking-wide ${styles.successText}`}>
              Je ontvangt binnenkort je eerste wijnverhaal.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            aria-label="Nieuwsbrief aanmelding"
            initial={false}
            className={
              layout === "inline"
                ? "flex flex-col sm:flex-row gap-3"
                : "flex flex-col sm:flex-row gap-3"
            }
          >
            {/* Honeypot — hidden from real users, filled by bots */}
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="flex-1 relative">
              <label htmlFor={inputId} className="sr-only">E-mailadres</label>

              {/* Focus glow ring (behind input) */}
              <motion.div
                className={`absolute -inset-[3px] rounded-full ${
                  isDark
                    ? "bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20"
                    : "bg-gradient-to-r from-wine/15 via-wine/8 to-wine/15"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: focused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ filter: "blur(6px)" }}
              />

              <input
                ref={inputRef}
                id={inputId}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="je@email.nl"
                required
                autoComplete="email"
                className={`relative w-full px-6 py-3.5 rounded-full border text-[16px] sm:text-sm
                  focus:outline-none focus:ring-2 transition-all duration-300 tracking-wide
                  ${styles.input}
                  ${isDark ? "focus:ring-gold/15" : "focus:ring-wine/8"}
                  ${status === "error" ? (isDark ? "border-red-400/50 ring-1 ring-red-400/20" : "border-error/50 ring-1 ring-error/20") : ""}
                `}
              />
            </div>

            {/* Submit button with shine sweep */}
            <div className="relative overflow-hidden rounded-full group">
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`relative w-full px-8 py-3.5 rounded-full font-semibold text-[13px] uppercase tracking-[0.1em]
                  transition-all duration-300 hover:shadow-lg active:scale-[0.98] whitespace-nowrap min-h-[44px]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                  disabled:opacity-70 disabled:cursor-not-allowed
                  ${styles.button}
                  ${isDark ? "hover:shadow-gold/25" : "hover:shadow-wine/20"}
                `}
              >
                {/* Shine sweep effect on hover */}
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                    animation: "none",
                  }}
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:animate-[shine_0.6s_ease-in-out] pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />

                <span className="relative z-10 inline-flex items-center gap-2">
                  {status === "submitting" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Even geduld...</span>
                    </>
                  ) : (
                    "Aanmelden"
                  )}
                </span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`text-[11px] mt-2.5 pl-6 tracking-wide ${styles.error}`}
          >
            Vul een geldig e-mailadres in.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      {status !== "success" && (
        <p className={`text-[10px] sm:text-[11px] mt-4 tracking-wide ${styles.disclaimer} ${
          layout === "inline" ? "text-center lg:text-left" : "text-center"
        }`}>
          Geen spam. Maximaal 2x per maand. Altijd opzegbaar.
        </p>
      )}

      {/* Social proof */}
      {socialProof && status !== "success" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-[10px] mt-2 tracking-wide flex items-center gap-1.5 ${
            layout === "inline" ? "justify-center lg:justify-start" : "justify-center"
          } ${styles.socialProof}`}
        >
          <span className="inline-flex -space-x-1.5">
            {["MV", "Pd", "SK"].map((initials, i) => (
              <span
                key={initials}
                className={`w-4 h-4 rounded-full text-[7px] font-bold flex items-center justify-center border ${
                  isDark ? "border-wine-dark bg-wine-light/80 text-white/60" : "border-warm-white bg-sand text-charcoal/40"
                }`}
                style={{ zIndex: 3 - i }}
              >
                {initials}
              </span>
            ))}
          </span>
          500+ wijnliefhebbers gingen je voor
        </motion.p>
      )}
    </div>
  );
}
