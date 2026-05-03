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
        "overflow-visible mt-10 min-[430px]:mt-14 sm:mt-28",
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
        className="block"
        aria-label={t("product.view_aria", { title: product.title })}
      >
        {/* Image Container */}
        <div className="relative h-40 min-[430px]:h-44 sm:h-48 mx-3 sm:mx-4 -mt-9 min-[430px]:-mt-12 sm:-mt-20">
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
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10">
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm",
              "text-[10px] sm:text-[11px] font-medium text-charcoal/70 tracking-wide"
            )}>
              <div className={cn(
                "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                product.wineType === "red" && "bg-wine-red",
                product.wineType === "white" && "bg-gold",
                product.wineType === "rose" && "bg-coral",
                product.wineType === "sparkling" && "bg-champagne border border-gold"
              )} />
              <span>{wineTypeLabel}</span>
            </div>
          </div>

          {/* Product Image */}
          <div className="absolute inset-0 -top-6 min-[430px]:-top-8 sm:-top-16 flex items-center justify-center">
            {product.images[0] ? (
              <div className="relative w-24 min-[430px]:w-28 sm:w-36 h-44 min-[430px]:h-52 sm:h-72">
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
                    sizes="(max-width: 430px) 96px, (max-width: 640px) 112px, 176px"
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
            {product.vintage && product.vintage !== t("product.details.vintage_code_non_vintage") && (
              <span className="text-gold/50 ml-1.5">
                &middot; {product.vintage}
              </span>
            )}
          </p>

          <h3 className="font-serif text-[15px] min-[430px]:text-[13px] sm:text-base font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-wine transition-colors duration-300 mb-1.5 sm:mb-2">
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
            {priceUnitText && (
              <p className="text-[10px] sm:text-xs text-grey mt-0.5">{priceUnitText}</p>
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
              "relative w-full h-10 sm:h-11 rounded-xl text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer",
              "overflow-hidden transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              justAdded
                ? "bg-success text-white border border-success"
                : "bg-gradient-to-r from-wine/[0.03] via-white to-gold/[0.05] text-wine border border-wine/20 hover:bg-wine hover:text-white hover:border-wine"
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
                  {t("product.added")}
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex items-center justify-center"
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
      {orderUnitText && product.inStock && (
        <p className="px-3 sm:px-5 pb-3 -mt-1 text-[10px] sm:text-xs text-grey text-center">
          {t("product.order.per_unit", { unit: orderUnitText })}
        </p>
      )}

      {/* Notify Me Modal */}
      <NotifyMeModal
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        productTitle={product.title}
      />
    </motion.article>
  );
}
