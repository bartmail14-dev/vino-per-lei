import type { Metadata } from "next";
import { getFAQItems } from "@/lib/shopify-cms";
import { FAQContent } from "./FAQContent";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Veelgestelde Vragen | Vino per Lei",
  description:
    "Antwoorden op veelgestelde vragen over bestellen, betalen, verzenden en retourneren bij Vino per Lei.",
  alternates: {
    canonical: "https://vinoperlei.nl/klantenservice/faq",
  },
  openGraph: {
    title: "Veelgestelde Vragen | Vino per Lei",
    description:
      "Antwoorden op veelgestelde vragen over bestellen, betalen, verzenden en retourneren bij Vino per Lei.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default async function FAQPage() {
  const faqItems = await getFAQItems();

  // Group by category
  const categoryMap = new Map<string, { question: string; answer: string }[]>();
  for (const item of faqItems) {
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
        name: "Home",
        item: "https://vinoperlei.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Klantenservice",
        item: "https://vinoperlei.nl/klantenservice",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Veelgestelde Vragen",
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
