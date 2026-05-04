"use client";

import { useCheckoutStore } from "@/stores/checkoutStore";
import { contactSchema, validateSection } from "@/lib/validation";
import { Input, Checkbox, Button } from "@/components/ui";
import { useUiCopy } from "@/components/providers";

interface ContactSectionProps {
  onComplete: () => void;
}

export function ContactSection({ onComplete }: ContactSectionProps) {
  const t = useUiCopy();
  const { contact, setContact, errors, setError, clearError } = useCheckoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateSection(contactSchema, contact);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(`contact.${field}`, message);
      });
      return;
    }

    onComplete();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ email: e.target.value });
    clearError("contact.email");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ phone: e.target.value });
    clearError("contact.phone");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t("checkout.contact.email_label")}
        type="email"
        value={contact.email}
        onChange={handleEmailChange}
        error={errors["contact.email"]}
        placeholder="jouw@email.nl"
        required
        autoComplete="email"
      />

      <Input
        label={t("checkout.contact.phone_label")}
        type="tel"
        value={contact.phone}
        onChange={handlePhoneChange}
        error={errors["contact.phone"]}
        placeholder="+31 6 12345678"
        hint={t("checkout.contact.phone_hint")}
        autoComplete="tel"
      />

      <Checkbox
        label={t("checkout.contact.newsletter_label")}
        checked={contact.newsletter}
        onChange={(e) => setContact({ newsletter: e.target.checked })}
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth>
          {t("checkout.contact.continue")}
        </Button>
      </div>
    </form>
  );
}
