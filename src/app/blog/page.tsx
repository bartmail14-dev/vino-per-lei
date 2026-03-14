import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getBlogArticles, getBlogTags } from "@/lib/shopify-cms";
import type { BlogArticle } from "@/lib/shopify-cms";
import { BlogCategoryFilter } from "./BlogCategoryFilter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Wijn Verhalen | Vino per Lei",
  description:
    "Verhalen over Italiaanse wijnen, wijnboeren, regio's, druivenrassen en food pairing tips.",
  openGraph: {
    title: "Blog — Wijn Verhalen | Vino per Lei",
    description:
      "Verhalen over Italiaanse wijnen, wijnboeren, regio's, druivenrassen en food pairing tips.",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ════════════════════════════════════════════
   Featured Article — full width hero card
   ════════════════════════════════════════════ */
function FeaturedArticle({ article }: { article: BlogArticle }) {
  const category = article.tags[0] || "Wijn";
  const hasImage = !!article.image;

  if (hasImage) {
    return (
      <Link href={`/blog/${article.handle}`} className="group block">
        <article className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[21/9]">
          <Image
            src={article.image!.url}
            alt={article.image!.altText || article.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-[1.2s]"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-gold bg-gold/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold/20 mb-4">
              {category}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3 sm:mb-4 leading-[1.1] max-w-3xl group-hover:text-gold transition-colors duration-500">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-white/70 text-sm sm:text-base mb-5 line-clamp-2 max-w-2xl leading-relaxed">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-white/50 text-sm">
              {article.authorV2 && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-bold">
                    {article.authorV2.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <span>{article.authorV2.name}</span>
                </div>
              )}
              <span>{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5" />
                {article.readingTimeMinutes} min
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* No-image featured: navy card with proper contrast */
  return (
    <Link href={`/blog/${article.handle}`} className="group block">
      <article className="bg-wine rounded-2xl sm:rounded-3xl overflow-hidden">
        <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16 max-w-3xl">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-gold/90 bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/20 mb-6">
            {category}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-5 leading-[1.1] group-hover:text-gold transition-colors duration-500">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/40 text-sm pt-2">
            {article.authorV2 && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-bold border border-gold/20">
                  {article.authorV2.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <span className="text-white/60 font-medium">{article.authorV2.name}</span>
              </div>
            )}
            <span className="text-white/25">|</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="text-white/25">|</span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min leestijd
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ════════════════════════════════════════════
   Article Card — with or without image
   ════════════════════════════════════════════ */
function ArticleCard({ article }: { article: BlogArticle }) {
  const category = article.tags[0] || "Wijn";
  const hasImage = !!article.image;

  return (
    <Link href={`/blog/${article.handle}`} className="group block h-full">
      <article className="rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col bg-white border border-sand/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-400">
        {/* Image — only when there IS one */}
        {hasImage && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={article.image!.url}
              alt={article.image!.altText || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute top-3.5 left-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {category}
              </span>
            </div>
          </div>
        )}

        {/* No image: dark accent bar with category */}
        {!hasImage && (
          <div className="bg-wine px-5 py-4 sm:px-6 sm:py-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold/90">
              {category}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-charcoal mb-2.5 group-hover:text-wine transition-colors duration-300 leading-snug line-clamp-2">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-grey text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-sand/50 text-xs text-grey">
            {article.authorV2 && (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-wine to-wine-dark flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                  {article.authorV2.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <span className="font-medium text-charcoal">{article.authorV2.name}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-grey/40" />
              </>
            )}
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1 ml-auto text-wine font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Lees <ArrowIcon className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ════════════════════════════════════════════
   Page
   ════════════════════════════════════════════ */

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { tag: activeTag } = await searchParams;

  const [articles, allTags] = await Promise.all([
    getBlogArticles(30),
    getBlogTags(),
  ]);

  const filtered = activeTag
    ? articles.filter((a) => a.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : articles;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-background min-h-screen">
      {/* ─── Hero ─── */}
      <div className="bg-dark-bg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 lg:py-20">
          <p className="text-gold/50 text-[11px] font-medium tracking-[0.3em] uppercase mb-4">
            Journal
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-[1.1]">
            Wijn Verhalen
          </h1>
          <p className="text-white/40 max-w-lg text-[15px] leading-relaxed">
            Verhalen over Italiaanse wijnen, wijnboeren en de mooiste regio&apos;s.
          </p>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        {articles.length > 0 ? (
          <>
            {/* Featured */}
            {featured && (
              <div className="-mt-4 sm:-mt-6 relative z-10 mb-12 sm:mb-16">
                <FeaturedArticle article={featured} />
              </div>
            )}

            {/* Category filter */}
            {allTags.length > 1 && (
              <div className="mb-10 sm:mb-14">
                <BlogCategoryFilter tags={allTags} />
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article.handle} article={article} />
                ))}
              </div>
            )}

            {rest.length === 0 && featured && (
              <p className="text-grey text-center py-12 text-sm">
                {activeTag
                  ? `Dit was het enige artikel voor "${activeTag}".`
                  : "Meer verhalen volgen binnenkort!"}
              </p>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-charcoal font-serif text-lg mb-2">
                  Geen artikelen gevonden
                </p>
                <p className="text-grey text-sm mb-5">
                  Er zijn geen verhalen voor &ldquo;{activeTag}&rdquo;.
                </p>
                <Link href="/blog" className="text-wine text-sm font-medium hover:underline underline-offset-2">
                  Bekijk alle verhalen &rarr;
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 sm:py-28">
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-3">
              Binnenkort meer verhalen
            </h2>
            <p className="text-grey text-sm max-w-md mx-auto leading-relaxed">
              We werken aan mooie verhalen over Italiaanse wijnen en regio&apos;s. Kom snel terug!
            </p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-sand/50">
          <Link href="/" className="text-sm text-wine hover:text-wine-dark transition-colors">
            &larr; Terug naar de homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
