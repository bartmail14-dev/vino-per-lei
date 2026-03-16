"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

interface ArticleHeroProps {
  title: string;
  tags: string[];
  authorName: string;
  authorInitials: string;
  publishedAt: string;
  readingTimeMinutes: number;
  image: { url: string; altText: string | null } | null;
  excerpt: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleHero({
  title,
  tags,
  authorName,
  authorInitials,
  publishedAt,
  readingTimeMinutes,
  image,
  excerpt,
}: ArticleHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Reduced parallax — subtle, not distracting
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.5, 0.75]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-4%"]);

  const category = tags[0] || "Wijn";

  return (
    <header ref={heroRef} className="relative min-h-[50vh] sm:min-h-[65vh] lg:min-h-[75vh] flex items-end overflow-hidden">
      {/* Background image with subtle parallax or gradient fallback */}
      {image ? (
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 -top-[5%] -bottom-[5%] will-change-transform"
        >
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-wine via-wine-dark to-[#0d0f1f]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,162,39,0.06),transparent_60%)]" />
        </div>
      )}

      {/* Single clean gradient overlay for readability */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"
      />

      {/* Content — clean editorial hierarchy */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 pb-10 sm:pb-14 lg:pb-16"
      >
        {/* Back link */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-label="Terug naar blog"
          className="mb-10 sm:mb-14"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md min-h-[44px]"
          >
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Alle verhalen
          </Link>
        </motion.nav>

        {/* Category — text only, no badge/pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 sm:mb-5"
        >
          <Link
            href={`/blog?tag=${encodeURIComponent(category)}`}
            className="text-label text-gold/80 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
          >
            {category}
          </Link>
        </motion.div>

        {/* Title — large serif, clean */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 max-w-2xl"
        >
          {title}
        </motion.h1>

        {/* Compact meta line: author + date + reading time on one line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/45"
        >
          <span className="text-white/60 font-medium">{authorName}</span>

          <span className="w-0.5 h-0.5 rounded-full bg-white/30" aria-hidden="true" />

          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>

          <span className="w-0.5 h-0.5 rounded-full bg-white/30" aria-hidden="true" />

          <span aria-label={`${readingTimeMinutes} minuten leestijd`}>
            {readingTimeMinutes} min leestijd
          </span>
        </motion.div>
      </motion.div>
    </header>
  );
}
