"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Product } from "@/types";
import { Badge, Rating, PriceDisplay } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
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

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const { isAuthenticated, openLoginModal } = useAuthStore();

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

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Open login modal with callback to add to wishlist after login
      openLoginModal(() => {
        toggleWishlist(product);
      });
      return;
    }

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

  return (
    <motion.article
      className={cn(
        "group relative bg-white rounded-lg",
        "border border-sand/50",
        "shadow-sm hover:shadow-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "overflow-visible pt-4 sm:pt-6 mt-24 sm:mt-44",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={cn(
          "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20 p-1.5 sm:p-2 rounded-full transition-all duration-200",
          "bg-white/80 backdrop-blur-sm shadow-sm",
          "hover:bg-white hover:shadow-md hover:scale-110",
          isInWishlist && "text-wine"
        )}
        aria-label={isInWishlist ? "Verwijder uit verlanglijst" : "Toevoegen aan verlanglijst"}
      >
        <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" filled={isInWishlist} />
      </button>

      {/* Quick View Button - appears on hover */}
      {onQuickView && (
        <button
          onClick={handleQuickView}
          className={cn(
            "absolute top-2 left-2 z-20 px-3 py-1.5 rounded-full text-xs font-medium",
            "bg-white/90 backdrop-blur-sm shadow-sm",
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "hover:bg-white hover:shadow-md",
            "translate-y-2 group-hover:translate-y-0"
          )}
        >
          <span className="flex items-center gap-1">
            <EyeIcon className="w-3.5 h-3.5" />
            Quick View
          </span>
        </button>
      )}

      <Link
        href={`/wijnen/${product.handle}`}
        className="block"
        aria-label={`Bekijk ${product.title}`}
      >
        {/* Image Container */}
        <div className="relative h-28 sm:h-40 bg-gradient-to-b from-wine/15 via-champagne/60 to-cream rounded-t-lg mx-2 -mt-12 sm:-mt-20">
          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 sm:gap-2">
            {product.isNew && <Badge variant="new">Nieuw</Badge>}
            {isOnSale && <Badge variant="sale">-{discountPercentage}%</Badge>}
            {!product.inStock && <Badge variant="soldout">Uitverkocht</Badge>}
            {product.hasAward && (
              <Badge variant="award">{product.awardText || "Award"}</Badge>
            )}
          </div>

          {/* Product Image */}
          <div className="absolute inset-0 -top-14 sm:-top-28 flex items-center justify-center">
            {product.images[0] ? (
              <div className="relative w-28 sm:w-48 h-52 sm:h-96">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.title}
                  fill
                  sizes="(max-width: 640px) 112px, 192px"
                  priority={priority}
                  className={cn(
                    "object-contain object-center drop-shadow-2xl transition-transform duration-300",
                    "group-hover:scale-110 group-hover:-translate-y-3",
                    !product.inStock && "grayscale-[50%] opacity-70"
                  )}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-grey h-full">
                <WineBottleIcon className="w-24 h-24 opacity-30" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-4">
          {product.collection && (
            <p className="text-[10px] sm:text-label text-grey mb-0.5 sm:mb-1">{product.collection}</p>
          )}

          <h3 className="font-serif text-sm sm:text-base font-semibold text-charcoal mb-0.5 line-clamp-1">
            {product.title}
          </h3>
          {product.vintage && (
            <p className="text-xs sm:text-sm text-charcoal mb-0.5 sm:mb-1">
              {product.vintage === "NV" ? "Non-Vintage" : product.vintage}
            </p>
          )}

          <p className="text-xs sm:text-sm text-grey mb-1.5 sm:mb-2 line-clamp-1">
            {product.region}, {product.country}
          </p>

          {product.rating && (
            <div className="mb-2 sm:mb-3 hidden sm:block">
              <Rating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
              />
            </div>
          )}

          <div className="mb-2 sm:mb-4">
            <PriceDisplay
              currentPrice={product.price}
              originalPrice={product.originalPrice}
            />
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 relative z-30">
        {product.inStock ? (
          <button
            onClick={handleAddToCart}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            disabled={isAdding}
            className={cn(
              "relative w-full h-10 sm:h-12 rounded font-semibold text-xs sm:text-sm uppercase tracking-wide cursor-pointer",
              "overflow-hidden transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              justAdded
                ? "bg-success text-white"
                : "bg-wine text-white hover:bg-wine-dark hover:shadow-lg"
            )}
          >
            {/* Simple hover effect */}
            {!justAdded && (
              <motion.div
                className="absolute inset-0 bg-wine-dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center">
              {isAdding ? (
                <LoadingSpinner />
              ) : justAdded ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Toegevoegd!
                </>
              ) : (
                <>
                  <motion.span
                    className="inline-block mr-1"
                    animate={{ rotate: isHovering ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    +
                  </motion.span>
                  Winkelmand
                </>
              )}
            </span>
          </button>
        ) : (
          <button className="w-full h-10 sm:h-12 rounded font-semibold text-xs sm:text-sm uppercase tracking-wide border-2 border-wine text-wine bg-transparent hover:bg-wine hover:text-white transition-colors">
            Mail mij bij voorraad
          </button>
        )}
      </div>
    </motion.article>
  );
}

