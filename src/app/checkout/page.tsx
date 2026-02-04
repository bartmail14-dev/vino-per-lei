"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore, calculateEstimatedDelivery } from "@/stores/checkoutStore";
import {
  AccordionSection,
  OrderSummary,
  ExpressCheckout,
  ContactSection,
  DeliverySection,
  GiftSection,
  ShippingSection,
  PaymentSection,
  TrustSignals,
} from "@/components/checkout";
import { cn } from "@/lib/utils";
import type { CheckoutSection } from "@/types/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount } = useCartStore();
  const {
    contact,
    address,
    gift,
    shipping,
    activeSection,
    completedSections,
    setActiveSection,
    completeSection,
    uncompleteSection,
    setShipping,
    getProgressPercentage,
  } = useCheckoutStore();

  // Redirect to cart if empty
  useEffect(() => {
    if (itemCount === 0) {
      router.push("/wijnen");
    }
  }, [itemCount, router]);

  // Initialize shipping estimate on mount
  useEffect(() => {
    if (!shipping.estimatedDate) {
      setShipping({ estimatedDate: calculateEstimatedDelivery(shipping.method) });
    }
  }, [shipping.estimatedDate, shipping.method, setShipping]);

  // Don't render if cart is empty
  if (itemCount === 0) {
    return null;
  }

  const handleSectionComplete = (section: CheckoutSection, nextSection: CheckoutSection) => {
    completeSection(section);
    setActiveSection(nextSection);
  };

  const handleEditSection = (section: CheckoutSection) => {
    uncompleteSection(section);
    setActiveSection(section);
  };

  // Section summaries for completed state
  const getContactSummary = () => contact.email || "";
  const getDeliverySummary = () =>
    address.street && address.city
      ? `${address.street} ${address.houseNumber}, ${address.city}`
      : "";
  const getGiftSummary = () =>
    gift.isGift
      ? gift.wrapping
        ? "Cadeau met verpakking"
        : "Cadeau"
      : "Geen cadeau";
  const getShippingSummary = () => {
    const methods = {
      standard: "Standaard verzending",
      temperature: "Temperatuur-gecontroleerd",
      evening: "Avondlevering",
    };
    return methods[shipping.method] || "";
  };

  const progress = getProgressPercentage();

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/wijnen"
          className="inline-flex items-center gap-2 text-sm text-grey hover:text-wine mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Terug naar winkel
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-charcoal">
              Checkout voortgang
            </span>
            <span className="text-sm text-grey">{progress}% voltooid</span>
          </div>
          <div className="h-2 bg-sand rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-wine rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left column - Checkout form */}
          <div className="space-y-6">
            {/* Express checkout */}
            <div className="bg-white rounded-lg border border-sand p-6">
              <ExpressCheckout />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-sand" />
              <span className="text-sm text-grey">of vul je gegevens in</span>
              <div className="flex-1 h-px bg-sand" />
            </div>

            {/* Accordion sections */}
            <div className="space-y-4">
              {/* Contact */}
              <AccordionSection
                id="contact"
                title="Contactgegevens"
                stepNumber={1}
                isActive={activeSection === "contact"}
                isCompleted={completedSections.includes("contact")}
                completedSummary={getContactSummary()}
                onActivate={() => setActiveSection("contact")}
                onEdit={() => handleEditSection("contact")}
              >
                <ContactSection
                  onComplete={() => handleSectionComplete("contact", "delivery")}
                />
              </AccordionSection>

              {/* Delivery */}
              <AccordionSection
                id="delivery"
                title="Bezorgadres"
                stepNumber={2}
                isActive={activeSection === "delivery"}
                isCompleted={completedSections.includes("delivery")}
                completedSummary={getDeliverySummary()}
                onActivate={() => setActiveSection("delivery")}
                onEdit={() => handleEditSection("delivery")}
              >
                <DeliverySection
                  onComplete={() => handleSectionComplete("delivery", "gift")}
                />
              </AccordionSection>

              {/* Gift */}
              <AccordionSection
                id="gift"
                title="Cadeau-opties"
                stepNumber={3}
                isActive={activeSection === "gift"}
                isCompleted={completedSections.includes("gift")}
                completedSummary={getGiftSummary()}
                onActivate={() => setActiveSection("gift")}
                onEdit={() => handleEditSection("gift")}
              >
                <GiftSection
                  onComplete={() => handleSectionComplete("gift", "shipping")}
                />
              </AccordionSection>

              {/* Shipping */}
              <AccordionSection
                id="shipping"
                title="Verzendmethode"
                stepNumber={4}
                isActive={activeSection === "shipping"}
                isCompleted={completedSections.includes("shipping")}
                completedSummary={getShippingSummary()}
                onActivate={() => setActiveSection("shipping")}
                onEdit={() => handleEditSection("shipping")}
              >
                <ShippingSection
                  onComplete={() => handleSectionComplete("shipping", "payment")}
                />
              </AccordionSection>

              {/* Payment */}
              <AccordionSection
                id="payment"
                title="Betaling"
                stepNumber={5}
                isActive={activeSection === "payment"}
                isCompleted={false}
                onActivate={() => setActiveSection("payment")}
              >
                <PaymentSection />
              </AccordionSection>
            </div>

            {/* Trust signals - mobile only */}
            <div className="lg:hidden bg-white rounded-lg border border-sand p-6">
              <TrustSignals variant="full" />
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="hidden lg:block">
            <OrderSummary className="sticky top-6" />
          </div>
        </div>

        {/* Mobile order summary - fixed bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sand p-4 shadow-lg">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
