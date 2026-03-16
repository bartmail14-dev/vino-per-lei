"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckmarkAnimation } from "../BlogAnimations";

export function NewsletterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: integrate with actual newsletter service (Mailchimp, Klaviyo, etc.)
    setSubmitted(true);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 mb-4 print:hidden"
    >
      {/* Subtle background panel — light, natural in reading flow */}
      <div className="bg-warm-white/60 rounded-2xl px-6 sm:px-10 py-10 sm:py-12">
        <div className="max-w-md mx-auto text-center">
          {/* Simple serif heading */}
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-2.5 leading-tight">
            Wijn Verhalen in je Inbox
          </h3>
          <p className="text-grey text-sm leading-relaxed mb-7 max-w-xs mx-auto">
            Onze mooiste verhalen over Italiaanse wijnen en wijnmakers. Maximaal 2x per maand.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 py-3"
              >
                <CheckmarkAnimation show={true} />
                <span className="text-grey text-sm">
                  Welkom! Je ontvangt binnenkort je eerste verhaal.
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                aria-label="Nieuwsbrief aanmelding"
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <div className="flex-1">
                  <label htmlFor="newsletter-email-article" className="sr-only">E-mailadres</label>
                  <input
                    id="newsletter-email-article"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@email.nl"
                    required
                    autoComplete="email"
                    className="w-full bg-white border border-sand/80 rounded-full px-5 py-3 text-[16px] sm:text-sm text-charcoal placeholder:text-grey/35 focus:outline-none focus:border-wine/30 focus:ring-2 focus:ring-wine/8 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-wine hover:bg-wine-dark text-white font-medium text-sm px-6 py-3 rounded-full transition-colors duration-200 whitespace-nowrap cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  Aanmelden
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-grey/35 text-[11px] mt-4">
            Geen spam. Altijd afmelden mogelijk.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
