import { getSiteSettings, getMenu, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";
import { Footer } from "./Footer";

export async function FooterWrapper() {
  const [settings, shopMenu, serviceMenu, aboutMenu] = await Promise.all([
    getSiteSettings(),
    getMenu("footer-shop"),
    getMenu("footer-service"),
    getMenu("footer-about"),
  ]);

  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS;

  // Filter out removed sections (Cadeaus, Blog) from CMS menus
  const hiddenLinks = ["cadeaus", "blog"];
  const shopLinks = shopMenu
    .filter((item) => !hiddenLinks.some((h) => item.url.toLowerCase().includes(h) || item.title.toLowerCase() === h))
    .map((item) => ({ title: item.title, url: item.url }));
  const serviceLinks = serviceMenu.map((item) => ({ title: item.title, url: item.url }));
  const aboutLinks = aboutMenu
    .filter((item) => !hiddenLinks.some((h) => item.url.toLowerCase().includes(h) || item.title.toLowerCase() === h))
    .map((item) => ({ title: item.title, url: item.url }));

  return (
    <Footer
      settings={siteSettings}
      shopLinks={shopLinks}
      serviceLinks={serviceLinks}
      aboutLinks={aboutLinks}
    />
  );
}
