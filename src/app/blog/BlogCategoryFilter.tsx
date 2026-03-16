"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

interface BlogCategoryFilterProps {
  tags: string[];
}

export function BlogCategoryFilter({ tags }: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const handleClick = useCallback(
    (tag: string | null) => {
      if (tag) {
        router.push(`/blog?tag=${encodeURIComponent(tag)}`, { scroll: false });
      } else {
        router.push("/blog", { scroll: false });
      }
    },
    [router]
  );

  // Track scroll position for edge fades
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowLeftFade(el.scrollLeft > 8);
      setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [tags]);

  const allTags = [null, ...tags];

  return (
    <nav aria-label="Artikelcategorieen" className="relative">
      {/* Left fade */}
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none sm:hidden" aria-hidden="true" />
      )}

      {/* Right fade */}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:hidden" aria-hidden="true" />
      )}

      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Filter op categorie"
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap sm:gap-2.5 snap-x snap-mandatory sm:snap-none"
      >
        {allTags.map((tag) => {
          const isActive = tag === null ? !activeTag : activeTag === tag;
          const label = tag === null ? "Alle artikelen" : tag;

          return (
            <button
              key={label}
              role="tab"
              aria-selected={isActive}
              aria-label={`Filter: ${label}`}
              onClick={() => handleClick(tag)}
              className="relative min-h-[44px] px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-full text-sm font-medium whitespace-nowrap capitalize flex-shrink-0 snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="activeBlogCategory"
                  className="absolute inset-0 bg-gradient-to-r from-wine to-wine-dark rounded-full shadow-md shadow-wine/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Inactive border with gold hover accent */}
              {!isActive && (
                <div className="absolute inset-0 rounded-full bg-white border border-sand/80 hover:border-gold/30 hover:shadow-sm transition-all duration-300" />
              )}

              <span
                className={`relative z-10 transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive ? "text-white" : "text-grey hover:text-charcoal"
                }`}
              >
                {tag === null && (
                  <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                )}
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
