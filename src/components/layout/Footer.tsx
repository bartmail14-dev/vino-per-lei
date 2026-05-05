"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "@/components/icons";
import { Logo } from "@/components/ui/Logo";
import { reopenCookieConsent } from "@/components/ui/CookieConsent";
import { cn } from "@/lib/utils";
import { useUiCopy } from "@/components/providers";
import type { SiteSettings } from "@/lib/shopify-cms";

interface FooterLinkItem {
  title: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLinkItem[];
}

interface FooterProps {
  settings?: SiteSettings;
  sections?: FooterSection[];
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function toRelativeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url || "/";
  }
}

function AccordionSection({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-wine/8 lg:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 lg:cursor-default lg:pointer-events-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-label text-wine/80">{title}</h3>
        <ChevronDownIcon className={cn("w-5 h-5 text-wine/70 transition-transform duration-200 lg:hidden", isOpen && "rotate-180")} />
      </button>
      <div className="lg:hidden">
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pb-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden lg:block pt-2">{children}</div>
    </div>
  );
}

export function Footer({ settings, sections = [] }: FooterProps) {
  const t = useUiCopy();
  const socialLinks = [
    settings?.instagramUrl ? { href: settings.instagramUrl, Icon: InstagramIcon, label: t("footer.social.instagram") } : null,
    settings?.facebookUrl ? { href: settings.facebookUrl, Icon: FacebookIcon, label: t("footer.social.facebook") } : null,
  ].filter(Boolean) as Array<{ href: string; Icon: typeof InstagramIcon; label: string }>;

  return (
    <footer className="relative bg-[#f0e8da] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none bg-grain" style={{ backgroundSize: "200px 200px" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#ede4d4]/60 via-transparent to-[#e5dbc8]/40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10 mb-8">
          <div className="lg:max-w-xs">
            <Link href="/" className="inline-block mb-3 group">
              <Logo variant="full" color="#1a1f3d" className="h-16 sm:h-20 w-auto transition-transform duration-500 group-hover:scale-[1.02]" />
            </Link>
            {socialLinks.length > 0 && (
              <div className="flex gap-1 mt-3">
                {socialLinks.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-wine/80 hover:text-wine/90 hover:bg-wine/5 rounded-lg transition-all duration-200"
                    aria-label={t("footer.social.follow_on", { platform: label })}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {sections.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-12 flex-1 lg:max-w-xl">
              {sections.map((section) => (
                <AccordionSection key={section.title} title={section.title}>
                  <ul className="space-y-1.5">
                    {section.links.map((link) => (
                      <li key={`${section.title}-${link.url}`}>
                        <Link href={toRelativeUrl(link.url)} className="text-sm text-wine/80 hover:text-wine transition-colors duration-200">
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionSection>
              ))}
            </div>
          )}
        </div>

        {settings?.email && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-wine/10 to-transparent mb-6" />
            <div className="text-sm text-wine/80">
              <p>{settings.email}</p>
            </div>
          </>
        )}
      </div>

      <div className="relative border-t border-wine/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 text-[11px] text-wine/60 leading-relaxed">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {settings?.companyName && <span>&copy; {new Date().getFullYear()} {settings.companyName}</span>}
              {settings?.kvk && <span>{t("footer.legal.kvk_prefix")} {settings.kvk}</span>}
              {settings?.btw && <span>{t("footer.legal.btw_prefix")} {settings.btw}</span>}
            </div>
            <button onClick={reopenCookieConsent} className="self-start lg:self-auto hover:text-wine/80 transition-colors cursor-pointer">
              {t("footer.cookie_settings")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
