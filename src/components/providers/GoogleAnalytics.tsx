"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { getConsentCategories } from "@/components/ui/CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function GoogleAnalyticsTracker() {
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    const consent = getConsentCategories();
    if (!consent?.analytics) return;

    window.gtag("config", GA_ID, { page_path: pathname });
  }, [pathname]);

  // Listen for consent changes
  useEffect(() => {
    if (!GA_ID) return;
    const handleConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      const allowed = detail === "all" || detail.includes("analytics");
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: allowed ? "granted" : "denied",
        });
      }
    };
    window.addEventListener("vpl:consent-changed", handleConsent);
    return () => window.removeEventListener("vpl:consent-changed", handleConsent);
  }, []);

  return null;
}

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <Suspense fallback={null}>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: false,
          });
        `}
      </Script>
      <GoogleAnalyticsTracker />
    </Suspense>
  );
}
