"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

type AnimationVariant = "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight" | "scaleIn" | "zoomIn";

interface AnimateOnScrollProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

// Framer Motion expects BezierDefinition = [number, number, number, number]
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

const variants: Record<AnimationVariant, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function AnimateOnScroll({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  amount = 0.2,
}: AnimateOnScrollProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  if (reduced) return <div ref={ref} className={className}>{children}</div>;

  const v = variants[variant];

  return (
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={isInView ? v.visible : v.hidden}
      transition={{ duration, delay, ease: EASE_OUT_QUART }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
  once = true,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "fadeUp",
}: {
  children: ReactNode;
  className?: string;
  variant?: "fadeUp" | "scaleIn" | "fadeIn";
}) {
  const itemVariants: Record<string, Variants> = {
    fadeUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_QUART } },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_OUT_QUART } },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT_QUART } },
    },
  };

  return (
    <motion.div
      variants={itemVariants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
