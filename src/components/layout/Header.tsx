"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiCopy } from "@/components/providers";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import {
  MenuIcon,
  CloseIcon,
  UserIcon,
  CartIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GrapeIcon,
  MailIcon,
  WineBottleIcon,
  WineGlassesIcon,
  WineIcon,
} from "@/components/icons";
import type { AnnouncementBar, MenuItem } from "@/lib/shopify-cms";

interface HeaderProps {
  announcement?: AnnouncementBar | null;
  contactEmail?: string;
  companyName?: string;
  mainMenu?: MenuItem[];
}

function toRelativeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url || "/";
  }
}

function getMenuItemLabel(item: MenuItem, t: ReturnType<typeof useUiCopy>): string {
  if (item.type === "CATALOG") return t("header.menu.catalog_label") || item.title;
  return item.title;
}

function hasChildren(item: MenuItem): boolean {
  return Array.isArray(item.items) && item.items.length > 0;
}

function collectMenuLinks(items: MenuItem[], limit: number): MenuItem[] {
  const links: MenuItem[] = [];

  const visit = (item: MenuItem) => {
    if (links.length >= limit) return;
    if (item.title && item.url) links.push(item);
    for (const child of item.items ?? []) {
      if (links.length >= limit) return;
      visit(child);
    }
  };

  for (const item of items) {
    if (links.length >= limit) break;
    visit(item);
  }

  return links;
}

const mobileMenuItemMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export function Header({ announcement, contactEmail, companyName, mainMenu = [] }: HeaderProps) {
  const t = useUiCopy();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementState, setAnnouncementState] = useState<boolean | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useFocusTrap<HTMLDivElement>({
    active: isMobileMenuOpen,
    onEscape: () => setIsMobileMenuOpen(false),
  });
  const desktopMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = useCartStore((state) => state.itemCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { openLoginModal, isAuthenticated } = useAuthStore();

  const visibleMenu = mainMenu.filter((item) => item.title && item.url);
  const catalogMenu = visibleMenu.find((item) => item.type === "CATALOG" || toRelativeUrl(item.url) === "/wijnen");
  const mobileFeaturedLinks = collectMenuLinks(catalogMenu?.items?.length ? catalogMenu.items : visibleMenu, 4);
  const showMobileNavigationList = !mobileFeaturedLinks.length || visibleMenu.some(hasChildren) || visibleMenu.length > mobileFeaturedLinks.length;

  useEffect(() => {
    const dismissed = localStorage.getItem("vpl_announcement_dismissed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnouncementState(!dismissed);
  }, []);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setOpenDesktopMenu(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    window.dispatchEvent(new CustomEvent("vpl:mobile-menu", { detail: isMobileMenuOpen }));
    return () => {
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("vpl:mobile-menu", { detail: false }));
    };
  }, [isMobileMenuOpen]);

  const showAnnouncement = announcementState === true && Boolean(announcement?.message);
  const itemLabel = t(itemCount === 1 ? "common.item_singular" : "common.item_plural");
  const cartLabel =
    itemCount > 0
      ? t("header.cart.with_count", { count: itemCount, itemLabel })
      : t("header.cart.empty");

  const dismissAnnouncement = () => {
    setAnnouncementState(false);
    localStorage.setItem("vpl_announcement_dismissed", "true");
  };

  const openMenu = (title: string) => {
    if (desktopMenuTimeoutRef.current) clearTimeout(desktopMenuTimeoutRef.current);
    setOpenDesktopMenu(title);
  };

  const closeMenuSoon = () => {
    desktopMenuTimeoutRef.current = setTimeout(() => setOpenDesktopMenu(null), 120);
  };

  const handleSearchSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/wijnen?zoek=${encodeURIComponent(query)}`);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((previous) => {
      if (!previous) setTimeout(() => searchInputRef.current?.focus(), 100);
      return !previous;
    });
  };

  return (
    <header className={cn("sticky top-0 z-50 bg-white transition-shadow duration-200", hasScrolled && "shadow-md")}>
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
              <p className="text-xs sm:text-sm text-center pr-8 tracking-wide">{announcement?.message}</p>
              <button
                onClick={dismissAnnouncement}
                className="absolute right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-70 transition-opacity"
                aria-label={t("header.announcement.close")}
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 lg:h-32 relative">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden -ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-transparent p-2 text-wine transition-all duration-300 hover:-translate-y-0.5 hover:border-sand hover:bg-warm-white hover:shadow-sm active:translate-y-0"
              aria-label={t("header.menu.open")}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            <Link href="/" className="flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 group">
              <Logo variant="full" color="#1a1f3d" className="h-16 sm:h-20 lg:h-28 w-auto transition-transform duration-300 group-hover:scale-[1.02]" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {visibleMenu.map((item) => {
                const label = getMenuItemLabel(item, t);
                const expanded = openDesktopMenu === item.title;
                const children = item.items ?? [];
                return (
                  <div
                    key={`${item.title}-${item.url}`}
                    className="relative"
                    onMouseEnter={() => hasChildren(item) && openMenu(item.title)}
                    onMouseLeave={closeMenuSoon}
                    onFocus={() => hasChildren(item) && openMenu(item.title)}
                    onBlur={closeMenuSoon}
                  >
                    {hasChildren(item) ? (
                      <button
                        onClick={() => setOpenDesktopMenu(expanded ? null : item.title)}
                        aria-expanded={expanded}
                        aria-haspopup="true"
                        className={cn(
                          "flex items-center gap-1 py-2 text-nav uppercase text-charcoal hover:text-wine transition-colors",
                          expanded && "text-wine"
                        )}
                      >
                        {label}
                        <ChevronDownIcon className={cn("w-3.5 h-3.5 transition-transform duration-200", expanded && "rotate-180")} />
                      </button>
                    ) : (
                      <Link href={toRelativeUrl(item.url)} className="py-2 text-nav uppercase text-charcoal hover:text-wine transition-colors">
                        {label}
                      </Link>
                    )}

                    <AnimatePresence>
                      {expanded && children.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full w-[min(720px,calc(100vw-2rem))] bg-white border border-sand shadow-xl rounded-b-lg"
                          role="menu"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {children.map((group) => (
                              <div key={`${group.title}-${group.url}`}>
                                <Link
                                  href={toRelativeUrl(group.url)}
                                  onClick={() => setOpenDesktopMenu(null)}
                                  className="block text-label text-grey mb-3 hover:text-wine transition-colors"
                                >
                                  {group.title}
                                </Link>
                                {group.items?.length > 0 && (
                                  <ul className="space-y-2">
                                    {group.items.map((child) => (
                                      <li key={`${child.title}-${child.url}`}>
                                        <Link
                                          href={toRelativeUrl(child.url)}
                                          onClick={() => setOpenDesktopMenu(null)}
                                          className="block py-1 text-[15px] text-charcoal hover:text-wine transition-colors"
                                        >
                                          {child.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={handleSearchToggle}
                  className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  aria-label={t("header.search.label")}
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
                          onChange={(event) => setSearchQuery(event.target.value)}
                          placeholder={t("header.search.placeholder")}
                          className="w-56 px-4 py-2.5 text-sm text-charcoal placeholder:text-grey/50 outline-none bg-transparent"
                          onKeyDown={(event) => {
                            if (event.key === "Escape") setIsSearchOpen(false);
                          }}
                        />
                        <button type="submit" className="px-3 py-2.5 text-wine hover:bg-sand/30 transition-colors" aria-label={t("header.search.label")}>
                          <Search className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isAuthenticated ? (
                <a href="/account" className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0" aria-label={t("header.account.label")}>
                  <UserIcon className="w-5 h-5 text-wine" />
                </a>
              ) : (
                <button onClick={() => openLoginModal()} className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0" aria-label={t("header.auth.label")}>
                  <UserIcon className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={toggleCart}
                className="relative p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                aria-label={cartLabel}
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
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              id="mobile-navigation"
              className="fixed inset-y-0 left-0 z-50 w-full max-w-[430px] overflow-y-auto bg-cream shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label={t("header.menu.dialog_label")}
            >
              <div className="relative overflow-hidden bg-wine text-white">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gold/70" />
                <motion.div
                  className="px-5 pb-5 pt-5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex min-w-0 items-center gap-3">
                      <Logo variant="icon" color="#ffffff" className="h-12 w-auto shrink-0 opacity-95" />
                      {companyName && <span className="truncate font-serif text-[22px] leading-none text-white">{companyName}</span>}
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                      aria-label={t("header.menu.close")}
                    >
                      <CloseIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" strokeWidth={1.7} />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={t("header.search.placeholder")}
                      className="h-12 w-full rounded-md border border-white/15 bg-white/10 pl-11 pr-4 text-[15px] text-white outline-none transition-colors placeholder:text-white/60 focus:border-gold focus:bg-white/15"
                    />
                  </form>
                </motion.div>
              </div>

              <nav className="px-4 pb-32 pt-4">
                {mobileFeaturedLinks.length > 0 && (
                  <div className="mb-5 grid grid-cols-2 gap-2">
                    {mobileFeaturedLinks.map((item, index) => {
                      const itemKey = `${item.title} ${toRelativeUrl(item.url)}`.toLowerCase();
                      const Icon = itemKey.includes("contact") ? MailIcon : [WineBottleIcon, GrapeIcon, WineIcon, WineGlassesIcon][index % 4];
                      const label = getMenuItemLabel(item, t);

                      return (
                        <motion.div
                          key={`featured-${item.title}-${item.url}`}
                          {...mobileMenuItemMotion}
                          transition={{ ...mobileMenuItemMotion.transition, delay: 0.18 + index * 0.045 }}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.985 }}
                          className={cn(mobileFeaturedLinks.length % 2 === 1 && index === mobileFeaturedLinks.length - 1 && "col-span-2")}
                        >
                          <Link
                            href={toRelativeUrl(item.url)}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "group block min-h-[88px] rounded-md border border-sand bg-white p-3 shadow-sm transition-all duration-300 hover:border-gold/60 hover:bg-warm-white hover:shadow-[0_16px_34px_-28px_rgba(26,31,61,0.5)]",
                              mobileFeaturedLinks.length % 2 === 1 && index === mobileFeaturedLinks.length - 1 && "min-h-[76px]"
                            )}
                          >
                            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-wine/10 text-wine transition-all duration-300 group-hover:bg-wine group-hover:text-white group-hover:shadow-sm">
                              <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                            </span>
                            <span className="line-clamp-2 text-[14px] font-semibold leading-snug text-charcoal">{label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {showMobileNavigationList && (
                  <div className="rounded-md border border-sand bg-white shadow-sm">
                    <ul className="divide-y divide-sand/80">
                      {visibleMenu.map((item, index) => {
                        const label = getMenuItemLabel(item, t);
                        const expanded = mobileSubmenu === item.title;
                        return (
                          <motion.li
                            key={`${item.title}-${item.url}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 + index * 0.035, duration: 0.24 }}
                          >
                            {hasChildren(item) ? (
                              <>
                                <button
                                  onClick={() => setMobileSubmenu(expanded ? null : item.title)}
                                  className={cn(
                                    "flex min-h-[58px] w-full items-center justify-between gap-3 px-4 py-3 text-left text-[17px] font-semibold leading-tight transition-colors",
                                    expanded ? "bg-warm-white text-wine" : "text-charcoal hover:bg-warm-white hover:text-wine"
                                  )}
                                  aria-expanded={expanded}
                                >
                                  <span>{label}</span>
                                  <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.18 }} className="flex h-8 w-8 items-center justify-center rounded-md bg-cream text-wine">
                                    <ChevronRightIcon className="h-4 w-4" />
                                  </motion.span>
                                </button>
                                <AnimatePresence>
                                  {expanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.24, ease: "easeOut" }}
                                      className="overflow-hidden bg-cream/70"
                                    >
                                      <div className="space-y-2 px-4 pb-4 pt-3">
                                        {item.items.map((child) => (
                                          <div key={`${child.title}-${child.url}`} className="rounded-md border border-sand/75 bg-white">
                                            <Link
                                              href={toRelativeUrl(child.url)}
                                              onClick={() => setIsMobileMenuOpen(false)}
                                              className="flex min-h-[48px] items-center justify-between gap-3 px-3 py-2.5 text-[15px] font-semibold leading-snug text-charcoal transition-colors hover:text-wine"
                                            >
                                              <span>{child.title}</span>
                                              <ChevronRightIcon className="h-3.5 w-3.5 flex-none text-gold" />
                                            </Link>
                                            {child.items?.length > 0 && (
                                              <ul className="border-t border-sand/70 px-3 py-2">
                                                {child.items.map((grandChild) => (
                                                  <li key={`${grandChild.title}-${grandChild.url}`}>
                                                    <Link
                                                      href={toRelativeUrl(grandChild.url)}
                                                      onClick={() => setIsMobileMenuOpen(false)}
                                                      className="block rounded-sm px-2 py-2 text-[14px] leading-snug text-grey transition-colors hover:bg-warm-white hover:text-wine"
                                                    >
                                                      {grandChild.title}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            ) : (
                              <Link
                                href={toRelativeUrl(item.url)}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex min-h-[58px] items-center justify-between gap-3 px-4 py-3 text-[17px] font-semibold leading-tight text-charcoal transition-colors hover:bg-warm-white hover:text-wine"
                              >
                                <span>{label}</span>
                                <ChevronRightIcon className="h-4 w-4 text-gold" />
                              </Link>
                            )}
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <motion.div
                  {...mobileMenuItemMotion}
                  transition={{ ...mobileMenuItemMotion.transition, delay: 0.18 + mobileFeaturedLinks.length * 0.045 }}
                  className="mt-4 rounded-md border border-sand bg-white p-3 shadow-sm"
                >
                  {isAuthenticated ? (
                    <a
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex min-h-[50px] items-center gap-3 rounded-md px-2 text-[15px] font-semibold text-wine transition-colors hover:bg-warm-white"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-wine/10 transition-transform duration-300 group-hover:scale-105">
                        <UserIcon className="h-4 w-4 text-wine transition-transform duration-300 group-hover:scale-110" />
                      </span>
                      {t("header.account.label")}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openLoginModal();
                      }}
                      className="group flex min-h-[50px] w-full items-center gap-3 rounded-md px-2 text-left text-[15px] font-semibold text-wine transition-colors hover:bg-warm-white"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-wine/10 transition-transform duration-300 group-hover:scale-105">
                        <UserIcon className="h-4 w-4 text-wine transition-transform duration-300 group-hover:scale-110" />
                      </span>
                      {t("header.auth.mobile_label")}
                    </button>
                  )}

                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="group mt-2 flex min-h-[50px] items-center gap-3 rounded-md border-t border-sand px-2 pt-2 text-[15px] font-semibold text-charcoal transition-colors hover:bg-warm-white hover:text-wine"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-champagne/55 text-wine transition-transform duration-300 group-hover:scale-105">
                        <MailIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </span>
                      <span className="min-w-0 truncate">{contactEmail}</span>
                    </a>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
