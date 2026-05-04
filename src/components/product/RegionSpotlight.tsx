"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRightIcon, MapPinIcon } from "@/components/icons";
import { regionNameToSlug } from "@/lib/region-utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useUiCopy } from "@/components/providers";

const ItalyWineMap = dynamic(
  () => import("@/components/map").then((mod) => mod.ItalyWineMap),
  { loading: () => <div className="h-[300px] bg-sand/30 rounded-lg animate-pulse" /> }
);

interface RegionSpotlightProps {
  product: Product;
  className?: string;
  activeRegionSlugs?: string[];
}

export function RegionSpotlight({ product, className, activeRegionSlugs }: RegionSpotlightProps) {
  const t = useUiCopy();
  if (!product.region) return null;

  const slug = regionNameToSlug(product.region);
  if (!slug) return null;

  return (
    <div className={cn("bg-gradient-to-br from-wine/5 via-champagne/20 to-cream rounded-2xl overflow-hidden", className)}>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <ItalyWineMap
                size="md"
                selectedRegion={slug}
                activeRegionSlugs={activeRegionSlugs}
                regionLabels={{ [slug]: product.region }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="w-5 h-5 text-wine" />
              <span className="text-sm text-grey uppercase tracking-wider">{t("region.label")}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal mb-6">
              {product.region}
            </h2>

            <Link
              href={`/wijnen?region=${slug}`}
              className="inline-flex items-center gap-2 bg-wine-gradient text-white px-6 py-3 rounded-lg font-medium hover:bg-wine-gradient-hover transition-colors"
            >
              <span>{product.region}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
