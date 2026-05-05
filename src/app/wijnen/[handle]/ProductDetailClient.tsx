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
  ProductCarousel,
} from "@/components/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiCopy } from "@/components/providers";
import { type Product } from "@/types";
import { cn } from "@/lib/utils";
import { getOrderIncrement, getOrderMaximum, getOrderMinimum, getOrderUnitText, getPriceUnitText } from "@/lib/order-rules";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { CheckIcon, HeartIcon, ShieldIcon, ClockIcon } from "@/components/icons";
import { AlertTriangle } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  activeRegionSlugs?: string[];
}

export function ProductDetailClient({ product, relatedProducts, activeRegionSlugs }: ProductDetailClientProps) {
  const t = useUiCopy();
  const heroRef = useRef<HTMLElement>(null);
  const [quantity, setQuantity] = useState(() => getOrderMinimum(product));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  // Track view_item on mount
  useEffect(() => {
    trackViewItem({ title: product.title, id: product.id, price: product.price, category: product.wineType });
  }, [product.title, product.id, product.price, product.wineType]);
  useEffect(() => {
    setQuantity(getOrderMinimum(product));
  }, [product]);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const rawIsInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const isInWishlist = isAuthenticated && rawIsInWishlist;

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
  const orderMinimum = getOrderMinimum(product);
  const orderIncrement = getOrderIncrement(product);
  const orderMaximum = getOrderMaximum(product);
  const orderUnitText = getOrderUnitText(product);
  const priceUnitText = getPriceUnitText(product);
  const allergenText = [product.allergens, product.legalNotice].filter(Boolean).join(" ");

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
                {(priceUnitText || product.purchaseUnit) && (
                  <p className="text-sm text-grey mt-1">
                    {priceUnitText ?? `per ${product.purchaseUnit?.toLowerCase()}`}
                  </p>
                )}
                {isOnSale && (
                  <div className="mt-2">
                    <SavingsBadge amount={savings} percentage={savingsPercentage} />
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <p className="text-sm text-grey mb-2">{t("product.quantity.label")}</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={orderMinimum}
                  max={orderMaximum}
                  step={orderIncrement}
                  disabled={!product.inStock}
                />
                {orderUnitText && (
                  <p className="text-xs text-grey mt-1">{t("product.order.per_prefix")} {orderUnitText}</p>
                )}
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
                        {t("product.added_exclamation")}
                      </>
                    ) : (
                      t("product.in_cart")
                    )}
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" fullWidth onClick={() => setNotifyOpen(true)}>
                    {t("product.notify_stock")}
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
                  {isInWishlist ? t("product.wishlist.in") : t("product.wishlist.label")}
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-sand/50">
              <div className="flex items-center gap-2 text-sm">
                <ShieldIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span className="text-grey">{t("product.secure_payment")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span className="text-grey">{t("product.delivery.desktop")}</span>
              </div>
            </div>

            {/* Allergeninformatie — EU LMIV 1169/2011 */}
            {allergenText && (
            <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                <h4 className="font-semibold text-sm text-wine/80">{t("product.allergen_info")}</h4>
              </div>
              <p className="text-sm text-wine/60">{allergenText}</p>
            </div>
            )}
          </div>
        </div>
      </Section>

      {/* Trust Signals - Mobile only (above fold) */}
      <div className="sm:hidden px-4 py-3 bg-champagne/30">
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center gap-1">
            <ShieldIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">{t("product.secure_payment")}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ClockIcon className="w-5 h-5 text-wine" />
            <span className="text-xs text-grey">{t("product.delivery.mobile")}</span>
          </div>
        </div>
        {/* Allergeninformatie — EU LMIV 1169/2011 */}
        {allergenText && (
        <div className="mt-2 mx-4 p-3 bg-gold/5 border border-gold/20 rounded-lg">
          <div className="flex items-center gap-1.5 mb-0.5">
            <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={1.5} />
            <span className="font-semibold text-xs text-wine/80">{t("product.allergen_info")}</span>
          </div>
          <p className="text-xs text-wine/60">{allergenText}</p>
        </div>
        )}
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
              {t("product.all_details")}
            </h2>
          </div>
          <WineDetailsAccordion product={product} />

          {/* Allergeninformatie — EU LMIV 1169/2011 */}
          {allergenText && (
          <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-wine/80">{t("product.allergen_info")}</p>
              <p className="text-sm text-wine/60 mt-0.5">{allergenText}</p>
            </div>
          </div>
          )}
        </div>
      </Section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section background="default" spacing="md" className="sm:py-12">
          <ProductCarousel
            products={relatedProducts}
            title={t("product.related.title")}
            subtitle={product.wineType === "red" ? t("product.related.more_red") : product.wineType === "white" ? t("product.related.more_white") : t("product.related.more_default")}
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
