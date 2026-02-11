import type { Metadata } from "next";
import { Suspense } from "react";
import { WijnenContent, WijnenLoading } from "./WijnenClient";

export const metadata: Metadata = {
  title: "Onze Wijnen | Vino per Lei",
  description:
    "Ontdek onze zorgvuldig geselecteerde collectie authentieke Italiaanse wijnen. Filter op regio, druivenras, prijs en smaakprofiel. Gratis verzending vanaf €35.",
  openGraph: {
    title: "Onze Wijnen | Vino per Lei",
    description:
      "Authentieke Italiaanse wijnen uit Piemonte, Veneto, Toscana en meer. Bestel online met gratis verzending vanaf €35.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino per Lei",
  },
};

export default function WijnenPage() {
  return (
    <Suspense fallback={<WijnenLoading />}>
      <WijnenContent />
    </Suspense>
  );
}
