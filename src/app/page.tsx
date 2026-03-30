import Link from "next/link";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import dynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, WineBottleIcon, StarIcon, ShieldIcon, TuscanyIcon, RedWineIcon, WhiteWineIcon, RoseWineIcon, BubblesIcon, GiftBoxIcon } from "@/components/icons";
import { getHeroContent, getUSPItems, getCategoryBlocks, getTestimonials, getHomeStats, DEFAULT_HERO } from "@/lib/shopify-cms";
import {
  AnimatedSection,
  AnimatedStagger,
  StaggerItem,
  TestimonialCard,
  HeroParallax,
  ScrollIndicator,
  PremiumDivider,
  AnimatedUSPBar,
  AnimatedCounter,
  OverlapTransition,
} from "@/components/home/HomeAnimations";

export const revalidate = 60; // 1 min — align with blog pages for fresh content

// Lazy load the map component (below-fold)
const ItalyWineMap = dynamic(() => import("@/components/map").then(mod => mod.ItalyWineMap), {
  loading: () => <div className="h-[400px] bg-sand/30 rounded-lg animate-pulse" />,
});

// Map CMS iconName to icon components
const uspIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: TruckIcon,
  refresh: RefreshIcon,
  star: StarIcon,
  shield: ShieldIcon,
};

// Map CMS iconType to category icon components + styling
const categoryIconMap: Record<string, { Icon: React.ComponentType<{ className?: string }>; color: string; iconColor: string; accent: string }> = {
  red: { Icon: RedWineIcon, color: "bg-white", iconColor: "text-wine", accent: "bg-wine" },
  white: { Icon: WhiteWineIcon, color: "bg-white", iconColor: "text-gold", accent: "bg-gold" },
  rose: { Icon: RoseWineIcon, color: "bg-white", iconColor: "text-coral", accent: "bg-coral" },
  sparkling: { Icon: BubblesIcon, color: "bg-white", iconColor: "text-charcoal", accent: "bg-charcoal" },
  gift: { Icon: GiftBoxIcon, color: "bg-white", iconColor: "text-wine", accent: "bg-wine" },
};

export default async function Home() {
  const [allProducts, heroRaw, uspItems, categoryBlocks, testimonials, cmsStats] = await Promise.all([
    getProducts(),
    getHeroContent(),
    getUSPItems(),
    getCategoryBlocks(),
    getTestimonials(),
    getHomeStats(),
  ]);
  const featured = allProducts.filter((p) => p.isFeatured);
  const featuredProducts = featured.length > 0 ? featured.slice(0, 4) : allProducts.slice(0, 4);
  const hero = heroRaw ?? DEFAULT_HERO;
  const uniqueRegions = new Set(allProducts.map((p) => p.region).filter(Boolean));
  const homeStats = cmsStats.length > 0 ? cmsStats : [
    { value: String(allProducts.length), prefix: "", suffix: "", label: "Geselecteerde wijnen", sortOrder: 0 },
    { value: String(uniqueRegions.size || 3), prefix: "", suffix: "", label: "Italiaanse wijngebieden", sortOrder: 1 },
    { value: "12", prefix: "", suffix: "+", label: "Familieproducenten", sortOrder: 2 },
    { value: "48", prefix: "< ", suffix: "", label: "Uur levering", sortOrder: 3 },
  ];

  // JSON-LD: Organization schema
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vino per Lei",
    url: "https://vinoperlei.nl",
    logo: "https://vinoperlei.nl/logo.png",
    description:
      "Italiaanse wijnen uit Piemonte, Veneto en Toscane. Rechtstreeks van familiewijngaarden, persoonlijk geselecteerd door Carla Daniels.",
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* =============================================
          HERO — Full-viewport parallax with layered gradients
          ============================================= */}
      <HeroParallax>
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-3xl text-center">
            {/* Eyebrow */}
            <p className="text-label text-gold mb-4 sm:mb-6 animate-fade-in animation-delay-300">
              {hero.subtitle}
            </p>

            {/* Headline — bigger, bolder, with gold glow */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-5 sm:mb-8 leading-[1.05] animate-fade-in-up animation-delay-400 text-shadow-hero">
              {hero.titleLine1}
              <br />
              <span className="text-gold text-shadow-gold">{hero.titleLine2}</span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-lg lg:text-xl text-white/80 mb-8 sm:mb-12 leading-relaxed animate-fade-in animation-delay-500 max-w-2xl mx-auto text-shadow-sm">
              {hero.description}
            </p>

            {/* CTA Buttons — premium styling */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center animate-fade-in-up animation-delay-600">
              <Link
                href={hero.ctaPrimaryLink}
                className="group inline-flex items-center justify-center h-13 sm:h-14 px-10 sm:px-12 bg-gold text-wine-dark font-bold uppercase tracking-wider text-xs sm:text-sm rounded-sm hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30"
              >
                {hero.ctaPrimaryText}
                <ChevronRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={hero.ctaSecondaryLink}
                className="group inline-flex items-center justify-center h-13 sm:h-14 px-8 sm:px-10 border border-white/40 text-white text-button uppercase rounded-sm hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02]"
              >
                {hero.ctaSecondaryText}
                <ChevronRightIcon className="w-4 h-4 ml-2 opacity-60 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator />
      </HeroParallax>

      {/* =============================================
          USP BAR — Elevated trust signals
          ============================================= */}
      <Section background="default" spacing="none" className="relative -mt-16 sm:-mt-20 z-10">
        <AnimatedUSPBar>
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl shadow-charcoal/5 border border-sand/40 px-4 sm:px-8 py-5 sm:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
              {uspItems.map((usp, i) => {
                const IconComp = uspIconMap[usp.iconName] || TruckIcon;
                const isLast = i === uspItems.length - 1;
                return (
                  <div key={usp.title} className={`flex items-center gap-3 justify-center ${!isLast ? "sm:border-r sm:border-sand/60" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-wine/5 flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-5 h-5 text-wine" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal text-sm leading-tight">{usp.title}</p>
                      <p className="text-xs text-grey leading-tight">{usp.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedUSPBar>
      </Section>

      {/* =============================================
          FEATURED PRODUCTS — The star section
          ============================================= */}
      <Section background="default" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <div className="flex items-start sm:items-end justify-between mb-8 sm:mb-14">
            <div>
              <p className="text-label text-wine/40 mb-2">Door Carla gekozen</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                Onze Favorieten
              </h2>
              <p className="text-grey text-sm sm:text-base mt-2 max-w-md">
                De flessen die het vaakst op Carla&apos;s eigen tafel staan. Getest op dinertjes, verjaardagen en gewone dinsdagavonden.
              </p>
            </div>
            <Link
              href="/wijnen"
              className="group flex items-center gap-2 text-wine font-medium text-sm hover:text-wine-dark transition-colors"
            >
              Alle wijnen
              <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>
        <AnimatedStagger className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.12}>
          {featuredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </AnimatedStagger>
      </Section>

      <PremiumDivider variant="gold" />

      {/* =============================================
          WINE REGIONS MAP — Dark immersive section
          ============================================= */}
      <Section background="dark" spacing="xl" className="overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <AnimatedSection variant="fadeLeft" className="order-2 lg:order-1">
            <p className="text-label text-gold/60 mb-3">Drie wijngebieden</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 sm:mb-6 leading-tight">
              Van Piemonte<br className="hidden sm:block" /> tot Toscane
            </h2>
            <p className="text-sm sm:text-base text-white/50 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              Piemonte voor de krachtige Nebbiolo&apos;s. Veneto voor rijke Amarone en Ripasso. Toscane voor klassieke Sangiovese. Meer hebben we niet nodig.
            </p>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {[
                { href: "/wijnen?region=piemonte", icon: GrapeIcon, label: "Piemonte" },
                { href: "/wijnen?region=veneto", icon: WineBottleIcon, label: "Veneto" },
                { href: "/wijnen?region=toscana", icon: TuscanyIcon, label: "Toscana" },
              ].map((region) => (
                <Link
                  key={region.label}
                  href={region.href}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white/80 border border-white/10 rounded-full text-sm font-medium hover:bg-gold/15 hover:border-gold/30 hover:text-gold transition-all duration-300"
                >
                  <region.icon className="w-4 h-4 transition-transform group-hover:scale-110" /> {region.label}
                </Link>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection variant="fadeRight" delay={0.2} className="flex justify-center order-1 lg:order-2">
            <div className="scale-[0.6] sm:scale-75 lg:scale-100 origin-center -my-6 sm:-my-4 lg:my-0 opacity-80">
              <ItalyWineMap size="lg" />
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* =============================================
          OVERLAP TRANSITION — Quote bridge dark → warm
          ============================================= */}
      <OverlapTransition />

      {/* =============================================
          SOCIAL PROOF — Numbers + Testimonials
          ============================================= */}
      <Section background="warm" spacing="xl" className="pt-24 sm:pt-32">
        {/* Trust numbers bar */}
        <AnimatedSection variant="fadeUp">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 text-center">
            {homeStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-wine leading-none mb-1.5 tabular-nums">
                  <AnimatedCounter target={parseInt(stat.value) || 0} suffix={stat.suffix} prefix={stat.prefix} />
                </p>
                <p className="text-xs sm:text-sm text-grey font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-label text-wine/40 mb-2">Wat onze proevers zeggen</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">Reacties van de proeverij</h2>
          </div>
        </AnimatedSection>
        <AnimatedStagger className="grid sm:grid-cols-3 gap-5 sm:gap-6" staggerDelay={0.15}>
          {testimonials.map((review) => (
            <TestimonialCard key={review.name} {...review} />
          ))}
        </AnimatedStagger>
      </Section>

      <PremiumDivider variant="subtle" />

      {/* =============================================
          CATEGORY QUICK LINKS — Shop per type
          ============================================= */}
      <Section background="default" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-label text-wine/40 mb-2">Shop per type</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">Weet je wat je zoekt?</h2>
          </div>
        </AnimatedSection>
        <AnimatedStagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5" staggerDelay={0.08}>
          {categoryBlocks.map((category) => {
            const mapping = categoryIconMap[category.iconType] || categoryIconMap.red;
            const CategoryIcon = mapping.Icon;
            return (
              <StaggerItem key={category.name}>
                <Link
                  href={category.href}
                  className={`${mapping.color} rounded-2xl p-6 sm:p-7 text-center transition-all duration-300 hover:shadow-lg active:scale-[0.97] sm:hover:-translate-y-1.5 group border border-sand/50 hover:border-wine/15 block h-full flex flex-col items-center justify-center`}
                >
                  <div className={cn("w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300", {
                    "bg-wine/8 group-hover:bg-wine/12": mapping.accent === "bg-wine",
                    "bg-gold/8 group-hover:bg-gold/12": mapping.accent === "bg-gold",
                    "bg-coral/8 group-hover:bg-coral/12": mapping.accent === "bg-coral",
                    "bg-charcoal/8 group-hover:bg-charcoal/12": mapping.accent === "bg-charcoal",
                  })}>
                    <CategoryIcon className={`w-8 h-8 sm:w-9 sm:h-9 ${mapping.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  <h3 className="font-serif font-semibold text-charcoal text-sm sm:text-base mb-1 leading-tight">{category.name}</h3>
                  <p className="text-xs text-grey leading-snug">{category.description}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </AnimatedStagger>
      </Section>


    </>
  );
}
