"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface BadgeProps {
  variant?: "new" | "sale" | "soldout" | "award" | "default";
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  const variants = {
    new: "bg-wine/90 text-white",
    sale: "bg-amber-50 text-amber-800 border border-amber-200/60",
    soldout: "bg-grey/80 text-white",
    award: "bg-gold/15 text-amber-800 border border-gold/30",
    default: "bg-sand/80 text-charcoal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Savings badge specifically for prices
export interface SavingsBadgeProps {
  amount: number;
  percentage: number;
  className?: string;
}

export function SavingsBadge({ amount, percentage, className }: SavingsBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-medium rounded",
        "bg-amber-50/80 text-amber-800",
        className
      )}
    >
      Je bespaart &euro;{amount.toFixed(2)} ({percentage}%)
    </span>
  );
}
