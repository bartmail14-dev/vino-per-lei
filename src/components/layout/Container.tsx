"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "xs" | "default" | "narrow" | "wide" | "full";
  as?: "div" | "section" | "article" | "main";
}

export function Container({
  children,
  className,
  size = "default",
  as: Component = "div",
}: ContainerProps) {
  const sizes = {
    xs: "max-w-2xl",       // 672px — for centered text content
    narrow: "max-w-4xl",   // 896px
    default: "max-w-7xl",  // 1280px
    wide: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
}
