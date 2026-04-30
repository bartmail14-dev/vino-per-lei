import type { Product } from "@/types";

// Central mapping: product region display name → slug → SVG map ID
// This is the single source of truth for region identity across the app
interface RegionMapping {
  displayName: string;
  slug: string;
  svgId: string; // ID used by @svg-maps/italy
  famousWines: string[];
}

const REGION_MAPPINGS: RegionMapping[] = [
  // Northern Italy
  { displayName: "Piemonte", slug: "piemonte", svgId: "piedmont", famousWines: ["Barolo", "Barbaresco", "Barbera d'Alba", "Nebbiolo"] },
  { displayName: "Lombardia", slug: "lombardia", svgId: "lombardy", famousWines: ["Franciacorta", "Valtellina", "Oltrepo Pavese"] },
  { displayName: "Alto Adige", slug: "alto-adige", svgId: "trentino-south-tyrol", famousWines: ["Pinot Grigio", "Gewurztraminer", "Lagrein"] },
  { displayName: "Trentino-Alto Adige", slug: "alto-adige", svgId: "trentino-south-tyrol", famousWines: ["Pinot Grigio", "Gewurztraminer", "Lagrein"] },
  { displayName: "Veneto", slug: "veneto", svgId: "veneto", famousWines: ["Amarone", "Valpolicella Ripasso", "Prosecco", "Soave"] },
  { displayName: "Friuli-Venezia Giulia", slug: "friuli", svgId: "friuli-venezia-giulia", famousWines: ["Pinot Grigio", "Friulano", "Ribolla Gialla"] },
  { displayName: "Friuli", slug: "friuli", svgId: "friuli-venezia-giulia", famousWines: ["Pinot Grigio", "Friulano", "Ribolla Gialla"] },
  { displayName: "Emilia-Romagna", slug: "emilia-romagna", svgId: "emilia-romagna", famousWines: ["Lambrusco", "Sangiovese di Romagna"] },
  { displayName: "Liguria", slug: "liguria", svgId: "liguria", famousWines: ["Cinque Terre", "Pigato", "Vermentino"] },
  { displayName: "Valle d'Aosta", slug: "valle-daosta", svgId: "aosta-valley", famousWines: ["Petit Rouge", "Fumin"] },
  // Central Italy
  { displayName: "Toscana", slug: "toscana", svgId: "tuscany", famousWines: ["Chianti Classico", "Brunello di Montalcino", "Super Tuscans"] },
  { displayName: "Umbria", slug: "umbria", svgId: "umbria", famousWines: ["Sagrantino di Montefalco", "Orvieto"] },
  { displayName: "Marche", slug: "marche", svgId: "marche", famousWines: ["Verdicchio", "Rosso Conero"] },
  { displayName: "Lazio", slug: "lazio", svgId: "lazio", famousWines: ["Frascati", "Est! Est!! Est!!!"] },
  { displayName: "Abruzzo", slug: "abruzzo", svgId: "abruzzo", famousWines: ["Montepulciano d'Abruzzo", "Trebbiano d'Abruzzo"] },
  // Southern Italy
  { displayName: "Campania", slug: "campania", svgId: "campania", famousWines: ["Taurasi", "Fiano di Avellino", "Greco di Tufo"] },
  { displayName: "Puglia", slug: "puglia", svgId: "apulia", famousWines: ["Primitivo", "Negroamaro", "Nero di Troia"] },
  { displayName: "Basilicata", slug: "basilicata", svgId: "basilicata", famousWines: ["Aglianico del Vulture"] },
  { displayName: "Calabria", slug: "calabria", svgId: "calabria", famousWines: ["Ciro"] },
  { displayName: "Sicilia", slug: "sicilia", svgId: "sicily", famousWines: ["Nero d'Avola", "Etna Rosso", "Marsala"] },
  { displayName: "Sardegna", slug: "sardegna", svgId: "sardinia", famousWines: ["Cannonau", "Vermentino di Sardegna"] },
  { displayName: "Molise", slug: "molise", svgId: "molise", famousWines: ["Tintilia"] },
];

// Lookup maps (built once)
const byDisplayName = new Map<string, RegionMapping>();
const bySlug = new Map<string, RegionMapping>();
const bySvgId = new Map<string, RegionMapping>();

for (const r of REGION_MAPPINGS) {
  byDisplayName.set(r.displayName.toLowerCase(), r);
  // Only set slug/svgId if not already set (avoid duplicates from aliases)
  if (!bySlug.has(r.slug)) bySlug.set(r.slug, r);
  if (!bySvgId.has(r.svgId)) bySvgId.set(r.svgId, r);
}

/** Get region mapping by product region display name (case-insensitive, trimmed) */
export function getRegionByName(name: string): RegionMapping | undefined {
  return byDisplayName.get(name.trim().toLowerCase());
}

/** Get region mapping by slug */
export function getRegionMappingBySlug(slug: string): RegionMapping | undefined {
  return bySlug.get(slug);
}

/** Get region mapping by SVG map ID */
export function getRegionBySvgId(svgId: string): RegionMapping | undefined {
  return bySvgId.get(svgId);
}

/** Convert product region name to slug */
export function regionNameToSlug(name: string): string | undefined {
  return getRegionByName(name)?.slug;
}

/** Convert slug to display name */
export function slugToDisplayName(slug: string): string | undefined {
  return getRegionMappingBySlug(slug)?.displayName;
}

/** Extract unique region slugs from products (sorted alphabetically by display name) */
export function getActiveRegionSlugsFromProducts(products: Product[]): string[] {
  const slugSet = new Set<string>();
  for (const p of products) {
    if (p.region) {
      const slug = regionNameToSlug(p.region);
      if (slug) slugSet.add(slug);
    }
  }
  return Array.from(slugSet).sort((a, b) => {
    const nameA = slugToDisplayName(a) || a;
    const nameB = slugToDisplayName(b) || b;
    return nameA.localeCompare(nameB, "nl");
  });
}

/** Build region links for mega menu from products */
export function buildRegionLinks(products: Product[]): { label: string; href: string }[] {
  const slugs = getActiveRegionSlugsFromProducts(products);
  return slugs.map((slug) => ({
    label: slugToDisplayName(slug) || slug,
    href: `/wijnen?region=${slug}`,
  }));
}

/** Convert slug to region name for product matching */
export function slugToRegionNames(slug: string): string[] {
  // Return all display name variants that map to this slug
  return REGION_MAPPINGS
    .filter((r) => r.slug === slug)
    .map((r) => r.displayName);
}

export { REGION_MAPPINGS };
export type { RegionMapping };
