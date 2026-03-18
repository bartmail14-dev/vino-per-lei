"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@/types";
import { Badge, Rating, PriceDisplay } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn, wineImagePresets } from "@/lib/utils";
import { WineBottleIcon, CheckIcon, HeartIcon, LoadingSpinner, EyeIcon } from "@/components/icons";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  priority = false,
  className,
  onQuickView,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem(product);
    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const wineTypeLabel =
    product.wineType === "red"
      ? "Rood"
      : product.wineType === "white"
        ? "Wit"
        : product.wineType === "rose"
          ? "Rosé"
          : "Bubbels";

  return (
    <motion.article
      className={cn(
        "group relative bg-white rounded-2xl",
        "border border-sand/50",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_24px_48px_-12px_rgba(26,31,61,0.12)]",
        "hover:-translate-y-2",
        "overflow-visible mt-16 sm:mt-28",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Gold accent line — top edge */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Wishlist Button */}
      <motion.button
        onClick={handleToggleWishlist}
        className={cn(
          "absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 rounded-full transition-all duration-200",
          "bg-white/90 backdrop-blur-sm",
          "hover:bg-white hover:shadow-md",
          isInWishlist ? "text-wine shadow-sm" : "text-grey/40 hover:text-wine"
        )}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isInWishlist ? "Verwijder uit verlanglijst" : "Toevoegen aan verlanglijst"}
      >
        <HeartIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" filled={isInWishlist} />
      </motion.button>

      {/* Quick View Button - appears on hover */}
      {onQuickView && (
        <AnimatePresence>
          {isHovering && (
            <motion.button
              onClick={handleQuickView}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute top-2 left-2 z-20 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide",
                "bg-white/95 backdrop-blur-sm shadow-md text-charcoal",
                "hover:bg-white hover:shadow-lg"
              )}
            >
              <span className="flex items-center gap-1.5">
                <EyeIcon className="w-3.5 h-3.5" />
                Bekijk
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      <Link
        href={`/wijnen/${product.handle}`}
        className="block"
        aria-label={`Bekijk ${product.title}`}
      >
        {/* Image Container */}
        <div className="relative h-36 sm:h-48 mx-3 sm:mx-4 -mt-12 sm:-mt-20">
          {/* Background with grain */}
          <div className="absolute inset-0 bg-gradient-to-b from-champagne/60 via-cream to-white rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-grain opacity-[0.03]" />
            {/* Shine sweep on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none z-[5]"
              initial={{ x: "-200%" }}
              animate={{ x: isHovering ? "200%" : "-200%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 sm:gap-1.5">
            {product.isNew && (
              <Badge variant="new">Nieuw</Badge>
            )}
            {isOnSale && (
              <Badge variant="sale">-{discountPercentage}%</Badge>
            )}
            {!product.inStock && <Badge variant="soldout">Uitverkocht</Badge>}
            {product.hasAward && (
              <Badge variant="award">{product.awardText || "Award"}</Badge>
            )}
          </div>

          {/* Wine Type Pill */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10">
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm",
              "text-[10px] sm:text-[11px] font-medium text-charcoal/70 tracking-wide"
            )}>
              <div className={cn(
                "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                product.wineType === "red" && "bg-wine",
                product.wineType === "white" && "bg-gold",
                product.wineType === "rose" && "bg-coral",
                product.wineType === "sparkling" && "bg-champagne border border-gold"
              )} />
              <span>{wineTypeLabel}</span>
            </div>
          </div>

          {/* Product Image */}
          <div className="absolute inset-0 -top-8 sm:-top-16 flex items-center justify-center">
            {product.images[0] ? (
              <div className="relative w-20 sm:w-36 h-40 sm:h-72">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-28 sm:w-14 sm:h-44 rounded-lg bg-gradient-to-b from-sand/30 to-sand/10 animate-pulse" />
                  </div>
                )}
                <motion.div
                  className="relative w-full h-full"
                  animate={{
                    y: isHovering ? -6 : 0,
                    scale: isHovering ? 1.06 : 1,
                    rotate: isHovering ? 0.8 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Image
                    src={wineImagePresets.card(product.images[0].url)}
                    alt={product.images[0].altText || product.title}
                    fill
                    sizes="(max-width: 640px) 96px, 176px"
                    priority={priority}
                    onLoad={handleImageLoad}
                    className={cn(
                      "object-contain object-center drop-shadow-2xl transition-opacity duration-500",
                      !product.inStock && "grayscale-[50%] opacity-70",
                      !imageLoaded && "opacity-0"
                    )}
                  />
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-grey h-full">
                <WineBottleIcon className="w-20 h-20 opacity-20" />
              </div>
            )}
          </div>
        </div>

        {/* Gold divider */}
        <div className="mx-4 sm:mx-5 mt-2 sm:mt-3 mb-2 sm:mb-3">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-3 sm:px-5 pb-1">
          {/* Region line — editorial small-caps */}
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-grey/60 font-medium mb-1 sm:mb-1.5 truncate">
            {product.region}
            {product.vintage && product.vintage !== "NV" && (
              <span className="text-gold/50 ml-1.5">
                &middot; {product.vintage}
              </span>
            )}
          </p>

          <h3 className="font-serif text-[13px] sm:text-base font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-wine transition-colors duration-300 mb-1.5 sm:mb-2">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="mb-2 sm:mb-2.5">
              <Rating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
              />
            </div>
          )}

          {/* Price */}
          <div className="mb-2.5 sm:mb-3">
            <PriceDisplay
              currentPrice={product.price}
              originalPrice={product.originalPrice}
            />
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-3 pb-3 sm:px-5 sm:pb-4 relative z-30">
        {product.inStock ? (
          <motion.button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "relative w-full h-9 sm:h-11 rounded-lg text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer",
              "overflow-hidden transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              justAdded
                ? "bg-success text-white border border-success"
                : "bg-wine/[0.04] text-wine border border-wine/20 hover:bg-wine hover:text-white hover:border-wine"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative z-10 flex items-center justify-center"
                >
                  <LoadingSpinner />
                </motion.span>
              ) : justAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative z-10 flex items-center justify-center"
                >
                  <CheckIcon className="w-3.5 h-3.5 mr-1.5" />
                  Toegevoegd
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex items-center justify-center"
                >
                  + Winkelmand
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ) : (
          <button className="w-full h-9 sm:h-11 rounded-lg text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] border border-wine/20 text-wine/60 bg-transparent hover:bg-wine hover:text-white hover:border-wine transition-all duration-300">
            Mail bij voorraad
          </button>
        )}
      </div>
    </motion.article>
  );
}
