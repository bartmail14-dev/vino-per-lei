"use client";

import { cn } from "@/lib/utils";

export interface TasteProfileItem {
  leftLabel: string;
  rightLabel: string;
  value: number; // 1-6 scale
}

export interface TasteProfileProps {
  items: TasteProfileItem[];
  maxValue?: number;
  className?: string;
}

export function TasteProfile({
  items,
  maxValue = 6,
  className,
}: TasteProfileProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="w-20 text-sm text-grey text-right">
            {item.leftLabel}
          </span>

          <div className="flex gap-1.5">
            {Array.from({ length: maxValue }).map((_, dotIndex) => (
              <div
                key={dotIndex}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  dotIndex < item.value ? "bg-wine" : "bg-sand"
                )}
              />
            ))}
          </div>

          <span className="w-20 text-sm text-grey">
            {item.rightLabel}
          </span>
        </div>
      ))}
    </div>
  );
}

// Preset taste profiles for different wine types
export const redWineTasteProfile: Omit<TasteProfileItem, "value">[] = [
  { leftLabel: "Droog", rightLabel: "Zoet" },
  { leftLabel: "Licht", rightLabel: "Vol" },
  { leftLabel: "Zacht", rightLabel: "Tanninrijk" },
  { leftLabel: "Fruitig", rightLabel: "Kruidig" },
];

export const whiteWineTasteProfile: Omit<TasteProfileItem, "value">[] = [
  { leftLabel: "Droog", rightLabel: "Zoet" },
  { leftLabel: "Licht", rightLabel: "Vol" },
  { leftLabel: "Fris", rightLabel: "Zacht" },
  { leftLabel: "Fruitig", rightLabel: "Bloemig" },
];

export const roseTasteProfile: Omit<TasteProfileItem, "value">[] = [
  { leftLabel: "Droog", rightLabel: "Zoet" },
  { leftLabel: "Licht", rightLabel: "Vol" },
  { leftLabel: "Fris", rightLabel: "Zacht" },
];
