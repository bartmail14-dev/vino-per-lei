"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface BadgeProps {
  variant?: "new" | "sale" | "soldout" | "award" | "bestseller" | "default";
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  const variants = {
    new: "bg-wine text-white",
    sale: "bg-error text-white",
    soldout: "bg-grey/80 text-white",
    award: "bg-gold text-white",
    bestseller: "bg-gradient-to-r from-gold to-gold-light text-white",
    default: "bg-sand text-charcoal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded",
        "leading-none select-none",
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
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg",
        "bg-error/10 text-error",
        className
      )}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      Je bespaart {"\u20AC"}{amount.toFixed(2)} ({percentage}%)
    </span>
  );
}
