import type { Product } from "@/types";

export interface RegionMapping {
  displayName: string;
  slug: string;
  svgId: string;
  famousWines: string[];
}

interface RegionDefinition {
  slug: string;
  displayName: string;
  aliases: string[];
  famousWines?: string[];
}

const REGION_DEFINITIONS: RegionDefinition[] = [
  {
    slug: "abruzzo",
    displayName: "Abruzzo",
    aliases: ["Abruzzo"],
  },
  {
    slug: "valle-daosta",
    displayName: "Valle d'Aosta",
    aliases: ["Valle d'Aosta", "Valle d Aosta", "Valle-daosta", "Valle-d-aosta", "Aosta Valley", "Vallee d Aoste"],
  },
  {
    slug: "puglia",
    displayName: "Puglia",
    aliases: ["Puglia", "Apulia", "Apulie", "Primitivo di Manduria", "Manduria", "Salento"],
  },
  {
    slug: "basilicata",
    displayName: "Basilicata",
    aliases: ["Basilicata"],
  },
  {
    slug: "calabria",
    displayName: "Calabria",
    aliases: ["Calabria", "Calabrie"],
  },
  {
    slug: "campania",
    displayName: "Campania",
    aliases: ["Campania", "Campanie"],
  },
  {
    slug: "emilia-romagna",
    displayName: "Emilia-Romagna",
    aliases: ["Emilia-Romagna", "Emilia Romagna"],
  },
  {
    slug: "friuli",
    displayName: "Friuli",
    aliases: ["Friuli", "Friuli Venezia Giulia", "Friuli-Venezia Giulia", "Friuli VG", "Friuli-VG"],
  },
  {
    slug: "lazio",
    displayName: "Lazio",
    aliases: ["Lazio", "Latium"],
  },
  {
    slug: "liguria",
    displayName: "Liguria",
    aliases: ["Liguria", "Ligurie"],
  },
  {
    slug: "lombardia",
    displayName: "Lombardije",
    aliases: ["Lombardia", "Lombardije", "Lombardy", "Franciacorta", "Valtellina", "Lugana"],
  },
  {
    slug: "marche",
    displayName: "Marche",
    aliases: ["Marche", "Le Marche"],
  },
  {
    slug: "molise",
    displayName: "Molise",
    aliases: ["Molise"],
  },
  {
    slug: "piemonte",
    displayName: "Piemonte",
    aliases: ["Piemonte", "Piedmont", "Piemont", "Gavi", "Barolo", "Barbaresco", "Asti", "Nizza", "Langhe", "Roero", "Monferrato"],
  },
  {
    slug: "sardegna",
    displayName: "Sardini\u00eb",
    aliases: ["Sardegna", "Sardini\u00eb", "Sardinie", "Sardinia"],
  },
  {
    slug: "sicilia",
    displayName: "Sicili\u00eb",
    aliases: ["Sicilia", "Sicili\u00eb", "Sicilie", "Sicily"],
  },
  {
    slug: "alto-adige",
    displayName: "Alto Adige",
    aliases: [
      "Alto Adige",
      "Trentino-Alto Adige",
      "Trentino Alto Adige",
      "Trentino-Alto Adige/Sudtirol",
      "Trentino Alto Adige Sudtirol",
      "Trentino-South Tyrol",
      "South Tyrol",
      "Sudtirol",
      "S\u00fcdtirol",
      "Trentino",
    ],
  },
  {
    slug: "toscana",
    displayName: "Toscana",
    aliases: ["Toscana", "Tuscany", "Toscane", "Chianti", "Montalcino", "Montepulciano", "Bolgheri"],
  },
  {
    slug: "umbria",
    displayName: "Umbri\u00eb",
    aliases: ["Umbria", "Umbri\u00eb", "Umbrie"],
  },
  {
    slug: "veneto",
    displayName: "Veneto",
    aliases: ["Veneto", "Venetie", "Veneti\u00eb", "Valpolicella", "Amarone", "Prosecco", "Soave", "Bardolino"],
  },
];

function normalizeRegionKey(value: string): string | undefined {
  const key = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return key || undefined;
}

const REGION_DEFINITION_BY_SLUG = new Map(REGION_DEFINITIONS.map((definition) => [definition.slug, definition]));

const REGION_SLUG_ALIASES = REGION_DEFINITIONS.reduce<Record<string, string>>((aliases, definition) => {
  const values = [definition.slug, definition.displayName, ...definition.aliases];
  for (const value of values) {
    const key = normalizeRegionKey(value);
    if (key) aliases[key] = definition.slug;
  }
  return aliases;
}, {});

const REGION_DISPLAY_NAMES = REGION_DEFINITIONS.reduce<Record<string, string>>((displayNames, definition) => {
  displayNames[definition.slug] = definition.displayName;
  return displayNames;
}, {});

export function canonicalRegionSlug(value: string): string {
  const key = normalizeRegionKey(value);
  if (!key) return value;
  return REGION_SLUG_ALIASES[key] ?? key;
}

export function regionNameToSlug(name: string): string | undefined {
  const slug = canonicalRegionSlug(name);
  return slug || undefined;
}

export function mapLocationToRegionSlug(location: { id: string; name?: string }): string {
  const idSlug = canonicalRegionSlug(location.id);
  if (REGION_DEFINITION_BY_SLUG.has(idSlug)) return idSlug;

  if (location.name) {
    const nameSlug = canonicalRegionSlug(location.name);
    if (REGION_DEFINITION_BY_SLUG.has(nameSlug)) return nameSlug;
  }

  return idSlug;
}

export function isKnownMapRegion(value: string): boolean {
  return REGION_DEFINITION_BY_SLUG.has(canonicalRegionSlug(value));
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
  const definition = REGION_DEFINITION_BY_SLUG.get(canonicalSlug);
  const aliases = definition ? [definition.slug, definition.displayName, ...definition.aliases] : [];
  const displayName = slugToDisplayName(canonicalSlug);
  return Array.from(new Set([canonicalSlug, slug, displayName, ...aliases].filter(Boolean) as string[]));
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
  const displayName = slug ? slugToDisplayName(slug) : undefined;
  return slug && displayName ? { displayName, slug, svgId: slug, famousWines: [] } : undefined;
}

export function getRegionMappingBySlug(slug: string): RegionMapping | undefined {
  const canonicalSlug = canonicalRegionSlug(slug);
  const displayName = slugToDisplayName(canonicalSlug);
  return displayName ? { displayName, slug: canonicalSlug, svgId: canonicalSlug, famousWines: [] } : undefined;
}

export function getRegionBySvgId(svgId: string): RegionMapping | undefined {
  return getRegionMappingBySlug(svgId);
}

export const REGION_MAPPINGS: RegionMapping[] = REGION_DEFINITIONS.map((definition) => ({
  displayName: definition.displayName,
  slug: definition.slug,
  svgId: definition.slug,
  famousWines: definition.famousWines ?? [],
}));
