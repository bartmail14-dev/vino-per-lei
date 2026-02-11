import type { Metadata } from "next";
import { OfferteContent } from "./OfferteContent";

export const metadata: Metadata = {
  title: "Offerte Webshop | Blue Wire Media",
  description:
    "Offerte voor de ontwikkeling van de Vino per Lei webshop. Custom Next.js + Shopify Headless oplossing.",
  robots: { index: false, follow: false },
};

export default function OffertePage() {
  return <OfferteContent />;
}
