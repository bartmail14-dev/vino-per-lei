import type { Metadata } from "next";
import { HandleidingContent } from "./HandleidingContent";

export const metadata: Metadata = {
  title: "Shopify Handleiding | Vino per Lei",
  description: "Handleiding voor het beheren van de Vino per Lei webshop via Shopify.",
  robots: { index: false, follow: false },
};

export default function HandleidingPage() {
  return <HandleidingContent />;
}
