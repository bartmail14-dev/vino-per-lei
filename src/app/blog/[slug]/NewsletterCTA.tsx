"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { useUiCopy } from "@/components/providers";

export function NewsletterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const t = useUiCopy();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 mb-4 print:hidden"
    >
      <div className="bg-warm-white/60 rounded-2xl px-6 sm:px-10 py-10 sm:py-12">
        <div className="max-w-md mx-auto text-center">
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-2.5 leading-tight">
            {t("blog.article.newsletter.title")}
          </h3>
          <p className="text-grey text-sm leading-relaxed mb-7 max-w-xs mx-auto">
            {t("blog.article.newsletter.body")}
          </p>

          <NewsletterForm variant="light" layout="stacked" socialProof />
        </div>
      </div>
    </motion.div>
  );
}
