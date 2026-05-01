"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Wine,
  Thermometer,
  UtensilsCrossed,
  Beef,
  Fish,
  Salad,
  CakeSlice,
  Grape,
  Shell,
  Shrimp,
} from "lucide-react";

/** Cheese wedge icon (not available in this lucide version) */
function CheeseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 19l10-7L22 5v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
      <circle cx="8" cy="17" r="1" />
      <circle cx="14" cy="15" r="1" />
      <circle cx="11" cy="12" r="1" />
    </svg>
  );
}
import type { Product } from "@/types";

interface FoodPairingGalleryProps {
  product: Product;
  className?: string;
}

interface FoodPairing {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function FoodPairingGallery({ product, className }: FoodPairingGalleryProps) {
  const { pairings, isFallback } = getFoodPairingsForProduct(product);
  const servingTemp = getServingTemperature(product);
  const decantTime = getDecantTime(product.wineType);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("", className)}>
      <div className="text-center mb-6 sm:mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2"
        >
          {pairings.length > 0 ? "Lekker bij" : "Serveeradvies"}
        </motion.h2>
        {pairings.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-grey text-sm sm:text-base"
          >
            {isFallback ? "Suggesties op basis van wijntype" : "Wat zet je erbij op tafel?"}
          </motion.p>
        )}
      </div>

      {/* Food Cards Grid */}
      {pairings.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 mb-8 sm:mb-12">
          {pairings.map((pairing, index) => (
            <motion.div
              key={pairing.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                animate={{
                  y: hoveredIndex === index ? -6 : 0,
                  scale: hoveredIndex === index ? 1.03 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center",
                  "shadow-sm border border-sand/30",
                  "transition-shadow duration-300",
                  hoveredIndex === index && "shadow-xl shadow-wine/8 border-wine/15"
                )}
              >
                {/* Icon with background */}
                <div className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2.5 sm:mb-3 rounded-full flex items-center justify-center transition-all duration-300",
                  hoveredIndex === index
                    ? "bg-wine text-white scale-110"
                    : "bg-champagne/40 text-wine"
                )}>
                  <pairing.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <h3 className="font-medium text-charcoal text-xs sm:text-sm mb-0.5">
                  {pairing.name}
                </h3>

                {/* Description - visible on hover/always on desktop */}
                <motion.p
                  initial={false}
                  animate={{
                    height: hoveredIndex === index ? "auto" : 0,
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  className="text-xs text-grey overflow-hidden"
                >
                  {pairing.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Serving Info - Premium cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {/* Temperature */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-sand/30 shadow-sm group hover:shadow-md hover:border-wine/10 transition-all duration-300"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-wine/10 to-wine/5 flex items-center justify-center flex-shrink-0 group-hover:from-wine/15 group-hover:to-wine/8 transition-colors">
              <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-wine" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-grey text-xs sm:text-sm mb-0.5">Serveertemperatuur</h4>
              <p className="text-xl sm:text-2xl font-bold text-wine leading-tight">{servingTemp}</p>
              {!product.servingTemperature && (
                <p className="text-[10px] text-grey/60 mt-0.5">Op basis van wijntype</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Decant Time */}
        {decantTime ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-sand/30 shadow-sm group hover:shadow-md hover:border-wine/10 transition-all duration-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-wine/10 to-wine/5 flex items-center justify-center flex-shrink-0 group-hover:from-wine/15 group-hover:to-wine/8 transition-colors">
                <Wine className="w-5 h-5 sm:w-6 sm:h-6 text-wine" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-grey text-xs sm:text-sm mb-0.5">Decanteren</h4>
                <p className="text-base sm:text-lg font-semibold text-charcoal leading-tight">30-60 min</p>
                <p className="text-xs text-grey mt-0.5 hidden sm:block">Voor het beste resultaat</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-sand/30 shadow-sm group hover:shadow-md hover:border-wine/10 transition-all duration-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-wine/10 to-wine/5 flex items-center justify-center flex-shrink-0 group-hover:from-wine/15 group-hover:to-wine/8 transition-colors">
                <Wine className="w-5 h-5 sm:w-6 sm:h-6 text-wine" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-grey text-xs sm:text-sm mb-0.5">Serveren</h4>
                <p className="text-base sm:text-lg font-semibold text-charcoal leading-tight">Direct drinkbaar</p>
                <p className="text-xs text-grey mt-0.5 hidden sm:block">Geen decanteren nodig</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Icon mapping for food pairing names ---
const PAIRING_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  pasta: UtensilsCrossed,
  "gegrild vlees": Beef,
  vlees: Beef,
  steak: Beef,
  "gerijpte kaas": CheeseIcon,
  kaas: CheeseIcon,
  vis: Fish,
  zeevruchten: Shrimp,
  salade: Salad,
  antipasti: UtensilsCrossed,
  "lichte pasta": UtensilsCrossed,
  "gegrilde groenten": Salad,
  groenten: Salad,
  aperitief: Wine,
  oesters: Shell,
  garnalen: Shrimp,
  mosselen: Shell,
  kreeft: Shrimp,
  desserts: CakeSlice,
  dessert: CakeSlice,
};

function getIconForPairing(name: string): React.ComponentType<{ className?: string }> {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(PAIRING_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return UtensilsCrossed;
}

// Type-based fallback pairings
const FALLBACK_PAIRINGS: Record<string, { names: string[]; descriptions: string[] }> = {
  red: {
    names: ["Pasta", "Gegrild vlees", "Gerijpte kaas"],
    descriptions: ["Ragu, lasagne, tagliatelle", "Biefstuk, lamskotelet", "Parmigiano, Pecorino"],
  },
  white: {
    names: ["Vis", "Zeevruchten", "Salade"],
    descriptions: ["Gegrilde zeebaars, kabeljauw", "Garnalen, mosselen", "Caprese, groene salade"],
  },
  rose: {
    names: ["Antipasti", "Lichte pasta", "Gegrilde groenten"],
    descriptions: ["Bruschetta, carpaccio", "Pesto, primavera", "Courgette, paprika"],
  },
  sparkling: {
    names: ["Aperitief", "Oesters", "Desserts"],
    descriptions: ["Perfect als aperitief", "Verse oesters, crudo", "Fruit, lichte gebakjes"],
  },
};

/**
 * Use real metafield data when available (custom.food_pairing),
 * otherwise fall back to sensible suggestions based on wine type.
 */
function getFoodPairingsForProduct(product: Product): { pairings: FoodPairing[]; isFallback: boolean } {
  // Real data from metafield
  if (product.foodPairing && product.foodPairing.length > 0) {
    return {
      pairings: product.foodPairing.map((name) => ({
        name,
        icon: getIconForPairing(name),
        description: "",
      })),
      isFallback: false,
    };
  }

  // Fallback based on wine type
  const fallback = FALLBACK_PAIRINGS[product.wineType] ?? FALLBACK_PAIRINGS.red;
  return {
    pairings: fallback.names.map((name, i) => ({
      name,
      icon: getIconForPairing(name),
      description: fallback.descriptions[i] || "",
    })),
    isFallback: true,
  };
}

// Known grape varieties mapped to wine body weight for temperature selection
const HEAVY_RED_GRAPES = ["nebbiolo", "barolo", "barbaresco", "amarone", "brunello", "sagrantino", "aglianico"];
const LIGHT_RED_GRAPES = ["barbera", "dolcetto", "schiava", "grignolino", "freisa", "lagrein"];
const FULL_WHITE_GRAPES = ["chardonnay", "viognier", "gewurztraminer", "friulano", "ribolla gialla"];

/**
 * Serving temperature: use metafield value when available,
 * otherwise calculate based on wine type AND body/grape variety.
 */
function getServingTemperature(product: Product): string {
  // Real data from metafield takes priority
  if (product.servingTemperature) return product.servingTemperature;

  const grapes = product.grapeVarieties.map(g => g.toLowerCase());
  const body = product.tasteProfile?.lightFull ?? 3;

  switch (product.wineType) {
    case "red": {
      const isHeavy = body >= 5 || grapes.some(g => HEAVY_RED_GRAPES.some(h => g.includes(h)));
      const isLight = body <= 2 || grapes.some(g => LIGHT_RED_GRAPES.some(l => g.includes(l)));
      if (isHeavy) return "17-18°C";
      if (isLight) return "14-16°C";
      return "16-17°C";
    }
    case "white": {
      const isFull = body >= 4 || grapes.some(g => FULL_WHITE_GRAPES.some(f => g.includes(f)));
      if (isFull) return "10-12°C";
      return "8-10°C";
    }
    case "rose":
      return "8-10°C";
    case "sparkling":
      return "6-8°C";
    default:
      return "12-14°C";
  }
}

function getDecantTime(wineType: string): string | null {
  switch (wineType) {
    case "red": return "30-60 minuten voor serveren";
    default: return null;
  }
}
