import Link from "next/link";
import { Section, Grid } from "@/components/layout";
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { mockProducts } from "@/data/mockProducts";
import dynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, WineBottleIcon, ClockIcon, ArrowRightIcon, MapPinIcon } from "@/components/icons";
import { featuredBlogPosts } from "@/data/blogPosts";

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
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[420px] sm:min-h-[500px] max-h-[800px] overflow-hidden">
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

      {/* USP Bar */}
      <Section background="warm" spacing="sm">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 py-2">
          <div className="flex items-center gap-2 sm:gap-3 justify-center text-center">
            <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-wine flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="font-semibold text-charcoal text-sm sm:text-base">Gratis verzending</p>
              <p className="text-xs sm:text-sm text-grey">vanaf €35</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 justify-center text-center">
            <RefreshIcon className="w-5 h-5 sm:w-6 sm:h-6 text-wine flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="font-semibold text-charcoal text-sm sm:text-base">Gratis retour</p>
              <p className="text-xs sm:text-sm text-grey">14 dagen</p>
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
            <div className="scale-[0.6] sm:scale-75 lg:scale-100 origin-center -my-6 sm:-my-4 lg:my-0">
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

      {/* Blog Section - Wines & Regions */}
      <Section background="default" spacing="md" className="sm:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <p className="text-label text-wine mb-1 text-xs sm:text-sm">Uit Ons Magazine</p>
            <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-semibold">Wijn Verhalen</h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-wine font-medium text-sm hover:underline"
          >
            Alle artikelen
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured article - large card */}
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
          <Link
            href={`/blog/${featuredBlogPosts[0].slug}`}
            className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[360px]"
          >
            {/* Rich gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-wine via-wine-dark to-wine-light" />
            {/* Decorative wine bottle & crown illustration */}
            <svg className="absolute right-4 sm:right-8 top-4 sm:top-8 w-24 h-32 sm:w-40 sm:h-52 lg:w-48 lg:h-64 text-white/[0.07]" viewBox="0 0 120 160" fill="currentColor">
              <path d="M52 10h16v16l8 12v72c0 8-7 14-16 14H60c-9 0-16-6-16-14V38l8-12V10z" />
              <rect x="48" y="2" width="24" height="10" rx="2" />
              <path d="M44 72h32v2H44z" opacity="0.5" />
              <circle cx="60" cy="90" r="8" opacity="0.3" />
              {/* Crown above bottle */}
              <path d="M45 -8l5 10 10-6 10 6 5-10v12H45z" opacity="0.5" />
            </svg>
            {/* Text readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-gold bg-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm border border-white/10">
                  {featuredBlogPosts[0].categoryLabel}
                </span>
                {featuredBlogPosts[0].region && (
                  <span className="flex items-center gap-1 text-[10px] sm:text-xs text-white/80">
                    <MapPinIcon className="w-3 h-3" />
                    {featuredBlogPosts[0].region}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-semibold text-white mb-1 sm:mb-2 group-hover:text-gold transition-colors leading-tight">
                {featuredBlogPosts[0].title}
              </h3>
              <p className="text-white/80 text-xs sm:text-base mb-2 sm:mb-3 line-clamp-2">
                {featuredBlogPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white/60 text-xs sm:text-sm">
                  <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {featuredBlogPosts[0].readTime} min leestijd
                </div>
                <span className="text-gold text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Lees meer <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Two smaller cards stacked */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-6">
            {/* Toscana card */}
            <Link
              href={`/blog/${featuredBlogPosts[1].slug}`}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[2.5/1] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[168px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/80 via-gold/60 to-wine/70" />
              {/* Decorative Tuscan cypress trees */}
              <svg className="absolute right-2 sm:right-4 top-2 sm:top-4 w-16 h-20 sm:w-28 sm:h-36 text-white/[0.08]" viewBox="0 0 80 100" fill="currentColor">
                <path d="M20 95V45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1" />
                <path d="M20 20c0 0-6 8-6 18s4 16 6 22c2-6 6-12 6-22s-6-18-6-18z" />
                <path d="M50 95V55" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1" />
                <path d="M50 35c0 0-5 6-5 14s3 12 5 17c2-5 5-9 5-17s-5-14-5-14z" />
                <path d="M70 95V65" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1" />
                <path d="M70 50c0 0-4 5-4 11s2 10 4 14c2-4 4-8 4-14s-4-11-4-11z" />
                {/* Rolling hills */}
                <path d="M0 85 Q20 75 40 82 Q60 88 80 80 V100 H0z" opacity="0.15" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <span className="text-[9px] sm:text-xs font-medium uppercase tracking-wider text-gold bg-white/10 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {featuredBlogPosts[1].categoryLabel}
                  </span>
                  {featuredBlogPosts[1].region && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-white/80">
                      <MapPinIcon className="w-3 h-3" />
                      {featuredBlogPosts[1].region}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-sm sm:text-lg lg:text-xl font-semibold text-white group-hover:text-gold transition-colors leading-snug line-clamp-2">
                  {featuredBlogPosts[1].title}
                </h3>
                <p className="hidden sm:block text-white/80 text-sm mt-1 line-clamp-2">
                  {featuredBlogPosts[1].excerpt}
                </p>
                <div className="flex items-center gap-1 text-white/60 text-[10px] sm:text-sm mt-1 sm:mt-2">
                  <ClockIcon className="w-3 h-3" />
                  {featuredBlogPosts[1].readTime} min
                </div>
              </div>
            </Link>

            {/* Amarone card */}
            <Link
              href={`/blog/${featuredBlogPosts[2].slug}`}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[2.5/1] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[168px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-wine-light via-wine/70 to-charcoal/80" />
              {/* Decorative grape cluster */}
              <svg className="absolute right-2 sm:right-4 top-2 sm:top-4 w-16 h-20 sm:w-24 sm:h-32 text-white/[0.08]" viewBox="0 0 60 80" fill="currentColor">
                <circle cx="20" cy="28" r="7" />
                <circle cx="34" cy="28" r="7" />
                <circle cx="27" cy="20" r="7" />
                <circle cx="14" cy="40" r="7" />
                <circle cx="27" cy="38" r="7" />
                <circle cx="40" cy="40" r="7" />
                <circle cx="20" cy="50" r="7" />
                <circle cx="34" cy="50" r="7" />
                <circle cx="27" cy="58" r="7" />
                {/* Stem */}
                <path d="M27 12V4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M27 4c0 0 6-2 10 0" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <span className="text-[9px] sm:text-xs font-medium uppercase tracking-wider text-gold bg-white/10 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {featuredBlogPosts[2].categoryLabel}
                  </span>
                  {featuredBlogPosts[2].region && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-white/80">
                      <MapPinIcon className="w-3 h-3" />
                      {featuredBlogPosts[2].region}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-sm sm:text-lg lg:text-xl font-semibold text-white group-hover:text-gold transition-colors leading-snug line-clamp-2">
                  {featuredBlogPosts[2].title}
                </h3>
                <p className="hidden sm:block text-white/80 text-sm mt-1 line-clamp-2">
                  {featuredBlogPosts[2].excerpt}
                </p>
                <div className="flex items-center gap-1 text-white/60 text-[10px] sm:text-sm mt-1 sm:mt-2">
                  <ClockIcon className="w-3 h-3" />
                  {featuredBlogPosts[2].readTime} min
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile: link to all articles */}
        <Link
          href="/blog"
          className="sm:hidden flex items-center justify-center gap-1.5 text-wine font-medium text-sm py-2"
        >
          Alle artikelen
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </Section>

    </>
  );
}
