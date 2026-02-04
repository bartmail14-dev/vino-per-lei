export interface WineRegion {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  description: string;
  famousWines: string[];
  area: "north" | "central";
  active: boolean; // Whether we sell wines from this region
}

// Only Northern Italy + Tuscany (client preference - no southern regions)
export const wineRegions: WineRegion[] = [
  // Northern Italy
  {
    id: "piemonte",
    name: "Piemonte",
    displayName: "Piemonte",
    slug: "piemonte",
    description: "Home of Barolo and Barbaresco, the king and queen of Italian wines",
    famousWines: ["Barolo", "Barbaresco", "Barbera d'Alba", "Nebbiolo"],
    area: "north",
    active: true,
  },
  {
    id: "lombardia",
    name: "Lombardia",
    displayName: "Lombardia",
    slug: "lombardia",
    description: "Home of Franciacorta sparkling wines",
    famousWines: ["Franciacorta", "Valtellina", "Oltrepò Pavese"],
    area: "north",
    active: true,
  },
  {
    id: "trentino-alto-adige",
    name: "Trentino-Alto Adige",
    displayName: "Alto Adige",
    slug: "alto-adige",
    description: "Alpine wines with Germanic influence",
    famousWines: ["Pinot Grigio", "Gewürztraminer", "Lagrein"],
    area: "north",
    active: true,
  },
  {
    id: "veneto",
    name: "Veneto",
    displayName: "Veneto",
    slug: "veneto",
    description: "Famous for Amarone, Valpolicella, and Prosecco",
    famousWines: ["Amarone", "Valpolicella Ripasso", "Prosecco", "Soave"],
    area: "north",
    active: true,
  },
  {
    id: "friuli-venezia-giulia",
    name: "Friuli-Venezia Giulia",
    displayName: "Friuli",
    slug: "friuli",
    description: "Italy's premier white wine region",
    famousWines: ["Pinot Grigio", "Friulano", "Ribolla Gialla"],
    area: "north",
    active: true,
  },
  {
    id: "emilia-romagna",
    name: "Emilia-Romagna",
    displayName: "Emilia-Romagna",
    slug: "emilia-romagna",
    description: "Home of Lambrusco sparkling red",
    famousWines: ["Lambrusco", "Sangiovese di Romagna"],
    area: "north",
    active: true,
  },
  {
    id: "liguria",
    name: "Liguria",
    displayName: "Liguria",
    slug: "liguria",
    description: "Coastal wines from the Italian Riviera",
    famousWines: ["Cinque Terre", "Pigato", "Vermentino"],
    area: "north",
    active: true,
  },
  {
    id: "valle-daosta",
    name: "Valle d'Aosta",
    displayName: "Valle d'Aosta",
    slug: "valle-daosta",
    description: "Italy's smallest wine region in the Alps",
    famousWines: ["Petit Rouge", "Fumin", "Blanc de Morgex"],
    area: "north",
    active: true,
  },
  // Central Italy - only Tuscany
  {
    id: "toscana",
    name: "Tuscany",
    displayName: "Toscana",
    slug: "toscana",
    description: "The heart of Italian wine with Chianti and Brunello",
    famousWines: ["Chianti Classico", "Brunello di Montalcino", "Super Tuscans", "Vernaccia"],
    area: "central",
    active: true,
  },
];

// Helper function to get all active regions
export function getActiveRegions(): WineRegion[] {
  return wineRegions.filter(r => r.active);
}

// Helper function to get region by slug
export function getRegionBySlug(slug: string): WineRegion | undefined {
  return wineRegions.find(r => r.slug === slug);
}
