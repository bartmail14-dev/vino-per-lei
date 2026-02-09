"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore, calculateEstimatedDelivery } from "@/stores/checkoutStore";
import { usePostcodeLookup } from "@/hooks/usePostcodeLookup";
import { addressSchema, validateSection } from "@/lib/validation";
import { Input, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface DeliverySectionProps {
  onComplete: () => void;
}

export function DeliverySection({ onComplete }: DeliverySectionProps) {
  const { address, setAddress, shipping, errors, setError, clearError } = useCheckoutStore();
  const { lookup, result, isLoading, error: lookupError, reset } = usePostcodeLookup();
  const [showManualEntry, setShowManualEntry] = useState(address.isManualEntry);

  // Auto-lookup when postcode and house number are valid
  useEffect(() => {
    if (!showManualEntry && address.postcode.length >= 6 && address.houseNumber) {
      const timer = setTimeout(() => {
        lookup(address.postcode, address.houseNumber);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [address.postcode, address.houseNumber, showManualEntry, lookup]);

  // Update address when lookup result changes
  useEffect(() => {
    if (result) {
      setAddress({
        street: result.street,
        city: result.city,
        isManualEntry: false,
      });
    }
  }, [result, setAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateSection(addressSchema, address);

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
    setAddress({ postcode: formatted, street: "", city: "" });
    clearError("address.postcode");
    reset();
  };

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ houseNumber: e.target.value, street: "", city: "" });
    clearError("address.houseNumber");
    reset();
  };

  const toggleManualEntry = () => {
    setShowManualEntry(!showManualEntry);
    setAddress({ isManualEntry: !showManualEntry });
    reset();
  };

  const hasAddressResult = result || (address.street && address.city);

  // Estimated delivery date
  const estimatedDate = calculateEstimatedDelivery(shipping.method);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Postcode lookup */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Postcode"
          value={address.postcode}
          onChange={handlePostcodeChange}
          error={errors["address.postcode"] || (lookupError && !showManualEntry ? lookupError : undefined)}
          placeholder="1234 AB"
          required
          autoComplete="postal-code"
          maxLength={7}
        />

        <Input
          label="Huisnummer"
          value={address.houseNumber}
          onChange={handleHouseNumberChange}
          error={errors["address.houseNumber"]}
          placeholder="42"
          required
          autoComplete="address-line2"
        />
      </div>

      <Input
        label="Toevoeging (optioneel)"
        value={address.addition}
        onChange={(e) => setAddress({ addition: e.target.value })}
        placeholder="A, bis, etc."
        autoComplete="address-line3"
      />

      {/* Loading state with animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-wine/5 border border-wine/10 rounded-lg">
              <div className="relative">
                <LoadingSpinner className="w-5 h-5 text-wine" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">Adres opzoeken...</p>
                <div className="mt-2 h-1.5 bg-sand rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-wine rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-filled address result card */}
      <AnimatePresence>
        {hasAddressResult && !showManualEntry && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="p-4 bg-success/5 border border-success/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <div className="w-8 h-8 bg-success/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-4 h-4 text-success" />
                </div>
              </motion.div>
              <div className="flex-1">
                <p className="text-xs font-medium text-success uppercase tracking-wide mb-1">
                  Adres gevonden
                </p>
                <p className="font-medium text-charcoal">
                  {address.street} {address.houseNumber}
                  {address.addition && ` ${address.addition}`}
                </p>
                <p className="text-sm text-grey">
                  {address.postcode}, {address.city}
                </p>
              </div>
              {/* Map pin icon */}
              <div className="text-success/40">
                <MapPinIcon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual entry toggle */}
      <button
        type="button"
        onClick={toggleManualEntry}
        className="text-sm text-wine hover:text-wine-dark transition-colors inline-flex items-center gap-1"
      >
        {showManualEntry ? (
          <>
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Terug naar automatisch invullen
          </>
        ) : (
          "Adres handmatig invoeren"
        )}
      </button>

      {/* Manual entry fields */}
      <AnimatePresence>
        {showManualEntry && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Country (fixed to Netherlands) */}
      <div className={cn("p-3 bg-warm-white rounded-lg", showManualEntry && "mt-4")}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🇳🇱</span>
          <span className="text-sm text-charcoal">Nederland</span>
        </div>
        <p className="text-xs text-grey mt-1">
          Momenteel verzenden we alleen binnen Nederland
        </p>
      </div>

      {/* Delivery date estimation */}
      <AnimatePresence>
        {hasAddressResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 p-3 bg-wine/5 border border-wine/10 rounded-lg"
          >
            <div className="w-8 h-8 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="w-4 h-4 text-wine" />
            </div>
            <div>
              <p className="text-xs text-grey">Geschatte bezorging</p>
              <p className="text-sm font-medium text-charcoal">{estimatedDate}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={!hasAddressResult && !showManualEntry}
        >
          Doorgaan naar cadeau-opties
        </Button>
      </div>
    </form>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
