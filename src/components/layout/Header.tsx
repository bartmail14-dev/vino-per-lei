"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { MenuIcon, CloseIcon, UserIcon, CartIcon, ChevronDownIcon, ChevronRightIcon, HeartIcon, PackageIcon, SettingsIcon, LogOutIcon } from "@/components/icons";
import type { AnnouncementBar } from "@/lib/shopify-cms";

interface HeaderProps {
  announcement?: AnnouncementBar;
  contactPhone?: string;
  contactEmail?: string;
}

// Navigation data
// TODO: Footer links also need updating to use /wijnen?type=X pattern
const wineCategories = {
  type: [
    { label: "Rode Wijn", href: "/wijnen?type=red" },
    { label: "Witte Wijn", href: "/wijnen?type=white" },
    { label: "Rosé", href: "/wijnen?type=rose" },
    { label: "Mousserende", href: "/wijnen?type=sparkling" },
  ],
  region: [
    { label: "Piemonte", href: "/wijnen?region=piemonte" },
    { label: "Veneto", href: "/wijnen?region=veneto" },
    { label: "Toscana", href: "/wijnen?region=toscana" },
    { label: "Puglia", href: "/wijnen?region=puglia" },
    { label: "Trentino-Alto Adige", href: "/wijnen?region=alto-adige" },
    { label: "Friuli", href: "/wijnen?region=friuli" },
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
  { label: "Blog", href: "/blog" },
];

export function Header({ announcement, contactPhone, contactEmail }: HeaderProps) {
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

  // Only show if not dismissed AND announcement is enabled (default true for backwards compat)
  const announcementEnabled = announcement?.enabled !== false;
  const showAnnouncement = announcementState === true && announcementEnabled;

  const mobileMenuRef = useFocusTrap<HTMLDivElement>({ active: isMobileMenuOpen, onEscape: () => setIsMobileMenuOpen(false) });
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = useCartStore((state) => state.itemCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { isAuthenticated, user, openLoginModal, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
            className="bg-gradient-to-r from-wine via-wine-dark to-wine text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center relative">
              <p className="text-xs sm:text-sm text-center pr-8 tracking-wide">
                {announcement?.message || (
                  <>
                    Welkom! Gebruik code{" "}
                    <span className="font-semibold text-gold">WELKOM10</span> voor 10%
                    korting op je eerste bestelling
                  </>
                )}
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
              className="lg:hidden p-3 -ml-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
              aria-label="Open navigatiemenu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            {/* Logo - Prominent center */}
            <Link
              href="/"
              className="flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 group"
            >
              <Logo variant="full" color="#722f37" className="h-20 sm:h-24 lg:h-28 w-auto transition-transform duration-300 group-hover:scale-[1.02]" />
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
              {/* TODO: Search implementeren */}
              {/* User Account Button */}
              <div className="relative hidden lg:block">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
                      aria-label="Account menu openen"
                    >
                      <div className="w-7 h-7 bg-wine/10 rounded-full flex items-center justify-center">
                        <span className="text-wine text-sm font-medium">
                          {user?.firstName?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    </button>
                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-sand z-50 overflow-hidden"
                          >
                            <div className="p-3 border-b border-sand">
                              <p className="text-sm font-medium text-charcoal">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-xs text-grey truncate">{user?.email}</p>
                            </div>
                            <div className="py-1">
                              <Link
                                href="/account/verlanglijst"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-sand/50"
                              >
                                <HeartIcon className="w-4 h-4" />
                                Verlanglijstje
                              </Link>
                              <Link
                                href="/account/bestellingen"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-sand/50"
                              >
                                <PackageIcon className="w-4 h-4" />
                                Bestellingen
                              </Link>
                              <Link
                                href="/account/instellingen"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-sand/50"
                              >
                                <SettingsIcon className="w-4 h-4" />
                                Instellingen
                              </Link>
                            </div>
                            <div className="border-t border-sand py-1">
                              <button
                                onClick={() => {
                                  logout();
                                  setShowUserMenu(false);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-charcoal hover:bg-sand/50"
                              >
                                <LogOutIcon className="w-4 h-4" />
                                Uitloggen
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <button
                    onClick={() => openLoginModal()}
                    className="flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
                    aria-label="Inloggen of registreren"
                  >
                    <UserIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
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

                  {/* Region */}
                  <div>
                    <h3 className="text-label text-grey mb-4">Regio</h3>
                    <ul className="space-y-2">
                      {wineCategories.region.map((item) => (
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
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigatie menu"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-sand">
                <span className="font-serif text-xl font-semibold text-wine">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
                  aria-label="Sluit navigatiemenu"
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
                                  {/* Region */}
                                  <div>
                                    <h4 className="text-label text-grey mb-2">
                                      Regio
                                    </h4>
                                    <ul className="space-y-1">
                                      {wineCategories.region
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

                {/* Account Links */}
                <div className="mt-6 pt-6 border-t border-sand">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 py-3 mb-2">
                        <div className="w-8 h-8 bg-wine/10 rounded-full flex items-center justify-center">
                          <span className="text-wine font-medium">
                            {user?.firstName?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-grey">{user?.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/account/verlanglijst"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 text-charcoal hover:text-wine"
                      >
                        <HeartIcon className="w-5 h-5" />
                        Verlanglijstje
                      </Link>
                      <Link
                        href="/account/bestellingen"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 text-charcoal hover:text-wine"
                      >
                        <PackageIcon className="w-5 h-5" />
                        Bestellingen
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 py-3 text-charcoal hover:text-wine w-full"
                      >
                        <LogOutIcon className="w-5 h-5" />
                        Uitloggen
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openLoginModal();
                      }}
                      className="flex items-center gap-3 py-3 text-charcoal hover:text-wine w-full"
                    >
                      <UserIcon className="w-5 h-5" />
                      Inloggen / Registreren
                    </button>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-sand text-sm text-grey">
                  <p className="mb-2">Vragen? Neem contact op:</p>
                  <p className="font-medium text-charcoal">{contactPhone || "040-XXX XXXX"}</p>
                  <p className="text-charcoal">{contactEmail || "info@vinoperlei.nl"}</p>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
