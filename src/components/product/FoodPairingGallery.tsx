"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThermometerIcon } from "@/components/icons";
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
            <ThermometerIcon className="w-5 h-5 sm:w-6 sm:h-6 text-wine" />
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
              <DecantIcon className="w-5 h-5 sm:w-6 sm:h-6 text-wine" />
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
      { name: "Biefstuk", icon: SteakIcon, description: "Gegrild of gebakken" },
      { name: "Lamsvlees", icon: LambIcon, description: "Met rozemarijn" },
      { name: "Wild", icon: GameIcon, description: "Hert of wild zwijn" },
      { name: "Kaas", icon: CheeseIcon, description: "Gerijpte kazen" },
      { name: "Pasta", icon: PastaIcon, description: "Met vleessaus" },
      { name: "Chocolade", icon: ChocolateIcon, description: "Puur 70%+" },
    ],
    white: [
      { name: "Vis", icon: FishIcon, description: "Gegrild of gestoomd" },
      { name: "Zeevruchten", icon: ShrimpIcon, description: "Verse schaaldieren" },
      { name: "Kip", icon: ChickenIcon, description: "Met citroensaus" },
      { name: "Pasta", icon: PastaIcon, description: "Romige sauzen" },
      { name: "Kaas", icon: CheeseIcon, description: "Zachte geitenkaas" },
      { name: "Salade", icon: SaladIcon, description: "Met gegrilde groenten" },
    ],
    rose: [
      { name: "Salade", icon: SaladIcon, description: "Mediterraans" },
      { name: "Vis", icon: FishIcon, description: "Licht bereid" },
      { name: "Tapas", icon: TapasIcon, description: "Gemengde hapjes" },
      { name: "Kaas", icon: CheeseIcon, description: "Zachte kazen" },
      { name: "Fruit", icon: FruitIcon, description: "Verse desserts" },
      { name: "BBQ", icon: BBQIcon, description: "Gegrilde groenten" },
    ],
    sparkling: [
      { name: "Oesters", icon: OysterIcon, description: "Vers geserveerd" },
      { name: "Sushi", icon: SushiIcon, description: "Verse rollen" },
      { name: "Kaas", icon: CheeseIcon, description: "Brie & Camembert" },
      { name: "Hapjes", icon: TapasIcon, description: "Aperitief bites" },
      { name: "Fruit", icon: FruitIcon, description: "Aardbeien" },
      { name: "Dessert", icon: DessertIcon, description: "Lichte taarten" },
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

function DecantIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2L8 6L4 12V20C4 21 5 22 6 22H18C19 22 20 21 20 20V12L16 6V2" />
      <path d="M8 2H16" strokeLinecap="round" />
      <path d="M6 14H18" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function SteakIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="10" ry="6" />
      <path d="M6 12C6 12 8 10 12 10C16 10 18 12 18 12" strokeLinecap="round" />
    </svg>
  );
}

function LambIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 18L8 8L16 8L20 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8V4" strokeLinecap="round" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  );
}

function GameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 4L8 8H4L8 14L4 20H20L16 14L20 8H16L12 4Z" strokeLinejoin="round" />
    </svg>
  );
}

function CheeseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12L12 2L22 12V20C22 21 21 22 20 22H4C3 22 2 21 2 20V12Z" />
      <circle cx="8" cy="16" r="1.5" />
      <circle cx="14" cy="14" r="1" />
      <circle cx="10" cy="11" r="1" />
    </svg>
  );
}

function PastaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 16C4 16 8 20 12 20C16 20 20 16 20 16" strokeLinecap="round" />
      <path d="M4 12C4 12 8 16 12 16C16 16 20 12 20 12" strokeLinecap="round" />
      <path d="M4 8C4 8 8 12 12 12C16 12 20 8 20 8" strokeLinecap="round" />
      <path d="M4 4H20" strokeLinecap="round" />
    </svg>
  );
}

function ChocolateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M9 6V18" />
      <path d="M15 6V18" />
      <path d="M3 12H21" />
    </svg>
  );
}

function FishIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12C2 12 5 6 12 6C19 6 22 12 22 12C22 12 19 18 12 18C5 18 2 12 2 12Z" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
      <path d="M2 12L5 9V15L2 12Z" />
    </svg>
  );
}

function ShrimpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 4C14 4 12 8 12 12C12 16 14 20 18 20" strokeLinecap="round" />
      <path d="M12 12C8 12 4 10 4 10" strokeLinecap="round" />
      <path d="M12 14C9 14 5 16 5 16" strokeLinecap="round" />
    </svg>
  );
}

function ChickenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 16L4 20" strokeLinecap="round" />
      <ellipse cx="14" cy="12" rx="6" ry="8" />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function SaladIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12C4 16 8 20 12 20C16 20 20 16 20 12H4Z" />
      <path d="M8 8C8 8 10 10 12 10C14 10 16 8 16 8" strokeLinecap="round" />
      <path d="M6 10C7 9 9 8 12 8C15 8 17 9 18 10" strokeLinecap="round" />
    </svg>
  );
}

function TapasIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="8" r="3" />
      <circle cx="17" cy="8" r="3" />
      <circle cx="12" cy="16" r="3" />
      <path d="M7 11V20" strokeLinecap="round" />
      <path d="M17 11V20" strokeLinecap="round" />
    </svg>
  );
}

function FruitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="14" r="8" />
      <path d="M12 6V2" strokeLinecap="round" />
      <path d="M12 6C14 6 16 4 16 4" strokeLinecap="round" />
    </svg>
  );
}

function BBQIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="14" r="8" />
      <path d="M8 18L6 22" strokeLinecap="round" />
      <path d="M16 18L18 22" strokeLinecap="round" />
      <path d="M6 12H18" strokeLinecap="round" />
      <path d="M8 8V10" strokeLinecap="round" />
      <path d="M12 8V10" strokeLinecap="round" />
      <path d="M16 8V10" strokeLinecap="round" />
    </svg>
  );
}

function OysterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12C4 8 8 4 12 4C16 4 20 8 20 12C20 16 16 18 12 18C8 18 4 16 4 12Z" />
      <ellipse cx="12" cy="12" rx="4" ry="2" />
    </svg>
  );
}

function SushiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="16" rx="8" ry="4" />
      <ellipse cx="12" cy="12" rx="8" ry="4" />
      <path d="M4 12V16" />
      <path d="M20 12V16" />
    </svg>
  );
}

function DessertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 16L8 8L12 12L16 8L20 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16C4 18 8 20 12 20C16 20 20 18 20 16" />
      <circle cx="12" cy="6" r="2" />
    </svg>
  );
}
