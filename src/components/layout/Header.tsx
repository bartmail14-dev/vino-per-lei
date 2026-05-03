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
import { MenuIcon, CloseIcon, UserIcon, CartIcon, ChevronDownIcon, ChevronRightIcon } from "@/components/icons";
import type { AnnouncementBar, MenuItem } from "@/lib/shopify-cms";

interface HeaderProps {
  announcement?: AnnouncementBar | null;
  contactEmail?: string;
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

export function Header({ announcement, contactEmail, mainMenu = [] }: HeaderProps) {
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
    return () => {
      document.body.style.overflow = "";
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
    router.push(`/wijnen?zoek=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
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
              className="lg:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-60 transition-opacity"
              aria-label={t("header.menu.open")}
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
                  className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
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
                <a href="/account" className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors" aria-label={t("header.account.label")}>
                  <UserIcon className="w-5 h-5 text-wine" />
                </a>
              ) : (
                <button onClick={() => openLoginModal()} className="hidden lg:flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors" aria-label={t("header.auth.label")}>
                  <UserIcon className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={toggleCart}
                className="relative p-3 min-w-[44px] min-h-[44px] hover:bg-sand/50 rounded-md transition-colors"
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
              className="fixed top-0 left-0 bottom-0 w-[88vw] max-w-sm rounded-r-3xl bg-cream z-50 overflow-y-auto lg:hidden shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={t("header.menu.dialog_label")}
            >
              <div className="bg-wine-gradient px-5 pt-6 pb-6 rounded-br-[2rem]">
                <div className="flex items-center justify-between mb-4">
                  <Logo variant="icon" color="#ffffff" className="h-12 w-auto opacity-95" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    aria-label={t("header.menu.close")}
                  >
                    <CloseIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <nav className="px-5 pt-6 pb-32">
                <ul className="space-y-0.5">
                  {visibleMenu.map((item, index) => {
                    const label = getMenuItemLabel(item, t);
                    const expanded = mobileSubmenu === item.title;
                    return (
                      <motion.li
                        key={`${item.title}-${item.url}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                      >
                        {hasChildren(item) ? (
                          <>
                            <button
                              onClick={() => setMobileSubmenu(expanded ? null : item.title)}
                              className={cn(
                                "flex items-center justify-between w-full py-3.5 text-[17px] font-medium tracking-wide transition-colors rounded-lg px-3 -mx-3",
                                expanded ? "text-wine bg-wine/5" : "text-charcoal hover:text-wine hover:bg-wine/5"
                              )}
                            >
                              {label}
                              <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronRightIcon className={cn("w-4 h-4 transition-colors", expanded ? "text-gold" : "text-grey")} />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {expanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="ml-3 pl-4 pb-4 pt-1 space-y-3 border-l-2 border-gold/30">
                                    {item.items.map((child) => (
                                      <div key={`${child.title}-${child.url}`}>
                                        <Link
                                          href={toRelativeUrl(child.url)}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                          className="block py-2 text-[15px] font-medium text-charcoal/90 hover:text-wine transition-colors"
                                        >
                                          {child.title}
                                        </Link>
                                        {child.items?.length > 0 && (
                                          <ul className="pl-3 space-y-0.5">
                                            {child.items.map((grandChild) => (
                                              <li key={`${grandChild.title}-${grandChild.url}`}>
                                                <Link
                                                  href={toRelativeUrl(grandChild.url)}
                                                  onClick={() => setIsMobileMenuOpen(false)}
                                                  className="block py-1.5 text-[14px] text-charcoal/70 hover:text-wine transition-colors"
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
                            className="block py-3.5 text-[17px] font-medium tracking-wide text-charcoal hover:text-wine hover:bg-wine/5 transition-colors rounded-lg px-3 -mx-3"
                          >
                            {label}
                          </Link>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>

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
                      {t("header.account.label")}
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
                      {t("header.auth.mobile_label")}
                    </button>
                  )}
                </div>

                {contactEmail && (
                  <div className="mt-8 pt-6 border-t border-sand/60">
                    <p className="text-[10px] text-gold font-semibold uppercase tracking-[0.15em] mb-3">{t("header.contact.label")}</p>
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-sm text-charcoal hover:text-wine transition-colors">
                      <span className="w-8 h-8 rounded-lg bg-champagne/50 flex items-center justify-center text-xs">&#9993;</span>
                      {contactEmail}
                    </a>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
