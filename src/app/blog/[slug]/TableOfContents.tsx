"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);

  // Extract headings from article content
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    elements.forEach((el, index) => {
      if (!el.id) {
        el.id = `heading-${index}-${el.textContent?.slice(0, 30).replace(/\s+/g, "-").toLowerCase() || index}`;
      }
      items.push({
        id: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  // Scroll-aware: show after hero, hide near footer
  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Show after scrolling past hero area
      const pastHero = scrollY > 400;
      // Hide when approaching footer / related articles
      const nearBottom = scrollY + winHeight > docHeight - 600;

      setVisible(pastHero && !nearBottom);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Only show for articles with enough structure
  if (headings.length < 3) return null;

  // Progress: which heading are we at relative to total
  const activeIndex = headings.findIndex((h) => h.id === activeId);
  const progress = activeIndex >= 0 ? ((activeIndex + 1) / headings.length) * 100 : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Inhoudsopgave"
          className="hidden xl:block fixed right-6 2xl:right-10 top-1/2 -translate-y-1/2 z-30 w-[200px] print:hidden"
        >
          {/* Vertical progress track */}
          <div className="relative pl-4">
            {/* Background track */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-sand/40" aria-hidden="true" />
            {/* Active progress fill */}
            <motion.div
              className="absolute left-0 top-0 w-px bg-wine/50 origin-top"
              animate={{ height: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              aria-hidden="true"
            />
            {/* Active dot on progress line */}
            {activeIndex >= 0 && (
              <motion.div
                className="absolute left-0 w-[5px] h-[5px] rounded-full bg-wine -translate-x-[2px]"
                animate={{ top: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                aria-hidden="true"
              />
            )}

            {/* Heading links — no collapse toggle, always visible */}
            <div className="space-y-0">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => scrollToHeading(h.id)}
                    className={`block w-full text-left text-[11px] leading-[1.45] py-1.5 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${
                      h.level === 3 ? "pl-3" : ""
                    } ${
                      isActive
                        ? "text-wine font-medium"
                        : "text-grey/40 hover:text-grey/70"
                    }`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span className="line-clamp-2">{h.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
