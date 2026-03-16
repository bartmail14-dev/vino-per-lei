"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { Input, Checkbox, Button } from "@/components/ui";
import { GIFT_WRAPPING_COST } from "@/types/checkout";
import { formatPrice } from "@/lib/utils";
import { Gift } from "lucide-react";

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
                  <Gift className="w-10 h-10 text-wine" strokeWidth={1.5} />
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
                className="w-full px-4 py-3 border-2 border-sand rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-colors resize-none"
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

