"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setProgress(p);
      scaleX.set(p);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleX]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-gold origin-left z-50"
        style={{ scaleX }}
      />
      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-gold/40 via-gold-light/40 to-gold/40 origin-left z-50 blur-sm"
        style={{ scaleX }}
      />
      {/* Percentage indicator — shows after 10% scroll */}
      {progress > 0.1 && (
        <div className="fixed top-4 right-4 z-50 hidden lg:flex items-center gap-2 bg-dark-bg/90 backdrop-blur-md text-gold text-xs font-medium px-3 py-1.5 rounded-full border border-gold/15 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          {Math.round(progress * 100)}%
        </div>
      )}
    </>
  );
}
