"use client";

import { useCallback, useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import { useUiCopy } from "@/components/providers";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const t = useUiCopy();

  const handleShare = useCallback(
    (platform: "twitter" | "facebook" | "whatsapp" | "copy") => {
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
        case "copy":
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          break;
      }
    },
    [title, t]
  );

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-grey font-medium uppercase tracking-wider">{t("blog.share.label")}</span>
      <div className="h-4 w-px bg-sand" />
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handleShare("whatsapp")}
          className="w-11 h-11 rounded-full bg-transparent border border-sand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:scale-110 flex items-center justify-center text-grey transition-all duration-300"
          aria-label={t("blog.share.whatsapp")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare("facebook")}
          className="w-11 h-11 rounded-full bg-transparent border border-sand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:scale-110 flex items-center justify-center text-grey transition-all duration-300"
          aria-label={t("blog.share.facebook")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="w-11 h-11 rounded-full bg-transparent border border-sand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 hover:border-black/20 hover:bg-black/5 hover:text-black hover:scale-110 flex items-center justify-center text-grey transition-all duration-300"
          aria-label={t("blog.share.x")}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <div className="relative">
          <button
            onClick={() => handleShare("copy")}
            className={`w-11 h-11 rounded-full bg-transparent border flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
              copied
                ? "border-green-500/40 bg-green-500/10 text-green-600 scale-110"
                : "border-sand/80 hover:border-wine/40 hover:bg-wine/10 hover:text-wine hover:scale-110 text-grey"
            }`}
            aria-label={t("blog.share.copy")}
          >
            {copied ? (
              <Check className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <LinkIcon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
          {/* Tooltip */}
          {copied && (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap animate-fade-in">
              {t("blog.share.copied")}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-charcoal" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
