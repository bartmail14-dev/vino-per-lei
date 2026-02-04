"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Section } from "@/components/layout";
import { Select, Button } from "@/components/ui";
import { ProductCard, QuickViewModal } from "@/components/product";
import { type Product } from "@/types";
import {
  FilterSidebar,
  ActiveFilterTags,
  type FilterGroup,
  type ActiveFilters,
} from "@/components/filters";
import { mockProducts } from "@/data/mockProducts";
import { cn } from "@/lib/utils";
import { wineRegions, getRegionBySlug } from "@/data/wineRegions";

// Icons
function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Get unique regions from products and count them
function getRegionCounts() {
  const counts: Record<string, number> = {};
  mockProducts.forEach((p) => {
    if (p.region) {
      counts[p.region] = (counts[p.region] || 0) + 1;
    }
  });
  return counts;
}

// Filter configuration
const regionCounts = getRegionCounts();
const regionFilterOptions = wineRegions
  .filter((r) => r.wineCount > 0)
  .map((r) => ({
    value: r.slug,
    label: r.displayName,
    count: regionCounts[r.name] || regionCounts[r.displayName] || r.wineCount,
  }));

const filterGroups: FilterGroup[] = [
  {
    id: "region",
    label: "Regio",
    options: regionFilterOptions,
  },
  {
    id: "wineType",
    label: "Wijntype",
    options: [
      { value: "red", label: "Rode Wijn", count: 45 },
      { value: "white", label: "Witte Wijn", count: 32 },
      { value: "rose", label: "Rosé", count: 18 },
      { value: "sparkling", label: "Mousserende", count: 12 },
    ],
  },
  {
    id: "grape",
    label: "Druivenras",
    options: [
      { value: "cabernet-sauvignon", label: "Cabernet Sauvignon", count: 22 },
      { value: "merlot", label: "Merlot", count: 18 },
      { value: "pinot-noir", label: "Pinot Noir", count: 14 },
      { value: "chardonnay", label: "Chardonnay", count: 16 },
      { value: "sauvignon-blanc", label: "Sauvignon Blanc", count: 12 },
      { value: "tempranillo", label: "Tempranillo", count: 8 },
      { value: "syrah", label: "Syrah / Shiraz", count: 10 },
      { value: "malbec", label: "Malbec", count: 6 },
    ],
  },
  {
    id: "price",
    label: "Prijs",
    options: [
      { value: "0-10", label: "Tot €10", count: 15 },
      { value: "10-15", label: "€10 - €15", count: 28 },
      { value: "15-20", label: "€15 - €20", count: 32 },
      { value: "20-30", label: "€20 - €30", count: 18 },
      { value: "30+", label: "€30+", count: 8 },
    ],
  },
  {
    id: "taste",
    label: "Smaakprofiel",
    options: [
      { value: "licht", label: "Licht & Fris", count: 24 },
      { value: "fruitig", label: "Fruitig", count: 36 },
      { value: "vol", label: "Vol & Rijk", count: 28 },
      { value: "kruidig", label: "Kruidig", count: 18 },
    ],
  },
];

const sortOptions = [
  { value: "popular", label: "Populair" },
  { value: "price-asc", label: "Prijs laag-hoog" },
  { value: "price-desc", label: "Prijs hoog-laag" },
  { value: "newest", label: "Nieuwste" },
  { value: "rating", label: "Best beoordeeld" },
];

// Map region slugs to product region names
const regionSlugToName: Record<string, string> = {
  piemonte: "Piemonte",
  veneto: "Veneto",
  puglia: "Puglia",
  "alto-adige": "Alto Adige",
  toscana: "Toscana",
  friuli: "Friuli-Venezia Giulia",
  "emilia-romagna": "Emilia-Romagna",
  umbria: "Umbria",
  lazio: "Lazio",
  campania: "Campania",
  sicilia: "Sicilia",
  calabria: "Calabria",
};

function WijnenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regionParam = searchParams.get("region");

  // Initialize filters from URL params
  const initialFilters: ActiveFilters = useMemo(() => {
    const filters: ActiveFilters = {};
    if (regionParam) {
      filters.region = [regionParam];
    }
    return filters;
  }, [regionParam]);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync filters with URL params on mount/change
  useEffect(() => {
    if (regionParam && !activeFilters.region?.includes(regionParam)) {
      setActiveFilters((prev) => ({
        ...prev,
        region: [regionParam],
      }));
    }
  }, [regionParam]);

  // Get active region name for header
  const activeRegionName = useMemo(() => {
    if (activeFilters.region?.length === 1) {
      const slug = activeFilters.region[0];
      const region = getRegionBySlug(slug);
      return region?.displayName || regionSlugToName[slug] || null;
    }
    return null;
  }, [activeFilters.region]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Apply region filter
    if (activeFilters.region?.length) {
      result = result.filter((p) => {
        if (!p.region) return false;
        return activeFilters.region!.some((slug) => {
          const regionName = regionSlugToName[slug];
          return p.region === regionName || p.region.toLowerCase() === slug.toLowerCase();
        });
      });
    }

    // Apply wine type filter
    if (activeFilters.wineType?.length) {
      result = result.filter((p) =>
        activeFilters.wineType!.includes(p.wineType)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (a.isNew ? -1 : 1));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Popular - keep original order or sort by reviews
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  }, [activeFilters, sortBy]);

  const handleFilterChange = (
    groupId: string,
    value: string,
    checked: boolean
  ) => {
    setActiveFilters((prev) => {
      const current = prev[groupId] || [];
      const newFilters = checked
        ? { ...prev, [groupId]: [...current, value] }
        : { ...prev, [groupId]: current.filter((v) => v !== value) };

      // Update URL when region filter changes
      if (groupId === "region") {
        const newRegion = newFilters.region?.[0];
        if (newRegion) {
          router.push(`/wijnen?region=${newRegion}`, { scroll: false });
        } else {
          router.push("/wijnen", { scroll: false });
        }
      }

      return newFilters;
    });
  };

  const handleClearAll = () => {
    setActiveFilters({});
    router.push("/wijnen", { scroll: false });
  };

  const handleClearGroup = (groupId: string) => {
    setActiveFilters((prev) => {
      const { [groupId]: _, ...rest } = prev;
      return rest;
    });
    if (groupId === "region") {
      router.push("/wijnen", { scroll: false });
    }
  };

  const handleRemoveFilter = (groupId: string, value: string) => {
    handleFilterChange(groupId, value, false);
  };

  const totalActiveFilters = Object.values(activeFilters).flat().length;

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
            {activeRegionName ? (
              <>
                <Link href="/wijnen" className="text-grey hover:text-wine">
                  Wijnen
                </Link>
                <ChevronRightIcon className="w-4 h-4 text-grey" />
                <span className="text-charcoal font-medium">{activeRegionName}</span>
              </>
            ) : (
              <span className="text-charcoal font-medium">Wijnen</span>
            )}
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <Section background="warm" spacing="md">
        <div className="text-center">
          <h1 className="text-h1 mb-3">
            {activeRegionName ? `Wijnen uit ${activeRegionName}` : "Onze Wijnen"}
          </h1>
          <p className="text-body-lg text-grey max-w-2xl mx-auto">
            {activeRegionName ? (
              <>
                Ontdek onze {filteredProducts.length} geselecteerde wijnen uit {activeRegionName}.
                {" "}Elke wijn vertelt het verhaal van deze prachtige Italiaanse regio.
              </>
            ) : (
              <>
                Ontdek onze zorgvuldig geselecteerde collectie van {filteredProducts.length} authentieke
                Italiaanse wijnen uit de mooiste regio's van Italië.
              </>
            )}
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section background="default" spacing="lg">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filterGroups}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            onClearGroup={handleClearGroup}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Mobile filter button */}
              <Button
                variant="secondary"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden"
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
                {totalActiveFilters > 0 && (
                  <span className="ml-2 bg-wine text-white text-xs px-1.5 py-0.5 rounded-full">
                    {totalActiveFilters}
                  </span>
                )}
              </Button>

              {/* Results count */}
              <p className="text-sm text-grey">
                <span className="font-medium text-charcoal">{filteredProducts.length}</span> wijnen
              </p>

              {/* Right side controls */}
              <div className="flex items-center gap-4">
                {/* View mode toggle */}
                <div className="hidden sm:flex items-center border border-sand rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid" ? "bg-wine text-white" : "hover:bg-sand"
                    )}
                    aria-label="Grid weergave"
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list" ? "bg-wine text-white" : "hover:bg-sand"
                    )}
                    aria-label="Lijst weergave"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-44"
                />
              </div>
            </div>

            {/* Active Filters */}
            <ActiveFilterTags
              activeFilters={activeFilters}
              filterGroups={filterGroups}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <FilterIcon className="w-8 h-8 text-grey" />
                </div>
                <h3 className="text-h4 mb-2">Geen wijnen gevonden</h3>
                <p className="text-grey mb-6">
                  Probeer andere filters of bekijk al onze wijnen.
                </p>
                <Button variant="primary" onClick={handleClearAll}>
                  Wis alle filters
                </Button>
              </div>
            )}

            {/* Pagination placeholder */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <p className="text-sm text-grey">
                  Toont {filteredProducts.length} van {mockProducts.length} wijnen
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* SEO Content */}
      <Section background="warm" spacing="md">
        <div className="max-w-3xl">
          <h2 className="text-h3 mb-4">Authentieke Italiaanse Wijnen</h2>
          <p className="text-grey mb-4">
            Bij Vino per Lei selecteren we elke wijn met passie en expertise. Onze collectie
            bestaat uitsluitend uit authentieke Italiaanse wijnen van gerenommeerde
            familiewijngaarden. Van krachtige Barolo uit Piemonte tot elegante Valpolicella
            uit Veneto — wij brengen het beste van Italië naar jouw tafel.
          </p>
          <p className="text-grey">
            Alle wijnen worden geleverd met onze 100% proefgarantie. Niet tevreden?
            Dan krijg je je geld terug, geen vragen gesteld.
          </p>
        </div>
      </Section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

// Loading fallback for Suspense
function WijnenLoading() {
  return (
    <>
      <div className="bg-warm-white border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-grey">Home</span>
            <span className="text-grey">/</span>
            <span className="text-charcoal font-medium">Wijnen</span>
          </nav>
        </div>
      </div>
      <Section background="warm" spacing="md">
        <div className="text-center">
          <h1 className="text-h1 mb-3">Onze Wijnen</h1>
          <p className="text-body-lg text-grey max-w-2xl mx-auto">
            Laden...
          </p>
        </div>
      </Section>
    </>
  );
}

export default function WijnenPage() {
  return (
    <Suspense fallback={<WijnenLoading />}>
      <WijnenContent />
    </Suspense>
  );
}
