"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface EnhancedTasteProfileProps {
  product: Product;
  className?: string;
}

interface TasteMetric {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  description: string;
}

export function EnhancedTasteProfile({ product, className }: EnhancedTasteProfileProps) {
  const tasteProfile = product.tasteProfile;
  if (!tasteProfile) return null;

  const metrics: TasteMetric[] = getMetricsForWineType(product.wineType, tasteProfile);
  const wineColor = getWineColor(product.wineType);

  return (
    <div className={cn("bg-warm-white rounded-2xl p-4 sm:p-6 lg:p-8", className)}>
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2">
          Smaakprofiel
        </h2>
        <p className="text-grey text-sm sm:text-base">
          {generateTasteDescription(product.wineType, metrics)}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 items-center">
        {/* Radar Chart - Hidden on very small screens, shown on sm+ */}
        <div className="hidden sm:flex justify-center">
          <RadarChart metrics={metrics} wineColor={wineColor} />
        </div>

        {/* Metrics List - More compact on mobile */}
        <div className="space-y-4 sm:space-y-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-grey">{metric.leftLabel}</span>
                <span className="text-xs sm:text-sm font-medium text-charcoal">{metric.label}</span>
                <span className="text-xs sm:text-sm text-grey">{metric.rightLabel}</span>
              </div>

              {/* Progress Bar - Taller on mobile for touch */}
              <div className="relative h-3 sm:h-2 bg-sand rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / 6) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: wineColor }}
                />
              </div>

              {/* Tooltip on hover */}
              <p className="text-xs text-grey mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Radar Chart Component
function RadarChart({ metrics, wineColor }: { metrics: TasteMetric[]; wineColor: string }) {
  const size = 280;
  const center = size / 2;
  const radius = size * 0.4;
  const levels = 6;

  // Calculate points for each metric
  const points = metrics.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const normalizedValue = metric.value / 6;
    return {
      x: center + Math.cos(angle) * radius * normalizedValue,
      y: center + Math.sin(angle) * radius * normalizedValue,
      labelX: center + Math.cos(angle) * (radius + 30),
      labelY: center + Math.sin(angle) * (radius + 30),
      label: metric.label,
    };
  });

  // Create polygon path
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Background circles */}
      {Array.from({ length: levels }).map((_, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={(radius * (i + 1)) / levels}
          fill="none"
          stroke="#e8e0d5"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}

      {/* Axis lines */}
      {metrics.map((_, index) => {
        const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#e8e0d5"
            strokeWidth="1"
          />
        );
      })}

      {/* Filled area */}
      <motion.polygon
        points={polygonPoints}
        fill={wineColor}
        fillOpacity={0.2}
        stroke={wineColor}
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {points.map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={6}
          fill={wineColor}
          stroke="white"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="cursor-pointer hover:r-8"
        />
      ))}

      {/* Labels */}
      {points.map((point, index) => (
        <text
          key={index}
          x={point.labelX}
          y={point.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-charcoal font-medium"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
}

// Helper functions
function getWineColor(wineType: string): string {
  switch (wineType) {
    case "red": return "#1a1f3d";
    case "white": return "#c9a227";
    case "rose": return "#ffa38b";
    case "sparkling": return "#c9a227";
    default: return "#1a1f3d";
  }
}

function getMetricsForWineType(
  wineType: string,
  profile: NonNullable<Product["tasteProfile"]>
): TasteMetric[] {
  const baseMetrics: TasteMetric[] = [
    {
      label: "Droog/Zoet",
      leftLabel: "Droog",
      rightLabel: "Zoet",
      value: profile.drySweet,
      description: profile.drySweet <= 2 ? "Droge wijn met minimale restsuiker" : profile.drySweet >= 5 ? "Zoete wijn met merkbare suiker" : "Medium droog met lichte zoetheid",
    },
    {
      label: "Body",
      leftLabel: "Licht",
      rightLabel: "Vol",
      value: profile.lightFull,
      description: profile.lightFull <= 2 ? "Licht en delicaat in de mond" : profile.lightFull >= 5 ? "Vol en krachtig met veel textuur" : "Medium body met goede structuur",
    },
  ];

  if (wineType === "red") {
    baseMetrics.push(
      {
        label: "Tannine",
        leftLabel: "Zacht",
        rightLabel: "Tanninrijk",
        value: profile.softTannic || 3,
        description: (profile.softTannic || 3) <= 2 ? "Zachte, fluweelachtige tannines" : (profile.softTannic || 3) >= 5 ? "Stevige, grijpende tannines" : "Gebalanceerde tanninestructuur",
      },
      {
        label: "Aroma",
        leftLabel: "Fruitig",
        rightLabel: "Kruidig",
        value: profile.fruitySpicy || 3,
        description: (profile.fruitySpicy || 3) <= 2 ? "Rijp fruit en bessenaroma's" : (profile.fruitySpicy || 3) >= 5 ? "Kruidige en aardse tonen" : "Balans tussen fruit en kruiden",
      }
    );
  } else {
    baseMetrics.push(
      {
        label: "Frisheid",
        leftLabel: "Fris",
        rightLabel: "Zacht",
        value: profile.freshSoft || 3,
        description: (profile.freshSoft || 3) <= 2 ? "Verfrissend met levendige zuren" : (profile.freshSoft || 3) >= 5 ? "Zacht en rond in de mond" : "Aangename frisheid met zachtheid",
      }
    );

    if (wineType !== "rose") {
      baseMetrics.push({
        label: "Aroma",
        leftLabel: "Fruitig",
        rightLabel: "Bloemig",
        value: profile.fruitySpicy || 3,
        description: (profile.fruitySpicy || 3) <= 2 ? "Citrus en steenfruit" : (profile.fruitySpicy || 3) >= 5 ? "Bloemige en honingachtige tonen" : "Mix van fruit en bloemen",
      });
    }
  }

  return baseMetrics;
}

function generateTasteDescription(wineType: string, metrics: TasteMetric[]): string {
  const bodyMetric = metrics.find(m => m.label === "Body");
  const dryMetric = metrics.find(m => m.label === "Droog/Zoet");

  const bodyDesc = bodyMetric?.value && bodyMetric.value >= 4 ? "volle" : bodyMetric?.value && bodyMetric.value <= 2 ? "lichte" : "medium";
  const dryDesc = dryMetric?.value && dryMetric.value <= 2 ? "droge" : dryMetric?.value && dryMetric.value >= 5 ? "zoete" : "";

  const typeDesc = wineType === "red" ? "rode wijn" : wineType === "white" ? "witte wijn" : wineType === "rose" ? "rosé" : "mousserende wijn";

  return `Een ${dryDesc} ${bodyDesc} ${typeDesc} met een elegante structuur en uitgesproken karakter.`.replace("  ", " ");
}
