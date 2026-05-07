"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@/types";
import { Badge, Rating, PriceDisplay } from "@/components/ui";
import { NotifyMeModal } from "@/components/ui/NotifyMeModal";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiCopy } from "@/components/providers";
import { cn, wineImagePresets } from "@/lib/utils";
import { getOrderMinimum, getOrderUnitText, getPriceUnitText } from "@/lib/order-rules";
import { trackAddToCart } from "@/lib/analytics";
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
  const t = useUiCopy();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const rawIsInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const isInWishlist = isAuthenticated && rawIsInWishlist;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const quantity = getOrderMinimum(product);
    addItem(product, quantity);
    trackAddToCart({ title: product.title, id: product.id, price: product.price, quantity });
    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginModal(() => toggleWishlist(product));
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
  const orderUnitText = getOrderUnitText(product);
  const priceUnitText = getPriceUnitText(product);

  const wineTypeLabel =
    product.wineType === "red"
      ? t("product.wine_type.red")
      : product.wineType === "white"
        ? t("product.wine_type.white")
        : product.wineType === "rose"
          ? t("product.wine_type.rose")
          : t("product.wine_type.sparkling");

  return (
    <motion.article
      className={cn(
        "group relative bg-white/95 rounded-xl sm:rounded-2xl",
        "border border-sand/60 shadow-[0_16px_42px_-32px_rgba(26,31,61,0.45)]",
        "transition-all duration-500 ease-out",
        "sm:hover:shadow-[0_24px_48px_-12px_rgba(26,31,61,0.12)]",
        "sm:hover:-translate-y-2",
        "overflow-visible mt-14 min-[430px]:mt-18 sm:mt-32 flex flex-col",
        "before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gold/45 before:to-transparent before:content-['']",
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
          "absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200",
          "bg-white/90 backdrop-blur-sm",
          "hover:bg-white hover:shadow-md",
          isInWishlist ? "text-wine shadow-sm" : "text-grey/40 hover:text-wine"
        )}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isInWishlist ? t("product.wishlist.remove") : t("product.wishlist.add")}
      >
        <HeartIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" filled={isInWishlist} aria-hidden="true" />
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
                {t("product.view")}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      <Link
        href={`/wijnen/${product.handle}`}
        className="flex flex-col flex-1"
        aria-label={t("product.view_aria", { title: product.title })}
      >
        {/* Image Container */}
        <div className="relative h-52 min-[430px]:h-56 sm:h-68 mx-3 sm:mx-4 -mt-10 min-[430px]:-mt-14 sm:-mt-22">
          {/* Background with grain */}
          <div className="absolute inset-0 bg-gradient-to-b from-champagne/70 via-cream to-white rounded-xl overflow-hidden ring-1 ring-gold/10">
            <div className="absolute inset-0 bg-grain opacity-[0.03]" />
            <div className="absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-wine/18 to-transparent" />
            <div className="absolute inset-x-10 bottom-5 h-3 rounded-full bg-wine/8 blur-md" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/90 to-transparent" />
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
              <Badge variant="new">{t("product.badge.new")}</Badge>
            )}
            {isOnSale && (
              <Badge variant="sale">-{discountPercentage}%</Badge>
            )}
            {!product.inStock && <Badge variant="soldout">{t("product.badge.soldout")}</Badge>}
            {product.inStock && product.stockQuantity != null && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <Badge variant="lowstock">
                {t("product.badge.low_stock", {
                  count: product.stockQuantity,
                  unit: product.stockQuantity === 1 ? t("product.unit.bottle_singular") : t("product.unit.bottle_plural"),
                })}
              </Badge>
            )}
            {product.hasAward && (
              <Badge variant="award">{product.awardText || t("product.badge.award")}</Badge>
            )}
          </div>

          {/* Wine Type Pill */}
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 z-10">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/92 backdrop-blur-sm shadow-sm",
              "text-[11px] sm:text-xs font-semibold text-charcoal/80 tracking-wide"
            )}>
              <div className={cn(
                "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full",
                product.wineType === "red" && "bg-wine-red",
                product.wineType === "white" && "bg-gold",
                product.wineType === "rose" && "bg-coral",
                product.wineType === "sparkling" && "bg-champagne border border-gold"
              )} />
              <span>{wineTypeLabel}</span>
            </div>
          </div>

          {/* Product Image */}
          <div className="absolute inset-0 -top-8 min-[430px]:-top-10 sm:-top-16 flex items-center justify-center">
            {product.images[0] ? (
              <div className="relative w-40 min-[430px]:w-44 sm:w-56 h-64 min-[430px]:h-72 sm:h-96">
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
                    sizes="(max-width: 430px) 176px, (max-width: 640px) 192px, 240px"
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
        <div className="mx-4 sm:mx-5 mt-1.5 sm:mt-2 mb-1.5 sm:mb-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-3 sm:px-5 pb-1 flex-1">
          {/* Region line — editorial small-caps */}
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-grey/60 font-medium mb-1 sm:mb-1.5 truncate">
            {product.region}
            {product.vintage && product.vintage !== t("product.details.vintage_code_non_vintage") && (
              <span className="text-gold/50 ml-1.5">
                &middot; {product.vintage}
              </span>
            )}
          </p>

          <h3 className="font-serif text-[15px] min-[430px]:text-[13px] sm:text-base font-semibold text-charcoal leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-wine transition-colors duration-300 mb-1.5 sm:mb-2">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="mb-1 sm:mb-1.5">
              <Rating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
              />
            </div>
          )}

          {/* Price */}
          <div className="mb-1.5 sm:mb-2">
            <PriceDisplay
              currentPrice={product.price}
              originalPrice={product.originalPrice}
            />
            {(priceUnitText || product.purchaseUnit) && (
              <p className="text-[10px] sm:text-xs text-grey mt-0.5">
                {priceUnitText ?? `per ${product.purchaseUnit?.toLowerCase()}`}
              </p>
            )}
          </div>

          {/* Wine Details — premium pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-h-[26px] sm:min-h-[28px] mb-3 sm:mb-4">
            {product.grapeVarieties.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-b from-white to-sand/30 border border-sand/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[10px] sm:text-[11px] text-charcoal/70 font-medium">
                <svg className="w-3 h-3 text-wine/40 shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5c-1.5 0-3 1-3.5 2.5-.3.8-.5 2-.5 3 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-1-.2-2.2-.5-3C11 2.5 9.5 1.5 8 1.5zM8 14c-.3 0-.5.2-.5.5v1a.5.5 0 001 0v-1c0-.3-.2-.5-.5-.5z"/></svg>
                {product.grapeVarieties.slice(0, 2).join(", ")}
              </span>
            )}
            {product.alcoholPercentage && !product.alcoholPercentage.toLowerCase().includes("etiket") && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-b from-white to-sand/30 border border-sand/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[10px] sm:text-[11px] text-charcoal/70 font-medium">
                <svg className="w-3 h-3 text-gold/60 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.5l2 1.5"/></svg>
                {product.alcoholPercentage}
              </span>
            )}
            {product.foodPairing && product.foodPairing.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-b from-white to-sand/30 border border-sand/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[10px] sm:text-[11px] text-charcoal/70 font-medium">
                <svg className="w-3 h-3 text-wine/40 shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M6 1v5c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V1m2 6v8m-2 0h4M11.5 1L10 5.5c-.2.6.3 1.2.9 1.2h3.2c.6 0 1.1-.6.9-1.2L13.5 1m-1 5.7V15m-2 0h4"/></svg>
                {product.foodPairing.slice(0, 2).join(", ")}
              </span>
            )}
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
              "group/btn relative w-full h-10 sm:h-11 rounded-xl text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer",
              "overflow-hidden transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              justAdded
                ? "bg-success text-white border border-success"
                : "bg-wine text-white border border-wine"
            )}
            whileTap={{ scale: 0.96 }}
          >
            {/* Liquid fill hover effect — rises from bottom like wine in a glass */}
            {!justAdded && !isAdding && (
              <span className="absolute inset-0 z-0">
                <span className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-gold/90 via-gold/70 to-gold/50 transition-all duration-500 ease-out group-hover/btn:h-full" />
                <span className="absolute inset-x-0 bottom-0 h-0 transition-all duration-700 ease-out group-hover/btn:h-full overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-btn-shimmer" />
                </span>
              </span>
            )}
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
                  {t("product.added")}
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex items-center justify-center drop-shadow-sm transition-all duration-300 group-hover/btn:tracking-[0.18em]"
                >
                  {t("product.add_to_cart_short")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNotifyOpen(true); }}
            className="w-full h-10 sm:h-11 rounded-xl text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] border border-wine/20 text-wine/60 bg-transparent hover:bg-wine hover:text-white hover:border-wine transition-all duration-300"
          >
            {t("product.notify_stock")}
          </button>
        )}
      </div>
      <div className="min-h-[20px]">
        {orderUnitText && product.inStock && (
          <p className="px-3 sm:px-5 pb-3 -mt-1 text-[10px] sm:text-xs text-grey text-center">
            {t("product.order.per_unit", { unit: orderUnitText })}
          </p>
        )}
      </div>

      {/* Notify Me Modal */}
      <NotifyMeModal
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        productTitle={product.title}
      />
    </motion.article>
  );
}
