"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Section } from "@/components/layout";
import { Button, PriceDisplay, SavingsBadge, QuantitySelector } from "@/components/ui";
import {
  HeroSection,
  StickyPurchaseBar,
  EnhancedTasteProfile,
  TastingExperience,
  FoodPairingGallery,
  WineDetailsAccordion,
  RegionSpotlight,
  ReviewSection,
  ProductCarousel,
} from "@/components/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { type Product } from "@/types";
import { cn } from "@/lib/utils";
import { CheckIcon, HeartIcon, TruckIcon, ShieldIcon, ClockIcon } from "@/components/icons";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const { isAuthenticated, openLoginModal } = useAuthStore();

  const handleAddToCart = async () => {
    if (isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    addItem(product, quantity);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      openLoginModal(() => toggleWishlist(product));
      return;
    }
    toggleWishlist(product);
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const savings = isOnSale ? product.originalPrice! - product.price : 0;
  const savingsPercentage = isOnSale
    ? Math.round((savings / product.originalPrice!) * 100)
    : 0;

  return (
    <>
      {/* Sticky Purchase Bar - appears on scroll */}
      <StickyPurchaseBar
        product={product}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        isAdding={isAdding}
        justAdded={justAdded}
        heroRef={heroRef}
      />

      {/* Hero Section */}
      <section ref={heroRef}>
        <HeroSection
          product={product}
          selectedImageIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
        />
      </section>

      {/* Purchase Section - Hidden on mobile (sticky bar handles it), visible on desktop */}
      <Section background="default" spacing="md" className="hidden sm:block">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-sand/50 p-6 sm:p-8 shadow-sm">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              {/* Price */}
              <div>
                <PriceDisplay
                  currentPrice={product.price}
                  originalPrice={product.originalPrice}
                  size="lg"
                  showSavings={!!isOnSale}
                />
                {isOnSale && (
                  <div className="mt-2">
                    <SavingsBadge amount={savings} percentage={savingsPercentage} />
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <p className="text-sm text-grey mb-2">Aantal</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.stockQuantity || 99}
                  disabled={!product.inStock}
                />
              </div>

              {/* Add to Cart */}
              <div>
                {product.inStock ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    isLoading={isAdding}
                    disabled={isAdding}
                    className={cn(justAdded && "bg-success hover:bg-success")}
                  >
                    {justAdded ? (
                      <>
                        <CheckIcon className="w-5 h-5 mr-2" />
                        Toegevoegd!
                      </>
                    ) : (
                      "In Winkelmand"
                    )}
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" fullWidth>
                    Notify me
                  </Button>
                )}
              </div>

              {/* Wishlist */}
              <div>
                <button
                  onClick={handleToggleWishlist}
                  className={cn(
                    "w-full h-12 rounded-lg border-2 flex items-center justify-center gap-2 font-medium transition-colors",
                    isInWishlist
                      ? "border-wine bg-wine/5 text-wine"
                      : "border-sand hover:border-wine hover:text-wine"
                  )}
                >
                  <HeartIcon className="w-5 h-5" filled={isInWishlist} />
                  {isInWishlist ? "In Verlanglijst" : "Verlanglijst"}
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-sand/50">
              <div className="flex items-center gap-2 text-sm">
                <TruckIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span className="text-grey">Gratis vanaf €35</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span className="text-grey">Proefgarantie</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span className="text-grey">1-2 werkdagen</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Trust Signals - Mobile only (above fold) */}
      <div className="sm:hidden px-4 py-3 bg-champagne/30">
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center gap-1">
            <TruckIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">Gratis €35+</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">Proefgarantie</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ClockIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">1-2 dagen</span>
          </div>
        </div>
      </div>

      {/* Enhanced Taste Profile */}
      {product.tasteProfile && (
        <Section background="default" spacing="md" className="sm:py-12">
          <div className="max-w-5xl mx-auto">
            <EnhancedTasteProfile product={product} />
          </div>
        </Section>
      )}

      {/* Tasting Experience */}
      <Section background="warm" spacing="md" className="sm:py-12">
        <div className="max-w-5xl mx-auto">
          <TastingExperience product={product} />
        </div>
      </Section>

      {/* Food Pairing Gallery */}
      <Section background="default" spacing="md" className="sm:py-12">
        <div className="max-w-5xl mx-auto">
          <FoodPairingGallery product={product} />
        </div>
      </Section>

      {/* Region Spotlight - Hide on small mobile to reduce page length */}
      <Section background="warm" spacing="md" className="hidden sm:block sm:py-12">
        <div className="max-w-6xl mx-auto">
          <RegionSpotlight product={product} />
        </div>
      </Section>

      {/* Wine Details Accordion */}
      <Section background="default" spacing="md" className="sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-charcoal">
              Alle Details
            </h2>
          </div>
          <WineDetailsAccordion product={product} />
        </div>
      </Section>

      {/* Reviews */}
      <Section background="warm" spacing="md" className="sm:py-12">
        <div className="max-w-5xl mx-auto">
          <ReviewSection product={product} />
        </div>
      </Section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section background="default" spacing="md" className="sm:py-12">
          <ProductCarousel
            products={relatedProducts}
            title="Ook interessant"
            subtitle={`Meer ${product.wineType === "red" ? "rode wijnen" : product.wineType === "white" ? "witte wijnen" : "wijnen"}`}
            viewAllHref={`/wijnen?type=${product.wineType}`}
          />
        </Section>
      )}

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-24 lg:h-0" />
    </>
  );
}
