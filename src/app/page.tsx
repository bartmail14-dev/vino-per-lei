import Link from "next/link";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { formatUiCopy } from "@/lib/ui-copy";
import nextDynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, StarIcon, ShieldIcon } from "@/components/icons";
import { getHeroContent, getUSPItems, getUiCopy } from "@/lib/shopify-cms";
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
  const [allProducts, heroRaw, rawUspItems, uiCopy] = await Promise.all([
    getProducts(),
    getHeroContent(),
    getUSPItems(),
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

  // Dynamic stats from product data — auto-generates per wine type
  const wineTypeLabels: Record<string, string> = {
    red: "Rode wijnen",
    white: "Witte wijnen",
    rose: "Rosé wijnen",
    sparkling: "Mousserende wijnen",
  };
  const wineTypeCounts = allProducts.reduce<Record<string, number>>((acc, p) => {
    acc[p.wineType] = (acc[p.wineType] || 0) + 1;
    return acc;
  }, {});
  const wineTypeStats = Object.entries(wineTypeCounts)
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => (Object.keys(wineTypeLabels).indexOf(a) - Object.keys(wineTypeLabels).indexOf(b)))
    .map(([type, count]) => ({
      value: String(count),
      prefix: "",
      suffix: "",
      label: wineTypeLabels[type] || type,
    }));
  const dynamicStats: Array<{value: string; prefix: string; suffix: string; label: string}> = [
    { value: String(allProducts.length), prefix: "", suffix: "", label: "Geselecteerde wijnen" },
    { value: String(activeRegionSlugs.length), prefix: "", suffix: "", label: "Wijngebieden" },
    ...wineTypeStats,
  ];
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
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-4xl text-left pt-10 sm:pt-16">
            {/* Eyebrow */}
            <div className="mb-5 sm:mb-7 animate-fade-in animation-delay-300">
              <p className="inline-flex items-center gap-3 text-label text-gold">
                <span className="h-px w-8 bg-gold/70" aria-hidden="true" />
                {hero?.subtitle}
              </p>
            </div>

            {/* Headline — bigger, bolder, with gold glow */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-5 sm:mb-8 leading-[0.96] animate-fade-in-up animation-delay-400 text-shadow-hero max-w-4xl">
              {hero?.titleLine1}
              <br />
              <span className="text-gold text-shadow-gold">{hero?.titleLine2}</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg lg:text-xl text-white/82 mb-8 sm:mb-10 leading-relaxed animate-fade-in animation-delay-500 max-w-2xl text-shadow-sm">
              {hero?.description}
            </p>

            {/* CTA Buttons — premium styling */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animation-delay-600">
              <Link
                href={hero?.ctaPrimaryLink || "/wijnen"}
                className="group inline-flex items-center justify-center h-13 sm:h-14 px-10 sm:px-12 bg-gold text-wine-dark font-bold uppercase tracking-wider text-xs sm:text-sm rounded-full hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30"
              >
                {hero?.ctaPrimaryText}
                <ChevronRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={hero?.ctaSecondaryLink || "/over-ons"}
                className="group inline-flex items-center justify-center h-13 sm:h-14 px-8 sm:px-10 border border-white/45 text-white text-button uppercase rounded-full hover:bg-white/10 hover:border-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02]"
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
      <Section background="default" spacing="none" className="relative -mt-24 sm:-mt-28 z-10">
        <AnimatedUSPBar>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {uspItems.map((usp) => {
                const IconComp = uspIconMap[usp.iconName] || TruckIcon;
                return (
                  <div
                    key={usp.title}
                    className="group relative overflow-hidden rounded-2xl border border-sand/50 bg-white/96 px-5 py-5 shadow-[0_24px_60px_-36px_rgba(26,31,61,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-[0_28px_70px_-34px_rgba(26,31,61,0.55)]"
                  >
                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />
                    <div className="mb-4 w-11 h-11 rounded-full bg-champagne/60 ring-1 ring-gold/15 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-gold/12">
                      <IconComp className="w-5 h-5 text-wine" />
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-charcoal text-base leading-tight">{usp.title}</p>
                      <p className="mt-1.5 text-sm text-grey leading-relaxed">{usp.subtitle}</p>
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
            {dynamicStats.map((stat) => (
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
