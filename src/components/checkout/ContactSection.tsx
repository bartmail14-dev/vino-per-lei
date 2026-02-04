"use client";

import { useCheckoutStore } from "@/stores/checkoutStore";
import { contactSchema, validateSection } from "@/lib/validation";
import { Input, Checkbox, Button } from "@/components/ui";

interface ContactSectionProps {
  onComplete: () => void;
}

export function ContactSection({ onComplete }: ContactSectionProps) {
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
        label="E-mailadres"
        type="email"
        value={contact.email}
        onChange={handleEmailChange}
        error={errors["contact.email"]}
        placeholder="jouw@email.nl"
        required
        autoComplete="email"
      />

      <Input
        label="Telefoonnummer (optioneel)"
        type="tel"
        value={contact.phone}
        onChange={handlePhoneChange}
        error={errors["contact.phone"]}
        placeholder="+31 6 12345678"
        hint="Voor bezorgberichten"
        autoComplete="tel"
      />

      <Checkbox
        label="Ja, ik wil de nieuwsbrief ontvangen met exclusieve aanbiedingen"
        checked={contact.newsletter}
        onChange={(e) => setContact({ newsletter: e.target.checked })}
      />

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth>
          Doorgaan naar bezorgadres
        </Button>
      </div>
    </form>
  );
}
