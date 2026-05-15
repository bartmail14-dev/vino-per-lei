import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Afrekenen | Vino per Lei",
  description: "Rond je bestelling af bij Vino per Lei. Veilig afrekenen via Shopify.",
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
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs">Beveiligde Shopify checkout</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
