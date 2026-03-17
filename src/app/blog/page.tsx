import Link from "next/link";
import type { Metadata } from "next";
import { getBlogArticles, getBlogTags } from "@/lib/shopify-cms";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import {
  BlogFadeIn,
  AnimatedDivider,
  RevealText,
  ScrollToTop,
} from "./BlogAnimations";
import {
  FeaturedHero,
  ArticleGrid,
  EmptyState,
  WineGlassIcon,
  GrapeIcon,
  ArrowIcon,
} from "./BlogClientComponents";
import { BlogBottomNewsletter } from "./BlogBottomNewsletter";

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

  // Compute tag counts for filter badges
  const tagCounts: Record<string, number> = {};
  for (const a of articles) {
    for (const t of a.tags) {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Scroll to top */}
      <ScrollToTop />

      {/* ─── Hero Header ─── */}
      <div className="bg-dark-bg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]" aria-hidden="true">
          <GrapeIcon className="w-full h-full text-gold" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" aria-hidden="true" />
        <div className="absolute -bottom-20 left-1/4 w-96 h-40 bg-gold/[0.03] rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(201,162,39,0.04),transparent_50%)]" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-22 lg:py-28 relative">
          <BlogFadeIn delay={0}>
            <div className="flex items-center gap-3.5 mb-7">
              <WineGlassIcon className="w-4 h-4 text-gold/35" />
              <div className="h-px w-10 bg-gradient-to-r from-gold/25 to-transparent" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/45">
                Journal
              </p>
            </div>
          </BlogFadeIn>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold text-white mb-6 leading-[1.05] tracking-[-0.015em]">
            <RevealText
              text="Wijn Verhalen"
              delay={0.2}
            />
          </h1>

          <BlogFadeIn delay={0.6}>
            <p className="text-white/40 max-w-lg text-base sm:text-lg leading-relaxed font-light tracking-wide">
              Verhalen over Italiaanse wijnen, wijnboeren en de mooiste regio&apos;s.
            </p>
          </BlogFadeIn>

          {/* Article count + divider */}
          <BlogFadeIn delay={0.8}>
            <div className="mt-11 flex items-center gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                {articles.length} {articles.length === 1 ? "verhaal" : "verhalen"}
              </span>
              <div className="h-px flex-1 max-w-[80px] bg-white/[0.07]" />
            </div>
          </BlogFadeIn>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
        {articles.length > 0 ? (
          <>
            {/* Featured Article Hero */}
            {featured && (
              <BlogFadeIn delay={0.1} className="-mt-8 sm:-mt-12 lg:-mt-16 relative z-10 mb-12 sm:mb-16">
                <FeaturedHero article={featured} />
              </BlogFadeIn>
            )}

            {/* Animated divider */}
            <AnimatedDivider className="mb-8 sm:mb-12" />

            {/* Category filter */}
            {allTags.length > 1 && (
              <BlogFadeIn className="mb-10 sm:mb-14">
                <div className="flex items-center gap-3 mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-grey/60">
                    Categorieën
                  </p>
                  <div className="h-[1px] flex-1 bg-sand/30" />
                </div>
                <BlogCategoryFilter tags={allTags} tagCounts={tagCounts} totalCount={articles.length} />
              </BlogFadeIn>
            )}

            {/* Article Grid (bento layout with inline newsletter + load more) */}
            {rest.length > 0 && <ArticleGrid articles={rest} initialCount={6} />}

            {/* Single article scenario */}
            {rest.length === 0 && featured && (
              <p className="text-grey text-center py-12 text-sm">
                {activeTag
                  ? `Dit was het enige artikel voor "${activeTag}".`
                  : "Meer verhalen volgen binnenkort!"}
              </p>
            )}

            {/* Filter yields no results */}
            {filtered.length === 0 && (
              <EmptyState activeTag={activeTag} />
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* ─── Bottom Newsletter (only if we have articles but no inline one was shown) ─── */}
      {articles.length > 0 && rest.length <= 2 && (
        <BlogBottomNewsletter />
      )}

      {/* ─── Footer nav ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="py-8 border-t border-sand/30 flex items-center justify-between">
          <Link href="/" className="text-[13px] text-wine/70 hover:text-wine transition-colors flex items-center gap-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg px-2 -mx-2 tracking-wide font-medium">
            &larr; Homepage
          </Link>
          <Link href="/wijnen" className="text-[13px] text-wine/70 hover:text-wine transition-colors flex items-center gap-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg px-2 -mx-2 tracking-wide font-medium">
            Onze wijnen <ArrowIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
