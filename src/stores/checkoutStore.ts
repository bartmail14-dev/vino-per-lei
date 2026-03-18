import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CheckoutState,
  CheckoutContact,
  CheckoutAddress,
  CheckoutGift,
  CheckoutShipping,
  CheckoutPayment,
  CheckoutSection,
  OrderResult,
  ShippingMethod,
} from "@/types/checkout";
import { SHIPPING_COSTS } from "@/types/checkout";
import { FREE_SHIPPING_THRESHOLD } from "@/types/cart";

const initialContact: CheckoutContact = {
  email: "",
  phone: "",
  newsletter: false,
};

const initialAddress: CheckoutAddress = {
  postcode: "",
  houseNumber: "",
  addition: "",
  street: "",
  city: "",
  country: "NL",
  isManualEntry: false,
};

const initialGift: CheckoutGift = {
  isGift: false,
  wrapping: false,
  recipientName: "",
  message: "",
  hidePrices: false,
};

const initialShipping: CheckoutShipping = {
  method: "standard",
  estimatedDate: "",
  cost: SHIPPING_COSTS.standard,
};

const initialPayment: CheckoutPayment = {
  method: "ideal",
  idealBank: "",
  ageVerified: false,
};

// Calculate shipping cost based on method and subtotal
export function calculateShippingCost(
  method: ShippingMethod,
  subtotal: number
): number {
  if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return SHIPPING_COSTS[method];
}

// Calculate estimated delivery date
export function calculateEstimatedDelivery(method: ShippingMethod): string {
  const now = new Date();
  const deliveryDate = new Date(now);

  // Add business days based on method
  const daysToAdd = method === "evening" ? 1 : 2;
  let addedDays = 0;

  while (addedDays < daysToAdd) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const dayOfWeek = deliveryDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }

  // Format as Dutch date
  return deliveryDate.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      // Initial state
      contact: initialContact,
      address: initialAddress,
      gift: initialGift,
      shipping: initialShipping,
      payment: initialPayment,

      discountCode: "",
      discountApplied: null,

      activeSection: "contact",
      completedSections: [],
      isSubmitting: false,
      errors: {},

      // Section setters
      setContact: (data) =>
        set((state) => ({
          contact: { ...state.contact, ...data },
        })),

      setAddress: (data) =>
        set((state) => ({
          address: { ...state.address, ...data },
        })),

      setGift: (data) =>
        set((state) => ({
          gift: { ...state.gift, ...data },
        })),

      setShipping: (data) =>
        set((state) => {
          const newMethod = data.method || state.shipping.method;
          return {
            shipping: {
              ...state.shipping,
              ...data,
              estimatedDate: calculateEstimatedDelivery(newMethod),
            },
          };
        }),

      setPayment: (data) =>
        set((state) => ({
          payment: { ...state.payment, ...data },
        })),

      // Section management
      setActiveSection: (section) => set({ activeSection: section }),

      completeSection: (section) =>
        set((state) => {
          if (state.completedSections.includes(section)) {
            return state;
          }
          return {
            completedSections: [...state.completedSections, section],
          };
        }),

      uncompleteSection: (section) =>
        set((state) => ({
          completedSections: state.completedSections.filter((s) => s !== section),
        })),

      // Error management
      setError: (field, message) =>
        set((state) => ({
          errors: { ...state.errors, [field]: message },
        })),

      clearError: (field) =>
        set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[field];
          return { errors: newErrors };
        }),

      clearAllErrors: () => set({ errors: {} }),

      // Discount code
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      applyDiscountCode: async (_code) => {
        // TODO: Validate discount code via Shopify API (checkoutDiscountCodeApplyV2 mutation)
        // Never validate discount codes client-side — always server-side via Shopify
        set({ errors: { discountCode: "Kortingscodes worden binnenkort ondersteund." } });
        return false;
      },

      removeDiscountCode: () =>
        set({
          discountCode: "",
          discountApplied: null,
        }),

      // Order submission is handled by Shopify hosted checkout via cart permalink.
      // See getShopifyCartUrl() in lib/shopify.ts.
      submitOrder: async (): Promise<OrderResult> => {
        return {
          success: false,
          error: "Gebruik de afrekenen-knop om door te gaan naar Shopify checkout.",
        };
      },

      // Reset checkout
      resetCheckout: () =>
        set({
          contact: initialContact,
          address: initialAddress,
          gift: initialGift,
          shipping: initialShipping,
          payment: initialPayment,
          discountCode: "",
          discountApplied: null,
          activeSection: "contact",
          completedSections: [],
          isSubmitting: false,
          errors: {},
        }),

      // Computed helpers
      getProgressPercentage: () => {
        const state = get();
        const sections: CheckoutSection[] = [
          "contact",
          "delivery",
          "gift",
          "shipping",
          "payment",
        ];
        const completed = state.completedSections.length;
        return Math.round((completed / sections.length) * 100);
      },

      isAllSectionsComplete: () => {
        const state = get();
        const requiredSections: CheckoutSection[] = [
          "contact",
          "delivery",
          "shipping",
          "payment",
        ];
        return requiredSections.every((s) => state.completedSections.includes(s));
      },
    }),
    {
      name: "vino-per-lei-checkout",
      partialize: (state) => ({
        gift: state.gift,
        shipping: state.shipping,
        discountCode: state.discountCode,
        discountApplied: state.discountApplied,
      }),
    }
  )
);
