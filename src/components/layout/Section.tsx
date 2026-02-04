"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { Container } from "./Container";

export interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "default" | "cream" | "warm" | "dark" | "wine";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  container?: boolean;
  containerSize?: "default" | "narrow" | "wide" | "full";
  id?: string;
}

export function Section({
  children,
  className,
  containerClassName,
  background = "default",
  spacing = "lg",
  container = true,
  containerSize = "default",
  id,
}: SectionProps) {
  const backgrounds = {
    default: "bg-background",
    cream: "bg-cream",
    warm: "bg-warm-white",
    dark: "bg-dark-bg text-white",
    wine: "bg-wine text-white",
  };

  const spacings = {
    none: "",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16",
    lg: "py-16 sm:py-20 lg:py-24",
    xl: "py-20 sm:py-28 lg:py-32",
  };

  const content = container ? (
    <Container size={containerSize} className={containerClassName}>
      {children}
    </Container>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={cn(backgrounds[background], spacings[spacing], className)}
    >
      {content}
    </section>
  );
}
