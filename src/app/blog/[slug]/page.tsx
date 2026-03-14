import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogArticleByHandle,
  getBlogArticles,
} from "@/lib/shopify-cms";
import type { BlogArticle } from "@/lib/shopify-cms";
import { ShareButtons } from "./ShareButtons";

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

function RelatedCard({ article }: { article: BlogArticle }) {
  const category = article.tags[0] || "Wijn";

  return (
    <Link href={`/blog/${article.handle}`} className="group">
      <article className="bg-white rounded-xl border border-sand/50 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          {article.image ? (
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-wine/60 to-wine-dark" />
          )}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {category}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-serif text-base sm:text-lg font-semibold text-charcoal group-hover:text-wine transition-colors line-clamp-2 leading-snug mb-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-grey">
            <ClockIcon className="w-3 h-3" />
            <span>{article.readingTimeMinutes} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getBlogArticleByHandle(slug),
    getBlogArticles(10),
  ]);

  if (!article) {
    notFound();
  }

  // Get related articles (same tags, excluding current)
  const related = allArticles
    .filter((a) => a.handle !== article.handle)
    .filter((a) => a.tags.some((t) => article.tags.includes(t)))
    .slice(0, 3);

  // If not enough related by tag, fill with recent
  const relatedFinal =
    related.length >= 2
      ? related
      : allArticles.filter((a) => a.handle !== article.handle).slice(0, 3);

  const authorName = article.authorV2?.name || "Vino per Lei";
  const authorInitials = authorName.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const category = article.tags[0] || "Wijn";
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative bg-dark-bg overflow-hidden">
        {article.image && (
          <>
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover opacity-30"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-dark-bg/40" />
          </>
        )}
        {!article.image && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        )}

        <div className="max-w-4xl mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 relative">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors mb-8"
          >
            &larr; Alle verhalen
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20 hover:bg-gold/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-[1.1] max-w-3xl">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wine to-wine-dark flex items-center justify-center text-white text-xs font-bold">
                {authorInitials}
              </div>
              <span className="text-white/70 font-medium">{authorName}</span>
            </div>
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min leestijd
            </span>
          </div>
        </div>
      </div>

      {/* Featured image (large, below hero) */}
      {article.image && (
        <div className="max-w-5xl mx-auto px-4 -mt-6 sm:-mt-10 relative z-10 mb-10 sm:mb-14">
          <div className="aspect-[16/9] sm:aspect-[21/9] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
      )}

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-4 pb-16 sm:pb-24">
        <article
          className="prose prose-lg max-w-none text-grey
            prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-12 prose-h2:pt-6 prose-h2:border-t prose-h2:border-sand/50
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8
            prose-p:leading-[1.8] prose-p:text-grey
            prose-a:text-wine prose-a:underline prose-a:decoration-wine/30 hover:prose-a:decoration-wine prose-a:underline-offset-2
            prose-strong:text-charcoal
            prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-wine prose-blockquote:bg-warm-white prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-charcoal prose-blockquote:font-serif"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Share + Tags footer */}
        <div className="mt-12 pt-8 border-t border-sand">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs font-medium text-wine bg-wine/5 hover:bg-wine/10 px-3 py-1.5 rounded-full transition-colors capitalize"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <ShareButtons title={article.title} />
          </div>
        </div>

        {/* Author card */}
        {article.authorV2 && (
          <div className="mt-8 bg-warm-white rounded-xl p-6 sm:p-8 border border-sand flex items-start gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wine to-wine-dark flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {authorInitials}
            </div>
            <div>
              <p className="font-semibold text-charcoal text-base mb-1">
                {article.authorV2.name}
              </p>
              {article.authorV2.bio && (
                <p className="text-grey text-sm leading-relaxed">
                  {article.authorV2.bio}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related articles */}
      {relatedFinal.length > 0 && (
        <div className="bg-warm-white border-t border-sand">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-label text-wine mb-2 tracking-[0.15em]">Meer Lezen</p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                  Gerelateerde Verhalen
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-1.5 text-wine font-medium text-sm hover:gap-2.5 transition-all"
              >
                Alle verhalen <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFinal.map((a) => (
                <RelatedCard key={a.handle} article={a} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-8 border-t border-sand">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Alle verhalen
          </Link>
          <Link
            href="/wijnen"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            Bekijk onze wijnen &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
