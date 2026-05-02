import type { Product } from "@/types";

export interface RegionMapping {
  displayName: string;
  slug: string;
  svgId: string;
  famousWines: string[];
}

export function regionNameToSlug(name: string): string | undefined {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || undefined;
}

export function slugToDisplayName(slug: string): string | undefined {
  const label = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return label || undefined;
}

export function slugToRegionNames(slug: string): string[] {
  return [slug];
}

export function getActiveRegionSlugsFromProducts(products: Product[]): string[] {
  const slugSet = new Set<string>();
  for (const product of products) {
    const slug = product.region ? regionNameToSlug(product.region) : undefined;
    if (slug) slugSet.add(slug);
  }
  return Array.from(slugSet).sort();
}

export function buildRegionLinks(products: Product[]): { label: string; href: string }[] {
  const bySlug = new Map<string, string>();
  for (const product of products) {
    const slug = product.region ? regionNameToSlug(product.region) : undefined;
    if (slug && !bySlug.has(slug)) bySlug.set(slug, product.region);
  }
  return Array.from(bySlug.entries())
    .sort((a, b) => a[1].localeCompare(b[1], "nl"))
    .map(([slug, label]) => ({ label, href: `/wijnen?region=${slug}` }));
}

export function getRegionByName(name: string): RegionMapping | undefined {
  const slug = regionNameToSlug(name);
  return slug ? { displayName: name, slug, svgId: slug, famousWines: [] } : undefined;
}

export function getRegionMappingBySlug(slug: string): RegionMapping | undefined {
  const displayName = slugToDisplayName(slug);
  return displayName ? { displayName, slug, svgId: slug, famousWines: [] } : undefined;
}

export function getRegionBySvgId(svgId: string): RegionMapping | undefined {
  return getRegionMappingBySlug(svgId);
}

export const REGION_MAPPINGS: RegionMapping[] = [];
