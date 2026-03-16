"use client";

import { type ReactNode, useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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

// ============================================
// Hero Parallax — video bg moves slower than content
// ============================================
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Video moves DOWN at 30% of scroll speed (parallax)
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Content fades and shifts up
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-[80vh] sm:h-[90vh] min-h-[560px] sm:min-h-[640px] max-h-[1000px] overflow-hidden">
      {/* Parallax video layer */}
      <motion.div className="absolute inset-0" style={{ y: videoY }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-banner.webp"
          aria-hidden="true"
          className="absolute inset-0 w-full h-[120%] object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Multi-layer gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-wine/30 via-transparent to-transparent" />
      {/* Subtle gold radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,162,39,0.08),transparent_60%)]" />

      {/* Parallax content layer */}
      <motion.div
        className="relative h-full"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {children}
      </motion.div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

// ============================================
// Animated Counter — for trust/social proof numbers
// ============================================
export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const increment = end / (duration * 60); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("nl-NL")}{suffix}
    </span>
  );
}

// ============================================
// USP Bar with reveal animation
// ============================================
export function AnimatedUSPBar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Upgraded Testimonial card with hover lift
// ============================================
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
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.3 } }}
        className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-sand/50 hover:shadow-xl transition-shadow duration-500 group overflow-hidden"
      >
        {/* Decorative gradient corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 via-wine/3 to-transparent rounded-bl-[100px] group-hover:from-gold/10 transition-colors duration-500" />

        {/* Large quote mark */}
        <div className="absolute top-4 left-5 sm:top-5 sm:left-7 text-wine/8 font-serif text-7xl sm:text-8xl leading-none select-none group-hover:text-wine/12 transition-colors duration-500">
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
          <div className="flex items-center gap-3 border-t border-sand/60 pt-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-wine to-wine-dark flex items-center justify-center text-white text-xs font-bold tracking-wider flex-shrink-0 shadow-lg shadow-wine/20">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm">{name}</p>
              <p className="text-xs text-grey">{wine}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  );
}

// ============================================
// Decorative Section Divider — wine-themed
// ============================================
export function PremiumDivider({ variant = "gold" }: { variant?: "gold" | "wine" | "subtle" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const colors = {
    gold: { line: "from-transparent via-gold/40 to-transparent", dot: "bg-gold/60" },
    wine: { line: "from-transparent via-wine/30 to-transparent", dot: "bg-wine/50" },
    subtle: { line: "from-transparent via-sand to-transparent", dot: "bg-sand" },
  };

  const c = colors[variant];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scaleX: 0.3 }}
      animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center justify-center py-2 sm:py-4"
    >
      <div className={`h-px w-20 sm:w-32 bg-gradient-to-r ${c.line}`} />
      <div className={`mx-3 sm:mx-4 w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <div className={`h-px w-20 sm:w-32 bg-gradient-to-l ${c.line}`} />
    </motion.div>
  );
}

// ============================================
// Scroll indicator with smooth animation
// ============================================
export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
    >
      <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5"
      >
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-0.5 h-1.5 bg-gold/80 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
}
