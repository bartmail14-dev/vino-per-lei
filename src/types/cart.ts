import { type Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export interface CartState extends Cart {
  isOpen: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  // Actions
  setHydrated: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const FREE_SHIPPING_THRESHOLD = 35;
export const SHIPPING_COST = 4.95;
