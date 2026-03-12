import { getAnnouncementBar, getSiteSettings, DEFAULT_ANNOUNCEMENT, DEFAULT_SITE_SETTINGS } from "@/lib/shopify-cms";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const [announcement, settings] = await Promise.all([
    getAnnouncementBar(),
    getSiteSettings(),
  ]);

  const announcementData = announcement ?? DEFAULT_ANNOUNCEMENT;
  const siteSettings = settings ?? DEFAULT_SITE_SETTINGS;

  return (
    <Header
      announcement={announcementData}
      contactPhone={siteSettings.phone}
      contactEmail={siteSettings.email}
    />
  );
}
