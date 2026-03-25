export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;

  // Categorization
  collection?: string;
  wineType: "red" | "white" | "rose" | "sparkling";
  grapeVarieties: string[];

  // Origin
  country: string;
  region: string;
  vintage: number | "NV";

  // Pricing
  price: number;
  originalPrice?: number;

  // Taste profile (1-6 scale)
  tasteProfile?: {
    drySweet: number;
    lightFull: number;
    softTannic?: number; // for red wines
    freshSoft?: number; // for white/rosé
    fruitySpicy?: number;
  };

  // Media
  images: ProductImage[];

  // Ratings
  rating?: number;
  reviewCount?: number;

  // Stock
  inStock: boolean;
  stockQuantity?: number;

  // Flags
  isNew?: boolean;
  isFeatured?: boolean;
  hasAward?: boolean;
  awardText?: string;

  // Metafield-driven content
  foodPairing?: string[];          // from custom.food_pairing JSON array
  servingTemperature?: string;     // from custom.serving_temperature e.g. "16-18°C"
  alcoholPercentage?: string;      // from custom.alcohol_percentage e.g. "13.5%"
  vinification?: string;           // from custom.vinification
  producerStory?: string;          // from custom.producer_story

  // Shopify
  variantId: string;
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
  }>;
}

export interface ProductImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export type WineType = Product["wineType"];

export interface ProductFilter {
  wineType?: WineType[];
  country?: string[];
  grapeVariety?: string[];
  priceMin?: number;
  priceMax?: number;
  tasteProfile?: string[];
  inStock?: boolean;
}

export type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "name-asc"
  | "rating";
