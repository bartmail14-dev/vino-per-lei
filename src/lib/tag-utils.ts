/** Pretty display names for blog tags (Shopify slugs → human-readable) */
const TAG_LABELS: Record<string, string> = {
  "tips-en-tricks": "Tips & Tricks",
  "wist-je-dat": "Wist je dat?",
  piemonte: "Piemonte",
  toscana: "Toscana",
  veneto: "Veneto",
  regiogids: "Regiogids",
  wijnkennis: "Wijnkennis",
};

/** Get a pretty label for a tag slug. Falls back to capitalized slug. */
export function getTagLabel(tag: string): string {
  return TAG_LABELS[tag.toLowerCase()] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}
