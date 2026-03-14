"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";

interface BlogCategoryFilterProps {
  tags: string[];
}

export function BlogCategoryFilter({ tags }: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

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

  const allTags = [null, ...tags];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {allTags.map((tag) => {
        const isActive = tag === null ? !activeTag : activeTag === tag;
        const label = tag === null ? "Alles" : tag;

        return (
          <button
            key={label}
            onClick={() => handleClick(tag)}
            className="relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap capitalize"
          >
            {/* Active pill background */}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-wine rounded-full shadow-md shadow-wine/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            {/* Inactive border */}
            {!isActive && (
              <div className="absolute inset-0 rounded-full bg-white border border-sand/80 hover:border-charcoal/20 hover:shadow-sm transition-all duration-300" />
            )}

            <span className={`relative z-10 transition-colors duration-200 ${
              isActive ? "text-white" : "text-grey hover:text-charcoal"
            }`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
