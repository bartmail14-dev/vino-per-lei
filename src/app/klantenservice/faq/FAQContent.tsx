"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { FAQAccordion } from "./FAQAccordion";
import { Search as SearchIcon, ShoppingCart, CreditCard, Truck, RotateCcw, HelpCircle } from "lucide-react";

interface FAQCategory {
  title: string;
  items: { question: string; answer: string }[];
}

// Category icons/colors mapping
const categoryStyles: Record<string, { color: string; icon: React.ReactNode }> = {
  Bestellen: {
    color: "bg-blue-500/10 text-blue-600",
    icon: <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />,
  },
  Betalen: {
    color: "bg-emerald-500/10 text-emerald-600",
    icon: <CreditCard className="w-5 h-5" strokeWidth={1.5} />,
  },
  Verzending: {
    color: "bg-purple-500/10 text-purple-600",
    icon: <Truck className="w-5 h-5" strokeWidth={1.5} />,
  },
  Retourneren: {
    color: "bg-amber-500/10 text-amber-600",
    icon: <RotateCcw className="w-5 h-5" strokeWidth={1.5} />,
  },
};

const defaultStyle = {
  color: "bg-wine/10 text-wine",
  icon: <HelpCircle className="w-5 h-5" strokeWidth={1.5} />,
};

export function FAQContent({ faqCategories }: { faqCategories: FAQCategory[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    let cats = faqCategories;

    // Filter by active category
    if (activeCategory) {
      cats = cats.filter((c) => c.title === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cats = cats
        .map((c) => ({
          ...c,
          items: c.items.filter(
            (item) =>
              item.question.toLowerCase().includes(q) ||
              item.answer.toLowerCase().includes(q)
          ),
        }))
        .filter((c) => c.items.length > 0);
    }

    return cats;
  }, [faqCategories, searchQuery, activeCategory]);

  const totalResults = filteredCategories.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.06),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-label text-gold/60 mb-4"
          >
            Klantenservice
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-[1.15]"
          >
            Veelgestelde Vragen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 max-w-lg mx-auto mb-8"
          >
            Vind snel antwoord op je vraag. Staat je vraag er niet bij?{" "}
            <Link href="/contact" className="text-gold hover:text-gold/80 underline">
              Neem contact op
            </Link>
            .
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto relative"
          >
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Zoek een vraag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-gold/50 focus:outline-none transition-all"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        {/* Category filter pills */}
        {faqCategories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? "bg-wine text-white"
                  : "bg-warm-white text-charcoal hover:bg-wine/10"
              }`}
            >
              Alle
            </button>
            {faqCategories.map((cat) => {
              const style = categoryStyles[cat.title] ?? defaultStyle;
              return (
                <button
                  key={cat.title}
                  onClick={() => setActiveCategory(activeCategory === cat.title ? null : cat.title)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.title
                      ? "bg-wine text-white"
                      : `${style.color} hover:opacity-80`
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Search results count */}
        {searchQuery.trim() && (
          <p className="text-sm text-grey mb-6">
            {totalResults} {totalResults === 1 ? "resultaat" : "resultaten"} gevonden
            {activeCategory && ` in "${activeCategory}"`}
          </p>
        )}

        {/* FAQ Categories */}
        {filteredCategories.length > 0 ? (
          <div className="space-y-10">
            {filteredCategories.map((category, catIndex) => {
              const style = categoryStyles[category.title] ?? defaultStyle;
              return (
                <AnimateOnScroll key={category.title} variant="fadeUp" delay={catIndex * 0.08}>
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-lg ${style.color} flex items-center justify-center`}>
                        {style.icon}
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
                        {category.title}
                      </h2>
                      <span className="text-xs text-grey bg-sand/50 px-2 py-0.5 rounded-full">
                        {category.items.length}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg border border-sand/50 overflow-hidden shadow-sm">
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
                </AnimateOnScroll>
              );
            })}
          </div>
        ) : (
          <div className="bg-warm-white rounded-lg p-8 text-center border border-sand/50">
            <SearchIcon className="w-10 h-10 text-grey/30 mx-auto mb-3" />
            <p className="text-charcoal font-semibold mb-1">Geen resultaten gevonden</p>
            <p className="text-grey text-sm">
              Probeer een andere zoekterm of{" "}
              <Link href="/contact" className="text-wine underline hover:text-wine-dark">
                neem contact op
              </Link>
              .
            </p>
          </div>
        )}

        {/* CTA */}
        <AnimateOnScroll variant="scaleIn">
          <div className="mt-16 relative bg-gradient-to-br from-wine to-wine-dark rounded-2xl p-8 sm:p-10 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[60px]" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/3 rounded-tr-[40px]" />
            <div className="relative">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white mb-3">
                Vraag niet gevonden?
              </h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">
                Ons team staat voor je klaar om je te helpen.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-8 bg-white text-wine text-button uppercase rounded hover:bg-white/90 transition-colors"
              >
                Neem Contact Op
              </Link>
            </div>
          </div>
        </AnimateOnScroll>

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
