import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Product } from "@/types";
import { mockProducts } from "@/data/mockProducts";

const MAX_RECENTLY_VIEWED = 10;

interface RecentlyViewedState {
  recentlyViewedIds: string[];
  addRecentlyViewed: (productId: string) => void;
  getRecentlyViewed: () => Product[];
  getSuggestedProducts: (cartProductIds: string[], limit?: number) => Product[];
  getEmptyCartSuggestions: (limit?: number) => Product[];
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      recentlyViewedIds: [],

      addRecentlyViewed: (productId: string) => {
        set((state) => {
          const filtered = state.recentlyViewedIds.filter(
            (id) => id !== productId
          );
          return {
            recentlyViewedIds: [productId, ...filtered].slice(
              0,
              MAX_RECENTLY_VIEWED
            ),
          };
        });
      },

      getRecentlyViewed: () => {
        const { recentlyViewedIds } = get();
        return recentlyViewedIds
          .map((id) => mockProducts.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined);
      },

      /**
       * Get suggested products based on what's in the cart.
       * Strategy: find products from the same region or wine type
       * that are NOT already in the cart, prioritizing featured items.
       */
      getSuggestedProducts: (
        cartProductIds: string[],
        limit: number = 4
      ): Product[] => {
        const cartProducts = cartProductIds
          .map((id) => mockProducts.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined);

        const cartRegions = new Set(cartProducts.map((p) => p.region));
        const cartTypes = new Set(cartProducts.map((p) => p.wineType));
        const cartIdSet = new Set(cartProductIds);

        // Score each product for relevance
        const scored = mockProducts
          .filter((p) => !cartIdSet.has(p.id) && p.inStock)
          .map((p) => {
            let score = 0;
            // Same region as a cart item
            if (cartRegions.has(p.region)) score += 3;
            // Same wine type as a cart item
            if (cartTypes.has(p.wineType)) score += 2;
            // Featured products get a boost
            if (p.isFeatured) score += 2;
            // Products on sale get a boost
            if (p.originalPrice && p.originalPrice > p.price) score += 1;
            // High rating boost
            if (p.rating && p.rating >= 4.5) score += 1;
            return { product: p, score };
          })
          .sort((a, b) => b.score - a.score);

        return scored.slice(0, limit).map((s) => s.product);
      },

      /**
       * Suggestions for empty cart state: bestsellers / featured products
       */
      getEmptyCartSuggestions: (limit: number = 4): Product[] => {
        const { recentlyViewedIds } = get();

        // If user has recently viewed items, suggest those first
        if (recentlyViewedIds.length > 0) {
          const recent = recentlyViewedIds
            .map((id) => mockProducts.find((p) => p.id === id))
            .filter((p): p is Product => p !== undefined && p.inStock)
            .slice(0, limit);
          if (recent.length >= 2) return recent;
        }

        // Otherwise return featured / bestsellers
        return mockProducts
          .filter((p) => p.inStock && p.isFeatured)
          .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
          .slice(0, limit);
      },
    }),
    {
      name: "vino-per-lei-recently-viewed",
      partialize: (state) => ({
        recentlyViewedIds: state.recentlyViewedIds,
      }),
    }
  )
);
