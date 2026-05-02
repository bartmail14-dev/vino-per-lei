"use client";

import { useCallback, useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ItalyMap from "@svg-maps/italy";
import { cn } from "@/lib/utils";

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

export interface WineRegionData {
  id: string;
  displayName: string;
  slug: string;
  famousWines: string[];
  active: boolean;
}

const svgRegionSlugs: Record<string, string> = {
  piedmont: "piemonte",
  lombardy: "lombardia",
  "trentino-south-tyrol": "alto-adige",
  veneto: "veneto",
  "friuli-venezia-giulia": "friuli-venezia-giulia",
  "emilia-romagna": "emilia-romagna",
  tuscany: "toscana",
  liguria: "liguria",
  "aosta-valley": "valle-d-aosta",
  umbria: "umbria",
  marche: "marche",
  lazio: "lazio",
  abruzzo: "abruzzo",
  campania: "campania",
  apulia: "puglia",
  basilicata: "basilicata",
  calabria: "calabria",
  sicily: "sicilia",
  sardinia: "sardegna",
  molise: "molise",
};

export interface ItalyWineMapProps {
  className?: string;
  onRegionClick?: (region: WineRegionData) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  selectedRegion?: string | null;
  activeRegionSlugs?: string[];
}

function toRegionData(location: MapLocation, activeRegionSlugs?: string[]): WineRegionData {
  const slug = svgRegionSlugs[location.id] ?? location.id;
  return {
    id: location.id,
    displayName: location.name,
    slug,
    famousWines: [],
    active: activeRegionSlugs ? activeRegionSlugs.includes(slug) : false,
  };
}

export function ItalyWineMap({
  className,
  onRegionClick,
  interactive = true,
  size = "md",
  selectedRegion = null,
  activeRegionSlugs,
}: ItalyWineMapProps) {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<WineRegionData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const isRegionActive = useCallback(
    (location: MapLocation): boolean => toRegionData(location, activeRegionSlugs).active,
    [activeRegionSlugs]
  );

  const handleRegionClick = useCallback(
    (location: MapLocation) => {
      const region = toRegionData(location, activeRegionSlugs);
      if (!region.active) return;

      if (onRegionClick) {
        onRegionClick(region);
      } else {
        router.push(`/wijnen?region=${region.slug}`);
      }
    },
    [activeRegionSlugs, onRegionClick, router]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGPathElement>, location: MapLocation) => {
      const region = toRegionData(location, activeRegionSlugs);
      if (!region.active) return;

      const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
      setHoveredRegion(region);
    },
    [activeRegionSlugs]
  );

  const sizes = {
    sm: "max-w-[200px]",
    md: "max-w-[320px]",
    lg: "max-w-[400px]",
    full: "w-full max-w-[500px]",
  };

  const getRegionFill = (location: MapLocation, isHovered: boolean) => {
    const region = toRegionData(location, activeRegionSlugs);
    const isSelected = region.slug === selectedRegion;
    if (!region.active) return "#e8e0d5";
    if (isSelected || isHovered) return "url(#wine-region-gradient)";
    return "#f5e6c8";
  };

  const getRegionStroke = (location: MapLocation, isHovered: boolean) => {
    const region = toRegionData(location, activeRegionSlugs);
    const isSelected = region.slug === selectedRegion;
    if (!region.active) return "#d4cfc5";
    if (isSelected || isHovered) return "#c9a227";
    return "#1a1f3d";
  };

  return (
    <div className={cn("relative mx-auto", sizes[size], className)}>
      <svg
        viewBox={ItalyMap.viewBox}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        <defs>
          <linearGradient id="wine-region-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d3454" />
            <stop offset="100%" stopColor="#1a1f3d" />
          </linearGradient>
        </defs>

        {(ItalyMap.locations as MapLocation[]).map((location) => {
          const region = toRegionData(location, activeRegionSlugs);
          const isHovered = hoveredRegion?.id === location.id;
          const isActive = isRegionActive(location);

          return (
            <motion.path
              key={location.id}
              d={location.path}
              fill={getRegionFill(location, isHovered)}
              stroke={getRegionStroke(location, isHovered)}
              strokeWidth={isHovered && isActive ? 2 : 1}
              className={cn("transition-colors duration-200", interactive && isActive && "cursor-pointer", !isActive && "opacity-70")}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => {
                if (interactive && isActive) setHoveredRegion(region);
              }}
              onMouseLeave={() => {
                if (interactive) setHoveredRegion(null);
              }}
              onMouseMove={(event) => interactive && handleMouseMove(event, location)}
              onClick={() => interactive && handleRegionClick(location)}
              role={interactive && isActive ? "button" : undefined}
              aria-label={region.displayName}
              tabIndex={interactive && isActive ? 0 : -1}
              onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && isActive) {
                  handleRegionClick(location);
                }
              }}
            />
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredRegion && interactive && hoveredRegion.active && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{ left: Math.min(tooltipPosition.x + 15, 280), top: tooltipPosition.y - 10 }}
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-sand p-3 min-w-[160px]">
              <h4 className="font-serif font-semibold text-charcoal">{hoveredRegion.displayName}</h4>
            </div>
            <div className="absolute -left-1.5 top-4 w-3 h-3 bg-white border-l border-b border-sand rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const wineRegionData: Record<string, WineRegionData> = {};
