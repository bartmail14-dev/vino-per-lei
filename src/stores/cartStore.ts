import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CartState,
  type CartItem,
  type Product,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "@/types";

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return { itemCount, subtotal, shipping, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      total: 0,
      isOpen: false,
      isLoading: false,

      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          let newItems: CartItem[];

          if (existingItem) {
            newItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              id: `${product.id}-${Date.now()}`,
              product,
              quantity,
            };
            newItems = [...state.items, newItem];
          }

          return {
            items: newItems,
            ...calculateTotals(newItems),
            isOpen: true, // Open cart when item is added
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId);
          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          return {
            items: newItems,
            ...calculateTotals(newItems),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          shipping: 0,
          total: 0,
        });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "vino-per-lei-cart",
      partialize: (state) => ({
        items: state.items,
        itemCount: state.itemCount,
        subtotal: state.subtotal,
        shipping: state.shipping,
        total: state.total,
      }),
    }
  )
);
