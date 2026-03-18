"use client";

import { motion } from "framer-motion";
import { Rating } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
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
      <div className="text-center mb-8 sm:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2"
        >
          Beoordelingen
        </motion.h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Rating Summary — only show if real data exists from Shopify metafields */}
        {averageRating && totalReviews && totalReviews > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 mb-8 border border-sand/30 shadow-sm"
          >
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl sm:text-6xl font-bold text-charcoal leading-none">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-xl text-grey font-medium">/5</span>
              </div>
              <div className="flex justify-center mb-2">
                <Rating rating={averageRating} size="lg" />
              </div>
              <p className="text-grey text-sm">
                Gebaseerd op <span className="font-medium text-charcoal">{totalReviews}</span>{" "}
                {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </motion.div>
        ) : (
          /* No reviews placeholder */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 sm:p-12 border border-sand/30 shadow-sm text-center"
          >
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-sand fill-sand"
                  strokeWidth={0}
                />
              ))}
            </div>
            <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
              Nog geen reviews
            </h3>
            <p className="text-grey text-sm max-w-md mx-auto">
              Deze wijn heeft nog geen beoordelingen. Heb je deze wijn geproefd?
              We horen graag je ervaring.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
