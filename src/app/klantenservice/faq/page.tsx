import type { Metadata } from "next";
import Link from "next/link";
import { FAQAccordion } from "./FAQAccordion";
import { getFAQItems } from "@/lib/shopify-cms";

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

  return (
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-gold mb-3">Klantenservice</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Veelgestelde Vragen
          </h1>
          <p className="text-grey">
            Vind snel antwoord op je vraag. Staat je vraag er niet bij?{" "}
            <Link
              href="/contact"
              className="text-wine underline hover:text-wine-dark"
            >
              Neem contact op
            </Link>
            .
          </p>
        </div>

        {/* FAQ Categories */}
        {faqCategories.length > 0 ? (
          <div className="space-y-10">
            {faqCategories.map((category) => (
              <section key={category.title}>
                <h2 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                  {category.title}
                </h2>
                <div className="bg-white rounded-lg border border-sand overflow-hidden">
                  <div className="px-6">
                    {category.items.map((item) => (
                      <FAQAccordion
                        key={item.question}
                        question={item.question}
                        answer={item.answer}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="bg-warm-white rounded-lg p-8 text-center border border-sand">
            <p className="text-grey">Inhoud wordt binnenkort toegevoegd.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-warm-white rounded-lg p-8 text-center border border-sand">
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">
            Vraag niet gevonden?
          </h2>
          <p className="text-grey mb-6">
            Ons team staat voor je klaar om je te helpen.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors"
          >
            Neem Contact Op
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-sand">
          <Link
            href="/klantenservice"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar Klantenservice
          </Link>
        </div>
      </div>
    </div>
  );
}
