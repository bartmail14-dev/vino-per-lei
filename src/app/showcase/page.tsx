import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { AnimatedSection, AnimatedStagger, StaggerItem } from "@/components/home/HomeAnimations";
import {
  ShieldIcon,
  SearchIcon,
  BoltIcon,
  CheckCircleIcon,
  EyeIcon,
  NewspaperIcon,
  ChevronDownIcon,
  GridIcon,
  BookOpenIcon,
  AwardIcon,
  SettingsIcon,
  CartIcon,
  GiftIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Technisch Dossier — Vino per Lei | Blue Wire Media",
  description: "Projectoverzicht en technisch dossier van de Vino per Lei webshop, ontwikkeld door Blue Wire Media.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

const TIMELINE = [
  {
    step: 1,
    title: "Fundament — 3 t/m 5 maart",
    description: "De complete webshop is vanuit nul opgebouwd in Next.js met TypeScript. De wijnencatalogus is gegroeid van 0 naar 36 producten, elk met authentieke flessen-foto\u2019s en productinformatie. We hebben een interactieve SVG-kaart van Itali\u00eb gebouwd met 20 klikbare wijnregio\u2019s (Piemonte, Veneto, Toscana en meer), een volledige checkout-flow en een hero banner die eerst statisch was en later vervangen is door een geoptimaliseerde video. Het kleurenschema is in deze week drie keer ge\u00eft\u00ebreerd \u2014 van bordeaux rood, naar navy blauw, naar het huidige wine gradient \u2014 en het SVG-logo is ontworpen als hangend vaandel in de header.",
    tags: ["Next.js", "36 Producten", "SVG Kaart", "Checkout", "Video Banner", "Hero Design", "Logo"],
  },
  {
    step: 2,
    title: "Personalisatie — 6 maart",
    description: "Alle custom SVG-iconen zijn vervangen door de lucide-react icon library voor visuele consistentie over de hele site. De proefervaring- en food pairing-iconen zijn opnieuw ontworpen. Er zijn placeholder-pagina\u2019s aangemaakt voor Cadeaus, Over Ons en Blog, en een blogsectie over Italiaanse wijnregio\u2019s is toegevoegd. Het logo is responsive gemaakt (vaantje op mobiel), de proefgarantie-badge is verwijderd, een horizontale scroll-bug is gefixt, en de offertepagina is specifiek gepersonaliseerd voor jouw merk.",
    tags: ["Lucide Icons", "Blog", "Cadeaus", "Over Ons", "Responsive Logo", "Offerte", "Mobile Fix"],
  },
  {
    step: 3,
    title: "Shopify koppeling — 7 maart",
    description: "Dit was een keerpunt: de volledige switch van hardcoded mock-data naar de Shopify Storefront API. Vanaf dit moment worden alle producten, prijzen, afbeeldingen en beschrijvingen live opgehaald uit jouw Shopify-account. Dit betekent dat wanneer jij een wijn toevoegt of een prijs wijzigt in Shopify Admin, de webshop dit automatisch overneemt \u2014 zonder dat wij code hoeven aan te passen.",
    tags: ["Shopify Storefront API", "Live Data", "Realtime Prijzen", "CMS Integratie", "Geen Mock Data"],
  },
  {
    step: 4,
    title: "Professionaliteit — 12 maart",
    description: "Alle wettelijk verplichte pagina’s zijn toegevoegd: Privacy, Algemene Voorwaarden en Cookies, inclusief een cookie consent banner. KvK-nummer (98874977) en BTW-nummer (NL005360033B10) staan in de footer. De checkout is verplaatst naar Shopify’s eigen beveiligde omgeving, nep-reviews en mock-authenticatie zijn volledig verwijderd. Daarnaast zijn alle wijn-PNG’s geconverteerd naar WebP (van 31 MB naar 2,4 MB, 92% kleiner), de hero banner van 1,5 MB naar 91 KB (94% kleiner), en de hero video van 4,1 MB naar 1,5 MB (63% kleiner).",
    tags: ["Privacy & Voorwaarden", "Cookie Consent", "KvK/BTW", "Shopify Checkout", "WebP Compressie", "92% Kleiner", "Sitemap & Robots"],
  },
  {
    step: 5,
    title: "Design upgrade — 13 en 14 maart",
    description: "Een grote visuele sprong. Het SVG-logo is opnieuw ontworpen als component en geïntegreerd in Header, Footer en de AgeGate. Scroll-animaties, een shimmer-effect op productkaarten en een testimonials-upgrade geven de site een premium gevoel. De Over Ons-pagina is volledig herontworpen, de Cadeaus-pagina toont nu echte producten, en de blog heeft een magazine-achtige listing gekregen met rijke detailpagina’s, categoriefilter, deelknoppen, leesvoortgangsindicator en een newsletter-CTA.",
    tags: ["SVG Logo", "Scroll Animaties", "Blog Magazine Layout", "Cadeaus Pagina", "Over Ons Redesign", "Shimmer Effect", "Newsletter CTA"],
  },
  {
    step: 6,
    title: "Premium polish — 16 t/m 18 maart",
    description: "Een complete design overhaul van de productkaarten, blog en UI-details. Premium product cards met een grain texture zijn geïntroduceerd en de texture is gecentraliseerd als herbruikbare CSS-variabele. Een hydration crash in de blog is opgelost, een Tailwind v4 build-crash is gefixt, en een gedeeld newsletter-component zorgt voor consistentie. Het kleurenschema is definitief vastgelegd: van burgundy naar het huidige navy-blauw gradient, doorgevoerd op elke pagina.",
    tags: ["Product Cards Redesign", "Grain Texture", "Hydration Fix", "Tailwind v4", "Navy Gradient", "Shared Components", "Blog Polish"],
  },
  {
    step: 7,
    title: "Audit & hardening \u2014 18 maart",
    description: "Een grondige audit van de volledige codebase in twee rondes. Ronde 1: checkout verplaatst naar Shopify cart permalink, alle placeholder content verwijderd, zoek- en sorteerfunctionaliteit gebouwd, video gecomprimeerd, alle wijndata aangevuld met specifieke serveertemperaturen en EU-verplichte allergeninformatie, én alle teksten herschreven naar warme persoonlijke copy. Ronde 2: ongebruikte code en dependencies opgeruimd, SEO-metadata op alle pagina’s, JSON-LD structured data, WCAG AA touch targets van 44px, en cookie-based rate limiting voor serverless.",
    tags: ["Volledige Audit", "Security Hardening", "JSON-LD SEO", "WCAG AA", "Rate Limiting", "EU Allergeninformatie", "Code Cleanup", "Copy Rewrite"],
  },
  {
    step: 8,
    title: "Showcase & icons — 22 maart",
    description: "Deze showcase-pagina is gebouwd met live data uit Shopify, zodat je het echte resultaat ziet in plaats van screenshots. Daarnaast zijn 12 inline SVG-duplicaten gecentraliseerd in één icon library, en zijn er zes premium categorie-iconen ontworpen (RedWineIcon, WhiteWineIcon, RoséWineIcon, BubblesIcon, GiftBoxIcon, TuscanyIcon) op een 64×64 viewBox. De Cadeaus-pagina heeft een upgrade gekregen met gouden sparkle-particles in de hero, gradient gift cards en een “Zo Werkt Het”-timeline met trust signals.",
    tags: ["Showcase Pagina", "Icon Library", "6 Premium Icons", "Cadeaus Upgrade", "Sparkle Particles", "Live Shopify Data"],
  },
  {
    step: 9,
    title: "Handleiding, mobile & deploy — 23 maart",
    description: "Een volledige handleiding is gebouwd op /handleiding met 8 secties, zoekfunctie, Shopify Admin-screenshots \u00e9n live website-screenshots met rode annotaties zodat je precies ziet waar elke instelling terechtkomt. Daarnaast is de hele site getest op iPhone-formaat (390\u00d7844px) \u2014 twee overflow-bugs zijn gefixt (wine regions animatie en kortingsbadge op productkaarten). Een CMS key-mismatch is opgelost: de verzendkosten en gratis-verzenddrempel worden nu correct uit Shopify gelezen in plaats van altijd terug te vallen op standaardwaarden. De site is gedeployed naar Vercel met beveiligingssleutels en een projectoverzicht voor jou op de handleiding-pagina.",
    tags: ["Handleiding Pagina", "8 Secties", "20 Screenshots", "Mobile Fix", "CMS Key Fix", "Vercel Deploy", "Projectoverzicht"],
  },
] as const;

const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Beveiliging",
    description: "Content Security Policy headers, HSTS, X-Frame-Options DENY en X-Content-Type-Options nosniff beschermen tegen aanvallen. Het contactformulier en de nieuwsbrief hebben cookie-based rate limiting (maximaal 5 verzoeken per 60 seconden) plus een honeypot anti-spam veld. Alle invoer wordt server-side gevalideerd met Zod, en foutmeldingen lekken nooit technische details naar bezoekers.",
  },
  {
    icon: SearchIcon,
    title: "Vindbaarheid (SEO)",
    description: "Een sitemap.xml bevat alle 18 pagina\u2019s, dynamische wijn-URLs \u00e9n blogartikelen. Google krijgt JSON-LD structured data (Organization, BreadcrumbList, BlogPosting) en elke pagina heeft OpenGraph + Twitter Card meta tags met een standaard OG-afbeelding. Canonical URLs en een correcte h1-h6 hi\u00ebrarchie zorgen voor maximale vindbaarheid.",
  },
  {
    icon: BoltIcon,
    title: "Performance",
    description: "Alle wijnafbeeldingen zijn geconverteerd van PNG naar WebP: van 31 MB naar 2,4 MB (92% besparing). De hero banner ging van 1,5 MB naar 91 KB (94%) en de hero video van 4,1 MB naar 1,5 MB (63%). Productpagina\u2019s worden elke 5 minuten ververst via ISR, blogpagina\u2019s elk uur. Below-fold componenten zoals de Itali\u00eb-kaart laden pas als je ernaartoe scrollt.",
  },
  {
    icon: EyeIcon,
    title: "Toegankelijkheid (WCAG AA)",
    description: "Alle knoppen en links hebben minimaal 44\u00d744px touch targets. De hele site is navigeerbaar met het toetsenbord, inclusief het mega menu, met een skip-to-content link bovenaan. Dropdowns hebben aria-expanded/aria-haspopup, het mobiele menu heeft een focus trap, en animaties worden automatisch uitgeschakeld als een bezoeker prefers-reduced-motion heeft ingesteld.",
  },
  {
    icon: CartIcon,
    title: "Shopify Integratie",
    description: "Alle productdata \u2014 prijzen, afbeeldingen, beschrijvingen en tot 10 varianten per product \u2014 komt live uit de Shopify Storefront API. De homepage hero, USP-items en categorieblokken worden beheerd via Shopify CMS metaobjects. De checkout draait op Shopify\u2019s eigen PCI-compliant platform, en blogartikelen en de nieuwsbrieflijst zijn eveneens gekoppeld.",
  },
  {
    icon: CheckCircleIcon,
    title: "Wettelijke Compliance",
    description: "KvK-nummer 98874977 en BTW-nummer NL005360033B10 staan in de footer. Elke wijnpagina toont \"Bevat sulfieten\" (EU-verplichting voor allergeninformatie). Een cookie consent banner slaat toestemming op via localStorage \u00e9n HTTP cookies, en er zijn aparte pagina\u2019s voor Privacy, Voorwaarden en Cookies. De leeftijdsverificatie (18+) gate blokkeert minderjarigen, en testimonials zijn gelabeld als \"proefklanten\".",
  },
  {
    icon: GridIcon,
    title: "Responsive Design",
    description: "De site is mobile-first gebouwd. Op mobiel krijg je een hamburger menu met volledige navigatie en een accordion footer; op desktop wordt dat een 3-koloms footer. Het productgrid schaalt van 1 kolom (mobiel) naar 2 kolommen (tablet) naar 4 kolommen (desktop). De announcement bar en payment icons rij passen zich automatisch aan op elk schermformaat.",
  },
  {
    icon: BookOpenIcon,
    title: "Blog Platform",
    description: "Een magazine-stijl listing pagina met categorie filters en scroll-animaties. Artikelpagina\u2019s hebben een inhoudsopgave, leesvoortgang indicator, floating share bar en gerelateerde artikelen onderaan. Shopify dient als CMS backend, zodat je artikelen gewoon in Shopify Admin schrijft en ze automatisch op de site verschijnen met nieuwsbrief CTA\u2019s ertussen.",
  },
  {
    icon: AwardIcon,
    title: "Gebruikerservaring",
    description: "Smooth scrolling via Lenis, parallax effect op de hero en staggered scroll-animaties op productgrids en secties. Animated counters tellen op naar de actuele wijncollectie, 3 regio\u2019s en 12+ producenten. De cadeaupagina heeft gouden shimmer particles, premium dividers scheiden secties, en alle hover states hebben translate- en shadow-transities voor een luxe gevoel.",
  },
  {
    icon: SettingsIcon,
    title: "Code Kwaliteit",
    description: "TypeScript strict mode staat aan, de build heeft 0 errors en 0 warnings, en ESLint is schoon. Een centrale icon library beheert 60+ Lucide icons en 7 custom wijn-iconen. Design tokens voor kleuren en border-radius zorgen voor consistentie, Zod validatie draait op zowel client als server, en de component architectuur is uniform opgezet over alle 59 componenten.",
  },
] as const;

const WE_HANDLE = [
  {
    title: "Mobiele responsive check",
    description: "De volledige site is getest op iPhone-formaat (390\u00d7844px) met uitgebreide device-tests. Twee overflow-bugs zijn gevonden en opgelost: een horizontale scroll op de homepage door een animatie in de wijnregio-sectie, en een kortingsbadge die buiten productkaarten viel op smalle schermen. Alle 8 pagina\u2019s zijn nu volledig responsive.",
    status: "Afgerond",
  },
  {
    title: "Rate limit secret geconfigureerd",
    description: "De cryptografische sleutel voor de server-side rate limiter is gegenereerd en geconfigureerd in Vercel. De spam-bescherming op het contactformulier en de nieuwsbriefaanmelding werkt nu betrouwbaar, ook na serverless cold starts.",
    status: "Afgerond",
  },
  {
    title: "CMS key-mismatch opgelost",
    description: "De Shopify CMS-velden voor verzendkosten en gratis-verzenddrempel werden niet correct uitgelezen door een verschil tussen Engelse code-keys en Nederlandse Shopify-labels. Dit is opgelost \u2014 wijzigingen in Shopify Admin worden nu direct overgenomen op de website.",
    status: "Afgerond",
  },
  {
    title: "Handleiding gebouwd",
    description: "Een volledige handleiding op /handleiding met 8 secties, zoekfunctie, 13 Shopify Admin-screenshots en 7 live website-screenshots met rode annotaties. Inclusief projectoverzicht met wat er klaar is en wat er nog nodig is.",
    status: "Afgerond",
  },
  {
    title: "Vercel productie-deploy",
    description: "De site is gedeployed naar vino-per-lei.vercel.app met alle environment variables correct geconfigureerd. 23 routes, 0 build errors.",
    status: "Afgerond",
  },
  {
    title: "Shopify API-token roteren",
    description: "Het huidige API-token is tijdens ontwikkeling in de git-history terechtgekomen. Wij genereren een volledig nieuw Storefront API-token in Shopify Admin \u2192 Settings \u2192 Apps, updaten de environment variables op zowel de lokale ontwikkelomgeving als Vercel, en verifi\u00ebren dat de productcatalogus, checkout en CMS-integratie correct blijven functioneren. Het oude token wordt daarna ingetrokken.",
    status: "Gepland",
  },
  {
    title: "Mailgun e-mailverkeer opzetten",
    description: "Wij maken een Mailgun-account aan op het EU-endpoint (api.eu.mailgun.net) voor GDPR-compliance. Het domein mg.vinoperlei.nl wordt geverifieerd met SPF-, DKIM- en MX-records bij de domeinprovider. De API-key en domeinnaam worden als environment variables in Vercel geconfigureerd. Zowel het contactformulier als de nieuwsbriefaanmelding worden end-to-end getest \u2014 van formulier tot inbox, inclusief de HTML e-mail templates.",
    status: "Gepland",
  },
  {
    title: "DNS vinoperlei.nl \u2192 Vercel",
    description: "Wij zetten een CNAME-record (cname.vercel-dns.com) bij de domeinprovider, configureren het domein in het Vercel-dashboard en zorgen dat HTTPS automatisch wordt geactiveerd via Let\u2019s Encrypt. De www-variant wordt doorgestuurd naar het kale domein. Er is geen downtime \u2014 de oude site blijft bereikbaar tot de DNS-propagatie compleet is (meestal 15\u201360 minuten).",
    status: "Gepland",
  },
  {
    title: "Carla\u2019s Shopify staff account aanmaken",
    description: "Zodra we Carla\u2019s e-mailadres hebben, maken we een Shopify staff account aan met rechten voor producten, content en bestellingen. Zo kan zij zelf de webshop beheren via de handleiding.",
    status: "Wacht op info",
  },
  {
    title: "Ordernotificaties instellen",
    description: "Wij configureren Shopify-notificaties zodat Carla direct een e-mail krijgt bij elke nieuwe bestelling. Hiervoor hebben we haar e-mailadres nodig.",
    status: "Wacht op info",
  },
  {
    title: "Telefoonnummer invoeren",
    description: "Zodra Carla haar telefoonnummer doorgeeft, vullen wij het in via de Shopify CMS-settings. Het nummer verschijnt dan automatisch op de contactpagina, in de footer, en in de meta-informatie voor Google.",
    status: "Wacht op info",
  },
  {
    title: "Blog hero-afbeeldingen",
    description: "Per blogartikel uploaden wij een hero-foto (16:9 verhouding, minimaal 1200px breed) in de Shopify blog-editor. Deze afbeeldingen verschijnen op de blog listing pagina, de detail pagina en als OpenGraph preview bij het delen op social media. Als Carla eigen foto\u2019s heeft, verwerken wij die \u2014 anders selecteren wij passende beelden.",
    status: "Wacht op foto\u2019s",
  },
  {
    title: "Shopify CMS hero tekst",
    description: "In Shopify Admin staat mogelijk nog de oude CTA-tekst \u201cWie is Carla?\u201d in het homepage_hero metaobject. Wij wijzigen dit naar \u201cOver Vino per Lei\u201d zodat de homepage-button de juiste tekst toont.",
    status: "Gepland",
  },
  {
    title: "Productdata verifi\u00ebren",
    description: "Wij controleren of alle wijnen de juiste metafields hebben in Shopify: is_featured voor de homepage-sectie \u201cOnze Favorieten\u201d, regio-tags voor filtering, en proefnotities. Eventueel ontbrekende data vullen wij aan.",
    status: "Gepland",
  },
] as const;

const CARLA_STEP = {
  title: "Betalingen activeren in Shopify",
  description: "Dit is de enige stap die jij zelf doet \u2014 en het kost je maximaal 5 minuten. Shopify heeft om veiligheidsredenen jouw persoonlijke verificatie nodig om betalingen te activeren. Ga naar Shopify Admin \u2192 Settings \u2192 Payments en zet iDEAL, creditcard en Bancontact aan. Wij hebben een stap-voor-stap handleiding voor je klaargezet zodat je er zo doorheen klikt. Zodra dit aan staat, kunnen klanten afrekenen \u2014 en wij controleren daarna of elke betaalmethode correct doorkomt.",
} as const;

export default async function ShowcasePage() {
  const allProducts = await getProducts();
  const featured = allProducts.filter((p) => p.isFeatured);
  const featuredProducts = featured.length > 0 ? featured.slice(0, 4) : allProducts.slice(0, 4);
  const totalProducts = allProducts.length;
  const displayCount = totalProducts > 0 ? totalProducts : 19;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] bg-wine-gradient flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Shimmer background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(201,162,39,0.05),transparent_50%)]" />

        <AnimatedSection variant="fadeUp">
          <p className="text-label text-gold/60 mb-4 tracking-[3px] text-xs">
            Een presentatie van Blue Wire Media
          </p>
          <p className="text-label text-gold mb-8 tracking-[5px] uppercase text-sm">
            Technisch Dossier &mdash; Maart 2026
          </p>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-white font-normal leading-[1.05] mb-4">
            Vino per Lei
          </h1>
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-gold italic leading-tight mb-8">
            Van prototype naar productie
          </p>
          <div className="w-16 h-px bg-gold/40 mx-auto mb-8" />
          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed mb-4">
            Drie weken ontwikkeling. 150+ commits. Een complete webshop gebouwd
            op Next.js&nbsp;16, TypeScript en de Shopify Storefront&nbsp;API.
          </p>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-10">
            Dit dossier documenteert elke verbetering, technische keuze
            en volgende stap voor de lancering van vinoperlei.nl.
          </p>
        </AnimatedSection>

        {/* Scroll hint */}
        <div className="absolute bottom-20 animate-bounce">
          <ChevronDownIcon className="w-6 h-6 text-white/40" />
        </div>
        <p className="absolute bottom-10 text-white/30 text-xs tracking-[2px]">
          23 maart 2026 &middot; Blue Wire Media
        </p>
      </section>

      {/* ===== STATS BAR ===== */}
      <Section background="dark" spacing="md">
        <AnimatedSection variant="fadeUp">
          <p className="text-center text-white/40 text-xs tracking-[3px] uppercase mb-8">
            Het project in cijfers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6 text-center max-w-4xl mx-auto">
            {[
              { number: "150+", label: "Commits" },
              { number: "130", label: "Bronbestanden" },
              { number: "22.000+", label: "Regels code" },
              { number: "19", label: "Pagina\u2019s" },
              { number: "60", label: "Componenten" },
              { number: "0", label: "Build errors" },
              { number: "3", label: "Weken ontwikkeling" },
              { number: "AA", label: "WCAG Toegankelijkheid" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl sm:text-5xl font-bold text-gold leading-none mb-2">
                  {stat.number}
                </p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Section>

      {/* ===== BEFORE/AFTER SCREENSHOT ===== */}
      <Section background="dark" spacing="xl" className="bg-wine-gradient-subtle">
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-12">
            <p className="text-label text-gold mb-3">Het resultaat</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
              Jouw webshop vandaag
            </h2>
            <p className="text-white/60 text-base max-w-lg mx-auto">
              De homepage met het vernieuwde navy-blauw kleurenschema, verbeterde copy en professionele footer.
            </p>
          </div>
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src="/showcase-after.png"
              alt="Vino per Lei homepage — huidige versie"
              width={1280}
              height={2040}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="text-center text-white/40 text-sm mt-5 italic">
            Homepage — maart 2026
          </p>
        </AnimatedSection>
      </Section>

      {/* ===== FEATURED WINES (LIVE SHOPIFY DATA) ===== */}
      <Section background="default" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-4">
            <p className="text-label text-wine/40 mb-2">Live uit de webshop</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
              {displayCount} wijnen, echte data
            </h2>
            <p className="text-grey text-base max-w-lg mx-auto mb-3">
              Geen placeholders meer. Alle productkaarten tonen live data uit Shopify — prijzen, afbeeldingen, regio&apos;s en profielscores.
            </p>
          </div>
          {/* Filter demo links */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { label: "Alle wijnen", href: "/wijnen" },
              { label: "Piemonte", href: "/wijnen?region=piemonte" },
              { label: "Veneto", href: "/wijnen?region=veneto" },
              { label: "Toscana", href: "/wijnen?region=toscana" },
              { label: "Rood", href: "/wijnen?type=red" },
              { label: "Wit", href: "/wijnen?type=white" },
            ].map((filter) => (
              <Link
                key={filter.label}
                href={filter.href}
                className="px-4 py-2 text-sm border border-wine/15 text-wine rounded-full hover:bg-wine hover:text-white transition-all duration-200"
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.12}>
          {featuredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </AnimatedStagger>

        <AnimatedSection variant="fadeUp" delay={0.3}>
          <div className="text-center mt-10">
            <Link
              href="/wijnen"
              className="inline-flex items-center gap-2 px-8 py-3 bg-wine-gradient text-white text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
            >
              Bekijk alle {displayCount} wijnen
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </Section>

      {/* ===== TIMELINE ===== */}
      <Section background="warm" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <p className="text-label text-wine/40 mb-3">De reis</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Wat er allemaal is gebeurd
          </h2>
          <p className="text-grey text-base max-w-lg mb-14">
            In negen rondes is de webshop van prototype naar productie-klaar gebracht.
          </p>
        </AnimatedSection>

        <div className="relative pl-10 sm:pl-16 space-y-10">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-wine/20 to-gold" />

          {TIMELINE.map((item) => (
            <AnimatedSection key={item.step} variant="fadeUp" delay={item.step * 0.08}>
              <div className="relative bg-white rounded-xl p-6 sm:p-8 border border-sand/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                {/* Dot */}
                <div className="absolute -left-[calc(2.5rem+7px)] sm:-left-[calc(4rem+7px)] top-8 w-3.5 h-3.5 rounded-full bg-gold border-[3px] border-cream shadow-[0_0_0_2px] shadow-gold" />

                <div className="inline-flex items-center justify-center w-8 h-8 bg-wine-gradient text-white rounded-lg text-sm font-semibold mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif text-xl sm:text-[22px] text-wine mb-3 font-semibold">
                  {item.title}
                </h3>
                <p className="text-grey text-[15px] leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                    Afgerond
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* ===== FEATURES GRID ===== */}
      <Section background="default" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <p className="text-label text-wine/40 mb-3">Onder de motorkap</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Wat bezoekers niet zien, maar w&eacute;l merken
          </h2>
          <p className="text-grey text-base max-w-lg mb-14">
            Technische verbeteringen die zorgen voor een snellere, veiligere en betrouwbaardere ervaring.
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5" staggerDelay={0.08}>
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="bg-white rounded-xl p-7 border border-sand/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-wine-gradient rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-lg text-wine mb-2 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-grey text-[15px] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </AnimatedStagger>
      </Section>

      {/* ===== PAGE OVERVIEW GRID ===== */}
      <Section background="warm" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <p className="text-label text-wine/40 mb-3">Overzicht</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Elke pagina, met zorg gebouwd
          </h2>
          <p className="text-grey text-base max-w-lg mb-14">
            19 pagina&apos;s, elk met een eigen doel en doordachte functionaliteit.
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid md:grid-cols-2 gap-4" staggerDelay={0.06}>
          {[
            { name: "Homepage", path: "/", desc: "Hero met parallax effect, USP balk, uitgelichte wijnen, interactieve Itali\u00eb-kaart, geanimeerde statistieken, testimonials, blog magazine sectie. 513 regels code." },
            { name: "Wijnen", path: "/wijnen", desc: "Volledige productcatalogus met zoekbalk, filters (regio, type, druif, prijs), sortering en grid/lijst weergave. Live data uit Shopify." },
            { name: "Wijndetail", path: "/wijnen/[handle]", desc: "Productpagina met afbeelding carrousel, smaakprofiel, food pairings, regio spotlight, reviews en sticky aankoopbalk." },
            { name: "Cadeaus", path: "/cadeaus", desc: "Landingspagina met gouden sparkle particles, drie cadeau-opties (Enkele Fles, Duo Pakket, Proeverij Box), \u201cZo Werkt Het\u201d timeline en trust signals." },
            { name: "Over Ons", path: "/over-ons", desc: "Het persoonlijke verhaal van Carla. Authentieke, warme copy." },
            { name: "Blog", path: "/blog", desc: "Magazine-stijl overzicht met categorie filter, animaties en nieuwsbrief CTA." },
            { name: "Blog Artikel", path: "/blog/[slug]", desc: "Rijke leespagina met inhoudsopgave, leesvoortgang, floating share bar, gerelateerde artikelen." },
            { name: "Contact", path: "/contact", desc: "Contactformulier met Zod validatie, honeypot anti-spam, en geanimeerde kaart." },
            { name: "Klantenservice", path: "/klantenservice", desc: "Overzichtspagina met links naar FAQ, verzending en retourneren." },
            { name: "FAQ", path: "/klantenservice/faq", desc: "Veelgestelde vragen met accordion component." },
            { name: "Verzending", path: "/klantenservice/verzending", desc: "Verzendbeleid en levertijden." },
            { name: "Retourneren", path: "/klantenservice/retourneren", desc: "Retourbeleid en procedure." },
            { name: "Checkout", path: "/checkout", desc: "Bestelflow met contactgegevens, verzending, betaling en overzicht." },
            { name: "Checkout Success", path: "/checkout/success", desc: "Bedankpagina na succesvolle bestelling." },
            { name: "Privacy", path: "/privacy", desc: "Privacyverklaring conform AVG/GDPR." },
            { name: "Voorwaarden", path: "/voorwaarden", desc: "Algemene voorwaarden." },
            { name: "Cookies", path: "/cookies", desc: "Cookiebeleid." },
            { name: "Handleiding", path: "/handleiding", desc: "Stap-voor-stap Shopify handleiding met 20 screenshots, zoekfunctie en projectoverzicht (niet publiek, noindex)." },
            { name: "Showcase", path: "/showcase", desc: "Deze pagina (niet publiek, noindex)." },
          ].map((page, i) => (
            <StaggerItem key={page.name}>
              <div className={`rounded-xl p-6 border-l-4 border-wine/40 ${i % 2 === 0 ? "bg-white" : "bg-cream/60"} hover:shadow-md transition-shadow duration-200`}>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-serif text-lg text-wine font-semibold">{page.name}</h3>
                  <code className="text-xs text-wine/40 font-mono">{page.path}</code>
                </div>
                <p className="text-grey text-sm leading-relaxed">{page.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </AnimatedStagger>
      </Section>

      {/* ===== ARCHITECTURE OVERVIEW ===== */}
      <Section background="dark" spacing="xl" className="bg-wine-gradient">
        <AnimatedSection variant="fadeUp">
          <p className="text-label text-gold/60 mb-3 tracking-[3px] text-xs">Architectuur</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            De technische architectuur
          </h2>
          <p className="text-white/60 text-base max-w-lg mx-auto mb-14 text-center">
            De volledige tech stack achter Vino per Lei, van frontend tot infrastructuur.
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
          {[
            {
              title: "Frontend",
              items: [
                "Next.js 16.1.6 (App Router, Server Components)",
                "React 19 (nieuwste versie)",
                "TypeScript strict mode",
                "Tailwind CSS v4",
              ],
            },
            {
              title: "Animaties",
              items: [
                "Framer Motion v12 (scroll-triggered animaties)",
                "Lenis (smooth scrolling)",
                "CSS keyframe animaties (hero, fade-in)",
              ],
            },
            {
              title: "Backend",
              items: [
                "Shopify Storefront API (producten, checkout)",
                "Shopify CMS (metaobjects voor alle content)",
                "Next.js API Routes (contact, nieuwsbrief)",
                "Mailgun EU (e-mail verzending)",
              ],
            },
            {
              title: "Infrastructuur",
              items: [
                "Vercel (hosting, CDN, edge network)",
                "ISR (pagina\u2019s worden elke 5 min ververst)",
                "Automatische HTTPS via Let\u2019s Encrypt",
                "49 statische pagina\u2019s bij build",
              ],
            },
          ].map((category) => (
            <StaggerItem key={category.title}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-gold/30 transition-colors duration-300">
                <h3 className="font-serif text-xl text-gold mb-4 font-semibold">{category.title}</h3>
                <ul className="space-y-2.5">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-white/70 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </AnimatedStagger>
      </Section>

      {/* ===== MICRO-DETAILS ===== */}
      <Section background="cream" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <p className="text-label text-wine/40 mb-3">Vakmanschap</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Gebouwd met oog voor detail
          </h2>
          <p className="text-grey text-base max-w-lg mb-14">
            Tien voorbeelden van micro-details die het verschil maken tussen een website en een &eacute;chte webshop.
          </p>
        </AnimatedSection>

        <AnimatedStagger className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto" staggerDelay={0.07}>
          {[
            { title: "Leeftijdsverificatie", desc: "Bij het eerste bezoek verschijnt een elegante 18+ gate. De keuze wordt onthouden zodat terugkerende bezoekers niet opnieuw hoeven te bevestigen." },
            { title: "Cookie consent", desc: "Niet zomaar een popup: de banner slaat de voorkeur op in zowel localStorage als een HTTP cookie, zodat de keuze ook server-side beschikbaar is." },
            { title: "Announcement bar", desc: "De gouden balk bovenaan (\u201cWELKOM10\u201d) is sluitbaar en onthoudt via een cookie dat de bezoeker hem heeft weggeklikt." },
            { title: "Animatie-respect", desc: "Bezoekers die in hun besturingssysteem \u201cverminder beweging\u201d hebben ingesteld, zien geen scroll-animaties. De site is volledig bruikbaar zonder animaties." },
            { title: "Interactieve Itali\u00eb-kaart", desc: "Een volledig in SVG getekende kaart van alle 20 Italiaanse regio\u2019s, met interactieve highlight en klik op Piemonte, Veneto en Toscane." },
            { title: "Mega menu", desc: "Het dropdown menu op desktop heeft een 100ms hover-vertraging zodat het niet per ongeluk sluit, toetsenbordnavigatie, en aria-labels voor screenreaders." },
            { title: "Skip-to-content", desc: "Een verborgen link die zichtbaar wordt bij Tab-toets, zodat toetsenbordgebruikers direct naar de inhoud kunnen springen." },
            { title: "Grain textuur", desc: "Een subtiele film-grain overlay op donkere secties die diepte en tactiliteit toevoegt aan het design." },
            { title: "Premium dividers", desc: "Handgemaakte scheidingslijnen tussen secties in drie varianten: goud, wijn-kleur en subtiel \u2014 voor visueel ritme." },
            { title: "Scroll indicator", desc: "Een geanimeerde pijl in de hero die bezoekers uitnodigt om te scrollen, verdwijnt zodra ze beginnen." },
          ].map((detail, i) => (
            <StaggerItem key={detail.title}>
              <div className="flex gap-4 bg-white rounded-xl p-6 border border-sand/60 hover:shadow-md transition-shadow duration-200">
                <div className="w-9 h-9 min-w-[36px] bg-wine-gradient rounded-lg flex items-center justify-center text-gold font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-wine font-semibold mb-1">{detail.title}</h3>
                  <p className="text-grey text-sm leading-relaxed">{detail.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </AnimatedStagger>
      </Section>

      {/* ===== NEXT STEPS ===== */}
      <Section background="warm" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <p className="text-label text-wine/40 mb-3">De laatste stappen naar lancering</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Wat er nog nodig is voor go-live
          </h2>
          <p className="text-grey text-base max-w-lg mb-10">
            Hieronder staat alles wat er nog moet gebeuren voordat vinoperlei.nl live kan. Wij pakken het overgrote deel op \u2014 jij hoeft alleen de betalingen te activeren in Shopify.
          </p>
        </AnimatedSection>

        {/* === WIJ REGELEN === */}
        <AnimatedSection variant="fadeUp" delay={0.15}>
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-sand/60 max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-wine-gradient rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-wine font-semibold">
                Dit regelen wij
              </h3>
            </div>
            <p className="text-grey text-sm mb-8">
              Hieronder staat de voortgang van alle {WE_HANDLE.length} punten. Groene items zijn afgerond, blauwe staan gepland, en oranje wachten op informatie van jou.
            </p>

            <div className="space-y-0 divide-y divide-sand/60">
              {WE_HANDLE.map((step, i) => (
                <div key={step.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 min-w-[36px] bg-wine/5 rounded-lg flex items-center justify-center text-wine font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="font-semibold text-wine text-[15px]">
                        {step.title}
                      </p>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        step.status === "Afgerond"
                          ? "bg-green-50 text-green-700"
                          : step.status === "Gepland"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-grey text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* === CARLA'S ENIGE STAP === */}
        <AnimatedSection variant="fadeUp" delay={0.3}>
          <div className="bg-white rounded-2xl p-8 sm:p-10 border-2 border-gold/30 max-w-3xl mx-auto relative overflow-hidden">
            {/* Gold accent stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />

            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gold/15 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-wine font-semibold">
                Jouw enige stap
              </h3>
            </div>
            <p className="text-grey text-sm mb-6">
              Dit is het enige punt waarvoor wij jouw medewerking nodig hebben.
            </p>

            <div className="bg-cream/60 rounded-xl p-6 border border-gold/10">
              <p className="font-semibold text-wine text-base mb-2">
                {CARLA_STEP.title}
              </p>
              <p className="text-grey text-sm leading-relaxed">
                {CARLA_STEP.description}
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" delay={0.4}>
          <p className="text-center text-grey text-sm max-w-2xl mx-auto mt-10 italic">
            Na afronding van deze punten kan vinoperlei.nl live &mdash; wij begeleiden het hele proces.
          </p>
        </AnimatedSection>
      </Section>

      {/* ===== FOOTER ===== */}
      <section className="bg-wine py-20 text-center">
        <p className="text-white/50 text-sm mb-2">Gemaakt met zorg door</p>
        <p className="font-serif text-2xl text-gold italic">Blue Wire Media</p>
      </section>
    </>
  );
}
