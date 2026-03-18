import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Afrekenen | Vino per Lei",
  description: "Rond je bestelling af bij Vino per Lei. Veilig betalen met iDEAL, creditcard of PayPal.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Minimal checkout header */}
      <header className="bg-white border-b border-sand py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl text-wine hover:text-wine-dark transition-colors"
          >
            Vino per Lei
          </Link>
          <div className="flex items-center gap-2 text-sm text-grey">
            <Lock className="w-4 h-4" strokeWidth={1.5} />
            <span>Veilig afrekenen</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Minimal footer */}
      <footer className="bg-white border-t border-sand py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-grey">
            <div className="flex items-center gap-6">
              <Link href="/voorwaarden" className="hover:text-wine">
                Algemene voorwaarden
              </Link>
              <Link href="/privacy" className="hover:text-wine">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-wine">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Payment method icons */}
              <span className="text-xs">Betaalmethodes:</span>
              <div className="flex items-center gap-2">
                <IdealIcon className="h-6" />
                <VisaIcon className="h-6" />
                <MastercardIcon className="h-6" />
                <PaypalIcon className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Brand payment icons (custom, no Lucide equivalent)
function IdealIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#CC0066" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        iDEAL
      </text>
    </svg>
  );
}

function VisaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontStyle="italic"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#F5F5F5" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
    </svg>
  );
}

function PaypalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#003087" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        PayPal
      </text>
    </svg>
  );
}
