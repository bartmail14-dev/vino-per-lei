import type { Metadata } from "next";
import { KlantenserviceContent } from "./KlantenserviceContent";

export const revalidate = 3600; // 1 hour — static CMS content

export const metadata: Metadata = {
  title: "Klantenservice | Vino per Lei",
  description:
    "Hoe kunnen wij je helpen? Vind informatie over verzending, retourneren, veelgestelde vragen en meer.",
  openGraph: {
    title: "Klantenservice | Vino per Lei",
    description:
      "Hoe kunnen wij je helpen? Vind informatie over verzending, retourneren, veelgestelde vragen en meer.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default function KlantenservicePage() {
  return <KlantenserviceContent />;
}
