"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Checkbox, Button } from "@/components/ui";
import { ItalyWineMap, type WineRegionData } from "@/components/map";
import { ChevronDown as ChevronDownIcon, X as CloseIcon, RotateCcw as FilterResetIcon } from "lucide-react";

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
    <div className="border-b border-sand/60 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group/accordion"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-charcoal text-sm flex items-center gap-2 group-hover/accordion:text-wine transition-colors">
          {group.label}
          {activeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center text-[10px] bg-wine text-white min-w-[18px] h-[18px] px-1 rounded-full font-bold"
            >
              {activeCount}
            </motion.span>
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4 text-grey" strokeWidth={1.5} />
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
            <div className="pt-3 space-y-0.5">
              {visibleOptions.map((option) => {
                const isActive = activeValues.includes(option.value);
                return (
                  <motion.div
                    key={option.value}
                    layout
                    className={cn(
                      "rounded-md px-1 -mx-1 transition-colors duration-200",
                      isActive && "bg-wine/5"
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
                  className="text-sm text-wine hover:text-wine-dark font-medium mt-2 flex items-center gap-1 transition-colors"
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

  // Get currently selected region for the map
  const selectedRegion = activeFilters["region"]?.[0] || null;

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
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-sand/60 px-4 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-semibold">Filters</h2>
                {totalActiveFilters > 0 && (
                  <span className="inline-flex items-center justify-center text-xs bg-wine text-white min-w-[22px] h-[22px] px-1.5 rounded-full font-bold">
                    {totalActiveFilters}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-sand/40 rounded-lg transition-colors"
                aria-label="Sluit filters"
              >
                <CloseIcon className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Filters */}
            <div className="px-4 pb-28">
              {/* Italy Map Filter - Mobile */}
              <div className="py-4 border-b border-sand/60">
                <p className="text-xs text-grey uppercase tracking-wider mb-3 font-medium">Ontdek per Regio</p>
                <ItalyWineMap
                  size="full"
                  onRegionClick={handleMapRegionClick}
                  selectedRegion={selectedRegion}
                  className="mx-auto max-w-[280px]"
                />
                {selectedRegion && (
                  <button
                    onClick={() => onFilterChange("region", selectedRegion, false)}
                    className="mt-3 text-xs text-wine hover:text-wine-dark font-medium w-full text-center flex items-center justify-center gap-1"
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
            <div className="fixed bottom-0 left-0 right-0 max-w-sm bg-white/95 backdrop-blur-sm border-t border-sand/60 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <Button
                variant="secondary"
                onClick={onClearAll}
                disabled={totalActiveFilters === 0}
                className="flex-1"
              >
                Wissen ({totalActiveFilters})
              </Button>
              <Button variant="primary" onClick={onClose} className="flex-1">
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
      <div className="sticky top-24">
        {/* Header with clear all */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-charcoal flex items-center gap-2">
            Filters
            {totalActiveFilters > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center text-[10px] bg-wine text-white min-w-[18px] h-[18px] px-1 rounded-full font-bold"
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
                className="text-sm text-wine hover:text-wine-dark font-medium flex items-center gap-1 transition-colors"
              >
                <FilterResetIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                Wis alles
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Italy Map Filter */}
        <div className="border-t border-sand/60 py-4">
          <p className="text-xs text-grey uppercase tracking-wider mb-3 font-medium">Ontdek per Regio</p>
          <ItalyWineMap
            size="full"
            onRegionClick={handleMapRegionClick}
            selectedRegion={selectedRegion}
            className="mx-auto"
          />
          {selectedRegion && (
            <button
              onClick={() => onFilterChange("region", selectedRegion, false)}
              className="mt-3 text-xs text-wine hover:text-wine-dark font-medium w-full text-center flex items-center justify-center gap-1 transition-colors"
            >
              <FilterResetIcon className="w-3 h-3" strokeWidth={1.5} />
              Wis regio filter
            </button>
          )}
        </div>

        {/* Filter groups */}
        <div className="border-t border-sand/60">
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
      <span className="text-sm text-grey font-medium">Actief:</span>
      <AnimatePresence>
        {allActive.map((filter) => (
          <motion.button
            key={`${filter.groupId}-${filter.value}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            onClick={() => onRemove(filter.groupId, filter.value)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-wine/8 text-wine text-sm rounded-full hover:bg-wine/15 transition-colors border border-wine/10 hover:border-wine/20 group/tag"
          >
            <span className="font-medium">{filter.label}</span>
            <CloseIcon className="w-3 h-3 opacity-60 group-hover/tag:opacity-100 transition-opacity" strokeWidth={1.5} />
          </motion.button>
        ))}
      </AnimatePresence>
      {allActive.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-grey hover:text-wine font-medium underline underline-offset-2 transition-colors"
        >
          Wis alles
        </button>
      )}
    </motion.div>
  );
}
