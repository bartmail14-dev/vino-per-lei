"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { Input, Checkbox, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { Gift } from "lucide-react";
import { useUiCopy } from "@/components/providers";
import { useShopConfig } from "@/components/providers/ShopConfigProvider";

interface GiftSectionProps {
  onComplete: () => void;
}

export function GiftSection({ onComplete }: GiftSectionProps) {
  const t = useUiCopy();
  const { gift, setGift } = useCheckoutStore();
  const { giftWrappingCost } = useShopConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Gift toggle */}
      <Checkbox
        label={t("checkout.gift.is_gift")}
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
                      {t("checkout.gift.wrapping_title")}
                    </span>
                    <span className="text-sm text-wine font-medium">
                      +{formatPrice(giftWrappingCost)}
                    </span>
                  </div>
                  <p className="text-sm text-grey mb-3">
                    {t("checkout.gift.wrapping_desc")}
                  </p>
                  <Checkbox
                    label={t("checkout.gift.add_wrapping")}
                    checked={gift.wrapping}
                    onChange={(e) => setGift({ wrapping: e.target.checked })}
                  />
                </div>
              </div>
            </div>

            {/* Recipient name */}
            <Input
              label={t("checkout.gift.recipient_label")}
              value={gift.recipientName}
              onChange={(e) => setGift({ recipientName: e.target.value })}
              placeholder={t("checkout.gift.recipient_placeholder")}
              maxLength={100}
            />

            {/* Personal message */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                {t("checkout.gift.message_label")}
              </label>
              <textarea
                value={gift.message}
                onChange={(e) => setGift({ message: e.target.value })}
                placeholder={t("checkout.gift.message_placeholder")}
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
              label={t("checkout.gift.hide_prices")}
              checked={gift.hidePrices}
              onChange={(e) => setGift({ hidePrices: e.target.checked })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip message when not a gift */}
      {!gift.isGift && (
        <p className="text-sm text-grey">
          {t("checkout.gift.skip_hint")}
        </p>
      )}

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth>
          {t("checkout.gift.continue")}
        </Button>
      </div>
    </form>
  );
}

