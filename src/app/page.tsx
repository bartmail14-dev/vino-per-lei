import Link from "next/link";
import { Section, Grid } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import dynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, WineBottleIcon, ClockIcon, ArrowRightIcon, MapPinIcon, StarIcon, ShieldIcon } from "@/components/icons";
import { getHeroContent, getUSPItems, getCategoryBlocks, getBlogArticles, DEFAULT_HERO } from "@/lib/shopify-cms";
import type { USPItem, CategoryBlock, BlogArticle } from "@/lib/shopify-cms";
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
} from "@/components/home/HomeAnimations";

export const revalidate = 60;

// Lazy load the map component (below-fold)
const ItalyWineMap = dynamic(() => import("@/components/map").then(mod => mod.ItalyWineMap), {
  loading: () => <div className="h-[400px] bg-sand/30 rounded-lg animate-pulse" />,
});

function TuscanyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      <path d="M24 38V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 42H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 8H34L32 20C31.5 24 28 28 24 28C20 28 16.5 24 16 20L14 8Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M16 16C16.5 19 19.5 22 24 22C28.5 22 31.5 19 32 16L32.5 12H15.5L16 16Z" fill="#1a1f3d" opacity="0.8" />
    </svg>
  );
}

function WhiteWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path d="M24 38V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 42H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 8H34L32 20C31.5 24 28 28 24 28C20 28 16.5 24 16 20L14 8Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M17 14C17.3 16 19.5 18 24 18C28.5 18 30.7 16 31 14L31.5 11H16.5L17 14Z" fill="#c9a227" opacity="0.5" />
    </svg>
  );
}

function RoseWineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path d="M24 38V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 42H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 8H34L32 20C31.5 24 28 28 24 28C20 28 16.5 24 16 20L14 8Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M16.5 15C17 17.5 20 20 24 20C28 20 31 17.5 31.5 15L32 11H16L16.5 15Z" fill="#ffa38b" opacity="0.7" />
    </svg>
  );
}

function BubblesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path d="M24 40V30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 44H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 4H28L27 18C26.8 22 25.5 30 24 30C22.5 30 21.2 22 21 18L20 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M21.5 12C21.7 15 22.8 20 24 20C25.2 20 26.3 15 26.5 12L27 6H21L21.5 12Z" fill="#c9a227" opacity="0.4" />
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
      <rect x="8" y="18" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="6" y="12" width="36" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M24 12V42" stroke="#1a1f3d" strokeWidth="3" opacity="0.8" />
      <path d="M6 16H42" stroke="#1a1f3d" strokeWidth="3" opacity="0.8" />
      <path d="M18 12C18 8 20 6 24 6C28 6 30 8 30 12" stroke="#1a1f3d" strokeWidth="2" fill="none" opacity="0.8" />
      <circle cx="24" cy="12" r="2" fill="#1a1f3d" opacity="0.8" />
    </svg>
  );
}

// Map CMS iconName to icon components
const uspIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: TruckIcon,
  refresh: RefreshIcon,
  star: StarIcon,
  shield: ShieldIcon,
};

// Map CMS iconType to category icon components + styling
const categoryIconMap: Record<string, { Icon: React.ComponentType<{ className?: string }>; color: string; iconColor: string }> = {
  red: { Icon: RedWineIcon, color: "bg-wine/10 hover:bg-wine/15", iconColor: "text-wine" },
  white: { Icon: WhiteWineIcon, color: "bg-gold/10 hover:bg-gold/15", iconColor: "text-gold" },
  rose: { Icon: RoseWineIcon, color: "bg-coral/10 hover:bg-coral/15", iconColor: "text-coral" },
  sparkling: { Icon: BubblesIcon, color: "bg-champagne hover:bg-gold/20", iconColor: "text-charcoal" },
  gift: { Icon: GiftBoxIcon, color: "bg-wine/5 hover:bg-wine/10", iconColor: "text-charcoal" },
};

// Map BlogArticle to the shape used in the template
function mapBlogPost(article: BlogArticle) {
  const categoryLabel = article.tags[0]
    ? article.tags[0].charAt(0).toUpperCase() + article.tags[0].slice(1)
    : "Wijn";
  const region = article.tags[1] || undefined;
  const readTime = article.contentHtml
    ? Math.ceil(article.contentHtml.length / 1000)
    : 5;
  const date = article.publishedAt
    ? article.publishedAt.slice(0, 10)
    : "";
  return {
    slug: article.handle,
    title: article.title,
    excerpt: article.excerpt || "",
    categoryLabel,
    region,
    readTime,
    date,
  };
}

export default async function Home() {
  const [allProducts, heroRaw, uspItems, categoryBlocks, blogArticles] = await Promise.all([
    getProducts(),
    getHeroContent(),
    getUSPItems(),
    getCategoryBlocks(),
    getBlogArticles(3),
  ]);
  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const hero = heroRaw ?? DEFAULT_HERO;
  const featuredBlogPosts = blogArticles.map(mapBlogPost);

  return (
    <>
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
                className="inline-flex items-center justify-center h-13 sm:h-14 px-8 sm:px-10 border border-white/40 text-white text-button uppercase rounded-sm hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300"
              >
                {hero.ctaSecondaryText}
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
      <Section background="default" spacing="none" className="relative -mt-8 sm:-mt-10 z-10">
        <AnimatedUSPBar>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-charcoal/5 border border-sand/40 px-4 sm:px-8 py-5 sm:py-6">
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
              <p className="text-label text-wine/40 mb-2">Handgeselecteerd</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                Onze Favorieten
              </h2>
              <p className="text-grey text-sm sm:text-base mt-2 max-w-md">
                Zorgvuldig geselecteerde wijnen uit de beste Italiaanse wijnhuizen.
              </p>
            </div>
            <Link
              href="/wijnen"
              className="group flex items-center gap-2 text-wine font-medium text-sm hover:text-wine-dark transition-colors"
            >
              Bekijk alles
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
      <Section background="dark" spacing="xl">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <AnimatedSection variant="fadeLeft" className="order-2 lg:order-1">
            <p className="text-label text-gold/60 mb-3">Ontdek per Regio</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 sm:mb-6 leading-tight">
              Van Piemonte<br className="hidden sm:block" /> tot Toscane
            </h2>
            <p className="text-sm sm:text-base text-white/50 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              Onze selectie komt uit de mooiste wijnregio&apos;s van Italië.
              Van de nebbiolo-heuvels van Piemonte tot de sangiovese-dalen van Toscane.
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
          SOCIAL PROOF — Numbers + Testimonials
          ============================================= */}
      <Section background="warm" spacing="xl">
        {/* Trust numbers bar */}
        <AnimatedSection variant="fadeUp">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 text-center">
            {[
              { target: 2500, suffix: "+", label: "Tevreden klanten" },
              { target: 150, suffix: "+", label: "Italiaanse wijnen" },
              { target: 20, suffix: "+", label: "Wijnregio's" },
              { target: 48, suffix: "", label: "Uur snelle levering", prefix: "< " },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-wine leading-none mb-1.5 tabular-nums">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
                </p>
                <p className="text-xs sm:text-sm text-grey font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-label text-wine/40 mb-2">Wat Klanten Zeggen</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">Beoordelingen</h2>
          </div>
        </AnimatedSection>
        <AnimatedStagger className="grid sm:grid-cols-3 gap-5 sm:gap-6" staggerDelay={0.15}>
          {[
            {
              name: "Marloes V.",
              text: "Prachtige selectie! De Barolo was een absolute hit op ons feestje. Wordt nu vaste klant.",
              rating: 5,
              wine: "Montaribaldi Barolo",
            },
            {
              name: "Peter de G.",
              text: "Snelle levering en mooi verpakt. De Amarone overtrof mijn verwachtingen — geweldige prijs-kwaliteit.",
              rating: 5,
              wine: "Amarone della Valpolicella",
            },
            {
              name: "Sandra K.",
              text: "Al drie keer besteld en altijd tevreden. De wijnbeschrijvingen kloppen precies. Aanrader!",
              rating: 5,
              wine: "Valpolicella Ripasso",
            },
          ].map((review) => (
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
            <p className="text-label text-wine/40 mb-2">Shop per Categorie</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">Ontdek Onze Collectie</h2>
          </div>
        </AnimatedSection>
        <AnimatedStagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-5 md:gap-6" staggerDelay={0.08}>
          {categoryBlocks.map((category) => {
            const mapping = categoryIconMap[category.iconType] || categoryIconMap.red;
            const CategoryIcon = mapping.Icon;
            return (
              <StaggerItem key={category.name}>
                <Link
                  href={category.href}
                  className={`${mapping.color} rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:-translate-y-2 group border border-transparent hover:border-wine/10 block`}
                >
                  <div className={`${mapping.iconColor} mb-3 sm:mb-4 flex justify-center`}>
                    <CategoryIcon className="w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="font-serif font-semibold text-charcoal text-sm sm:text-lg mb-0.5 sm:mb-1">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-grey">{category.description}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </AnimatedStagger>
      </Section>

      <PremiumDivider variant="wine" />

      {/* =============================================
          BLOG / MAGAZINE — Editorial grid
          ============================================= */}
      {featuredBlogPosts.length >= 3 && <Section background="default" spacing="xl">
        {/* Editorial masthead */}
        <AnimatedSection variant="fadeUp">
          <div className="mb-14 sm:mb-20">
            {/* Masthead rule */}
            <div className="h-px w-full bg-charcoal/10 mb-10 sm:mb-14" />

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <p className="text-label text-gold tracking-[0.2em] mb-3">Il Giornale</p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-[1.08] tracking-tight">
                  Wijn <span className="font-serif italic text-wine/70">Verhalen</span>
                </h2>
                <p className="text-grey text-sm sm:text-base mt-3 max-w-md leading-relaxed">
                  Verdiep je in de wereld van Italiaanse wijn — van regio&apos;s tot druivenrassen.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-label text-charcoal hover:text-gold transition-colors duration-300 group"
              >
                Alle artikelen
                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Editorial asymmetric grid */}
        <AnimatedSection variant="scaleIn" delay={0.15}>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

            {/* LEAD ARTICLE — Large feature card */}
            <Link
              href={`/blog/${featuredBlogPosts[0].slug}`}
              className="group relative lg:col-span-7"
            >
              {/* Card with cream background and editorial padding */}
              <div className="relative bg-wine-dark overflow-hidden h-full min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col justify-end">
                {/* Subtle warm light from top-left */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(201,162,39,0.07),transparent_55%)]" />

                <div className="relative p-7 sm:p-10 lg:p-12">
                  {/* Editorial number + category line */}
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <span className="font-serif text-[11px] font-semibold tracking-[0.15em] uppercase text-gold/50">No. 01</span>
                    <span className="w-8 h-px bg-gold/25" />
                    <span className="text-label text-white/50">{featuredBlogPosts[0].categoryLabel}</span>
                    {featuredBlogPosts[0].region && (
                      <span className="text-white/30 text-xs hidden sm:inline">/ {featuredBlogPosts[0].region}</span>
                    )}
                  </div>

                  {/* Title — large serif, editorial weight */}
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold text-white leading-[1.12] mb-4 sm:mb-5 group-hover:text-gold transition-colors duration-500 max-w-xl tracking-tight">
                    {featuredBlogPosts[0].title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/45 text-sm sm:text-[15px] leading-relaxed line-clamp-2 max-w-lg mb-8">
                    {featuredBlogPosts[0].excerpt}
                  </p>

                  {/* Footer meta — minimal, refined */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 text-white/30 text-xs tracking-wide">
                      <span>{featuredBlogPosts[0].readTime} min leestijd</span>
                      <span className="hidden sm:inline">{featuredBlogPosts[0].date}</span>
                    </div>
                    <span className="flex items-center gap-2 text-gold/80 text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-400">
                      Lees artikel <ArrowRightIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* RIGHT COLUMN — Two stacked editorial cards with rhythm */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">

              {/* CARD 2 — Warm cream, text-forward */}
              <Link
                href={`/blog/${featuredBlogPosts[1].slug}`}
                className="group relative flex-1"
              >
                <div className="h-full bg-[#f5f0e8] p-6 sm:p-8 lg:p-9 flex flex-col justify-between min-h-[240px] sm:min-h-[260px]">
                  {/* Top: editorial number line */}
                  <div className="flex items-center gap-3 mb-auto">
                    <span className="font-serif text-[11px] font-semibold tracking-[0.15em] uppercase text-gold/50">No. 02</span>
                    <span className="w-6 h-px bg-gold/20" />
                    <span className="text-label text-charcoal/40">{featuredBlogPosts[1].categoryLabel}</span>
                    {featuredBlogPosts[1].region && (
                      <span className="text-charcoal/25 text-xs hidden sm:inline">/ {featuredBlogPosts[1].region}</span>
                    )}
                  </div>

                  {/* Content block — anchored to bottom */}
                  <div className="mt-auto pt-6">
                    <h3 className="font-serif text-lg sm:text-xl lg:text-[1.4rem] font-semibold text-charcoal leading-snug mb-2.5 group-hover:text-wine transition-colors duration-300 line-clamp-2 tracking-tight">
                      {featuredBlogPosts[1].title}
                    </h3>
                    <p className="text-grey/70 text-sm leading-relaxed line-clamp-2 mb-5">
                      {featuredBlogPosts[1].excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/30 text-xs tracking-wide">
                        {featuredBlogPosts[1].readTime} min
                      </span>
                      <span className="flex items-center gap-1.5 text-wine text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        Lees meer <ArrowRightIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* CARD 3 — Deep wine, editorial contrast */}
              <Link
                href={`/blog/${featuredBlogPosts[2].slug}`}
                className="group relative flex-1"
              >
                <div className="h-full bg-wine p-6 sm:p-8 lg:p-9 flex flex-col justify-between min-h-[240px] sm:min-h-[260px]">
                  {/* Top: editorial number line */}
                  <div className="flex items-center gap-3 mb-auto">
                    <span className="font-serif text-[11px] font-semibold tracking-[0.15em] uppercase text-gold/40">No. 03</span>
                    <span className="w-6 h-px bg-gold/15" />
                    <span className="text-label text-white/35">{featuredBlogPosts[2].categoryLabel}</span>
                    {featuredBlogPosts[2].region && (
                      <span className="text-white/20 text-xs hidden sm:inline">/ {featuredBlogPosts[2].region}</span>
                    )}
                  </div>

                  {/* Content block — anchored to bottom */}
                  <div className="mt-auto pt-6">
                    <h3 className="font-serif text-lg sm:text-xl lg:text-[1.4rem] font-semibold text-white leading-snug mb-2.5 group-hover:text-gold transition-colors duration-300 line-clamp-2 tracking-tight">
                      {featuredBlogPosts[2].title}
                    </h3>
                    <p className="text-white/35 text-sm leading-relaxed line-clamp-2 mb-5">
                      {featuredBlogPosts[2].excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-white/25 text-xs tracking-wide">
                        {featuredBlogPosts[2].readTime} min
                      </span>
                      <span className="flex items-center gap-1.5 text-gold/80 text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        Lees meer <ArrowRightIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Mobile: link to all articles */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-label text-charcoal"
          >
            Alle artikelen
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Section>}

    </>
  );
}
