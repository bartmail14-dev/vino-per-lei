"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { cn } from "@/lib/utils";

interface DiscountCodeProps {
  className?: string;
}

export function DiscountCode({ className }: DiscountCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { discountApplied, applyDiscountCode, removeDiscountCode, errors } =
    useCheckoutStore();

  const handleApply = async () => {
    if (!inputValue.trim()) {
      setLocalError("Voer een kortingscode in");
      return;
    }

    setIsApplying(true);
    setLocalError(null);
    setSuccessMessage(null);

    const success = await applyDiscountCode(inputValue);

    setIsApplying(false);

    if (success) {
      setSuccessMessage("Kortingscode toegepast!");
      setInputValue("");
      setTimeout(() => setSuccessMessage(null), 2000);
    } else {
      setLocalError(errors.discountCode || "Ongeldige kortingscode");
    }
  };

  const handleRemove = () => {
    removeDiscountCode();
    setInputValue("");
    setLocalError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  // If discount is already applied, show it
  if (discountApplied) {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">
            {discountApplied.code}
          </span>
          <span className="text-xs text-grey">
            ({discountApplied.amount}
            {discountApplied.type === "percentage" ? "%" : "€"} korting)
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="text-grey hover:text-charcoal transition-colors"
          aria-label="Verwijder kortingscode"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-wine hover:text-wine-dark transition-colors"
      >
        <TagIcon className="w-4 h-4" />
        <span>Kortingscode toevoegen</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronIcon className="w-4 h-4" />
        </motion.span>
      </button>

      {/* Input field */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value.toUpperCase());
                      setLocalError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Voer code in"
                    className={cn(
                      "w-full h-10 px-3 border rounded text-sm uppercase",
                      "focus:outline-none focus:ring-2 focus:ring-wine focus:border-transparent",
                      "transition-colors",
                      localError
                        ? "border-error focus:ring-error"
                        : "border-sand"
                    )}
                    disabled={isApplying}
                  />
                </div>
                <button
                  onClick={handleApply}
                  disabled={isApplying || !inputValue.trim()}
                  className={cn(
                    "px-4 h-10 rounded text-sm font-medium transition-colors",
                    "bg-charcoal text-white hover:bg-charcoal/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isApplying ? (
                    <LoadingSpinner className="w-4 h-4" />
                  ) : (
                    "Toepassen"
                  )}
                </button>
              </div>

              {/* Error message */}
              {localError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-error mt-1"
                >
                  {localError}
                </motion.p>
              )}

              {/* Success message */}
              {successMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-success mt-1"
                >
                  {successMessage}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
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
