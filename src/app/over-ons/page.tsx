import Link from "next/link";
import { getPage } from "@/lib/shopify-cms";

import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Over Ons | Vino per Lei",
  description: "Ontdek het verhaal achter Vino per Lei — onze passie voor authentieke Italiaanse wijnen.",
  openGraph: {
    title: "Over Ons | Vino per Lei",
    description: "Ontdek het verhaal achter Vino per Lei — onze passie voor authentieke Italiaanse wijnen.",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
  twitter: {
    card: "summary_large_image",
    title: "Over Ons | Vino per Lei",
    description: "Ontdek het verhaal achter Vino per Lei — onze passie voor authentieke Italiaanse wijnen.",
  },
};

export default async function OverOnsPage() {
  const page = await getPage("over-ons");

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Ons Verhaal</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {page?.title ?? "Over Ons"}
          </h1>
        </div>

        {/* Content */}
        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        ) : (
          <div className="bg-warm-white rounded-lg p-8 text-center border border-sand">
            <p className="text-grey mb-6">Inhoud wordt binnenkort toegevoegd.</p>
            <div className="flex justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-12 px-6 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors"
              >
                Terug naar Home
              </Link>
              <Link
                href="/wijnen"
                className="inline-flex items-center justify-center h-12 px-6 border-2 border-wine text-wine font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine hover:text-white transition-colors"
              >
                Bekijk Wijnen
              </Link>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-sand">
          <Link
            href="/"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar de homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
