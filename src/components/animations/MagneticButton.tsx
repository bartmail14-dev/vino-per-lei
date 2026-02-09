"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MagneticButtonProps {
  children: ReactNode;
  /** Maximum magnetic offset in pixels (default: 5) */
  maxOffset?: number;
  /** Spring stiffness for the magnetic animation (default: 350) */
  stiffness?: number;
  /** Spring damping for the magnetic animation (default: 15) */
  damping?: number;
  className?: string;
  /** Disable magnetic effect (e.g., on touch devices) */
  disabled?: boolean;
}

export function MagneticButton({
  children,
  maxOffset = 5,
  stiffness = 350,
  damping = 15,
  className,
  disabled = false,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || prefersReducedMotion) return;

      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center, normalized to -1...1
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Clamp to maxOffset
      const clampedX = Math.max(-1, Math.min(1, deltaX)) * maxOffset;
      const clampedY = Math.max(-1, Math.min(1, deltaY)) * maxOffset;

      setPosition({ x: clampedX, y: clampedY });
    },
    [disabled, maxOffset, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  // If reduced motion or disabled, render children without effect
  if (prefersReducedMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      className={`inline-block ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness,
        damping,
        mass: 0.5,
      }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
