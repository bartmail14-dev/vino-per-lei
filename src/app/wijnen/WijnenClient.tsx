"use client";

import { useState, useMemo, useEffect } from "react";
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
import { cn } from "@/lib/utils";
import { wineRegions, getRegionBySlug } from "@/data/wineRegions";
import { FilterIcon, ChevronRightIcon } from "@/components/icons";
import { LayoutGrid, List, Search, X } from "lucide-react";

// Build filter groups dynamically from actual products
function buildFilterGroups(products: Product[]): FilterGroup[] {
  // Region counts
  const regionCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const grapeCounts: Record<string, number> = {};
  const priceBuckets = { "0-10": 0, "10-15": 0, "15-20": 0, "20-30": 0, "30+": 0 };

  products.forEach((p) => {
    if (p.region) regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
    typeCounts[p.wineType] = (typeCounts[p.wineType] || 0) + 1;
    p.grapeVarieties.forEach((g) => {
      grapeCounts[g] = (grapeCounts[g] || 0) + 1;
    });
    if (p.price < 10) priceBuckets["0-10"]++;
    else if (p.price < 15) priceBuckets["10-15"]++;
    else if (p.price < 20) priceBuckets["15-20"]++;
    else if (p.price < 30) priceBuckets["20-30"]++;
    else priceBuckets["30+"]++;
  });

  const regionFilterOptions = wineRegions
    .filter((r) => r.active)
    .map((r) => ({
      value: r.slug,
      label: r.displayName,
      count: regionCounts[r.name] || regionCounts[r.displayName] || 0,
    }));

  const typeLabels: Record<string, string> = {
    red: "Rode Wijn",
    white: "Witte Wijn",
    rose: "Rosé",
    sparkling: "Mousserende",
  };

  const grapeOptions = Object.entries(grapeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([grape, count]) => ({
      value: grape.toLowerCase().replace(/\s+/g, "-"),
      label: grape,
      count,
    }));

  return [
    { id: "region", label: "Regio", options: regionFilterOptions },
    {
      id: "wineType",
      label: "Wijntype",
      options: (["red", "white", "rose", "sparkling"] as const).map((t) => ({
        value: t,
        label: typeLabels[t],
        count: typeCounts[t] || 0,
      })),
    },
    { id: "grape", label: "Druivenras", options: grapeOptions },
    {
      id: "price",
      label: "Prijs",
      options: [
        { value: "0-10", label: "Tot €10", count: priceBuckets["0-10"] },
        { value: "10-15", label: "€10 - €15", count: priceBuckets["10-15"] },
        { value: "15-20", label: "€15 - €20", count: priceBuckets["15-20"] },
        { value: "20-30", label: "€20 - €30", count: priceBuckets["20-30"] },
        { value: "30+", label: "€30+", count: priceBuckets["30+"] },
      ],
    },
  ];
}

const sortOptions = [
  { value: "popular", label: "Populair" },
  { value: "price-asc", label: "Prijs laag-hoog" },
  { value: "price-desc", label: "Prijs hoog-laag" },
  { value: "newest", label: "Nieuwste" },
  { value: "name-asc", label: "Naam A-Z" },
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

export function WijnenContent({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regionParam = searchParams.get("region");
  const typeParam = searchParams.get("type");

  const filterGroups = useMemo(() => buildFilterGroups(products), [products]);

  // Initialize filters from URL params
  const initialFilters: ActiveFilters = useMemo(() => {
    const filters: ActiveFilters = {};
    if (regionParam) {
      filters.region = [regionParam];
    }
    if (typeParam) {
      filters.wineType = [typeParam];
    }
    return filters;
  }, [regionParam, typeParam]);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync filters with URL params on mount/change
  useEffect(() => {
    const updates: ActiveFilters = {};
    if (regionParam && !activeFilters.region?.includes(regionParam)) {
      updates.region = [regionParam];
    }
    if (typeParam && !activeFilters.wineType?.includes(typeParam)) {
      updates.wineType = [typeParam];
    }
    if (Object.keys(updates).length > 0) {
      setActiveFilters((prev) => ({ ...prev, ...updates }));
    }
  }, [regionParam, typeParam, activeFilters.region, activeFilters.wineType]);

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
    let result = [...products];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.region?.toLowerCase().includes(query) ||
        p.grapeVarieties?.some((g) => g.toLowerCase().includes(query))
      );
    }

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

    // Apply grape filter
    if (activeFilters.grape?.length) {
      result = result.filter((p) =>
        p.grapeVarieties?.some((g) =>
          activeFilters.grape!.includes(g.toLowerCase().replace(/\s+/g, "-"))
        )
      );
    }

    // Apply price filter
    if (activeFilters.price?.length) {
      result = result.filter((p) => {
        const price = p.price;
        return activeFilters.price!.some((range) => {
          if (range === "0-10") return price < 10;
          if (range === "10-15") return price >= 10 && price < 15;
          if (range === "15-20") return price >= 15 && price < 20;
          if (range === "20-30") return price >= 20 && price < 30;
          if (range === "30+") return price >= 30;
          return true;
        });
      });
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
        result.sort((a) => (a.isNew ? -1 : 1));
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title, "nl"));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Popular - keep original order or sort by reviews
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  }, [activeFilters, sortBy, searchQuery, products]);

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                {filteredProducts.length} wijnen uit {activeRegionName}, rechtstreeks van de producent.
              </>
            ) : (
              <>
                {filteredProducts.length} wijnen uit Piemonte, Veneto en Toscane.
                Allemaal persoonlijk geselecteerd en rechtstreeks geimporteerd.
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
            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op wijn, regio of druivenras..."
                className="w-full pl-10 pr-10 py-2.5 border border-sand rounded-lg text-sm text-charcoal placeholder:text-grey/60 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-colors bg-white"
                aria-label="Zoek wijnen"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-sand/50 rounded transition-colors"
                  aria-label="Wis zoekopdracht"
                >
                  <X className="w-4 h-4 text-grey" strokeWidth={1.5} />
                </button>
              )}
            </div>

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
                    <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list" ? "bg-wine text-white" : "hover:bg-sand"
                    )}
                    aria-label="Lijst weergave"
                  >
                    <List className="w-4 h-4" strokeWidth={1.5} />
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
                  "grid",
                  viewMode === "grid"
                    ? "grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 gap-6"
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
                  Toont {filteredProducts.length} van {products.length} wijnen
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
export function WijnenLoading() {
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
