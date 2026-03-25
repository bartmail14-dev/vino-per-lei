"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Rating } from "@/components/ui";
import { cn, wineImagePresets } from "@/lib/utils";
import { ChevronRightIcon, AwardIcon, GrapeIcon } from "@/components/icons";
import { ZoomIn, ChevronLeft, ChevronRight as ChevronRightSmall, MapPin, Star } from "lucide-react";
import type { Product } from "@/types";

interface HeroSectionProps {
  product: Product;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

export function HeroSection({ product, selectedImageIndex, onImageSelect }: HeroSectionProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const savingsPercentage = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, [isZoomed]);

  const handlePrevImage = () => {
    onImageSelect(selectedImageIndex === 0 ? product.images.length - 1 : selectedImageIndex - 1);
  };

  const handleNextImage = () => {
    onImageSelect(selectedImageIndex === product.images.length - 1 ? 0 : selectedImageIndex + 1);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-wine/5 via-champagne/20 to-cream" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-wine/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-16">
        {/* Breadcrumb */}
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

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-start">
          {/* Left: Large Product Image with Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative lg:sticky lg:top-24"
          >
            {/* Main Image Container */}
            <div
              className={cn(
                "relative h-[300px] sm:h-[420px] lg:h-[580px] rounded-2xl overflow-hidden group",
                "bg-gradient-to-b from-champagne/30 via-cream to-white",
                "border border-sand/30",
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-2">
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
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10"
                >
                  <div className="bg-gradient-to-br from-gold via-gold-light to-gold text-charcoal px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AwardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-xs sm:text-sm">{product.awardText || "Award Winner"}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Image counter badge */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 bg-charcoal/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Zoom hint */}
              {!isZoomed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-white/80 backdrop-blur-sm text-charcoal text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5"
                >
                  <ZoomIn className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Klik om in te zoomen</span>
                </motion.div>
              )}

              {/* Product Image with zoom */}
              <AnimatePresence mode="wait">
                {product.images[selectedImageIndex] && (
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className="relative w-full h-full"
                      style={isZoomed ? {
                        transform: `scale(2)`,
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      } : undefined}
                    >
                      <Image
                        src={wineImagePresets.hero(product.images[selectedImageIndex].url)}
                        alt={product.images[selectedImageIndex].altText || product.title}
                        fill
                        priority
                        className={cn(
                          "object-contain drop-shadow-2xl transition-transform duration-300",
                          !isZoomed && "group-hover:scale-105 p-4 sm:p-8"
                        )}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all opacity-0 sm:group-hover:opacity-100 sm:opacity-0 active:opacity-100"
                    aria-label="Vorige afbeelding"
                  >
                    <ChevronLeft className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all opacity-0 sm:group-hover:opacity-100 sm:opacity-0 active:opacity-100"
                    aria-label="Volgende afbeelding"
                  >
                    <ChevronRightSmall className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails - Horizontal scroll on mobile */}
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => onImageSelect(index)}
                    className={cn(
                      "relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden flex-shrink-0",
                      "border-2 transition-all duration-200",
                      "bg-gradient-to-b from-champagne/20 to-cream",
                      selectedImageIndex === index
                        ? "border-wine shadow-md ring-2 ring-wine/20"
                        : "border-sand/40 hover:border-wine/40 hover:shadow-sm"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={wineImagePresets.thumbnail(image.url)}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                    {/* Active indicator bar */}
                    {selectedImageIndex === index && (
                      <motion.div
                        layoutId="thumbnail-indicator"
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-wine rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:py-4"
          >
            {/* Collection Badge */}
            {product.collection && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block bg-wine/8 text-wine px-3.5 py-1 rounded-full text-sm font-medium mb-4 border border-wine/10"
              >
                {product.collection}
              </motion.span>
            )}

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2.75rem] lg:leading-[1.15] font-semibold text-charcoal mb-2">
              {product.title}
            </h1>

            {/* Curated by Carla badge */}
            <div className="flex items-center gap-1.5 mb-3">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-gold" fill="currentColor"><path d="M8 0l2 5h5l-4 3.5 1.5 5L8 10.5 3.5 13.5 5 8.5 1 5h5z"/></svg>
              <span className="text-sm text-wine/70 italic">Persoonlijk geselecteerd door Carla</span>
            </div>

            {/* Vintage & Region */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-grey text-sm sm:text-base mb-4 sm:mb-5">
              {product.vintage && (
                <>
                  <span className="text-xl sm:text-2xl font-medium text-charcoal font-serif">
                    {product.vintage === "NV" ? "Non-Vintage" : product.vintage}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-sand" />
                </>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-wine/60" strokeWidth={1.5} />
                {product.region}, {product.country}
              </span>
            </div>

            {/* Rating - More prominent */}
            {product.rating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-6 pb-6 border-b border-sand/50"
              >
                <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-lg">
                  <Star className="w-5 h-5 text-gold" fill="currentColor" strokeWidth={0} />
                  <span className="font-semibold text-charcoal text-lg">{product.rating.toFixed(1)}</span>
                </div>
                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="lg"
                  showScore={false}
                />
                {product.reviewCount && (
                  <span className="text-sm text-grey">
                    {product.reviewCount} reviews
                  </span>
                )}
              </motion.div>
            )}

            {/* Grape Varieties - More premium chips */}
            {product.grapeVarieties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.grapeVarieties.map((grape, i) => (
                  <motion.span
                    key={grape}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="inline-flex items-center gap-1.5 bg-champagne/40 text-charcoal px-3 py-1.5 rounded-full text-sm border border-champagne/60 hover:border-wine/20 hover:bg-champagne/60 transition-colors"
                  >
                    <GrapeIcon className="w-3.5 h-3.5 text-wine/70" />
                    {grape}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Short Description */}
            <p className="text-sm sm:text-base lg:text-lg text-grey leading-relaxed mb-6 max-w-lg line-clamp-3 sm:line-clamp-none">
              {product.description}
            </p>

            {/* Wine Type + Alcohol Indicator */}
            <div className="flex items-center gap-4 mb-4 p-3 sm:p-4 rounded-lg bg-warm-white/80 border border-sand/30">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-5 h-5 rounded-full shadow-sm",
                  product.wineType === "red" && "bg-wine",
                  product.wineType === "white" && "bg-gold",
                  product.wineType === "rose" && "bg-coral",
                  product.wineType === "sparkling" && "bg-champagne border border-gold"
                )} />
                <span className="text-sm font-medium text-charcoal">
                  {product.wineType === "red" && "Rode Wijn"}
                  {product.wineType === "white" && "Witte Wijn"}
                  {product.wineType === "rose" && "Rose"}
                  {product.wineType === "sparkling" && "Mousserende Wijn"}
                </span>
              </div>
              {/* Alcohol and volume can be added when available in product data */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

