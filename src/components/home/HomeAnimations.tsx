"use client";

import { type ReactNode } from "react";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui";
import { StarIcon } from "@/components/icons";

// Wrapper for animated sections in the homepage (Server Component can't use hooks)
export function AnimatedSection({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
}: {
  children: ReactNode;
  variant?: "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight" | "scaleIn";
  delay?: number;
  className?: string;
}) {
  return (
    <AnimateOnScroll variant={variant} delay={delay} className={className}>
      {children}
    </AnimateOnScroll>
  );
}

export function AnimatedStagger({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <StaggerChildren className={className} staggerDelay={staggerDelay}>
      {children}
    </StaggerChildren>
  );
}

export { StaggerItem };

// Upgraded Testimonial card
interface TestimonialProps {
  name: string;
  text: string;
  rating: number;
  wine: string;
}

export function TestimonialCard({ name, text, rating, wine }: TestimonialProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <StaggerItem>
      <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-sand/50 hover:shadow-xl transition-all duration-500 group overflow-hidden">
        {/* Decorative gradient corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-wine/5 to-transparent rounded-bl-[80px] group-hover:from-wine/10 transition-colors duration-500" />

        {/* Large quote mark */}
        <div className="absolute top-4 left-5 sm:top-5 sm:left-7 text-wine/10 font-serif text-6xl sm:text-7xl leading-none select-none group-hover:text-wine/15 transition-colors duration-500">
          &ldquo;
        </div>

        <div className="relative">
          {/* Stars */}
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: rating }).map((_, i) => (
              <StarIcon key={i} className="w-4 h-4 text-gold" />
            ))}
          </div>

          {/* Quote text */}
          <p className="text-charcoal text-sm sm:text-base leading-relaxed mb-6 italic">
            &ldquo;{text}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 border-t border-sand pt-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine to-wine-dark flex items-center justify-center text-white text-xs font-bold tracking-wider flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm">{name}</p>
              <p className="text-xs text-grey">{wine}</p>
            </div>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}
