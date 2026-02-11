"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, CheckIcon, AwardIcon } from "@/components/icons";
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
  const [openItems, setOpenItems] = useState<string[]>(["technical"]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const items: AccordionItem[] = [
    {
      id: "technical",
      title: "Technische Details",
      icon: ClipboardIcon,
      content: (
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { label: "Druivenras", value: product.grapeVarieties.join(", ") },
            { label: "Land", value: product.country },
            { label: "Regio", value: product.region },
            { label: "Jaargang", value: product.vintage === "NV" ? "Non-Vintage" : product.vintage },
            { label: "Alcoholpercentage", value: "13.5%" },
            { label: "Inhoud", value: "750ml" },
            { label: "Wijnstijl", value: getWineStyleLabel(product.wineType) },
            { label: "Sluiting", value: "Natuurkurk" },
          ].map((detail) => (
            <div key={detail.label} className="flex justify-between py-2 border-b border-sand/50">
              <span className="text-grey">{detail.label}</span>
              <span className="font-medium text-charcoal">{detail.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "vinification",
      title: "Vinificatie & Rijping",
      icon: BarrelIcon,
      content: (
        <div className="space-y-4 text-charcoal">
          <p>
            <strong className="text-wine">Oogst:</strong> Handgeplukt in de vroege ochtenduren om de frisheid van de druiven te behouden.
          </p>
          <p>
            <strong className="text-wine">Vinificatie:</strong> {product.wineType === "red"
              ? "Koude maceratie gedurende 3-4 dagen, gevolgd door gisting op gecontroleerde temperatuur in roestvrijstalen tanks. Malolactische gisting volledig afgerond."
              : product.wineType === "white"
              ? "Zachte persing en gisting op lage temperatuur in roestvrijstalen tanks om de frisse aroma's te behouden."
              : "Directe persing en gisting op lage temperatuur voor een frisse, fruitige stijl."}
          </p>
          <p>
            <strong className="text-wine">Rijping:</strong> {product.wineType === "red"
              ? "12-18 maanden in Franse eiken barriques (30% nieuw hout), gevolgd door minimaal 6 maanden flesrijping."
              : "4-6 maanden op de fijne droesem in roestvrijstalen tanks voor extra complexiteit."}
          </p>
          <p>
            <strong className="text-wine">Productie:</strong> Beperkte oplage van zorgvuldig geselecteerde wijngaarden.
          </p>
        </div>
      ),
    },
    {
      id: "storage",
      title: "Opslag & Drinkadvies",
      icon: CellarIcon,
      content: (
        <div className="space-y-4 text-charcoal">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-champagne/30 rounded-lg p-4">
              <h4 className="font-semibold text-wine mb-2 flex items-center gap-2">
                <StorageIcon className="w-5 h-5" />
                Bewaren
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Horizontaal bewaren
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Temperatuur: 12-14°C
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Luchtvochtigheid: 70%
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Donker en trillingsvrij
                </li>
              </ul>
            </div>
            <div className="bg-champagne/30 rounded-lg p-4">
              <h4 className="font-semibold text-wine mb-2 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Optimaal Drinken
              </h4>
              <p className="text-sm mb-2">
                {product.wineType === "red"
                  ? "Deze wijn kan nu gedronken worden, maar zal de komende 5-10 jaar nog mooier evolueren."
                  : product.wineType === "white"
                  ? "Op zijn best binnen 2-4 jaar na oogst. Drink bij voorkeur jong voor optimale frisheid."
                  : "Drink bij voorkeur binnen 1-2 jaar voor maximale frisheid en fruitigheid."}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-grey">Drinkvenster:</span>
                <span className="font-semibold text-wine">
                  {product.wineType === "red" ? "2024 - 2034" : product.wineType === "white" ? "2024 - 2028" : "2024 - 2026"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "producer",
      title: "Over de Producent",
      icon: WineryIcon,
      content: (
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <p className="text-charcoal mb-4">
              Dit familiewijngoed, al generaties in dezelfde familie, combineert traditionele wijnmaakmethoden met moderne technieken.
              Gelegen in het hart van {product.region}, profiteren de wijngaarden van een uniek microklimaat en rijke bodemsamenstelling.
            </p>
            <p className="text-charcoal mb-4">
              De wijnmaker is bekend om zijn passie voor kwaliteit en zijn toewijding aan duurzame wijngaarden.
              Elk fles vertelt het verhaal van de streek en het vakmanschap dat van generatie op generatie is doorgegeven.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 bg-success/10 text-success px-3 py-1 rounded-full text-sm">
                <LeafIcon className="w-4 h-4" />
                Duurzame teelt
              </span>
              <span className="inline-flex items-center gap-1 bg-wine/10 text-wine px-3 py-1 rounded-full text-sm">
                <AwardIcon className="w-4 h-4" />
                Bekroonde wijnen
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={cn("bg-white rounded-xl sm:rounded-2xl border border-sand/50 overflow-hidden", className)}>
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
function getWineStyleLabel(wineType: string): string {
  switch (wineType) {
    case "red": return "Rode wijn";
    case "white": return "Witte wijn";
    case "rose": return "Rosé";
    case "sparkling": return "Mousserende wijn";
    default: return "Wijn";
  }
}

// Icons
function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 4H18C19.1 4 20 4.9 20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V6C4 4.9 4.9 4 6 4H8" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  );
}

function BarrelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <ellipse cx="12" cy="19" rx="8" ry="3" />
      <path d="M4 5V19" />
      <path d="M20 5V19" />
      <path d="M4 12C4 12 8 14 12 14C16 14 20 12 20 12" />
    </svg>
  );
}

function CellarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21H21" />
      <path d="M5 21V7L12 3L19 7V21" />
      <rect x="9" y="13" width="6" height="8" />
    </svg>
  );
}

function WineryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21H21" />
      <path d="M5 21V11L12 5L19 11V21" />
      <path d="M9 21V15H15V21" />
      <path d="M9 11H15" />
    </svg>
  );
}

function StorageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9H21" />
      <path d="M3 15H21" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2V6" />
      <path d="M8 2V6" />
      <path d="M3 10H21" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 21C6 21 8 17 12 13C16 9 20 7 20 3C14 3 8 6 6 12C4 18 6 21 6 21Z" />
      <path d="M6 21C6 21 6 15 12 13" />
    </svg>
  );
}

