"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Link as LinkIcon, Check } from "lucide-react";
import { useUiCopy } from "@/components/providers";

interface FloatingShareBarProps {
  title: string;
}

export function FloatingShareBar({ title }: FloatingShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const t = useUiCopy();

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      setVisible(scrollY > 500);
      setAtBottom(scrollY + winHeight > docHeight - 500);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleShare = useCallback(
    (platform: "twitter" | "facebook" | "whatsapp" | "email" | "copy") => {
      const url = window.location.href;
      const text = t("blog.share.text", { title, site: t("site.name") });

      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            "_blank",
            "width=550,height=435"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
            "width=550,height=435"
          );
          break;
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
            "_blank"
          );
          break;
        case "email":
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
          break;
        case "copy":
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          break;
      }
    },
    [title, t]
  );

  const showBar = visible && !atBottom;

  return (
    <>
      {/* Desktop: minimal vertical bar, ghost buttons w-9 h-9, no label, dot separators */}
      <AnimatePresence>
        {showBar && (
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            aria-label={t("blog.share.article")}
            className="fixed left-3 xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center print:hidden"
          >
            <div className="flex flex-col items-center gap-0.5">
              <ShareBtn
                label={t("blog.share.whatsapp")}
                onClick={() => handleShare("whatsapp")}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </ShareBtn>

              <ShareBtn
                label={t("blog.share.facebook")}
                onClick={() => handleShare("facebook")}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </ShareBtn>

              <ShareBtn
                label={t("blog.share.x")}
                onClick={() => handleShare("twitter")}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </ShareBtn>

              {/* Dot separator */}
              <div className="w-1 h-1 rounded-full bg-sand/50 my-1" aria-hidden="true" />

              <ShareBtn
                label={t("blog.share.email")}
                onClick={() => handleShare("email")}
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              </ShareBtn>

              <div className="relative">
                <ShareBtn
                  label={copied ? t("blog.share.copied") : t("blog.share.copy")}
                  onClick={() => handleShare("copy")}
                  active={copied}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
                  ) : (
                    <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  )}
                </ShareBtn>
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 bg-charcoal text-white text-[10px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg"
                    >
                      {t("blog.share.copied")}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-transparent border-r-charcoal" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile: compact bottom bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 inset-x-0 z-40 xl:hidden print:hidden"
          >
            <div className="bg-white/90 backdrop-blur-xl border-t border-sand/50 shadow-[0_-1px_12px_rgba(0,0,0,0.06)] px-5 py-2 flex items-center justify-center gap-1 safe-area-bottom">
              <MobileBtn label={t("blog.share.mobile_whatsapp")} onClick={() => handleShare("whatsapp")}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </MobileBtn>

              {/* Dot */}
              <div className="w-0.5 h-0.5 rounded-full bg-grey/20 mx-0.5" aria-hidden="true" />

              <MobileBtn label={t("blog.share.mobile_facebook")} onClick={() => handleShare("facebook")}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </MobileBtn>

              {/* Dot */}
              <div className="w-0.5 h-0.5 rounded-full bg-grey/20 mx-0.5" aria-hidden="true" />

              <MobileBtn label={t("blog.share.mobile_email")} onClick={() => handleShare("email")}>
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </MobileBtn>

              {/* Dot */}
              <div className="w-0.5 h-0.5 rounded-full bg-grey/20 mx-0.5" aria-hidden="true" />

              <MobileBtn
                label={copied ? t("blog.share.copied_short") : t("blog.share.copy")}
                onClick={() => handleShare("copy")}
                highlight={copied}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                ) : (
                  <LinkIcon className="w-4 h-4" strokeWidth={1.5} />
                )}
              </MobileBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Desktop: w-9 h-9 ghost-style buttons â€” no background, just icon */
function ShareBtn({
  children,
  label,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 cursor-pointer ${
        active
          ? "bg-green-50 text-green-600"
          : "text-grey/40 hover:text-grey/80 hover:bg-sand/40"
      }`}
    >
      {children}
    </button>
  );
}

/* Mobile: compact ghost buttons */
function MobileBtn({
  children,
  label,
  onClick,
  highlight = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 cursor-pointer ${
        highlight
          ? "bg-green-50 text-green-600"
          : "text-grey/50 hover:text-wine hover:bg-wine/5"
      }`}
    >
      {children}
    </button>
  );
}
