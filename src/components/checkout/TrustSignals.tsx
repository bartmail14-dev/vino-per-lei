"use client";

import { cn } from "@/lib/utils";
import { ShieldIcon, TruckIcon, ReturnIcon, StarIcon } from "@/components/icons";

interface TrustSignalsProps {
  className?: string;
  variant?: "compact" | "full";
}

export function TrustSignals({ className, variant = "compact" }: TrustSignalsProps) {
  if (variant === "full") {
    return (
      <div className={cn("grid grid-cols-2 gap-4", className)}>
        <div className="flex items-center gap-3 p-3 bg-warm-white rounded-lg">
          <ShieldIcon className="w-6 h-6 text-wine flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">Veilig betalen</p>
            <p className="text-xs text-grey">SSL-beveiligd</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-warm-white rounded-lg">
          <TruckIcon className="w-6 h-6 text-wine flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">Snelle levering</p>
            <p className="text-xs text-grey">1-2 werkdagen</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-warm-white rounded-lg">
          <ReturnIcon className="w-6 h-6 text-wine flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">Gratis retour</p>
            <p className="text-xs text-grey">Binnen 14 dagen</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-warm-white rounded-lg">
          <StarIcon className="w-6 h-6 text-gold flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-charcoal">Proefgarantie</p>
            <p className="text-xs text-grey">100% tevredenheid</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm text-grey">
        <ShieldIcon className="w-4 h-4 text-wine" />
        <span>Veilig betalen met SSL</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-grey">
        <TruckIcon className="w-4 h-4 text-wine" />
        <span>Gratis verzending vanaf €35</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-grey">
        <ReturnIcon className="w-4 h-4 text-wine" />
        <span>14 dagen bedenktijd</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-grey">
        <StarIcon className="w-4 h-4 text-gold" />
        <span>100% Proefgarantie</span>
      </div>
    </div>
  );
}

