"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog, trackPageView, updatePostHogConsent } from "@/lib/analytics";
import { getConsentCategories } from "@/components/ui/CookieConsent";

export function PostHogProvider() {
  const pathname = usePathname();

  // Initialize PostHog on mount
  useEffect(() => {
    const consent = getConsentCategories();
    if (consent?.analytics) {
      initPostHog();
    }

    // Listen for consent changes
    const handleConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      const analyticsAllowed = detail === "all" || detail.includes("analytics");
      updatePostHogConsent(analyticsAllowed);
    };
    window.addEventListener("vpl:consent-changed", handleConsent);
    return () => window.removeEventListener("vpl:consent-changed", handleConsent);
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(window.location.href);
  }, [pathname]);

  return null;
}
