"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { Package as PackageIcon, Truck as TruckIcon, Home as HomeIcon, ShoppingCart as ShoppingCartIcon, Shield as ShieldIcon } from "lucide-react";

const steps = [
  {
    Icon: ShoppingCartIcon,
    title: "Besteld",
    description: "Je bestelling is bevestigd en wordt klaargezet in ons magazijn.",
    color: "bg-wine",
  },
  {
    Icon: PackageIcon,
    title: "Verpakt",
    description: "Elke fles wordt zorgvuldig verpakt in speciaal beschermend materiaal.",
    color: "bg-wine",
  },
  {
    Icon: TruckIcon,
    title: "Verzonden",
    description: "Je pakket is onderweg. Je ontvangt een track & trace code per e-mail.",
    color: "bg-wine",
  },
  {
    Icon: HomeIcon,
    title: "Bezorgd",
    description: "Jouw wijnen worden bij jou thuis afgeleverd. Proost!",
    color: "bg-wine",
  },
];

const shippingCosts = [
  { description: "Bestelling tot \u20AC35", cost: "\u20AC5,95" },
  { description: "Bestelling vanaf \u20AC35", cost: "Gratis", highlight: true },
  { description: "Avondlevering", cost: "\u20AC2,50 toeslag" },
  { description: "Belgi\u00EB", cost: "\u20AC8,95" },
];

const features = [
  {
    Icon: ShieldIcon,
    title: "Beschermde Verpakking",
    description: "Speciale wijnverpakking met schokabsorberend materiaal. Jouw flessen komen altijd heel aan.",
  },
  {
    Icon: TruckIcon,
    title: "Snelle Levering",
    description: "Besteld op werkdagen voor 16:00? Volgende werkdag in huis. Track & trace via PostNL.",
  },
  {
    Icon: PackageIcon,
    title: "Temperatuurbestendig",
    description: "Bij extreme temperaturen pakken we extra isolerend in om de kwaliteit te waarborgen.",
  },
];

interface VerzendingContentProps {
  pageBody: string | null;
  pageTitle: string | null;
}

export function VerzendingContent({ pageBody, pageTitle }: VerzendingContentProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-label text-gold/60 mb-4"
          >
            Klantenservice
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-[1.15]"
          >
            {pageTitle ?? "Verzending & Levering"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 max-w-lg"
          >
            Jouw wijn, veilig en snel bezorgd. Gratis verzending vanaf \u20AC35.
          </motion.p>
        </div>
      </section>

      {/* Shipping Timeline Stepper */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-sand/50 p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-8 text-center">
            Van bestelling tot bezorging
          </h2>
          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.12}>
            {steps.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="text-center relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-6 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-px bg-sand z-0" />
                  )}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-wine flex items-center justify-center mx-auto mb-3">
                    <step.Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-charcoal text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-grey leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        {/* CMS Content */}
        {pageBody && (
          <AnimateOnScroll variant="fadeUp">
            <div
              className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2 mb-16"
              dangerouslySetInnerHTML={{ __html: pageBody }}
            />
          </AnimateOnScroll>
        )}

        {/* Shipping Costs Table */}
        <AnimateOnScroll variant="fadeUp">
          <div className="mb-16">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-6">
              Verzendkosten
            </h2>
            <div className="bg-white rounded-lg border border-sand/50 overflow-hidden">
              {shippingCosts.map((item, index) => (
                <div
                  key={item.description}
                  className={`flex items-center justify-between px-5 sm:px-6 py-4 ${
                    index < shippingCosts.length - 1 ? "border-b border-sand/50" : ""
                  } ${item.highlight ? "bg-wine/5" : ""}`}
                >
                  <span className="text-charcoal text-sm">{item.description}</span>
                  <span className={`font-semibold text-sm ${item.highlight ? "text-wine" : "text-charcoal"}`}>
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-grey mt-3">
              * Verzending naar Nederland en Belgi\u00EB. Voor andere landen neem contact op.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Features */}
        <StaggerChildren className="grid sm:grid-cols-3 gap-6 mb-16" staggerDelay={0.1}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="bg-warm-white rounded-lg p-6 border border-sand/50 h-full">
                <div className="w-11 h-11 rounded-lg bg-wine/10 flex items-center justify-center mb-4">
                  <feature.Icon className="w-5 h-5 text-wine" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-base font-semibold text-charcoal mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-grey leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Delivery Area */}
        <AnimateOnScroll variant="fadeUp">
          <div className="mb-16 bg-cream rounded-2xl p-6 sm:p-8 border border-sand/50">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-4">
              Bezorggebied
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-charcoal text-sm mb-2">Nederland</h3>
                <p className="text-sm text-grey leading-relaxed">
                  Wij bezorgen in heel Nederland. Besteld op werkdagen voor 16:00? Dan wordt je
                  bestelling de volgende werkdag geleverd. Weekend- en avondlevering mogelijk.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal text-sm mb-2">Belgi\u00EB</h3>
                <p className="text-sm text-grey leading-relaxed">
                  Levering in Belgi\u00EB duurt 2-3 werkdagen. Je ontvangt altijd een track &
                  trace code zodat je je pakket kunt volgen.
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-16 sm:pb-24">
        <div className="pt-8 border-t border-sand flex flex-wrap gap-4 justify-between">
          <Link
            href="/klantenservice"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar Klantenservice
          </Link>
          <Link
            href="/klantenservice/retourneren"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            Retourbeleid &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
