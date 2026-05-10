"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, BarChart3, Megaphone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiCopy } from "@/components/providers";
import { useCartStore } from "@/stores/cartStore";

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
  void categories;
  // PostHog consent is handled via the vpl:consent-changed event
  // which PostHogProvider listens to
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        disabled
          ? "bg-wine/40 cursor-not-allowed"
          : checked
            ? "bg-wine cursor-pointer"
            : "bg-sand cursor-pointer hover:bg-sand/80"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 translate-y-0.5 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useUiCopy();
  const pathname = usePathname();
  const isCartOpen = useCartStore((state) => state.isOpen);
  const needsPurchaseBarOffset = pathname?.startsWith("/wijnen/") ?? false;

  useEffect(() => {
    const timer = setTimeout(() => {
      const consentLS = localStorage.getItem(CONSENT_KEY);
      const consentCookie = getConsentCategories();
      if (!consentLS && !consentCookie) {
        setVisible(true);
      } else if (consentLS && !consentCookie) {
        setConsentCookie(consentLS);
      }
    }, 1500);

    const handleReopen = () => setVisible(true);
    window.addEventListener("vpl:reopen-consent", handleReopen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("vpl:reopen-consent", handleReopen);
    };
  }, []);

  useEffect(() => {
    const handleMobileMenu = (event: Event) => {
      setIsMobileMenuOpen(Boolean((event as CustomEvent<boolean>).detail));
    };

    window.addEventListener("vpl:mobile-menu", handleMobileMenu);
    return () => window.removeEventListener("vpl:mobile-menu", handleMobileMenu);
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
      {visible && !isCartOpen && !isMobileMenuOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed left-3 right-3 z-[9990] sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[360px]",
            needsPurchaseBarOffset ? "bottom-28" : "bottom-4"
          )}
          role="region"
          aria-label="Cookie-instellingen"
        >
          <div className="bg-white/96 rounded-2xl shadow-[0_18px_54px_-34px_rgba(26,31,61,0.72)] border border-sand/70 overflow-hidden backdrop-blur">
            {/* Header bar */}
            <div className="bg-wine/[0.03] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-wine/10 rounded-xl flex items-center justify-center shrink-0">
                <Cookie className="w-4.5 h-4.5 text-wine" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal">{t("cookie.title")}</p>
                <p className="text-xs text-grey leading-snug">
                  {t("cookie.description")}{" "}
                  <Link
                    href="/cookies"
                    className="text-wine hover:text-wine-dark transition-colors"
                  >
                    Meer info
                  </Link>
                </p>
              </div>
            </div>

            {/* Details toggle */}
            <div className="px-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between py-3 text-xs font-medium text-grey hover:text-charcoal transition-colors"
                type="button"
              >
                <span>{t("cookie.settings_button")}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Granular choices */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-1 space-y-3">
                    {/* Necessary */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Shield className="w-4 h-4 text-wine/60 shrink-0" strokeWidth={1.5} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-charcoal">{t("cookie.necessary_title")}</p>
                          <p className="text-[10px] text-grey leading-tight">{t("cookie.necessary_desc")}</p>
                        </div>
                      </div>
                      <Toggle checked disabled />
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <BarChart3 className="w-4 h-4 text-wine/60 shrink-0" strokeWidth={1.5} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-charcoal">{t("cookie.analytics_title")}</p>
                          <p className="text-[10px] text-grey leading-tight">{t("cookie.analytics_desc")}</p>
                        </div>
                      </div>
                      <Toggle checked={analytics} onChange={setAnalytics} />
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Megaphone className="w-4 h-4 text-wine/60 shrink-0" strokeWidth={1.5} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-charcoal">{t("cookie.marketing_title")}</p>
                          <p className="text-[10px] text-grey leading-tight">{t("cookie.marketing_desc")}</p>
                        </div>
                      </div>
                      <Toggle checked={marketing} onChange={setMarketing} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="p-3 pt-2 flex gap-2">
              {showDetails ? (
                <button
                  onClick={handleSaveChoices}
                  className="flex-1 h-9 text-xs font-semibold text-charcoal bg-cream border border-sand rounded-xl hover:bg-sand/50 active:scale-[0.98] transition-all duration-150"
                >
                  {t("cookie.save")}
                </button>
              ) : (
                <button
                  onClick={handleNecessaryOnly}
                  className="flex-1 h-9 text-xs font-semibold text-charcoal bg-cream border border-sand rounded-xl hover:bg-sand/50 active:scale-[0.98] transition-all duration-150"
                >
                  {t("cookie.necessary_only")}
                </button>
              )}
              <button
                onClick={handleAcceptAll}
                className="flex-1 h-9 text-xs font-semibold text-white bg-wine rounded-xl hover:bg-wine-dark active:scale-[0.98] transition-all duration-150"
              >
                {t("cookie.accept_all")}
              </button>
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
