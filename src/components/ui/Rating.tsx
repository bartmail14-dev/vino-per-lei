"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  className?: string;
}

export function Rating({
  rating,
  maxRating = 5,
  reviewCount,
  size = "md",
  showScore = false,
  className,
}: RatingProps) {
  const gradientId = useId();

  const sizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4.5 h-4.5",
    lg: "w-5.5 h-5.5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const starPath =
    "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

  // Calculate the fill percentage for the half star
  const halfFillPercent = Math.round((rating % 1) * 100);

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="img"
      aria-label={`${rating} van ${maxRating} sterren${reviewCount !== undefined ? `, ${reviewCount} reviews` : ""}`}
    >
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg
            key={`full-${i}`}
            className={cn(sizes[size], "text-gold")}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d={starPath} />
          </svg>
        ))}

        {/* Half star with unique gradient ID */}
        {hasHalfStar && (
          <svg
            className={cn(sizes[size])}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`half-star-${gradientId}`}>
                <stop offset={`${halfFillPercent}%`} stopColor="var(--gold)" />
                <stop offset={`${halfFillPercent}%`} stopColor="var(--sand)" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-star-${gradientId})`}
              d={starPath}
            />
          </svg>
        )}

        {/* Empty stars */}
        {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
          <svg
            key={`empty-${i}`}
            className={cn(sizes[size], "text-sand")}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d={starPath} />
          </svg>
        ))}
      </div>

      {showScore && (
        <span className={cn(textSizes[size], "font-semibold text-charcoal")}>
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className={cn(textSizes[size], "text-grey")}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
