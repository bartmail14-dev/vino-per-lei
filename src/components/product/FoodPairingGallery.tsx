"use client";

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

  return (
    <div className={cn("", className)}>
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2">
          Lekker bij
        </h2>
        <p className="text-grey text-sm sm:text-base">
          Perfecte combinaties
        </p>
      </div>

      {/* Food Cards Grid - 3 columns on mobile for compact display */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-10">
        {pairings.map((pairing, index) => (
          <motion.div
            key={pairing.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default border border-sand/30">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-champagne/50 flex items-center justify-center group-hover:bg-wine/10 transition-colors">
                <pairing.icon className="w-5 h-5 sm:w-6 sm:h-6 text-wine" />
              </div>
              <h3 className="font-medium text-charcoal text-xs sm:text-sm">
                {pairing.name}
              </h3>
              {/* Description hidden on mobile */}
              <p className="hidden sm:block text-xs text-grey opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                {pairing.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Serving Info - Compact on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {/* Temperature */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-sand/30 flex items-center gap-2 sm:gap-4"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
            <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-wine" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-charcoal text-xs sm:text-base truncate">Temperatuur</h4>
            <p className="text-lg sm:text-2xl font-semibold text-wine">{servingTemp}</p>
          </div>
        </motion.div>

        {/* Decant Time */}
        {decantTime && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-sand/30 flex items-center gap-2 sm:gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
              <Wine className="w-5 h-5 sm:w-6 sm:h-6 text-wine" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-charcoal text-xs sm:text-base truncate">Decanteren</h4>
              <p className="text-sm sm:text-lg text-charcoal">30-60 min</p>
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
