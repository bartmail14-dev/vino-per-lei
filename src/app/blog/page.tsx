import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getBlogArticles } from "@/lib/shopify-cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Vino per Lei",
  description:
    "Lees onze verhalen over Italiaanse wijnen, regio's en druivenrassen.",
  openGraph: {
    title: "Blog | Vino per Lei",
    description:
      "Lees onze verhalen over Italiaanse wijnen, regio's en druivenrassen.",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function BlogPage() {
  const articles = await getBlogArticles(20);

  return (
    <div className="bg-background">
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Blog</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Wijn Verhalen
          </h1>
          <p className="text-grey max-w-2xl">
            Ontdek de wereld van Italiaanse wijnen. Van druivenrassen en
            regio&apos;s tot food pairing tips en wijnweetjes.
          </p>
        </div>

        {/* Articles grid */}
        {articles.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.handle}
                href={`/blog/${article.handle}`}
                className="group"
              >
                <article className="bg-warm-white rounded-lg border border-sand overflow-hidden hover:shadow-md transition-shadow">
                  {article.image ? (
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-wine/5 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-wine/30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs uppercase tracking-wide text-wine bg-wine/5 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-serif text-lg font-semibold text-charcoal mb-2 group-hover:text-wine transition-colors">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-grey text-sm line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <p className="text-grey/60 text-xs mt-3">
                      {new Date(article.publishedAt).toLocaleDateString(
                        "nl-NL",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-warm-white rounded-lg p-8 text-center border border-sand">
            <p className="text-grey">
              Er zijn nog geen artikelen. Kom binnenkort terug!
            </p>
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
