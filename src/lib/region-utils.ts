import type { Product } from "@/types";

export interface RegionMapping {
  displayName: string;
  slug: string;
  svgId: string;
  famousWines: string[];
}

const REGION_SLUG_ALIASES: Record<string, string> = {
  piedmont: "piemonte",
  tuscany: "toscana",
  apulia: "puglia",
  sicily: "sicilia",
  sardinia: "sardegna",
  "friuli-venezia-giulia": "friuli",
  "friuli-vg": "friuli",
  "aosta-valley": "valle-daosta",
  "valle-d-aosta": "valle-daosta",
  "trentino-south-tyrol": "alto-adige",
  "trentino-alto-adige": "alto-adige",
  "trentino-alto-adige-sudtirol": "alto-adige",
};

const REGION_DISPLAY_NAMES: Record<string, string> = {
  piemonte: "Piemonte",
  lombardia: "Lombardia",
  "alto-adige": "Alto Adige",
  veneto: "Veneto",
  friuli: "Friuli",
  "emilia-romagna": "Emilia-Romagna",
  liguria: "Liguria",
  "valle-daosta": "Valle d'Aosta",
  toscana: "Toscana",
  umbria: "Umbrië",
  marche: "Marche",
  lazio: "Lazio",
  abruzzo: "Abruzzo",
  molise: "Molise",
  campania: "Campania",
  puglia: "Puglia",
  basilicata: "Basilicata",
  calabria: "Calabria",
  sicilia: "Sicilië",
  sardegna: "Sardinië",
};

function slugifyRegion(value: string): string | undefined {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || undefined;
}

export function canonicalRegionSlug(slug: string): string {
  return REGION_SLUG_ALIASES[slug] ?? slug;
}

export function regionNameToSlug(name: string): string | undefined {
  const slug = slugifyRegion(name);
  return slug ? canonicalRegionSlug(slug) : undefined;
}

export function slugToDisplayName(slug: string): string | undefined {
  const canonicalSlug = canonicalRegionSlug(slug);
  if (REGION_DISPLAY_NAMES[canonicalSlug]) return REGION_DISPLAY_NAMES[canonicalSlug];

  const label = canonicalSlug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return label || undefined;
}

export function slugToRegionNames(slug: string): string[] {
  const canonicalSlug = canonicalRegionSlug(slug);
  const displayName = slugToDisplayName(canonicalSlug);
  return Array.from(new Set([canonicalSlug, slug, displayName].filter(Boolean) as string[]));
}

export function getActiveRegionSlugsFromProducts(products: Product[]): string[] {
  const slugSet = new Set<string>();
  for (const product of products) {
    const slug = product.region ? regionNameToSlug(product.region) : undefined;
    if (slug) slugSet.add(slug);
  }
  return Array.from(slugSet).sort();
}

export function getRegionLabelsFromProducts(products: Product[]): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const product of products) {
    const slug = product.region ? regionNameToSlug(product.region) : undefined;
    if (slug && !labels[slug]) {
      labels[slug] = product.region;
    }
  }
  return labels;
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
