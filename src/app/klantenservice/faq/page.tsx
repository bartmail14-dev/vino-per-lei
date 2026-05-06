import type { Metadata } from "next";
import { getFAQItems, getUiCopy } from "@/lib/shopify-cms";
import { formatUiCopy } from "@/lib/ui-copy";
import { FAQContent } from "./FAQContent";

export const revalidate = 3600; // 1 hour — static CMS content

export async function generateMetadata(): Promise<Metadata> {
  const uiCopy = await getUiCopy();
  const title = formatUiCopy(uiCopy, "faq.meta.title");
  const description = formatUiCopy(uiCopy, "faq.meta.description");

  return {
    title,
    description,
    alternates: {
      canonical: "https://vinoperlei.nl/klantenservice/faq",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "nl_NL",
      siteName: formatUiCopy(uiCopy, "site.name"),
    },
  };
}

export default async function FAQPage() {
  const [faqItems, uiCopy] = await Promise.all([getFAQItems(), getUiCopy()]);

  // Group by category, deduplicating by question text
  // FAQ content is managed directly in Shopify CMS — no code-level filtering needed
  const categoryMap = new Map<string, { question: string; answer: string }[]>();
  const seenQuestions = new Set<string>();
  for (const item of faqItems) {
    const key = `${item.category}::${item.question}`;
    if (seenQuestions.has(key)) continue;
    seenQuestions.add(key);
    const existing = categoryMap.get(item.category) ?? [];
    existing.push({ question: item.question, answer: item.answer });
    categoryMap.set(item.category, existing);
  }

  const faqCategories = Array.from(categoryMap.entries()).map(
    ([title, items]) => ({ title, items })
  );

  // JSON-LD: FAQPage schema
  const allItems = faqCategories.flatMap((cat) => cat.items);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // JSON-LD: BreadcrumbList schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: formatUiCopy(uiCopy, "collection.breadcrumb.home"),
        item: "https://vinoperlei.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: formatUiCopy(uiCopy, "faq.breadcrumb.service"),
        item: "https://vinoperlei.nl/klantenservice",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: formatUiCopy(uiCopy, "faq.title"),
        item: "https://vinoperlei.nl/klantenservice/faq",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FAQContent faqCategories={faqCategories} />
    </>
  );
}
