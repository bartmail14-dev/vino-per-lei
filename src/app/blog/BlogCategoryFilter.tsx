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
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          !activeTag
            ? "bg-wine text-white shadow-sm"
            : "bg-sand/30 text-grey hover:bg-sand/50 hover:text-charcoal"
        }`}
      >
        Alles
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleClick(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
            activeTag === tag
              ? "bg-wine text-white shadow-sm"
              : "bg-sand/30 text-grey hover:bg-sand/50 hover:text-charcoal"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
