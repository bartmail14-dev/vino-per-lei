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
interface WineRegionData {
  id: string; // SVG map ID
  displayName: string;
  slug: string;
  famousWines: string[];
  wineCount: number;
  highlighted: boolean;
}

const wineRegionData: Record<string, WineRegionData> = {
  piedmont: {
    id: "piedmont",
    displayName: "Piemonte",
    slug: "piemonte",
    famousWines: ["Barolo", "Barbaresco", "Barbera d'Alba", "Nebbiolo"],
    wineCount: 3,
    highlighted: true,
  },
  lombardy: {
    id: "lombardy",
    displayName: "Lombardia",
    slug: "lombardia",
    famousWines: ["Franciacorta", "Valtellina", "Oltrepò Pavese"],
    wineCount: 0,
    highlighted: false,
  },
  "trentino-south-tyrol": {
    id: "trentino-south-tyrol",
    displayName: "Alto Adige",
    slug: "alto-adige",
    famousWines: ["Pinot Grigio", "Gewürztraminer", "Lagrein"],
    wineCount: 1,
    highlighted: true,
  },
  veneto: {
    id: "veneto",
    displayName: "Veneto",
    slug: "veneto",
    famousWines: ["Amarone", "Valpolicella Ripasso", "Prosecco", "Soave"],
    wineCount: 2,
    highlighted: true,
  },
  "friuli-venezia-giulia": {
    id: "friuli-venezia-giulia",
    displayName: "Friuli",
    slug: "friuli",
    famousWines: ["Pinot Grigio", "Friulano", "Ribolla Gialla"],
    wineCount: 0,
    highlighted: false,
  },
  "emilia-romagna": {
    id: "emilia-romagna",
    displayName: "Emilia-Romagna",
    slug: "emilia-romagna",
    famousWines: ["Lambrusco", "Sangiovese di Romagna"],
    wineCount: 0,
    highlighted: false,
  },
  tuscany: {
    id: "tuscany",
    displayName: "Toscana",
    slug: "toscana",
    famousWines: ["Chianti Classico", "Brunello di Montalcino", "Super Tuscans"],
    wineCount: 0,
    highlighted: true,
  },
  umbria: {
    id: "umbria",
    displayName: "Umbria",
    slug: "umbria",
    famousWines: ["Sagrantino di Montefalco", "Orvieto"],
    wineCount: 0,
    highlighted: false,
  },
  marche: {
    id: "marche",
    displayName: "Marche",
    slug: "marche",
    famousWines: ["Verdicchio", "Rosso Conero"],
    wineCount: 0,
    highlighted: false,
  },
  lazio: {
    id: "lazio",
    displayName: "Lazio",
    slug: "lazio",
    famousWines: ["Frascati", "Est! Est!! Est!!!"],
    wineCount: 0,
    highlighted: false,
  },
  abruzzo: {
    id: "abruzzo",
    displayName: "Abruzzo",
    slug: "abruzzo",
    famousWines: ["Montepulciano d'Abruzzo", "Trebbiano d'Abruzzo"],
    wineCount: 0,
    highlighted: false,
  },
  campania: {
    id: "campania",
    displayName: "Campania",
    slug: "campania",
    famousWines: ["Taurasi", "Fiano di Avellino", "Greco di Tufo"],
    wineCount: 0,
    highlighted: false,
  },
  apulia: {
    id: "apulia",
    displayName: "Puglia",
    slug: "puglia",
    famousWines: ["Primitivo", "Negroamaro", "Nero di Troia"],
    wineCount: 2,
    highlighted: true,
  },
  basilicata: {
    id: "basilicata",
    displayName: "Basilicata",
    slug: "basilicata",
    famousWines: ["Aglianico del Vulture"],
    wineCount: 0,
    highlighted: false,
  },
  calabria: {
    id: "calabria",
    displayName: "Calabria",
    slug: "calabria",
    famousWines: ["Cirò"],
    wineCount: 0,
    highlighted: false,
  },
  sicily: {
    id: "sicily",
    displayName: "Sicilia",
    slug: "sicilia",
    famousWines: ["Nero d'Avola", "Etna Rosso", "Marsala"],
    wineCount: 0,
    highlighted: true,
  },
  sardinia: {
    id: "sardinia",
    displayName: "Sardegna",
    slug: "sardegna",
    famousWines: ["Cannonau", "Vermentino di Sardegna"],
    wineCount: 0,
    highlighted: false,
  },
  liguria: {
    id: "liguria",
    displayName: "Liguria",
    slug: "liguria",
    famousWines: ["Cinque Terre", "Pigato"],
    wineCount: 0,
    highlighted: false,
  },
  "aosta-valley": {
    id: "aosta-valley",
    displayName: "Valle d'Aosta",
    slug: "valle-daosta",
    famousWines: ["Petit Rouge", "Fumin"],
    wineCount: 0,
    highlighted: false,
  },
  molise: {
    id: "molise",
    displayName: "Molise",
    slug: "molise",
    famousWines: ["Tintilia"],
    wineCount: 0,
    highlighted: false,
  },
};

export interface ItalyWineMapProps {
  className?: string;
  onRegionClick?: (region: WineRegionData) => void;
  showLegend?: boolean;
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "full";
}

export function ItalyWineMap({
  className,
  onRegionClick,
  showLegend = true,
  interactive = true,
  size = "md",
}: ItalyWineMapProps) {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<WineRegionData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleRegionClick = useCallback(
    (regionId: string) => {
      const region = wineRegionData[regionId];
      if (!region || !region.wineCount) return;

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
    if (!region) return "#e8e0d5"; // Unknown region

    if (isHovered && region.wineCount > 0) {
      return "url(#wine-region-gradient)";
    }

    if (region.wineCount > 0) {
      return "#f5e6c8"; // Champagne color for regions with wine
    }

    return "#e8e0d5"; // Sand color for regions without wine
  };

  const getRegionStroke = (regionId: string, isHovered: boolean) => {
    const region = wineRegionData[regionId];
    if (!region) return "#d4cfc5";

    if (isHovered && region.wineCount > 0) {
      return "#c9a227"; // Gold
    }

    if (region.wineCount > 0) {
      return "#722f37"; // Wine color
    }

    return "#d4cfc5";
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
            <stop offset="0%" stopColor="#9b4d55" />
            <stop offset="100%" stopColor="#722f37" />
          </linearGradient>

          <filter id="region-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#722f37" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Render all regions from official SVG map */}
        {(ItalyMap.locations as MapLocation[]).map((location) => {
          const regionData = wineRegionData[location.id];
          const isHovered = hoveredRegion?.id === location.id;
          const hasStock = regionData?.wineCount > 0;

          return (
            <motion.path
              key={location.id}
              d={location.path}
              fill={getRegionFill(location.id, isHovered)}
              stroke={getRegionStroke(location.id, isHovered)}
              strokeWidth={isHovered && hasStock ? 2 : 1}
              className={cn(
                "transition-colors duration-200",
                interactive && hasStock && "cursor-pointer",
                !hasStock && "opacity-60"
              )}
              filter={isHovered && hasStock ? "url(#region-glow)" : undefined}
              initial={false}
              animate={{
                scale: isHovered && hasStock ? 1.01 : 1,
              }}
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => {
                if (interactive && regionData) {
                  setHoveredRegion(regionData);
                }
              }}
              onMouseLeave={() => {
                if (interactive) {
                  setHoveredRegion(null);
                }
              }}
              onMouseMove={(e) => interactive && handleMouseMove(e, location.id)}
              onClick={() => interactive && handleRegionClick(location.id)}
              role={interactive && hasStock ? "button" : undefined}
              aria-label={regionData ? `${regionData.displayName}: ${regionData.wineCount} wijnen` : location.name}
              tabIndex={interactive && hasStock ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && hasStock) {
                  handleRegionClick(location.id);
                }
              }}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredRegion && interactive && (
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
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-serif font-semibold text-charcoal">
                  {hoveredRegion.displayName}
                </h4>
                {hoveredRegion.wineCount > 0 && (
                  <span className="text-xs bg-wine/10 text-wine px-2 py-0.5 rounded-full font-medium">
                    {hoveredRegion.wineCount} wijn
                    {hoveredRegion.wineCount !== 1 && "en"}
                  </span>
                )}
              </div>

              {/* Famous wines */}
              <p className="text-xs text-grey mb-2">
                {hoveredRegion.famousWines.slice(0, 3).join(" · ")}
              </p>

              {/* CTA hint */}
              {hoveredRegion.wineCount > 0 ? (
                <p className="text-xs text-wine font-medium flex items-center gap-1">
                  <span>Klik om te ontdekken</span>
                  <ChevronRightIcon className="w-3 h-3" />
                </p>
              ) : (
                <p className="text-xs text-grey italic">Binnenkort beschikbaar</p>
              )}
            </div>

            {/* Arrow */}
            <div className="absolute -left-1.5 top-4 w-3 h-3 bg-white border-l border-b border-sand transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#f5e6c8] border border-wine" />
            <span className="text-grey">Op voorraad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#e8e0d5] border border-[#d4cfc5] opacity-60" />
            <span className="text-grey">Binnenkort</span>
          </div>
        </div>
      )}
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
