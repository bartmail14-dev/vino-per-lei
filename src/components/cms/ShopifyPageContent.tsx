import Link from "next/link";
import { sanitizeHtml } from "@/lib/sanitize";

interface ShopifyPageContentProps {
  title: string;
  body: string;
  updatedAt?: string;
}

export function ShopifyPageContent({ title, body, updatedAt }: ShopifyPageContentProps) {
  return (
    <div className="shopify-page-shell bg-background">
      <div className="shopify-page-container mx-auto px-4 py-16 sm:py-24">
        <div className="shopify-page-header mb-12">
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
          className="shopify-page-body"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }}
        />
        <div className="shopify-page-footer mt-16 pt-8 border-t border-sand">
          <Link href="/" className="text-sm text-wine hover:text-wine-dark transition-colors">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
