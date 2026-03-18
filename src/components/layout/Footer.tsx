"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import type { SiteSettings } from "@/lib/shopify-cms";

// --- Props ---

interface FooterLinkItem {
  title: string;
  url: string;
}

interface FooterProps {
  settings?: SiteSettings;
  shopLinks?: FooterLinkItem[];
  serviceLinks?: FooterLinkItem[];
  aboutLinks?: FooterLinkItem[];
}

// Brand Icons (custom — Lucide doesn't include brand logos)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

// Proper SVG Payment Icons
function IdealIcon() {
  return (
    <div className="h-8 px-3 bg-white rounded-md flex items-center justify-center shadow-sm border border-sand/50">
      <svg viewBox="0 0 40 16" className="h-3.5">
        <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#CC0066">iDEAL</text>
      </svg>
    </div>
  );
}

function MastercardIcon() {
  return (
    <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center shadow-sm border border-sand/50">
      <svg viewBox="0 0 32 20" className="h-5">
        <circle cx="11" cy="10" r="8" fill="#EB001B" />
        <circle cx="21" cy="10" r="8" fill="#F79E1B" />
        <path d="M16 4.5a8 8 0 010 11 8 8 0 000-11z" fill="#FF5F00" />
      </svg>
    </div>
  );
}

function VisaIcon() {
  return (
    <div className="h-8 px-3 bg-white rounded-md flex items-center justify-center shadow-sm border border-sand/50">
      <svg viewBox="0 0 40 16" className="h-3">
        <text x="0" y="14" fontFamily="Arial" fontWeight="bold" fontSize="15" fill="#1A1F71" fontStyle="italic">VISA</text>
      </svg>
    </div>
  );
}

function PaypalIcon() {
  return (
    <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center shadow-sm border border-sand/50">
      <svg viewBox="0 0 44 16" className="h-3.5">
        <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="12">
          <tspan fill="#003087">Pay</tspan>
          <tspan fill="#009CDE">Pal</tspan>
        </text>
      </svg>
    </div>
  );
}

function BancontactIcon() {
  return (
    <div className="h-8 px-2.5 bg-white rounded-md flex items-center justify-center shadow-sm border border-sand/50">
      <svg viewBox="0 0 20 20" className="h-4">
        <circle cx="10" cy="10" r="9" fill="#005498" />
        <circle cx="7" cy="10" r="4" fill="#FFD800" opacity="0.9" />
        <circle cx="13" cy="10" r="4" fill="#005498" stroke="#FFD800" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

// Trust badge icons
function AgeVerifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <text x="7" y="16" fontSize="9" fontWeight="bold" fill="currentColor" stroke="none">18</text>
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

// Hardcoded fallback footer links (used when CMS menu props are empty)
const defaultFooterLinks = {
  shop: {
    title: "Shop",
    links: [
      { label: "Alle Wijnen", href: "/wijnen" },
      { label: "Rode Wijn", href: "/wijnen?type=rood" },
      { label: "Witte Wijn", href: "/wijnen?type=wit" },
      { label: "Rosé", href: "/wijnen?type=rose" },
      { label: "Cadeaus", href: "/cadeaus" },
    ],
  },
  service: {
    title: "Klantenservice",
    links: [
      { label: "Verzending & Levering", href: "/klantenservice/verzending" },
      { label: "Retourneren", href: "/klantenservice/retourneren" },
      { label: "Veelgestelde Vragen", href: "/klantenservice/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  about: {
    title: "Over Ons",
    links: [
      { label: "Ons Verhaal", href: "/over-ons" },
      { label: "Blog", href: "/blog" },
    ],
  },
};

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}

function AccordionSection({ title, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-wine/8 lg:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 lg:cursor-default lg:pointer-events-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-label text-wine/40">
          {title}
        </h3>
        <ChevronDownIcon
          className={cn(
            "w-5 h-5 text-wine/20 transition-transform duration-200 lg:hidden",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {/* Mobile: accordion behavior */}
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
      {/* Desktop: always visible */}
      <div className="hidden lg:block pt-2">{children}</div>
    </div>
  );
}

export function Footer({ settings, shopLinks, serviceLinks, aboutLinks }: FooterProps) {
  return (
    <footer>
      {/* Newsletter Section — Full bleed wine gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a]">
        {/* Decorative glows */}
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold/8 blur-[100px]" />
        <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-gold/5 blur-[80px]" />
        {/* Subtle grape pattern */}
        <svg className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-64 text-white/[0.02] hidden lg:block" viewBox="0 0 120 160" fill="currentColor">
          <circle cx="40" cy="56" r="14" />
          <circle cx="68" cy="56" r="14" />
          <circle cx="54" cy="40" r="14" />
          <circle cx="28" cy="80" r="14" />
          <circle cx="54" cy="76" r="14" />
          <circle cx="80" cy="80" r="14" />
          <circle cx="40" cy="100" r="14" />
          <circle cx="68" cy="100" r="14" />
          <circle cx="54" cy="116" r="14" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 rounded-full border border-gold/20 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-label text-gold/90">Nieuwsbrief</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3 leading-tight">
              Blijf op de hoogte
            </h2>
            <p className="text-white/50 mb-8 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Nieuwe wijnen, seizoenstips en af en toe een aanbieding. Geen spam, hooguit twee keer per maand.
            </p>
            <NewsletterForm
              variant="dark"
              layout="stacked"
              socialProof
              className="max-w-lg mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Footer — Warm beige paper texture */}
      <div className="relative bg-[#f0e8da] overflow-hidden">
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none bg-grain"
          style={{
            backgroundSize: "200px 200px",
          }}
        />
        {/* Subtle warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ede4d4]/60 via-transparent to-[#e5dbc8]/40 pointer-events-none" />
        {/* Decorative wine stain ring — top right */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-[3px] border-wine/[0.04] pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full border border-wine/[0.03] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Top section: Large logo + tagline */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16 mb-16">
            <div className="lg:max-w-md">
              <Link href="/" className="inline-block mb-6 group">
                <Logo variant="full" color="#722f37" className="h-24 sm:h-28 lg:h-32 w-auto transition-transform duration-500 group-hover:scale-[1.02]" />
              </Link>
              <p className="text-tagline text-lg sm:text-xl text-wine/60 leading-relaxed">
                &ldquo;Wijn met karakter, speciaal voor jou&rdquo;
              </p>
              <p className="text-wine/35 text-sm leading-relaxed mt-3 max-w-sm">
                19 Italiaanse wijnen, rechtstreeks van de producent. Geen tussenpersonen, geen eindeloos schap.
              </p>
              {/* Social Links */}
              <div className="flex gap-1 mt-6">
                {[
                  { href: settings?.instagramUrl || "https://instagram.com/vinoperlei", Icon: InstagramIcon, label: "Instagram" },
                  { href: settings?.facebookUrl || "https://facebook.com/vinoperlei", Icon: FacebookIcon, label: "Facebook" },
                  { href: settings?.pinterestUrl || "https://pinterest.com/vinoperlei", Icon: PinterestIcon, label: "Pinterest" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-wine/25 hover:text-wine/60 hover:bg-wine/5 rounded-lg transition-all duration-200"
                    aria-label={`Volg ons op ${label}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-12 flex-1 lg:max-w-xl">
              {(() => {
                const sections = [
                  {
                    key: "shop",
                    title: defaultFooterLinks.shop.title,
                    links: shopLinks && shopLinks.length > 0
                      ? shopLinks.map((l) => ({ label: l.title, href: l.url }))
                      : defaultFooterLinks.shop.links,
                  },
                  {
                    key: "service",
                    title: defaultFooterLinks.service.title,
                    links: serviceLinks && serviceLinks.length > 0
                      ? serviceLinks.map((l) => ({ label: l.title, href: l.url }))
                      : defaultFooterLinks.service.links,
                  },
                  {
                    key: "about",
                    title: defaultFooterLinks.about.title,
                    links: aboutLinks && aboutLinks.length > 0
                      ? aboutLinks.map((l) => ({ label: l.title, href: l.url }))
                      : defaultFooterLinks.about.links,
                  },
                ];
                return sections.map((section) => (
                  <AccordionSection key={section.key} title={section.title}>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-sm text-wine/40 hover:text-wine/80 transition-colors duration-200"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionSection>
                ));
              })()}
            </div>
          </div>

          {/* Divider — hand-drawn style */}
          <div className="flex items-center mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-wine/10 to-transparent" />
            <svg className="mx-6 w-6 h-6 text-wine/15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
            </svg>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-wine/10 to-transparent" />
          </div>

          {/* Trust & Payment Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div>
              <p className="text-label text-wine/25 mb-3">Betaalmethodes</p>
              <div className="flex flex-wrap items-center gap-2">
                <IdealIcon />
                <MastercardIcon />
                <VisaIcon />
                <PaypalIcon />
                <BancontactIcon />
              </div>
            </div>

            {/* Trust Badges */}
            <div>
              <p className="text-label text-wine/25 mb-3">Vertrouwd</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-wine/35">
                  <AgeVerifyIcon />
                  <span className="text-xs">NIX18</span>
                </div>
                <div className="flex items-center gap-2 text-wine/35">
                  <SecureIcon />
                  <span className="text-xs">SSL Beveiligd</span>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <p className="text-label text-wine/25 mb-3">Contact</p>
              <div className="space-y-1.5 text-sm text-wine/40">
                <p>{settings?.phone || "040-XXX XXXX"}</p>
                <p>{settings?.email || "info@vinoperlei.nl"}</p>
                <p className="text-wine/25 text-xs">Ma-Vr {settings?.hoursWeekday || "09:00 - 17:00"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Details & Legal */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="text-xs text-wine/40 leading-relaxed">
              <p className="font-medium text-wine/50">{settings?.companyName || "Vino per Lei"}</p>
              <p>{settings?.addressStreet || "Pastorielaan 56"}</p>
              <p>{settings?.addressPostal || "5504 CR"} {settings?.addressCity || "Veldhoven"}</p>
              <p className="mt-1">KvK: {settings?.kvk || "98874977"}</p>
              <p>BTW: {settings?.btw || "NL005360033B10"}</p>
            </div>

            <div className="text-xs text-wine/25 leading-relaxed sm:text-right space-y-2">
              <p>Alle prijzen zijn inclusief BTW</p>
              <p className="text-wine/40 font-medium">
                Het is verboden alcoholhoudende dranken te verkopen aan personen onder de 18 jaar
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-wine/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-wine/20">
                &copy; {new Date().getFullYear()} {settings?.companyName || "Vino per Lei"}. Alle rechten voorbehouden.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-wine/20">
                <Link href="/voorwaarden" className="hover:text-wine/50 transition-colors">
                  Algemene Voorwaarden
                </Link>
                <Link href="/privacy" className="hover:text-wine/50 transition-colors">
                  Privacybeleid
                </Link>
                <Link href="/cookies" className="hover:text-wine/50 transition-colors">
                  Cookiebeleid
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
