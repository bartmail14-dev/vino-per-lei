"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { cn, wineImagePresets } from "@/lib/utils";
import { Eye, Plus, Check, Star } from "lucide-react";
import { LoadingSpinner } from "@/components/icons";

interface WineGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export function WineGrid({ products, onQuickView }: WineGridProps) {
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[180px] lg:auto-rows-[200px]">
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
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 300));
    addItem(product);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const gridSpan = {
    large: "col-span-2 row-span-2",
    medium: "col-span-1 row-span-2",
    small: "col-span-1 row-span-1 md:row-span-1",
  }[size];

  // Subtle gradient backgrounds
  const bgGradients = [
    "from-stone-50 via-stone-50 to-amber-50/20",
    "from-rose-50/30 via-stone-50 to-stone-50",
    "from-amber-50/20 via-stone-50 to-stone-50",
    "from-stone-50 via-amber-50/15 to-rose-50/15",
  ];
  const bgGradient = bgGradients[index % bgGradients.length];

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
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
          "block h-full rounded-xl overflow-hidden relative",
          `bg-gradient-to-br ${bgGradient}`,
          "border border-sand/30",
          "transition-all duration-500 ease-out",
          "hover:shadow-[0_20px_50px_-12px_rgba(26,31,61,0.15)]",
          "hover:border-wine/15"
        )}
      >
        {/* Hover gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-wine/3 via-transparent to-gold/5 pointer-events-none"
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Badges - Top Left */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-wine text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
              Nieuw
            </span>
          )}
          {isOnSale && (
            <span className="px-2 py-0.5 bg-coral text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
              -{discountPercentage}%
            </span>
          )}
          {product.hasAward && (
            <span className="px-2 py-0.5 bg-gold/90 text-charcoal text-[10px] font-bold uppercase tracking-wider rounded-md">
              {product.awardText || "Award"}
            </span>
          )}
        </div>

        {/* Quick View Button - Top Right */}
        {onQuickView && (
          <AnimatePresence>
            {isHovering && (
              <motion.button
                onClick={handleQuickView}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute top-2.5 right-2.5 z-20",
                  "w-8 h-8 rounded-full",
                  "bg-white/90 backdrop-blur-sm shadow-md",
                  "flex items-center justify-center",
                  "hover:bg-white hover:shadow-lg hover:scale-110 transition-all"
                )}
              >
                <Eye className="w-4 h-4 text-charcoal" strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        )}

        {/* Wine Bottle Image */}
        <div
          className={cn(
            "absolute flex items-center justify-center",
            size === "large"
              ? "inset-4 bottom-22"
              : size === "medium"
              ? "inset-3 bottom-18"
              : "inset-2 bottom-14"
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
              y: isHovering ? -8 : 0,
              rotate: isHovering ? 1.5 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {product.images[0] ? (
              <Image
                src={wineImagePresets.card(product.images[0].url)}
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
              <div className="w-full h-full bg-sand/20 rounded-lg" />
            )}
          </motion.div>
        </div>

        {/* Content Overlay - Bottom */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 z-10",
            "bg-gradient-to-t from-charcoal/90 via-charcoal/60 to-transparent",
            size === "large" ? "p-4 pt-10" : size === "medium" ? "p-3 pt-8" : "p-2.5 pt-6"
          )}
        >
          {/* Region tag */}
          {size !== "small" && product.region && (
            <p className="text-white/50 text-[10px] font-medium uppercase tracking-wider mb-0.5">
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
                  "rounded-full backdrop-blur-sm text-white",
                  "flex items-center justify-center",
                  "transition-all duration-300",
                  justAdded
                    ? "bg-success"
                    : "bg-white/20 hover:bg-wine hover:scale-110",
                  size === "large" ? "w-9 h-9" : "w-8 h-8"
                )}
                whileTap={{ scale: 0.9 }}
                disabled={isAdding}
              >
                {isAdding ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : justAdded ? (
                  <Check className={size === "large" ? "w-5 h-5" : "w-4 h-4"} strokeWidth={2.5} />
                ) : (
                  <Plus className={size === "large" ? "w-5 h-5" : "w-4 h-4"} strokeWidth={2.5} />
                )}
              </motion.button>
            )}
          </div>

          {/* Rating - only on large cards */}
          {size === "large" && product.rating && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 text-gold fill-gold" strokeWidth={0} />
              <span className="text-white/90 text-xs font-medium">
                {product.rating.toFixed(1)}
              </span>
              {product.reviewCount && (
                <span className="text-white/40 text-xs">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hover shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent pointer-events-none -skew-x-12"
          initial={{ x: "-200%" }}
          animate={{
            x: isHovering ? "200%" : "-200%",
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </Link>
    </motion.article>
  );
}

