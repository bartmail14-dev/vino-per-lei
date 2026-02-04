"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";

// Icons
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// Payment icons
function IdealIcon({ className }: { className?: string }) {
  return (
    <div className={cn("w-10 h-6 bg-white rounded flex items-center justify-center text-[10px] font-bold text-pink-600", className)}>
      iDEAL
    </div>
  );
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <div className={cn("w-10 h-6 bg-white rounded flex items-center justify-center", className)}>
      <div className="flex -space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
      </div>
    </div>
  );
}

function VisaIcon({ className }: { className?: string }) {
  return (
    <div className={cn("w-10 h-6 bg-white rounded flex items-center justify-center text-[10px] font-bold text-blue-700 italic", className)}>
      VISA
    </div>
  );
}

function PaypalIcon({ className }: { className?: string }) {
  return (
    <div className={cn("w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-bold text-blue-800", className)}>
      PayPal
    </div>
  );
}

// Footer link sections
const footerLinks = {
  shop: {
    title: "Shop",
    links: [
      { label: "Alle Wijnen", href: "/wijnen" },
      { label: "Rode Wijn", href: "/wijnen/rood" },
      { label: "Witte Wijn", href: "/wijnen/wit" },
      { label: "Rosé", href: "/wijnen/rose" },
      { label: "Cadeaus", href: "/cadeaus" },
    ],
  },
  service: {
    title: "Klantenservice",
    links: [
      { label: "Verzending", href: "/klantenservice/verzending" },
      { label: "Retourneren", href: "/klantenservice/retourneren" },
      { label: "FAQ", href: "/klantenservice/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  about: {
    title: "Over Ons",
    links: [
      { label: "Ons Verhaal", href: "/over-ons" },
      { label: "Onze Selectie", href: "/over-ons/selectie" },
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
    <div className="border-b border-charcoal/20 lg:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 lg:cursor-default lg:pointer-events-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
          {title}
        </h3>
        <ChevronDownIcon
          className={cn(
            "w-5 h-5 text-grey transition-transform duration-200 lg:hidden",
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
      <div className="hidden lg:block pt-4">{children}</div>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribing(false);
    setSubscribeSuccess(true);
    setEmail("");

    // Reset success message after 3 seconds
    setTimeout(() => setSubscribeSuccess(false), 3000);
  };

  return (
    <footer className="bg-charcoal text-white">
      {/* Newsletter Section */}
      <div className="border-b border-charcoal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-xl mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="font-serif text-2xl text-white mb-2">
                Blijf op de hoogte
              </h2>
              <p className="text-grey">
                Ontvang als eerste nieuwe wijnen en exclusieve aanbiedingen
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 lg:ml-8"
            >
              <Input
                type="email"
                placeholder="je@email.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-charcoal border-grey/30 text-white placeholder:text-grey focus:border-coral sm:w-64"
                required
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubscribing}
                className="bg-coral hover:bg-coral/90 text-charcoal whitespace-nowrap"
              >
                {subscribeSuccess ? "Aangemeld!" : "Aanmelden"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 pb-8 lg:pb-0">
            <Link
              href="/"
              className="inline-block font-serif text-2xl font-semibold text-white mb-4"
            >
              Vino per Lei
            </Link>
            <p className="text-grey text-sm leading-relaxed max-w-sm mb-6">
              Wijn met karakter, speciaal voor jou. Ontdek onze zorgvuldig
              geselecteerde collectie wijnen van topproducenten.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/vinoperlei"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-grey hover:text-white transition-colors"
                aria-label="Volg ons op Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/vinoperlei"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-grey hover:text-white transition-colors"
                aria-label="Volg ons op Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <AccordionSection key={key} title={section.title}>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-grey hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionSection>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Payment Methods */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-grey mr-2">Betaalmethodes:</span>
              <IdealIcon />
              <MastercardIcon />
              <VisaIcon />
              <PaypalIcon />
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-grey">
                <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">
                  TW
                </span>
                Thuiswinkel Waarborg
              </div>
              <div className="flex items-center gap-2 text-xs text-grey">
                <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">
                  18
                </span>
                NIX18
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-grey">
              <span>&copy; {new Date().getFullYear()} Vino per Lei</span>
              <Link href="/voorwaarden" className="hover:text-white transition-colors">
                Voorwaarden
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
