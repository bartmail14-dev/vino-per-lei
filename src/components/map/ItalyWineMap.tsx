"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { wineRegions, type WineRegion } from "@/data/wineRegions";
import { regionPaths, italyOutline, sardiniaPath } from "./italy-svg-paths";

export interface ItalyWineMapProps {
  className?: string;
  onRegionClick?: (region: WineRegion) => void;
  showLegend?: boolean;
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  showLabels?: boolean;
}

export function ItalyWineMap({
  className,
  onRegionClick,
  showLegend = true,
  interactive = true,
  size = "md",
  showLabels = false,
}: ItalyWineMapProps) {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<WineRegion | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleRegionClick = useCallback(
    (region: WineRegion) => {
      if (!region.wineCount) return;

      if (onRegionClick) {
        onRegionClick(region);
      } else {
        router.push(`/wijnen?region=${region.slug}`);
      }
    },
    [onRegionClick, router]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, region: WineRegion) => {
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
    lg: "max-w-[480px]",
    full: "w-full max-w-[600px]",
  };

  return (
    <div className={cn("relative mx-auto", sizes[size], className)}>
      <svg
        viewBox="0 0 340 580"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Interactieve kaart van Italiaanse wijnregio's"
        role="img"
      >
        {/* Definitions */}
        <defs>
          {/* Wine gradient for hover */}
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

          {/* Gold border gradient */}
          <linearGradient
            id="gold-border-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#d4b84a" />
            <stop offset="100%" stopColor="#c9a227" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="region-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>

          {/* Glow effect */}
          <filter id="region-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Italy outline */}
        <path
          d={italyOutline}
          fill="#f5f0e8"
          stroke="#e8e0d5"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Sardinia (non-interactive background) */}
        <path
          d={sardiniaPath}
          fill="#f5f0e8"
          stroke="#e8e0d5"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Wine Regions */}
        <g id="wine-regions">
          {wineRegions.map((region) => {
            const path = regionPaths[region.id];
            if (!path) return null;

            const isHovered = hoveredRegion?.id === region.id;
            const hasStock = region.wineCount > 0;

            return (
              <motion.path
                key={region.id}
                d={path}
                fill={
                  isHovered && hasStock
                    ? "url(#wine-region-gradient)"
                    : hasStock
                    ? "#f5e6c8"
                    : "#e8e0d5"
                }
                stroke={
                  isHovered && hasStock
                    ? "url(#gold-border-gradient)"
                    : hasStock
                    ? "#722f37"
                    : "#d4cfc5"
                }
                strokeWidth={isHovered ? 2.5 : 1.5}
                className={cn(
                  "transition-colors duration-200",
                  interactive && hasStock && "cursor-pointer",
                  !hasStock && "opacity-50"
                )}
                filter={isHovered && hasStock ? "url(#region-glow)" : undefined}
                initial={false}
                animate={{
                  scale: isHovered && hasStock ? 1.02 : 1,
                  y: isHovered && hasStock ? -3 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onMouseEnter={() => interactive && setHoveredRegion(region)}
                onMouseLeave={() => interactive && setHoveredRegion(null)}
                onMouseMove={(e) => interactive && handleMouseMove(e, region)}
                onClick={() => interactive && handleRegionClick(region)}
                role={interactive && hasStock ? "button" : undefined}
                aria-label={`${region.name}: ${region.wineCount} wijnen`}
                tabIndex={interactive && hasStock ? 0 : -1}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && hasStock) {
                    handleRegionClick(region);
                  }
                }}
              />
            );
          })}
        </g>

        {/* Region labels (optional) */}
        {showLabels && (
          <g id="region-labels" className="pointer-events-none">
            {wineRegions
              .filter((r) => r.highlighted && r.wineCount > 0)
              .map((region) => (
                <text
                  key={`label-${region.id}`}
                  x={region.coordinates.x + (region.labelOffset?.x || 0)}
                  y={region.coordinates.y + (region.labelOffset?.y || 0)}
                  textAnchor="middle"
                  className="text-[9px] font-semibold uppercase tracking-wider"
                  fill="#722f37"
                >
                  {region.displayName}
                </text>
              ))}
          </g>
        )}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredRegion && interactive && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: tooltipPosition.x + 15,
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
            <div className="w-4 h-4 rounded bg-[#e8e0d5] border border-[#d4cfc5] opacity-50" />
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
