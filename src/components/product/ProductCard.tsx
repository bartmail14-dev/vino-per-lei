"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Product } from "@/types";
import { Badge, Rating, PriceDisplay } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";

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

  return (
    <motion.article
      className={cn(
        "group relative bg-white rounded-lg",
        "border border-sand/50",
        "shadow-sm hover:shadow-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "overflow-visible pt-6 mt-8",
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
          "absolute top-2 right-2 z-20 p-2 rounded-full transition-all duration-200",
          "bg-white/80 backdrop-blur-sm shadow-sm",
          "hover:bg-white hover:shadow-md hover:scale-110",
          isInWishlist && "text-wine"
        )}
        aria-label={isInWishlist ? "Verwijder uit verlanglijst" : "Toevoegen aan verlanglijst"}
      >
        <HeartIcon className="w-5 h-5" filled={isInWishlist} />
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
        <div className="relative h-52 bg-gradient-to-b from-warm-white to-sand/30 rounded-t-lg mx-2 -mt-10">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isNew && <Badge variant="new">Nieuw</Badge>}
            {isOnSale && <Badge variant="sale">-{discountPercentage}%</Badge>}
            {!product.inStock && <Badge variant="soldout">Uitverkocht</Badge>}
            {product.hasAward && (
              <Badge variant="award">{product.awardText || "Award"}</Badge>
            )}
          </div>

          {/* Product Image */}
          <div className="absolute inset-x-4 -top-6 bottom-4 flex items-end justify-center">
            {product.images[0] ? (
              <div className="relative h-full w-full">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={priority}
                  className={cn(
                    "object-contain object-bottom drop-shadow-xl transition-transform duration-300",
                    "group-hover:scale-105 group-hover:-translate-y-2",
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
        <div className="p-4">
          {product.collection && (
            <p className="text-label text-grey mb-1">{product.collection}</p>
          )}

          <h3 className="font-serif text-base font-semibold text-charcoal mb-0.5 line-clamp-1">
            {product.title}
          </h3>
          {product.vintage && (
            <p className="text-sm text-charcoal mb-1">
              {product.vintage === "NV" ? "Non-Vintage" : product.vintage}
            </p>
          )}

          <p className="text-sm text-grey mb-2">
            {product.region}, {product.country}
          </p>

          {product.rating && (
            <div className="mb-3">
              <Rating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
              />
            </div>
          )}

          <div className="mb-4">
            <PriceDisplay
              currentPrice={product.price}
              originalPrice={product.originalPrice}
            />
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        {product.inStock ? (
          <button
            onClick={handleAddToCart}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            disabled={isAdding}
            className={cn(
              "relative w-full h-12 rounded font-semibold text-sm uppercase tracking-wide",
              "overflow-hidden transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              justAdded
                ? "bg-success text-white"
                : "bg-wine text-white hover:shadow-lg"
            )}
          >
            {/* Animated gradient background */}
            {!justAdded && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-wine via-wine-dark to-wine"
                style={{ backgroundSize: "200% 100%" }}
                animate={{
                  backgroundPosition: isHovering ? ["0% 0%", "100% 0%"] : "0% 0%",
                }}
                transition={{
                  duration: 1.5,
                  repeat: isHovering ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
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
          <button className="w-full h-12 rounded font-semibold text-sm uppercase tracking-wide border-2 border-wine text-wine bg-transparent hover:bg-wine hover:text-white transition-colors">
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
