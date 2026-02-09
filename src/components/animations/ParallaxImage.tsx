"use client";

import { useRef } from "react";
import Image, { type ImageProps } from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export interface ParallaxImageProps extends Omit<ImageProps, "ref"> {
  /** Parallax offset range in pixels (default: [-50, 50]) */
  parallaxRange?: [number, number];
  /** Scale range on scroll (default: [1.0, 1.05]) */
  scaleRange?: [number, number];
  /** Additional container className */
  containerClassName?: string;
  /** Scroll offset for triggering start/end of parallax */
  scrollOffset?: [string, string];
}

export function ParallaxImage({
  parallaxRange = [-50, 50],
  scaleRange = [1.0, 1.05],
  containerClassName,
  scrollOffset = ["start end", "end start"],
  className,
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollOffset as ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], parallaxRange);
  const scale = useTransform(scrollYProgress, [0, 0.5], scaleRange);

  // If reduced motion preferred, render a static image
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`overflow-hidden ${containerClassName ?? ""}`}
      >
        <Image alt={alt} className={className} {...imageProps} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${containerClassName ?? ""}`}
    >
      <motion.div
        className="will-change-transform h-full w-full"
        style={{ y, scale }}
      >
        <Image alt={alt} className={className} {...imageProps} />
      </motion.div>
    </div>
  );
}

/**
 * ParallaxSection: applies a subtle parallax effect to any children.
 * Useful for decorative backgrounds, SVGs, or any non-image elements.
 */
export interface ParallaxSectionProps {
  children: React.ReactNode;
  parallaxRange?: [number, number];
  className?: string;
}

export function ParallaxSection({
  children,
  parallaxRange = [-30, 30],
  className,
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], parallaxRange);

  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <motion.div className="will-change-transform" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
