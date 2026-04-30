import { getAnnouncementBar, getSiteSettings, DEFAULT_ANNOUNCEMENT, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";
import { getProducts } from "@/lib/shopify";
import { buildRegionLinks } from "@/lib/region-utils";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const [announcement, settings, products] = await Promise.all([
    getAnnouncementBar(),
    getSiteSettings(),
    getProducts(),
  ]);

  // Use CMS announcement if enabled AND not the deprecated WELKOM10 promo.
  // When Carla sets enabled=false in Shopify Admin, this check is no longer needed.
  const isDeprecatedPromo = announcement?.message?.includes('WELKOM10');
  const announcementData = (announcement?.enabled && announcement.message && !isDeprecatedPromo)
    ? announcement
    : DEFAULT_ANNOUNCEMENT;
  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS;
  const regionLinks = buildRegionLinks(products);

  return (
    <Header
      announcement={announcementData}
      contactEmail={siteSettings.email}
      regionLinks={regionLinks}
    />
  );
}
