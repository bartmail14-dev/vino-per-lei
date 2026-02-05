"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

interface WineGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export function WineGrid({ products, onQuickView }: WineGridProps) {
  // Create a layout pattern that repeats - more varied and interesting
  // Pattern optimized for visual interest with featured items
  const getCardSize = (index: number): "large" | "medium" | "small" => {
    const pattern = [
      "large",   // 0: Featured
      "medium",  // 1
      "medium",  // 2
      "small",   // 3
      "small",   // 4
      "large",   // 5: Featured
      "small",   // 6
      "medium",  // 7
      "small",   // 8
      "medium",  // 9
      "small",   // 10
      "small",   // 11
    ] as const;
    return pattern[index % pattern.length];
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[160px] md:auto-rows-[180px] lg:auto-rows-[200px]">
      {products.map((product, index) => (
        <WineCard
          key={product.id}
          product={product}
          size={getCardSize(index)}
          index={index}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

interface WineCardProps {
  product: Product;
  size: "large" | "medium" | "small";
  index: number;
  onQuickView?: (product: Product) => void;
}

function WineCard({ product, size, index, onQuickView }: WineCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 300));
    addItem(product);
    setIsAdding(false);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  // Determine grid span based on size
  const gridSpan = {
    large: "col-span-2 row-span-2",
    medium: "col-span-1 row-span-2",
    small: "col-span-1 row-span-1 md:row-span-1",
  }[size];

  // Background colors for visual variety
  const bgGradients = [
    "from-stone-100 via-stone-50 to-amber-50/30",
    "from-rose-50/50 via-stone-50 to-stone-100",
    "from-amber-50/40 via-stone-50 to-stone-100",
    "from-stone-100 via-amber-50/30 to-rose-50/30",
  ];
  const bgGradient = bgGradients[index % bgGradients.length];

  const isOnSale =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = isOnSale
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  return (
    <motion.article
      className={cn(gridSpan, "relative group")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link
        href={`/wijnen/${product.handle}`}
        className={cn(
          "block h-full rounded-2xl overflow-hidden relative",
          `bg-gradient-to-br ${bgGradient}`,
          "border border-stone-200/60",
          "transition-all duration-500 ease-out",
          "hover:shadow-2xl hover:shadow-wine/10",
          "hover:border-wine/20"
        )}
      >
        {/* Animated background gradient on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-wine/5 via-transparent to-amber-100/20 opacity-0"
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-wine text-white text-[10px] font-bold uppercase tracking-wider rounded">
              Nieuw
            </span>
          )}
          {isOnSale && (
            <span className="px-2 py-0.5 bg-coral text-white text-[10px] font-bold uppercase tracking-wider rounded">
              -{discountPercentage}%
            </span>
          )}
          {product.hasAward && (
            <span className="px-2 py-0.5 bg-gold/90 text-charcoal text-[10px] font-bold uppercase tracking-wider rounded">
              {product.awardText || "Award"}
            </span>
          )}
        </div>

        {/* Quick View Button - Top Right */}
        {onQuickView && (
          <motion.button
            onClick={handleQuickView}
            className={cn(
              "absolute top-3 right-3 z-20",
              "w-8 h-8 rounded-full",
              "bg-white/90 backdrop-blur-sm shadow-lg",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-300",
              "hover:bg-white hover:scale-110"
            )}
            initial={{ scale: 0.8 }}
            animate={{ scale: isHovering ? 1 : 0.8 }}
          >
            <EyeIcon className="w-4 h-4 text-charcoal" />
          </motion.button>
        )}

        {/* Wine Bottle Image */}
        <div
          className={cn(
            "absolute flex items-center justify-center",
            size === "large"
              ? "inset-4 bottom-20"
              : size === "medium"
              ? "inset-3 bottom-16"
              : "inset-2 bottom-12"
          )}
        >
          <motion.div
            className={cn(
              "relative h-full",
              size === "large"
                ? "w-32"
                : size === "medium"
                ? "w-24"
                : "w-20"
            )}
            animate={{
              y: isHovering ? -6 : 0,
              rotate: isHovering ? 1.5 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].altText || product.title}
                fill
                sizes={
                  size === "large"
                    ? "300px"
                    : size === "medium"
                    ? "200px"
                    : "150px"
                }
                className="object-contain object-bottom drop-shadow-2xl"
              />
            ) : (
              <div className="w-full h-full bg-stone-200 rounded-lg" />
            )}
          </motion.div>
        </div>

        {/* Content Overlay - Bottom */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 z-10",
            "bg-gradient-to-t from-charcoal/90 via-charcoal/60 to-transparent",
            size === "large" ? "p-4 pt-8" : size === "medium" ? "p-3 pt-6" : "p-2.5 pt-5"
          )}
        >
          {/* Region tag */}
          {size !== "small" && product.region && (
            <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider mb-0.5">
              {product.region}
            </p>
          )}

          {/* Title */}
          <h3
            className={cn(
              "font-serif text-white font-semibold leading-tight",
              size === "large"
                ? "text-base mb-1"
                : size === "medium"
                ? "text-sm mb-0.5"
                : "text-xs line-clamp-1"
            )}
          >
            {product.title}
          </h3>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  "font-bold text-white",
                  size === "large"
                    ? "text-lg"
                    : size === "medium"
                    ? "text-base"
                    : "text-sm"
                )}
              >
                €{product.price.toFixed(2).replace(".", ",")}
              </span>
              {isOnSale && size !== "small" && (
                <span className="text-white/40 text-xs line-through">
                  €{product.originalPrice!.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>

            {size !== "small" && product.inStock && (
              <motion.button
                onClick={handleAddToCart}
                className={cn(
                  "rounded-full bg-white/20 backdrop-blur-sm text-white",
                  "flex items-center justify-center",
                  "transition-all duration-300",
                  "hover:bg-wine hover:scale-110",
                  size === "large" ? "w-9 h-9" : "w-8 h-8"
                )}
                whileTap={{ scale: 0.95 }}
                disabled={isAdding}
              >
                {isAdding ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : (
                  <PlusIcon className={size === "large" ? "w-5 h-5" : "w-4 h-4"} />
                )}
              </motion.button>
            )}
          </div>

          {/* Rating - only on large cards */}
          {size === "large" && product.rating && (
            <div className="flex items-center gap-1 mt-1.5">
              <StarIcon className="w-3 h-3 text-gold fill-gold" />
              <span className="text-white/90 text-xs font-medium">
                {product.rating}
              </span>
              {product.reviewCount && (
                <span className="text-white/50 text-xs">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hover shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{
            x: isHovering ? "100%" : "-100%",
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </Link>
    </motion.article>
  );
}

// Icons
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
