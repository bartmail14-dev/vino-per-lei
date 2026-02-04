"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  as?: "div" | "ul";
}

export function Grid({
  children,
  className,
  cols = 4,
  gap = "md",
  as: Component = "div",
}: GridProps) {
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  const gaps = {
    none: "gap-0",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
  };

  return (
    <Component
      className={cn("grid", colsMap[cols], gaps[gap], className)}
    >
      {children}
    </Component>
  );
}

// Product grid specifically for wine cards
export interface ProductGridProps {
  children: ReactNode;
  className?: string;
}

export function ProductGrid({ children, className }: ProductGridProps) {
  return (
    <Grid cols={4} gap="md" className={className}>
      {children}
    </Grid>
  );
}
