import { getMenuWithTitle, getSiteSettings, type ShopifyMenu } from "@/lib/shopify-cms";
import { Footer } from "./Footer";

const footerTitleMap: Record<string, string> = {
  "footer-shop": "Shop",
  "footer-service": "Klantenservice",
  "footer-about": "Over Ons",
};

export async function FooterWrapper() {
  const [settings, shopMenu, serviceMenu, aboutMenu] = await Promise.all([
    getSiteSettings(),
    getMenuWithTitle("footer-shop"),
    getMenuWithTitle("footer-service"),
    getMenuWithTitle("footer-about"),
  ]);

  const footerSections = [shopMenu, serviceMenu, aboutMenu]
    .filter((menu): menu is ShopifyMenu => Boolean(menu && menu.items.length > 0))
    .map((menu) => ({
      title: footerTitleMap[menu.title] ?? menu.title,
      links: menu.items
        .filter((item) => !item.url.includes("/cadeaus"))
        .map((item) => ({ title: item.title, url: item.url })),
    }));

  return <Footer settings={settings ?? undefined} sections={footerSections} />;
}
