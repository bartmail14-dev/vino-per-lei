"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { Input, Checkbox, Button } from "@/components/ui";
import { GIFT_WRAPPING_COST } from "@/types/checkout";
import { formatPrice } from "@/lib/utils";

interface GiftSectionProps {
  onComplete: () => void;
}

export function GiftSection({ onComplete }: GiftSectionProps) {
  const { gift, setGift } = useCheckoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Gift toggle */}
      <Checkbox
        label="Dit is een cadeau"
        checked={gift.isGift}
        onChange={(e) => setGift({ isGift: e.target.checked })}
      />

      {/* Gift options - show when isGift is true */}
      <AnimatePresence>
        {gift.isGift && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Gift wrapping */}
            <div className="p-4 border border-sand rounded-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <GiftIcon className="w-10 h-10 text-wine" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-charcoal">
                      Geschenkverpakking
                    </span>
                    <span className="text-sm text-wine font-medium">
                      +{formatPrice(GIFT_WRAPPING_COST)}
                    </span>
                  </div>
                  <p className="text-sm text-grey mb-3">
                    Prachtige wijnverpakking met strik
                  </p>
                  <Checkbox
                    label="Voeg geschenkverpakking toe"
                    checked={gift.wrapping}
                    onChange={(e) => setGift({ wrapping: e.target.checked })}
                  />
                </div>
              </div>
            </div>

            {/* Recipient name */}
            <Input
              label="Naam ontvanger (optioneel)"
              value={gift.recipientName}
              onChange={(e) => setGift({ recipientName: e.target.value })}
              placeholder="Voor wie is dit cadeau?"
              maxLength={100}
            />

            {/* Personal message */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Persoonlijk bericht (optioneel)
              </label>
              <textarea
                value={gift.message}
                onChange={(e) => setGift({ message: e.target.value })}
                placeholder="Schrijf een persoonlijk bericht..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-3 border-2 border-sand rounded-lg focus:ring-2 focus:ring-wine focus:border-transparent transition-colors resize-none"
              />
              <p className="text-xs text-grey mt-1 text-right">
                {gift.message.length}/200 tekens
              </p>
            </div>

            {/* Hide prices option */}
            <Checkbox
              label="Verberg prijzen op de pakbon"
              checked={gift.hidePrices}
              onChange={(e) => setGift({ hidePrices: e.target.checked })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip message when not a gift */}
      {!gift.isGift && (
        <p className="text-sm text-grey">
          Sla deze stap over als dit geen cadeau is.
        </p>
      )}

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth>
          Doorgaan naar verzendmethode
        </Button>
      </div>
    </form>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}
