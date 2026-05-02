import { getAnnouncementBar, getMenu, getSiteSettings } from "@/lib/shopify-cms";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const [announcement, settings, mainMenu] = await Promise.all([
    getAnnouncementBar(),
    getSiteSettings(),
    getMenu("main-menu"),
  ]);

  return (
    <Header
      announcement={announcement?.enabled && announcement.message ? announcement : null}
      contactEmail={settings?.email}
      mainMenu={mainMenu}
    />
  );
}
