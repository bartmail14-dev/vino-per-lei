import type { Metadata } from "next";
import { KlantenserviceContent } from "./KlantenserviceContent";

export const metadata: Metadata = {
  title: "Klantenservice | Vino per Lei",
  description:
    "Hoe kunnen wij je helpen? Vind informatie over verzending, retourneren, veelgestelde vragen en meer.",
};

export default function KlantenservicePage() {
  return <KlantenserviceContent />;
}
