"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Wind, Wine, Sparkles, ChevronDown } from "lucide-react";
import type { Product } from "@/types";

interface TastingExperienceProps {
  product: Product;
  className?: string;
}

interface TastingPhase {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string[];
  step: number;
}

export function TastingExperience({ product, className }: TastingExperienceProps) {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const phases = getTastingPhasesForWineType(product.wineType);

  return (
    <div className={cn("bg-cream rounded-2xl overflow-hidden border border-sand/20", className)}>
      <div className="text-center py-6 sm:py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1.5 sm:mb-2">
            Proefervaring
          </h2>
          <p className="text-grey text-sm sm:text-base max-w-xl mx-auto">
            Ontdek de lagen van smaak en aroma in drie fasen
          </p>
        </motion.div>
      </div>

      {/* Desktop: 3 columns with step numbers */}
      <div className="hidden md:grid md:grid-cols-3">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={cn(
              "relative p-6 lg:p-8 border-t border-sand/40 transition-all duration-400",
              index !== 0 && "border-l border-sand/40",
              activePhase === phase.id
                ? "bg-champagne/30"
                : "hover:bg-champagne/15"
            )}
            onMouseEnter={() => setActivePhase(phase.id)}
            onMouseLeave={() => setActivePhase(null)}
          >
            {/* Step number */}
            <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
              <span className={cn(
                "text-4xl lg:text-5xl font-serif font-bold transition-colors duration-300",
                activePhase === phase.id ? "text-wine/15" : "text-sand/60"
              )}>
                {phase.step}
              </span>
            </div>

            {/* Icon */}
            <div className="flex justify-start mb-5">
              <motion.div
                animate={{
                  scale: activePhase === phase.id ? 1.1 : 1,
                  rotate: activePhase === phase.id ? 5 : 0,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                  activePhase === phase.id
                    ? "bg-wine text-white shadow-lg shadow-wine/20"
                    : "bg-wine/8 text-wine"
                )}
              >
                <phase.icon className="w-7 h-7 lg:w-8 lg:h-8" />
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg lg:text-xl font-semibold text-charcoal mb-1">
              {phase.title}
            </h3>
            <p className="text-sm text-grey mb-5">{phase.subtitle}</p>

            {/* Content */}
            <ul className="space-y-3">
              {phase.content.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-charcoal text-sm"
                >
                  <span className={cn(
                    "mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300",
                    activePhase === phase.id ? "bg-wine" : "bg-wine/30"
                  )} />
                  <span className="leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* Connecting arrow between columns */}
            {index < phases.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden lg:block">
                <div className="w-6 h-6 rounded-full bg-cream border border-sand/40 flex items-center justify-center">
                  <svg className="w-3 h-3 text-grey" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Mobile: Accordion */}
      <div className="md:hidden">
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            className={cn(
              "border-t border-sand/40",
              index !== phases.length - 1 && "border-b-0"
            )}
          >
            <button
              onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              className={cn(
                "w-full p-4 flex items-center gap-3 transition-colors min-h-[64px]",
                activePhase === phase.id ? "bg-champagne/30" : "active:bg-champagne/20"
              )}
            >
              {/* Step number */}
              <span className="text-2xl font-serif font-bold text-wine/20 w-8 text-center flex-shrink-0">
                {phase.step}
              </span>

              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300",
                activePhase === phase.id ? "bg-wine text-white" : "bg-wine/8 text-wine"
              )}>
                <phase.icon className="w-5 h-5" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h3 className="font-serif text-base font-semibold text-charcoal">
                  {phase.title}
                </h3>
                <p className="text-xs text-grey truncate">{phase.subtitle}</p>
              </div>
              <motion.div
                animate={{ rotate: activePhase === phase.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-grey flex-shrink-0" strokeWidth={1.5} />
              </motion.div>
            </button>

            <AnimatePresence>
              {activePhase === phase.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="px-4 pb-4 pl-16 space-y-2.5">
                    {phase.content.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 text-charcoal text-sm"
                      >
                        <span className="text-wine mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-wine" />
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get tasting phases based on wine type
function getTastingPhasesForWineType(wineType: string): TastingPhase[] {
  const basePhases: Record<string, TastingPhase[]> = {
    red: [
      {
        id: "nose",
        title: "Geur",
        subtitle: "De neus vertelt het verhaal",
        icon: Wind,
        step: 1,
        content: [
          "Intense aroma's van rijp donker fruit",
          "Zwarte kers en cassis",
          "Subtiele tonen van vanille",
          "Cederhout van eiken rijping",
          "Hints van specerijen en tabak",
        ],
      },
      {
        id: "palate",
        title: "Smaak",
        subtitle: "De reis door de mond",
        icon: Wine,
        step: 2,
        content: [
          "Vol en rond in de mond",
          "Fluweelzachte tannines",
          "Smaken van bramen en pruimen",
          "Hints van pure chocolade",
          "Gebalanceerde zuurgraad",
        ],
      },
      {
        id: "finish",
        title: "Afdronk",
        subtitle: "Het laatste woord",
        icon: Sparkles,
        step: 3,
        content: [
          "Lang en elegant",
          "Persistente fruitige naklank",
          "Zachte kruidige finish",
          "Uitnodigend voor de volgende slok",
        ],
      },
    ],
    white: [
      {
        id: "nose",
        title: "Geur",
        subtitle: "De neus vertelt het verhaal",
        icon: Wind,
        step: 1,
        content: [
          "Fris en elegant bouquet",
          "Citrus en groene appel",
          "Witte bloemen en acacia",
          "Minerale ondertonen",
          "Hints van witte perzik",
        ],
      },
      {
        id: "palate",
        title: "Smaak",
        subtitle: "De reis door de mond",
        icon: Wine,
        step: 2,
        content: [
          "Verfrissend en levendig",
          "Mooie zuurgraad",
          "Zuivere en clean smaak",
          "Aangename mineraliteit",
          "Rijp steenfruit",
        ],
      },
      {
        id: "finish",
        title: "Afdronk",
        subtitle: "Het laatste woord",
        icon: Sparkles,
        step: 3,
        content: [
          "Helder en verfrissend",
          "Minerale nasmaak",
          "Citrus accenten",
          "Dorstlessend en elegant",
        ],
      },
    ],
    rose: [
      {
        id: "nose",
        title: "Geur",
        subtitle: "De neus vertelt het verhaal",
        icon: Wind,
        step: 1,
        content: [
          "Delicate fruitige geuren",
          "Aardbeien en frambozen",
          "Watermeloen en perzik",
          "Mediterrane kruiden",
          "Subtiele bloemige tonen",
        ],
      },
      {
        id: "palate",
        title: "Smaak",
        subtitle: "De reis door de mond",
        icon: Wine,
        step: 2,
        content: [
          "Licht en verfrissend",
          "Zachte textuur",
          "Rood fruit smaken",
          "Aangename frisheid",
          "Zomerse elegantie",
        ],
      },
      {
        id: "finish",
        title: "Afdronk",
        subtitle: "Het laatste woord",
        icon: Sparkles,
        step: 3,
        content: [
          "Fris en clean",
          "Fruitige naklank",
          "Uitnodigend voor meer",
          "Perfect bij warm weer",
        ],
      },
    ],
    sparkling: [
      {
        id: "nose",
        title: "Geur",
        subtitle: "De neus vertelt het verhaal",
        icon: Wind,
        step: 1,
        content: [
          "Fijne bubbelgeur",
          "Groene appel en peer",
          "Witte bloemen",
          "Brioche en gist",
          "Citrus accenten",
        ],
      },
      {
        id: "palate",
        title: "Smaak",
        subtitle: "De reis door de mond",
        icon: Wine,
        step: 2,
        content: [
          "Fijne persistente bubbels",
          "Verfrissende zuurgraad",
          "Elegant en levendig",
          "Hints van amandel",
          "Cremige textuur",
        ],
      },
      {
        id: "finish",
        title: "Afdronk",
        subtitle: "Het laatste woord",
        icon: Sparkles,
        step: 3,
        content: [
          "Feestelijk en opwekkend",
          "Lange mousse",
          "Clean en verfrissend",
          "Perfect aperitief",
        ],
      },
    ],
  };

  return basePhases[wineType] || basePhases.red;
}
