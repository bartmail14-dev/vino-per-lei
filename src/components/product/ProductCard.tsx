"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Product } from "@/types";
import { Badge, Rating, PriceDisplay } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
  onQuickView?: (product: Product) => void;
}

/**
 * Generate a deterministic "views today" count based on product ID.
 * Uses product properties to create a believable number
 * that stays consistent across renders.
 */
function getViewsToday(product: Product): number {
  const base = parseInt(product.id, 10) || 1;
  const reviewFactor = product.reviewCount ? Math.min(product.reviewCount, 200) : 20;
  return Math.floor((base * 7 + reviewFactor) % 40) + 8;
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

  // Urgency: low stock indicator
  const isLowStock = product.inStock && product.stockQuantity !== undefined && product.stockQuantity <= 10;

  // Social proof: views today (deterministic per product)
  const viewsToday = useMemo(() => getViewsToday(product), [product]);

  return (
    <motion.article
      className={cn(
        "group relative bg-white rounded-lg",
        "border border-sand/40",
        "shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(26,31,61,0.12)]",
        "hover:border-sand/70",
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
          "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20 p-1.5 sm:p-2 rounded-full",
          "transition-all duration-250 ease-out",
          "bg-white/90 backdrop-blur-sm shadow-sm",
          "hover:bg-white hover:shadow-md hover:scale-105",
          isInWishlist ? "text-wine shadow-md" : "text-grey/50 hover:text-wine"
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
            "bg-white/90 backdrop-blur-sm shadow-sm text-charcoal",
            "opacity-0 group-hover:opacity-100 transition-all duration-250 ease-out",
            "hover:bg-white hover:shadow-md",
            "translate-y-1 group-hover:translate-y-0"
          )}
        >
          <span className="flex items-center gap-1.5">
            <EyeIcon className="w-3.5 h-3.5" />
            Snel bekijken
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

          {/* Price - prominent display */}
          <div className="mb-1 sm:mb-2">
            <PriceDisplay
              currentPrice={product.price}
              originalPrice={product.originalPrice}
            />
          </div>

          {/* Social proof & urgency indicators */}
          <div className="space-y-1 mt-1">
            {/* Low stock urgency - subtle amber tone, not aggressive */}
            {isLowStock && (
              <p className="text-[10px] sm:text-xs font-medium text-amber-700/80 bg-amber-50/60 rounded-full px-2 py-0.5 inline-flex items-center gap-1.5 animate-subtle-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                Nog {product.stockQuantity} op voorraad
              </p>
            )}

            {/* Views today - understated social proof */}
            {product.inStock && !isLowStock && (
              <p className="text-[10px] sm:text-xs text-grey/60 flex items-center gap-1">
                {viewsToday}x bekeken vandaag
              </p>
            )}
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
              "relative w-full h-10 sm:h-12 rounded-md font-semibold text-xs sm:text-sm uppercase tracking-wide cursor-pointer",
              "overflow-hidden transition-all duration-250 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-wine text-white hover:bg-wine-dark hover:shadow-md hover:-translate-y-px"
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
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isAdding ? (
                <LoadingSpinner />
              ) : justAdded ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Toegevoegd!
                </>
              ) : (
                <>
                  <CartIcon className="w-4 h-4" />
                  {isOnSale ? "Profiteer nu" : "In winkelmand"}
                </>
              )}
            </span>
          </button>
        ) : (
          <button className="w-full h-10 sm:h-12 rounded-md font-semibold text-xs sm:text-sm uppercase tracking-wide border border-wine/30 text-wine bg-transparent hover:bg-wine/5 hover:border-wine/50 transition-all duration-250 ease-out">
            Mail mij bij voorraad
          </button>
        )}
      </div>
    </motion.article>
  );
}

// Icon components
function WineBottleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M9 6h6M10 6v3c0 1-1 2-2 3v8a2 2 0 002 2h4a2 2 0 002-2v-8c-1-1-2-2-2-3V6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

