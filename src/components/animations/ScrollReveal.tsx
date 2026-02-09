"use client";

import { type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  type Variant,
  type Transition,
} from "framer-motion";

type RevealVariant = "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleUp";

export interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
  once?: boolean;
  margin?: string;
}

const PREMIUM_EASE: number[] = [0.25, 0.4, 0, 1];

const hiddenVariants: Record<RevealVariant, Variant> = {
  fade: { opacity: 0 },
  slideUp: { opacity: 0, y: 40 },
  slideDown: { opacity: 0, y: -40 },
  slideLeft: { opacity: 0, x: 60 },
  slideRight: { opacity: 0, x: -60 },
  scaleUp: { opacity: 0, scale: 0.92 },
};

const visibleVariants: Record<RevealVariant, Variant> = {
  fade: { opacity: 1 },
  slideUp: { opacity: 1, y: 0 },
  slideDown: { opacity: 1, y: 0 },
  slideLeft: { opacity: 1, x: 0 },
  slideRight: { opacity: 1, x: 0 },
  scaleUp: { opacity: 1, scale: 1 },
};

export function ScrollReveal({
  children,
  variant = "slideUp",
  delay = 0,
  duration = 0.7,
  stagger = 0,
  className,
  as = "div",
  once = true,
  margin = "-100px",
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Respect accessibility: skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    const Component = as;
    return <Component className={className}>{children}</Component>;
  }

  const MotionComponent = motion[as] as typeof motion.div;

  const transition: Transition = {
    duration,
    ease: PREMIUM_EASE,
    delay,
  };

  // If stagger is provided, use staggerChildren on the container
  if (stagger > 0) {
    return (
      <MotionComponent
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      className={className}
      initial={hiddenVariants[variant]}
      whileInView={visibleVariants[variant]}
      viewport={{ once, margin }}
      transition={transition}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Child item for use inside a ScrollReveal container with stagger.
 * Each child reveals independently using the parent's stagger timing.
 */
export interface ScrollRevealItemProps {
  children: ReactNode;
  variant?: RevealVariant;
  duration?: number;
  className?: string;
  as?: "div" | "li" | "article" | "span";
}

export function ScrollRevealItem({
  children,
  variant = "slideUp",
  duration = 0.7,
  className,
  as = "div",
}: ScrollRevealItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const Component = as;
    return <Component className={className}>{children}</Component>;
  }

  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      className={className}
      variants={{
        hidden: hiddenVariants[variant],
        visible: {
          ...visibleVariants[variant],
          transition: {
            duration,
            ease: PREMIUM_EASE,
          },
        },
      }}
    >
      {children}
    </MotionComponent>
  );
}
