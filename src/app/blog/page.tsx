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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function FeaturedArticle({ article }: { article: BlogArticle }) {
  const category = article.tags[0] || "Wijn";

  return (
    <Link
      href={`/blog/${article.handle}`}
      className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[21/9]"
    >
      {article.image ? (
        <Image
          src={article.image.url}
          alt={article.image.altText || article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Decorative wine bottle silhouette */}
      {!article.image && (
        <svg className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-72 text-white/[0.04]" viewBox="0 0 120 260" fill="currentColor">
          <rect x="48" y="0" width="24" height="14" rx="3" />
          <path d="M52 14h16v20l10 16v120c0 12-8 20-18 20H60c-10 0-18-8-18-20V50l10-16V14z" />
        </svg>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gold bg-gold/15 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full backdrop-blur-md border border-gold/20">
            {category}
          </span>
          <span className="flex items-center gap-1.5 text-white/50 text-xs">
            <ClockIcon className="w-3.5 h-3.5" />
            {article.readingTimeMinutes} min leestijd
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-gold transition-colors duration-500 leading-[1.1] max-w-3xl">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-white/70 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2 max-w-2xl leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-xs sm:text-sm">
            {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {article.authorV2 && <span> &middot; {article.authorV2.name}</span>}
          </p>
          <span className="hidden sm:flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Lees artikel <ArrowRightIcon className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article, index }: { article: BlogArticle; index: number }) {
  const category = article.tags[0] || "Wijn";

  return (
    <Link href={`/blog/${article.handle}`} className="group">
      <article className="bg-white rounded-xl sm:rounded-2xl border border-sand/50 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          {article.image ? (
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-wine/80 to-wine-dark flex items-center justify-center">
              <span className="text-white/10 font-serif text-8xl font-bold">{String(index + 1).padStart(2, "0")}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-white/10">
              {category}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-xs text-grey mb-3">
            <span className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min
            </span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-semibold text-charcoal mb-2 group-hover:text-wine transition-colors duration-300 leading-snug line-clamp-2">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-grey text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-sand/50">
            {article.authorV2 ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-wine to-wine-dark flex items-center justify-center text-white text-[10px] font-bold">
                  {article.authorV2.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <span className="text-xs text-grey font-medium">{article.authorV2.name}</span>
              </div>
            ) : (
              <span className="text-xs text-grey">Vino per Lei</span>
            )}
            <span className="flex items-center gap-1 text-wine text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Lees meer <ArrowRightIcon className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { tag: activeTag } = await searchParams;

  const [articles, allTags] = await Promise.all([
    getBlogArticles(30),
    getBlogTags(),
  ]);

  // Filter by tag if active
  const filtered = activeTag
    ? articles.filter((a) => a.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : articles;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-background">
      {/* Hero header */}
      <div className="relative bg-dark-bg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.06),transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 relative">
          <p className="text-gold/80 text-xs font-medium tracking-[0.2em] uppercase mb-4">Blog</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            Wijn Verhalen
          </h1>
          <p className="text-white/60 max-w-2xl text-sm sm:text-base leading-relaxed">
            Verhalen over Italiaanse wijnen, wijnboeren, wijnreizen en alles wat je wilt weten over
            de mooiste wijnregio&apos;s. Geschreven met passie, bedoeld om te inspireren.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 sm:pb-24">
        {articles.length > 0 ? (
          <>
            {/* Featured article */}
            {featured && (
              <div className="-mt-6 sm:-mt-8 relative z-10 mb-10 sm:mb-14">
                <FeaturedArticle article={featured} />
              </div>
            )}

            {/* Category filter */}
            {allTags.length > 1 && (
              <div className="mb-8 sm:mb-12">
                <BlogCategoryFilter tags={allTags} />
              </div>
            )}

            {/* Articles grid */}
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article, i) => (
                <ArticleCard key={article.handle} article={article} index={i} />
              ))}
            </div>

            {rest.length === 0 && (
              <p className="text-grey text-center py-12">
                Dit was het enige artikel. Meer verhalen volgen binnenkort!
              </p>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-sand/50 mt-12">
            <div className="w-16 h-16 rounded-full bg-wine/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-wine/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-2">Binnenkort meer verhalen</h2>
            <p className="text-grey text-sm max-w-md mx-auto">
              We werken aan mooie verhalen over Italiaanse wijnen, wijnboeren en regio&apos;s. Kom snel terug!
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
