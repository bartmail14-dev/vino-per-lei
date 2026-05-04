"use client";

import { cn } from "@/lib/utils";
import { ShieldIcon, TruckIcon, ReturnIcon } from "@/components/icons";
import { useUiCopy } from "@/components/providers";

interface TrustSignalsProps {
  className?: string;
  variant?: "compact" | "full";
}

export function TrustSignals({ className, variant = "compact" }: TrustSignalsProps) {
  const t = useUiCopy();
  if (variant === "full") {
    return (
      <div className={cn("grid grid-cols-2 gap-4", className)}>
        <div className="flex items-center gap-3 p-3 bg-warm-white rounded-lg">
          <ShieldIcon className="w-6 h-6 text-wine flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">{t("checkout.trust.secure_title")}</p>
            <p className="text-xs text-grey">{t("checkout.trust.secure_desc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-warm-white rounded-lg">
          <TruckIcon className="w-6 h-6 text-wine flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">{t("checkout.trust.delivery_title")}</p>
            <p className="text-xs text-grey">{t("checkout.trust.delivery_desc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-warm-white rounded-lg">
          <ReturnIcon className="w-6 h-6 text-wine flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">{t("checkout.trust.return_title")}</p>
            <p className="text-xs text-grey">{t("checkout.trust.return_desc")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm text-grey">
        <ShieldIcon className="w-4 h-4 text-wine" />
        <span>{t("checkout.trust.secure_title")} - {t("checkout.trust.secure_desc")}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-grey">
        <TruckIcon className="w-4 h-4 text-wine" />
        <span>{t("checkout.trust.delivery_title")}: {t("checkout.trust.delivery_desc")}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-grey">
        <ReturnIcon className="w-4 h-4 text-wine" />
        <span>{t("checkout.trust.return_title")}</span>
      </div>
    </div>
  );
}

