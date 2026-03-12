"use client";

import { Rating } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ReviewSectionProps {
  product: Product;
  className?: string;
}

export function ReviewSection({ product, className }: ReviewSectionProps) {
  const averageRating = product.rating;
  const totalReviews = product.reviewCount;

  return (
    <div className={cn("", className)}>
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2">
          Wat Anderen Zeggen
        </h2>
        <p className="text-grey text-sm sm:text-base">
          Ervaringen van onze klanten
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Show rating from Shopify metafields if available */}
        {averageRating && totalReviews ? (
          <div className="bg-warm-white rounded-xl p-6 text-center mb-6">
            <div className="mb-3">
              <span className="text-4xl font-semibold text-charcoal">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-lg text-grey">/5</span>
            </div>
            <div className="flex justify-center mb-2">
              <Rating rating={averageRating} size="md" />
            </div>
            <p className="text-grey text-sm">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        ) : null}

        {/* Coming soon message */}
        <div className="bg-champagne/30 rounded-xl p-6 sm:p-8 text-center">
          <p className="text-charcoal text-sm sm:text-base">
            Binnenkort kun je hier reviews lezen en schrijven.
          </p>
        </div>
      </div>
    </div>
  );
}
