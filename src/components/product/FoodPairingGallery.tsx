"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Beef,
  Fish,
  Shrimp,
  Shell,
  Salad,
  Drumstick,
  Grape,
  CakeSlice,
  Wine,
  Candy,
  Soup,
  UtensilsCrossed,
  Thermometer,
} from "lucide-react";
import { TbCheese, TbDeer, TbMeat, TbGrill, TbBowlChopsticks } from "react-icons/tb";
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
  const pairings = getFoodPairingsForWineType(product.wineType);
  const servingTemp = getServingTemperature(product.wineType);
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
          Lekker bij
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-grey text-sm sm:text-base"
        >
          Ontdek de perfecte combinaties voor deze wijn
        </motion.p>
      </div>

      {/* Food Cards Grid - Larger, more visual */}
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
                "bg-white rounded-lg sm:rounded-2xl p-3 sm:p-5 text-center",
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

// Helper functions
function getFoodPairingsForWineType(wineType: string): FoodPairing[] {
  const pairings: Record<string, FoodPairing[]> = {
    red: [
      { name: "Biefstuk", icon: Beef, description: "Gegrild of gebakken" },
      { name: "Lamsvlees", icon: TbMeat, description: "Met rozemarijn" },
      { name: "Wild", icon: TbDeer, description: "Hert of wild zwijn" },
      { name: "Kaas", icon: TbCheese, description: "Gerijpte kazen" },
      { name: "Pasta", icon: Soup, description: "Met vleessaus" },
      { name: "Chocolade", icon: Candy, description: "Puur 70%+" },
    ],
    white: [
      { name: "Vis", icon: Fish, description: "Gegrild of gestoomd" },
      { name: "Zeevruchten", icon: Shrimp, description: "Verse schaaldieren" },
      { name: "Kip", icon: Drumstick, description: "Met citroensaus" },
      { name: "Pasta", icon: Soup, description: "Romige sauzen" },
      { name: "Kaas", icon: TbCheese, description: "Zachte geitenkaas" },
      { name: "Salade", icon: Salad, description: "Met gegrilde groenten" },
    ],
    rose: [
      { name: "Salade", icon: Salad, description: "Mediterraans" },
      { name: "Vis", icon: Fish, description: "Licht bereid" },
      { name: "Tapas", icon: UtensilsCrossed, description: "Gemengde hapjes" },
      { name: "Kaas", icon: TbCheese, description: "Zachte kazen" },
      { name: "Fruit", icon: Grape, description: "Verse desserts" },
      { name: "BBQ", icon: TbGrill, description: "Gegrilde groenten" },
    ],
    sparkling: [
      { name: "Oesters", icon: Shell, description: "Vers geserveerd" },
      { name: "Sushi", icon: TbBowlChopsticks, description: "Verse rollen" },
      { name: "Kaas", icon: TbCheese, description: "Brie & Camembert" },
      { name: "Hapjes", icon: UtensilsCrossed, description: "Aperitief bites" },
      { name: "Fruit", icon: Grape, description: "Aardbeien" },
      { name: "Dessert", icon: CakeSlice, description: "Lichte taarten" },
    ],
  };

  return pairings[wineType] || pairings.red;
}

function getServingTemperature(wineType: string): string {
  switch (wineType) {
    case "red": return "16-18°C";
    case "white": return "8-10°C";
    case "rose": return "8-10°C";
    case "sparkling": return "6-8°C";
    default: return "12-14°C";
  }
}

function getDecantTime(wineType: string): string | null {
  switch (wineType) {
    case "red": return "30-60 minuten voor serveren";
    default: return null;
  }
}
