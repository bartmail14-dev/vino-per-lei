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
  DiscountCode,
  ShippingMethod,
} from "@/types/checkout";
import { SHIPPING_COSTS } from "@/types/checkout";
import { FREE_SHIPPING_THRESHOLD } from "@/types/cart";
import {
  contactSchema,
  addressSchema,
  giftSchema,
  shippingSchema,
  paymentSchema,
  validateSection,
} from "@/lib/validation";

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
      applyDiscountCode: async (code) => {
        // Simulate API call to validate discount code
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock discount codes
        const validCodes: Record<string, DiscountCode> = {
          WELKOM10: { code: "WELKOM10", amount: 10, type: "percentage" },
          ZOMER15: { code: "ZOMER15", amount: 15, type: "percentage", minOrderValue: 50 },
          GRATIS5: { code: "GRATIS5", amount: 5, type: "fixed" },
        };

        const discount = validCodes[code.toUpperCase()];

        if (discount) {
          set({
            discountCode: code.toUpperCase(),
            discountApplied: discount,
          });
          return true;
        }

        set({
          errors: { discountCode: "Ongeldige kortingscode" },
        });
        return false;
      },

      removeDiscountCode: () =>
        set({
          discountCode: "",
          discountApplied: null,
        }),

      // Submit order
      submitOrder: async (): Promise<OrderResult> => {
        set({ isSubmitting: true, errors: {} });

        const state = get();

        // Validate all sections
        const contactErrors = validateSection(contactSchema, state.contact);
        const addressErrors = validateSection(addressSchema, state.address);
        const giftErrors = validateSection(giftSchema, state.gift);
        const shippingErrors = validateSection(shippingSchema, { method: state.shipping.method });
        const paymentErrors = validateSection(paymentSchema, state.payment);

        const allErrors = {
          ...Object.fromEntries(
            Object.entries(contactErrors).map(([k, v]) => [`contact.${k}`, v])
          ),
          ...Object.fromEntries(
            Object.entries(addressErrors).map(([k, v]) => [`address.${k}`, v])
          ),
          ...Object.fromEntries(
            Object.entries(giftErrors).map(([k, v]) => [`gift.${k}`, v])
          ),
          ...Object.fromEntries(
            Object.entries(shippingErrors).map(([k, v]) => [`shipping.${k}`, v])
          ),
          ...Object.fromEntries(
            Object.entries(paymentErrors).map(([k, v]) => [`payment.${k}`, v])
          ),
        };

        if (Object.keys(allErrors).length > 0) {
          set({ isSubmitting: false, errors: allErrors });
          return {
            success: false,
            error: "Controleer de ingevulde gegevens",
          };
        }

        // Simulate order creation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock order ID
        const orderId = `VPL-${Date.now().toString(36).toUpperCase()}`;

        set({ isSubmitting: false });

        return {
          success: true,
          orderId,
          redirectUrl: `/checkout/success?order=${orderId}`,
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
        contact: state.contact,
        address: state.address,
        gift: state.gift,
        shipping: state.shipping,
        discountCode: state.discountCode,
        discountApplied: state.discountApplied,
      }),
    }
  )
);
