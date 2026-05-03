import Link from "next/link";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { formatUiCopy } from "@/lib/ui-copy";
import nextDynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, StarIcon, ShieldIcon } from "@/components/icons";
import { getHeroContent, getUSPItems, getHomeStats, getUiCopy } from "@/lib/shopify-cms";
import { getActiveRegionSlugsFromProducts, getRegionLabelsFromProducts, slugToDisplayName } from "@/lib/region-utils";
import {
  AnimatedSection,
  AnimatedStagger,
  StaggerItem,
  HeroParallax,
  ScrollIndicator,
  PremiumDivider,
  AnimatedUSPBar,
  AnimatedCounter,
  OverlapTransition,
} from "@/components/home/HomeAnimations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Lazy load the map component (below-fold)
const ItalyWineMap = nextDynamic(() => import("@/components/map").then(mod => mod.ItalyWineMap), {
  loading: () => <div className="h-[400px] bg-sand/30 rounded-lg animate-pulse" />,
});

// Map CMS iconName to icon components
const uspIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: TruckIcon,
  refresh: RefreshIcon,
  star: StarIcon,
  shield: ShieldIcon,
};

export default async function Home() {
  const [allProducts, heroRaw, rawUspItems, cmsStats, uiCopy] = await Promise.all([
    getProducts(),
    getHeroContent(),
    getUSPItems(),
    getHomeStats(),
    getUiCopy(),
  ]);

  // Filter out false claims from CMS USP items
  const uspItems = rawUspItems
    .filter((u) => {
      const t = u.title.toLowerCase();
      return !t.includes("gratis verzending") && !t.includes("gratis retour");
    })
    .map((u) => ({
      ...u,
      subtitle: u.subtitle.replace(/gratis (verzending|retour)/gi, "").trim(),
    }));
  const featured = allProducts.filter((p) => p.isFeatured);
  const featuredProducts = featured.length > 0 ? featured.slice(0, 4) : allProducts.slice(0, 4);
  const hero = heroRaw;
  const activeRegionSlugs = getActiveRegionSlugsFromProducts(allProducts);
  const regionLabels = getRegionLabelsFromProducts(allProducts);
  const homeStats = cmsStats;
  const copy = (key: string, variables?: Record<string, string | number>) =>
    formatUiCopy(uiCopy, key, variables);
  const optionalCopy = (key: string) => uiCopy[key]?.trim() ?? "";

  // JSON-LD: Organization schema
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: copy("site.name"),
    url: "https://vinoperlei.nl",
    logo: "https://vinoperlei.nl/logo.png",
    description: copy("home.org.description"),
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
              {hero?.subtitle}
            </p>

            {/* Headline — bigger, bolder, with gold glow */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-5 sm:mb-8 leading-[1.05] animate-fade-in-up animation-delay-400 text-shadow-hero">
              {hero?.titleLine1}
              <br />
              <span className="text-gold text-shadow-gold">{hero?.titleLine2}</span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-lg lg:text-xl text-white/80 mb-8 sm:mb-12 leading-relaxed animate-fade-in animation-delay-500 max-w-2xl mx-auto text-shadow-sm">
              {hero?.description}
            </p>

            {/* CTA Buttons — premium styling */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center animate-fade-in-up animation-delay-600">
              <Link
                href={hero?.ctaPrimaryLink || "/wijnen"}
                className="group inline-flex items-center justify-center h-13 sm:h-14 px-10 sm:px-12 bg-gold text-wine-dark font-bold uppercase tracking-wider text-xs sm:text-sm rounded-sm hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30"
              >
                {hero?.ctaPrimaryText}
                <ChevronRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={hero?.ctaSecondaryLink || "/over-ons"}
                className="group inline-flex items-center justify-center h-13 sm:h-14 px-8 sm:px-10 border border-white/40 text-white text-button uppercase rounded-sm hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02]"
              >
                {hero?.ctaSecondaryText}
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
          <div className="max-w-xl mx-auto bg-white rounded-lg sm:rounded-2xl shadow-xl shadow-charcoal/5 border border-sand/40 px-4 sm:px-8 py-5 sm:py-6">
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {uspItems.map((usp, i) => {
                const IconComp = uspIconMap[usp.iconName] || TruckIcon;
                const isLast = i === uspItems.length - 1;
                return (
                  <div key={usp.title} className={`flex items-center gap-3 ${!isLast ? "sm:border-r sm:border-sand/60 sm:pr-10" : ""}`}>
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
              <p className="text-label text-wine/40 mb-2">{copy("home.featured.eyebrow")}</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                {copy("home.featured.title")}
              </h2>
              <p className="text-grey text-sm sm:text-base mt-2 max-w-md">
                {copy("home.featured.subtitle")}
              </p>
            </div>
            <Link
              href="/wijnen"
              className="group flex items-center gap-2 text-wine font-medium text-sm hover:text-wine-dark transition-colors"
            >
              {copy("home.featured.view_all")}
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
            <p className="text-label text-gold/60 mb-3">
              {activeRegionSlugs.length === 1
                ? copy("home.regions.count_singular")
                : copy("home.regions.count_plural", { count: activeRegionSlugs.length })}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 sm:mb-6 leading-tight">
              {copy("home.regions.title_line_1")}<br className="hidden sm:block" /> {copy("home.regions.title_line_2")}
            </h2>
            <p className="text-sm sm:text-base text-white/50 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              {copy("home.regions.body")}
            </p>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {activeRegionSlugs.map((slug) => {
                const label = slugToDisplayName(slug) || slug;
                return (
                  <Link
                    key={slug}
                    href={`/wijnen?region=${slug}`}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white/80 border border-white/10 rounded-full text-sm font-medium hover:bg-gold/15 hover:border-gold/30 hover:text-gold transition-all duration-300"
                  >
                    <GrapeIcon className="w-4 h-4 transition-transform group-hover:scale-110" /> {label}
                  </Link>
                );
              })}
            </div>
          </AnimatedSection>
          <AnimatedSection variant="fadeRight" delay={0.2} className="flex justify-center order-1 lg:order-2">
            <div className="scale-[0.6] sm:scale-75 lg:scale-100 origin-center -my-6 sm:-my-4 lg:my-0 opacity-80">
              <ItalyWineMap size="lg" activeRegionSlugs={activeRegionSlugs} regionLabels={regionLabels} />
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* =============================================
          OVERLAP TRANSITION — Quote bridge dark → warm
          ============================================= */}
      <OverlapTransition quote={optionalCopy("home.story.quote")} attribution={optionalCopy("home.story.attribution")} />

      {/* =============================================
          STATS — Numbers bar
          ============================================= */}
      <Section background="warm" spacing="xl" className="pt-24 sm:pt-32">
        <AnimatedSection variant="fadeUp">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
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
      </Section>


    </>
  );
}
