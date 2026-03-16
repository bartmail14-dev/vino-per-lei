import type { Metadata } from "next";
import { getFAQItems } from "@/lib/shopify-cms";
import { FAQContent } from "./FAQContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Veelgestelde Vragen | Vino per Lei",
  description:
    "Antwoorden op veelgestelde vragen over bestellen, betalen, verzenden en retourneren bij Vino per Lei.",
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

  return <FAQContent faqCategories={faqCategories} />;
}
