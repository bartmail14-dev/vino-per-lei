import Link from "next/link";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { formatUiCopy } from "@/lib/ui-copy";
import nextDynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, StarIcon, ShieldIcon } from "@/components/icons";
import { getHeroContent, getUSPItems, getUiCopy } from "@/lib/shopify-cms";
import { getActiveRegionSlugsFromProducts, getRegionLabelsFromProducts, slugToDisplayName } from "@/lib/region-utils";
import { cn, jsonLdScript } from "@/lib/utils";
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

export const revalidate = 300; // ISR: revalidate product data every 5 min (or on-demand via /api/revalidate)

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

function formatHeroTitleLine(line: string | undefined, capitalizeFirstLetter: boolean): string {
  const lower = (line ?? "").toLocaleLowerCase("nl-NL");
  if (!capitalizeFirstLetter) return lower;
  const firstLetterIndex = lower.search(/\p{L}/u);
  if (firstLetterIndex === -1) return lower;

  return (
    lower.slice(0, firstLetterIndex) +
    lower.charAt(firstLetterIndex).toLocaleUpperCase("nl-NL") +
    lower.slice(firstLetterIndex + 1)
  );
}

export default async function Home() {
  const [allProducts, heroRaw, rawUspItems, uiCopy] = await Promise.all([
    getProducts(),
    getHeroContent(),
    getUSPItems(),
    getUiCopy(),
  ]);

  // USP items come directly from Shopify CMS (metaobjects)
  const uspItems = rawUspItems;
  const featured = allProducts.filter((p) => p.isFeatured);
  const featuredProducts = featured.length > 0 ? featured.slice(0, 4) : allProducts.slice(0, 4);
  const hero = heroRaw;
  const heroTitleLine1 = formatHeroTitleLine(hero?.titleLine1, true);
  const heroTitleLine2 = formatHeroTitleLine(hero?.titleLine2, heroTitleLine1.length === 0);
  const activeRegionSlugs = getActiveRegionSlugsFromProducts(allProducts);
  const regionLabels = getRegionLabelsFromProducts(allProducts);

  const copy = (key: string, variables?: Record<string, string | number>) =>
    formatUiCopy(uiCopy, key, variables);
  const optionalCopy = (key: string) => uiCopy[key]?.trim() ?? "";
  const featuredSubtitle = optionalCopy("home.featured.subtitle");

  // Dynamic stats from Shopify product data; labels are Shopify UI-copy.
  const wineTypeLabels: Record<string, string> = {
    red: copy("home.stats.red_wines"),
    white: copy("home.stats.white_wines"),
    rose: copy("home.stats.rose_wines"),
    sparkling: copy("home.stats.sparkling_wines"),
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
    { value: String(allProducts.length), prefix: "", suffix: "", label: copy("home.stats.selected_wines") },
    { value: String(activeRegionSlugs.length), prefix: "", suffix: "", label: copy("home.stats.wine_regions") },
    ...wineTypeStats,
  ];

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
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
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
              {heroTitleLine1}
              <br />
              <span className="text-gold text-shadow-gold">{heroTitleLine2}</span>
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
      <Section background="warm" spacing="none" className="border-b border-sand/50">
        <AnimatedUSPBar>
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 divide-y divide-sand/50 sm:divide-y-0 sm:divide-x ${uspItems.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0"}`}>
              {uspItems.map((usp) => {
                const IconComp = uspIconMap[usp.iconName] || TruckIcon;
                return (
                  <div
                    key={usp.title}
                    className="flex items-center gap-4 px-4 py-5 sm:justify-center sm:px-6 sm:py-8"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold/35 bg-champagne/40">
                      <IconComp className="h-5 w-5 text-wine" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-base font-semibold leading-tight text-charcoal">{usp.title}</p>
                      <p className="mt-1 text-sm leading-snug text-grey">{usp.subtitle}</p>
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
      <Section background="default" spacing="xl" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-warm-white/70 to-transparent" aria-hidden="true" />
        <AnimatedSection variant="fadeUp">
          <div className="relative flex items-start sm:items-end justify-between gap-4 mb-8 sm:mb-14">
            <div className="min-w-0">
              <p className="text-label text-wine/45 mb-3">{copy("home.featured.eyebrow")}</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05]">
                {copy("home.featured.title")}
              </h2>
              {featuredSubtitle && (
                <p className="text-grey text-sm sm:text-base mt-3 max-w-md leading-relaxed">
                  {featuredSubtitle}
                </p>
              )}
            </div>
            <Link
              href="/wijnen"
              className="group flex shrink-0 items-center gap-2 whitespace-nowrap pt-1 text-wine font-medium text-sm hover:text-wine-dark transition-colors"
            >
              {copy("home.featured.view_all")}
              <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>
        <AnimatedStagger
          className={cn(
            "relative grid grid-cols-1 min-[430px]:grid-cols-2 gap-5 sm:gap-6",
            featuredProducts.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          )}
          staggerDelay={0.12}
        >
          {featuredProducts.map((product) => (
            <StaggerItem key={product.id} className="h-full flex">
              <ProductCard product={product} className="flex-1" />
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
            <div className="scale-[0.6] sm:scale-75 lg:scale-100 origin-center -my-6 sm:-my-4 lg:my-0 opacity-95">
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
      <Section background="warm" spacing="lg" className="pt-24 sm:pt-32">
        <AnimatedSection variant="fadeUp">
          <div className="flex flex-wrap justify-center gap-y-10 sm:gap-y-12 text-center">
            {dynamicStats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "w-1/2 min-[430px]:w-1/3 lg:w-1/5 px-3 sm:px-6",
                  index > 0 && "lg:border-l lg:border-gold/15"
                )}
              >
                <p className="font-serif text-4xl sm:text-5xl font-bold text-wine leading-none tabular-nums">
                  <AnimatedCounter target={parseInt(stat.value) || 0} suffix={stat.suffix} prefix={stat.prefix} />
                </p>
                <div className="mx-auto mt-3 mb-2.5 h-px w-8 bg-gradient-to-r from-transparent via-gold/60 to-transparent" aria-hidden="true" />
                <p className="text-[11px] sm:text-xs text-grey font-semibold uppercase tracking-[0.18em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Section>


    </>
  );
}
