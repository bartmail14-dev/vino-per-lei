"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";

export interface SmoothCounterProps {
  /** Target value to count to */
  value: number;
  /** Duration of the counting animation in seconds (default: 2) */
  duration?: number;
  /** Locale for number formatting (default: "nl-NL") */
  locale?: string;
  /** Suffix to append (e.g., "+", "%", "k") */
  suffix?: string;
  /** Prefix to prepend (e.g., "EUR ") */
  prefix?: string;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  className?: string;
  /** Whether to use spring animation instead of tween (default: false) */
  spring?: boolean;
}

export function SmoothCounter({
  value,
  duration = 2,
  locale = "nl-NL",
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  spring = false,
}: SmoothCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  // Transform the motion value into formatted text
  const formattedValue = useTransform(motionValue, (latest) => {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Math.round(latest * Math.pow(10, decimals)) / Math.pow(10, decimals));
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (!isInView) return;

    // If reduced motion, jump straight to value
    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration: spring ? undefined : duration,
      ease: spring ? undefined : [0.25, 0.4, 0, 1],
      ...(spring
        ? {
            type: "spring",
            stiffness: 50,
            damping: 20,
          }
        : {}),
    });

    return () => controls.stop();
  }, [isInView, value, duration, motionValue, prefersReducedMotion, spring]);

  return (
    <motion.span ref={ref} className={className}>
      {formattedValue}
    </motion.span>
  );
}
