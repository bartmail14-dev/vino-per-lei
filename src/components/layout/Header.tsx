"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { MenuIcon, CloseIcon, UserIcon, CartIcon, ChevronDownIcon, ChevronRightIcon } from "@/components/icons";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AnnouncementBar } from "@/lib/shopify-cms";

interface HeaderProps {
  announcement?: AnnouncementBar;
  contactPhone?: string;
  contactEmail?: string;
  regionLinks?: { label: string; href: string }[]; // Dynamic from Shopify products
}

// Static navigation data
const wineTypeLinks = [
  { label: "Rode Wijn", href: "/wijnen?type=red" },
  { label: "Witte Wijn", href: "/wijnen?type=white" },
  { label: "Rosé", href: "/wijnen?type=rose" },
  { label: "Mousserende wijn", href: "/wijnen?type=sparkling" },
];

const popularLinks = [
  { label: "Bestsellers", href: "/wijnen?sort=bestsellers" },
  { label: "Nieuw", href: "/wijnen?sort=nieuw" },
  { label: "Aanbiedingen", href: "/wijnen?sale=true" },
];

const priceLinks = [
  { label: "€15 - €20", href: "/wijnen?prijs=15-20" },
  { label: "€20 - €30", href: "/wijnen?prijs=20-30" },
  { label: "€30+", href: "/wijnen?prijs=30-999" },
];

const mainNavItems = [
  { label: "Wijnen", href: "/wijnen", hasMegaMenu: true },
  { label: "Over Ons", href: "/over-ons" },
];

// Fallback region links if none provided (e.g. during build without products)
const defaultRegionLinks = [
  { label: "Piemonte", href: "/wijnen?region=piemonte" },
  { label: "Veneto", href: "/wijnen?region=veneto" },
  { label: "Toscana", href: "/wijnen?region=toscana" },
];

export function Header({ announcement, contactPhone, contactEmail, regionLinks }: HeaderProps) {
  const activeRegionLinks = regionLinks && regionLinks.length > 0 ? regionLinks : defaultRegionLinks;
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  // null = not checked, true = show, false = dismissed
  const [announcementState, setAnnouncementState] = useState<boolean | null>(null);

  // Check localStorage on mount to avoid hydration issues
  // This is a valid pattern for client-only state initialization
  useEffect(() => {
    const dismissed = localStorage.getItem("vpl_announcement_dismissed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnouncementState(!dismissed);
  }, []);

  // Only show if not dismissed AND announcement is enabled (default true for backwards compat)
  const announcementEnabled = announcement?.enabled !== false;
  const showAnnouncement = announcementState === true && announcementEnabled;

  const mobileMenuRef = useFocusTrap<HTMLDivElement>({ active: isMobileMenuOpen, onEscape: () => setIsMobileMenuOpen(false) });
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = useCartStore((state) => state.itemCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { openLoginModal, isAuthenticated } = useAuthStore();

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

  const handleMegaMenuToggle = () => {
    setIsMegaMenuOpen((prev) => !prev);
  };

  const handleMegaMenuFocus = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuBlur = () => {
    // Delay to allow focus to move into submenu
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  const handleMegaMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMegaMenuOpen(false);
      megaMenuTriggerRef.current?.focus();
    }
  };

  const dismissAnnouncement = () => {
    setAnnouncementState(false);
    localStorage.setItem("vpl_announcement_dismissed", "true");
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/wijnen?zoek=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => {
      if (!prev) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      return !prev;
    });
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
            className="bg-wine-gradient-subtle text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center relative">
              <p className="text-xs sm:text-sm text-center pr-8 tracking-wide">
                {announcement?.message || "Italiaanse wijnen rechtstreeks van de producent"}
              </p>
              <button
                onClick={dismissAnnouncement}
                className="absolute right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-70 transition-opacity"
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
          <div className="flex items-center justify-between h-24 lg:h-32 relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-60 transition-opacity"
              aria-label="Open navigatiemenu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            {/* Logo - Prominent center */}
            <Link
              href="/"
              className="flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 group"
            >
              <Logo variant="full" color="#1a1f3d" className="h-20 sm:h-24 lg:h-28 w-auto transition-transform duration-300 group-hover:scale-[1.02]" />
            </Link>

            {/* Desktop Navigation - Left aligned */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainNavItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.hasMegaMenu ? (
                    <button
                      ref={megaMenuTriggerRef}
                      onClick={handleMegaMenuToggle}
                      onMouseEnter={handleMegaMenuEnter}
                      onMouseLeave={handleMegaMenuLeave}
                      onFocus={handleMegaMenuFocus}
                      onBlur={handleMegaMenuBlur}
                      onKeyDown={handleMegaMenuKeyDown}
                      aria-expanded={isMegaMenuOpen}
                      aria-haspopup="true"
                      className={cn(
                        "flex items-center gap-1 py-2 text-nav uppercase",
                        "text-charcoal hover:text-wine transition-colors",
                        isMegaMenuOpen && "text-wine"
                      )}
                    >
                      {item.label}
                      <ChevronDownIcon
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isMegaMenuOpen && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="py-2 text-nav uppercase text-charcoal hover:text-wine transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <div className="relative">
                <button
                  onClick={handleSearchToggle}
                  className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
                  aria-label="Zoeken"
                >
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 z-50 origin-top"
                    >
                      <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-sand shadow-lg rounded-lg overflow-hidden">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Zoek wijnen..."
                          className="w-56 px-4 py-2.5 text-sm text-charcoal placeholder:text-grey/50 outline-none bg-transparent"
                          onKeyDown={(e) => { if (e.key === "Escape") setIsSearchOpen(false); }}
                          onBlur={(e) => { if (!e.currentTarget.closest("form")?.contains(e.relatedTarget as Node)) setIsSearchOpen(false); }}
                        />
                        <button
                          type="submit"
                          className="px-3 py-2.5 text-wine hover:bg-sand/30 transition-colors"
                          aria-label="Zoeken"
                        >
                          <Search className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Account Button — link to account page or open login modal */}
              {isAuthenticated ? (
                <a
                  href="/account"
                  className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
                  aria-label="Mijn account"
                >
                  <UserIcon className="w-5 h-5 text-wine" />
                </a>
              ) : (
                <button
                  onClick={() => openLoginModal()}
                  className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
                  aria-label="Inloggen of registreren"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={toggleCart}
                className="relative p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
                aria-label={`Winkelmand${itemCount > 0 ? `, ${itemCount} ${itemCount === 1 ? 'artikel' : 'artikelen'}` : ', leeg'}`}
              >
                <CartIcon className="w-5 h-5" />
                <span aria-live="polite" aria-atomic="true" className="absolute -top-0.5 -right-0.5">
                  {itemCount > 0 && (
                    <span className="w-5 h-5 bg-wine text-white text-xs font-semibold rounded-full flex items-center justify-center">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </span>
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
              onFocus={handleMegaMenuFocus}
              onBlur={handleMegaMenuBlur}
              onKeyDown={handleMegaMenuKeyDown}
              role="menu"
              className="absolute left-0 right-0 bg-white border-t border-sand shadow-xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-4 gap-8">
                  {/* Wine Type */}
                  <div>
                    <h3 className="text-label text-grey mb-4">Wijntype</h3>
                    <ul className="space-y-2">
                      {wineTypeLinks.map((item) => (
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

                  {/* Region */}
                  <div>
                    <h3 className="text-label text-grey mb-4">Regio</h3>
                    <ul className="space-y-2">
                      {activeRegionLinks.map((item) => (
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
                      {popularLinks.map((item) => (
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
                      {priceLinks.map((item) => (
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
                        Onze Italiaanse rosés
                      </h4>
                      <p className="text-sm text-grey mb-4">
                        Verfrissend voor de zomermaanden
                      </p>
                      <Link
                        href="/wijnen?type=rose"
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
              ref={mobileMenuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-cream z-50 overflow-y-auto lg:hidden shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Navigatie menu"
            >
              {/* Menu Header — wine gradient with logo */}
              <div className="bg-wine-gradient px-5 pt-6 pb-5">
                <div className="flex items-center justify-between mb-4">
                  <Logo variant="icon" color="#ffffff" className="h-10 w-auto opacity-90" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Sluit navigatiemenu"
                  >
                    <CloseIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-white/60 text-xs tracking-widest uppercase">Italiaanse wijnen</p>
              </div>

              {/* Menu Content */}
              <nav className="px-5 pt-6 pb-32">
                {/* Main Navigation */}
                <ul className="space-y-0.5">
                  {mainNavItems.map((item, index) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    >
                      {item.hasMegaMenu ? (
                        <>
                          <button
                            onClick={() =>
                              setMobileSubmenu(
                                mobileSubmenu === item.label ? null : item.label
                              )
                            }
                            className={cn(
                              "flex items-center justify-between w-full py-3.5 text-[17px] font-medium tracking-wide transition-colors rounded-lg px-3 -mx-3",
                              mobileSubmenu === item.label
                                ? "text-wine bg-wine/5"
                                : "text-charcoal hover:text-wine hover:bg-wine/5"
                            )}
                          >
                            {item.label}
                            <motion.div
                              animate={{ rotate: mobileSubmenu === item.label ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRightIcon className={cn(
                                "w-4 h-4 transition-colors",
                                mobileSubmenu === item.label ? "text-gold" : "text-grey"
                              )} />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {mobileSubmenu === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="overflow-hidden"
                              >
                                <div className="ml-3 pl-4 pb-4 pt-1 space-y-4 border-l-2 border-gold/30">
                                  {/* Type */}
                                  <div>
                                    <h4 className="text-[10px] text-gold font-semibold uppercase tracking-[0.15em] mb-2">
                                      Wijntype
                                    </h4>
                                    <ul className="space-y-0.5">
                                      {wineTypeLinks.map((subItem, i) => (
                                        <motion.li
                                          key={subItem.label}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: i * 0.04, duration: 0.2 }}
                                        >
                                          <Link
                                            href={subItem.href}
                                            onClick={() =>
                                              setIsMobileMenuOpen(false)
                                            }
                                            className="block py-2 text-[15px] text-charcoal/80 hover:text-wine transition-colors"
                                          >
                                            {subItem.label}
                                          </Link>
                                        </motion.li>
                                      ))}
                                    </ul>
                                  </div>
                                  {/* Region */}
                                  <div>
                                    <h4 className="text-[10px] text-gold font-semibold uppercase tracking-[0.15em] mb-2">
                                      Regio
                                    </h4>
                                    <ul className="space-y-0.5">
                                      {activeRegionLinks
                                        .slice(0, 4)
                                        .map((subItem, i) => (
                                          <motion.li
                                            key={subItem.label}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.16 + i * 0.04, duration: 0.2 }}
                                          >
                                            <Link
                                              href={subItem.href}
                                              onClick={() =>
                                                setIsMobileMenuOpen(false)
                                              }
                                              className="block py-2 text-[15px] text-charcoal/80 hover:text-wine transition-colors"
                                            >
                                              {subItem.label}
                                            </Link>
                                          </motion.li>
                                        ))}
                                    </ul>
                                  </div>
                                  {/* All Wines */}
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35, duration: 0.2 }}
                                  >
                                    <Link
                                      href="/wijnen"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-wine transition-colors"
                                    >
                                      Bekijk alle wijnen
                                      <ChevronRightIcon className="w-3.5 h-3.5" />
                                    </Link>
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3.5 text-[17px] font-medium tracking-wide text-charcoal hover:text-wine hover:bg-wine/5 transition-colors rounded-lg px-3 -mx-3"
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Link
                      href="/klantenservice"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3.5 text-[17px] font-medium tracking-wide text-charcoal hover:text-wine hover:bg-wine/5 transition-colors rounded-lg px-3 -mx-3"
                    >
                      Klantenservice
                    </Link>
                  </motion.li>
                </ul>

                {/* Account Link */}
                <div className="mt-8 pt-6 border-t border-sand/60">
                  {isAuthenticated ? (
                    <a
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full py-3 px-4 text-[15px] font-medium text-wine bg-wine/5 hover:bg-wine/10 rounded-xl transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-wine/10 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-wine" />
                      </div>
                      Mijn account
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openLoginModal();
                      }}
                      className="flex items-center gap-3 w-full py-3 px-4 text-[15px] font-medium text-wine bg-wine/5 hover:bg-wine/10 rounded-xl transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-wine/10 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-wine" />
                      </div>
                      Inloggen / Registreren
                    </button>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-6 border-t border-sand/60">
                  <p className="text-[10px] text-gold font-semibold uppercase tracking-[0.15em] mb-3">Contact</p>
                  <div className="space-y-2">
                    <a href={`mailto:${contactEmail || "info@vinoperlei.nl"}`} className="flex items-center gap-3 text-sm text-charcoal hover:text-wine transition-colors">
                      <span className="w-8 h-8 rounded-lg bg-champagne/50 flex items-center justify-center text-xs">&#9993;</span>
                      {contactEmail || "info@vinoperlei.nl"}
                    </a>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
