"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge, Rating } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, AwardIcon, GrapeIcon } from "@/components/icons";
import type { Product } from "@/types";

interface HeroSectionProps {
  product: Product;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

export function HeroSection({ product, selectedImageIndex, onImageSelect }: HeroSectionProps) {
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const savingsPercentage = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-wine/5 via-champagne/30 to-cream" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-wine/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-16">
        {/* Breadcrumb - Hidden on smallest mobile */}
        <nav className="hidden sm:flex items-center gap-2 text-sm mb-6 lg:mb-8">
          <Link href="/" className="text-grey hover:text-wine transition-colors">
            Home
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-grey" />
          <Link href="/wijnen" className="text-grey hover:text-wine transition-colors">
            Wijnen
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-grey" />
          <span className="text-charcoal font-medium line-clamp-1">
            {product.title}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          {/* Left: Large Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main Image Container - More compact on mobile */}
            <div className="relative h-[280px] sm:h-[400px] lg:h-[600px]">
              {/* Badges */}
              <div className="absolute top-0 left-0 z-10 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">Nieuw</Badge>}
                {isOnSale && <Badge variant="sale">-{savingsPercentage}%</Badge>}
                {!product.inStock && <Badge variant="soldout">Uitverkocht</Badge>}
              </div>

              {/* Award Badge - positioned prominently */}
              {product.hasAward && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-0 right-0 z-10"
                >
                  <div className="bg-gradient-to-br from-gold via-gold-light to-gold text-charcoal px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <AwardIcon className="w-5 h-5" />
                      <span className="font-semibold text-sm">{product.awardText || "Award Winner"}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Product Image with hover effect */}
              {product.images[selectedImageIndex] && (
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full h-full group cursor-zoom-in">
                    <Image
                      src={product.images[selectedImageIndex].url}
                      alt={product.images[selectedImageIndex].altText || product.title}
                      fill
                      priority
                      className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onImageSelect(index)}
                    className={cn(
                      "relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200",
                      selectedImageIndex === index
                        ? "border-wine shadow-md scale-105"
                        : "border-sand/50 hover:border-grey hover:scale-105"
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Collection Badge */}
            {product.collection && (
              <span className="inline-block bg-wine/10 text-wine px-3 py-1 rounded-full text-sm font-medium mb-4">
                {product.collection}
              </span>
            )}

            {/* Title - Smaller on mobile */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl font-semibold text-charcoal mb-2">
              {product.title}
            </h1>

            {/* Vintage & Region */}
            <div className="flex flex-wrap items-center gap-2 text-grey text-sm sm:text-base mb-3 sm:mb-4">
              {product.vintage && (
                <>
                  <span className="text-xl font-medium text-charcoal">
                    {product.vintage === "NV" ? "Non-Vintage" : product.vintage}
                  </span>
                  <span className="text-sand">|</span>
                </>
              )}
              <span>{product.region}, {product.country}</span>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="mb-6">
                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="lg"
                  showScore
                />
              </div>
            )}

            {/* Grape Varieties Chips */}
            {product.grapeVarieties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.grapeVarieties.map((grape) => (
                  <span
                    key={grape}
                    className="inline-flex items-center gap-1.5 bg-champagne/50 text-charcoal px-3 py-1.5 rounded-full text-sm"
                  >
                    <GrapeIcon className="w-4 h-4 text-wine" />
                    {grape}
                  </span>
                ))}
              </div>
            )}

            {/* Short Description - Collapsible on mobile */}
            <p className="text-sm sm:text-lg text-grey leading-relaxed mb-4 sm:mb-8 max-w-lg line-clamp-3 sm:line-clamp-none">
              {product.description}
            </p>

            {/* Wine Type Indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "w-4 h-4 rounded-full",
                product.wineType === "red" && "bg-wine",
                product.wineType === "white" && "bg-gold",
                product.wineType === "rose" && "bg-coral",
                product.wineType === "sparkling" && "bg-champagne border border-gold"
              )} />
              <span className="text-sm text-grey capitalize">
                {product.wineType === "red" && "Rode Wijn"}
                {product.wineType === "white" && "Witte Wijn"}
                {product.wineType === "rose" && "Rosé"}
                {product.wineType === "sparkling" && "Mousserende Wijn"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

