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

// Food pairing icons — clear, recognizable illustrations

function DecantIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Wine decanter/karaf */}
      <path d="M10 2H14V6L18 12V19C18 20.5 16.5 22 15 22H9C7.5 22 6 20.5 6 19V12L10 6V2Z" strokeLinejoin="round" />
      <path d="M10 2H14" strokeLinecap="round" />
      <path d="M7 14H17" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function SteakIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* T-bone steak shape */}
      <path d="M4 8C4 8 5 4 10 4C13 4 14 6 16 6C19 6 21 8 21 11C21 14 19 18 15 19C11 20 8 19 6 17C4 15 3 12 4 8Z" strokeLinejoin="round" />
      {/* Bone */}
      <path d="M10 8V16" strokeLinecap="round" strokeWidth="2" opacity="0.4" />
      {/* Grill marks */}
      <path d="M13 9L17 13" strokeLinecap="round" opacity="0.3" />
      <path d="M13 12L16 15" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function LambIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Lamb chop / rack of lamb */}
      <path d="M6 6C6 6 4 10 4 14C4 18 7 20 10 20C13 20 15 18 15 15C15 12 13 10 13 8C13 6 14 4 14 4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bone sticking out */}
      <path d="M14 4L19 2" strokeLinecap="round" strokeWidth="2" />
      <circle cx="20" cy="2" r="1.5" fill="none" />
      {/* Rosemary sprig */}
      <path d="M17 14L20 11" strokeLinecap="round" opacity="0.5" />
      <path d="M18 13L19.5 12" strokeLinecap="round" opacity="0.5" />
      <path d="M18.5 14.5L20 13.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function GameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Deer/stag head silhouette */}
      <path d="M12 22V14" strokeLinecap="round" />
      <path d="M8 14C8 14 6 12 6 10C6 8 8 6 10 6C11 6 12 7 12 8C12 7 13 6 14 6C16 6 18 8 18 10C18 12 16 14 16 14" strokeLinecap="round" strokeLinejoin="round" />
      {/* Antlers */}
      <path d="M8 7L5 3" strokeLinecap="round" />
      <path d="M5 3L3 4" strokeLinecap="round" />
      <path d="M5 3L4 1" strokeLinecap="round" />
      <path d="M16 7L19 3" strokeLinecap="round" />
      <path d="M19 3L21 4" strokeLinecap="round" />
      <path d="M19 3L20 1" strokeLinecap="round" />
    </svg>
  );
}

function CheeseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Cheese wedge */}
      <path d="M2 20L2 10L22 6V20H2Z" strokeLinejoin="round" />
      <path d="M2 10L22 6" strokeLinecap="round" />
      {/* Cheese holes */}
      <circle cx="8" cy="16" r="1.5" />
      <circle cx="14" cy="14" r="1" />
      <circle cx="18" cy="16" r="1.2" />
      <circle cx="6" cy="12" r="0.8" />
    </svg>
  );
}

function PastaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Bowl */}
      <path d="M3 12C3 16.5 7 20 12 20C17 20 21 16.5 21 12H3Z" strokeLinejoin="round" />
      {/* Spaghetti/noodles curling above */}
      <path d="M7 12C7 9 9 7 11 8C13 9 11 11 13 10C15 9 16 7 14 6" strokeLinecap="round" fill="none" />
      <path d="M11 12C11 10 13 8.5 15 9.5C17 10.5 15 12 17 11" strokeLinecap="round" fill="none" />
      {/* Fork */}
      <path d="M18 4V8" strokeLinecap="round" opacity="0.4" />
      <path d="M19 4V7" strokeLinecap="round" opacity="0.4" />
      <path d="M20 4V8" strokeLinecap="round" opacity="0.4" />
      <path d="M19 8V12" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function ChocolateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Chocolate bar with wrapper peeled */}
      <rect x="4" y="6" width="16" height="14" rx="1" />
      {/* Grid pattern (chocolate squares) */}
      <path d="M9.3 6V20" opacity="0.5" />
      <path d="M14.6 6V20" opacity="0.5" />
      <path d="M4 10.7H20" opacity="0.5" />
      <path d="M4 15.3H20" opacity="0.5" />
      {/* Wrapper fold at top */}
      <path d="M4 6L6 2H18L20 6" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

function FishIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Fish body */}
      <path d="M3 12C3 12 6 6 13 6C18 6 21 9 21 12C21 15 18 18 13 18C6 18 3 12 3 12Z" strokeLinejoin="round" />
      {/* Tail */}
      <path d="M3 12L1 8" strokeLinecap="round" />
      <path d="M3 12L1 16" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="17" cy="11" r="1" fill="currentColor" />
      {/* Fin */}
      <path d="M10 9C11 7 13 7 13 7" strokeLinecap="round" opacity="0.4" />
      {/* Scale lines */}
      <path d="M8 12C9 11 10 11 11 12" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function ShrimpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Shrimp curved body */}
      <path d="M19 4C19 4 21 6 21 8C21 10 19 12 17 13C15 14 13 15 12 17C11 19 10 20 8 20" strokeLinecap="round" strokeLinejoin="round" />
      {/* Segments */}
      <path d="M17 8L15 10" strokeLinecap="round" opacity="0.4" />
      <path d="M15 10L13 12" strokeLinecap="round" opacity="0.4" />
      <path d="M13 13L11 15" strokeLinecap="round" opacity="0.4" />
      {/* Legs */}
      <path d="M16 11L14 14" strokeLinecap="round" opacity="0.5" />
      <path d="M14 12L12 15" strokeLinecap="round" opacity="0.5" />
      <path d="M12 14L10 17" strokeLinecap="round" opacity="0.5" />
      {/* Tail */}
      <path d="M8 20L6 19" strokeLinecap="round" />
      <path d="M8 20L6 21" strokeLinecap="round" />
      {/* Antenna */}
      <path d="M19 4L17 2" strokeLinecap="round" opacity="0.6" />
      <path d="M19 4L21 2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function ChickenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Chicken drumstick */}
      <path d="M8 4C5 4 3 6.5 3 9C3 11.5 5 14 8 14C9 14 10 13.5 10.5 13L16 19" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bone end */}
      <path d="M16 19L18 21" strokeLinecap="round" strokeWidth="2.5" />
      <circle cx="19" cy="21.5" r="1" fill="none" />
      {/* Meat texture */}
      <path d="M5 8C6 7.5 7 8 7 9" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function SaladIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Bowl */}
      <path d="M3 11C3 16 7 20 12 20C17 20 21 16 21 11H3Z" strokeLinejoin="round" />
      {/* Salad leaves sticking up */}
      <path d="M8 11C8 8 6 6 8 5C10 4 10 7 10 7" strokeLinecap="round" fill="none" />
      <path d="M13 11C13 9 12 7 14 6C16 5 15 8 15 8" strokeLinecap="round" fill="none" />
      <path d="M17 11C17 9.5 18 8 17 7" strokeLinecap="round" fill="none" />
      {/* Tomato slice */}
      <circle cx="10" cy="14" r="1.5" opacity="0.4" />
    </svg>
  );
}

function TapasIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Small serving board */}
      <rect x="2" y="14" width="20" height="3" rx="1.5" opacity="0.3" />
      {/* Olive on stick */}
      <path d="M6 14V8" strokeLinecap="round" />
      <circle cx="6" cy="7" r="2" />
      {/* Cheese cube on stick */}
      <path d="M12 14V9" strokeLinecap="round" />
      <rect x="10" y="5" width="4" height="4" rx="0.5" />
      {/* Shrimp/bite on stick */}
      <path d="M18 14V9" strokeLinecap="round" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="18" cy="7" r="0.7" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function FruitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Strawberry */}
      <path d="M12 6C8 6 5 10 5 14C5 18 8 21 12 21C16 21 19 18 19 14C19 10 16 6 12 6Z" strokeLinejoin="round" />
      {/* Stem and leaf */}
      <path d="M12 6V3" strokeLinecap="round" />
      <path d="M9 5C10 3 12 3 12 3C12 3 14 3 15 5" strokeLinecap="round" />
      {/* Seeds */}
      <circle cx="10" cy="12" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="14" cy="11" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="15" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="10" cy="17" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="14" cy="16" r="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function BBQIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Grill top */}
      <path d="M4 12H20" strokeLinecap="round" />
      <path d="M4 12C4 16 7 18 12 18C17 18 20 16 20 12" strokeLinejoin="round" />
      {/* Grill legs */}
      <path d="M8 18L6 22" strokeLinecap="round" />
      <path d="M16 18L18 22" strokeLinecap="round" />
      {/* Grill lines */}
      <path d="M7 12V14" strokeLinecap="round" opacity="0.4" />
      <path d="M10 12V15" strokeLinecap="round" opacity="0.4" />
      <path d="M14 12V15" strokeLinecap="round" opacity="0.4" />
      <path d="M17 12V14" strokeLinecap="round" opacity="0.4" />
      {/* Smoke wisps */}
      <path d="M8 10C8.5 9 8 8 8.5 7" strokeLinecap="round" opacity="0.3" />
      <path d="M12 9C12.5 8 12 7 12.5 6" strokeLinecap="round" opacity="0.3" />
      <path d="M16 10C16.5 9 16 8 16.5 7" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function OysterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Open oyster shell - bottom */}
      <path d="M3 14C3 14 6 18 12 18C18 18 21 14 21 14" strokeLinecap="round" />
      {/* Top shell - wavy edge */}
      <path d="M3 14C3 14 5 10 8 9C11 8 14 8 16 9C19 10 21 14 21 14" strokeLinecap="round" />
      {/* Pearl */}
      <circle cx="12" cy="13" r="2" />
      <circle cx="11.5" cy="12.5" r="0.5" fill="currentColor" opacity="0.3" />
      {/* Shell ridges */}
      <path d="M5 13C7 11 9 10 12 10" strokeLinecap="round" opacity="0.3" />
      <path d="M19 13C17 11 15 10 12 10" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function SushiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Maki roll - cylinder */}
      <ellipse cx="12" cy="8" rx="7" ry="3" />
      <path d="M5 8V16" strokeLinecap="round" />
      <path d="M19 8V16" strokeLinecap="round" />
      <ellipse cx="12" cy="16" rx="7" ry="3" />
      {/* Rice and filling visible from top */}
      <circle cx="12" cy="8" r="2.5" opacity="0.3" />
      <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.3" />
      {/* Chopsticks */}
      <path d="M1 4L8 12" strokeLinecap="round" opacity="0.3" />
      <path d="M3 3L9 11" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function DessertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Cake/tart base */}
      <path d="M4 16H20V19C20 20 19 21 18 21H6C5 21 4 20 4 19V16Z" strokeLinejoin="round" />
      {/* Cake layer */}
      <path d="M4 16C4 13 7 11 12 11C17 11 20 13 20 16" />
      {/* Whipped cream / frosting on top */}
      <path d="M8 11C8 9 9 8 10 8C11 8 11 9 12 9C13 9 13 8 14 8C15 8 16 9 16 11" strokeLinecap="round" />
      {/* Cherry on top */}
      <circle cx="12" cy="7" r="1.5" />
      <path d="M12 5.5V4" strokeLinecap="round" />
    </svg>
  );
}
