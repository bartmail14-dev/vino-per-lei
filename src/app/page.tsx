import Link from "next/link";
import { Section, Grid } from "@/components/layout";
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { mockProducts } from "@/data/mockProducts";
import dynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, StarIcon, ChevronRightIcon, GrapeIcon, WineBottleIcon } from "@/components/icons";

// Lazy load the map component (below-fold)
const ItalyWineMap = dynamic(() => import("@/components/map").then(mod => mod.ItalyWineMap), {
  loading: () => <div className="h-[400px] bg-sand/30 rounded-lg animate-pulse" />,
});

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
      {/* Hero Section - Optimized for mobile */}
      <section className="relative h-[70vh] sm:h-[70vh] min-h-[500px] sm:min-h-[500px] max-h-[800px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-banner.png"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30 sm:from-black/65 sm:via-black/45 sm:to-black/20" />
        </div>

        {/* Content - CSS animations instead of framer-motion */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl animate-fade-in-up">
            <p className="text-gold font-medium tracking-wider uppercase text-xs sm:text-sm mb-2 sm:mb-4 animate-fade-in animation-delay-300">
              Authentieke Italiaanse Wijnen
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-6 leading-tight animate-fade-in-up animation-delay-400 text-shadow-hero">
              La Dolce Vita
              <br />
              <span className="text-gold">in Elk Glas</span>
            </h1>
            <p className="text-sm sm:text-lg text-white/90 mb-5 sm:mb-8 leading-relaxed animate-fade-in animation-delay-500 line-clamp-3 sm:line-clamp-none text-shadow-sm">
              Ontdek onze zorgvuldig geselecteerde collectie Italiaanse wijnen.
              Van krachtige Barolo tot frisse Pinot Grigio.
            </p>
            <div className="flex gap-3 sm:gap-4 flex-wrap animate-fade-in-up animation-delay-600">
              <Link
                href="/wijnen"
                className="inline-flex items-center justify-center h-11 sm:h-14 px-5 sm:px-8 bg-wine text-white font-semibold uppercase tracking-wide text-xs sm:text-sm rounded hover:bg-wine-dark transition-colors"
              >
                Bekijk Collectie
              </Link>
              <Link
                href="/over-ons"
                className="hidden sm:inline-flex items-center justify-center h-14 px-8 border-2 border-white text-white font-semibold uppercase tracking-wide rounded hover:bg-white hover:text-charcoal transition-colors"
              >
                Ons Verhaal
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator - Hidden on mobile */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-1000 hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 animate-bounce-slow">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* USP Bar - Horizontal scroll on mobile */}
      <Section background="warm" spacing="sm">
        <div className="flex overflow-x-auto scrollbar-hide gap-4 sm:gap-6 py-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 sm:flex-shrink sm:justify-center text-center min-w-[140px] sm:min-w-0">
            <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-wine flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="font-semibold text-charcoal text-sm sm:text-base whitespace-nowrap">Gratis verzending</p>
              <p className="text-xs sm:text-sm text-grey">vanaf €35</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 sm:flex-shrink sm:justify-center text-center min-w-[140px] sm:min-w-0">
            <RefreshIcon className="w-5 h-5 sm:w-6 sm:h-6 text-wine flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="font-semibold text-charcoal text-sm sm:text-base whitespace-nowrap">Gratis retour</p>
              <p className="text-xs sm:text-sm text-grey">14 dagen</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 sm:flex-shrink sm:justify-center text-center min-w-[140px] sm:min-w-0">
            <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="font-semibold text-charcoal text-sm sm:text-base whitespace-nowrap">Proefgarantie</p>
              <p className="text-xs sm:text-sm text-grey">Geld terug</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Italy Wine Regions Map - Compact on mobile */}
      <Section background="warm" spacing="md" className="sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-label text-wine mb-1 sm:mb-2 text-xs sm:text-sm">Ontdek per Regio</p>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-4">Van Piemonte tot Toscane</h2>
            <p className="text-sm sm:text-base text-grey mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
              Onze selectie komt uit de mooiste wijnregio's van Italië.
              Van Piemonte tot Toscane — klik op een regio om te ontdekken.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/wijnen?region=piemonte"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-wine/10 text-wine rounded-full text-xs sm:text-sm font-medium hover:bg-wine/20 active:bg-wine/25 transition-colors"
              >
                <GrapeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Piemonte
              </Link>
              <Link
                href="/wijnen?region=veneto"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-wine/10 text-wine rounded-full text-xs sm:text-sm font-medium hover:bg-wine/20 active:bg-wine/25 transition-colors"
              >
                <WineBottleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Veneto
              </Link>
              <Link
                href="/wijnen?region=toscana"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-wine/10 text-wine rounded-full text-xs sm:text-sm font-medium hover:bg-wine/20 active:bg-wine/25 transition-colors"
              >
                <TuscanyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Toscana
              </Link>
            </div>
          </div>
          <div className="flex justify-center order-1 lg:order-2">
            <div className="scale-75 sm:scale-100 origin-center">
              <ItalyWineMap size="lg" />
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Products - 2 cols on mobile */}
      <Section background="default" spacing="md" className="sm:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-semibold">Onze Favorieten</h2>
          <Link
            href="/wijnen"
            className="flex items-center gap-1 text-wine font-medium text-sm sm:text-base hover:underline"
          >
            Bekijk alles
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <Grid cols={4} gap="sm" className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </Section>

      {/* Category Quick Links - Compact on mobile */}
      <Section background="warm" spacing="md" className="sm:py-12">
        <div className="text-center mb-4 sm:mb-10">
          <p className="text-label text-wine mb-1 text-xs sm:text-sm">Shop per Categorie</p>
          <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-semibold">Ontdek Onze Collectie</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
          {wineCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`${category.color} rounded-lg sm:rounded-xl p-3 sm:p-6 text-center transition-all hover:shadow-lg active:scale-95 sm:hover:-translate-y-1 group`}
            >
              <div className={`${category.iconColor} mb-1.5 sm:mb-3 flex justify-center`}>
                <category.Icon className="w-8 h-8 sm:w-12 sm:h-12 transition-transform group-hover:scale-110" />
              </div>
              <h3 className="font-semibold text-charcoal text-xs sm:text-base mb-0.5 sm:mb-1">{category.name}</h3>
              <p className="text-[10px] sm:text-sm text-grey hidden sm:block">{category.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Gift Banner - Compact on mobile */}
      <Section background="default" spacing="md" className="sm:py-12">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="text-label text-wine mb-1 sm:mb-2 text-xs sm:text-sm">Cadeau Tip</p>
            <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-4">
              Het perfecte cadeau voor wijnliefhebbers
            </h2>
            <p className="text-sm sm:text-base text-grey mb-4 sm:mb-6">
              Verras iemand met een prachtig verpakte fles wijn.
            </p>
            <Link href="/cadeaus">
              <Button variant="primary" className="w-full sm:w-auto">Bekijk Cadeaus</Button>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-wine/5 to-wine/10 rounded-xl sm:rounded-2xl aspect-[16/10] sm:aspect-video flex items-center justify-center order-1 md:order-2">
            <GiftBoxIcon className="w-20 h-20 sm:w-32 sm:h-32 text-wine/60" />
          </div>
        </div>
      </Section>

      {/* Wine Types - Horizontal scroll on mobile */}
      <Section background="default" spacing="md" className="sm:py-12">
        <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-8 text-center">Ontdek op Smaak</h2>
        <div className="flex overflow-x-auto scrollbar-hide gap-3 sm:gap-6 pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
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
              className={`${wine.bgClass} rounded-lg p-4 sm:p-8 text-center transition-all hover:shadow-lg active:scale-95 group flex-shrink-0 w-[140px] sm:w-auto sm:flex-shrink`}
            >
              <div className="w-10 h-16 sm:w-16 sm:h-24 bg-wine/20 rounded mx-auto mb-2 sm:mb-4" />
              <h3 className="font-serif text-sm sm:text-xl font-semibold mb-1 sm:mb-2">
                {wine.type}
              </h3>
              <p className="text-grey text-xs sm:text-base mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-none">{wine.description}</p>
              <span className="inline-flex items-center gap-1 text-wine font-medium text-xs sm:text-base group-hover:underline">
                Ontdek
                <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

    </>
  );
}
