"use client";

import { useCheckoutStore } from "@/stores/checkoutStore";
import { addressSchema, validateSection } from "@/lib/validation";
import { Input, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface DeliverySectionProps {
  onComplete: () => void;
}

export function DeliverySection({ onComplete }: DeliverySectionProps) {
  const { address, setAddress, errors, setError, clearError } = useCheckoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateSection(addressSchema, {
      ...address,
      isManualEntry: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(`address.${field}`, message);
      });
      return;
    }

    onComplete();
  };

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    // Format as "1234 AB"
    let formatted = value;
    if (value.length > 4) {
      formatted = value.slice(0, 4) + " " + value.slice(4, 6);
    }
    setAddress({ postcode: formatted });
    clearError("address.postcode");
  };

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ houseNumber: e.target.value });
    clearError("address.houseNumber");
  };

  const hasRequiredFields = address.postcode && address.houseNumber && address.street && address.city;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Street and house number */}
      <Input
        label="Straatnaam"
        value={address.street}
        onChange={(e) => {
          setAddress({ street: e.target.value });
          clearError("address.street");
        }}
        error={errors["address.street"]}
        placeholder="Hoofdstraat"
        required
        autoComplete="street-address"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Huisnummer"
          value={address.houseNumber}
          onChange={handleHouseNumberChange}
          error={errors["address.houseNumber"]}
          placeholder="42"
          required
          autoComplete="address-line2"
        />

        <Input
          label="Toevoeging (optioneel)"
          value={address.addition}
          onChange={(e) => setAddress({ addition: e.target.value })}
          placeholder="A, bis, etc."
          autoComplete="address-line3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Postcode"
          value={address.postcode}
          onChange={handlePostcodeChange}
          error={errors["address.postcode"]}
          placeholder="1234 AB"
          required
          autoComplete="postal-code"
          maxLength={7}
        />

        <Input
          label="Plaats"
          value={address.city}
          onChange={(e) => {
            setAddress({ city: e.target.value });
            clearError("address.city");
          }}
          error={errors["address.city"]}
          placeholder="Amsterdam"
          required
          autoComplete="address-level2"
        />
      </div>

      {/* Country (fixed to Netherlands) */}
      <div className={cn("p-3 bg-warm-white rounded-lg")}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🇳🇱</span>
          <span className="text-sm text-charcoal">Nederland</span>
        </div>
        <p className="text-xs text-grey mt-1">
          Momenteel verzenden we alleen binnen Nederland
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={!hasRequiredFields}
        >
          Doorgaan naar cadeau-opties
        </Button>
      </div>
    </form>
  );
}
