"use client";

import { useState, useRef, useEffect } from "react";
import { Section } from "@/components/layout";
import { Button, PriceDisplay, SavingsBadge, QuantitySelector } from "@/components/ui";
import { NotifyMeModal } from "@/components/ui/NotifyMeModal";
import {
  HeroSection,
  StickyPurchaseBar,
  FoodPairingGallery,
  WineDetailsAccordion,
  RegionSpotlight,
  ReviewSection,
  ProductCarousel,
} from "@/components/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { type Product } from "@/types";
import { cn } from "@/lib/utils";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { CheckIcon, HeartIcon, TruckIcon, ShieldIcon, ClockIcon } from "@/components/icons";
import { AlertTriangle } from "lucide-react";
import { useShopConfig } from "@/components/providers";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  activeRegionSlugs?: string[];
}

export function ProductDetailClient({ product, relatedProducts, activeRegionSlugs }: ProductDetailClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const { freeShippingThreshold } = useShopConfig();

  // Track view_item on mount
  useEffect(() => {
    trackViewItem({ title: product.title, id: product.id, price: product.price, category: product.wineType });
  }, [product.title, product.id, product.price, product.wineType]);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleAddToCart = async () => {
    if (isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    addItem(product, quantity);
    trackAddToCart({ title: product.title, id: product.id, price: product.price, quantity });
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
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
                  <Button variant="secondary" size="lg" fullWidth onClick={() => setNotifyOpen(true)}>
                    Mail bij voorraad
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
                <span className="text-grey">Gratis vanaf €{freeShippingThreshold}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span className="text-grey">Veilig betalen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span className="text-grey">1-2 werkdagen</span>
              </div>
            </div>

            {/* Allergeninformatie — EU LMIV 1169/2011 */}
            <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                <h4 className="font-semibold text-sm text-wine/80">Allergeninformatie</h4>
              </div>
              <p className="text-sm text-wine/60">Bevat sulfieten (SO₂). Kan sporen van ei-eiwitten en melkeiwitten bevatten (gebruikt bij het klaren van wijn).</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Trust Signals - Mobile only (above fold) */}
      <div className="sm:hidden px-4 py-3 bg-champagne/30">
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center gap-1">
            <TruckIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">Gratis €{freeShippingThreshold}+</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">Veilig betalen</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ClockIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">1-2 dagen</span>
          </div>
        </div>
        {/* Allergeninformatie — EU LMIV 1169/2011 */}
        <div className="mt-2 mx-4 p-3 bg-gold/5 border border-gold/20 rounded-lg">
          <div className="flex items-center gap-1.5 mb-0.5">
            <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={1.5} />
            <span className="font-semibold text-xs text-wine/80">Allergeninformatie</span>
          </div>
          <p className="text-xs text-wine/60">Bevat sulfieten (SO₂). Kan sporen van ei-eiwitten en melkeiwitten bevatten.</p>
        </div>
      </div>

      {/* Food Pairing Gallery */}
      <Section background="default" spacing="md" className="sm:py-12">
        <div className="max-w-5xl mx-auto">
          <FoodPairingGallery product={product} />
        </div>
      </Section>

      {/* Region Spotlight - Hide on small mobile to reduce page length */}
      <Section background="warm" spacing="md" className="hidden sm:block sm:py-12">
        <div className="max-w-6xl mx-auto">
          <RegionSpotlight product={product} activeRegionSlugs={activeRegionSlugs} />
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

          {/* Allergeninformatie — EU LMIV 1169/2011 */}
          <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-wine/80">Allergeninformatie</p>
              <p className="text-sm text-wine/60 mt-0.5">
                Bevat sulfieten (SO₂). Kan sporen van ei-eiwitten en melkeiwitten bevatten (gebruikt bij het klaren van wijn). Alcoholhoudende drank. Niet geschikt voor personen onder de 18 jaar.
              </p>
            </div>
          </div>
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

      {/* Notify Me Modal */}
      <NotifyMeModal
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        productTitle={product.title}
      />
    </>
  );
}
