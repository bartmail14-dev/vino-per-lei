"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Section } from "@/components/layout";
import { Select, Button } from "@/components/ui";
import { ProductCard, QuickViewModal } from "@/components/product";
import { useUiCopy } from "@/components/providers";
import { type Product } from "@/types";
import {
  FilterSidebar,
  ActiveFilterTags,
  type FilterOption,
  type FilterGroup,
  type ActiveFilters,
} from "@/components/filters";
import { cn } from "@/lib/utils";
import { regionNameToSlug, slugToDisplayName, slugToRegionNames } from "@/lib/region-utils";
import { FilterIcon, ChevronRightIcon } from "@/components/icons";
import { LayoutGrid, List, Search, X } from "lucide-react";

type Translate = (key: string, variables?: Record<string, string | number | boolean | null | undefined>) => string;

const PRICE_BUCKET_SIZE = 5;
const PRICE_OPEN_ENDED_MIN = 50;

function priceRangeValue(min: number, max: number | null): string {
  return max === null ? `${min}+` : `${min}-${max}`;
}

function priceRangeLabel(min: number, max: number | null, t: Translate): string {
  const copyKey = max === null
    ? `collection.price.${min}_plus`
    : `collection.price.${min}_${max}`;
  const copyLabel = t(copyKey);

  if (copyLabel && copyLabel !== copyKey) {
    return copyLabel;
  }

  const euro = "\u20ac";
  return max === null ? `${euro} ${min}+` : `${euro} ${min} - ${euro} ${max}`;
}

function matchesPriceRange(price: number, range: string): boolean {
  const closedRange = range.match(/^(\d+)-(\d+)$/);
  if (closedRange) {
    const [, min, max] = closedRange;
    return price >= Number(min) && price < Number(max);
  }

  const openRange = range.match(/^(\d+)\+$/);
  if (openRange) {
    return price >= Number(openRange[1]);
  }

  return true;
}

function buildPriceOptions(products: Product[], t: Translate): FilterOption[] {
  const prices = products
    .map((product) => product.price)
    .filter((price): price is number => Number.isFinite(price) && price >= 0);

  if (prices.length === 0) return [];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const firstBucketMin = Math.floor(minPrice / PRICE_BUCKET_SIZE) * PRICE_BUCKET_SIZE;
  const lastClosedBucketMax = Math.min(
    PRICE_OPEN_ENDED_MIN,
    Math.max(
      firstBucketMin + PRICE_BUCKET_SIZE,
      Math.ceil(Math.min(maxPrice, PRICE_OPEN_ENDED_MIN) / PRICE_BUCKET_SIZE) * PRICE_BUCKET_SIZE
    )
  );

  const options: FilterOption[] = [];

  for (let min = firstBucketMin; min < lastClosedBucketMax; min += PRICE_BUCKET_SIZE) {
    const max = min + PRICE_BUCKET_SIZE;
    const count = prices.filter((price) => price >= min && price < max).length;

    if (count > 0) {
      options.push({
        value: priceRangeValue(min, max),
        label: priceRangeLabel(min, max, t),
        count,
      });
    }
  }

  const openEndedCount = prices.filter((price) => price >= PRICE_OPEN_ENDED_MIN).length;
  if (openEndedCount > 0) {
    options.push({
      value: priceRangeValue(PRICE_OPEN_ENDED_MIN, null),
      label: priceRangeLabel(PRICE_OPEN_ENDED_MIN, null, t),
      count: openEndedCount,
    });
  }

  return options;
}

// Build filter groups dynamically from actual products
function buildFilterGroups(products: Product[], t: Translate): FilterGroup[] {
  // Region counts
  const regionCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const grapeCounts: Record<string, number> = {};
  const alcoholBuckets = { "light": 0, "medium": 0, "full": 0 };

  products.forEach((p) => {
    if (p.region) regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
    typeCounts[p.wineType] = (typeCounts[p.wineType] || 0) + 1;
    p.grapeVarieties.forEach((g) => {
      grapeCounts[g] = (grapeCounts[g] || 0) + 1;
    });

    // Alcohol percentage filter
    const abv = parseFloat(p.alcoholPercentage?.replace('%', '').replace(',', '.') || '0');
    if (abv > 0) {
      if (abv < 12) alcoholBuckets["light"]++;
      else if (abv < 14) alcoholBuckets["medium"]++;
      else alcoholBuckets["full"]++;
    }
  });

  // Build region filter options dynamically from actual products
  const regionSlugCounts: Record<string, number> = {};
  const regionSlugLabels: Record<string, string> = {};
  for (const [name, count] of Object.entries(regionCounts)) {
    const slug = regionNameToSlug(name);
    if (slug) {
      regionSlugCounts[slug] = (regionSlugCounts[slug] || 0) + count;
      regionSlugLabels[slug] = regionSlugLabels[slug] || name;
    }
  }
  const regionFilterOptions = Object.entries(regionSlugCounts)
    .map(([slug, count]) => ({
      value: slug,
      label: regionSlugLabels[slug] || slugToDisplayName(slug) || slug,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "nl"));

  const typeLabels: Record<string, string> = {
    red: t("product.wine_type.red_full"),
    white: t("product.wine_type.white_full"),
    rose: t("product.wine_type.rose_full"),
    sparkling: t("product.wine_type.sparkling_full"),
  };

  const grapeOptions = Object.entries(grapeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([grape, count]) => ({
      value: grape.toLowerCase().replace(/\s+/g, "-"),
      label: grape,
      count,
    }));

  // Only include alcohol filter if we have data
  const hasAlcoholData = Object.values(alcoholBuckets).some(c => c > 0);

  // Build groups, filtering out options with 0 products
  const groups: FilterGroup[] = [];

  const activeRegionOptions = regionFilterOptions.filter(o => (o.count ?? 0) > 0);
  if (activeRegionOptions.length > 0) {
    groups.push({ id: "region", label: t("collection.filter.group.region"), options: activeRegionOptions });
  }

  const typeOptions = (["red", "white", "rose", "sparkling"] as const)
    .map((type) => ({ value: type, label: typeLabels[type], count: typeCounts[type] || 0 }))
    .filter(o => o.count > 0);
  if (typeOptions.length > 0) {
    groups.push({ id: "wineType", label: t("collection.filter.group.wine_type"), options: typeOptions });
  }

  const activeGrapeOptions = grapeOptions.filter(o => (o.count ?? 0) > 0);
  if (activeGrapeOptions.length > 0) {
    groups.push({ id: "grape", label: t("collection.filter.group.grape"), options: activeGrapeOptions });
  }

  const priceOptions = buildPriceOptions(products, t);
  if (priceOptions.length > 0) {
    groups.push({ id: "price", label: t("collection.filter.group.price"), options: priceOptions });
  }

  if (hasAlcoholData) {
    const alcoholOptions = [
      { value: "light", label: t("collection.alcohol.light"), count: alcoholBuckets["light"] },
      { value: "medium", label: t("collection.alcohol.medium"), count: alcoholBuckets["medium"] },
      { value: "full", label: t("collection.alcohol.full"), count: alcoholBuckets["full"] },
    ].filter(o => o.count > 0);
    if (alcoholOptions.length > 0) {
      groups.push({ id: "alcohol", label: t("collection.filter.group.alcohol"), options: alcoholOptions });
    }
  }

  return groups;
}

const sortOptions = [
  { value: "popular", label: "collection.sort.popular" },
  { value: "price-asc", label: "collection.sort.price_asc" },
  { value: "price-desc", label: "collection.sort.price_desc" },
  { value: "newest", label: "collection.sort.newest" },
  { value: "name-asc", label: "collection.sort.name_asc" },
  { value: "rating", label: "collection.sort.rating" },
];

// No hardcoded region map needed — slugToRegionNames handles all regions dynamically

function normalizeFilters(filters: ActiveFilters): ActiveFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, values]) => values.length > 0)
  );
}

function cloneFilters(filters: ActiveFilters): ActiveFilters {
  return Object.fromEntries(
    Object.entries(filters).map(([groupId, values]) => [groupId, [...values]])
  );
}

function filterAndSortProducts(
  products: Product[],
  activeFilters: ActiveFilters,
  searchQuery: string,
  sortBy: string
): Product[] {
  let result = [...products];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((p) =>
      p.title.toLowerCase().includes(query) ||
      p.region?.toLowerCase().includes(query) ||
      p.grapeVarieties?.some((g) => g.toLowerCase().includes(query))
    );
  }

  if (activeFilters.region?.length) {
    result = result.filter((p) => {
      if (!p.region) return false;
      return activeFilters.region!.some((slug) => {
        const regionNames = slugToRegionNames(slug);
        return regionNames.some((name) => p.region === name) || regionNameToSlug(p.region) === slug;
      });
    });
  }

  if (activeFilters.wineType?.length) {
    result = result.filter((p) => activeFilters.wineType!.includes(p.wineType));
  }

  if (activeFilters.grape?.length) {
    result = result.filter((p) =>
      p.grapeVarieties?.some((g) =>
        activeFilters.grape!.includes(g.toLowerCase().replace(/\s+/g, "-"))
      )
    );
  }

  if (activeFilters.price?.length) {
    result = result.filter((p) =>
      activeFilters.price!.some((range) => matchesPriceRange(p.price, range))
    );
  }

  if (activeFilters.alcohol?.length) {
    result = result.filter((p) => {
      const abv = parseFloat(p.alcoholPercentage?.replace('%', '').replace(',', '.') || '0');
      if (abv === 0) return false;
      return activeFilters.alcohol!.some((range) => {
        if (range === "light") return abv < 12;
        if (range === "medium") return abv >= 12 && abv < 14;
        if (range === "full") return abv >= 14;
        return true;
      });
    });
  }

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
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  }

  return result;
}

export function WijnenContent({ products }: { products: Product[] }) {
  const t = useUiCopy();
  const searchParams = useSearchParams();
  const router = useRouter();
  const regionParam = searchParams.get("region");
  const typeParam = searchParams.get("type");

  const filterGroups = useMemo(() => buildFilterGroups(products, t), [products, t]);
  const translatedSortOptions = useMemo(
    () => sortOptions.map((option) => ({ ...option, label: t(option.label) })),
    [t]
  );

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
  const [mobileDraftFilters, setMobileDraftFilters] = useState<ActiveFilters>(() => cloneFilters(initialFilters));
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
      return slugToDisplayName(slug) || null;
    }
    return null;
  }, [activeFilters.region]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, activeFilters, searchQuery, sortBy);
  }, [activeFilters, sortBy, searchQuery, products]);

  const mobileDraftResultCount = useMemo(
    () => filterAndSortProducts(products, mobileDraftFilters, searchQuery, sortBy).length,
    [mobileDraftFilters, products, searchQuery, sortBy]
  );

  const pushRegionUrlForFilters = (filters: ActiveFilters) => {
    const newRegion = filters.region?.[0];
    if (newRegion) {
      router.push(`/wijnen?region=${encodeURIComponent(newRegion)}`, { scroll: false });
    } else {
      router.push("/wijnen", { scroll: false });
    }
  };

  const handleFilterChange = (
    groupId: string,
    value: string,
    checked: boolean
  ) => {
    setActiveFilters((prev) => {
      const current = prev[groupId] || [];
      const newFilters = normalizeFilters(checked
        ? { ...prev, [groupId]: [...current, value] }
        : { ...prev, [groupId]: current.filter((v) => v !== value) });

      // Update URL when region filter changes
      if (groupId === "region") {
        pushRegionUrlForFilters(newFilters);
      }

      return newFilters;
    });
  };

  const handleMobileFilterChange = (
    groupId: string,
    value: string,
    checked: boolean
  ) => {
    setMobileDraftFilters((prev) => {
      const current = prev[groupId] || [];
      return normalizeFilters(checked
        ? { ...prev, [groupId]: [...current, value] }
        : { ...prev, [groupId]: current.filter((v) => v !== value) });
    });
  };

  const openMobileFilters = () => {
    setMobileDraftFilters(cloneFilters(activeFilters));
    setIsMobileFilterOpen(true);
  };

  const applyMobileFilters = () => {
    const nextFilters = normalizeFilters(mobileDraftFilters);
    setActiveFilters(nextFilters);
    pushRegionUrlForFilters(nextFilters);
    setIsMobileFilterOpen(false);
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
  const regionNames = [...new Set(products.map((p) => p.region).filter(Boolean))];
  const regionSummary =
    regionNames.length === 0
      ? t("collection.region.default_country")
      : regionNames.length === 1
        ? regionNames[0]
        : regionNames.slice(0, -1).join(", ") + t("collection.region.joiner") + regionNames[regionNames.length - 1];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white/80 border-b border-sand/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-grey hover:text-wine">
              {t("collection.breadcrumb.home")}
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-grey" />
            {activeRegionName ? (
              <>
                <Link href="/wijnen" className="text-grey hover:text-wine">
                  {t("collection.breadcrumb.wines")}
                </Link>
                <ChevronRightIcon className="w-4 h-4 text-grey" />
                <span className="text-charcoal font-medium">{activeRegionName}</span>
              </>
            ) : (
              <span className="text-charcoal font-medium">{t("collection.breadcrumb.wines")}</span>
            )}
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <Section background="warm" spacing="sm" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(245,240,232,0.9))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-label text-wine/45 mb-3">{t("collection.breadcrumb.wines")}</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] mb-4">
            {activeRegionName ? t("collection.heading.region", { region: activeRegionName }) : t("collection.heading.default")}
          </h1>
          <p className="text-body-lg text-grey max-w-2xl mx-auto leading-relaxed">
            {activeRegionName ? (
              <>
                {t("collection.summary.region", { count: filteredProducts.length, region: activeRegionName })}
              </>
            ) : (
              <>
                {t("collection.summary.default", { count: filteredProducts.length, regions: regionSummary })}
              </>
            )}
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section background="default" spacing="none" className="py-8 sm:py-12 lg:py-16">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filterGroups}
            activeFilters={isMobileFilterOpen ? mobileDraftFilters : activeFilters}
            onFilterChange={isMobileFilterOpen ? handleMobileFilterChange : handleFilterChange}
            onClearAll={isMobileFilterOpen ? () => setMobileDraftFilters({}) : handleClearAll}
            onClearGroup={handleClearGroup}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            onApply={applyMobileFilters}
            applyLabel={t("collection.pagination.summary", { shown: mobileDraftResultCount, total: products.length })}
          />

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="relative mb-6 rounded-2xl border border-sand/70 bg-white p-2 shadow-[0_20px_64px_-46px_rgba(26,31,61,0.65)]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("collection.search.placeholder_full")}
                className="w-full pl-11 pr-11 py-3 border border-transparent rounded-xl text-sm text-charcoal placeholder:text-grey/50 placeholder:italic focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all duration-200 bg-cream/65"
                aria-label={t("collection.search.label")}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gold/10 rounded-full transition-colors"
                  aria-label={t("collection.search.clear")}
                >
                  <X className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Toolbar */}
            <div className="sticky top-20 z-30 -mx-2 mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sand/70 bg-white/92 p-2 shadow-[0_18px_50px_-34px_rgba(26,31,61,0.62)] backdrop-blur lg:static lg:top-auto lg:mx-0 lg:border lg:bg-white/78 lg:p-3 lg:shadow-[0_18px_60px_-46px_rgba(26,31,61,0.6)]">
              {/* Mobile filter button */}
              <Button
                variant="ghost"
                onClick={openMobileFilters}
                className="h-12 rounded-xl border border-gold/50 bg-champagne/30 px-4 text-xs uppercase tracking-[0.14em] shadow-sm lg:hidden"
              >
                <FilterIcon className="w-4 h-4 mr-2 text-gold" />
                {t("collection.filters.label")}
                {totalActiveFilters > 0 && (
                  <span className="ml-2 bg-gold text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {totalActiveFilters}
                  </span>
                )}
              </Button>

              {/* Results count */}
              <p className="flex items-center gap-2 rounded-full bg-cream/80 px-3 py-2 text-sm text-grey ring-1 ring-sand/60">
                <span className="font-serif font-semibold text-gold text-base leading-none">{filteredProducts.length}</span>
                <span className="text-grey/40">|</span>
                <span>{t("collection.results.wines")}</span>
              </p>

              {/* Right side controls */}
              <div className="flex items-center gap-3">
                {/* View mode toggle */}
                <div className="hidden sm:flex items-center border border-sand/80 rounded-lg shadow-sm bg-white overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2.5 transition-all duration-200 rounded-l-lg",
                      viewMode === "grid"
                        ? "bg-wine text-white"
                        : "hover:text-gold text-grey hover:bg-sand/20"
                    )}
                    aria-label={t("collection.view.grid")}
                  >
                    <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <div className="w-px h-5 bg-sand" />
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2.5 transition-all duration-200 rounded-r-lg",
                      viewMode === "list"
                        ? "bg-wine text-white"
                        : "hover:text-gold text-grey hover:bg-sand/20"
                    )}
                    aria-label={t("collection.view.list")}
                  >
                    <List className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Sort */}
                <Select
                  options={translatedSortOptions}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 w-full rounded-xl border-sand/80 bg-white min-[430px]:w-40 sm:w-48 shadow-sm"
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
                    ? "grid-cols-1 gap-6 min-[430px]:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4"
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
                <div className="w-16 h-16 bg-champagne border border-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FilterIcon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-2">{t("collection.empty.title")}</h3>
                <p className="text-grey/70 mb-6">
                  {t("collection.empty.description")}
                </p>
                <Button variant="gold" onClick={handleClearAll}>
                  {t("collection.filters.clear_all")}
                </Button>
              </div>
            )}

            {/* Pagination placeholder */}
            {filteredProducts.length > 0 && (
              <div className="mt-12">
                <div className="border-t border-sand/60 mb-6" />
                <p className="text-sm text-grey text-center">
                  {t("collection.pagination.summary", { shown: filteredProducts.length, total: products.length })}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* SEO Content */}
      <Section background="warm" spacing="md">
        <div className="max-w-3xl">
          <h2 className="text-h3 mb-4">{t("collection.seo.title")}</h2>
          <p className="text-grey">
            {t("collection.seo.body")}
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
  const t = useUiCopy();

  return (
    <>
      <div className="bg-warm-white border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-grey">{t("collection.breadcrumb.home")}</span>
            <span className="text-grey">/</span>
            <span className="text-charcoal font-medium">{t("collection.breadcrumb.wines")}</span>
          </nav>
        </div>
      </div>
      <Section background="warm" spacing="md">
        <div className="text-center">
          <h1 className="text-h1 mb-3">{t("collection.heading.default")}</h1>
          <p className="text-body-lg text-grey max-w-2xl mx-auto">
            {t("collection.loading")}
          </p>
        </div>
      </Section>
    </>
  );
}
