"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUiCopy } from "@/components/providers";
import { ChevronDownIcon, CheckIcon } from "@/components/icons";
import { ClipboardList, Warehouse, GrapeIcon, UserCircle } from "lucide-react";
import type { Product } from "@/types";

interface WineDetailsAccordionProps {
  product: Product;
  className?: string;
}

interface AccordionItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export function WineDetailsAccordion({ product, className }: WineDetailsAccordionProps) {
  const t = useUiCopy();
  const [openItems, setOpenItems] = useState<string[]>(["technical"]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const rawItems: AccordionItem[] = [
    {
      id: "technical",
      title: t("product.details.title"),
      icon: ClipboardList,
      content: (
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { label: t("product.details.grape"), value: product.grapeVarieties.join(", ") },
            { label: t("product.details.country"), value: product.country },
            { label: t("product.details.region"), value: product.region },
            {
              label: t("product.details.vintage"),
              value: product.vintage === t("product.details.vintage_code_non_vintage") ? t("product.details.non_vintage") : product.vintage,
            },
            { label: t("product.alcohol_percentage.label"), value: product.alcoholPercentage },
            { label: t("product.bottle_volume.label"), value: product.bottleVolume },
            { label: t("product.wine_style.label"), value: getWineStyleLabel(product.wineType, t) },
            { label: "Serveertemperatuur", value: product.servingTemperature },
            { label: "Decanteertijd", value: [product.decantTime, product.decantNote].filter(Boolean).join(" — ") || undefined },
            { label: t("product.closure.label"), value: product.closure },
            { label: "Verkoopeenheid", value: product.purchaseUnit },
            { label: t("product.allergens.label"), value: product.allergens },
          ].filter((detail) => detail.value).map((detail) => (
            <div key={detail.label} className="flex justify-between py-2 border-b border-sand/50">
              <span className="text-grey">{detail.label}</span>
              <span className="font-medium text-charcoal">{detail.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    // Vinification â€” show real metafield data, or placeholder
    {
      id: "vinification",
      title: t("product.vinification.title"),
      icon: GrapeIcon,
      content: (
        <div className="space-y-3 text-charcoal">
          {product.vinification ? (<p className="text-sm leading-relaxed">{product.vinification}</p>) : null}
        </div>
      ),
    },
    {
      id: "storage",
      title: t("product.storage.title"),
      icon: CellarIcon,
      content: (
        <div className="space-y-4 text-charcoal">
          <div className="bg-champagne/30 rounded-lg p-4">
            <h4 className="font-semibold text-wine mb-2 flex items-center gap-2">
              <Warehouse className="w-5 h-5" strokeWidth={1.5} />
              {t("product.storage.keep")}
            </h4>
            <ul className="space-y-2 text-sm">
              {product.storageAdvice?.map((advice) => (
                <li key={advice} className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  {advice}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    // Producer section â€” show real metafield data, or placeholder
    {
      id: "producer",
      title: t("product.producer.title"),
      icon: UserCircle,
      content: (
        <div className="space-y-3 text-charcoal">
          {product.producerStory ? (<p className="text-sm leading-relaxed">{product.producerStory}</p>) : null}
        </div>
      ),
    },
  ];

  const items = rawItems.filter((item) => {
    if (item.id === "vinification") return Boolean(product.vinification);
    if (item.id === "storage") return Boolean(product.storageAdvice?.length);
    if (item.id === "producer") return Boolean(product.producerStory);
    return true;
  });

  if (items.length === 0) return null;

  return (
    <div className={cn("bg-white rounded-lg sm:rounded-2xl border border-sand/50 overflow-hidden", className)}>
      {items.map((item, index) => (
        <div key={item.id} className={cn(index !== 0 && "border-t border-sand/50")}>
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between active:bg-champagne/20 sm:hover:bg-champagne/10 transition-colors min-h-[60px]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-wine" />
              </div>
              <h3 className="font-semibold text-charcoal text-sm sm:text-base text-left">{item.title}</h3>
            </div>
            <ChevronDownIcon className={cn(
              "w-5 h-5 text-grey transition-transform duration-300 flex-shrink-0",
              openItems.includes(item.id) && "rotate-180"
            )} />
          </button>

          <AnimatePresence>
            {openItems.includes(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// Helper
function getWineStyleLabel(wineType: string, t: (key: string) => string): string {
  switch (wineType) {
    case "red": return t("product.wine_type.red_full");
    case "white": return t("product.wine_type.white_full");
    case "rose": return t("product.wine_type.rose_full");
    case "sparkling": return t("product.wine_type.sparkling_full");
    default: return t("product.wine_type.default");
  }
}

// Wine-specific custom icons (no Lucide equivalent)
function CellarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21H21" />
      <path d="M5 21V7L12 3L19 7V21" />
      <rect x="9" y="13" width="6" height="8" />
    </svg>
  );
}


