"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, ChevronUp, Check } from "lucide-react";

/* ══════════════════════════════════════════════
   Shared easing & reduced-motion
   ══════════════════════════════════════════════ */

const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_OUT: [number, number, number, number] = [0.0, 0.0, 0.2, 1];

function useAccessibleMotion() {
  const prefersReduced = useReducedMotion();
  return prefersReduced ?? false;
}

/* ──────────────────────────────────────────────
   1. BlogFadeIn — scroll-triggered fade-in
   ────────────────────────────────────────────── */

export function BlogFadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const offsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0 }
          : { opacity: 0, ...offsets[direction] }
      }
      transition={{ duration: 0.7, delay, ease: EASE_PREMIUM }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   2. BlogStagger + BlogStaggerItem
   ────────────────────────────────────────────── */

export function BlogStagger({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BlogStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useAccessibleMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: EASE_PREMIUM },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   3. ParallaxHero — image at 50% speed
   ────────────────────────────────────────────── */

export function ParallaxHero({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "50%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className || ""}`}>
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * HeroContentFade — title/meta fades out on scroll (opacity 1→0 over first 30vh)
 */
export function HeroContentFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, reduced ? 1 : 0]);
  const y = useTransform(scrollYProgress, [0, 0.35], ["0px", reduced ? "0px" : "-40px"]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * HeroOverlayDarken — overlay darkens on scroll
 */
export function HeroOverlayDarken({ className }: { className?: string }) {
  const reduced = useAccessibleMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [0.55, reduced ? 0.55 : 0.85]);

  return <motion.div style={{ opacity }} className={`absolute inset-0 ${className || ""}`} />;
}

/* ──────────────────────────────────────────────
   4. AnimatedDivider
   ────────────────────────────────────────────── */

export function AnimatedDivider({ className }: { className?: string }) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  if (reduced) {
    return (
      <div aria-hidden="true" className={`flex items-center gap-4 ${className || ""}`}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="w-2 h-2 bg-gold/30 rounded-sm flex-shrink-0 rotate-45" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
    );
  }

  return (
    <div ref={ref} aria-hidden="true" className={`flex items-center gap-4 ${className || ""}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: EASE_PREMIUM }}
        className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-left"
      />
      <motion.div
        initial={{ scale: 0, rotate: 45 }}
        animate={isInView ? { scale: 1, rotate: 45 } : { scale: 0, rotate: 45 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-2 h-2 bg-gold/30 rounded-sm flex-shrink-0"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: EASE_PREMIUM }}
        className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-right"
      />
    </div>
  );
}

/* ──────────────────────────────────────────────
   5. RevealText — letter-by-letter hero headings
   ────────────────────────────────────────────── */

export function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  if (reduced) return <div className={className}>{text}</div>;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.03,
            ease: EASE_PREMIUM,
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   NEW PREMIUM COMPONENTS
   ══════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   6. ContentReveal — subtle paragraph fade-up
      20px → 0, 300ms, easeOut, whileInView
   ────────────────────────────────────────────── */

export function ContentReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useAccessibleMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   7. ImageReveal — clip-path or scale reveal
   ────────────────────────────────────────────── */

export function ImageReveal({
  children,
  className,
  variant = "scale",
}: {
  children: ReactNode;
  className?: string;
  variant?: "clipUp" | "scale";
}) {
  const reduced = useAccessibleMotion();
  if (reduced) return <div className={className}>{children}</div>;

  if (variant === "clipUp") {
    return (
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className={`overflow-hidden ${className || ""}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * InlineImageParallax — images scroll slower than text
 */
export function InlineImageParallax({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? "0px" : "-30px", reduced ? "0px" : "30px"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   8. PullQuoteEntrance — gold border grows, then text fades
   ────────────────────────────────────────────── */

export function PullQuoteEntrance({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      {/* Gold border — leading element, scaleY 0→1 */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.4, ease: EASE_PREMIUM }}
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold origin-top rounded-full"
      />
      {/* Text — fades in after border */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE_PREMIUM }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   9. ReadingProgressEnhanced — spring physics + time remaining
   ────────────────────────────────────────────── */

export function ReadingProgressEnhanced({
  readingTimeMinutes,
}: {
  readingTimeMinutes?: number;
}) {
  const reduced = useAccessibleMotion();
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, {
    stiffness: reduced ? 300 : 80,
    damping: reduced ? 40 : 25,
  });

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const p = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
      setProgress(p);
      scaleX.set(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleX]);

  const minutesLeft =
    readingTimeMinutes != null
      ? Math.max(0, Math.ceil(readingTimeMinutes * (1 - progress)))
      : null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-gold origin-left z-50"
        style={{ scaleX }}
      />
      <motion.div
        className="fixed top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-gold/40 via-gold-light/40 to-gold/40 origin-left z-50 blur-sm"
        style={{ scaleX }}
      />
      <AnimatePresence>
        {progress > 0.08 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50 hidden lg:flex items-center gap-2.5 bg-dark-bg/95 backdrop-blur-md text-gold text-xs font-medium px-3.5 py-2 rounded-full border border-gold/20 shadow-xl shadow-black/20 ring-1 ring-white/5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>{Math.round(progress * 100)}%</span>
            {minutesLeft !== null && minutesLeft > 0 && (
              <>
                <span className="w-px h-3 bg-gold/20" />
                <span className="text-gold/60">{minutesLeft} min resterend</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────
   10. Card Hover States — premium card interactions
   ────────────────────────────────────────────── */

export function CardHover({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const reduced = useAccessibleMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE_PREMIUM }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: EASE_PREMIUM } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CardImageZoom({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CardReadMore({ text = "Lees artikel" }: { text?: string }) {
  return (
    <motion.span
      className="flex items-center gap-1.5 text-wine font-medium"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      {text}
      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
    </motion.span>
  );
}

/* ──────────────────────────────────────────────
   11. PageTransition — fade + scale entrance/exit
   ────────────────────────────────────────────── */

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useAccessibleMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: EASE_PREMIUM }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   12. Newsletter CTA Animations — gradient shift, glow, checkmark
   ────────────────────────────────────────────── */

export function NewsletterGradientBg({ className }: { className?: string }) {
  const reduced = useAccessibleMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  if (reduced) return <div ref={ref} className={className} />;

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={
        isInView
          ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
          : {}
      }
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ backgroundSize: "200% 200%" }}
    />
  );
}

export function InputGlow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative ${className || ""}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -inset-1 rounded-full bg-gold/10 blur-md pointer-events-none"
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

export function CheckmarkAnimation({ show }: { show: boolean }) {
  const reduced = useAccessibleMotion();
  if (reduced && show) {
    return (
      <div className="flex items-center gap-2 text-gold font-medium">
        <Check className="w-5 h-5" strokeWidth={2.5} />
        <span>Welkom!</span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_PREMIUM }}
          className="flex items-center gap-2 text-gold font-medium"
        >
          <motion.svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.polyline
              points="20 6 9 17 4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: EASE_PREMIUM }}
            />
          </motion.svg>
          <span>Welkom!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────
   13. ScrollToTop — floating button after 50vh
   ────────────────────────────────────────────── */

export function ScrollToTop() {
  const reduced = useAccessibleMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE_PREMIUM }}
          whileHover={reduced ? {} : { scale: 1.1 }}
          whileTap={reduced ? {} : { scale: 0.95 }}
          onClick={scrollToTop}
          aria-label="Scroll naar boven"
          className="fixed bottom-24 lg:bottom-8 right-5 lg:right-8 z-40 w-12 h-12 rounded-full bg-gold text-wine-dark shadow-lg shadow-gold/25 flex items-center justify-center hover:bg-gold-light transition-colors print:hidden border border-gold-light/30 cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────
   14. ArticleContentEnhancer — DOM-based animations
       for dangerouslySetInnerHTML article content
       (paragraphs, images, blockquotes)
   ────────────────────────────────────────────── */

export function ArticleContentEnhancer() {
  const reduced = useAccessibleMotion();

  useEffect(() => {
    if (reduced) return;

    const article = document.querySelector("article");
    if (!article) return;

    // --- Paragraph / heading reveals: fade-up, staggered ---
    const textElements = article.querySelectorAll("p, h2, h3, ul, ol");
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            textObserver.unobserve(el);
          }
        });
      },
      { rootMargin: "-50px 0px", threshold: 0.1 }
    );

    textElements.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateY(20px)";
      htmlEl.style.transition = `opacity 0.3s cubic-bezier(0,0,0.2,1) ${Math.min(i * 0.05, 0.25)}s, transform 0.3s cubic-bezier(0,0,0.2,1) ${Math.min(i * 0.05, 0.25)}s`;
      textObserver.observe(htmlEl);
    });

    // --- Image reveals: scale 1.05→1 + opacity ---
    const images = article.querySelectorAll("img, figure");
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "scale(1)";
            imageObserver.unobserve(el);
          }
        });
      },
      { rootMargin: "-50px 0px", threshold: 0.1 }
    );

    images.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "scale(1.05)";
      htmlEl.style.transition = "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)";
      imageObserver.observe(htmlEl);
    });

    // --- Blockquote / pull quote: slide from left ---
    const quotes = article.querySelectorAll("blockquote");
    const quoteObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateX(0)";
            quoteObserver.unobserve(el);
          }
        });
      },
      { rootMargin: "-50px 0px", threshold: 0.1 }
    );

    quotes.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateX(-16px)";
      htmlEl.style.transition = "opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s";
      quoteObserver.observe(htmlEl);
    });

    return () => {
      textObserver.disconnect();
      imageObserver.disconnect();
      quoteObserver.disconnect();
    };
  }, [reduced]);

  return null;
}
