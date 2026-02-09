"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useAuthStore } from "@/stores/authStore";
import { contactSchema, validateSection } from "@/lib/validation";
import { Input, Checkbox, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ContactSectionProps {
  onComplete: () => void;
}

// Format Dutch phone number
function formatPhoneNumber(value: string): string {
  // Strip everything except digits and +
  const cleaned = value.replace(/[^\d+]/g, "");

  // Handle +31 format
  if (cleaned.startsWith("+31")) {
    const digits = cleaned.slice(3);
    if (digits.length <= 1) return `+31 ${digits}`;
    if (digits.length <= 3) return `+31 ${digits.slice(0, 1)} ${digits.slice(1)}`;
    if (digits.length <= 5) return `+31 ${digits.slice(0, 1)} ${digits.slice(1, 3)}${digits.slice(3)}`;
    if (digits.length <= 7) return `+31 ${digits.slice(0, 1)} ${digits.slice(1, 3)}${digits.slice(3, 5)} ${digits.slice(5)}`;
    return `+31 ${digits.slice(0, 1)} ${digits.slice(1, 3)}${digits.slice(3, 5)} ${digits.slice(5, 7)}${digits.slice(7, 9)}`;
  }

  // Handle 06 format
  if (cleaned.startsWith("0")) {
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)}${cleaned.slice(4)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)}${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)}${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}${cleaned.slice(8, 10)}`;
  }

  return cleaned;
}

// Validate a single field
function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPhoneValid(phone: string): boolean {
  if (!phone) return true; // Optional field
  const cleaned = phone.replace(/\s/g, "");
  return /^(\+31|0)[1-9][0-9]{8}$/.test(cleaned);
}

export function ContactSection({ onComplete }: ContactSectionProps) {
  const { contact, setContact, errors, setError, clearError } = useCheckoutStore();
  const { isAuthenticated, user, openLoginModal } = useAuthStore();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const markFieldTouched = useCallback((field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  }, []);

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
    const formatted = formatPhoneNumber(e.target.value);
    setContact({ phone: formatted });
    clearError("contact.phone");
  };

  const emailValid = touchedFields.has("email") && isEmailValid(contact.email);
  const phoneValid = touchedFields.has("phone") && isPhoneValid(contact.phone) && contact.phone.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Login suggestion for non-authenticated users */}
      {!isAuthenticated && (
        <motion.div
          className="flex items-center gap-3 p-4 bg-wine/5 border border-wine/15 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-8 h-8 bg-wine/10 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-wine" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-charcoal">
              Heb je al een account?
            </p>
            <button
              type="button"
              onClick={() => openLoginModal()}
              className="text-sm font-medium text-wine hover:text-wine-dark transition-colors underline underline-offset-2"
            >
              Inloggen voor sneller afrekenen
            </button>
          </div>
          <SpeedIcon className="w-5 h-5 text-wine/40" />
        </motion.div>
      )}

      {/* Authenticated user greeting */}
      {isAuthenticated && user && (
        <motion.div
          className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircleIcon className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">
              Welkom terug, {user.firstName}!
            </p>
            <p className="text-xs text-grey">
              Je gegevens zijn automatisch ingevuld
            </p>
          </div>
        </motion.div>
      )}

      {/* Email field with validation indicator */}
      <div className="relative">
        <motion.div
          animate={focusedField === "email" ? { scale: 1.0 } : {}}
        >
          <Input
            label="E-mailadres"
            type="email"
            value={contact.email}
            onChange={handleEmailChange}
            onFocus={() => setFocusedField("email")}
            onBlur={() => {
              setFocusedField(null);
              markFieldTouched("email");
            }}
            error={errors["contact.email"]}
            placeholder="jouw@email.nl"
            required
            autoComplete="email"
            className={cn(
              emailValid && !errors["contact.email"] && "border-success focus:ring-success"
            )}
          />
        </motion.div>
        {/* Valid checkmark */}
        <AnimatePresence>
          {emailValid && !errors["contact.email"] && (
            <motion.div
              className="absolute right-3 top-[2.35rem] pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phone field with auto-format and validation */}
      <div className="relative">
        <Input
          label="Telefoonnummer (optioneel)"
          type="tel"
          value={contact.phone}
          onChange={handlePhoneChange}
          onFocus={() => setFocusedField("phone")}
          onBlur={() => {
            setFocusedField(null);
            markFieldTouched("phone");
          }}
          error={errors["contact.phone"]}
          placeholder="+31 6 12345678"
          hint="Voor bezorgberichten"
          autoComplete="tel"
          className={cn(
            phoneValid && !errors["contact.phone"] && "border-success focus:ring-success"
          )}
        />
        {/* Valid checkmark */}
        <AnimatePresence>
          {phoneValid && !errors["contact.phone"] && (
            <motion.div
              className="absolute right-3 top-[2.35rem] pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Checkbox
        label="Ja, ik wil de nieuwsbrief ontvangen met exclusieve aanbiedingen"
        checked={contact.newsletter}
        onChange={(e) => setContact({ newsletter: e.target.checked })}
      />

      <motion.div
        className="pt-2"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <Button type="submit" variant="primary" fullWidth>
          Doorgaan naar bezorgadres
        </Button>
      </motion.div>

      {/* Reassurance */}
      <p className="text-xs text-grey text-center flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-grey" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        We delen je gegevens nooit met derden
      </p>
    </form>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SpeedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
