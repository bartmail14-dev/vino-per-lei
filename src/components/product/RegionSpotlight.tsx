"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { MapPinIcon, SunIcon, GrapeIcon, ArrowRightIcon } from "@/components/icons";
import type { Product } from "@/types";

// Lazy load the map component
const ItalyWineMap = dynamic(
  () => import("@/components/map").then(mod => mod.ItalyWineMap),
  {
    loading: () => <div className="h-[300px] bg-sand/30 rounded-lg animate-pulse" />,
  }
);

interface RegionSpotlightProps {
  product: Product;
  className?: string;
}

interface RegionInfo {
  name: string;
  slug: string;
  description: string;
  climate: string;
  soil: string;
  famousWines: string[];
}

export function RegionSpotlight({ product, className }: RegionSpotlightProps) {
  const regionInfo = getRegionInfo(product.region);

  return (
    <div className={cn("bg-gradient-to-br from-wine/5 via-champagne/20 to-cream rounded-2xl overflow-hidden", className)}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <ItalyWineMap
                size="md"
                selectedRegion={regionInfo?.slug}
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="w-5 h-5 text-wine" />
              <span className="text-sm text-grey uppercase tracking-wider">Wijnregio</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal mb-4">
              {product.region}
            </h2>

            <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
              {regionInfo?.description || `${product.region} is een van de meest prestigieuze wijnregio's van ${product.country}, bekend om zijn uitzonderlijke wijnen en rijke wijntraditie.`}
            </p>

            {regionInfo && (
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <SunIcon className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-charcoal">Klimaat</h4>
                    <p className="text-sm text-grey">{regionInfo.climate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MountainIcon className="w-5 h-5 text-wine mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-charcoal">Terroir</h4>
                    <p className="text-sm text-grey">{regionInfo.soil}</p>
                  </div>
                </div>
              </div>
            )}

            {regionInfo?.famousWines && (
              <div className="mb-8">
                <h4 className="font-medium text-charcoal mb-3">Bekende Wijnen</h4>
                <div className="flex flex-wrap gap-2">
                  {regionInfo.famousWines.map((wine) => (
                    <span
                      key={wine}
                      className="inline-flex items-center bg-white/70 text-charcoal px-3 py-1.5 rounded-full text-sm border border-sand/50"
                    >
                      <GrapeIcon className="w-4 h-4 text-wine mr-1.5" />
                      {wine}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/wijnen?region=${regionInfo?.slug || product.region.toLowerCase()}`}
              className="inline-flex items-center gap-2 bg-wine text-white px-6 py-3 rounded-lg font-medium hover:bg-wine-dark transition-colors"
            >
              <span>Ontdek alle wijnen uit {product.region}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Region data
function getRegionInfo(region: string): RegionInfo | null {
  const regions: Record<string, RegionInfo> = {
    "Piemonte": {
      name: "Piemonte",
      slug: "piemonte",
      description: "De mistige heuvels van Piemonte zijn de geboorteplaats van 's werelds meest prestigieuze Nebbiolo-wijnen. Deze noordwestelijke regio staat bekend om elegante, krachtige rode wijnen met een ongeëvenaarde complexiteit.",
      climate: "Continentaal klimaat met koele nachten en warme dagen",
      soil: "Kalkhoudende klei en mergel",
      famousWines: ["Barolo", "Barbaresco", "Barbera", "Dolcetto"],
    },
    "Veneto": {
      name: "Veneto",
      slug: "veneto",
      description: "Van de Dolomiti tot de Adriatische Zee, Veneto is een van Italië's meest diverse wijnregio's. Beroemd om Prosecco, Amarone en de charmante wijnen van Valpolicella.",
      climate: "Gematigd met invloeden van de Alpen en de Adriatische Zee",
      soil: "Vulkanisch, klei en kalksteen",
      famousWines: ["Prosecco", "Amarone", "Valpolicella", "Soave"],
    },
    "Toscana": {
      name: "Toscana",
      slug: "toscana",
      description: "Het icoonische Toscaanse landschap met cipressen en glooiende heuvels is synoniem met Italiaanse wijn. Hier gedijt de Sangiovese-druif en ontstaan legendarische wijnen.",
      climate: "Mediterraan met warme, droge zomers",
      soil: "Galestro schalie en kalksteen",
      famousWines: ["Chianti", "Brunello", "Vino Nobile", "Super Tuscan"],
    },
    "Friuli-Venezia Giulia": {
      name: "Friuli-Venezia Giulia",
      slug: "friuli",
      description: "Een van Italië's beste witte wijnregio's, waar de koele invloeden van de Alpen en de Adriatische bries resulteren in aromatische, minerale wijnen van wereldklasse.",
      climate: "Koel continentaal met maritieme invloeden",
      soil: "Ponca mergel en klei",
      famousWines: ["Friulano", "Pinot Grigio", "Ribolla Gialla", "Sauvignon"],
    },
    "Trentino-Alto Adige": {
      name: "Trentino-Alto Adige",
      slug: "trentino",
      description: "In de schaduw van de Dolomiti produceren wijnmakers hier enkele van Italië's meest elegante en verfrissende wijnen, met een unieke mix van Italiaanse en Oostenrijkse tradities.",
      climate: "Alpien met grote temperatuurverschillen",
      soil: "Dolomietkalksteen en porfier",
      famousWines: ["Gewürztraminer", "Pinot Grigio", "Lagrein", "Teroldego"],
    },
    "Puglia": {
      name: "Puglia",
      slug: "puglia",
      description: "De 'hak van de laars' is Italië's grootste wijnproducent. Het warme klimaat en de rijke bodem zorgen voor krachtige, fruitgedreven wijnen met een uitstekende prijs-kwaliteitverhouding.",
      climate: "Mediterraan met hete, droge zomers",
      soil: "Kalksteen en rode klei",
      famousWines: ["Primitivo", "Negroamaro", "Salice Salentino"],
    },
    "Abruzzo": {
      name: "Abruzzo",
      slug: "abruzzo",
      description: "Tussen de Apennijnen en de Adriatische Zee ligt deze onderschatte regio, beroemd om de Montepulciano d'Abruzzo en verfrissende Cerasuolo rosé.",
      climate: "Mediterraan met continentale invloeden",
      soil: "Klei en kalksteen",
      famousWines: ["Montepulciano d'Abruzzo", "Cerasuolo", "Trebbiano"],
    },
  };

  return regions[region] || null;
}

function MountainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 21L12 11L16 21" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 21H22" strokeLinecap="round" />
      <path d="M15 21L19 13L22 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

