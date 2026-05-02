import Link from "next/link";
import { sanitizeHtml } from "@/lib/sanitize";

interface ShopifyPageContentProps {
  title: string;
  body: string;
  updatedAt?: string;
}

export function ShopifyPageContent({ title, body, updatedAt }: ShopifyPageContentProps) {
  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {title}
          </h1>
          {updatedAt && (
            <time className="text-grey text-sm" dateTime={updatedAt}>
              {new Date(updatedAt).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
        </div>
        <div
          className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }}
        />
        <div className="mt-16 pt-8 border-t border-sand">
          <Link href="/" className="text-sm text-wine hover:text-wine-dark transition-colors">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
