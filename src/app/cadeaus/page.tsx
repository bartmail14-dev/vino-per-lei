import Link from "next/link";
import { Section } from "@/components/layout";
import { GiftBoxIcon } from "./GiftBoxIcon";

export const metadata = {
  title: "Cadeaus | Vino per Lei",
  description: "Wijn cadeaus voor elke gelegenheid — binnenkort beschikbaar.",
};

export default function CadeausPage() {
  return (
    <Section background="warm" spacing="xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-wine/10 flex items-center justify-center">
            <GiftBoxIcon className="w-10 h-10 sm:w-12 sm:h-12 text-wine" />
          </div>
        </div>
        <p className="text-label text-wine mb-2">Binnenkort Beschikbaar</p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
          Cadeau Pagina
        </h1>
        <p className="text-grey text-base sm:text-lg mb-4 leading-relaxed">
          Deze pagina wordt nog gebouwd. Binnenkort vind je hier onze prachtige
          wijn cadeaupakketten, geschenksets en gepersonaliseerde cadeaus voor
          elke gelegenheid.
        </p>
        <p className="text-grey/70 text-sm mb-8">
          Neem in de tussentijd gerust contact op als je een wijncadeau zoekt —
          we helpen je graag!
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-6 bg-wine text-white font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine-dark transition-colors"
          >
            Terug naar Home
          </Link>
          <Link
            href="/wijnen"
            className="inline-flex items-center justify-center h-12 px-6 border-2 border-wine text-wine font-semibold uppercase tracking-wide text-sm rounded hover:bg-wine hover:text-white transition-colors"
          >
            Bekijk Wijnen
          </Link>
        </div>
      </div>
    </Section>
  );
}
