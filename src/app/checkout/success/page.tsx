"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { Button } from "@/components/ui";
import { TrustSignals } from "@/components/checkout";
import { CheckIcon } from "@/components/icons";
import confetti from "canvas-confetti";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const { contact, address, shipping, resetCheckout } = useCheckoutStore();
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // Trigger confetti on mount
  useEffect(() => {
    if (!hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      // Fire confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: ReturnType<typeof setInterval> = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Using wine color for confetti
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#1a1f3d", "#c9a227", "#ffa38b"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#1a1f3d", "#c9a227", "#ffa38b"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [hasTriggeredConfetti]);

  // Reset checkout on unmount
  useEffect(() => {
    return () => {
      resetCheckout();
    };
  }, [resetCheckout]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success icon */}
        <motion.div
          className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CheckIcon className="w-10 h-10 text-success" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Bedankt voor je bestelling!
        </h1>

        {/* Order number */}
        {orderId && (
          <p className="text-grey mb-6">
            Bestelnummer:{" "}
            <span className="font-mono font-semibold text-charcoal">
              {orderId}
            </span>
          </p>
        )}

        {/* Confirmation message */}
        <div className="bg-white rounded-lg border border-sand p-6 mb-6 text-left">
          <h2 className="font-semibold text-charcoal mb-4">
            Wat gebeurt er nu?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-wine">1</span>
              </div>
              <div>
                <p className="text-charcoal">Bevestigingsmail</p>
                <p className="text-sm text-grey">
                  Je ontvangt een bevestiging op {contact.email || "je e-mail"}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-wine">2</span>
              </div>
              <div>
                <p className="text-charcoal">Verzending</p>
                <p className="text-sm text-grey">
                  Je bestelling wordt binnen 24 uur verzonden
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-wine">3</span>
              </div>
              <div>
                <p className="text-charcoal">Levering</p>
                <p className="text-sm text-grey">
                  Verwachte bezorging: {shipping.estimatedDate || "1-2 werkdagen"}
                  {address.city && ` in ${address.city}`}
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link href="/wijnen" className="flex-1">
            <Button variant="primary" fullWidth>
              Verder winkelen
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" fullWidth>
              Naar homepagina
            </Button>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="bg-white rounded-lg border border-sand p-6">
          <TrustSignals variant="compact" />
        </div>

        {/* Wine glass decoration */}
        <motion.div
          className="mt-8 text-6xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🍷
        </motion.div>
        <p className="text-sm text-grey mt-2">Proost op je nieuwe wijnen!</p>
      </motion.div>
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-wine border-t-transparent rounded-full" />
    </div>
  );
}

// Main export with Suspense boundary
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
