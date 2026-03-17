"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

/**
 * ImageLightbox — fullscreen image viewer for article images
 * Listens to custom "open-lightbox" events dispatched by ArticleContentEnhancer
 */
export function ImageLightbox() {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState("");

  const close = useCallback(() => setSrc(null), []);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.src) {
        setSrc(detail.src);
        setAlt(detail.alt || "");
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    window.addEventListener("open-lightbox", onOpen);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("open-lightbox", onOpen);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  // Lock body scroll when open
  useEffect(() => {
    if (src) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [src]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Afbeelding vergroten"
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </motion.div>

          {/* Caption */}
          {alt && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center max-w-lg px-4 font-light tracking-wide"
            >
              {alt}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * ZoomHint — small icon overlay shown on article images
 * Used by ArticleContentEnhancer to indicate clickable images
 */
export function ZoomHintIcon() {
  return (
    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <ZoomIn className="w-4 h-4 text-white/80" />
    </div>
  );
}
