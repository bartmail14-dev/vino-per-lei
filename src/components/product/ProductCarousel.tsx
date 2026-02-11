"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@/components/icons";
import type { Product } from "@/types";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  className?: string;
}

export function ProductCarousel({
  products,
  title = "Ook interessant",
  subtitle,
  showViewAll = true,
  viewAllHref = "/wijnen",
  className,
}: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-8">
        <div>
          <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-semibold text-charcoal">
            {title}
          </h2>
          {subtitle && (
            <p className="text-grey text-sm sm:text-base mt-0.5 sm:mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation Arrows - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                canScrollLeft
                  ? "bg-wine text-white hover:bg-wine-dark"
                  : "bg-sand/50 text-grey cursor-not-allowed"
              )}
              aria-label="Vorige producten"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                canScrollRight
                  ? "bg-wine text-white hover:bg-wine-dark"
                  : "bg-sand/50 text-grey cursor-not-allowed"
              )}
              aria-label="Volgende producten"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* View All Link */}
          {showViewAll && (
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1 text-wine font-medium hover:underline"
            >
              Bekijk alles
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {/* Gradient Overlays */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none transition-opacity",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none transition-opacity",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Scrollable Container */}
        <div
          ref={carouselRef}
          onScroll={checkScrollPosition}
          className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[180px] sm:w-[240px] lg:w-[280px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile View All */}
      {showViewAll && (
        <div className="mt-6 sm:hidden text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-wine font-medium hover:underline"
          >
            Bekijk alle wijnen
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Scroll Indicators - Mobile */}
      <div className="flex justify-center gap-2 mt-4 sm:hidden">
        {Array.from({ length: Math.min(products.length, 5) }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === 0 ? "bg-wine" : "bg-sand"
            )}
          />
        ))}
      </div>
    </div>
  );
}

