export interface WineRegion {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  description: string;
  famousWines: string[];
  wineCount: number;
  coordinates: { x: number; y: number };
  labelOffset?: { x: number; y: number };
  area: "north" | "central" | "south";
  highlighted: boolean;
}

export const wineRegions: WineRegion[] = [
  // Northern Italy
  {
    id: "piemonte",
    name: "Piemonte",
    displayName: "Piemonte",
    slug: "piemonte",
    description: "Home of Barolo and Barbaresco, the king and queen of Italian wines",
    famousWines: ["Barolo", "Barbaresco", "Barbera d'Alba", "Nebbiolo"],
    wineCount: 3,
    coordinates: { x: 80, y: 120 },
    area: "north",
    highlighted: true,
  },
  {
    id: "lombardia",
    name: "Lombardia",
    displayName: "Lombardia",
    slug: "lombardia",
    description: "Home of Franciacorta sparkling wines",
    famousWines: ["Franciacorta", "Valtellina", "Oltrepò Pavese"],
    wineCount: 0,
    coordinates: { x: 140, y: 110 },
    area: "north",
    highlighted: false,
  },
  {
    id: "trentino-alto-adige",
    name: "Trentino-Alto Adige",
    displayName: "Alto Adige",
    slug: "alto-adige",
    description: "Alpine wines with Germanic influence",
    famousWines: ["Pinot Grigio", "Gewürztraminer", "Lagrein"],
    wineCount: 1,
    coordinates: { x: 170, y: 70 },
    area: "north",
    highlighted: true,
  },
  {
    id: "veneto",
    name: "Veneto",
    displayName: "Veneto",
    slug: "veneto",
    description: "Famous for Amarone, Valpolicella, and Prosecco",
    famousWines: ["Amarone", "Valpolicella Ripasso", "Prosecco", "Soave"],
    wineCount: 2,
    coordinates: { x: 200, y: 105 },
    area: "north",
    highlighted: true,
  },
  {
    id: "friuli-venezia-giulia",
    name: "Friuli-Venezia Giulia",
    displayName: "Friuli",
    slug: "friuli",
    description: "Italy's premier white wine region",
    famousWines: ["Pinot Grigio", "Friulano", "Ribolla Gialla"],
    wineCount: 0,
    coordinates: { x: 240, y: 95 },
    area: "north",
    highlighted: false,
  },
  {
    id: "emilia-romagna",
    name: "Emilia-Romagna",
    displayName: "Emilia-Romagna",
    slug: "emilia-romagna",
    description: "Home of Lambrusco sparkling red",
    famousWines: ["Lambrusco", "Sangiovese di Romagna"],
    wineCount: 0,
    coordinates: { x: 160, y: 160 },
    area: "north",
    highlighted: false,
  },
  // Central Italy
  {
    id: "toscana",
    name: "Tuscany",
    displayName: "Toscana",
    slug: "toscana",
    description: "The heart of Italian wine with Chianti and Brunello",
    famousWines: ["Chianti Classico", "Brunello di Montalcino", "Super Tuscans", "Vernaccia"],
    wineCount: 0,
    coordinates: { x: 150, y: 220 },
    area: "central",
    highlighted: true,
  },
  {
    id: "umbria",
    name: "Umbria",
    displayName: "Umbria",
    slug: "umbria",
    description: "The green heart of Italy with Sagrantino",
    famousWines: ["Sagrantino di Montefalco", "Orvieto"],
    wineCount: 0,
    coordinates: { x: 185, y: 250 },
    area: "central",
    highlighted: false,
  },
  {
    id: "marche",
    name: "Marche",
    displayName: "Marche",
    slug: "marche",
    description: "Adriatic coast wines with Verdicchio",
    famousWines: ["Verdicchio", "Rosso Conero"],
    wineCount: 0,
    coordinates: { x: 210, y: 235 },
    area: "central",
    highlighted: false,
  },
  {
    id: "lazio",
    name: "Lazio",
    displayName: "Lazio",
    slug: "lazio",
    description: "Wines of Rome including Frascati",
    famousWines: ["Frascati", "Est! Est!! Est!!!"],
    wineCount: 0,
    coordinates: { x: 175, y: 295 },
    area: "central",
    highlighted: false,
  },
  // Southern Italy
  {
    id: "campania",
    name: "Campania",
    displayName: "Campania",
    slug: "campania",
    description: "Ancient wine region near Naples",
    famousWines: ["Taurasi", "Fiano di Avellino", "Greco di Tufo"],
    wineCount: 0,
    coordinates: { x: 210, y: 340 },
    area: "south",
    highlighted: false,
  },
  {
    id: "puglia",
    name: "Puglia",
    displayName: "Puglia",
    slug: "puglia",
    description: "Italy's heel, famous for Primitivo",
    famousWines: ["Primitivo", "Negroamaro", "Nero di Troia"],
    wineCount: 2,
    coordinates: { x: 260, y: 360 },
    area: "south",
    highlighted: true,
  },
  {
    id: "sicilia",
    name: "Sicilia",
    displayName: "Sicilia",
    slug: "sicilia",
    description: "Island of Nero d'Avola and Etna wines",
    famousWines: ["Nero d'Avola", "Etna Rosso", "Marsala"],
    wineCount: 0,
    coordinates: { x: 200, y: 450 },
    area: "south",
    highlighted: false,
  },
];

// Helper function to get regions with wines
export function getRegionsWithStock(): WineRegion[] {
  return wineRegions.filter(r => r.wineCount > 0);
}

// Helper function to get region by slug
export function getRegionBySlug(slug: string): WineRegion | undefined {
  return wineRegions.find(r => r.slug === slug);
}
