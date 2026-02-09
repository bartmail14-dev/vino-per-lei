"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type HeadingLevel = "h1" | "h2" | "h3" | "p" | "span";

export interface TextRevealProps {
  text: string;
  as?: HeadingLevel;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  once?: boolean;
  margin?: string;
}

const PREMIUM_EASE: number[] = [0.25, 0.4, 0, 1];

export function TextReveal({
  text,
  as: Tag = "h2",
  className,
  staggerDelay = 0.04,
  delay = 0,
  once = true,
  margin = "-100px",
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Split text into words, preserving whitespace structure
  const words = useMemo(() => text.split(" "), [text]);

  // If reduced motion is preferred, render plain text
  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  // Use motion component for the tag
  const MotionTag = motion[Tag] as typeof motion.h2;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      aria-label={text}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: {
                y: "100%",
                opacity: 0,
              },
              visible: {
                y: "0%",
                opacity: 1,
                transition: {
                  duration: 0.6,
                  ease: PREMIUM_EASE,
                },
              },
            }}
          >
            {word}
          </motion.span>
          {/* Add space after each word except the last */}
          {i < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * TextReveal variant that supports JSX children with line-by-line reveal.
 * Wraps children in a clip-mask reveal animation.
 */
export interface TextRevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: string;
}

export function TextRevealBlock({
  children,
  className,
  delay = 0,
  duration = 0.8,
  once = true,
  margin = "-100px",
}: TextRevealBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="will-change-transform"
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once, margin }}
        transition={{
          duration,
          ease: PREMIUM_EASE,
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
