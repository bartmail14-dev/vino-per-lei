"use client";

import { motion } from "framer-motion";
import { Rating } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Star, CheckCircle } from "lucide-react";
import type { Product } from "@/types";

interface ReviewSectionProps {
  product: Product;
  className?: string;
}

// Placeholder testimonials for social proof until real reviews are connected
const placeholderTestimonials = [
  {
    name: "Maria V.",
    location: "Amsterdam",
    rating: 5,
    text: "Prachtige selectie, de wijn was precies zoals beschreven. Snelle levering en mooi verpakt!",
    date: "2 weken geleden",
  },
  {
    name: "Thomas B.",
    location: "Rotterdam",
    rating: 5,
    text: "Uitstekende kwaliteit voor de prijs. De proefgarantie gaf mij vertrouwen om te bestellen.",
    date: "1 maand geleden",
  },
  {
    name: "Lisa de J.",
    location: "Utrecht",
    rating: 4,
    text: "Heel fijne webshop. Het smaakprofiel klopte perfect, ideaal voor bij ons diner.",
    date: "3 weken geleden",
  },
];

export function ReviewSection({ product, className }: ReviewSectionProps) {
  const averageRating = product.rating;
  const totalReviews = product.reviewCount;

  // Generate rating distribution (simulated from avg)
  const distribution = generateDistribution(averageRating || 4.2, totalReviews || 0);

  return (
    <div className={cn("", className)}>
      <div className="text-center mb-8 sm:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal mb-1 sm:mb-2"
        >
          Wat Anderen Zeggen
        </motion.h2>
        <p className="text-grey text-sm sm:text-base">
          Ervaringen van onze klanten
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Rating Summary Card */}
        {averageRating && totalReviews ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 mb-8 border border-sand/30 shadow-sm"
          >
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Left: Score */}
              <div className="text-center sm:text-left">
                <div className="flex items-baseline justify-center sm:justify-start gap-1 mb-2">
                  <span className="text-5xl sm:text-6xl font-bold text-charcoal leading-none">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-xl text-grey font-medium">/5</span>
                </div>
                <div className="flex justify-center sm:justify-start mb-2">
                  <Rating rating={averageRating} size="lg" />
                </div>
                <p className="text-grey text-sm">
                  Gebaseerd op <span className="font-medium text-charcoal">{totalReviews}</span>{" "}
                  {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Right: Distribution bars */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = distribution[stars] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm text-grey w-3 text-right">{stars}</span>
                      <Star className="w-4 h-4 text-gold fill-gold flex-shrink-0" strokeWidth={0} />
                      <div className="flex-1 h-2.5 bg-sand/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + (5 - stars) * 0.1, ease: "easeOut" }}
                          className="h-full bg-gold rounded-full"
                        />
                      </div>
                      <span className="text-xs text-grey w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Testimonial Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {placeholderTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-lg p-5 sm:p-6 border border-sand/30 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < testimonial.rating ? "text-gold fill-gold" : "text-sand fill-sand"
                    )}
                    strokeWidth={0}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-charcoal text-sm leading-relaxed mb-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">{testimonial.name}</p>
                  <p className="text-xs text-grey">{testimonial.location}</p>
                </div>
                <span className="text-xs text-grey">{testimonial.date}</span>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-sand/30">
                <CheckCircle className="w-3.5 h-3.5 text-success" strokeWidth={2} />
                <span className="text-xs text-success font-medium">Geverifieerde aankoop</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-champagne/30 rounded-lg p-6 sm:p-8 text-center"
        >
          <p className="text-charcoal text-sm sm:text-base mb-1">
            Binnenkort kun je hier jouw eigen review plaatsen.
          </p>
          <p className="text-grey text-xs sm:text-sm">
            Heb je deze wijn al geproefd? We horen graag je ervaring!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Helper: generate plausible distribution from average
function generateDistribution(avg: number, total: number): Record<number, number> {
  if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  // Weighted toward the average
  const weights = {
    5: avg >= 4.5 ? 0.6 : avg >= 4 ? 0.4 : 0.2,
    4: avg >= 4 ? 0.25 : 0.3,
    3: avg >= 3.5 ? 0.1 : 0.25,
    2: avg < 3 ? 0.15 : 0.04,
    1: avg < 2.5 ? 0.1 : 0.01,
  };
  return {
    5: Math.round(total * weights[5]),
    4: Math.round(total * weights[4]),
    3: Math.round(total * weights[3]),
    2: Math.round(total * weights[2]),
    1: Math.max(0, total - Math.round(total * weights[5]) - Math.round(total * weights[4]) - Math.round(total * weights[3]) - Math.round(total * weights[2])),
  };
}

