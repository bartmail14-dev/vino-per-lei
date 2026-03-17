"use client";

import { BlogFadeIn } from "./BlogAnimations";
import { WineGlassIcon, GrapeIcon } from "./BlogClientComponents";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export function BlogBottomNewsletter() {
  return (
    <BlogFadeIn>
      <div className="bg-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,162,39,0.06),transparent_60%)]" aria-hidden="true" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.03]" aria-hidden="true">
          <GrapeIcon className="w-full h-full text-gold" />
        </div>

        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-22 text-center relative">
          <div className="flex items-center justify-center gap-4 mb-7">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/20" />
            <WineGlassIcon className="w-4 h-4 text-gold/25" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/20" />
          </div>

          <h2 className="font-serif text-2xl sm:text-[1.875rem] font-semibold text-white mb-3.5 leading-[1.1] tracking-[-0.015em]">
            Mis geen enkel verhaal
          </h2>
          <p className="text-white/30 text-[13px] sm:text-sm mb-9 max-w-md mx-auto leading-relaxed font-light tracking-wide">
            Ontvang onze nieuwste wijnverhalen, tips en exclusieve aanbiedingen rechtstreeks in je inbox.
          </p>

          <NewsletterForm variant="dark" layout="stacked" className="max-w-md mx-auto" />
        </div>
      </div>
    </BlogFadeIn>
  );
}
