import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/shopify-cms";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Vino per Lei",
  description:
    "De algemene voorwaarden van Vino per Lei. Informatie over bestellen, levering, retourneren en meer.",
};

export default async function VoorwaardenPage() {
  const page = await getPage("algemene-voorwaarden");

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Juridisch</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {page?.title ?? "Algemene Voorwaarden"}
          </h1>
          {page?.updatedAt && (
            <p className="text-grey text-sm">
              Laatst bijgewerkt:{" "}
              {new Date(page.updatedAt).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Content */}
        {page?.body ? (
          <div
            className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.body) }}
          />
        ) : (
          <div className="bg-warm-white rounded-lg p-8 text-center border border-sand">
            <p className="text-grey">Inhoud wordt binnenkort toegevoegd.</p>
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
