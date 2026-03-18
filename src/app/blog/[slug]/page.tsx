import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogArticleByHandle,
  getBlogArticles,
} from "@/lib/shopify-cms";
import type { BlogArticle } from "@/lib/shopify-cms";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  BlogFadeIn,
  BlogStagger,
  BlogStaggerItem,
  AnimatedDivider,
  ReadingProgressEnhanced,
  ArticleContentEnhancer,
  ScrollToTop,
} from "../BlogAnimations";
import { ArticleHero } from "./ArticleHero";
import { FloatingShareBar } from "./FloatingShareBar";
import { TableOfContents } from "./TableOfContents";
import { NewsletterCTA } from "./NewsletterCTA";
import { ImageLightbox } from "./ImageLightbox";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getBlogArticles(30);
  return articles.map((a) => ({ slug: a.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleByHandle(slug);

  if (!article) {
    return { title: "Artikel niet gevonden | Vino per Lei" };
  }

  return {
    title: article.seo.title || `${article.title} | Vino per Lei`,
    description: article.seo.description || article.excerpt || undefined,
    openGraph: {
      title: article.seo.title || article.title,
      description: article.seo.description || article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt,
      locale: "nl_NL",
      siteName: "Vino per Lei",
      ...(article.image && { images: [{ url: article.image.url }] }),
      ...(article.tags.length > 0 && { tags: article.tags }),
    },
  };
}

/* Icons */

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

/* Related Article Card — 3:2 aspect ratio, category as text, subtle hover */
function RelatedCard({ article }: { article: BlogArticle }) {
  const category = article.tags[0] || "Wijn";
  const hasImage = !!article.image;

  return (
    <Link href={`/blog/${article.handle}`} className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg">
      <article className="bg-white rounded-lg overflow-hidden hover:shadow-md hover:shadow-black/[0.04] transition-all duration-500 h-full flex flex-col border border-sand/30">
        {hasImage ? (
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src={article.image!.url}
              alt={article.image!.altText || article.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-wine via-wine-dark to-[#0d0f1f]">
            <div className="absolute inset-0 opacity-[0.04] bg-grain" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(201,162,39,0.1),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(45,52,84,0.4),transparent_50%)]" />
            {/* Floating circles — consistent with blog listing cards */}
            <div className="absolute top-[15%] right-[12%] w-14 h-14 rounded-full border border-gold/[0.06] group-hover:border-gold/[0.12] group-hover:scale-110 transition-all duration-[1.2s]" />
            <div className="absolute bottom-[20%] left-[15%] w-8 h-8 rounded-full border border-white/[0.04] group-hover:border-white/[0.08] group-hover:scale-125 transition-all duration-[1.5s]" />
            <div className="absolute top-[40%] right-[30%] w-5 h-5 rounded-full bg-gold/[0.04] group-hover:bg-gold/[0.08] transition-all duration-[1s]" />
            {/* Gold accent line bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
          </div>
        )}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Category as plain text — no badge */}
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-grey/50 mb-2.5">{category}</p>
          <h3 className="font-serif text-base sm:text-lg font-semibold text-charcoal group-hover:text-wine transition-colors duration-300 line-clamp-2 leading-snug mb-3">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-grey/55 leading-relaxed line-clamp-2 mb-4">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2.5 text-[12px] text-grey/45 mt-auto pt-4 border-t border-sand/25">
            <ClockIcon className="w-3 h-3" />
            <span>{article.readingTimeMinutes} min</span>
            <span className="w-0.5 h-0.5 rounded-full bg-grey/25" aria-hidden="true" />
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* Article Page */
export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getBlogArticleByHandle(slug),
    getBlogArticles(10),
  ]);

  if (!article) {
    notFound();
  }

  const related = allArticles
    .filter((a) => a.handle !== article.handle)
    .filter((a) => a.tags.some((t) => article.tags.includes(t)))
    .slice(0, 3);

  const relatedFinal =
    related.length >= 2
      ? related
      : allArticles.filter((a) => a.handle !== article.handle).slice(0, 3);

  const authorName = article.authorV2?.name || "Vino per Lei";
  const authorInitials = authorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  // JSON-LD: BlogPosting schema
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt || undefined,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Vino per Lei",
      url: "https://vinoperlei.nl",
      logo: {
        "@type": "ImageObject",
        url: "https://vinoperlei.nl/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://vinoperlei.nl/blog/${slug}`,
    },
    ...(article.image && {
      image: article.image.url,
    }),
  };

  // JSON-LD: BreadcrumbList schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vinoperlei.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://vinoperlei.nl/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://vinoperlei.nl/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    <div className="bg-background min-h-screen">
      <ReadingProgressEnhanced readingTimeMinutes={article.readingTimeMinutes} />
      <ArticleContentEnhancer />
      <ScrollToTop />
      <FloatingShareBar title={article.title} />
      <TableOfContents />
      <ImageLightbox />

      <ArticleHero
        title={article.title}
        tags={article.tags}
        authorName={authorName}
        authorInitials={authorInitials}
        publishedAt={article.publishedAt}
        readingTimeMinutes={article.readingTimeMinutes}
        image={article.image}
        excerpt={article.excerpt}
      />

      <div className="relative">
        <div className="absolute -top-5 inset-x-0 h-6 bg-background rounded-t-[2rem] sm:rounded-t-[3rem]" />

        <div className="max-w-[680px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 lg:pt-24 pb-20 xl:pb-12 relative z-10">
          <BlogFadeIn>
            <article
              className="prose-wine max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.contentHtml) }}
            />
          </BlogFadeIn>

          <AnimatedDivider className="mt-16 sm:mt-20 mb-10" />

          {/* Tags — neutral sand color, not wine-tinted */}
          {article.tags.length > 0 && (
            <BlogFadeIn>
              <div className="flex flex-wrap gap-2 mb-12">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-[12px] font-medium text-grey/60 bg-sand/25 hover:bg-sand/50 px-4 py-2 rounded-full transition-colors duration-200 capitalize border border-sand/30 hover:border-sand/60 min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </BlogFadeIn>
          )}

          {/* Author card — simplified: clean border-top section */}
          {article.authorV2 && (
            <BlogFadeIn>
              <div className="py-6 border-t border-sand/30 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-charcoal/60 text-xs font-semibold flex-shrink-0">
                    {authorInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-grey/40 mb-0.5">
                      Geschreven door
                    </p>
                    <p className="font-medium text-charcoal text-sm leading-tight">
                      {article.authorV2.name}
                    </p>
                  </div>
                </div>
              </div>
            </BlogFadeIn>
          )}

          <NewsletterCTA />
        </div>
      </div>

      {/* Related articles */}
      {relatedFinal.length > 0 && (
        <aside
          aria-label="Gerelateerde artikelen"
          className="bg-warm-white border-t border-sand/25"
        >
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
            <BlogFadeIn>
              <div className="flex items-end justify-between mb-10 sm:mb-12">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                    Lees ook
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:flex items-center gap-2 text-grey/60 hover:text-wine font-medium text-sm transition-colors group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg"
                >
                  Alle verhalen
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </BlogFadeIn>

            {/* Mobile: horizontal scroll */}
            <div className="sm:hidden -mx-5 px-5">
              <BlogStagger className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
                {relatedFinal.map((a) => (
                  <BlogStaggerItem
                    key={a.handle}
                    className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start"
                  >
                    <RelatedCard article={a} />
                  </BlogStaggerItem>
                ))}
              </BlogStagger>
            </div>

            {/* Desktop: grid */}
            <BlogStagger className="hidden sm:grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFinal.map((a) => (
                <BlogStaggerItem key={a.handle}>
                  <RelatedCard article={a} />
                </BlogStaggerItem>
              ))}
            </BlogStagger>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-grey/60 font-medium text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg"
              >
                Alle verhalen <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* Bottom navigation */}
      <nav
        aria-label="Artikelnavigatie"
        className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10 border-t border-sand/25"
      >
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm text-grey/50 hover:text-wine transition-colors group inline-flex items-center gap-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg px-2 -mx-2"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Alle verhalen
          </Link>
          <Link
            href="/wijnen"
            className="text-sm text-grey/50 hover:text-wine transition-colors group inline-flex items-center gap-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-lg px-2 -mx-2"
          >
            Bekijk onze wijnen
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      <div className="h-14 xl:hidden" aria-hidden="true" />
    </div>
    </>
  );
}
