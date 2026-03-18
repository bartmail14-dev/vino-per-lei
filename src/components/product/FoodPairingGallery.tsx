"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Wine,
  Thermometer,
} from "lucide-react";
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
  const pairings = getFoodPairingsForProduct(product);
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
            Aanbevolen combinaties voor deze wijn
          </motion.p>
        )}
      </div>

      {/* Food Cards Grid - Only shown when real pairing data exists */}
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
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-sand/30 shadow-sm group hover:shadow-md hover:border-wine/10 transition-all duration-300"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-wine/10 to-wine/5 flex items-center justify-center flex-shrink-0 group-hover:from-wine/15 group-hover:to-wine/8 transition-colors">
              <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-wine" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-grey text-xs sm:text-sm mb-0.5">Serveertemperatuur</h4>
              <p className="text-xl sm:text-2xl font-bold text-wine leading-tight">{servingTemp}</p>
            </div>
          </div>
        </motion.div>

        {/* Decant Time */}
        {decantTime ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-sand/30 shadow-sm group hover:shadow-md hover:border-wine/10 transition-all duration-300"
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
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-sand/30 shadow-sm group hover:shadow-md hover:border-wine/10 transition-all duration-300"
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

// Known grape varieties mapped to wine body weight for temperature selection
const HEAVY_RED_GRAPES = ["nebbiolo", "barolo", "barbaresco", "amarone", "brunello", "sagrantino", "aglianico"];
const LIGHT_RED_GRAPES = ["barbera", "dolcetto", "schiava", "grignolino", "freisa", "lagrein"];
const FULL_WHITE_GRAPES = ["chardonnay", "viognier", "gewurztraminer", "friulano", "ribolla gialla"];

/**
 * No hardcoded pairings per wine type — that produces nonsense
 * (not every red goes with steak). Return empty array so the
 * component renders nothing until real per-product data is provided
 * via Shopify metafield "custom.food_pairing".
 */
function getFoodPairingsForProduct(_product: Product): FoodPairing[] {
  // TODO: parse product metafield "custom.food_pairing" (JSON array)
  // when available in the Shopify data model. Until then, show nothing.
  return [];
}

/**
 * Serving temperature based on wine type AND body/grape variety,
 * not just a blanket "16-18°C for all reds".
 */
function getServingTemperature(product: Product): string {
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
