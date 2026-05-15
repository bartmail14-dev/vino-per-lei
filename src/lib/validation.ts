import { z } from "zod";

// Dutch phone number regex (with or without country code)
const dutchPhoneRegex = /^(\+31|0)[1-9][0-9]{8}$/;

// Dutch postcode regex
const dutchPostcodeRegex = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/;

// Contact validation
export const contactSchema = z.object({
  email: z
    .string()
    .min(1, "E-mailadres is verplicht")
    .email("Voer een geldig e-mailadres in"),
  phone: z
    .string()
    .refine(
      (val) => val === "" || dutchPhoneRegex.test(val.replace(/\s/g, "")),
      "Voer een geldig Nederlands telefoonnummer in"
    )
    .optional()
    .or(z.literal("")),
  newsletter: z.boolean(),
});

// Address validation
export const addressSchema = z.object({
  postcode: z
    .string()
    .min(1, "Postcode is verplicht")
    .refine(
      (val) => dutchPostcodeRegex.test(val.replace(/\s/g, "")),
      "Voer een geldige postcode in (bijv. 1234 AB)"
    ),
  houseNumber: z
    .string()
    .min(1, "Huisnummer is verplicht")
    .regex(/^[0-9]+[A-Za-z]?$/, "Voer een geldig huisnummer in"),
  addition: z.string().optional().or(z.literal("")),
  street: z.string().min(1, "Straatnaam is verplicht"),
  city: z.string().min(1, "Plaats is verplicht"),
  country: z.literal("NL"),
  isManualEntry: z.boolean(),
});

// Shipping validation
export const shippingSchema = z.object({
  method: z.enum(["standard", "temperature"], {
    message: "Selecteer een verzendmethode",
  }),
});

// Payment validation
export const paymentSchema = z.object({
  method: z.literal("shopify"),
  ageVerified: z.literal(true, {
    message: "Je moet bevestigen dat je 18 jaar of ouder bent",
  }),
});

// Combined checkout validation (for final submission)
export const checkoutSchema = z.object({
  contact: contactSchema,
  address: addressSchema,
  shipping: shippingSchema,
  payment: paymentSchema,
});

// Type inference
export type ContactFormData = z.infer<typeof contactSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Validation helper functions
export function validateField(
  schema: z.ZodTypeAny,
  value: unknown
): string | null {
  const result = schema.safeParse(value);
  if (result.success) {
    return null;
  }
  const firstIssue = result.error.issues[0];
  return firstIssue?.message || "Ongeldige invoer";
}

export function validateSection<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Record<string, string> {
  const result = schema.safeParse(data);
  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

// Discount code validation
export const discountCodeSchema = z
  .string()
  .min(1, "Voer een kortingscode in")
  .max(20, "Kortingscode is te lang")
  .regex(/^[A-Z0-9]+$/i, "Ongeldige kortingscode");
