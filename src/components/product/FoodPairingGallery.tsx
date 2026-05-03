"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUiCopy } from "@/components/providers";
import {
  Wine,
  Thermometer,
} from "lucide-react";
import { getIconForFoodPairing, type FoodPairingIcon } from "@/components/icons/FoodPairingIcons";
import type { Product } from "@/types";

interface FoodPairingGalleryProps {
  product: Product;
  className?: string;
}

interface FoodPairing {
  name: string;
  icon: FoodPairingIcon;
  description: string;
}

export function FoodPairingGallery({ product, className }: FoodPairingGalleryProps) {
  const t = useUiCopy();
  const { pairings } = getFoodPairingsForProduct(product);
  const servingTemp = product.servingTemperature;
  const decantTime = product.decantTime;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hasServingInfo = Boolean(servingTemp || decantTime);

  if (pairings.length === 0 && !hasServingInfo) return null;

  return (
    <div className={cn("", className)}>
      <div className="text-center mb-6 sm:mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2"
        >
          {pairings.length > 0 ? t("product.pairing.title") : t("product.pairing.serving_advice_title")}
        </motion.h2>
        {pairings.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-grey text-sm sm:text-base"
          >
            {t("product.pairing.subtitle")}
          </motion.p>
        )}
      </div>

      {/* Food Cards Grid */}
      {pairings.length > 0 && (
        <div className="-mx-4 mb-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6 sm:mb-12">
          {pairings.map((pairing, index) => (
            <motion.div
              key={pairing.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group min-w-[118px] snap-start sm:min-w-0"
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
                  "bg-white rounded-2xl p-3.5 sm:p-5 text-center",
                  "shadow-[0_16px_34px_-28px_rgba(26,31,61,0.55)] border border-sand/40",
                  "transition-shadow duration-300",
                  hoveredIndex === index && "shadow-xl shadow-wine/8 border-wine/15"
                )}
              >
                {/* Icon with background */}
                <div className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2.5 sm:mb-3 rounded-full flex items-center justify-center transition-all duration-300 ring-1 ring-gold/15",
                  hoveredIndex === index
                    ? "bg-wine text-white scale-110"
                    : "bg-gradient-to-br from-champagne/60 to-white text-wine"
                )}>
                  <pairing.icon className="w-5 h-5 sm:w-6 sm:h-6" weight="duotone" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        {/* Temperature */}
        {servingTemp ? (
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
                <h4 className="font-medium text-grey text-xs sm:text-sm mb-0.5">{t("product.serving_temperature.title")}</h4>
                <p className="text-xl sm:text-2xl font-bold text-wine leading-tight">{servingTemp}</p>
              </div>
            </div>
          </motion.div>
        ) : null}

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
                <h4 className="font-medium text-grey text-xs sm:text-sm mb-0.5">{t("product.decant.title")}</h4>
                <p className="text-base sm:text-lg font-semibold text-charcoal leading-tight">{decantTime}</p>
                {product.decantNote && (<p className="text-xs text-grey mt-0.5 hidden sm:block">{product.decantNote}</p>)}
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Use real metafield data when available (custom.food_pairing).
 */
function getFoodPairingsForProduct(product: Product): { pairings: FoodPairing[]; isFallback: boolean } {
  if (!product.foodPairing || product.foodPairing.length === 0) {
    return { pairings: [], isFallback: false };
  }

  return {
    pairings: product.foodPairing.map((name) => ({
      name,
      icon: getIconForFoodPairing(name),
      description: "",
    })),
    isFallback: false,
  };
}
