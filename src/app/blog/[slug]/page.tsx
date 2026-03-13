import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogArticleByHandle,
  getBlogArticles,
} from "@/lib/shopify-cms";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getBlogArticles(20);
  return articles.map((a) => ({ slug: a.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleByHandle(slug);

  if (!article) {
    return { title: "Artikel niet gevonden | Vino per Lei" };
  }

  return {
    title: `${article.title} | Vino per Lei`,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt,
      locale: "nl_NL",
      siteName: "Vino per Lei",
      ...(article.image && { images: [{ url: article.image.url }] }),
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getBlogArticleByHandle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-wine hover:text-wine-dark transition-colors mb-8"
        >
          &larr; Alle artikelen
        </Link>

        {/* Header */}
        <div className="mb-10">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
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
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            {article.title}
          </h1>
          <p className="text-grey text-sm">
            {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Featured image */}
        {article.image && (
          <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-10">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Article content */}
        <div
          className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-sand flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Alle artikelen
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
