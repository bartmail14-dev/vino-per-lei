"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";

function subscribePrefersReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshotPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshotPrefersReducedMotion() {
  return false;
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getSnapshotPrefersReducedMotion,
    getServerSnapshotPrefersReducedMotion,
  );
  const scaleX = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setProgress(p);
      scaleX.set(p);
      // Only show after scrolling past the hero (~60vh)
      setPastHero(scrollTop > window.innerHeight * 0.6);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleX]);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Leesvoortgang"
    >
      <AnimatePresence>
        {pastHero && (
          <>
            {/* Main gold gradient bar — z-[60] above header */}
            <motion.div
              key="progress-bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-gold origin-left z-[60]"
              style={{ scaleX }}
            />
            {/* Glow effect underneath */}
            {!prefersReducedMotion && (
              <motion.div
                key="progress-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-gold/40 via-gold-light/40 to-gold/40 origin-left z-[60] blur-sm"
                style={{ scaleX }}
                aria-hidden="true"
              />
            )}
            {/* Percentage indicator — shows after 10% scroll */}
            {progress > 0.1 && (
              <motion.div
                key="progress-pct"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-4 right-4 z-[60] hidden lg:flex items-center gap-2 bg-dark-bg/90 backdrop-blur-md text-gold text-xs font-medium px-3 py-1.5 rounded-full border border-gold/15 shadow-lg"
                aria-hidden="true"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                {Math.round(progress * 100)}%
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
