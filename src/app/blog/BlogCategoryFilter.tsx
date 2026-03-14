"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:gap-2.5">
      <button
        onClick={() => handleClick(null)}
        className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border ${
          !activeTag
            ? "bg-wine text-white shadow-md shadow-wine/20 border-wine"
            : "bg-white text-grey border-sand/80 hover:text-charcoal hover:border-charcoal/20 hover:shadow-sm"
        }`}
      >
        Alles
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleClick(tag)}
          className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 capitalize whitespace-nowrap border ${
            activeTag === tag
              ? "bg-wine text-white shadow-md shadow-wine/20 border-wine"
              : "bg-white text-grey border-sand/80 hover:text-charcoal hover:border-charcoal/20 hover:shadow-sm"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
