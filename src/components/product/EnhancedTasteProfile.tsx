"use client";

import { useState } from "react";
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
  emoji: string;
}

export function EnhancedTasteProfile({ product, className }: EnhancedTasteProfileProps) {
  const tasteProfile = product.tasteProfile;
  if (!tasteProfile) return null;

  const metrics: TasteMetric[] = getMetricsForWineType(product.wineType, tasteProfile);
  const wineColor = getWineColor(product.wineType);
  const wineColorLight = getWineColorLight(product.wineType);

  return (
    <div className={cn("bg-white rounded-2xl border border-sand/30 shadow-sm overflow-hidden", className)}>
      {/* Header with colored accent */}
      <div className="relative px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(to right, ${wineColor}, ${wineColorLight})` }}
        />
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2"
        >
          Smaakprofiel
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-grey text-sm sm:text-base max-w-md mx-auto"
        >
          {generateTasteDescription(product.wineType, metrics)}
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-5 gap-0 items-stretch">
        {/* Radar Chart - Center column, hidden on mobile */}
        <div className="hidden sm:flex lg:col-span-2 justify-center items-center p-6 lg:p-8 bg-warm-white/50">
          <RadarChart metrics={metrics} wineColor={wineColor} />
        </div>

        {/* Metrics List - Takes more space */}
        <div className="lg:col-span-3 p-4 sm:p-6 lg:p-8">
          <div className="space-y-5 sm:space-y-6">
            {metrics.map((metric, index) => (
              <TasteMetricBar
                key={metric.label}
                metric={metric}
                index={index}
                wineColor={wineColor}
                wineColorLight={wineColorLight}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TasteMetricBar({
  metric,
  index,
  wineColor,
  wineColorLight,
}: {
  metric: TasteMetric;
  index: number;
  wineColor: string;
  wineColorLight: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = (metric.value / 6) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs sm:text-sm text-grey flex items-center gap-1.5">
          {metric.leftLabel}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-charcoal flex items-center gap-1.5">
          <span className="text-base">{metric.emoji}</span>
          {metric.label}
        </span>
        <span className="text-xs sm:text-sm text-grey">
          {metric.rightLabel}
        </span>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative">
        {/* Track with markers */}
        <div className="relative h-3 bg-sand/40 rounded-full overflow-hidden">
          {/* Marker dots at each level */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 h-1 rounded-full transition-colors duration-300",
                  i <= metric.value ? "bg-white/50" : "bg-grey/10"
                )}
              />
            ))}
          </div>

          {/* Filled bar with gradient */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(to right, ${wineColor}, ${wineColorLight})`,
            }}
          />

          {/* Animated glow on hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="absolute inset-y-0 left-0 rounded-full blur-sm"
              style={{
                width: `${percentage}%`,
                background: wineColor,
              }}
            />
          )}
        </div>

        {/* Value indicator dot */}
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 1, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ top: "6px" }}
        >
          <motion.div
            animate={{ scale: isHovered ? 1.3 : 1 }}
            className="w-4 h-4 rounded-full border-2 border-white shadow-md"
            style={{ background: wineColor }}
          />
        </motion.div>
      </div>

      {/* Description on hover */}
      <motion.p
        initial={false}
        animate={{
          height: isHovered ? "auto" : 0,
          opacity: isHovered ? 1 : 0,
          marginTop: isHovered ? 6 : 0,
        }}
        className="text-xs text-grey overflow-hidden"
      >
        {metric.description}
      </motion.p>
    </motion.div>
  );
}

// Radar Chart Component
function RadarChart({ metrics, wineColor }: { metrics: TasteMetric[]; wineColor: string }) {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 6;

  // Calculate points for each metric
  const points = metrics.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const normalizedValue = metric.value / 6;
    return {
      x: center + Math.cos(angle) * radius * normalizedValue,
      y: center + Math.sin(angle) * radius * normalizedValue,
      labelX: center + Math.cos(angle) * (radius + 35),
      labelY: center + Math.sin(angle) * (radius + 35),
      label: metric.label,
      emoji: metric.emoji,
    };
  });

  // Create polygon path
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="overflow-visible">
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={wineColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={wineColor} stopOpacity="0.08" />
        </radialGradient>
      </defs>

      {/* Background hexagons */}
      {Array.from({ length: levels }).map((_, i) => {
        const levelRadius = (radius * (i + 1)) / levels;
        const hexPoints = metrics
          .map((_, mi) => {
            const angle = (Math.PI * 2 * mi) / metrics.length - Math.PI / 2;
            return `${center + Math.cos(angle) * levelRadius},${center + Math.sin(angle) * levelRadius}`;
          })
          .join(" ");
        return (
          <polygon
            key={i}
            points={hexPoints}
            fill="none"
            stroke="#e8e0d5"
            strokeWidth="1"
            opacity={0.4 + i * 0.08}
          />
        );
      })}

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
            strokeDasharray="4,4"
          />
        );
      })}

      {/* Filled area with gradient */}
      <motion.polygon
        points={polygonPoints}
        fill="url(#radar-fill)"
        stroke={wineColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points with pulse effect */}
      {points.map((point, index) => (
        <g key={index}>
          {/* Pulse ring */}
          <motion.circle
            cx={point.x}
            cy={point.y}
            r={10}
            fill="none"
            stroke={wineColor}
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.5, 1.5, 2],
            }}
            transition={{
              delay: 0.8 + index * 0.15,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
          {/* Point */}
          <motion.circle
            cx={point.x}
            cy={point.y}
            r={6}
            fill={wineColor}
            stroke="white"
            strokeWidth="2.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
            className="cursor-pointer"
          />
        </g>
      ))}

      {/* Labels with emojis */}
      {points.map((point, index) => (
        <g key={`label-${index}`}>
          <text
            x={point.labelX}
            y={point.labelY - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm"
          >
            {point.emoji}
          </text>
          <text
            x={point.labelX}
            y={point.labelY + 8}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[11px] fill-charcoal font-medium"
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Helper functions
function getWineColor(wineType: string): string {
  switch (wineType) {
    case "red": return "#1a1f3d";
    case "white": return "#c9a227";
    case "rose": return "#e8836a";
    case "sparkling": return "#c9a227";
    default: return "#1a1f3d";
  }
}

function getWineColorLight(wineType: string): string {
  switch (wineType) {
    case "red": return "#2d3454";
    case "white": return "#d4b84a";
    case "rose": return "#ffa38b";
    case "sparkling": return "#d4b84a";
    default: return "#2d3454";
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
      emoji: "💧",
      description: profile.drySweet <= 2 ? "Droge wijn met minimale restsuiker" : profile.drySweet >= 5 ? "Zoete wijn met merkbare suiker" : "Medium droog met lichte zoetheid",
    },
    {
      label: "Body",
      leftLabel: "Licht",
      rightLabel: "Vol",
      value: profile.lightFull,
      emoji: "🍷",
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
        emoji: "🫧",
        description: (profile.softTannic || 3) <= 2 ? "Zachte, fluweelachtige tannines" : (profile.softTannic || 3) >= 5 ? "Stevige, grijpende tannines" : "Gebalanceerde tanninestructuur",
      },
      {
        label: "Aroma",
        leftLabel: "Fruitig",
        rightLabel: "Kruidig",
        value: profile.fruitySpicy || 3,
        emoji: "🌿",
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
        emoji: "❄️",
        description: (profile.freshSoft || 3) <= 2 ? "Verfrissend met levendige zuren" : (profile.freshSoft || 3) >= 5 ? "Zacht en rond in de mond" : "Aangename frisheid met zachtheid",
      }
    );

    if (wineType !== "rose") {
      baseMetrics.push({
        label: "Aroma",
        leftLabel: "Fruitig",
        rightLabel: "Bloemig",
        value: profile.fruitySpicy || 3,
        emoji: "🌸",
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

  const typeDesc = wineType === "red" ? "rode wijn" : wineType === "white" ? "witte wijn" : wineType === "rose" ? "rose" : "mousserende wijn";

  return `Een ${dryDesc} ${bodyDesc} ${typeDesc} met een elegante structuur en uitgesproken karakter.`.replace("  ", " ");
}
