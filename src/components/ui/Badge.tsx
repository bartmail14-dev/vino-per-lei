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
    new: "bg-wine text-white",
    sale: "bg-error text-white",
    soldout: "bg-grey text-white",
    award: "bg-gold text-charcoal",
    default: "bg-sand text-charcoal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-sm",
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
        "bg-red-50 text-red-700",
        className
      )}
    >
      Je bespaart €{amount.toFixed(2)} ({percentage}%)
    </span>
  );
}
