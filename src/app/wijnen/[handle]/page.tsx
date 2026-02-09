"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
import { useWishlistStore } from "@/stores/wishlistStore";
import { useRecentlyViewedStore } from "@/stores/recentlyViewedStore";
import { mockProducts } from "@/data/mockProducts";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { TasteProfileItem } from "@/components/ui";

// ─── Icon Components ────────────────────────────────────────────────────────

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
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

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function MedalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function GrapeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="3" />
      <circle cx="8" cy="13" r="3" />
      <circle cx="16" cy="13" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M12 5V2" />
      <path d="M12 2c2 0 3 1 4 2" />
    </svg>
  );
}

function ThermometerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function WineGlassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2h8l-1 9a5 5 0 0 1-6 0L8 2z" />
      <path d="M12 11v7" />
      <path d="M8 18h8" />
    </svg>
  );
}

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} strokeWidth="1.5">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// ─── Food Pairing Icons ─────────────────────────────────────────────────────

function MeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15.5 2.5C17.5 4.5 18 8 16 12C14 16 10 18 6 18C4 18 2.5 17 2 15.5" />
      <path d="M2 15.5C2 13 4 10 7 8C10 6 13 5 15.5 2.5" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="9" r="1" fill="currentColor" />
    </svg>
  );
}

function CheeseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12L12 2l10 10v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8z" />
      <circle cx="8" cy="16" r="1.5" />
      <circle cx="14" cy="14" r="1" />
      <circle cx="11" cy="18" r="0.75" />
    </svg>
  );
}

function PastaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 16C4 16 6 20 12 20C18 20 20 16 20 16" />
      <path d="M4 16C4 14 8 12 12 12C16 12 20 14 20 16" />
      <path d="M8 12C7 8 9 4 12 4C15 4 17 8 16 12" />
    </svg>
  );
}

function FishIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6.5 12C6.5 12 10 6 17 6C17 6 20 9 20 12C20 15 17 18 17 18C10 18 6.5 12 6.5 12Z" />
      <path d="M4 12L6.5 9.5L6.5 14.5L4 12Z" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function DessertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3C16.5 3 20 6 20 10H4C4 6 7.5 3 12 3Z" />
      <rect x="3" y="10" width="18" height="4" rx="1" />
      <path d="M8 14V18" />
      <path d="M16 14V18" />
      <rect x="6" y="18" width="12" height="3" rx="1" />
    </svg>
  );
}

function VegetableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C9 2 7 5 7 8C7 11 9 14 12 14C15 14 17 11 17 8C17 5 15 2 12 2Z" />
      <path d="M12 14V22" />
      <path d="M9 17L12 14L15 17" />
    </svg>
  );
}

// ─── Animated Section Wrapper ───────────────────────────────────────────────

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Collapsible Section (mobile-friendly) ──────────────────────────────────

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-sand/60 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="flex items-center gap-3">
          {icon}
          <span className="font-serif text-lg font-semibold text-charcoal group-hover:text-wine transition-colors">
            {title}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-grey" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mock Review Data ───────────────────────────────────────────────────────

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  verified: boolean;
}

function generateMockReviews(productId: string, wineType: string): Review[] {
  const reviews: Review[] = [
    {
      id: "r1",
      author: "Jan de Vries",
      date: "12 januari 2026",
      rating: 5,
      title: "Absolute topwijn!",
      text: "Deze wijn overtreft alle verwachtingen. Prachtige aroma's en een fluwelen afdronk. Perfect bij ons kerstdiner geserveerd.",
      verified: true,
    },
    {
      id: "r2",
      author: "Sophie van der Berg",
      date: "28 december 2025",
      rating: 4,
      title: "Heerlijke ontdekking",
      text: "Op advies van Vino per Lei besteld en niet teleurgesteld. Mooie balans en complexiteit. Zeker voor herhaling vatbaar.",
      verified: true,
    },
    {
      id: "r3",
      author: "Peter Bakker",
      date: "15 november 2025",
      rating: 5,
      title: "Geweldige prijs-kwaliteit",
      text: "Voor deze prijs een uitzonderlijke wijn. De smaak is rijk en vol, met een lange afdronk. Snelle levering ook!",
      verified: true,
    },
  ];

  if (wineType === "white" || wineType === "sparkling") {
    reviews[0] = {
      ...reviews[0],
      title: "Verfrissend en elegant",
      text: "Prachtige frisheid met complexe aroma's. Geweldig als aperitief maar ook prima bij vis. Een van de betere witte wijnen die ik heb geproefd.",
    };
  }

  return reviews;
}

// ─── Rating Breakdown ───────────────────────────────────────────────────────

function RatingBreakdown({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  // Generate plausible breakdown
  const total = reviewCount;
  const fiveStar = Math.round(total * (rating >= 4.8 ? 0.72 : rating >= 4.5 ? 0.58 : 0.45));
  const fourStar = Math.round(total * (rating >= 4.8 ? 0.20 : rating >= 4.5 ? 0.28 : 0.30));
  const threeStar = Math.round(total * (rating >= 4.8 ? 0.05 : rating >= 4.5 ? 0.10 : 0.15));
  const twoStar = Math.round(total * 0.02);
  const oneStar = total - fiveStar - fourStar - threeStar - twoStar;

  const breakdown = [
    { stars: 5, count: fiveStar },
    { stars: 4, count: fourStar },
    { stars: 3, count: threeStar },
    { stars: 2, count: twoStar },
    { stars: 1, count: Math.max(0, oneStar) },
  ];

  return (
    <div className="space-y-2">
      {breakdown.map(({ stars, count }) => (
        <div key={stars} className="flex items-center gap-3">
          <span className="text-sm text-grey w-6 text-right">{stars}</span>
          <StarIcon className="w-4 h-4 text-gold" filled />
          <div className="flex-1 h-2 bg-sand/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (5 - stars) * 0.1, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm text-grey w-10 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams();
  const handle = params.handle as string;

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    mockProducts.find((p) => p.handle === handle)
      ? state.isInWishlist(mockProducts.find((p) => p.handle === handle)!.id)
      : false
  );
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addRecentlyViewed);

  const ctaRef = useRef<HTMLDivElement>(null);

  // Find product
  const product = useMemo(
    () => mockProducts.find((p) => p.handle === handle),
    [handle]
  );

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product, addRecentlyViewed]);

  // Sticky bar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (ctaRef.current) {
        const rect = ctaRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, [product]);

  // Mock reviews
  const reviews = useMemo(
    () => (product ? generateMockReviews(product.id, product.wineType) : []),
    [product]
  );

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

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const savings = isOnSale ? product.originalPrice! - product.price : 0;
  const savingsPercentage = isOnSale
    ? Math.round((savings / product.originalPrice!) * 100)
    : 0;

  const isLowStock = product.inStock && product.stockQuantity !== undefined && product.stockQuantity <= 10;

  // Food pairings based on wine type
  const foodPairings =
    product.wineType === "red"
      ? [
          { icon: <MeatIcon className="w-7 h-7" />, name: "Biefstuk & Entrecote", desc: "Medium-rare gebakken" },
          { icon: <PastaIcon className="w-7 h-7" />, name: "Pasta met Ragout", desc: "Tagliatelle al ragu" },
          { icon: <CheeseIcon className="w-7 h-7" />, name: "Gerijpte Kazen", desc: "Parmigiano, Pecorino" },
          { icon: <MeatIcon className="w-7 h-7" />, name: "Wild & Stoofvlees", desc: "Lamsbout, brasato" },
          { icon: <DessertIcon className="w-7 h-7" />, name: "Donkere Chocolade", desc: "70% cacao of hoger" },
          { icon: <VegetableIcon className="w-7 h-7" />, name: "Paddenstoelen", desc: "Risotto ai funghi" },
        ]
      : product.wineType === "white"
      ? [
          { icon: <FishIcon className="w-7 h-7" />, name: "Gegrilde Vis", desc: "Zeebaars, dorade" },
          { icon: <FishIcon className="w-7 h-7" />, name: "Zeevruchten", desc: "Garnalen, mosselen" },
          { icon: <PastaIcon className="w-7 h-7" />, name: "Lichte Pasta", desc: "Linguine vongole" },
          { icon: <CheeseIcon className="w-7 h-7" />, name: "Verse Kazen", desc: "Burrata, mozzarella" },
          { icon: <VegetableIcon className="w-7 h-7" />, name: "Gegrilde Groenten", desc: "Courgette, paprika" },
          { icon: <MeatIcon className="w-7 h-7" />, name: "Kip & Kalkoen", desc: "Met citroensaus" },
        ]
      : product.wineType === "rose"
      ? [
          { icon: <FishIcon className="w-7 h-7" />, name: "Mediterrane Vis", desc: "Gegrild of rauw" },
          { icon: <VegetableIcon className="w-7 h-7" />, name: "Verse Salades", desc: "Met geitenkaas" },
          { icon: <PastaIcon className="w-7 h-7" />, name: "Lichte Pasta", desc: "Pesto, olijfolie" },
          { icon: <CheeseIcon className="w-7 h-7" />, name: "Zachte Kazen", desc: "Brie, camembert" },
          { icon: <DessertIcon className="w-7 h-7" />, name: "Fruit Desserts", desc: "Aardbeien, frambozen" },
          { icon: <MeatIcon className="w-7 h-7" />, name: "Tapas", desc: "Bruschetta, antipasti" },
        ]
      : [
          { icon: <FishIcon className="w-7 h-7" />, name: "Oesters & Caviaar", desc: "Als aperitief" },
          { icon: <CheeseIcon className="w-7 h-7" />, name: "Lichte Hapjes", desc: "Blini, crostini" },
          { icon: <DessertIcon className="w-7 h-7" />, name: "Fruit & Gebak", desc: "Taart, crème brûlée" },
          { icon: <FishIcon className="w-7 h-7" />, name: "Zeevruchten", desc: "Kreeft, langoustine" },
          { icon: <PastaIcon className="w-7 h-7" />, name: "Risotto", desc: "Met zeevruchtensaus" },
          { icon: <VegetableIcon className="w-7 h-7" />, name: "Sushi", desc: "Verse nigiri" },
        ];

  // Technical details
  const technicalDetails = [
    { icon: <GrapeIcon className="w-5 h-5" />, label: "Druivenras", value: product.grapeVarieties.join(", ") },
    { icon: <DropletIcon className="w-5 h-5" />, label: "Alcohol", value: product.wineType === "sparkling" ? "11.5%" : product.wineType === "white" ? "12.5%" : "13.5%" },
    { icon: <ThermometerIcon className="w-5 h-5" />, label: "Serveertemperatuur", value: product.wineType === "red" ? "16-18°C" : product.wineType === "sparkling" ? "6-8°C" : "8-10°C" },
    { icon: <WineGlassIcon className="w-5 h-5" />, label: "Inhoud", value: "750 ml" },
  ];

  // Tasting notes based on wine type
  const tastingNotes =
    product.wineType === "red"
      ? {
          geur: "Intense aroma's van rijp donker fruit, zwarte kers en cassis, aangevuld met subtiele tonen van vanille en cederhout van de eiken rijping.",
          smaak: "Vol en rond in de mond met fluweelzachte tannines. Smaken van bramen en pruimen leiden naar een lange, elegante afdronk.",
          afdronk: "Lang en elegant met een mooie balans tussen fruit en structuur. Subtiele tonen van specerijen en chocolade.",
        }
      : product.wineType === "white"
      ? {
          geur: "Fris en elegant met tonen van citrus, groene appel en witte bloemen, met een minerale ondertoon.",
          smaak: "Verfrissend en levendig met een mooie zuurgraad. De smaak is zuiver en clean met een aangename mineraliteit.",
          afdronk: "Middellang met een frisse, minerale nasmaak die uitnodigt tot de volgende slok.",
        }
      : product.wineType === "rose"
      ? {
          geur: "Delicate geuren van rood fruit, aardbeien en watermeloen, met hints van mediterrane kruiden.",
          smaak: "Licht en verfrissend met een zachte textuur. Smaken van rood fruit en een aangename frisheid.",
          afdronk: "Kort en verfrissend met een fruitige, elegante nasmaak.",
        }
      : {
          geur: "Fijne perlage met aroma's van groene appel, citrus en delicate witte bloemen.",
          smaak: "Levendig en elegant met een fijne mousse. Smaken van peer, amandel en een vleugje brioche.",
          afdronk: "Fris en schoon met een aangename, droge afdronk.",
        };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-warm-white border-b border-sand/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/" className="text-grey/70 hover:text-wine transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-grey/40" />
            <Link href="/wijnen" className="text-grey/70 hover:text-wine transition-colors">
              Wijnen
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-grey/40" />
            <Link
              href={`/wijnen?region=${product.region.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-grey/70 hover:text-wine transition-colors"
            >
              {product.region}
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-grey/40" />
            <span className="text-charcoal font-medium line-clamp-1">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <Section background="default" spacing="lg" className="overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Cinematic Product Image */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-gradient-to-b from-[#f5f0eb] via-[#ece5dd]/60 to-[#e8e0d5]/30 rounded-2xl overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-wine/[0.03] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/[0.03] to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">Nieuw</Badge>}
                {isOnSale && <Badge variant="sale">-{savingsPercentage}%</Badge>}
                {!product.inStock && <Badge variant="soldout">Uitverkocht</Badge>}
              </div>

              {/* Award Medal */}
              {product.hasAward && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 backdrop-blur-sm rounded-full p-3 border border-gold/30 shadow-lg shadow-gold/10">
                    <div className="text-center">
                      <MedalIcon className="w-6 h-6 text-gold mx-auto" />
                      <span className="text-[10px] font-bold text-amber-800 block mt-0.5">
                        {product.awardText || "Award"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {product.images[selectedImageIndex] && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center p-8 sm:p-12"
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[selectedImageIndex].url}
                      alt={product.images[selectedImageIndex].altText || product.title}
                      fill
                      priority
                      className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>
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
                      "relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200",
                      selectedImageIndex === index
                        ? "border-wine shadow-md"
                        : "border-sand/60 hover:border-grey/40"
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
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Collection */}
            {product.collection && (
              <motion.p
                className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/70 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.collection}
              </motion.p>
            )}

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-charcoal leading-tight mb-2">
              {product.title}
            </h1>

            {/* Region + Vintage */}
            <p className="font-serif text-lg sm:text-xl text-grey/80 mb-1">
              {product.region}, {product.country}
              {product.vintage && (
                <span className="text-wine/60 ml-2">
                  {product.vintage === "NV" ? "Non-Vintage" : product.vintage}
                </span>
              )}
            </p>

            {/* Grape varieties */}
            <p className="text-sm text-grey mb-4">
              {product.grapeVarieties.join(" / ")}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-6">
                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="lg"
                  showScore
                />
                <a
                  href="#reviews"
                  className="text-sm text-wine hover:underline transition-colors"
                >
                  Lees reviews
                </a>
              </div>
            )}

            {/* Elegant divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-sand to-transparent" />
              <GrapeIcon className="w-4 h-4 text-sand" />
              <div className="flex-1 h-px bg-gradient-to-l from-sand to-transparent" />
            </div>

            {/* Short Description */}
            <p className="text-base sm:text-lg leading-relaxed text-charcoal/80 mb-6 font-serif italic">
              &ldquo;{product.description.split(".")[0]}.&rdquo;
            </p>

            {/* Price Block */}
            <div className="bg-gradient-to-r from-warm-white to-transparent rounded-xl p-5 mb-6">
              <div className="flex items-end gap-4">
                <PriceDisplay
                  currentPrice={product.price}
                  originalPrice={product.originalPrice}
                  size="lg"
                  showSavings={!!isOnSale}
                />
              </div>
              {isOnSale && (
                <div className="mt-2">
                  <SavingsBadge amount={savings} percentage={savingsPercentage} />
                </div>
              )}
              {isLowStock && (
                <p className="text-sm font-medium text-amber-700/80 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Nog {product.stockQuantity} op voorraad
                </p>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-grey mb-2">Aantal</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.stockQuantity || 99}
                  disabled={!product.inStock}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-grey mb-2 sm:invisible">Actie</p>
                {product.inStock ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    isLoading={isAdding}
                    disabled={isAdding}
                    className={cn(justAdded && "bg-emerald-600 hover:bg-emerald-600")}
                  >
                    {justAdded ? (
                      <>
                        <CheckIcon className="w-5 h-5 mr-2" />
                        Toegevoegd aan winkelmand!
                      </>
                    ) : (
                      <>Toevoegen aan winkelmand &mdash; {formatPrice(product.price * quantity)}</>
                    )}
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" fullWidth disabled>
                    Uitverkocht
                  </Button>
                )}
              </div>
            </div>

            {/* Secondary actions */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isInWishlist ? "text-wine" : "text-grey hover:text-wine"
                )}
              >
                <HeartIcon className="w-4 h-4" filled={isInWishlist} />
                {isInWishlist ? "Op verlanglijst" : "Verlanglijst"}
              </button>
              <span className="text-sand">|</span>
              <button className="flex items-center gap-2 text-sm font-medium text-grey hover:text-wine transition-colors">
                <ShareIcon className="w-4 h-4" />
                Delen
              </button>
            </div>

            {/* Trust Signals */}
            <div className="bg-gradient-to-br from-warm-white to-[#f5f0eb] rounded-xl p-5 space-y-3.5 border border-sand/30">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-wine/8 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-wine" />
                </div>
                <div>
                  <span className="font-medium text-charcoal">Gratis verzending</span>
                  <span className="text-grey"> vanaf &euro;35</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-wine/8 flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-wine" />
                </div>
                <div>
                  <span className="font-medium text-charcoal">100% Proefgarantie</span>
                  <span className="text-grey"> &mdash; niet lekker? Geld terug</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-wine/8 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-wine" />
                </div>
                <div>
                  <span className="font-medium text-charcoal">Binnen 1-2 werkdagen</span>
                  <span className="text-grey"> bezorgd</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══ TASTE PROFILE SECTION ═══ */}
      {tasteProfileItems.length > 0 && (
        <AnimatedSection>
          <Section background="warm" spacing="lg">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/60 mb-2">
                  Smaakprofiel
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                  Hoe smaakt deze wijn?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Taste Profile Component */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-sand/30">
                  <TasteProfile items={tasteProfileItems} />
                </div>

                {/* Tasting Notes */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-semibold text-charcoal mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-wine" />
                      Geur
                    </h4>
                    <p className="text-grey leading-relaxed">{tastingNotes.geur}</p>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-charcoal mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-wine" />
                      Smaak
                    </h4>
                    <p className="text-grey leading-relaxed">{tastingNotes.smaak}</p>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-charcoal mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-wine" />
                      Afdronk
                    </h4>
                    <p className="text-grey leading-relaxed">{tastingNotes.afdronk}</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </AnimatedSection>
      )}

      {/* ═══ WINE STORY SECTION ═══ */}
      <AnimatedSection>
        <Section background="default" spacing="lg">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/60 mb-2">
                Het verhaal
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                Over deze wijn
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="font-serif text-lg sm:text-xl leading-relaxed text-charcoal/80 mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-wine first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                {product.description}
              </p>
              <p className="text-base leading-relaxed text-grey">
                Deze wijn is perfect voor een bijzonder diner of om te bewaren
                voor een speciale gelegenheid. De elegante structuur en
                complexiteit maken het een wijn die zowel nu genoten kan worden
                als nog enkele jaren kan rijpen.
              </p>
            </div>

            {/* Quick Specs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {technicalDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="bg-warm-white rounded-xl p-4 text-center border border-sand/20"
                >
                  <div className="flex items-center justify-center mb-2 text-wine/70">
                    {detail.icon}
                  </div>
                  <p className="text-xs text-grey mb-0.5">{detail.label}</p>
                  <p className="text-sm font-semibold text-charcoal">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </AnimatedSection>

      {/* ═══ FOOD PAIRING SECTION ═══ */}
      <AnimatedSection>
        <Section background="warm" spacing="lg">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/60 mb-2">
                Lekker bij
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-3">
                Spijs &amp; Wijn Combinaties
              </h2>
              <p className="text-grey max-w-xl mx-auto">
                Deze wijn combineert uitstekend met de volgende gerechten.
                Ontdek de perfecte match voor uw tafel.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {foodPairings.map((pairing, index) => (
                <motion.div
                  key={pairing.name}
                  className="bg-white rounded-xl p-4 sm:p-5 text-center border border-sand/20 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <div className="flex items-center justify-center mb-3 text-wine/60">
                    {pairing.icon}
                  </div>
                  <h4 className="font-semibold text-charcoal text-sm sm:text-base mb-0.5">
                    {pairing.name}
                  </h4>
                  <p className="text-xs text-grey">{pairing.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      </AnimatedSection>

      {/* ═══ TECHNICAL DETAILS SECTION ═══ */}
      <AnimatedSection>
        <Section background="default" spacing="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/60 mb-2">
                Specificaties
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                Technische Details
              </h2>
            </div>

            {/* Desktop: Elegant table layout */}
            <div className="hidden sm:block">
              <div className="bg-warm-white rounded-2xl overflow-hidden border border-sand/30">
                {[
                  { label: "Druivenras", value: product.grapeVarieties.join(", ") },
                  { label: "Land", value: product.country },
                  { label: "Regio", value: product.region },
                  { label: "Jaargang", value: product.vintage === "NV" ? "Non-Vintage" : String(product.vintage) },
                  { label: "Alcohol", value: product.wineType === "sparkling" ? "11.5%" : product.wineType === "white" ? "12.5%" : "13.5%" },
                  { label: "Inhoud", value: "750 ml" },
                  { label: "Serveertemperatuur", value: product.wineType === "red" ? "16-18°C" : product.wineType === "sparkling" ? "6-8°C" : "8-10°C" },
                  { label: "Sluiting", value: product.wineType === "sparkling" ? "Mushroom kurk" : "Kurk" },
                  { label: "Classificatie", value: product.title.includes("DOCG") ? "DOCG" : product.title.includes("DOC") ? "DOC" : product.title.includes("IGT") ? "IGT" : "Tafelwijn" },
                ].map((detail, index) => (
                  <div
                    key={detail.label}
                    className={cn(
                      "grid grid-cols-2 px-6 py-4",
                      index !== 0 && "border-t border-sand/30"
                    )}
                  >
                    <span className="text-grey text-sm">{detail.label}</span>
                    <span className="font-medium text-charcoal text-sm">{detail.value}</span>
                  </div>
                ))}

                {/* Awards row */}
                {product.hasAward && (
                  <div className="grid grid-cols-2 px-6 py-4 border-t border-sand/30 bg-gold/5">
                    <span className="text-grey text-sm flex items-center gap-2">
                      <MedalIcon className="w-4 h-4 text-gold" />
                      Onderscheidingen
                    </span>
                    <span className="font-semibold text-amber-800 text-sm">
                      {product.awardText || "Award Winner"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Collapsible */}
            <div className="sm:hidden">
              <CollapsibleSection title="Alle specificaties" defaultOpen>
                <div className="space-y-3">
                  {[
                    { label: "Druivenras", value: product.grapeVarieties.join(", ") },
                    { label: "Land", value: product.country },
                    { label: "Regio", value: product.region },
                    { label: "Jaargang", value: product.vintage === "NV" ? "Non-Vintage" : String(product.vintage) },
                    { label: "Alcohol", value: product.wineType === "sparkling" ? "11.5%" : product.wineType === "white" ? "12.5%" : "13.5%" },
                    { label: "Inhoud", value: "750 ml" },
                    { label: "Serveertemperatuur", value: product.wineType === "red" ? "16-18°C" : product.wineType === "sparkling" ? "6-8°C" : "8-10°C" },
                    { label: "Sluiting", value: product.wineType === "sparkling" ? "Mushroom kurk" : "Kurk" },
                  ].map((detail) => (
                    <div key={detail.label} className="flex justify-between py-2 border-b border-sand/40">
                      <span className="text-sm text-grey">{detail.label}</span>
                      <span className="text-sm font-medium text-charcoal">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </Section>
      </AnimatedSection>

      {/* ═══ REVIEWS SECTION ═══ */}
      <AnimatedSection>
        <Section background="warm" spacing="lg" id="reviews">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/60 mb-2">
                Beoordelingen
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                Wat onze klanten zeggen
              </h2>
            </div>

            <div className="grid md:grid-cols-[280px_1fr] gap-8 lg:gap-12">
              {/* Rating Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand/30 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start mb-4">
                  <span className="font-serif text-5xl font-bold text-charcoal mb-1">
                    {product.rating?.toFixed(1)}
                  </span>
                  <Rating rating={product.rating || 0} size="lg" />
                  <span className="text-sm text-grey mt-1">
                    {product.reviewCount} beoordelingen
                  </span>
                </div>

                <hr className="border-sand/40 my-4" />

                <RatingBreakdown
                  rating={product.rating || 0}
                  reviewCount={product.reviewCount || 0}
                />

                <button className="mt-6 w-full py-3 px-4 text-sm font-semibold uppercase tracking-wide border-2 border-wine text-wine rounded-lg hover:bg-wine hover:text-white transition-colors">
                  Schrijf een review
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-sand/20"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Rating rating={review.rating} size="sm" />
                          {review.verified && (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                              <CheckIcon className="w-3 h-3" />
                              Geverifieerd
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-charcoal">{review.title}</h4>
                      </div>
                    </div>
                    <p className="text-grey text-sm leading-relaxed mb-3">{review.text}</p>
                    <div className="flex items-center gap-2 text-xs text-grey/60">
                      <span className="font-medium text-charcoal/60">{review.author}</span>
                      <span>&middot;</span>
                      <span>{review.date}</span>
                    </div>
                  </motion.div>
                ))}

                {(product.reviewCount || 0) > 3 && (
                  <button className="w-full py-3 text-sm font-medium text-wine hover:text-wine-dark transition-colors">
                    Bekijk alle {product.reviewCount} reviews
                  </button>
                )}
              </div>
            </div>
          </div>
        </Section>
      </AnimatedSection>

      {/* ═══ RELATED WINES SECTION ═══ */}
      {relatedProducts.length > 0 && (
        <AnimatedSection>
          <Section background="default" spacing="lg">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wine/60 mb-2">
                Ontdek meer
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-3">
                Je vindt misschien ook lekker
              </h2>
              <p className="text-grey max-w-xl mx-auto">
                Vergelijkbare wijnen die passen bij jouw smaak
              </p>
            </div>

            <Grid cols={4} gap="md">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </Grid>

            <div className="text-center mt-10">
              <Link
                href="/wijnen"
                className="inline-flex items-center gap-2 text-wine font-semibold hover:underline underline-offset-4 transition-colors"
              >
                Bekijk alle wijnen
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </Section>
        </AnimatedSection>
      )}

      {/* ═══ STICKY MOBILE ADD TO CART BAR ═══ */}
      <AnimatePresence>
        {showStickyBar && product.inStock && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
          >
            <div className="bg-white/95 backdrop-blur-md border-t border-sand shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                {/* Mini product info */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-charcoal text-sm truncate">
                    {product.title}
                  </p>
                  <p className="font-semibold text-charcoal">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Quantity */}
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.stockQuantity || 99}
                  size="sm"
                />

                {/* Add to cart */}
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  isLoading={isAdding}
                  disabled={isAdding}
                  className={cn(
                    "whitespace-nowrap",
                    justAdded && "bg-emerald-600 hover:bg-emerald-600"
                  )}
                >
                  {justAdded ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    "Toevoegen"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
