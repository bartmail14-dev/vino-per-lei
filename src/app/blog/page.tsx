import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getBlogArticles, getBlogTags } from "@/lib/shopify-cms";
import type { BlogArticle } from "@/lib/shopify-cms";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import {
  BlogFadeIn,
  BlogStagger,
  BlogStaggerItem,
  AnimatedDivider,
  RevealText,
} from "./BlogAnimations";

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

function WineGlassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8l-1 9a5 5 0 0 1-10 0L8 2z" />
      <path d="M12 11v8" />
      <path d="M8 19h8" />
    </svg>
  );
}

function GrapeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity="0.06">
      <circle cx="12" cy="8" r="2.5" />
      <circle cx="9" cy="12" r="2.5" />
      <circle cx="15" cy="12" r="2.5" />
      <circle cx="7.5" cy="16" r="2.5" />
      <circle cx="12" cy="16" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
      <circle cx="10" cy="20" r="2.5" />
      <circle cx="14" cy="20" r="2.5" />
      <path d="M12 2v4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" />
      <path d="M12 2c2 0 4 1 4 3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" />
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

  /* No-image featured: navy card with decorative grape motif */
  return (
    <Link href={`/blog/${article.handle}`} className="group block">
      <article className="bg-wine rounded-2xl sm:rounded-3xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10">
          <GrapeIcon className="w-32 h-32 sm:w-48 sm:h-48 text-white" />
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-l from-gold/20 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-1/3 bg-gradient-to-b from-gold/20 to-transparent" />

        <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16 max-w-3xl relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <WineGlassIcon className="w-4 h-4 text-gold/40" />
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-gold/90 bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/20">
              {category}
            </span>
          </div>

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

          {/* Read more indicator */}
          <div className="mt-8 pt-6 border-t border-white/8">
            <span className="flex items-center gap-2 text-sm text-gold/60 font-medium group-hover:text-gold group-hover:gap-3 transition-all duration-300">
              Lees het verhaal <ArrowIcon className="w-4 h-4" />
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
function ArticleCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  const category = article.tags[0] || "Wijn";
  const hasImage = !!article.image;

  return (
    <Link href={`/blog/${article.handle}`} className={`group block h-full ${featured ? "sm:col-span-2" : ""}`}>
      <article className={`rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col bg-white border border-sand/60 hover:shadow-lg hover:shadow-wine/5 hover:-translate-y-1 transition-all duration-500 ${featured ? "sm:flex-row" : ""}`}>
        {/* Image — only when there IS one */}
        {hasImage && (
          <div className={`relative overflow-hidden ${featured ? "sm:w-1/2 aspect-[16/10] sm:aspect-auto" : "aspect-[16/10]"}`}>
            <Image
              src={article.image!.url}
              alt={article.image!.altText || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes={featured ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
            <div className="absolute top-3.5 left-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {category}
              </span>
            </div>
          </div>
        )}

        {/* No image: decorative accent header */}
        {!hasImage && (
          <div className={`bg-wine relative overflow-hidden ${featured ? "sm:w-2/5 sm:min-h-full" : ""}`}>
            <div className="absolute inset-0">
              <GrapeIcon className="absolute -bottom-4 -right-4 w-24 h-24 text-white" />
            </div>
            <div className={`relative z-10 ${featured ? "px-6 py-6 sm:px-8 sm:py-10 sm:flex sm:flex-col sm:justify-center sm:h-full" : "px-5 py-4 sm:px-6 sm:py-5"}`}>
              <div className="flex items-center gap-2.5">
                <WineGlassIcon className="w-3.5 h-3.5 text-gold/50" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold/90">
                  {category}
                </span>
              </div>
              {featured && (
                <p className="hidden sm:block mt-4 text-white/30 text-xs leading-relaxed max-w-[200px]">
                  Ontdek het verhaal achter de wijn
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`p-5 sm:p-6 flex flex-col flex-1 ${featured ? "sm:p-8" : ""}`}>
          <h3 className={`font-serif font-semibold text-charcoal mb-2.5 group-hover:text-wine transition-colors duration-300 leading-snug line-clamp-2 ${featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
            {article.title}
          </h3>

          {article.excerpt && (
            <p className={`text-grey leading-relaxed mb-5 flex-1 ${featured ? "text-sm sm:text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
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
            <span className="flex items-center gap-1.5 ml-auto text-wine font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Lees <ArrowIcon className="w-3.5 h-3.5" />
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
      <div className="bg-dark-bg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]">
          <GrapeIcon className="w-full h-full text-gold" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        {/* Radial glow */}
        <div className="absolute -bottom-20 left-1/4 w-96 h-40 bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 lg:py-28 relative">
          <BlogFadeIn delay={0}>
            <div className="flex items-center gap-3 mb-6">
              <WineGlassIcon className="w-4 h-4 text-gold/40" />
              <div className="h-px w-8 bg-gold/20" />
              <p className="text-gold/50 text-[11px] font-medium tracking-[0.3em] uppercase">
                Journal
              </p>
            </div>
          </BlogFadeIn>

          <RevealText
            text="Wijn Verhalen"
            className="font-serif text-4xl sm:text-5xl lg:text-[4rem] font-semibold text-white mb-6 leading-[1.05]"
            delay={0.2}
          />

          <BlogFadeIn delay={0.6}>
            <p className="text-white/40 max-w-lg text-base sm:text-lg leading-relaxed">
              Verhalen over Italiaanse wijnen, wijnboeren en de mooiste regio&apos;s.
            </p>
          </BlogFadeIn>

          {/* Article count */}
          <BlogFadeIn delay={0.8}>
            <div className="mt-10 flex items-center gap-4">
              <span className="text-white/20 text-xs font-medium tracking-wider uppercase">
                {articles.length} {articles.length === 1 ? "verhaal" : "verhalen"}
              </span>
              <div className="h-px flex-1 max-w-[80px] bg-white/10" />
            </div>
          </BlogFadeIn>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        {articles.length > 0 ? (
          <>
            {/* Featured */}
            {featured && (
              <BlogFadeIn delay={0.1} className="-mt-6 sm:-mt-10 relative z-10 mb-14 sm:mb-20">
                <FeaturedArticle article={featured} />
              </BlogFadeIn>
            )}

            {/* Animated divider */}
            <AnimatedDivider className="mb-10 sm:mb-14" />

            {/* Category filter with label */}
            {allTags.length > 1 && (
              <BlogFadeIn className="mb-10 sm:mb-14">
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs font-medium text-grey uppercase tracking-wider">Categorieën</p>
                  <div className="h-px flex-1 bg-sand/60" />
                </div>
                <BlogCategoryFilter tags={allTags} />
              </BlogFadeIn>
            )}

            {/* Grid — first card spans 2 columns for visual variety */}
            {rest.length > 0 && (
              <BlogStagger className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, i) => (
                  <BlogStaggerItem key={article.handle}>
                    <ArticleCard
                      article={article}
                      featured={i === 0 && rest.length >= 3}
                    />
                  </BlogStaggerItem>
                ))}
              </BlogStagger>
            )}

            {rest.length === 0 && featured && (
              <p className="text-grey text-center py-12 text-sm">
                {activeTag
                  ? `Dit was het enige artikel voor "${activeTag}".`
                  : "Meer verhalen volgen binnenkort!"}
              </p>
            )}

            {filtered.length === 0 && (
              <BlogFadeIn className="text-center py-20">
                <WineGlassIcon className="w-10 h-10 text-sand mx-auto mb-5" />
                <p className="text-charcoal font-serif text-lg mb-2">
                  Geen artikelen gevonden
                </p>
                <p className="text-grey text-sm mb-5">
                  Er zijn geen verhalen voor &ldquo;{activeTag}&rdquo;.
                </p>
                <Link href="/blog" className="inline-flex items-center gap-2 text-wine text-sm font-medium hover:gap-3 transition-all">
                  Bekijk alle verhalen <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </BlogFadeIn>
            )}
          </>
        ) : (
          <BlogFadeIn className="text-center py-20 sm:py-28">
            <WineGlassIcon className="w-12 h-12 text-sand mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-3">
              Binnenkort meer verhalen
            </h2>
            <p className="text-grey text-sm max-w-md mx-auto leading-relaxed">
              We werken aan mooie verhalen over Italiaanse wijnen en regio&apos;s. Kom snel terug!
            </p>
          </BlogFadeIn>
        )}
      </div>

      {/* ─── Newsletter CTA ─── */}
      <BlogFadeIn>
        <div className="bg-dark-bg relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,162,39,0.06),transparent_60%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          <div className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.03]">
            <GrapeIcon className="w-full h-full text-gold" />
          </div>
          {/* Wine bottle silhouette */}
          <svg className="absolute left-8 sm:left-16 top-1/2 -translate-y-1/2 w-12 h-32 sm:w-16 sm:h-44 text-white/[0.03] hidden lg:block" viewBox="0 0 120 260" fill="currentColor">
            <rect x="48" y="0" width="24" height="14" rx="3" />
            <path d="M52 14h16v20l10 16v120c0 12-8 20-18 20H60c-10 0-18-8-18-20V50l10-16V14z" />
          </svg>

          <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center relative">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-gold/20" />
              <WineGlassIcon className="w-5 h-5 text-gold/30" />
              <div className="h-px w-8 bg-gold/20" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3 leading-[1.15]">
              Mis geen enkel verhaal
            </h2>
            <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
              Ontvang onze nieuwste wijnverhalen, tips en exclusieve aanbiedingen rechtstreeks in je inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="je@email.nl"
                className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
              />
              <button className="px-7 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-wine-dark font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                Schrijf me in
              </button>
            </div>

            <p className="text-white/15 text-[11px] mt-4">
              Geen spam. Maximaal 2 mails per maand. Altijd opzegbaar.
            </p>
          </div>
        </div>
      </BlogFadeIn>

      {/* ─── Footer nav ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="py-8 border-t border-sand/50 flex items-center justify-between">
          <Link href="/" className="text-sm text-wine hover:text-wine-dark transition-colors flex items-center gap-1.5">
            &larr; Homepage
          </Link>
          <Link href="/wijnen" className="text-sm text-wine hover:text-wine-dark transition-colors flex items-center gap-1.5">
            Onze wijnen <ArrowIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
