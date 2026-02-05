"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Checkbox, Button } from "@/components/ui";
import { ItalyWineMap, type WineRegionData } from "@/components/map";

// Icons
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

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
    <div className="border-b border-sand py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-charcoal flex items-center gap-2">
          {group.label}
          {activeCount > 0 && (
            <span className="text-xs bg-wine text-white px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={cn(
            "w-5 h-5 text-grey transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-1">
              {visibleOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  count={option.count}
                  checked={activeValues.includes(option.value)}
                  onChange={(e) => onFilterChange(option.value, e.target.checked)}
                />
              ))}
              {hasMore && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm text-wine hover:underline mt-2"
                >
                  {showAll ? "Toon minder" : `+ ${group.options.length - 6} meer`}
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

    // Toggle: if already selected, deselect; otherwise select
    if (isCurrentlySelected) {
      onFilterChange("region", region.slug, false);
    } else {
      // Clear other regions first, then select this one
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
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-sand px-4 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sand/50 rounded-md"
                aria-label="Sluit filters"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-4 pb-24">
              {/* Italy Map Filter - Mobile */}
              <div className="py-4 border-b border-sand">
                <p className="text-xs text-grey uppercase tracking-wider mb-3">Ontdek per Regio</p>
                <ItalyWineMap
                  size="full"
                  onRegionClick={handleMapRegionClick}
                  selectedRegion={selectedRegion}
                  className="mx-auto max-w-[280px]"
                />
                {selectedRegion && (
                  <button
                    onClick={() => onFilterChange("region", selectedRegion, false)}
                    className="mt-3 text-xs text-wine hover:underline w-full text-center"
                  >
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
            <div className="fixed bottom-0 left-0 right-0 max-w-sm bg-white border-t border-sand p-4 flex gap-3">
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
          <h2 className="font-semibold text-charcoal">Filters</h2>
          {totalActiveFilters > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-wine hover:underline"
            >
              Wis alles ({totalActiveFilters})
            </button>
          )}
        </div>

        {/* Italy Map Filter */}
        <div className="border-t border-sand py-4">
          <p className="text-xs text-grey uppercase tracking-wider mb-3">Ontdek per Regio</p>
          <ItalyWineMap
            size="full"
            onRegionClick={handleMapRegionClick}
            selectedRegion={selectedRegion}
            className="mx-auto"
          />
          {selectedRegion && (
            <button
              onClick={() => onFilterChange("region", selectedRegion, false)}
              className="mt-3 text-xs text-wine hover:underline w-full text-center"
            >
              Wis regio filter
            </button>
          )}
        </div>

        {/* Filter groups */}
        <div className="border-t border-sand">
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
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-grey">Actieve filters:</span>
      {allActive.map((filter) => (
        <button
          key={`${filter.groupId}-${filter.value}`}
          onClick={() => onRemove(filter.groupId, filter.value)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-wine/10 text-wine text-sm rounded-full hover:bg-wine/20 transition-colors"
        >
          <span>{filter.label}</span>
          <CloseIcon className="w-3 h-3" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-grey hover:text-charcoal underline"
      >
        Wis alles
      </button>
    </div>
  );
}
