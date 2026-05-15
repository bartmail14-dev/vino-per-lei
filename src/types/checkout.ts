// Checkout type definitions for Vino per Lei

export interface CheckoutContact {
  email: string;
  phone: string;
  newsletter: boolean;
}

export interface CheckoutAddress {
  postcode: string;
  houseNumber: string;
  addition: string;
  street: string;
  city: string;
  country: "NL";
  isManualEntry: boolean;
}

export type ShippingMethod = "standard" | "temperature";

export interface CheckoutShipping {
  method: ShippingMethod;
  estimatedDate: string;
  cost: number;
}

export type PaymentMethod = "shopify";

export interface CheckoutPayment {
  method: PaymentMethod;
  ageVerified: boolean;
}

export interface DiscountCode {
  code: string;
  amount: number;
  type: "percentage" | "fixed";
  minOrderValue?: number;
}

export type CheckoutSection = "contact" | "delivery" | "shipping" | "payment";

export interface CheckoutState {
  // Form data
  contact: CheckoutContact;
  address: CheckoutAddress;
  shipping: CheckoutShipping;
  payment: CheckoutPayment;

  // Discount
  discountCode: string;
  discountApplied: DiscountCode | null;

  // UI state
  activeSection: CheckoutSection;
  completedSections: CheckoutSection[];
  isSubmitting: boolean;
  errors: Record<string, string>;

  // Actions
  setContact: (data: Partial<CheckoutContact>) => void;
  setAddress: (data: Partial<CheckoutAddress>) => void;
  setShipping: (data: Partial<CheckoutShipping>) => void;
  setPayment: (data: Partial<CheckoutPayment>) => void;
  setActiveSection: (section: CheckoutSection) => void;
  completeSection: (section: CheckoutSection) => void;
  uncompleteSection: (section: CheckoutSection) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  applyDiscountCode: (code: string) => Promise<boolean>;
  removeDiscountCode: () => void;
  submitOrder: () => Promise<OrderResult>;
  resetCheckout: () => void;

  // Computed helpers
  getProgressPercentage: () => number;
  isAllSectionsComplete: () => boolean;
}

export interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
  redirectUrl?: string;
}

