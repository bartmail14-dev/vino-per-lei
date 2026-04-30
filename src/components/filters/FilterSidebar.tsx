"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Checkbox, Button } from "@/components/ui";
import { ItalyWineMap, type WineRegionData } from "@/components/map";
import { ChevronDown as ChevronDownIcon, X as CloseIcon, RotateCcw as FilterResetIcon } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: "checkbox" | "range";
}

export interface ActiveFilters {
  [key: string]: string[];
}

export interface FilterSidebarProps {
  filters: FilterGroup[];
  activeFilters: ActiveFilters;
  onFilterChange: (groupId: string, value: string, checked: boolean) => void;
  onClearAll: () => void;
  onClearGroup: (groupId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface FilterAccordionProps {
  group: FilterGroup;
  activeValues: string[];
  onFilterChange: (value: string, checked: boolean) => void;
  defaultOpen?: boolean;
}

function FilterAccordion({
  group,
  activeValues,
  onFilterChange,
  defaultOpen = true,
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  const visibleOptions = showAll ? group.options : group.options.slice(0, 6);
  const hasMore = group.options.length > 6;
  const activeCount = activeValues.length;

  return (
    <div className={cn(
      "border-b border-sand/40 py-4 transition-colors duration-300",
      activeCount > 0 && "border-l-2 border-l-gold/60 pl-3"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group/accordion"
        aria-expanded={isOpen}
      >
        <span className="font-serif font-semibold text-charcoal text-[15px] flex items-center gap-2.5 group-hover/accordion:text-wine transition-colors">
          {group.label}
          {activeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center text-[10px] bg-gold/15 text-gold min-w-[20px] h-[20px] px-1.5 rounded-full font-bold border border-gold/20"
            >
              {activeCount}
            </motion.span>
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-0 bg-champagne/20 rounded-lg mt-1 p-2 -mx-1">
              {visibleOptions.map((option) => {
                const isActive = activeValues.includes(option.value);
                return (
                  <motion.div
                    key={option.value}
                    layout
                    className={cn(
                      "rounded-lg px-1 transition-colors duration-200",
                      isActive && "bg-gold/[0.06]"
                    )}
                  >
                    <Checkbox
                      label={option.label}
                      count={option.count}
                      checked={isActive}
                      onChange={(e) => onFilterChange(option.value, e.target.checked)}
                    />
                  </motion.div>
                );
              })}
              {hasMore && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm text-gold hover:text-gold-light font-medium mt-2 ml-1 flex items-center gap-1 transition-colors"
                >
                  {showAll ? (
                    <>Toon minder</>
                  ) : (
                    <>
                      <span>+</span> {group.options.length - 6} meer
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClearGroup,
  isOpen = true,
  onClose,
  className,
}: FilterSidebarProps) {
  const totalActiveFilters = Object.values(activeFilters).flat().length;

  const focusTrapRef = useFocusTrap<HTMLDivElement>({ active: isOpen, onEscape: onClose });

  // Get currently selected region for the map
  const selectedRegion = activeFilters["region"]?.[0] || null;

  // Derive active region slugs from the region filter group (only regions with products)
  const regionGroup = filters.find((f) => f.id === "region");
  const activeRegionSlugs = regionGroup?.options.map((o) => o.value);

  // Handle map region click
  const handleMapRegionClick = (region: WineRegionData) => {
    const currentRegions = activeFilters["region"] || [];
    const isCurrentlySelected = currentRegions.includes(region.slug);

    if (isCurrentlySelected) {
      onFilterChange("region", region.slug, false);
    } else {
      currentRegions.forEach(r => onFilterChange("region", r, false));
      onFilterChange("region", region.slug, true);
    }
  };

  // Mobile overlay version
  const mobileContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={focusTrapRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-cream z-50 overflow-y-auto lg:hidden shadow-[0_0_60px_rgba(26,31,61,0.15)]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            {/* Header — wine gradient */}
            <div className="sticky top-0 bg-wine-gradient px-5 py-4 flex items-center justify-between z-10 shadow-[0_2px_12px_rgba(26,31,61,0.2)]">
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-xl font-semibold text-white">Filters</h2>
                {totalActiveFilters > 0 && (
                  <span className="inline-flex items-center justify-center text-xs bg-gold/20 text-gold min-w-[22px] h-[22px] px-1.5 rounded-full font-bold border border-gold/30">
                    {totalActiveFilters}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Sluit filters"
              >
                <CloseIcon className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
            </div>

            {/* Filters */}
            <div className="px-5 pb-28">
              {/* Italy Map Filter - Mobile */}
              <div className="py-5 border-b border-sand/40">
                <p className="text-xs text-grey uppercase tracking-widest mb-3 font-medium font-serif">Ontdek per Regio</p>
                <div className="bg-champagne/30 rounded-xl p-3">
                  <ItalyWineMap
                    size="full"
                    onRegionClick={handleMapRegionClick}
                    selectedRegion={selectedRegion}
                    activeRegionSlugs={activeRegionSlugs}
                    className="mx-auto max-w-[280px]"
                  />
                </div>
                {selectedRegion && (
                  <button
                    onClick={() => onFilterChange("region", selectedRegion, false)}
                    className="mt-3 text-xs text-gold hover:text-gold-light font-medium w-full text-center flex items-center justify-center gap-1 hover:underline underline-offset-2 transition-all"
                  >
                    <FilterResetIcon className="w-3 h-3" strokeWidth={1.5} />
                    Wis regio filter
                  </button>
                )}
              </div>

              {filters.map((group) => (
                <FilterAccordion
                  key={group.id}
                  group={group}
                  activeValues={activeFilters[group.id] || []}
                  onFilterChange={(value, checked) =>
                    onFilterChange(group.id, value, checked)
                  }
                />
              ))}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 max-w-sm bg-cream/95 backdrop-blur-md border-t border-sand/50 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <Button
                variant="secondary"
                onClick={onClearAll}
                disabled={totalActiveFilters === 0}
                className="flex-1 !bg-transparent !border-sand !text-charcoal hover:!border-wine/30 hover:!text-wine"
              >
                Wissen ({totalActiveFilters})
              </Button>
              <Button variant="primary" onClick={onClose} className="flex-1 !bg-[image:var(--wine-gradient)] hover:!bg-[image:var(--wine-gradient-hover)]">
                Toon resultaten
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Desktop sidebar version
  const desktopContent = (
    <aside className={cn("hidden lg:block w-64 flex-shrink-0", className)}>
      <div className="sticky top-24 bg-cream/80 rounded-2xl shadow-[0_1px_8px_rgba(26,26,26,0.05)] border border-sand/40 p-5">
        {/* Header with clear all */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-lg font-semibold text-charcoal flex items-center gap-2">
            Filters
            {totalActiveFilters > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center text-[10px] bg-gold/15 text-gold min-w-[20px] h-[20px] px-1.5 rounded-full font-bold border border-gold/20"
              >
                {totalActiveFilters}
              </motion.span>
            )}
          </h2>
          <AnimatePresence>
            {totalActiveFilters > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={onClearAll}
                className="text-sm text-gold hover:text-gold-light font-medium flex items-center gap-1 transition-colors hover:underline underline-offset-2"
              >
                <FilterResetIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                Wis alles
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {/* Gold accent line */}
        <div className="h-px bg-gradient-to-r from-gold/40 via-gold/20 to-transparent mb-4" />

        {/* Italy Map Filter */}
        <div className="border-t border-sand/40 py-4">
          <p className="text-xs text-grey uppercase tracking-widest mb-3 font-medium font-serif">Ontdek per Regio</p>
          <div className="bg-champagne/25 rounded-xl p-3">
            <ItalyWineMap
              size="full"
              onRegionClick={handleMapRegionClick}
              selectedRegion={selectedRegion}
              activeRegionSlugs={activeRegionSlugs}
              className="mx-auto"
            />
          </div>
          {selectedRegion && (
            <button
              onClick={() => onFilterChange("region", selectedRegion, false)}
              className="mt-3 text-xs text-gold hover:text-gold-light font-medium w-full text-center flex items-center justify-center gap-1 transition-colors hover:underline underline-offset-2"
            >
              <FilterResetIcon className="w-3 h-3" strokeWidth={1.5} />
              Wis regio filter
            </button>
          )}
        </div>

        {/* Filter groups */}
        <div className="border-t border-sand/40">
          {filters.map((group) => (
            <FilterAccordion
              key={group.id}
              group={group}
              activeValues={activeFilters[group.id] || []}
              onFilterChange={(value, checked) =>
                onFilterChange(group.id, value, checked)
              }
            />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {mobileContent}
      {desktopContent}
    </>
  );
}

// Active filters display
export interface ActiveFilterTagsProps {
  activeFilters: ActiveFilters;
  filterGroups: FilterGroup[];
  onRemove: (groupId: string, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterTags({
  activeFilters,
  filterGroups,
  onRemove,
  onClearAll,
}: ActiveFilterTagsProps) {
  const allActive = Object.entries(activeFilters).flatMap(([groupId, values]) =>
    values.map((value) => {
      const group = filterGroups.find((g) => g.id === groupId);
      const option = group?.options.find((o) => o.value === value);
      return {
        groupId,
        value,
        label: option?.label || value,
        groupLabel: group?.label || groupId,
      };
    })
  );

  if (allActive.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-6"
    >
      <span className="text-sm text-grey font-serif italic font-medium">Actief:</span>
      <AnimatePresence>
        {allActive.map((filter) => (
          <motion.button
            key={`${filter.groupId}-${filter.value}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            onClick={() => onRemove(filter.groupId, filter.value)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-champagne/60 text-wine text-sm rounded-full hover:bg-champagne/90 transition-all duration-200 border border-gold/25 hover:border-gold/40 group/tag shadow-[0_1px_2px_rgba(201,162,39,0.08)]"
          >
            <span className="font-medium tracking-wide">{filter.label}</span>
            <CloseIcon className="w-3 h-3 text-gold opacity-70 group-hover/tag:opacity-100 transition-opacity" strokeWidth={2} />
          </motion.button>
        ))}
      </AnimatePresence>
      {allActive.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gold hover:text-gold-light font-medium underline underline-offset-2 transition-colors"
        >
          Wis alles
        </button>
      )}
    </motion.div>
  );
}
