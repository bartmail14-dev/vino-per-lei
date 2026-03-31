"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "vpl_cookie_consent";
const CONSENT_COOKIE = "vpl_cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export type CookieCategories = {
  necessary: true; // always on
  analytics: boolean;
  marketing: boolean;
};

function encodeCookieValue(categories: CookieCategories): string {
  const parts = ["necessary"];
  if (categories.analytics) parts.push("analytics");
  if (categories.marketing) parts.push("marketing");
  return parts.join(",");
}

function decodeCookieValue(value: string): CookieCategories {
  const parts = value.split(",");
  return {
    necessary: true,
    analytics: parts.includes("analytics"),
    marketing: parts.includes("marketing"),
  };
}

/** Read consent value; returns null if not set. */
export function getConsentCategories(): CookieCategories | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`)
  );
  if (!match) return null;
  // Support legacy "all" / "necessary" values
  if (match[1] === "all") return { necessary: true, analytics: true, marketing: true };
  if (match[1] === "necessary") return { necessary: true, analytics: false, marketing: false };
  return decodeCookieValue(match[1]);
}

function setConsentCookie(value: string) {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
}

function updateAnalyticsConsent(categories: CookieCategories) {
  // PostHog consent is handled via the vpl:consent-changed event
  // which PostHogProvider listens to
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't flash on page load
    const timer = setTimeout(() => {
      const consentLS = localStorage.getItem(CONSENT_KEY);
      const consentCookie = getConsentCategories();
      if (!consentLS && !consentCookie) {
        setVisible(true);
      } else if (consentLS && !consentCookie) {
        // Sync: localStorage exists but cookie was cleared — re-set cookie
        setConsentCookie(consentLS);
      }
    }, 1500);

    // Listen for reopen event (from "Cookie-instellingen" link)
    const handleReopen = () => setVisible(true);
    window.addEventListener("vpl:reopen-consent", handleReopen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("vpl:reopen-consent", handleReopen);
    };
  }, []);

  const saveConsent = (categories: CookieCategories) => {
    const value = encodeCookieValue(categories);
    localStorage.setItem(CONSENT_KEY, value);
    setConsentCookie(value);
    updateAnalyticsConsent(categories);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("vpl:consent-changed", { detail: value }));
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleNecessaryOnly = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSaveChoices = () => {
    saveConsent({ necessary: true, analytics, marketing });
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
          role="region"
          aria-label="Cookie-instellingen"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl border border-sand/80 p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              {/* Text */}
              <div>
                <p className="text-sm text-charcoal font-semibold mb-1">
                  Wij gebruiken cookies
                </p>
                <p className="text-sm text-grey leading-relaxed">
                  Wij gebruiken cookies om je ervaring te verbeteren en onze
                  website goed te laten functioneren.{" "}
                  <Link
                    href="/cookies"
                    className="text-wine underline underline-offset-2 hover:text-wine-dark transition-colors duration-150"
                  >
                    Meer informatie
                  </Link>
                </p>
              </div>

              {/* Granular choices — expandable */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 py-3 border-t border-sand/60">
                      {/* Necessary — always on */}
                      <label className="flex items-center gap-3 cursor-default">
                        <input
                          type="checkbox"
                          checked
                          disabled
                          className="w-4 h-4 rounded border-sand accent-wine cursor-not-allowed"
                        />
                        <div>
                          <span className="text-sm font-medium text-charcoal">Noodzakelijk</span>
                          <p className="text-xs text-grey">Essentieel voor het functioneren van de website (altijd aan)</p>
                        </div>
                      </label>

                      {/* Analytics */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={analytics}
                          onChange={(e) => setAnalytics(e.target.checked)}
                          className="w-4 h-4 rounded border-sand accent-wine cursor-pointer"
                        />
                        <div>
                          <span className="text-sm font-medium text-charcoal">Analytisch</span>
                          <p className="text-xs text-grey">Anonieme statistieken — helpt ons de website te verbeteren</p>
                        </div>
                      </label>

                      {/* Marketing */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={marketing}
                          onChange={(e) => setMarketing(e.target.checked)}
                          className="w-4 h-4 rounded border-sand accent-wine cursor-pointer"
                        />
                        <div>
                          <span className="text-sm font-medium text-charcoal">Marketing</span>
                          <p className="text-xs text-grey">Nieuwsbrief tracking — meet het effect van onze e-mails</p>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-wine underline underline-offset-2 hover:text-wine-dark transition-colors self-start"
                  type="button"
                >
                  {showDetails ? "Verberg instellingen" : "Cookie-instellingen"}
                </button>

                <div className="flex flex-col sm:flex-row gap-2">
                  {showDetails ? (
                    <button
                      onClick={handleSaveChoices}
                      className="h-11 min-h-[44px] px-5 text-sm font-semibold text-grey border border-sand rounded-lg hover:border-wine/30 hover:text-charcoal active:scale-[0.98] transition-all duration-200"
                    >
                      Keuze opslaan
                    </button>
                  ) : (
                    <button
                      onClick={handleNecessaryOnly}
                      className="h-11 min-h-[44px] px-5 text-sm font-semibold text-grey border border-sand rounded-lg hover:border-wine/30 hover:text-charcoal active:scale-[0.98] transition-all duration-200"
                    >
                      Alleen noodzakelijk
                    </button>
                  )}
                  <button
                    onClick={handleAcceptAll}
                    className="h-11 min-h-[44px] px-5 text-sm font-semibold text-white bg-wine rounded-lg hover:bg-wine-dark active:scale-[0.98] transition-all duration-200"
                  >
                    Alles accepteren
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Re-opens the cookie consent banner. Call this from a "Cookie-instellingen" link.
 */
export function reopenCookieConsent() {
  localStorage.removeItem(CONSENT_KEY);
  document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0`;
  window.dispatchEvent(new CustomEvent("vpl:reopen-consent"));
}
