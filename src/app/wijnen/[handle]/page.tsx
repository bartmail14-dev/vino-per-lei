"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Section, Grid } from "@/components/layout";
import {
  Button,
  Badge,
  Rating,
  PriceDisplay,
  SavingsBadge,
  QuantitySelector,
  TasteProfile,
  redWineTasteProfile,
  whiteWineTasteProfile,
  roseTasteProfile,
} from "@/components/ui";
import { ProductCard } from "@/components/product";
import { useCartStore } from "@/stores/cartStore";
import { mockProducts } from "@/data/mockProducts";
import { cn } from "@/lib/utils";
import type { TasteProfileItem } from "@/components/ui";

// Icons
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

const tabs = [
  { id: "description", label: "Beschrijving" },
  { id: "tasting", label: "Proefnotities" },
  { id: "pairing", label: "Lekker bij" },
  { id: "details", label: "Details" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const handle = params.handle as string;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Find product
  const product = useMemo(
    () => mockProducts.find((p) => p.handle === handle),
    [handle]
  );

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter((p) => p.id !== product.id && p.wineType === product.wineType)
      .slice(0, 4);
  }, [product]);

  // Build taste profile
  const tasteProfileItems = useMemo((): TasteProfileItem[] => {
    if (!product?.tasteProfile) return [];

    const baseProfile =
      product.wineType === "red"
        ? redWineTasteProfile
        : product.wineType === "rose"
        ? roseTasteProfile
        : whiteWineTasteProfile;

    return baseProfile.map((item) => {
      let value = 3; // default
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
  }, [product]);

  if (!product) {
    return (
      <Section background="default" spacing="xl">
        <div className="text-center py-16">
          <h1 className="text-h2 mb-4">Product niet gevonden</h1>
          <p className="text-grey mb-6">
            De wijn die je zoekt bestaat niet of is niet meer beschikbaar.
          </p>
          <Link
            href="/wijnen"
            className="inline-flex items-center justify-center font-semibold uppercase tracking-wide h-12 px-8 text-sm rounded bg-wine text-white hover:bg-wine-dark transition-colors"
          >
            Bekijk alle wijnen
          </Link>
        </div>
      </Section>
    );
  }

  const handleAddToCart = async () => {
    if (isAdding || !product.inStock) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    addItem(product, quantity);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const savings = isOnSale ? product.originalPrice! - product.price : 0;
  const savingsPercentage = isOnSale
    ? Math.round((savings / product.originalPrice!) * 100)
    : 0;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-warm-white border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-grey hover:text-wine">
              Home
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-grey" />
            <Link href="/wijnen" className="text-grey hover:text-wine">
              Wijnen
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-grey" />
            <span className="text-charcoal font-medium line-clamp-1">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <Section background="default" spacing="lg">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-b from-warm-white to-sand/30 rounded-lg overflow-hidden">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">Nieuw</Badge>}
                {isOnSale && <Badge variant="sale">-{savingsPercentage}%</Badge>}
                {!product.inStock && <Badge variant="soldout">Uitverkocht</Badge>}
                {product.hasAward && (
                  <Badge variant="award">{product.awardText || "Award"}</Badge>
                )}
              </div>

              {product.images[selectedImageIndex] && (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[selectedImageIndex].url}
                      alt={product.images[selectedImageIndex].altText || product.title}
                      fill
                      priority
                      className="object-contain drop-shadow-xl"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative w-20 h-24 rounded-md overflow-hidden border-2 transition-colors",
                      selectedImageIndex === index
                        ? "border-wine"
                        : "border-sand hover:border-grey"
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Collection */}
            {product.collection && (
              <p className="text-label text-grey mb-2">{product.collection}</p>
            )}

            {/* Title */}
            <h1 className="text-h1 mb-1">{product.title}</h1>

            {/* Vintage */}
            {product.vintage && (
              <p className="text-h4 text-grey mb-2">
                {product.vintage === "NV" ? "Non-Vintage" : product.vintage}
              </p>
            )}

            {/* Region */}
            <p className="text-body text-grey mb-4">
              {product.region}, {product.country}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="mb-6">
                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="lg"
                  showScore
                />
              </div>
            )}

            <hr className="border-sand mb-6" />

            {/* Short Description */}
            <p className="text-body-lg mb-6">{product.description}</p>

            <hr className="border-sand mb-6" />

            {/* Price */}
            <div className="mb-6">
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

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <div className="flex-1">
                <p className="text-sm text-grey mb-2 sm:invisible">Actie</p>
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
                        Toegevoegd aan winkelmand!
                      </>
                    ) : (
                      "Toevoegen aan winkelmand"
                    )}
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" fullWidth>
                    Mail mij bij voorraad
                  </Button>
                )}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-warm-white rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <TruckIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span>Gratis verzending vanaf €35</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span>100% Proefgarantie - Niet lekker? Geld terug</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ClockIcon className="w-5 h-5 text-wine flex-shrink-0" />
                <span>Binnen 1-2 werkdagen bezorgd</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Taste Profile */}
      {tasteProfileItems.length > 0 && (
        <Section background="warm" spacing="md">
          <div className="max-w-xl mx-auto">
            <h2 className="text-h3 mb-6 text-center">Smaakprofiel</h2>
            <TasteProfile items={tasteProfileItems} />
          </div>
        </Section>
      )}

      {/* Tabs Section */}
      <Section background="default" spacing="lg">
        {/* Tab Headers */}
        <div className="border-b border-sand mb-8">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 text-body font-medium whitespace-nowrap transition-colors relative",
                  activeTab === tab.id
                    ? "text-wine"
                    : "text-grey hover:text-charcoal"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-wine"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl">
          {activeTab === "description" && (
            <div className="prose prose-wine">
              <p className="text-body-lg mb-4">{product.description}</p>
              <p className="text-body text-grey">
                Deze wijn is perfect voor een bijzonder diner of om te bewaren
                voor een speciale gelegenheid. De elegante structuur en
                complexiteit maken het een wijn die zowel nu genoten kan worden
                als nog enkele jaren kan rijpen.
              </p>
            </div>
          )}

          {activeTab === "tasting" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Geur</h4>
                <p className="text-grey">
                  {product.wineType === "red"
                    ? "Intense aroma's van rijp donker fruit, zwarte kers en cassis, aangevuld met subtiele tonen van vanille en cederhout van de eiken rijping."
                    : product.wineType === "white"
                    ? "Fris en elegant met tonen van citrus, groene appel en witte bloemen, met een minerale ondertoon."
                    : "Delicate geuren van rood fruit, aardbeien en watermeloen, met hints van mediterrane kruiden."}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Smaak</h4>
                <p className="text-grey">
                  {product.wineType === "red"
                    ? "Vol en rond in de mond met fluweelzachte tannines. Smaken van bramen en pruimen leiden naar een lange, elegante afdronk."
                    : product.wineType === "white"
                    ? "Verfrissend en levendig met een mooie zuurgraad. De smaak is zuiver en clean met een aangename mineraliteit."
                    : "Licht en verfrissend met een zachte textuur. Smaken van rood fruit en een aangename frisheid."}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Afdronk</h4>
                <p className="text-grey">
                  Lang en elegant met een mooie balans tussen fruit en structuur.
                </p>
              </div>
            </div>
          )}

          {activeTab === "pairing" && (
            <div className="space-y-4">
              <p className="text-body-lg mb-6">
                Deze wijn combineert uitstekend met:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {(product.wineType === "red"
                  ? [
                      "Biefstuk of entrecote",
                      "Lamsbout met rozemarijn",
                      "Wild zwijn of hert",
                      "Gerijpte kazen",
                      "Paddenstoelen risotto",
                      "Donkere chocolade",
                    ]
                  : product.wineType === "white"
                  ? [
                      "Gegrilde vis",
                      "Zeevruchten en schaaldieren",
                      "Kip met citroensaus",
                      "Lichte pasta's",
                      "Verse geitenkaas",
                      "Salade met gegrilde groenten",
                    ]
                  : [
                      "Mediterrane gerechten",
                      "Gegrilde vis",
                      "Lichte salades",
                      "Zachte kazen",
                      "Fruit desserts",
                      "Tapas",
                    ]
                ).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-success flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "details" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Druivenras", value: product.grapeVarieties.join(", ") },
                { label: "Land", value: product.country },
                { label: "Regio", value: product.region },
                {
                  label: "Jaargang",
                  value: product.vintage === "NV" ? "Non-Vintage" : product.vintage,
                },
                { label: "Alcohol", value: "13.5%" },
                { label: "Inhoud", value: "750ml" },
                { label: "Serveertemperatuur", value: product.wineType === "red" ? "16-18°C" : "8-10°C" },
                { label: "Sluiting", value: "Kurk" },
              ].map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between py-3 border-b border-sand"
                >
                  <span className="text-grey">{detail.label}</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section background="warm" spacing="lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-h2">Anderen bekeken ook</h2>
            <Link
              href="/wijnen"
              className="text-wine font-medium hover:underline hidden sm:flex items-center gap-1"
            >
              Bekijk alles
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <Grid cols={4} gap="md">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </Grid>
        </Section>
      )}
    </>
  );
}
