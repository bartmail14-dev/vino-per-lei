import Link from "next/link";
import { Section } from "@/components/layout";

export const metadata = {
  title: "Over Ons | Vino per Lei",
  description: "Ons verhaal — binnenkort beschikbaar.",
};

export default function OverOnsPage() {
  return (
    <Section background="warm" spacing="xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-wine/10 flex items-center justify-center">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <p className="text-label text-wine mb-2">Binnenkort Beschikbaar</p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
          Over Ons
        </h1>
        <p className="text-grey text-base sm:text-lg mb-4 leading-relaxed">
          Deze pagina wordt nog gebouwd. Binnenkort lees je hier ons verhaal —
          wie we zijn, onze passie voor Italiaanse wijnen en waarom we doen
          wat we doen.
        </p>
        <p className="text-grey/70 text-sm mb-8">
          Wil je alvast meer weten? Stuur ons een berichtje, we vertellen je
          graag alles over Vino per Lei.
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
