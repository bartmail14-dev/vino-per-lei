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
  MailIcon,
} from "@/components/icons";
import type { AnnouncementBar, MenuItem } from "@/lib/shopify-cms";

interface HeaderProps {
  announcement?: AnnouncementBar | null;
  contactEmail?: string;
  companyName?: string;
  mainMenu?: MenuItem[];
}

function toRelativeUrl(url: string): string {
  const pageAliases: Record<string, string> = {
    contact: "contact",
    contacten: "contact",
    privacy: "privacy",
    privacybeleid: "privacy",
    voorwaarden: "voorwaarden",
    "algemene-voorwaarden": "voorwaarden",
  };

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/^\/(?:en|nl)(?=\/)/, "");
    if (pathname.startsWith("/pages/")) {
      const pageHandle = pathname.replace(/^\/pages\//, "");
      return `/${pageAliases[pageHandle] ?? pageHandle}${parsed.search}${parsed.hash}`;
    }
    return pathname + parsed.search + parsed.hash;
  } catch {
    const [pathWithSearch = "", hash = ""] = (url || "/").split("#");
    const [path = "", search = ""] = pathWithSearch.split("?");
    const pathname = path.replace(/^\/(?:en|nl)(?=\/)/, "");
    if (pathname.startsWith("/pages/")) {
      const pageHandle = pathname.replace(/^\/pages\//, "");
      return `/${pageAliases[pageHandle] ?? pageHandle}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`;
    }
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
  const { openLoginModal, isAuthenticated, isHydrated, fetchCustomer } = useAuthStore();

  const visibleMenu = mainMenu.filter((item) => item.title && item.url);

  useEffect(() => {
    const dismissed = localStorage.getItem("vpl_announcement_dismissed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnouncementState(!dismissed);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    void fetchCustomer();
  }, [fetchCustomer, isHydrated]);

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

            <Link href="/" className="group flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
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
              className="fixed inset-y-0 left-0 z-50 w-full max-w-[430px] overflow-y-auto bg-wine bg-[linear-gradient(165deg,#1a1f3d_0%,#252b4d_45%,#12152b_100%)] shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label={t("header.menu.dialog_label")}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_15%_-5%,rgba(201,162,39,0.16),transparent_60%)]"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -right-6 top-[30%] select-none font-serif text-[11rem] italic leading-none text-white/[0.04]"
                aria-hidden="true"
              >
                {companyName ? companyName.split(" ")[0] : ""}
              </span>
              <div className="relative text-white">
                <motion.div
                  className="px-6 pt-5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    >
                      <Logo variant="icon" color="#ffffff" className="h-11 w-auto shrink-0 opacity-95" />
                      {companyName && (
                        <span className="truncate font-serif text-xl italic leading-none text-cream/90">{companyName}</span>
                      )}
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-white/5 text-white transition-all hover:rotate-90 hover:border-gold/70 hover:bg-white/10"
                      aria-label={t("header.menu.close")}
                    >
                      <CloseIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="relative mt-7">
                    <Search className="pointer-events-none absolute left-0 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold/80" strokeWidth={1.6} />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={t("header.search.placeholder")}
                      className="h-12 w-full border-b border-white/20 bg-transparent pl-8 pr-2 font-serif text-lg italic text-white outline-none transition-colors placeholder:text-white/45 focus:border-gold"
                    />
                  </form>
                </motion.div>
              </div>

              <nav className="relative px-6 pb-24 pt-8">
                <ul>
                  {visibleMenu.map((item, index) => {
                    const label = getMenuItemLabel(item, t);
                    const expanded = mobileSubmenu === item.title;
                    const number = String(index + 1).padStart(2, "0");
                    return (
                      <motion.li
                        key={`${item.title}-${item.url}`}
                        initial={{ opacity: 0, y: 26 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="border-b border-white/10"
                      >
                        {hasChildren(item) ? (
                          <>
                            <button
                              onClick={() => setMobileSubmenu(expanded ? null : item.title)}
                              className="group flex w-full items-center gap-4 py-5 text-left"
                              aria-expanded={expanded}
                            >
                              <span className={cn("w-7 shrink-0 font-serif text-sm italic transition-colors", expanded ? "text-gold" : "text-gold/60 group-hover:text-gold")}>
                                {number}
                              </span>
                              <span className={cn("min-w-0 truncate font-serif text-[2rem] font-medium leading-none tracking-tight transition-colors", expanded ? "text-gold" : "text-cream group-hover:text-gold")}>
                                {label}
                              </span>
                              <motion.span
                                animate={{ rotate: expanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold"
                              >
                                <ChevronRightIcon className="h-4 w-4" />
                              </motion.span>
                            </button>
                            <AnimatePresence>
                              {expanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.26, ease: "easeOut" }}
                                  className="overflow-hidden"
                                >
                                  <ul className="mb-5 ml-3 space-y-1 border-l border-gold/25 pl-7">
                                    {item.items.map((child) => (
                                      <li key={`${child.title}-${child.url}`}>
                                        <Link
                                          href={toRelativeUrl(child.url)}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                          className="group flex min-h-[44px] items-center gap-3 py-1.5 font-serif text-xl text-cream/85 transition-colors hover:text-gold"
                                        >
                                          <span className="h-px w-4 shrink-0 bg-gold/50 transition-all duration-300 group-hover:w-7" aria-hidden="true" />
                                          <span className="min-w-0 truncate">{child.title}</span>
                                        </Link>
                                        {child.items?.length > 0 && (
                                          <ul className="mb-2 space-y-1 pl-7">
                                            {child.items.map((grandChild) => (
                                              <li key={`${grandChild.title}-${grandChild.url}`}>
                                                <Link
                                                  href={toRelativeUrl(grandChild.url)}
                                                  onClick={() => setIsMobileMenuOpen(false)}
                                                  className="block py-1.5 text-[15px] leading-snug text-white/60 transition-colors hover:text-gold"
                                                >
                                                  {grandChild.title}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={toRelativeUrl(item.url)}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="group flex items-center gap-4 py-5"
                          >
                            <span className="w-7 shrink-0 font-serif text-sm italic text-gold/60 transition-colors group-hover:text-gold">
                              {number}
                            </span>
                            <span className="min-w-0 truncate font-serif text-[2rem] font-medium leading-none tracking-tight text-cream transition-colors group-hover:text-gold">
                              {label}
                            </span>
                            <ChevronRightIcon className="ml-auto h-5 w-5 shrink-0 -translate-x-2 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + visibleMenu.length * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mt-9 space-y-1"
                >
                  {isAuthenticated ? (
                    <a
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex min-h-[52px] items-center gap-4 text-[15px] font-medium tracking-wide text-cream/90 transition-colors hover:text-gold"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold transition-all duration-300 group-hover:border-gold/60 group-hover:bg-gold/20">
                        <UserIcon className="h-4 w-4" />
                      </span>
                      {t("header.account.label")}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openLoginModal();
                      }}
                      className="group flex min-h-[52px] w-full items-center gap-4 text-left text-[15px] font-medium tracking-wide text-cream/90 transition-colors hover:text-gold"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold transition-all duration-300 group-hover:border-gold/60 group-hover:bg-gold/20">
                        <UserIcon className="h-4 w-4" />
                      </span>
                      {t("header.auth.mobile_label")}
                    </button>
                  )}

                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="group flex min-h-[52px] items-center gap-4 text-[15px] font-medium tracking-wide text-cream/90 transition-colors hover:text-gold"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold transition-all duration-300 group-hover:border-gold/60 group-hover:bg-gold/20">
                        <MailIcon className="h-4 w-4" />
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
