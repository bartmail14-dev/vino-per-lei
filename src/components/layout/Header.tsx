"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";

// Icons
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
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

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Navigation data
const wineCategories = {
  type: [
    { label: "Rode Wijn", href: "/wijnen/rood" },
    { label: "Witte Wijn", href: "/wijnen/wit" },
    { label: "Rosé", href: "/wijnen/rose" },
    { label: "Mousserende", href: "/wijnen/mousserende" },
  ],
  country: [
    { label: "Frankrijk", href: "/wijnen?land=frankrijk" },
    { label: "Italië", href: "/wijnen?land=italie" },
    { label: "Spanje", href: "/wijnen?land=spanje" },
    { label: "Portugal", href: "/wijnen?land=portugal" },
    { label: "Chili", href: "/wijnen?land=chili" },
    { label: "Argentinië", href: "/wijnen?land=argentinie" },
  ],
  popular: [
    { label: "Bestsellers", href: "/wijnen?sort=bestsellers" },
    { label: "Nieuw", href: "/wijnen?sort=nieuw" },
    { label: "Aanbiedingen", href: "/wijnen?sale=true" },
  ],
  price: [
    { label: "Tot €10", href: "/wijnen?prijs=0-10" },
    { label: "€10 - €20", href: "/wijnen?prijs=10-20" },
    { label: "€20 - €30", href: "/wijnen?prijs=20-30" },
    { label: "€30+", href: "/wijnen?prijs=30-999" },
  ],
};

const mainNavItems = [
  { label: "Wijnen", href: "/wijnen", hasMegaMenu: true },
  { label: "Cadeaus", href: "/cadeaus" },
  { label: "Over Ons", href: "/over-ons" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  // null = not checked, true = show, false = dismissed
  const [announcementState, setAnnouncementState] = useState<boolean | null>(null);

  // Check localStorage on mount to avoid hydration issues
  // This is a valid pattern for client-only state initialization
  useEffect(() => {
    const dismissed = localStorage.getItem("vpl_announcement_dismissed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnouncementState(!dismissed);
  }, []);

  const showAnnouncement = announcementState === true;

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = useCartStore((state) => state.itemCount);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsMegaMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 100);
  };

  const dismissAnnouncement = () => {
    setAnnouncementState(false);
    localStorage.setItem("vpl_announcement_dismissed", "true");
  };


  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow duration-200",
        hasScrolled && "shadow-md"
      )}
    >
      {/* Announcement Bar */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-wine text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center relative">
              <p className="text-sm text-center pr-8">
                Welkom! Gebruik code{" "}
                <span className="font-semibold">WELKOM10</span> voor 10%
                korting op je eerste bestelling
              </p>
              <button
                onClick={dismissAnnouncement}
                className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
                aria-label="Sluit melding"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <div className="border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-sand/50 rounded-md transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-xl lg:text-2xl font-semibold text-wine tracking-wide"
            >
              Vino per Lei
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainNavItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.hasMegaMenu ? (
                    <button
                      ref={megaMenuTriggerRef}
                      onMouseEnter={handleMegaMenuEnter}
                      onMouseLeave={handleMegaMenuLeave}
                      className={cn(
                        "flex items-center gap-1 py-2 text-[15px] font-medium",
                        "text-charcoal hover:text-wine transition-colors",
                        isMegaMenuOpen && "text-wine"
                      )}
                    >
                      {item.label}
                      <ChevronDownIcon
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isMegaMenuOpen && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="py-2 text-[15px] font-medium text-charcoal hover:text-wine transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              <button
                className="hidden sm:flex p-2 hover:bg-sand/50 rounded-md transition-colors"
                aria-label="Zoeken"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
              <button
                className="hidden lg:flex p-2 hover:bg-sand/50 rounded-md transition-colors"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>
              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-sand/50 rounded-md transition-colors"
                aria-label={`Winkelmand (${itemCount} items)`}
              >
                <CartIcon className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-wine text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
              className="absolute left-0 right-0 bg-white border-t border-sand shadow-xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-4 gap-8">
                  {/* Wine Type */}
                  <div>
                    <h3 className="text-label text-grey mb-4">Wijntype</h3>
                    <ul className="space-y-2">
                      {wineCategories.type.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="block py-1.5 text-[15px] text-charcoal hover:text-wine transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/wijnen"
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="inline-flex items-center gap-1 py-1.5 text-[15px] text-wine font-medium hover:underline"
                        >
                          Alle Wijnen
                          <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Country */}
                  <div>
                    <h3 className="text-label text-grey mb-4">Land</h3>
                    <ul className="space-y-2">
                      {wineCategories.country.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="block py-1.5 text-[15px] text-charcoal hover:text-wine transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Popular & Price */}
                  <div>
                    <h3 className="text-label text-grey mb-4">Populair</h3>
                    <ul className="space-y-2 mb-6">
                      {wineCategories.popular.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="block py-1.5 text-[15px] text-charcoal hover:text-wine transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <h3 className="text-label text-grey mb-4">Prijs</h3>
                    <ul className="space-y-2">
                      {wineCategories.price.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="block py-1.5 text-[15px] text-charcoal hover:text-wine transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Promo Box */}
                  <div className="relative rounded-lg overflow-hidden bg-wine-light/10 p-6">
                    <div className="relative z-10">
                      <p className="text-label text-wine mb-2">Seizoenstip</p>
                      <h4 className="font-serif text-xl text-charcoal mb-3">
                        Ontdek onze rosé selectie
                      </h4>
                      <p className="text-sm text-grey mb-4">
                        Verfrissend voor de zomermaanden
                      </p>
                      <Link
                        href="/wijnen/rose"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-wine hover:underline"
                      >
                        Bekijk rosé
                        <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-sand">
                <span className="font-serif text-xl font-semibold text-wine">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-sand/50 rounded-md transition-colors"
                  aria-label="Sluit menu"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <nav className="p-4">
                {/* Main Navigation */}
                <ul className="space-y-1">
                  {mainNavItems.map((item) => (
                    <li key={item.label}>
                      {item.hasMegaMenu ? (
                        <>
                          <button
                            onClick={() =>
                              setMobileSubmenu(
                                mobileSubmenu === item.label ? null : item.label
                              )
                            }
                            className="flex items-center justify-between w-full py-3 text-lg font-medium text-charcoal"
                          >
                            {item.label}
                            <ChevronRightIcon
                              className={cn(
                                "w-5 h-5 transition-transform duration-200",
                                mobileSubmenu === item.label && "rotate-90"
                              )}
                            />
                          </button>
                          <AnimatePresence>
                            {mobileSubmenu === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pb-4 space-y-4">
                                  {/* Type */}
                                  <div>
                                    <h4 className="text-label text-grey mb-2">
                                      Wijntype
                                    </h4>
                                    <ul className="space-y-1">
                                      {wineCategories.type.map((subItem) => (
                                        <li key={subItem.label}>
                                          <Link
                                            href={subItem.href}
                                            onClick={() =>
                                              setIsMobileMenuOpen(false)
                                            }
                                            className="block py-2 text-charcoal hover:text-wine"
                                          >
                                            {subItem.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {/* Country */}
                                  <div>
                                    <h4 className="text-label text-grey mb-2">
                                      Land
                                    </h4>
                                    <ul className="space-y-1">
                                      {wineCategories.country
                                        .slice(0, 4)
                                        .map((subItem) => (
                                          <li key={subItem.label}>
                                            <Link
                                              href={subItem.href}
                                              onClick={() =>
                                                setIsMobileMenuOpen(false)
                                              }
                                              className="block py-2 text-charcoal hover:text-wine"
                                            >
                                              {subItem.label}
                                            </Link>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                  {/* All Wines */}
                                  <Link
                                    href="/wijnen"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="inline-flex items-center gap-1 text-wine font-medium"
                                  >
                                    Alle Wijnen
                                    <ChevronRightIcon className="w-4 h-4" />
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 text-lg font-medium text-charcoal hover:text-wine"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/klantenservice"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 text-lg font-medium text-charcoal hover:text-wine"
                    >
                      Klantenservice
                    </Link>
                  </li>
                </ul>

                {/* Account Link */}
                <div className="mt-6 pt-6 border-t border-sand">
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-charcoal hover:text-wine"
                  >
                    <UserIcon className="w-5 h-5" />
                    Account
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-sand text-sm text-grey">
                  <p className="mb-2">Vragen? Neem contact op:</p>
                  <p className="font-medium text-charcoal">020-123 4567</p>
                  <p className="text-charcoal">info@vinoperlei.nl</p>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
