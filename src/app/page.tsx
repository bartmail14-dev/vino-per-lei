"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Section, Grid } from "@/components/layout";
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { ItalyWineMap } from "@/components/map";
import { mockProducts } from "@/data/mockProducts";

// Icons
function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const featuredProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 4);

const wineCategories = [
  {
    name: "Rode Wijn",
    description: "Vol & Rijk",
    href: "/wijnen/rood",
    color: "bg-wine/10",
    icon: "🍷",
  },
  {
    name: "Witte Wijn",
    description: "Fris & Fruitig",
    href: "/wijnen/wit",
    color: "bg-gold/10",
    icon: "🥂",
  },
  {
    name: "Rosé",
    description: "Licht & Zomers",
    href: "/wijnen/rose",
    color: "bg-coral/10",
    icon: "🌸",
  },
  {
    name: "Bubbels",
    description: "Feestelijk",
    href: "/wijnen/mousserende",
    color: "bg-champagne",
    icon: "🍾",
  },
  {
    name: "Cadeaus",
    description: "Perfect Verpakt",
    href: "/cadeaus",
    color: "bg-wine/5",
    icon: "🎁",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-banner.png"
            alt="Italiaanse wijn met antipasti"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="text-coral font-medium tracking-wider uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Authentieke Italiaanse Wijnen
            </motion.p>
            <motion.h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              La Dolce Vita
              <br />
              <span className="text-coral">in Elk Glas</span>
            </motion.h1>
            <motion.p
              className="text-lg text-white/90 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Ontdek onze zorgvuldig geselecteerde collectie Italiaanse wijnen.
              Van krachtige Barolo tot frisse Pinot Grigio — wij brengen het beste
              van Italië naar jouw tafel.
            </motion.p>
            <motion.div
              className="flex gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link
                href="/wijnen"
                className="inline-flex items-center justify-center h-14 px-8 bg-wine text-white font-semibold uppercase tracking-wide rounded hover:bg-wine-dark transition-colors"
              >
                Bekijk Collectie
              </Link>
              <Link
                href="/over-ons"
                className="inline-flex items-center justify-center h-14 px-8 border-2 border-white text-white font-semibold uppercase tracking-wide rounded hover:bg-white hover:text-charcoal transition-colors"
              >
                Ons Verhaal
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* USP Bar */}
      <Section background="warm" spacing="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
          <div className="flex items-center justify-center gap-3 text-center">
            <TruckIcon className="w-6 h-6 text-wine flex-shrink-0" />
            <div>
              <p className="font-semibold text-charcoal">Gratis verzending</p>
              <p className="text-sm text-grey">vanaf €35</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-center">
            <RefreshIcon className="w-6 h-6 text-wine flex-shrink-0" />
            <div>
              <p className="font-semibold text-charcoal">Gratis retour</p>
              <p className="text-sm text-grey">binnen 14 dagen</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-center">
            <StarIcon className="w-6 h-6 text-gold flex-shrink-0" />
            <div>
              <p className="font-semibold text-charcoal">100% Proefgarantie</p>
              <p className="text-sm text-grey">Niet lekker? Geld terug</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Category Quick Links */}
      <Section background="default" spacing="lg">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {wineCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`${category.color} rounded-lg p-4 text-center transition-all hover:shadow-md hover:-translate-y-0.5`}
            >
              <span className="text-3xl mb-2 block">{category.icon}</span>
              <h3 className="font-semibold text-charcoal">{category.name}</h3>
              <p className="text-sm text-grey">{category.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Italy Wine Regions Map */}
      <Section background="warm" spacing="lg">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-label text-wine mb-2">Ontdek per Regio</p>
            <h2 className="text-h2 mb-4">Van Piemonte tot Puglia</h2>
            <p className="text-body text-grey mb-6">
              Italië is een land van ongeëvenaarde wijnvariëteit. Van de mistige
              heuvels van Piemonte waar Barolo en Barbaresco hun thuis vinden,
              tot het zonnige Puglia waar Primitivo de toon zet. Klik op een
              regio om de bijzondere wijnen te ontdekken.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/wijnen?region=piemonte"
                className="inline-flex items-center gap-2 px-4 py-2 bg-wine/10 text-wine rounded-full text-sm font-medium hover:bg-wine/20 transition-colors"
              >
                <span>🍇</span> Piemonte
              </Link>
              <Link
                href="/wijnen?region=veneto"
                className="inline-flex items-center gap-2 px-4 py-2 bg-wine/10 text-wine rounded-full text-sm font-medium hover:bg-wine/20 transition-colors"
              >
                <span>🍷</span> Veneto
              </Link>
              <Link
                href="/wijnen?region=puglia"
                className="inline-flex items-center gap-2 px-4 py-2 bg-wine/10 text-wine rounded-full text-sm font-medium hover:bg-wine/20 transition-colors"
              >
                <span>☀️</span> Puglia
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <ItalyWineMap size="lg" showLegend />
          </div>
        </div>
      </Section>

      {/* Featured Products */}
      <Section background="default" spacing="lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-h2">Onze Favorieten</h2>
          <Link
            href="/wijnen"
            className="flex items-center gap-1 text-wine font-medium hover:underline"
          >
            Bekijk alles
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <Grid cols={4} gap="md">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </Section>

      {/* Gift Banner */}
      <Section background="warm" spacing="lg">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-label text-wine mb-2">Cadeau Tip</p>
            <h2 className="text-h2 mb-4">
              Het perfecte cadeau voor wijnliefhebbers
            </h2>
            <p className="text-body text-grey mb-6">
              Verras iemand met een prachtig verpakte fles wijn. Inclusief
              geschenkverpakking en persoonlijk kaartje.
            </p>
            <Button variant="primary">Bekijk Cadeaus</Button>
          </div>
          <div className="bg-wine/5 rounded-lg aspect-video flex items-center justify-center">
            <span className="text-6xl">🎁</span>
          </div>
        </div>
      </Section>

      {/* Wine Types */}
      <Section background="default" spacing="lg">
        <h2 className="text-h2 mb-8 text-center">Ontdek op Smaak</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              type: "Rode Wijn",
              description: "Vol, rijk & karaktervol",
              href: "/wijnen/rood",
              bgClass: "bg-wine/10",
            },
            {
              type: "Witte Wijn",
              description: "Fris, fruitig & elegant",
              href: "/wijnen/wit",
              bgClass: "bg-gold/10",
            },
            {
              type: "Rosé",
              description: "Licht, zomers & verfrissend",
              href: "/wijnen/rose",
              bgClass: "bg-coral/10",
            },
          ].map((wine) => (
            <Link
              key={wine.type}
              href={wine.href}
              className={`${wine.bgClass} rounded-lg p-8 text-center transition-all hover:shadow-lg group`}
            >
              <div className="w-16 h-24 bg-wine/20 rounded mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">
                {wine.type}
              </h3>
              <p className="text-grey mb-4">{wine.description}</p>
              <span className="inline-flex items-center gap-1 text-wine font-medium group-hover:underline">
                Ontdek
                <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Newsletter */}
      <Section background="warm" spacing="lg">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-h2 mb-4">Blijf op de hoogte</h2>
          <p className="text-grey mb-6">
            Ontvang als eerste nieuwe wijnen en exclusieve aanbiedingen.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="je@email.nl"
              className="px-4 py-3 rounded border border-sand focus:border-wine focus:outline-none flex-1 max-w-sm"
            />
            <Button type="submit" variant="primary">
              Aanmelden
            </Button>
          </form>
        </div>
      </Section>
    </>
  );
}
