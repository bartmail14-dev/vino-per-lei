"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ItalyMap from "@svg-maps/italy";

// Type for SVG map location
interface MapLocation {
  id: string;
  name: string;
  path: string;
}

// Wine region data mapped to official SVG region IDs
// Only Northern Italy + Tuscany are active (client preference)
interface WineRegionData {
  id: string; // SVG map ID
  displayName: string;
  slug: string;
  famousWines: string[];
  active: boolean; // Whether this region is part of our selection
}

// Northern regions + Tuscany that we sell
const ACTIVE_REGIONS = new Set([
  "piedmont",
  "lombardy",
  "trentino-south-tyrol",
  "veneto",
  "friuli-venezia-giulia",
  "emilia-romagna",
  "liguria",
  "aosta-valley",
  "tuscany",
]);

const wineRegionData: Record<string, WineRegionData> = {
  piedmont: {
    id: "piedmont",
    displayName: "Piemonte",
    slug: "piemonte",
    famousWines: ["Barolo", "Barbaresco", "Barbera d'Alba", "Nebbiolo"],
    active: true,
  },
  lombardy: {
    id: "lombardy",
    displayName: "Lombardia",
    slug: "lombardia",
    famousWines: ["Franciacorta", "Valtellina", "Oltrepò Pavese"],
    active: true,
  },
  "trentino-south-tyrol": {
    id: "trentino-south-tyrol",
    displayName: "Alto Adige",
    slug: "alto-adige",
    famousWines: ["Pinot Grigio", "Gewürztraminer", "Lagrein"],
    active: true,
  },
  veneto: {
    id: "veneto",
    displayName: "Veneto",
    slug: "veneto",
    famousWines: ["Amarone", "Valpolicella Ripasso", "Prosecco", "Soave"],
    active: true,
  },
  "friuli-venezia-giulia": {
    id: "friuli-venezia-giulia",
    displayName: "Friuli",
    slug: "friuli",
    famousWines: ["Pinot Grigio", "Friulano", "Ribolla Gialla"],
    active: true,
  },
  "emilia-romagna": {
    id: "emilia-romagna",
    displayName: "Emilia-Romagna",
    slug: "emilia-romagna",
    famousWines: ["Lambrusco", "Sangiovese di Romagna"],
    active: true,
  },
  tuscany: {
    id: "tuscany",
    displayName: "Toscana",
    slug: "toscana",
    famousWines: ["Chianti Classico", "Brunello di Montalcino", "Super Tuscans"],
    active: true,
  },
  liguria: {
    id: "liguria",
    displayName: "Liguria",
    slug: "liguria",
    famousWines: ["Cinque Terre", "Pigato"],
    active: true,
  },
  "aosta-valley": {
    id: "aosta-valley",
    displayName: "Valle d'Aosta",
    slug: "valle-daosta",
    famousWines: ["Petit Rouge", "Fumin"],
    active: true,
  },
  // Southern regions - not active
  umbria: {
    id: "umbria",
    displayName: "Umbria",
    slug: "umbria",
    famousWines: ["Sagrantino di Montefalco", "Orvieto"],
    active: false,
  },
  marche: {
    id: "marche",
    displayName: "Marche",
    slug: "marche",
    famousWines: ["Verdicchio", "Rosso Conero"],
    active: false,
  },
  lazio: {
    id: "lazio",
    displayName: "Lazio",
    slug: "lazio",
    famousWines: ["Frascati", "Est! Est!! Est!!!"],
    active: false,
  },
  abruzzo: {
    id: "abruzzo",
    displayName: "Abruzzo",
    slug: "abruzzo",
    famousWines: ["Montepulciano d'Abruzzo", "Trebbiano d'Abruzzo"],
    active: false,
  },
  campania: {
    id: "campania",
    displayName: "Campania",
    slug: "campania",
    famousWines: ["Taurasi", "Fiano di Avellino", "Greco di Tufo"],
    active: false,
  },
  apulia: {
    id: "apulia",
    displayName: "Puglia",
    slug: "puglia",
    famousWines: ["Primitivo", "Negroamaro", "Nero di Troia"],
    active: false,
  },
  basilicata: {
    id: "basilicata",
    displayName: "Basilicata",
    slug: "basilicata",
    famousWines: ["Aglianico del Vulture"],
    active: false,
  },
  calabria: {
    id: "calabria",
    displayName: "Calabria",
    slug: "calabria",
    famousWines: ["Cirò"],
    active: false,
  },
  sicily: {
    id: "sicily",
    displayName: "Sicilia",
    slug: "sicilia",
    famousWines: ["Nero d'Avola", "Etna Rosso", "Marsala"],
    active: false,
  },
  sardinia: {
    id: "sardinia",
    displayName: "Sardegna",
    slug: "sardegna",
    famousWines: ["Cannonau", "Vermentino di Sardegna"],
    active: false,
  },
  molise: {
    id: "molise",
    displayName: "Molise",
    slug: "molise",
    famousWines: ["Tintilia"],
    active: false,
  },
};

export interface ItalyWineMapProps {
  className?: string;
  onRegionClick?: (region: WineRegionData) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  selectedRegion?: string | null; // slug of selected region
}

export function ItalyWineMap({
  className,
  onRegionClick,
  interactive = true,
  size = "md",
  selectedRegion = null,
}: ItalyWineMapProps) {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<WineRegionData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleRegionClick = useCallback(
    (regionId: string) => {
      const region = wineRegionData[regionId];
      if (!region || !region.active) return;

      if (onRegionClick) {
        onRegionClick(region);
      } else {
        router.push(`/wijnen?region=${region.slug}`);
      }
    },
    [onRegionClick, router]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, regionId: string) => {
      const region = wineRegionData[regionId];
      if (!region) return;

      const rect = (e.currentTarget as SVGElement).ownerSVGElement?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      setHoveredRegion(region);
    },
    []
  );

  const sizes = {
    sm: "max-w-[200px]",
    md: "max-w-[320px]",
    lg: "max-w-[400px]",
    full: "w-full max-w-[500px]",
  };

  const getRegionFill = (regionId: string, isHovered: boolean) => {
    const region = wineRegionData[regionId];
    const isActive = region?.active || false;
    const isSelected = region?.slug === selectedRegion;

    if (!isActive) return "#e8e0d5"; // Sand color for inactive southern regions (visible but muted)

    if (isSelected) {
      return "url(#wine-region-gradient)"; // Wine gradient for selected
    }

    if (isHovered) {
      return "url(#wine-region-gradient)";
    }

    return "#f5e6c8"; // Champagne color for active regions
  };

  const getRegionStroke = (regionId: string, isHovered: boolean) => {
    const region = wineRegionData[regionId];
    const isActive = region?.active || false;
    const isSelected = region?.slug === selectedRegion;

    if (!isActive) return "#d4cfc5"; // Visible border for inactive

    if (isSelected) {
      return "#c9a227"; // Gold for selected
    }

    if (isHovered) {
      return "#c9a227"; // Gold on hover
    }

    return "#1a1f3d"; // Navy color for active regions
  };

  return (
    <div className={cn("relative mx-auto", sizes[size], className)}>
      <svg
        viewBox={ItalyMap.viewBox}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Interactieve kaart van Italiaanse wijnregio's"
        role="img"
      >
        {/* Definitions */}
        <defs>
          <linearGradient
            id="wine-region-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#2d3454" />
            <stop offset="100%" stopColor="#1a1f3d" />
          </linearGradient>

        </defs>

        {/* Render all regions from official SVG map */}
        {(ItalyMap.locations as MapLocation[]).map((location) => {
          const regionData = wineRegionData[location.id];
          const isHovered = hoveredRegion?.id === location.id;
          const isActive = regionData?.active || false;

          return (
            <motion.path
              key={location.id}
              d={location.path}
              fill={getRegionFill(location.id, isHovered)}
              stroke={getRegionStroke(location.id, isHovered)}
              strokeWidth={isHovered && isActive ? 2 : 1}
              className={cn(
                "transition-colors duration-200",
                interactive && isActive && "cursor-pointer",
                !isActive && "opacity-70"
              )}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => {
                if (interactive && regionData && isActive) {
                  setHoveredRegion(regionData);
                }
              }}
              onMouseLeave={() => {
                if (interactive) {
                  setHoveredRegion(null);
                }
              }}
              onMouseMove={(e) => interactive && isActive && handleMouseMove(e, location.id)}
              onClick={() => interactive && handleRegionClick(location.id)}
              role={interactive && isActive ? "button" : undefined}
              aria-label={regionData ? `${regionData.displayName} wijnregio` : location.name}
              tabIndex={interactive && isActive ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && isActive) {
                  handleRegionClick(location.id);
                }
              }}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredRegion && interactive && hoveredRegion.active && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: Math.min(tooltipPosition.x + 15, 280),
              top: tooltipPosition.y - 10,
            }}
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-sand p-3 min-w-[180px]">
              {/* Header */}
              <div className="mb-2">
                <h4 className="font-serif font-semibold text-charcoal">
                  {hoveredRegion.displayName}
                </h4>
              </div>

              {/* Famous wines */}
              <p className="text-xs text-grey mb-2">
                {hoveredRegion.famousWines.slice(0, 3).join(" · ")}
              </p>

              {/* CTA hint */}
              <p className="text-xs text-wine font-medium flex items-center gap-1">
                <span>Klik om te ontdekken</span>
                <ChevronRightIcon className="w-3 h-3" />
              </p>
            </div>

            {/* Arrow */}
            <div className="absolute -left-1.5 top-4 w-3 h-3 bg-white border-l border-b border-sand transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Export region data for use elsewhere
export { wineRegionData };
export type { WineRegionData };
