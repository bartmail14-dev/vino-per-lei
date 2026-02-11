"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/icons";
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
}

export function TastingExperience({ product, className }: TastingExperienceProps) {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const phases = getTastingPhasesForWineType(product.wineType);

  return (
    <div className={cn("bg-cream rounded-2xl overflow-hidden", className)}>
      <div className="text-center py-4 sm:py-8 px-4">
        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2">
          Proefervaring
        </h2>
        <p className="text-grey text-sm sm:text-base max-w-xl mx-auto">
          Ontdek de lagen van smaak en aroma
        </p>
      </div>

      {/* Desktop: 3 columns */}
      <div className="hidden md:grid md:grid-cols-3">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={cn(
              "p-8 border-t border-sand/50 transition-colors duration-300",
              index !== 0 && "border-l",
              activePhase === phase.id ? "bg-champagne/30" : "hover:bg-champagne/20"
            )}
            onMouseEnter={() => setActivePhase(phase.id)}
            onMouseLeave={() => setActivePhase(null)}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                activePhase === phase.id ? "bg-wine text-white scale-110" : "bg-wine/10 text-wine"
              )}>
                <phase.icon className="w-8 h-8" />
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl font-semibold text-charcoal text-center mb-1">
              {phase.title}
            </h3>
            <p className="text-sm text-grey text-center mb-6">{phase.subtitle}</p>

            {/* Content */}
            <ul className="space-y-3">
              {phase.content.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + i * 0.1 }}
                  className="flex items-start gap-2 text-charcoal"
                >
                  <span className="text-wine mt-1">
                    <DotIcon className="w-2 h-2" />
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Accordion - Improved touch targets */}
      <div className="md:hidden">
        {phases.map((phase, index) => (
          <div key={phase.id} className={cn("border-t border-sand/50", index !== phases.length - 1 && "border-b-0")}>
            <button
              onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              className="w-full p-4 flex items-center gap-3 active:bg-champagne/30 transition-colors min-h-[64px]"
            >
              <div className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                activePhase === phase.id ? "bg-wine text-white" : "bg-wine/10 text-wine"
              )}>
                <phase.icon className="w-5 h-5" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h3 className="font-serif text-base font-semibold text-charcoal">
                  {phase.title}
                </h3>
                <p className="text-xs text-grey truncate">{phase.subtitle}</p>
              </div>
              <ChevronDownIcon className={cn(
                "w-5 h-5 text-grey transition-transform flex-shrink-0",
                activePhase === phase.id && "rotate-180"
              )} />
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
                  <ul className="px-4 pb-4 space-y-2.5">
                    {phase.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-charcoal text-sm">
                        <span className="text-wine mt-1.5 flex-shrink-0">
                          <DotIcon className="w-1.5 h-1.5" />
                        </span>
                        <span>{item}</span>
                      </li>
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
        icon: NoseIcon,
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
        icon: TongueIcon,
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
        icon: SparkleIcon,
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
        icon: NoseIcon,
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
        icon: TongueIcon,
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
        icon: SparkleIcon,
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
        icon: NoseIcon,
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
        icon: TongueIcon,
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
        icon: SparkleIcon,
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
        icon: NoseIcon,
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
        icon: TongueIcon,
        content: [
          "Fijne persistente bubbels",
          "Verfrissende zuurgraad",
          "Elegant en levendig",
          "Hints van amandel",
          "Crémige textuur",
        ],
      },
      {
        id: "finish",
        title: "Afdronk",
        subtitle: "Het laatste woord",
        icon: SparkleIcon,
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

// Icons
function NoseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22" strokeLinecap="round" />
      <path d="M12 2C12 2 16 6 16 12C16 16 14 20 12 22" strokeLinecap="round" />
      <path d="M7 14C7 14 9 13 12 13C15 13 17 14 17 14" strokeLinecap="round" />
    </svg>
  );
}

function TongueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C7 2 4 6 4 10C4 14 6 18 8 20C9 21 10 22 12 22C14 22 15 21 16 20C18 18 20 14 20 10C20 6 17 2 12 2Z" strokeLinecap="round" />
      <path d="M12 14V18" strokeLinecap="round" />
      <circle cx="9" cy="8" r="1" fill="currentColor" />
      <circle cx="15" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 3L20 5L22 6L20 7L19 9L18 7L16 6L18 5L19 3Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 8 8" fill="currentColor">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}
