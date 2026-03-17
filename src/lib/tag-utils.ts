/** Pretty display names for blog tags (Shopify slugs → human-readable) */
const TAG_LABELS: Record<string, string> = {
  // Categorieën
  "tips-en-tricks": "Tips & Tricks",
  "wist-je-dat": "Wist je dat?",
  regiogids: "Regiogids",
  wijnkennis: "Wijnkennis",
  "food-pairing": "Food Pairing",
  seizoenen: "Seizoenen",
  cadeau: "Cadeau",
  // Regio's
  piemonte: "Piemonte",
  toscana: "Toscana",
  veneto: "Veneto",
  sicilia: "Sicilia",
  "sicilie": "Sicilië",
  puglia: "Puglia",
  sardegna: "Sardegna",
  "sardinie": "Sardinië",
  lombardia: "Lombardia",
  "emilia-romagna": "Emilia-Romagna",
  "alto-adige": "Alto Adige",
  "friuli": "Friuli",
  campania: "Campania",
  umbria: "Umbria",
  abruzzo: "Abruzzo",
  // Druiven
  nebbiolo: "Nebbiolo",
  sangiovese: "Sangiovese",
  "primitivo": "Primitivo",
  "nero-d-avola": "Nero d'Avola",
  barbera: "Barbera",
  pinot: "Pinot",
  prosecco: "Prosecco",
  // Types
  rood: "Rood",
  wit: "Wit",
  rose: "Rosé",
  "rosé": "Rosé",
  bubbels: "Bubbels",
};

/** Get a pretty label for a tag slug. Falls back to capitalized slug. */
export function getTagLabel(tag: string): string {
  return TAG_LABELS[tag.toLowerCase()] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}
