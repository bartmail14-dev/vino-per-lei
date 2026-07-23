import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/layout";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { formatUiCopy } from "@/lib/ui-copy";
import nextDynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, StarIcon, ShieldIcon } from "@/components/icons";
import { getHeroContent, getUSPItems, getUiCopy } from "@/lib/shopify-cms";
import { getActiveRegionSlugsFromProducts, getRegionLabelsFromProducts, slugToDisplayName } from "@/lib/region-utils";
import { cn, jsonLdScript, wineImagePresets } from "@/lib/utils";
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
  const [spotlight, ...restFeatured] = featuredProducts;
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

  // Category tiles — Italian type names are decorative watermarks, labels come from CMS
  const wineTypeDecor: Record<string, { watermark: string; bg: string }> = {
    red: { watermark: "Rosso", bg: "bg-[linear-gradient(135deg,#571b2c_0%,#7d2740_55%,#3f1420_100%)]" },
    white: { watermark: "Bianco", bg: "bg-[linear-gradient(135deg,#8a6d1f_0%,#c9a227_55%,#6f5719_100%)]" },
    rose: { watermark: "Rosato", bg: "bg-[linear-gradient(135deg,#a4494f_0%,#d9767c_55%,#7e3439_100%)]" },
    sparkling: { watermark: "Spumante", bg: "bg-[linear-gradient(135deg,#8c7a45_0%,#cbb878_55%,#6b5c33_100%)]" },
  };
  const categoryTiles = Object.keys(wineTypeLabels)
    .filter((type) => (wineTypeCounts[type] || 0) > 0)
    .map((type) => ({
      type,
      count: wineTypeCounts[type],
      label: wineTypeLabels[type],
      ...(wineTypeDecor[type] || { watermark: "", bg: "bg-dark-bg" }),
      images: (() => {
        // Dedupe on image url so two products sharing one photo never show twice
        const seen = new Set<string>();
        const unique = [];
        for (const p of allProducts) {
          if (p.wineType !== type || !p.images[0]) continue;
          const key = p.images[0].url.split("?")[0];
          if (seen.has(key)) continue;
          seen.add(key);
          unique.push(p.images[0]);
          if (unique.length === 3) break;
        }
        return unique;
      })(),
    }));

  // Fanned bottle layout inside category tiles: front bottle largest, others peek out behind it
  const bottleFan = [
    "right-0 top-0 z-30 w-[72%] rotate-[3deg]",
    "right-[36%] top-[10%] z-20 w-[60%] -rotate-[5deg]",
    "right-[62%] top-[22%] z-10 w-[50%] rotate-[8deg]",
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
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="relative w-full max-w-4xl text-left pt-10 sm:pt-16">
            {/* Eyebrow */}
            <div className="mb-5 sm:mb-7 animate-fade-in animation-delay-300">
              <p className="inline-flex items-center gap-3 text-label text-gold">
                <span className="h-px w-8 bg-gold/70" aria-hidden="true" />
                {hero?.subtitle}
                <span className="hidden h-px w-8 bg-gold/70 sm:block" aria-hidden="true" />
              </p>
            </div>

            {/* Headline — oversized editorial serif, second line indented italic gold */}
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-white mb-5 sm:mb-8 leading-[0.92] animate-fade-in-up animation-delay-400 text-shadow-hero">
              <span className="block">{heroTitleLine1}</span>
              <span className="block italic text-gold text-shadow-gold pl-[6%] sm:pl-[10%]">{heroTitleLine2}</span>
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

          {/* Vertical editorial ornament — right edge, desktop only */}
          <div
            className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex"
            aria-hidden="true"
          >
            <span className="h-24 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
            <span className="[writing-mode:vertical-rl] font-serif italic text-sm tracking-[0.35em] text-white/40">
              {copy("site.name")}
            </span>
            <span className="h-24 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
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
          CATEGORY TILES — Shop by wine style
          ============================================= */}
      {categoryTiles.length > 1 && (
        <Section background="default" spacing="lg">
          <AnimatedSection variant="fadeUp">
            <div className="mb-8 text-center sm:mb-10">
              <p className="text-label text-wine/45 mb-3">
                <span className="mr-2 font-serif text-base italic text-gold/80">01</span>
                {copy("home.categories.eyebrow")}
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-[1.05] sm:text-4xl lg:text-5xl">
                {copy("home.categories.title")}
              </h2>
            </div>
          </AnimatedSection>
          <AnimatedStagger
            className={cn(
              "grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 sm:gap-5",
              categoryTiles.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            )}
            staggerDelay={0.1}
          >
            {categoryTiles.map((tile) => (
              <StaggerItem key={tile.type} className="h-full flex">
                <Link
                  href={`/wijnen?type=${tile.type}`}
                  className="group relative mt-16 flex min-h-[210px] flex-1 flex-col justify-end px-6 py-7 transition-transform duration-500 hover:-translate-y-1 sm:mt-24 sm:min-h-[270px] sm:py-9"
                >
                  {/* Clipped panel layer: gradient, watermark, grain stay inside the rounded tile */}
                  <span
                    className={cn(
                      "absolute inset-0 overflow-hidden rounded-[1.5rem] shadow-[0_24px_60px_-40px_rgba(26,31,61,0.7)] transition-shadow duration-500 group-hover:shadow-[0_32px_70px_-36px_rgba(26,31,61,0.65)]",
                      tile.bg
                    )}
                    aria-hidden="true"
                  >
                    <span className="pointer-events-none absolute -right-2 -top-5 select-none font-serif italic text-[5rem] leading-none text-white/[0.08] transition-transform duration-700 group-hover:scale-105 sm:text-[6.5rem]">
                      {tile.watermark}
                    </span>
                    <span className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06]" />
                  </span>
                  {/* Bottles fan playfully out of the tile */}
                  {tile.images.length > 0 && (
                    <div
                      className="pointer-events-none absolute -top-16 bottom-2 right-0 w-[74%] transition-transform duration-700 group-hover:-translate-y-2 sm:-top-24"
                      aria-hidden="true"
                    >
                      {tile.images.map((img, i) => (
                        <div
                          key={img.url}
                          className={cn(
                            "absolute bottom-0 transition-transform duration-700",
                            bottleFan[i],
                            i === 0 && "group-hover:rotate-[5deg]"
                          )}
                        >
                          <Image
                            src={wineImagePresets.card(img.url)}
                            alt=""
                            fill
                            sizes="200px"
                            className="object-contain object-bottom drop-shadow-[0_24px_32px_rgba(0,0,0,0.45)]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="relative max-w-[46%]">
                    <p className="font-serif text-2xl font-semibold text-white sm:text-3xl">{tile.label}</p>
                    <p className="mt-1 text-sm text-white/70">
                      {copy("home.categories.count", { count: tile.count })}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-gold" aria-hidden="true">
                      <span className="h-px w-7 bg-gold/60 transition-all duration-300 group-hover:w-10" />
                      <ChevronRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </AnimatedStagger>
        </Section>
      )}

      {/* =============================================
          FEATURED PRODUCTS — The star section
          ============================================= */}
      <Section background="default" spacing="xl" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-warm-white/70 to-transparent" aria-hidden="true" />
        <AnimatedSection variant="fadeUp">
          <div className="relative flex items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div className="min-w-0">
              <p className="text-label text-wine/45 mb-3">
                <span className="mr-2 font-serif text-base italic text-gold/80">02</span>
                {copy("home.featured.eyebrow")}
              </p>
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
        {spotlight && (
          <AnimatedSection variant="fadeUp">
            <Link
              href={`/wijnen/${spotlight.handle}`}
              className="group relative mb-8 grid overflow-hidden rounded-[1.75rem] border border-sand/70 bg-white shadow-[0_30px_80px_-48px_rgba(26,31,61,0.55)] transition-shadow duration-500 hover:shadow-[0_36px_90px_-40px_rgba(26,31,61,0.5)] sm:mb-10 sm:grid-cols-[5fr_7fr]"
            >
              <div className="relative flex items-center justify-center overflow-hidden bg-dark-bg px-8 py-12 sm:py-16">
                <span
                  className="pointer-events-none absolute -left-3 top-1/2 -translate-y-1/2 select-none font-serif italic text-[8rem] leading-none text-white/[0.05] sm:text-[10rem]"
                  aria-hidden="true"
                >
                  N°1
                </span>
                <div className="absolute inset-y-8 right-0 hidden w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent sm:block" aria-hidden="true" />
                {spotlight.images[0] && (
                  <div className="relative h-72 w-52 transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:h-96 sm:w-60">
                    <Image
                      src={wineImagePresets.card(spotlight.images[0].url)}
                      alt={spotlight.images[0].altText || spotlight.title}
                      fill
                      sizes="(max-width: 640px) 208px, 240px"
                      priority
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-4 px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
                <p className="inline-flex items-center gap-3 text-label text-gold">
                  <span className="font-serif text-base italic">N°1</span>
                  <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
                </p>
                <h3 className="font-serif text-3xl font-semibold leading-[1.02] text-charcoal transition-colors duration-300 group-hover:text-wine sm:text-4xl lg:text-5xl">
                  {spotlight.title}
                </h3>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-grey/70">
                  {spotlight.region}
                  {spotlight.vintage && spotlight.vintage !== "NV" && <span className="text-gold/60"> &middot; {spotlight.vintage}</span>}
                  {spotlight.grapeVarieties.length > 0 && <span> &middot; {spotlight.grapeVarieties.slice(0, 2).join(", ")}</span>}
                </p>
                {spotlight.description && (
                  <p className="max-w-xl text-sm leading-relaxed text-grey line-clamp-3 sm:text-base first-letter:uppercase">{spotlight.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <span className="font-serif text-2xl font-semibold text-wine">
                    &euro; {spotlight.price.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-wine transition-colors group-hover:text-wine-dark">
                    {copy("home.featured.spotlight_cta")}
                    <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        )}
        <AnimatedStagger
          className={cn(
            "relative grid grid-cols-1 min-[430px]:grid-cols-2 gap-5 sm:gap-6",
            restFeatured.length >= 4 ? "lg:grid-cols-4" : restFeatured.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"
          )}
          staggerDelay={0.12}
        >
          {restFeatured.map((product) => (
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
      <Section background="dark" spacing="xl" className="relative overflow-hidden">
        <span
          className="pointer-events-none absolute -bottom-6 -right-4 select-none font-serif italic leading-none text-white/[0.04] text-[8rem] sm:text-[12rem] lg:text-[16rem]"
          aria-hidden="true"
        >
          Italia
        </span>
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <AnimatedSection variant="fadeLeft" className="order-2 lg:order-1">
            <p className="text-label text-gold/60 mb-3">
              <span className="mr-2 font-serif text-base italic text-gold/80">03</span>
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

      {/* =============================================
          STORY — Personal curation as trust anchor
          ============================================= */}
      <Section background="cream" spacing="xl" className="relative overflow-hidden">
        <span
          className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 select-none font-serif italic leading-none text-wine/[0.04] text-[7rem] sm:text-[11rem]"
          aria-hidden="true"
        >
          La selezione
        </span>
        <AnimatedSection variant="fadeUp">
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-label text-wine/45 mb-3">
              <span className="mr-2 font-serif text-base italic text-gold/80">04</span>
              {copy("home.story.eyebrow")}
            </p>
            <h2 className="font-serif text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-5xl">
              {copy("home.story.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-grey sm:text-base">
              {copy("home.story.body")}
            </p>
            <div className="mt-8">
              <Link
                href="/over-ons"
                className="group inline-flex h-13 items-center justify-center rounded-full bg-wine px-10 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-wine/20 transition-all duration-300 hover:bg-wine-dark hover:shadow-xl sm:h-14 sm:text-sm"
              >
                {copy("home.story.cta")}
                <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </Section>

      {/* =============================================
          NEWSLETTER — Dark closing band
          ============================================= */}
      <Section background="dark" spacing="lg" className="relative overflow-hidden">
        <span
          className="pointer-events-none absolute -bottom-4 -right-2 select-none font-serif italic leading-none text-white/[0.04] text-[6rem] sm:text-[9rem]"
          aria-hidden="true"
        >
          Salute
        </span>
        <AnimatedSection variant="fadeUp">
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="text-label text-gold/70 mb-3">{copy("home.newsletter.eyebrow")}</p>
            <h2 className="font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
              {copy("home.newsletter.title")}
            </h2>
            <div className="mt-8">
              <NewsletterForm variant="dark" layout="inline" socialProof className="mx-auto max-w-lg" />
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </>
  );
}
