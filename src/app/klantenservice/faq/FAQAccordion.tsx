"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQAccordionProps {
  question: string;
  answer: string;
}

export function FAQAccordion({ question, answer }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-sand last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-start justify-between w-full py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-charcoal group-hover:text-wine transition-colors pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-grey flex-shrink-0 mt-0.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-grey leading-relaxed pb-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
