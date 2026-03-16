"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { GiftBoxIcon } from "./GiftBoxIcon";
import { Heart, Award, Check, Wine } from "lucide-react";

// Wine-specific decorative icons (no Lucide equivalent)
function WineGlassesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5.5 2h5l-.5 5a3.5 3.5 0 0 1-4 0L5.5 2z" />
      <path d="M8 7v5" />
      <path d="M5 14h6" />
      <path d="M13.5 2h5l-.5 5a3.5 3.5 0 0 1-4 0L13.5 2z" />
      <path d="M16 7v5" />
      <path d="M13 14h6" />
    </svg>
  );
}

const giftIdeas = [
  {
    icon: "bottle",
    title: "Enkele Fles",
    description: "Een zorgvuldig geselecteerde wijn, prachtig verpakt in een geschenkdoos.",
    price: "Vanaf \u20AC12",
    features: ["Geschenkdoos inbegrepen", "Optioneel kaartje"],
  },
  {
    icon: "duo",
    title: "Duo Pakket",
    description: "Twee complementaire wijnen — perfect voor een avond vol Italiaans genieten.",
    price: "Vanaf \u20AC25",
    features: ["Twee wijnen", "Premium verpakking", "Persoonlijk bericht"],
  },
  {
    icon: "box",
    title: "Proeverij Box",
    description: "Drie of zes wijnen uit verschillende regio\u2019s. Ideaal voor de ontdekker.",
    price: "Vanaf \u20AC40",
    features: ["3 of 6 wijnen", "Proefnotities", "Luxe geschenkverpakking"],
  },
];

const occasions = [
  { icon: Heart, label: "Verjaardag" },
  { icon: Award, label: "Jubileum" },
  { icon: GiftBoxIcon, label: "Feestdagen" },
  { icon: WineGlassesIcon, label: "Housewarming" },
];

interface CadeausContentProps {
  children?: React.ReactNode; // product cards slot
}

export function CadeausContent({ children }: CadeausContentProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(201,162,39,0.05),transparent_40%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-gold/10 border border-gold/20 mb-6"
          >
            <GiftBoxIcon className="w-9 h-9 text-gold" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-[1.15]"
          >
            Wijn <span className="text-gold">Cadeau</span> Geven
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Verras iemand met een authentieke Italiaanse wijn. Elke fles wordt
            met zorg verpakt en kan voorzien worden van een persoonlijk bericht.
          </motion.p>

          {/* Occasion tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-3 justify-center mt-8"
          >
            {occasions.map((o) => (
              <span
                key={o.label}
                className="inline-flex items-center gap-2 text-xs font-medium text-white/70 bg-white/10 px-4 py-2 rounded-full border border-white/10"
              >
                <o.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {o.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gift Ideas — configurator feel */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <StaggerChildren className="grid sm:grid-cols-3 gap-5" staggerDelay={0.1}>
          {giftIdeas.map((idea) => (
            <StaggerItem key={idea.title}>
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-sand/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-wine/10 flex items-center justify-center mx-auto mb-5">
                  {idea.icon === "duo" ? (
                    <WineGlassesIcon className="w-7 h-7 text-wine" />
                  ) : idea.icon === "box" ? (
                    <GiftBoxIcon className="w-8 h-8 text-wine" />
                  ) : (
                    <Wine className="w-7 h-7 text-wine" strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                  {idea.title}
                </h3>
                <p className="text-sm text-grey leading-relaxed mb-4 flex-1">
                  {idea.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-5">
                  {idea.features.map((f) => (
                    <li key={f} className="flex items-center justify-center gap-2 text-xs text-grey">
                      <Check className="w-3.5 h-3.5 text-wine/60 flex-shrink-0" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Price badge */}
                <div className="pt-4 border-t border-sand/50">
                  <span className="font-serif text-lg font-bold text-wine">{idea.price}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center mb-12">
              <p className="text-label text-gold/60 mb-3">
                Zo Werkt Het
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                In 3 stappen een perfect cadeau
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerChildren className="grid sm:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              {
                step: "01",
                title: "Kies je wijn",
                description: "Selecteer een fles, duo of proeverij box. We helpen je graag met advies.",
              },
              {
                step: "02",
                title: "Personaliseer",
                description: "Voeg een persoonlijk bericht toe. Wij verzorgen de luxe verpakking.",
              },
              {
                step: "03",
                title: "Laat bezorgen",
                description: "Kies een bezorgdatum. Wij leveren het cadeau waar en wanneer jij wilt.",
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="text-center">
                  <span className="inline-block font-serif text-4xl font-bold text-wine/15 mb-3">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-grey leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Product cards slot */}
      {children}

      {/* Contact CTA for custom gifts */}
      <section className="bg-cream">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <AnimateOnScroll variant="scaleIn">
            <div className="relative bg-gradient-to-br from-wine to-wine-dark rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[80px]" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/3 rounded-tr-[50px]" />
              <div className="relative">
                <GiftBoxIcon className="w-12 h-12 text-gold/40 mx-auto mb-4" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-4">
                  Op Zoek naar Iets Speciaals?
                </h2>
                <p className="text-white/70 leading-relaxed mb-8 max-w-lg mx-auto">
                  We stellen graag een persoonlijk wijncadeau voor je samen. Neem
                  contact op en vertel ons de gelegenheid — wij doen de rest.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-12 px-8 bg-white text-wine text-button uppercase rounded hover:bg-white/90 transition-colors"
                  >
                    Neem Contact Op
                  </Link>
                  <Link
                    href="/wijnen"
                    className="inline-flex items-center justify-center h-12 px-8 border-2 border-white/30 text-white text-button uppercase rounded hover:bg-white/10 transition-colors"
                  >
                    Bekijk Alle Wijnen
                  </Link>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
