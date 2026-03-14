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

/* ─── Related Article Card ─── */
function RelatedCard({ article }: { article: BlogArticle }) {
  const category = article.tags[0] || "Wijn";
  const hasImage = !!article.image;

  return (
    <Link href={`/blog/${article.handle}`} className="group block h-full">
      <article className="bg-white rounded-xl border border-sand/60 overflow-hidden hover:shadow-lg hover:shadow-wine/5 hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
        {hasImage ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={article.image!.url}
              alt={article.image!.altText || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {category}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-wine px-5 py-4 relative overflow-hidden">
            <div className="absolute inset-0">
              <GrapeIcon className="absolute -bottom-2 -right-2 w-20 h-20 text-white" />
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <WineGlassIcon className="w-3 h-3 text-gold/50" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold/90">
                {category}
              </span>
            </div>
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-base sm:text-lg font-semibold text-charcoal group-hover:text-wine transition-colors duration-300 line-clamp-2 leading-snug mb-3">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-grey mt-auto">
            <ClockIcon className="w-3 h-3" />
            <span>{article.readingTimeMinutes} min</span>
            <span className="w-0.5 h-0.5 rounded-full bg-grey/40" />
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1 ml-auto text-wine font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowIcon className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Article Page ─── */
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
  const authorInitials = authorName.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="bg-background min-h-screen">
      {/* ─── Hero ─── */}
      <div className="bg-dark-bg relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04]">
          <GrapeIcon className="w-full h-full text-gold" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 pb-14 sm:pt-14 sm:pb-20 relative">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 hover:gap-2.5 transition-all mb-10 sm:mb-12"
          >
            &larr; Alle verhalen
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-gold/80 bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/15 hover:bg-gold/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white mb-10 leading-[1.12]">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/15 to-wine-light/30 flex items-center justify-center text-gold text-sm font-bold border border-gold/15">
                {authorInitials}
              </div>
              <div>
                <span className="text-white/60 font-medium block">{authorName}</span>
              </div>
            </div>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min leestijd
            </span>
          </div>
        </div>
      </div>

      {/* ─── Featured Image ─── */}
      {article.image && (
        <div className="max-w-4xl mx-auto px-5 sm:px-8 -mt-4 sm:-mt-6 relative z-10 mb-10 sm:mb-14">
          <div className="aspect-[16/9] relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        </div>
      )}

      {/* ─── Article Content ─── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-24">
        <article
          className="prose prose-lg max-w-none text-charcoal/80
            prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-14 prose-h2:pt-8 prose-h2:border-t prose-h2:border-sand/50
            prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-10
            prose-p:leading-[1.85] prose-p:text-[16px] sm:prose-p:text-[17px] prose-p:text-charcoal/70 prose-p:mb-6
            prose-a:text-wine prose-a:underline prose-a:decoration-wine/30 hover:prose-a:decoration-wine prose-a:underline-offset-2
            prose-strong:text-charcoal prose-strong:font-semibold
            prose-li:text-charcoal/70 prose-ul:space-y-2 prose-ol:space-y-2
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-wine prose-blockquote:border-l-2 prose-blockquote:bg-warm-white prose-blockquote:rounded-r-lg prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-charcoal prose-blockquote:font-serif prose-blockquote:text-lg"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* ─── Share + Tags ─── */}
        <div className="mt-14 pt-8 border-t border-sand/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs font-medium text-wine bg-wine/5 hover:bg-wine/10 px-3.5 py-1.5 rounded-full transition-colors capitalize"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <ShareButtons title={article.title} />
          </div>
        </div>

        {/* ─── Author Card ─── */}
        {article.authorV2 && (
          <div className="mt-10 bg-warm-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-sand/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-wine via-gold/40 to-transparent" />
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wine to-wine-dark flex items-center justify-center text-white text-lg font-bold flex-shrink-0 ring-2 ring-wine/10 ring-offset-2 ring-offset-warm-white">
                {authorInitials}
              </div>
              <div>
                <p className="text-xs font-medium text-wine/50 uppercase tracking-wider mb-1">
                  Geschreven door
                </p>
                <p className="font-serif font-semibold text-charcoal text-lg mb-1.5">
                  {article.authorV2.name}
                </p>
                {article.authorV2.bio ? (
                  <p className="text-grey text-sm leading-relaxed">
                    {article.authorV2.bio}
                  </p>
                ) : (
                  <p className="text-grey text-sm leading-relaxed">
                    Schrijft over Italiaanse wijnen, wijnboeren en de verhalen achter elke fles.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Related Articles ─── */}
      {relatedFinal.length > 0 && (
        <div className="bg-warm-white border-t border-sand/50">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <WineGlassIcon className="w-3.5 h-3.5 text-wine/40" />
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-wine/60">
                    Meer Lezen
                  </p>
                  <div className="h-px w-6 bg-wine/15" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                  Gerelateerde Verhalen
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-1.5 text-wine font-medium text-sm hover:gap-2.5 transition-all"
              >
                Alle verhalen <ArrowIcon className="w-4 h-4" />
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

      {/* ─── Navigation ─── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 border-t border-sand/50">
        <div className="flex items-center justify-between">
          <Link href="/blog" className="text-sm text-wine hover:text-wine-dark transition-colors">
            &larr; Alle verhalen
          </Link>
          <Link href="/wijnen" className="text-sm text-wine hover:text-wine-dark transition-colors">
            Bekijk onze wijnen &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
