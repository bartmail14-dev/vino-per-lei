"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@/types";
import { Badge, Rating, PriceDisplay, QuantitySelector } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiCopy } from "@/components/providers";
import { cn, wineImagePresets } from "@/lib/utils";
import { getOrderIncrement, getOrderMaximum, getOrderMinimum, getOrderUnitText, getPriceUnitText } from "@/lib/order-rules";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CloseIcon, HeartIcon, EyeIcon, CartIcon, CheckIcon, ShieldIcon, LoadingSpinner } from "@/components/icons";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const t = useUiCopy();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [viewerCount, setViewerCount] = useState(12);

  // Set random viewer count client-side only to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewerCount(Math.floor(Math.random() * 20) + 5);
  }, []);

  const focusTrapRef = useFocusTrap<HTMLDivElement>({ active: isOpen, onEscape: onClose });

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const rawIsInWishlist = useWishlistStore((state) =>
    product ? state.isInWishlist(product.id) : false
  );
  const { isAuthenticated, openLoginModal } = useAuthStore();

  const handleAddToCart = async () => {
    if (!product || isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    addItem(product, Math.max(quantity, getOrderMinimum(product)));
    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1000);
  };

  if (!product) return null;

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const orderMinimum = getOrderMinimum(product);
  const orderIncrement = getOrderIncrement(product);
  const orderMaximum = getOrderMaximum(product);
  const orderUnitText = getOrderUnitText(product);
  const priceUnitText = getPriceUnitText(product);
  const selectedQuantity = Math.max(quantity, orderMinimum);
  const isInWishlist = isAuthenticated && rawIsInWishlist;

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      openLoginModal(() => toggleWishlist(product));
      return;
    }
    toggleWishlist(product);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            ref={focusTrapRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t("product.quick_view.aria", { title: product.title })}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110"
              aria-label={t("common.close")}
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 h-full overflow-y-auto md:overflow-hidden">
              {/* Left: Image */}
              <div className="relative bg-gradient-to-b from-warm-white to-sand/30 p-8 flex items-center justify-center min-h-[300px] md:min-h-full">
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <Badge variant="new">{t("product.badge.new")}</Badge>}
                  {isOnSale && <Badge variant="sale">{t("product.badge.sale")}</Badge>}
                  {product.hasAward && (
                    <Badge variant="award">{product.awardText || t("product.badge.award")}</Badge>
                  )}
                </div>

                {/* Wishlist */}
                <button
                  onClick={handleToggleWishlist}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-full transition-all",
                    "bg-white/80 hover:bg-white shadow-sm hover:shadow-md hover:scale-110",
                    isInWishlist && "text-wine"
                  )}
                >
                  <HeartIcon className="w-5 h-5" filled={isInWishlist} />
                </button>

                <div className="relative w-full h-64 md:h-96">
                  <Image
                    src={wineImagePresets.cardLarge(product.images[0]?.url || "")}
                    alt={product.title}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Right: Details */}
              <div className="p-6 md:p-8 md:overflow-y-auto">
                {/* Collection */}
                {product.collection && (
                  <p className="text-sm text-wine font-medium mb-1">{product.collection}</p>
                )}

                {/* Title */}
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-1">
                  {product.title}
                </h2>

                {/* Vintage & Region */}
                <p className="text-grey mb-3">
                  {product.vintage && `${product.vintage} · `}
                  {product.region}, {product.country}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="mb-4">
                    <Rating rating={product.rating} reviewCount={product.reviewCount} />
                  </div>
                )}

                {/* Social Proof */}
                <div className="flex items-center gap-2 text-sm text-grey mb-4">
                  <EyeIcon className="w-4 h-4" />
                  <span>{t("product.viewer_count", { count: viewerCount })}</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <PriceDisplay
                    currentPrice={product.price}
                    originalPrice={product.originalPrice}
                    size="lg"
                  />
                  {priceUnitText && (
                    <p className="text-sm text-grey mt-1">{priceUnitText}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-grey mb-6 line-clamp-3">{product.description}</p>

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-grey mb-1">{t("product.quantity.label")}</p>
                      <QuantitySelector
                        value={selectedQuantity}
                        onChange={setQuantity}
                        min={orderMinimum}
                        max={orderMaximum}
                        step={orderIncrement}
                      />
                      {orderUnitText && (
                        <p className="text-xs text-grey mt-1">{t("product.order.per_prefix")} {orderUnitText}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-grey mb-1">{t("product.total")}</p>
                      <p className="text-xl font-semibold text-charcoal">
                        €{(product.price * selectedQuantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>

                  {product.inStock ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className={cn(
                        "w-full h-14 rounded-lg font-semibold text-white transition-all",
                        "flex items-center justify-center gap-2",
                        justAdded
                          ? "bg-success"
                          : "bg-wine hover:bg-wine-dark active:scale-[0.98]"
                      )}
                    >
                      {isAdding ? (
                        <LoadingSpinner />
                      ) : justAdded ? (
                        <>
                          <CheckIcon className="w-5 h-5" />
                          {t("product.added_exclamation")}
                        </>
                      ) : (
                        <>
                          <CartIcon className="w-5 h-5" />
                          {t("product.add_to_cart_full")}
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="w-full h-14 rounded-lg font-semibold border-2 border-wine text-wine hover:bg-wine hover:text-white transition-colors">
                      {t("product.notify_stock_full")}
                    </button>
                  )}

                  {/* View full details link */}
                  <Link
                    href={`/wijnen/${product.handle}`}
                    className="block text-center text-wine font-medium hover:underline"
                    onClick={onClose}
                  >
                    {t("product.full_details")}
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="mt-6 pt-6 border-t border-sand flex items-center gap-2 text-sm text-grey">
                  <ShieldIcon className="w-4 h-4 text-wine" />
                  <span>{t("product.secure_payment")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

