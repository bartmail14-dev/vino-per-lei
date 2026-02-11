import Link from "next/link";
import { Section } from "@/components/layout";

export const metadata = {
  title: "Blog | Vino per Lei",
  description: "Wijn verhalen, regiogidsen en tips — binnenkort beschikbaar.",
};

export default function BlogPage() {
  return (
    <Section background="warm" spacing="xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-wine/10 flex items-center justify-center">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              <path d="M8 7h8M8 11h6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <p className="text-label text-wine mb-2">Binnenkort Beschikbaar</p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
          Wijn Verhalen
        </h1>
        <p className="text-grey text-base sm:text-lg mb-4 leading-relaxed">
          Deze pagina wordt nog gebouwd. Binnenkort vind je hier artikelen over
          Italiaanse wijnregio&apos;s, druivenrassen, food pairing tips en meer.
        </p>
        <p className="text-grey/70 text-sm mb-8">
          Bekijk in de tussentijd onze collectie wijnen — elk etiket vertelt
          een verhaal.
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
