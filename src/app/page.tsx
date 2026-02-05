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

function GrapeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="10" r="2.5" />
      <circle cx="8" cy="14" r="2.5" />
      <circle cx="16" cy="14" r="2.5" />
      <circle cx="10" cy="18" r="2.5" />
      <circle cx="14" cy="18" r="2.5" />
      <path d="M12 4V7.5" strokeLinecap="round" />
      <path d="M12 4C12 4 14 3 15 4" strokeLinecap="round" />
    </svg>
  );
}

function WineBottleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2h4v4l2 3v11a2 2 0 01-2 2h-4a2 2 0 01-2-2V9l2-3V2z" />
      <path d="M10 13h4" strokeLinecap="round" />
    </svg>
  );
}

function TuscanyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Cypress tree silhouette - iconic Tuscan symbol */}
      <path d="M12 22V8" strokeLinecap="round" />
      <path d="M12 3C12 3 8 6 8 10C8 14 10 16 12 18C14 16 16 14 16 10C16 6 12 3 12 3Z" fill="currentColor" opacity="0.3" />
      <path d="M12 3C12 3 8 6 8 10C8 14 10 16 12 18C14 16 16 14 16 10C16 6 12 3 12 3Z" />
    </svg>
  );
}

// Elegant category icons
function RedWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      {/* Wine glass with red wine */}
      <path
        d="M24 38V28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 42H32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 8H34L32 20C31.5 24 28 28 24 28C20 28 16.5 24 16 20L14 8Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 16C16.5 19 19.5 22 24 22C28.5 22 31.5 19 32 16L32.5 12H15.5L16 16Z"
        fill="#1a1f3d"
        opacity="0.8"
      />
    </svg>
  );
}

function WhiteWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      {/* Elegant wine glass */}
      <path
        d="M24 38V28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 42H32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 8H34L32 20C31.5 24 28 28 24 28C20 28 16.5 24 16 20L14 8Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M17 14C17.3 16 19.5 18 24 18C28.5 18 30.7 16 31 14L31.5 11H16.5L17 14Z"
        fill="#c9a227"
        opacity="0.5"
      />
    </svg>
  );
}

function RoseWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      {/* Wine glass with rosé */}
      <path
        d="M24 38V28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 42H32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 8H34L32 20C31.5 24 28 28 24 28C20 28 16.5 24 16 20L14 8Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16.5 15C17 17.5 20 20 24 20C28 20 31 17.5 31.5 15L32 11H16L16.5 15Z"
        fill="#ffa38b"
        opacity="0.7"
      />
    </svg>
  );
}

function BubblesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      {/* Champagne flute with bubbles */}
      <path
        d="M24 40V30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 44H30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 4H28L27 18C26.8 22 25.5 30 24 30C22.5 30 21.2 22 21 18L20 4Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M21.5 12C21.7 15 22.8 20 24 20C25.2 20 26.3 15 26.5 12L27 6H21L21.5 12Z"
        fill="#c9a227"
        opacity="0.4"
      />
      {/* Bubbles */}
      <circle cx="23" cy="14" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="25" cy="10" r="0.8" fill="currentColor" opacity="0.4" />
      <circle cx="24" cy="17" r="0.6" fill="currentColor" opacity="0.3" />
      <circle cx="22.5" cy="11" r="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function GiftBoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      {/* Elegant gift box */}
      <rect
        x="8"
        y="18"
        width="32"
        height="24"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="6"
        y="12"
        width="36"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Ribbon vertical */}
      <path
        d="M24 12V42"
        stroke="#1a1f3d"
        strokeWidth="3"
        opacity="0.8"
      />
      {/* Ribbon horizontal */}
      <path
        d="M6 16H42"
        stroke="#1a1f3d"
        strokeWidth="3"
        opacity="0.8"
      />
      {/* Bow */}
      <path
        d="M18 12C18 8 20 6 24 6C28 6 30 8 30 12"
        stroke="#1a1f3d"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
      <circle cx="24" cy="12" r="2" fill="#1a1f3d" opacity="0.8" />
    </svg>
  );
}

const featuredProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 4);

const wineCategories = [
  {
    name: "Rode Wijn",
    description: "Vol & Rijk",
    href: "/wijnen/rood",
    color: "bg-wine/10 hover:bg-wine/15",
    iconColor: "text-wine",
    Icon: RedWineIcon,
  },
  {
    name: "Witte Wijn",
    description: "Fris & Fruitig",
    href: "/wijnen/wit",
    color: "bg-gold/10 hover:bg-gold/15",
    iconColor: "text-gold",
    Icon: WhiteWineIcon,
  },
  {
    name: "Rosé",
    description: "Licht & Zomers",
    href: "/wijnen/rose",
    color: "bg-coral/10 hover:bg-coral/15",
    iconColor: "text-coral",
    Icon: RoseWineIcon,
  },
  {
    name: "Bubbels",
    description: "Feestelijk",
    href: "/wijnen/mousserende",
    color: "bg-champagne hover:bg-gold/20",
    iconColor: "text-charcoal",
    Icon: BubblesIcon,
  },
  {
    name: "Cadeaus",
    description: "Perfect Verpakt",
    href: "/cadeaus",
    color: "bg-wine/5 hover:bg-wine/10",
    iconColor: "text-charcoal",
    Icon: GiftBoxIcon,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
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
              className="text-gold font-medium tracking-wider uppercase mb-4"
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
              <span className="text-gold">in Elk Glas</span>
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

      {/* Italy Wine Regions Map */}
      <Section background="warm" spacing="lg">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-label text-wine mb-2">Ontdek per Regio</p>
            <h2 className="text-h2 mb-4">Van Piemonte tot Toscane</h2>
            <p className="text-body text-grey mb-6">
              Onze selectie komt uit de mooiste wijnregio's van Noord-Italië en
              Toscane. Van de mistige heuvels van Piemonte waar Barolo en
              Barbaresco hun thuis vinden, tot het glooiende landschap van
              Toscane met zijn iconische Chianti. Klik op een regio om te ontdekken.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/wijnen?region=piemonte"
                className="inline-flex items-center gap-2 px-4 py-2 bg-wine/10 text-wine rounded-full text-sm font-medium hover:bg-wine/20 transition-colors"
              >
                <GrapeIcon className="w-4 h-4" /> Piemonte
              </Link>
              <Link
                href="/wijnen?region=veneto"
                className="inline-flex items-center gap-2 px-4 py-2 bg-wine/10 text-wine rounded-full text-sm font-medium hover:bg-wine/20 transition-colors"
              >
                <WineBottleIcon className="w-4 h-4" /> Veneto
              </Link>
              <Link
                href="/wijnen?region=toscana"
                className="inline-flex items-center gap-2 px-4 py-2 bg-wine/10 text-wine rounded-full text-sm font-medium hover:bg-wine/20 transition-colors"
              >
                <TuscanyIcon className="w-4 h-4" /> Toscana
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <ItalyWineMap size="lg" />
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

      {/* Category Quick Links */}
      <Section background="warm" spacing="lg">
        <div className="text-center mb-10">
          <p className="text-label text-wine mb-2">Shop per Categorie</p>
          <h2 className="text-h2">Ontdek Onze Collectie</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {wineCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`${category.color} rounded-xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1 group`}
            >
              <div className={`${category.iconColor} mb-3 flex justify-center`}>
                <category.Icon className="w-12 h-12 transition-transform group-hover:scale-110" />
              </div>
              <h3 className="font-semibold text-charcoal mb-1">{category.name}</h3>
              <p className="text-sm text-grey">{category.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Gift Banner */}
      <Section background="default" spacing="lg">
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
            <Link href="/cadeaus">
              <Button variant="primary">Bekijk Cadeaus</Button>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-wine/5 to-wine/10 rounded-2xl aspect-video flex items-center justify-center">
            <GiftBoxIcon className="w-32 h-32 text-wine/60" />
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
