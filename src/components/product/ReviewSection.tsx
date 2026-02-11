"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rating } from "@/components/ui";
import { cn } from "@/lib/utils";
import { StarIcon, CheckIcon, ThumbUpIcon, PenIcon } from "@/components/icons";
import type { Product } from "@/types";

interface ReviewSectionProps {
  product: Product;
  className?: string;
}

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

export function ReviewSection({ product, className }: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false);

  // Generate mock reviews based on product
  const reviews = generateMockReviews(product);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const averageRating = product.rating || 4.5;
  const totalReviews = product.reviewCount || reviews.length;

  // Calculate rating distribution
  const ratingDistribution = calculateRatingDistribution(reviews);

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

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-10">
        {/* Rating Summary - Horizontal on mobile */}
        <div className="lg:col-span-1">
          <div className="bg-warm-white rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
            {/* Mobile: Horizontal layout */}
            <div className="flex items-center gap-4 sm:block sm:text-center mb-4 sm:mb-0">
              <div className="sm:mb-4">
                <span className="text-3xl sm:text-5xl font-semibold text-charcoal">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-lg sm:text-xl text-grey">/5</span>
              </div>

              <div className="flex-1 sm:flex-none">
                <div className="flex sm:justify-center mb-1 sm:mb-2">
                  <Rating rating={averageRating} size="md" />
                </div>
                <p className="text-grey text-xs sm:text-base">
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            {/* Rating Distribution - Hidden on small mobile */}
            <div className="hidden sm:block space-y-2 sm:mt-6">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-grey w-3">{stars}</span>
                  <StarIcon className="w-4 h-4 text-gold" />
                  <div className="flex-1 h-2 bg-sand rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ratingDistribution[stars]}%` }}
                      transition={{ duration: 0.5, delay: (5 - stars) * 0.1 }}
                      className="h-full bg-gold rounded-full"
                    />
                  </div>
                  <span className="text-xs text-grey w-8">
                    {ratingDistribution[stars]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-6">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 sm:p-6 border border-sand/50"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-charcoal text-sm sm:text-base">{review.author}</span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-success bg-success/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                        <CheckIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Geverifieerde aankoop</span>
                        <span className="sm:hidden">Geverifieerd</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm text-grey">{review.date}</span>
                </div>
                <Rating rating={review.rating} size="sm" />
              </div>

              <h4 className="font-medium text-charcoal text-sm sm:text-base mb-1 sm:mb-2">{review.title}</h4>
              <p className="text-grey text-sm sm:text-base mb-3 sm:mb-4">{review.content}</p>

              <div className="flex items-center gap-4 pt-3 sm:pt-4 border-t border-sand/50">
                <button className="flex items-center gap-2 text-xs sm:text-sm text-grey hover:text-charcoal active:text-charcoal transition-colors min-h-[44px]">
                  <ThumbUpIcon className="w-4 h-4" />
                  Nuttig ({review.helpful})
                </button>
              </div>
            </motion.div>
          ))}

          {/* Show More Button */}
          {reviews.length > 3 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 sm:py-4 text-wine font-medium hover:bg-wine/5 active:bg-wine/10 rounded-lg transition-colors min-h-[48px]"
            >
              Toon alle {reviews.length} reviews
            </button>
          )}

          {/* Write Review CTA */}
          <div className="bg-champagne/30 rounded-xl p-4 sm:p-6 text-center">
            <p className="text-charcoal text-sm sm:text-base mb-3 sm:mb-4">
              Heb je deze wijn geproefd? Deel je ervaring!
            </p>
            <button className="inline-flex items-center justify-center gap-2 bg-wine text-white px-5 sm:px-6 py-3 rounded-lg font-medium hover:bg-wine-dark active:bg-wine-dark transition-colors min-h-[48px] w-full sm:w-auto">
              <PenIcon className="w-4 h-4" />
              Schrijf een review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data generator
function generateMockReviews(product: Product): Review[] {
  const reviewTemplates = [
    {
      title: "Fantastische wijn!",
      content: `Een absolute aanrader. De ${product.title} overtrof mijn verwachtingen. Perfect bij ons verjaardagsdiner.`,
    },
    {
      title: "Uitstekende kwaliteit",
      content: `Al jaren fan van deze producent en deze fles stelt niet teleur. Mooie balans en lange afdronk.`,
    },
    {
      title: "Perfect cadeau",
      content: `Gekocht als cadeau en het was een groot succes. De verpakking was ook prachtig.`,
    },
    {
      title: "Heerlijk bij het diner",
      content: `Geserveerd bij een ${product.wineType === "red" ? "biefstuk" : "gegrilde vis"} en de combinatie was perfect.`,
    },
    {
      title: "Wordt zeker herhaald",
      content: `Dit is nu mijn go-to wijn voor speciale gelegenheden. Snelle levering ook!`,
    },
    {
      title: "Goede prijs-kwaliteit",
      content: `Voor deze prijs krijg je echt waar voor je geld. Zal zeker nog een paar flessen bestellen.`,
    },
  ];

  const names = ["Jan D.", "Maria V.", "Peter K.", "Anna B.", "Thomas M.", "Sophie L."];
  const dates = ["2 dagen geleden", "1 week geleden", "2 weken geleden", "1 maand geleden", "2 maanden geleden", "3 maanden geleden"];

  return reviewTemplates.map((template, index) => ({
    id: `review-${index + 1}`,
    author: names[index % names.length],
    date: dates[index % dates.length],
    rating: Math.random() > 0.3 ? 5 : 4,
    title: template.title,
    content: template.content,
    verified: Math.random() > 0.2,
    helpful: Math.floor(Math.random() * 20),
  }));
}

function calculateRatingDistribution(reviews: Review[]): Record<number, number> {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    counts[r.rating as keyof typeof counts]++;
  });

  const total = reviews.length || 1;
  return {
    5: Math.round((counts[5] / total) * 100),
    4: Math.round((counts[4] / total) * 100),
    3: Math.round((counts[3] / total) * 100),
    2: Math.round((counts[2] / total) * 100),
    1: Math.round((counts[1] / total) * 100),
  };
}

