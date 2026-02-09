"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

const steps: { id: CheckoutSection; label: string; icon: React.ReactNode }[] = [
  {
    id: "contact",
    label: "Contact",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "delivery",
    label: "Bezorging",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "gift",
    label: "Cadeau",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    id: "shipping",
    label: "Verzending",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: "payment",
    label: "Betaling",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

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

  const [mobileOrderSummaryOpen, setMobileOrderSummaryOpen] = useState(false);

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

  // Determine current step index for progress indicator
  const sectionOrder: CheckoutSection[] = ["contact", "delivery", "gift", "shipping", "payment"];
  const currentStepIndex = sectionOrder.indexOf(activeSection);

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

        {/* Visual Step Progress Indicator */}
        <div className="mb-8">
          {/* Desktop step indicator */}
          <div className="hidden sm:block">
            <nav aria-label="Checkout voortgang" className="relative">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const isCompleted = completedSections.includes(step.id);
                  const isCurrent = activeSection === step.id;
                  const isPast = isCompleted && !isCurrent;

                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      {/* Step circle + label */}
                      <button
                        onClick={() => {
                          if (isCompleted) handleEditSection(step.id);
                          else if (isCurrent) { /* already active */ }
                        }}
                        className={cn(
                          "flex flex-col items-center gap-2 relative z-10 group",
                          (isCompleted || isCurrent) ? "cursor-pointer" : "cursor-default"
                        )}
                        aria-current={isCurrent ? "step" : undefined}
                      >
                        <motion.div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                            isCompleted
                              ? "bg-wine border-wine text-white"
                              : isCurrent
                              ? "bg-white border-wine text-wine shadow-md"
                              : "bg-warm-white border-sand text-grey"
                          )}
                          animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {isCompleted ? (
                            <motion.svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </motion.svg>
                          ) : (
                            step.icon
                          )}
                        </motion.div>
                        <span
                          className={cn(
                            "text-xs font-medium transition-colors",
                            isCompleted
                              ? "text-wine"
                              : isCurrent
                              ? "text-charcoal"
                              : "text-grey"
                          )}
                        >
                          {step.label}
                        </span>
                      </button>

                      {/* Connector line between steps */}
                      {index < steps.length - 1 && (
                        <div className="flex-1 mx-3 mt-[-1.5rem]">
                          <div className="h-0.5 bg-sand rounded-full relative overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-wine rounded-full"
                              initial={{ width: "0%" }}
                              animate={{
                                width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                              }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Mobile step indicator - compact */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-charcoal">
                Stap {currentStepIndex + 1} van {steps.length}
              </span>
              <span className="text-sm text-grey">
                {steps[currentStepIndex]?.label}
              </span>
            </div>
            <div className="flex gap-1.5">
              {steps.map((step, index) => {
                const isCompleted = completedSections.includes(step.id);
                const isCurrent = activeSection === step.id;
                return (
                  <motion.div
                    key={step.id}
                    className={cn(
                      "h-1.5 rounded-full flex-1",
                      isCompleted
                        ? "bg-wine"
                        : isCurrent
                        ? "bg-wine/50"
                        : "bg-sand"
                    )}
                    layout
                    transition={{ duration: 0.3 }}
                  />
                );
              })}
            </div>
          </div>

          {/* Progress percentage */}
          <div className="mt-4">
            <div className="h-1 bg-sand rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-wine to-wine-light rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Reassuring message */}
        <motion.div
          className="mb-6 flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-sand/50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-8 h-8 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-charcoal">
              <span className="font-medium">Veilig en versleuteld</span>
              {" "}&mdash; Je gegevens worden beschermd met SSL-encryptie
            </p>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left column - Checkout form */}
          <div className="space-y-6">
            {/* Mobile order summary - collapsible at top */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileOrderSummaryOpen(!mobileOrderSummaryOpen)}
                className="w-full flex items-center justify-between bg-white rounded-lg border border-sand p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span className="font-medium text-charcoal">
                    Besteloverzicht ({items.length} {items.length === 1 ? "artikel" : "artikelen"})
                  </span>
                </div>
                <motion.svg
                  className="w-5 h-5 text-grey"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={{ rotate: mobileOrderSummaryOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {mobileOrderSummaryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2">
                      <OrderSummary />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Express checkout */}
            <motion.div
              className="bg-white rounded-lg border border-sand p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ExpressCheckout />
            </motion.div>

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

          {/* Right column - Order summary (desktop only, always visible sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <OrderSummary />
              <motion.div
                className="bg-white rounded-lg border border-sand p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <TrustSignals variant="compact" />
              </motion.div>
            </div>
          </div>
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
