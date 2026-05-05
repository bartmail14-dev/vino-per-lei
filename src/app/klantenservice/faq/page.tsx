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

  // Strip incorrect shipping claims and cadeau-related items from FAQ (CMS data)
  // Shipping policy: ALWAYS €7,95, Netherlands only, no free shipping threshold
  const cleanedFaqItems = faqItems
    .filter((item) => !item.question.toLowerCase().includes("cadeau"))
    .map((item) => ({
      ...item,
      answer: item.answer
        // Remove any "gratis verzending" claims
        .replace(/Bij bestellingen vanaf [€\u20AC]?\d+[\s,]*is verzending gratis\.?\s*/gi, "")
        .replace(/\s*\(?\s*gratis vanaf [€\u20AC]?\d+[.,]?\d*\s*\)?\.?\s*/gi, "")
        .replace(/gratis verzending[^.]*\.?\s*/gi, "")
        // Replace variable shipping costs with fixed €7,95
        .replace(/verzendkosten(?:\s+bedragen|\s+zijn)?\s+[€\u20AC]?\d+[.,]?\d*\s*/gi, "verzendkosten bedragen €7,95 ")
        .replace(/[€\u20AC]\s*\d+[.,]\d{2}\s*verzendkosten/gi, "€7,95 verzendkosten")
        // Replace any mention of international shipping / Belgium / Germany with NL-only
        .replace(/(?:we|wij)\s+leveren\s+(?:ook\s+)?(?:in|naar)\s+(?:Belgi[eë]|Duitsland|heel Europa|het buitenland)[^.]*\.?\s*/gi, "")
        .replace(/internationale?\s+(?:verzending|levering)[^.]*\.?\s*/gi, "")
        .replace(/\.\s*\./g, ".") // clean up double periods
        .replace(/\s{2,}/g, " ") // clean up double spaces
        .trim(),
    }));

  // Group by category, deduplicating by question text
  const categoryMap = new Map<string, { question: string; answer: string }[]>();
  const seenQuestions = new Set<string>();
  for (const item of cleanedFaqItems) {
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
