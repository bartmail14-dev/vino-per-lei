"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@/types";
import { Badge, Rating, PriceDisplay, QuantitySelector, TasteProfile, redWineTasteProfile, whiteWineTasteProfile, roseTasteProfile } from "@/components/ui";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";
import type { TasteProfileItem } from "@/components/ui";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    product ? state.isInWishlist(product.id) : false
  );

  const handleAddToCart = async () => {
    if (!product || isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    addItem(product, quantity);
    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1000);
  };

  // Build taste profile
  const tasteProfileItems: TasteProfileItem[] = product?.tasteProfile
    ? (() => {
        const baseProfile =
          product.wineType === "red"
            ? redWineTasteProfile
            : product.wineType === "rose"
            ? roseTasteProfile
            : whiteWineTasteProfile;

        return baseProfile.map((item) => {
          let value = 3;
          if (item.leftLabel.toLowerCase().includes("droog")) {
            value = product.tasteProfile?.drySweet || 3;
          } else if (item.leftLabel.toLowerCase().includes("licht")) {
            value = product.tasteProfile?.lightFull || 3;
          } else if (
            item.leftLabel.toLowerCase().includes("zacht") ||
            item.leftLabel.toLowerCase().includes("fris")
          ) {
            value = product.tasteProfile?.softTannic || product.tasteProfile?.freshSoft || 3;
          } else if (item.leftLabel.toLowerCase().includes("fruitig")) {
            value = product.tasteProfile?.fruitySpicy || 3;
          }
          return { ...item, value };
        });
      })()
    : [];

  if (!product) return null;

  const isOnSale = product.originalPrice && product.originalPrice > product.price;

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110"
              aria-label="Sluiten"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 h-full overflow-y-auto md:overflow-hidden">
              {/* Left: Image */}
              <div className="relative bg-gradient-to-b from-warm-white to-sand/30 p-8 flex items-center justify-center min-h-[300px] md:min-h-full">
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <Badge variant="new">Nieuw</Badge>}
                  {isOnSale && <Badge variant="sale">Sale</Badge>}
                  {product.hasAward && (
                    <Badge variant="award">{product.awardText || "Award"}</Badge>
                  )}
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
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
                    src={product.images[0]?.url || ""}
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
                  <span>{Math.floor(Math.random() * 20) + 5} mensen bekijken dit nu</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <PriceDisplay
                    currentPrice={product.price}
                    originalPrice={product.originalPrice}
                    size="lg"
                  />
                </div>

                {/* Description */}
                <p className="text-grey mb-6 line-clamp-3">{product.description}</p>

                {/* Taste Profile Mini */}
                {tasteProfileItems.length > 0 && (
                  <div className="mb-6 p-4 bg-warm-white rounded-lg">
                    <h4 className="text-sm font-semibold mb-3">Smaakprofiel</h4>
                    <TasteProfile items={tasteProfileItems.slice(0, 2)} className="space-y-2" />
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-grey mb-1">Aantal</p>
                      <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        min={1}
                        max={product.stockQuantity || 99}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-grey mb-1">Totaal</p>
                      <p className="text-xl font-semibold text-charcoal">
                        €{(product.price * quantity).toFixed(2).replace(".", ",")}
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
                          Toegevoegd!
                        </>
                      ) : (
                        <>
                          <CartIcon className="w-5 h-5" />
                          Toevoegen aan winkelmand
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="w-full h-14 rounded-lg font-semibold border-2 border-wine text-wine hover:bg-wine hover:text-white transition-colors">
                      Mail mij bij voorraad
                    </button>
                  )}

                  {/* View full details link */}
                  <Link
                    href={`/wijnen/${product.handle}`}
                    className="block text-center text-wine font-medium hover:underline"
                    onClick={onClose}
                  >
                    Bekijk alle details →
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="mt-6 pt-6 border-t border-sand grid grid-cols-2 gap-3 text-sm text-grey">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-4 h-4 text-wine" />
                    <span>Gratis vanaf €35</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldIcon className="w-4 h-4 text-wine" />
                    <span>100% Proefgarantie</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Icons
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
