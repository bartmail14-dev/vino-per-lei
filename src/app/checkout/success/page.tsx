"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("order");
  const orderId = rawOrderId && /^[a-zA-Z0-9-]{1,50}$/.test(rawOrderId) ? rawOrderId : null;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckIcon className="w-10 h-10 text-success" />
        </motion.div>

        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          Bedankt voor je bestelling
        </h1>

        {orderId && (
          <p className="text-grey mb-6">
            Bestelnummer:{" "}
            <span className="font-mono font-semibold text-charcoal">
              {orderId}
            </span>
          </p>
        )}

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
                  Shopify verstuurt de bevestiging naar het e-mailadres dat je tijdens het afrekenen hebt ingevuld.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-wine">2</span>
              </div>
              <div>
                <p className="text-charcoal">Orderverwerking</p>
                <p className="text-sm text-grey">
                  Carla verwerkt de bestelling handmatig vanuit Shopify.
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
                  De actuele leveringsinformatie staat in je orderbevestiging.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
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
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-wine border-t-transparent rounded-full" />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
