"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useMotionValue } from "framer-motion";
import { Clock, ArrowRight, Wine, Mail } from "lucide-react";
import type { BlogArticle } from "@/lib/shopify-cms";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { getTagLabel } from "@/lib/tag-utils";

/* ════════════════════════════════════════════
   Icons — Lucide re-exports with original names
   ════════════════════════════════════════════ */

export const ClockIcon = Clock;
export const ArrowIcon = ArrowRight;
export const WineGlassIcon = Wine;
const MailIcon = Mail;

// Decorative grape cluster (custom — used as background pattern with opacity)
export function GrapeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity="0.06" aria-hidden="true">
      <circle cx="12" cy="8" r="2.5" />
      <circle cx="9" cy="12" r="2.5" />
      <circle cx="15" cy="12" r="2.5" />
      <circle cx="7.5" cy="16" r="2.5" />
      <circle cx="12" cy="16" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
      <circle cx="10" cy="20" r="2.5" />
      <circle cx="14" cy="20" r="2.5" />
      <path d="M12 2v4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" />
      <path d="M12 2c2 0 4 1 4 3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" />
    </svg>
  );
}


/* ════════════════════════════════════════════
   Format date helper
   ════════════════════════════════════════════ */

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ════════════════════════════════════════════
   Featured Hero with Parallax — Cinematic Editorial
   ════════════════════════════════════════════ */

export function FeaturedHero({ article }: { article: BlogArticle }) {
  const ref = useRef<HTMLDivElement>(null);

  // Manual scroll-based parallax — avoids Framer Motion useScroll({ target })
  // which crashes during hydration ("Target ref is defined but no element was found")
  const imageY = useMotionValue("0%");
  const overlayOpacity = useMotionValue(0.35);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const h = rect.height || 1;
      // progress: 0 when element top = viewport top, 1 when element bottom = viewport top
      const progress = Math.max(0, Math.min(1, -rect.top / h));
      imageY.set(`${progress * 20}%`);
      overlayOpacity.set(0.35 + Math.min(progress / 0.5, 1) * 0.4);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [imageY, overlayOpacity]);
  const category = getTagLabel(article.tags[0] || "Wijn");
  const hasImage = !!article.image;

  if (hasImage) {
    return (
      <Link href={`/blog/${article.handle}`} className="group block">
        <article
          ref={ref}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
        >
          {/* Parallax background image */}
          <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[10%] -bottom-[10%]">
            <Image
              src={article.image!.url}
              alt={article.image!.altText || article.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-[1.8s] ease-out"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </motion.div>

          {/* Multi-layer cinematic gradient overlays */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-[#0a0c1a] via-[#0a0c1a]/60 to-transparent"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c1a]/50 via-[#0a0c1a]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c1a]/20 via-transparent to-transparent" />

          {/* Film grain overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-grain" />

          {/* Subtle vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_60px_rgba(0,0,0,0.2)]" />

          {/* Gold accent lines — top + left edges */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="absolute top-0 left-0 w-[1px] h-24 bg-gradient-to-b from-gold/25 to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
            {/* Overline label — editorial style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-3 mb-5 sm:mb-7"
            >
              <span className="text-label text-gold tracking-[0.25em]">
                Uitgelicht
              </span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-gold/40 to-transparent" />
              <span className="text-label text-gold/50 tracking-[0.2em]">
                {category}
              </span>
            </motion.div>

            {/* Title — large editorial serif */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-serif text-3xl sm:text-[2.75rem] lg:text-[3.75rem] font-semibold text-white mb-4 sm:mb-6 leading-[1.05] max-w-3xl tracking-[-0.015em] group-hover:text-gold/90 transition-colors duration-700"
            >
              {article.title}
            </motion.h2>

            {/* Excerpt — understated, elegant */}
            {article.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="text-white/45 text-sm sm:text-base lg:text-[1.125rem] mb-8 line-clamp-2 max-w-2xl leading-relaxed font-light tracking-wide"
              >
                {article.excerpt}
              </motion.p>
            )}

            {/* Author + date + circular CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-wrap items-center gap-5 sm:gap-7 pt-6 border-t border-white/[0.06]"
            >
              {article.authorV2 && (
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 backdrop-blur-sm flex items-center justify-center text-gold text-[10px] sm:text-xs font-bold border border-gold/15 ring-1 ring-gold/[0.08] ring-offset-2 ring-offset-transparent">
                    {article.authorV2.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white/80 text-sm font-medium tracking-wide">{article.authorV2.name}</span>
                    <time dateTime={article.publishedAt} className="text-white/25 text-[11px] tracking-wide">{formatDate(article.publishedAt)}</time>
                  </div>
                </div>
              )}

              <span className="text-white/20 text-[11px] flex items-center gap-1.5 tracking-wide">
                <ClockIcon className="w-3 h-3" />
                {article.readingTimeMinutes} min leestijd
              </span>

              {/* Circular CTA button */}
              <div className="hidden sm:flex items-center gap-4 ml-auto">
                <span className="text-gold/50 text-[13px] font-medium group-hover:text-gold transition-colors duration-500 tracking-[0.08em] uppercase">
                  Lees het verhaal
                </span>
                <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/40 group-hover:scale-105 transition-all duration-500">
                  <ArrowIcon className="w-4 h-4 text-gold/50 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </article>
      </Link>
    );
  }

  /* No-image featured: animated abstract wine pattern with grain + floating shapes */
  return (
    <Link href={`/blog/${article.handle}`} className="group block">
      <article ref={ref} className="bg-gradient-to-br from-wine via-wine-dark to-[#0d0f1f] rounded-2xl sm:rounded-3xl overflow-hidden relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] flex items-end">
        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-grain" />

        {/* Animated gradient mesh — multiple overlapping radials that shift on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,162,39,0.12),transparent_50%)] group-hover:bg-[radial-gradient(ellipse_at_60%_30%,rgba(201,162,39,0.18),transparent_50%)] transition-all duration-[2s]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_80%,rgba(201,162,39,0.06),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(45,52,84,0.6),transparent_50%)]" />

        {/* Animated floating circles — abstract grape/bubble motif */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] right-[12%] w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-gold/[0.06] bg-gradient-to-br from-gold/[0.03] to-transparent"
          />
          <motion.div
            animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[35%] right-[25%] w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-white/[0.04] bg-gradient-to-br from-white/[0.02] to-transparent"
          />
          <motion.div
            animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[10%] right-[40%] w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-gold/[0.04] bg-gradient-to-br from-gold/[0.02] to-transparent"
          />
          {/* Small accent dots */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[22%] right-[20%] w-2 h-2 rounded-full bg-gold/20"
          />
          <motion.div
            animate={{ opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-[45%] right-[35%] w-1.5 h-1.5 rounded-full bg-gold/15"
          />
        </div>

        {/* Diagonal gold accent line */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[1px] h-[140%] bg-gradient-to-b from-gold/20 via-gold/[0.06] to-transparent origin-top-right rotate-[-35deg] translate-x-[60px]" />
        </div>

        {/* Gold accent lines — edges */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-[1px] bg-gradient-to-l from-gold/15 to-transparent" />
        <div className="absolute top-0 left-0 w-[1px] h-1/3 bg-gradient-to-b from-gold/25 to-transparent" />

        {/* Subtle vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_120px_40px_rgba(0,0,0,0.15)]" />

        <div className="px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 max-w-3xl relative z-10 w-full">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3 mb-7"
          >
            <span className="text-label text-gold tracking-[0.25em]">Uitgelicht</span>
            <div className="h-[1px] w-16 bg-gradient-to-r from-gold/40 to-transparent" />
            <span className="text-label text-gold/50 tracking-[0.2em]">{category}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-3xl sm:text-[2.75rem] lg:text-[3.75rem] font-semibold text-white mb-5 leading-[1.05] tracking-[-0.015em] group-hover:text-gold/90 transition-colors duration-700"
          >
            {article.title}
          </motion.h2>

          {article.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-white/40 text-base sm:text-lg leading-relaxed mb-9 max-w-2xl font-light tracking-wide"
            >
              {article.excerpt}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/[0.06]"
          >
            {article.authorV2 && (
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 backdrop-blur-sm flex items-center justify-center text-gold text-[10px] sm:text-xs font-bold border border-gold/15 ring-1 ring-gold/[0.08] ring-offset-2 ring-offset-transparent">
                  {article.authorV2.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-white/80 text-sm font-medium tracking-wide">{article.authorV2.name}</span>
                  <time dateTime={article.publishedAt} className="text-white/25 text-[11px] tracking-wide">{formatDate(article.publishedAt)}</time>
                </div>
              </div>
            )}
            <span className="text-white/20 text-[11px] flex items-center gap-1.5 tracking-wide">
              <ClockIcon className="w-3 h-3" />
              {article.readingTimeMinutes} min leestijd
            </span>
            {/* Circular CTA */}
            <div className="hidden sm:flex items-center gap-4 ml-auto">
              <span className="text-gold/50 text-[13px] font-medium group-hover:text-gold transition-colors duration-500 tracking-[0.08em] uppercase">
                Lees het verhaal
              </span>
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/40 group-hover:scale-105 transition-all duration-500">
                <ArrowIcon className="w-4 h-4 text-gold/50 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </Link>
  );
}

/* ════════════════════════════════════════════
   Article Card — Premium Editorial with Hover Reveal CTA
   ════════════════════════════════════════════ */

export function ArticleCard({
  article,
  size = "default",
}: {
  article: BlogArticle;
  size?: "large" | "default" | "horizontal";
}) {
  const category = getTagLabel(article.tags[0] || "Wijn");
  const hasImage = !!article.image;

  const isLarge = size === "large";
  const isHorizontal = size === "horizontal";

  return (
    <Link href={`/blog/${article.handle}`} className="group block h-full">
      <article
        className={`rounded-lg sm:rounded-2xl overflow-hidden h-full flex transition-all duration-500 ${
          isHorizontal ? "flex-row" : "flex-col"
        } ${
          isLarge
            ? "bg-gradient-to-br from-wine via-wine-dark to-[#0d0f1f] text-white shadow-2xl shadow-wine/10 hover:shadow-[0_24px_64px_-12px_rgba(26,31,61,0.25)]"
            : "bg-white border border-sand/40 hover:border-gold/30 hover:shadow-[0_20px_60px_-12px_rgba(26,31,61,0.12)] hover:-translate-y-2"
        }`}
      >
        {/* Image — 3:2 ratio default, with gradient overlay reveal + zoom */}
        {hasImage && (
          <div
            className={`relative overflow-hidden flex-shrink-0 ${
              isHorizontal
                ? "w-2/5 min-h-[200px]"
                : isLarge
                ? "aspect-[16/10] sm:aspect-[2/1]"
                : "aspect-[3/2]"
            }`}
          >
            <Image
              src={article.image!.url}
              alt={article.image!.altText || article.title}
              fill
              className="object-cover group-hover:scale-[1.08] transition-transform duration-[1.8s] ease-out"
              sizes={
                isLarge
                  ? "(max-width: 640px) 100vw, 66vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
            />
            {/* Gradient overlays — deeper on hover */}
            <div className={`absolute inset-0 transition-opacity duration-700 ${
              isLarge
                ? "bg-gradient-to-t from-wine-dark/80 via-wine-dark/20 to-transparent"
                : "bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/50"
            }`} />

            {/* Hover: gold accent gradient reveal from bottom */}
            {!isLarge && (
              <div className="absolute inset-0 bg-gradient-to-t from-wine/60 via-wine/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            )}

            {/* Category pill — refined tracking, premium feel */}
            <div className="absolute top-4 left-4">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-500 ${
                isLarge
                  ? "text-gold bg-gold/10 border border-gold/20"
                  : "text-white/90 bg-black/25 border border-white/[0.08] group-hover:bg-wine/60 group-hover:border-gold/20 group-hover:text-white"
              }`}>
                {category}
              </span>
            </div>

            {/* Reading time — subtle corner badge */}
            <div className="absolute top-4 right-4">
              <span className="text-[10px] text-white/60 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 font-medium tracking-wider">
                <ClockIcon className="w-2.5 h-2.5" />
                {article.readingTimeMinutes} min
              </span>
            </div>

            {/* Hover slide-in CTA — slides up from bottom on non-large cards */}
            {!isLarge && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="bg-gradient-to-t from-wine/90 via-wine/70 to-transparent px-5 py-5 pt-10 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
                    Lees het verhaal
                  </span>
                  <div className="w-8 h-8 rounded-full border border-gold/25 bg-gold/10 flex items-center justify-center">
                    <ArrowIcon className="w-3.5 h-3.5 text-gold" />
                  </div>
                </div>
              </div>
            )}

            {/* Large card: title overlay on image */}
            {isLarge && (
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="font-serif text-xl sm:text-2xl lg:text-[1.875rem] font-semibold text-white leading-[1.12] group-hover:text-gold transition-colors duration-500 line-clamp-2 tracking-[-0.01em]">
                  {article.title}
                </h3>
              </div>
            )}
          </div>
        )}

        {/* No-image: animated gradient with floating shapes + shimmer accent */}
        {!hasImage && (
          <div
            className={`bg-gradient-to-br from-wine via-wine-dark to-[#1a0a1a] relative overflow-hidden flex-shrink-0 ${
              isHorizontal ? "w-2/5 min-h-[200px]" : isLarge ? "aspect-[16/10]" : "aspect-[3/2]"
            }`}
          >
            {/* Grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.06] bg-grain" />
            {/* Radial glow — shifts on hover */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(201,162,39,0.1),transparent_60%)] group-hover:bg-[radial-gradient(ellipse_at_40%_40%,rgba(201,162,39,0.16),transparent_55%)] transition-all duration-[1.5s]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(45,52,84,0.4),transparent_50%)]" />

            {/* Floating decorative circles */}
            <div className="absolute top-[15%] right-[10%] w-16 h-16 rounded-full border border-gold/[0.06] group-hover:border-gold/[0.12] group-hover:scale-110 transition-all duration-[1.2s]" />
            <div className="absolute bottom-[20%] left-[15%] w-10 h-10 rounded-full border border-white/[0.04] group-hover:border-white/[0.08] group-hover:scale-125 transition-all duration-[1.5s]" />
            <div className="absolute top-[40%] right-[30%] w-6 h-6 rounded-full bg-gold/[0.04] group-hover:bg-gold/[0.08] transition-all duration-[1s]" />

            {/* Shimmer accent line — CSS animated */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-gold/[0.04] to-transparent animate-[shine_3s_ease-in-out_infinite]" />
            </div>

            {/* Category as large watermark text */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-5xl font-bold text-white/[0.03] group-hover:text-white/[0.05] uppercase tracking-[0.15em] whitespace-nowrap select-none pointer-events-none transition-all duration-700">
              {category}
            </span>
            {/* Category badge */}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/90 bg-gold/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold/20 group-hover:bg-gold/15 group-hover:border-gold/30 transition-all duration-500">
                <WineGlassIcon className="w-3 h-3 text-gold/50" />
                {category}
              </span>
            </div>

            {/* Gold accent line — bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent group-hover:via-gold/25 transition-all duration-700" />
          </div>
        )}

        {/* Content area */}
        <div className={`flex flex-col flex-1 ${
          isLarge
            ? "p-6 sm:p-8 bg-gradient-to-b from-wine-dark to-[#0d0f1f]"
            : "p-5 sm:p-6"
        }`}>
          {/* No-image: reading time hint */}
          {!hasImage && !isLarge && (
            <div className="flex items-center gap-2 mb-3 text-[11px] text-grey/60 tracking-wide">
              <ClockIcon className="w-3 h-3" />
              <span>{article.readingTimeMinutes} min leestijd</span>
            </div>
          )}

          {/* Title — skip for large cards with image (shown on image overlay) */}
          {!(isLarge && hasImage) && (
            <h3
              className={`font-serif font-semibold leading-[1.15] line-clamp-2 mb-3 transition-colors duration-300 ${
                isLarge
                  ? "text-xl sm:text-2xl text-white group-hover:text-gold"
                  : "text-[1.125rem] sm:text-lg text-charcoal group-hover:text-wine tracking-[-0.01em]"
              }`}
            >
              {article.title}
            </h3>
          )}

          {article.excerpt && (
            <p
              className={`leading-relaxed mb-4 flex-1 ${
                isLarge
                  ? "text-sm sm:text-base text-white/35 line-clamp-2 font-light tracking-wide"
                  : "text-[13px] sm:text-sm text-grey/70 line-clamp-2 leading-[1.65]"
              }`}
            >
              {article.excerpt}
            </p>
          )}

          {/* Footer — refined metadata bar with gold accent on hover */}
          <div className={`flex items-center gap-3 mt-auto pt-4 text-[11px] ${
            isLarge
              ? "border-t border-white/[0.06] text-white/25"
              : "border-t border-sand/30 text-grey/70"
          }`}>
            {article.authorV2 && (
              <>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                  isLarge
                    ? "bg-gold/15 text-gold border border-gold/15"
                    : "bg-gradient-to-br from-wine to-wine-dark text-white"
                }`}>
                  {article.authorV2.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <span className={`font-medium truncate tracking-wide ${isLarge ? "text-white/45" : "text-charcoal/80"}`}>
                  {article.authorV2.name}
                </span>
                <span className={`w-[3px] h-[3px] rounded-full flex-shrink-0 ${isLarge ? "bg-white/15" : "bg-sand"}`} />
              </>
            )}
            <time dateTime={article.publishedAt} className="truncate tracking-wide">{formatDate(article.publishedAt)}</time>

            {/* Arrow indicator — appears on hover */}
            <span className={`flex items-center gap-1 ml-auto font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 flex-shrink-0 tracking-[0.08em] uppercase ${
              isLarge ? "text-gold" : "text-wine"
            }`}>
              Lees <ArrowIcon className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ════════════════════════════════════════════
   Inline Newsletter CTA — Grain Texture, Gold Accents
   ════════════════════════════════════════════ */

export function InlineNewsletterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="col-span-full"
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d0f1f] via-wine-dark to-wine">
        {/* Grain texture — prominent for tactile feel */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-grain" />

        {/* Ambient glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,162,39,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(201,162,39,0.05),transparent_40%)]" />

        {/* Gold accent lines — top and bottom */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />

        {/* Vertical gold accent on left edge */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />

        {/* Decorative grape cluster */}
        <div className="absolute -bottom-6 -right-6 w-44 h-44 opacity-[0.03]">
          <GrapeIcon className="w-full h-full text-gold" />
        </div>

        <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 lg:px-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          {/* Left: editorial copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3.5 mb-6">
              <div className="w-9 h-9 rounded-full bg-gold/[0.08] border border-gold/15 flex items-center justify-center">
                <MailIcon className="w-4 h-4 text-gold/50" />
              </div>
              <div className="h-[1px] w-10 bg-gradient-to-r from-gold/25 to-transparent" />
              <span className="text-[10px] font-semibold uppercase text-gold/40 tracking-[0.25em]">
                Newsletter
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-[1.875rem] lg:text-[2rem] font-semibold text-white mb-3.5 leading-[1.08] tracking-[-0.015em]">
              Mis geen enkel verhaal
            </h3>
            <p className="text-white/30 text-[13px] sm:text-sm max-w-md leading-relaxed font-light tracking-wide">
              Wijnverhalen, tips en exclusieve aanbiedingen. Maximaal 2x per maand, altijd opzegbaar.
            </p>
          </div>

          {/* Right: form */}
          <div className="w-full lg:w-auto lg:min-w-[400px]">
            <NewsletterForm variant="dark" layout="inline" socialProof />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   Load More Button — Decorative Divider + Tracking-Wide
   ════════════════════════════════════════════ */

export function LoadMoreButton({
  allArticles,
  visibleCount,
  onLoadMore,
}: {
  allArticles: number;
  visibleCount: number;
  onLoadMore: () => void;
}) {
  if (visibleCount >= allArticles) return null;

  return (
    <div className="col-span-full flex flex-col items-center pt-8 sm:pt-12 gap-6">
      {/* Decorative divider — gold line + wine glass + gold line */}
      <div className="flex items-center gap-5 w-full max-w-sm">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-sand to-gold/15" />
        <div className="w-7 h-7 rounded-full border border-sand/60 flex items-center justify-center">
          <WineGlassIcon className="w-3 h-3 text-grey/20" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-sand to-gold/15" />
      </div>

      <button
        onClick={onLoadMore}
        aria-label={`Meer verhalen laden, ${allArticles - visibleCount} resterend`}
        className="group relative px-9 py-3.5 min-h-[44px] rounded-full text-[13px] font-semibold transition-all duration-500 flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 bg-white border border-wine/10 text-wine tracking-[0.08em] uppercase hover:bg-wine hover:text-white hover:border-wine hover:shadow-xl hover:shadow-wine/10"
      >
        <span>Meer verhalen</span>
        <span className="text-[10px] text-grey/50 group-hover:text-white/40 transition-colors tabular-nums tracking-normal font-normal normal-case">
          {allArticles - visibleCount} resterend
        </span>
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   Article Grid with Bento Layout + Load More
   ════════════════════════════════════════════ */

export function ArticleGrid({
  articles,
  initialCount = 6,
}: {
  articles: BlogArticle[];
  initialCount?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const hasMore = visibleCount < articles.length;
  const visible = articles.slice(0, visibleCount);

  // Bento layout: varied card sizes for visual rhythm, newsletter after 3rd article
  const gridItems: Array<{ type: "article"; article: BlogArticle; size: "large" | "default" | "horizontal" } | { type: "newsletter" }> = [];

  visible.forEach((article, i) => {
    if (i === 0 && visible.length >= 3) {
      // First card: large, spanning 2 cols — hero entry point
      gridItems.push({ type: "article", article, size: "large" });
    } else if (i === 4 && visible.length > 5) {
      // 5th card: horizontal full-width — breaks the grid rhythm
      gridItems.push({ type: "article", article, size: "horizontal" });
    } else if (i === 7 && visible.length > 8) {
      // 8th card: another large card for second batch visual anchor
      gridItems.push({ type: "article", article, size: "large" });
    } else if (i === 11 && visible.length > 12) {
      // 12th card: horizontal for third batch
      gridItems.push({ type: "article", article, size: "horizontal" });
    } else {
      gridItems.push({ type: "article", article, size: "default" });
    }

    // Insert newsletter CTA after 3rd article
    if (i === 2) {
      gridItems.push({ type: "newsletter" });
    }
  });

  return (
    <div className="relative">
      {/* Closure: gradient fade hints at continuation when more articles exist */}
      {hasMore && (
        <div className="absolute bottom-16 sm:bottom-20 inset-x-0 h-20 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-10" aria-hidden="true" />
      )}
    <div className="grid gap-6 sm:gap-7 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {gridItems.map((item, i) => {
        if (item.type === "newsletter") {
          return <InlineNewsletterCTA key="newsletter" />;
        }

        const isLarge = item.size === "large";
        const isHorizontal = item.size === "horizontal";

        return (
          <motion.div
            key={item.article.handle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.5,
              delay: (i % 3) * 0.08,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={
              isLarge
                ? "sm:col-span-2"
                : isHorizontal
                ? "sm:col-span-2 lg:col-span-3"
                : ""
            }
          >
            <ArticleCard article={item.article} size={item.size} />
          </motion.div>
        );
      })}

      <LoadMoreButton
        allArticles={articles.length}
        visibleCount={visibleCount}
        onLoadMore={() => setVisibleCount((c) => c + 6)}
      />
    </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Loading Skeleton — Mirrors Actual Layout
   ════════════════════════════════════════════ */

export function BlogSkeleton() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero skeleton — matches dark bg header */}
      <div className="bg-dark-bg py-16 sm:py-20 lg:py-28 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(201,162,39,0.04),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full skeleton opacity-20" />
            <div className="h-[1px] w-8 bg-white/10" />
            <div className="h-3 w-16 skeleton opacity-20 rounded-full" />
          </div>
          <div className="h-14 w-72 skeleton opacity-20 rounded-lg mb-5" />
          <div className="h-5 w-80 skeleton opacity-12 rounded-lg mb-10" />
          <div className="flex items-center gap-4">
            <div className="h-3 w-20 skeleton opacity-15 rounded-full" />
            <div className="h-[1px] w-16 bg-white/10" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 -mt-10">
        {/* Featured skeleton — cinematic ratio with content overlay */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden mb-14 relative">
          <div className="skeleton aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c1a]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-20 bg-white/10 rounded-full" />
                <div className="h-[1px] w-14 bg-white/10" />
                <div className="h-3 w-16 bg-white/8 rounded-full" />
              </div>
              <div className="h-12 sm:h-14 w-4/5 bg-white/10 rounded-lg mb-5" />
              <div className="h-5 w-3/5 bg-white/[0.06] rounded-lg mb-8" />
              <div className="flex items-center gap-5 pt-6 border-t border-white/[0.06]">
                <div className="w-11 h-11 rounded-full bg-white/10" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-2.5 w-32 bg-white/[0.06] rounded" />
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <div className="h-3 w-20 bg-white/[0.06] rounded" />
                  <div className="w-12 h-12 rounded-full bg-white/[0.06]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative divider skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-sand/30" />
          <div className="w-4 h-4 skeleton rounded-full opacity-20" />
          <div className="h-[1px] flex-1 bg-sand/30" />
        </div>

        {/* Category filter skeleton */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-3 w-24 skeleton rounded-full opacity-30" />
          <div className="h-[1px] flex-1 bg-sand/30" />
        </div>
        <div className="flex gap-2.5 mb-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`filter-${i}`} className="h-10 skeleton rounded-full opacity-25" style={{ width: `${60 + i * 14}px` }} />
          ))}
        </div>

        {/* Grid skeletons — matching card design with 3:2 ratios */}
        <div className="grid gap-6 sm:gap-7 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`rounded-lg sm:rounded-2xl overflow-hidden bg-white border border-sand/20 ${i === 0 ? "sm:col-span-2" : ""}`}>
              <div className={`skeleton ${i === 0 ? "aspect-[2/1]" : "aspect-[3/2]"} relative`}>
                {/* Category pill skeleton */}
                <div className="absolute top-4 left-4 h-6 w-16 bg-white/10 rounded-full" />
                <div className="absolute top-4 right-4 h-5 w-14 bg-white/10 rounded-full" />
              </div>
              <div className="p-5 sm:p-6 space-y-3">
                <div className="h-5 skeleton rounded w-4/5" />
                <div className="h-4 skeleton rounded w-full opacity-50" />
                <div className="h-4 skeleton rounded w-2/3 opacity-30" />
                <div className="flex items-center gap-3 pt-4 border-t border-sand/20">
                  <div className="w-6 h-6 skeleton rounded-full" />
                  <div className="h-3 skeleton rounded w-20" />
                  <div className="w-[3px] h-[3px] rounded-full bg-sand" />
                  <div className="h-3 skeleton rounded w-28 opacity-50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Empty State — Wine-Themed, Beautiful
   ════════════════════════════════════════════ */

export function EmptyState({ message, activeTag }: { message?: string; activeTag?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-28 sm:py-36"
    >
      {/* Wine glass icon — layered circle with gold ring */}
      <div className="relative w-28 h-28 mx-auto mb-10">
        {/* Outer glow */}
        <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-gold/[0.06] to-transparent blur-xl" />
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sand/50 to-cream" />
        {/* Inner circle */}
        <div className="absolute inset-[3px] rounded-full bg-cream" />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-wine/15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 2h8l-1 9a5 5 0 0 1-10 0L8 2z" />
            <rect x="11" y="11" width="2" height="8" rx="1" />
            <rect x="8" y="19" width="8" height="2" rx="1" />
          </svg>
        </div>
        {/* Gold ring border */}
        <div className="absolute inset-0 rounded-full border border-gold/15" />
        {/* Subtle decorative dot at top */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold/20" />
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-3.5 tracking-[-0.015em]">
        {activeTag ? "Geen artikelen gevonden" : "Binnenkort meer verhalen"}
      </h3>

      <p className="text-grey text-sm sm:text-[15px] max-w-md mx-auto leading-relaxed mb-9 font-light tracking-wide">
        {message ||
          (activeTag
            ? `Er zijn nog geen verhalen voor "${activeTag}". Probeer een andere categorie.`
            : "We werken aan mooie verhalen over Italiaanse wijnen. Kom snel terug!")}
      </p>

      {activeTag && (
        <Link
          href="/blog"
          className="inline-flex items-center gap-2.5 text-wine text-[13px] font-semibold uppercase tracking-[0.08em] hover:gap-3 transition-all duration-300 group px-6 py-3 rounded-full border border-wine/15 hover:bg-wine hover:text-white"
        >
          Bekijk alle verhalen
          <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}

      {!activeTag && (
        <div className="flex items-center justify-center gap-5 mt-6">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold/20" />
          <span className="text-tagline text-grey/35 text-sm tracking-wide">In vino veritas</span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold/20" />
        </div>
      )}
    </motion.div>
  );
}
