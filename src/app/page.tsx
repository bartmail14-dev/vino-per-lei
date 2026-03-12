import Link from "next/link";
import { Section, Grid } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import dynamic from "next/dynamic";
import { TruckIcon, RefreshIcon, ChevronRightIcon, GrapeIcon, WineBottleIcon, ClockIcon, ArrowRightIcon, MapPinIcon, StarIcon, ShieldIcon } from "@/components/icons";
import { getHeroContent, getUSPItems, getCategoryBlocks, getBlogArticles, DEFAULT_HERO } from "@/lib/shopify-cms";
import type { USPItem, CategoryBlock, BlogArticle } from "@/lib/shopify-cms";

export const revalidate = 60;

// Lazy load the map component (below-fold)
const ItalyWineMap = dynamic(() => import("@/components/map").then(mod => mod.ItalyWineMap), {
  loading: () => <div className="h-[400px] bg-sand/30 rounded-lg animate-pulse" />,
});

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-sand" />
      <div className="mx-3 w-1.5 h-1.5 rounded-full bg-gold/40" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-sand" />
    </div>
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
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] min-h-[500px] sm:min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-banner.webp"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Centered gradient overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content - Centered */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-3xl text-center animate-fade-in-up">
            <p className="text-gold font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 sm:mb-5 animate-fade-in animation-delay-300">
              {hero.subtitle}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6 leading-[1.1] animate-fade-in-up animation-delay-400 text-shadow-hero">
              {hero.titleLine1}
              <br />
              <span className="text-gold">{hero.titleLine2}</span>
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-white/85 mb-6 sm:mb-10 leading-relaxed animate-fade-in animation-delay-500 max-w-2xl mx-auto text-shadow-sm">
              {hero.description}
            </p>
            <div className="flex gap-4 justify-center animate-fade-in-up animation-delay-600">
              <Link
                href={hero.ctaPrimaryLink}
                className="inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-10 bg-wine text-white font-semibold uppercase tracking-wider text-xs sm:text-sm rounded hover:bg-wine-dark transition-colors"
              >
                {hero.ctaPrimaryText}
              </Link>
              <Link
                href={hero.ctaSecondaryLink}
                className="inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-8 border-2 border-white/80 text-white font-semibold uppercase tracking-wider text-xs sm:text-sm rounded hover:bg-white hover:text-charcoal transition-colors"
              >
                {hero.ctaSecondaryText}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-1000 hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 animate-bounce-slow">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* USP Bar */}
      <Section background="warm" spacing="sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 py-2">
          {uspItems.map((usp, i) => {
            const IconComp = uspIconMap[usp.iconName] || TruckIcon;
            const isLast = i === uspItems.length - 1;
            return (
              <div key={usp.title} className={`flex items-center gap-2.5 justify-center ${!isLast ? "sm:border-r sm:border-sand" : ""}`}>
                <IconComp className="w-5 h-5 text-wine flex-shrink-0" />
                <div>
                  <p className="font-semibold text-charcoal text-sm">{usp.title}</p>
                  <p className="text-xs text-grey">{usp.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Italy Wine Regions Map */}
      <Section background="dark" spacing="lg">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-gold/80 text-xs font-medium tracking-[0.2em] uppercase mb-3">Ontdek per Regio</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3 sm:mb-5">Van Piemonte tot Toscane</h2>
            <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-none leading-relaxed">
              Onze selectie komt uit de mooiste wijnregio&apos;s van Italië.
              Van Piemonte tot Toscane — klik op een regio om te ontdekken.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/wijnen?region=piemonte"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 text-white border border-white/10 rounded-full text-xs sm:text-sm font-medium hover:bg-gold/20 hover:border-gold/30 hover:text-gold transition-all"
              >
                <GrapeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Piemonte
              </Link>
              <Link
                href="/wijnen?region=veneto"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 text-white border border-white/10 rounded-full text-xs sm:text-sm font-medium hover:bg-gold/20 hover:border-gold/30 hover:text-gold transition-all"
              >
                <WineBottleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Veneto
              </Link>
              <Link
                href="/wijnen?region=toscana"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 text-white border border-white/10 rounded-full text-xs sm:text-sm font-medium hover:bg-gold/20 hover:border-gold/30 hover:text-gold transition-all"
              >
                <TuscanyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Toscana
              </Link>
            </div>
          </div>
          <div className="flex justify-center order-1 lg:order-2">
            <div className="scale-[0.6] sm:scale-75 lg:scale-100 origin-center -my-6 sm:-my-4 lg:my-0 opacity-80">
              <ItalyWineMap size="lg" />
            </div>
          </div>
        </div>
      </Section>

      <SectionDivider />

      {/* Featured Products */}
      <Section background="default" spacing="lg">
        <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-10">
          <div>
            <p className="text-label text-wine mb-2 tracking-[0.15em]">Handgeselecteerd</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">Onze Favorieten</h2>
          </div>
          <Link
            href="/wijnen"
            className="flex items-center gap-1.5 text-wine font-medium text-sm hover:gap-2.5 transition-all"
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

      {/* Category Quick Links */}
      <Section background="warm" spacing="lg">
        <div className="text-center mb-6 sm:mb-12">
          <p className="text-label text-wine mb-2 tracking-[0.15em]">Shop per Categorie</p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">Ontdek Onze Collectie</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-5 md:gap-6">
          {categoryBlocks.map((category) => {
            const mapping = categoryIconMap[category.iconType] || categoryIconMap.red;
            const CategoryIcon = mapping.Icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className={`${mapping.color} rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center transition-all duration-300 hover:shadow-xl active:scale-95 sm:hover:-translate-y-1.5 group border border-transparent hover:border-wine/10`}
              >
                <div className={`${mapping.iconColor} mb-2 sm:mb-4 flex justify-center`}>
                  <CategoryIcon className="w-10 h-10 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-serif font-semibold text-charcoal text-sm sm:text-lg mb-0.5 sm:mb-1">{category.name}</h3>
                <p className="text-xs sm:text-sm text-grey hidden sm:block">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </Section>

      <SectionDivider />

      {/* Blog Section - Magazine Style */}
      {featuredBlogPosts.length >= 3 && <Section background="default" spacing="lg">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="text-label text-wine mb-2 tracking-[0.15em]">Uit Ons Magazine</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold">Wijn Verhalen</h2>
            <p className="text-grey text-sm sm:text-base mt-2 max-w-lg">Verdiep je in de wereld van Italiaanse wijn — van regio&apos;s tot druivenrassen.</p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-wine font-medium text-sm hover:gap-2.5 transition-all shrink-0"
          >
            Alle artikelen
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Magazine grid */}
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Featured article - large hero card */}
          <Link
            href={`/blog/${featuredBlogPosts[0].slug}`}
            className="group relative lg:col-span-7 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[440px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a]" />
            {/* Animated radial glow on hover */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {/* Large decorative wine bottle silhouette */}
            <svg className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 w-20 h-44 sm:w-32 sm:h-72 lg:w-40 lg:h-[340px] text-white/[0.04] group-hover:text-white/[0.07] transition-colors duration-700" viewBox="0 0 120 260" fill="currentColor">
              <rect x="48" y="0" width="24" height="14" rx="3" />
              <path d="M52 14h16v20l10 16v120c0 12-8 20-18 20H60c-10 0-18-8-18-20V50l10-16V14z" />
              <path d="M44 100h32v2H44z" opacity="0.3" />
              <ellipse cx="60" cy="130" rx="10" ry="10" opacity="0.15" />
              <path d="M50 200h20v2H50z" opacity="0.2" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Number indicator */}
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gold/30 flex items-center justify-center">
              <span className="text-gold/70 text-xs sm:text-sm font-serif font-semibold">01</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full backdrop-blur-md border border-gold/20">
                  {featuredBlogPosts[0].categoryLabel}
                </span>
                {featuredBlogPosts[0].region && (
                  <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/70 font-medium">
                    <MapPinIcon className="w-3 h-3" />
                    {featuredBlogPosts[0].region}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-gold transition-colors duration-500 leading-[1.15]">
                {featuredBlogPosts[0].title}
              </h3>
              <p className="text-white/70 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2 max-w-xl leading-relaxed">
                {featuredBlogPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white/50 text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {featuredBlogPosts[0].readTime} min leestijd
                  </span>
                  <span className="hidden sm:inline">{featuredBlogPosts[0].date}</span>
                </div>
                <span className="flex items-center gap-1.5 text-gold text-xs sm:text-sm font-medium translate-x-0 group-hover:-translate-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Lees artikel <ArrowRightIcon className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Two stacked cards */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {/* Toscana card */}
            <Link
              href={`/blog/${featuredBlogPosts[1].slug}`}
              className="group relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[2.5/1] sm:aspect-[3/2] lg:aspect-auto lg:min-h-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B6914] via-gold/70 to-wine/60" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {/* Tuscan hills silhouette */}
              <svg className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 text-black/10" viewBox="0 0 400 80" preserveAspectRatio="none" fill="currentColor">
                <path d="M0 80 Q50 30 100 50 Q150 70 200 40 Q250 10 300 35 Q350 55 400 25 V80z" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Number */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-white/60 text-[10px] sm:text-xs font-serif font-semibold">02</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-6">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md border border-gold/20">
                    {featuredBlogPosts[1].categoryLabel}
                  </span>
                  {featuredBlogPosts[1].region && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-white/70">
                      <MapPinIcon className="w-3 h-3" />
                      {featuredBlogPosts[1].region}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base sm:text-xl lg:text-2xl font-semibold text-white group-hover:text-gold transition-colors duration-500 leading-snug line-clamp-2">
                  {featuredBlogPosts[1].title}
                </h3>
                <p className="hidden sm:block text-white/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                  {featuredBlogPosts[1].excerpt}
                </p>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <span className="flex items-center gap-1 text-white/40 text-[10px] sm:text-xs">
                    <ClockIcon className="w-3 h-3" />
                    {featuredBlogPosts[1].readTime} min
                  </span>
                  <span className="flex items-center gap-1 text-gold text-[10px] sm:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Lees meer <ArrowRightIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Amarone card */}
            <Link
              href={`/blog/${featuredBlogPosts[2].slug}`}
              className="group relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[2.5/1] sm:aspect-[3/2] lg:aspect-auto lg:min-h-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-wine-light via-[#1a1f3d] to-[#0a0d1a]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(201,162,39,0.08),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {/* Grape cluster pattern */}
              <svg className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-14 h-18 sm:w-20 sm:h-28 text-white/[0.05] group-hover:text-white/[0.08] transition-colors duration-700" viewBox="0 0 60 80" fill="currentColor">
                <circle cx="20" cy="28" r="7" />
                <circle cx="34" cy="28" r="7" />
                <circle cx="27" cy="20" r="7" />
                <circle cx="14" cy="40" r="7" />
                <circle cx="27" cy="38" r="7" />
                <circle cx="40" cy="40" r="7" />
                <circle cx="20" cy="50" r="7" />
                <circle cx="34" cy="50" r="7" />
                <circle cx="27" cy="58" r="7" />
                <path d="M27 12V4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Number */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-white/60 text-[10px] sm:text-xs font-serif font-semibold">03</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-6">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md border border-gold/20">
                    {featuredBlogPosts[2].categoryLabel}
                  </span>
                  {featuredBlogPosts[2].region && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-white/70">
                      <MapPinIcon className="w-3 h-3" />
                      {featuredBlogPosts[2].region}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base sm:text-xl lg:text-2xl font-semibold text-white group-hover:text-gold transition-colors duration-500 leading-snug line-clamp-2">
                  {featuredBlogPosts[2].title}
                </h3>
                <p className="hidden sm:block text-white/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                  {featuredBlogPosts[2].excerpt}
                </p>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <span className="flex items-center gap-1 text-white/40 text-[10px] sm:text-xs">
                    <ClockIcon className="w-3 h-3" />
                    {featuredBlogPosts[2].readTime} min
                  </span>
                  <span className="flex items-center gap-1 text-gold text-[10px] sm:text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Lees meer <ArrowRightIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile: link to all articles */}
        <Link
          href="/blog"
          className="sm:hidden flex items-center justify-center gap-1.5 text-wine font-medium text-sm py-4 mt-2"
        >
          Alle artikelen
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </Section>}

    </>
  );
}
