"use client";

import { cn } from "@/lib/utils";

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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
