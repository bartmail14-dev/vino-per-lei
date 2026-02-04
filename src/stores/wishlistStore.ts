"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Product } from "@/types";

interface WishlistState {
  items: Product[];
  isHydrated: boolean;
  setHydrated: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      addItem: (product) => {
        const { items } = get();
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      toggleItem: (product) => {
        const { items } = get();
        const exists = items.find((item) => item.id === product.id);
        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "vpl-wishlist",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
