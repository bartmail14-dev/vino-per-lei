"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, BarChart3, Megaphone, SlidersHorizontal } from "lucide-react";
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
      className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 ${
        disabled
          ? "bg-wine/40 cursor-not-allowed"
          : checked
            ? "bg-wine cursor-pointer"
            : "bg-sand cursor-pointer hover:bg-sand/80"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 translate-y-0.5 ${
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
            "cookie-consent fixed left-3 right-3 z-[9990] sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[390px]",
            needsPurchaseBarOffset ? "bottom-[9.25rem]" : "bottom-3"
          )}
          role="region"
          aria-label="Cookie-instellingen"
        >
          <div className="overflow-hidden rounded-[1.35rem] border border-sand/80 bg-white/[0.98] p-3.5 shadow-[0_22px_70px_-42px_rgba(26,31,61,0.85)] ring-1 ring-white/80 backdrop-blur sm:p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-wine/10">
                <Cookie className="h-4.5 w-4.5 text-wine" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold leading-tight text-charcoal sm:text-sm">{t("cookie.title")}</p>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full bg-cream/80 px-3 text-xs font-semibold text-grey hover:bg-sand/50 hover:text-charcoal focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 transition-colors"
                    type="button"
                    aria-expanded={showDetails}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.7} />
                    <span className="max-w-[5.5rem] truncate">{t("cookie.settings_button")}</span>
                  </button>
                </div>
                <p className="mt-1 text-sm leading-snug text-grey line-clamp-2 sm:text-xs sm:line-clamp-none">
                  {t("cookie.description")}
                </p>
                {showDetails && (
                  <Link
                    href="/cookies"
                    className="mt-2 inline-flex min-h-[40px] items-center rounded-full bg-cream/70 px-3 text-sm font-medium text-wine underline-offset-4 hover:bg-sand/50 hover:text-wine-dark focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 sm:text-xs transition-colors"
                  >
                    Meer info
                  </Link>
                )}
              </div>
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
                  <div className="space-y-2 pt-3">
                    {/* Necessary */}
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-cream/55 px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Shield className="h-5 w-5 shrink-0 text-wine/60" strokeWidth={1.5} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-charcoal">{t("cookie.necessary_title")}</p>
                          <p className="text-xs leading-snug text-grey">{t("cookie.necessary_desc")}</p>
                        </div>
                      </div>
                      <Toggle checked disabled />
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-cream/55 px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <BarChart3 className="h-5 w-5 shrink-0 text-wine/60" strokeWidth={1.5} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-charcoal">{t("cookie.analytics_title")}</p>
                          <p className="text-xs leading-snug text-grey">{t("cookie.analytics_desc")}</p>
                        </div>
                      </div>
                      <Toggle checked={analytics} onChange={setAnalytics} />
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-cream/55 px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Megaphone className="h-5 w-5 shrink-0 text-wine/60" strokeWidth={1.5} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-charcoal">{t("cookie.marketing_title")}</p>
                          <p className="text-xs leading-snug text-grey">{t("cookie.marketing_desc")}</p>
                        </div>
                      </div>
                      <Toggle checked={marketing} onChange={setMarketing} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {showDetails ? (
                <button
                  onClick={handleSaveChoices}
                  className="min-h-[48px] rounded-2xl border border-sand bg-cream px-3 text-sm font-semibold leading-tight text-charcoal hover:bg-sand/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 active:scale-[0.98] transition-all duration-150"
                >
                  {t("cookie.save")}
                </button>
              ) : (
                <button
                  onClick={handleNecessaryOnly}
                  className="min-h-[48px] rounded-2xl border border-sand bg-cream px-3 text-sm font-semibold leading-tight text-charcoal hover:bg-sand/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 active:scale-[0.98] transition-all duration-150"
                >
                  {t("cookie.necessary_only")}
                </button>
              )}
              <button
                onClick={handleAcceptAll}
                className="min-h-[48px] rounded-2xl bg-wine px-3 text-sm font-semibold leading-tight text-white hover:bg-wine-dark focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 active:scale-[0.98] transition-all duration-150"
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
