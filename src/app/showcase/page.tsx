import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { getProducts } from "@/lib/shopify";
import { AnimatedSection, AnimatedStagger, StaggerItem } from "@/components/home/HomeAnimations";
import { ShieldIcon, StarIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Voortgang Update — Vino per Lei",
  description: "Een overzicht van alle verbeteringen aan de Vino per Lei webshop.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

// SVG icons for the feature grid
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function NewspaperIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

const TIMELINE = [
  {
    step: 1,
    title: "Webshop fundamenten gerepareerd",
    description: "De checkout werkte niet — klanten konden niets kopen. Dit is volledig opnieuw opgezet met een directe koppeling naar Shopify. Nep-reviews en een fake keurmerk zijn verwijderd.",
    tags: ["Checkout", "Shopify"],
  },
  {
    step: 2,
    title: "Filters en zoeken werken nu echt",
    description: "Bezoekers kunnen filteren op regio (Piemonte, Veneto, Toscane), wijntype, druivenras en prijs. Sorteren en zoeken werkt ook.",
    tags: ["Filters", "Zoeken", "Sorteren"],
  },
  {
    step: 3,
    title: "Wijndata op orde gebracht",
    description: "Nep-proefnotities verwijderd. Serveertemperaturen zijn nu specifiek per wijn. Food pairings per product aangepast. \"Bevat sulfieten\" toegevoegd (EU-verplichting).",
    tags: ["Proefnotities", "Temperaturen", "EU Compliance"],
  },
  {
    step: 4,
    title: "Teksten volledig herschreven",
    description: "AI-clich\u00e9s zijn vervangen door warme, echte copy die bij jou past. CTA-knoppen zijn specifiek: \"Vraag advies aan Carla\" in plaats van \"Neem contact op\".",
    tags: ["Homepage", "Over Ons", "Cadeaus", "CTA's"],
  },
  {
    step: 5,
    title: "Nieuw kleurenschema",
    description: "Het design is omgezet naar een stijlvol navy-blauw gradient. Doorgevoerd op de navigatie, knoppen, nieuwsbrief, blog en kaart.",
    tags: ["Navy Gradient", "Hele site"],
  },
  {
    step: 6,
    title: "Beveiliging, SEO en toegankelijkheid",
    description: "Beveiligd tegen spam en aanvallen. Google vindt nu alle pagina's \u00e9n blogartikelen. KvK- en BTW-nummer in de footer. Toetsenbord- en screenreader-ondersteuning.",
    tags: ["Beveiliging", "SEO", "WCAG AA"],
  },
] as const;

const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Beveiliging",
    description: "XSS-bescherming, spam-filters, beveiligingsheaders en rate limiting. Jouw klanten en hun data zijn veilig.",
  },
  {
    icon: SearchIcon,
    title: "Vindbaarheid",
    description: "Sitemap met alle producten \u00e9n blogs, structured data voor Google, en OG-afbeeldingen voor social media.",
  },
  {
    icon: BoltIcon,
    title: "Snelheid",
    description: "Caching op alle productdata, geoptimaliseerde afbeeldingen en slimme laadstrategie\u00ebn. De site laadt snel, ook op mobiel.",
  },
  {
    icon: CheckCircleIcon,
    title: "Compliance",
    description: "KvK & BTW zichtbaar, allergeninformatie bij producten, cookie consent en privacy-vriendelijke opzet.",
  },
  {
    icon: EyeIcon,
    title: "Toegankelijkheid",
    description: "WCAG AA-niveau. Toetsenbordnavigatie, screenreader-ondersteuning en voldoende contrast voor iedereen.",
  },
  {
    icon: NewspaperIcon,
    title: "Blog verbeterd",
    description: "Afbeeldingen uit Shopify werken, deelknoppen op mobiel, en een inhoudsopgave bij langere artikelen.",
  },
] as const;

const NEXT_STEPS = [
  {
    title: "Shopify token vernieuwen",
    description: "Het oude token is zichtbaar geweest. Een nieuw token aanmaken kost 2 minuten in Shopify Admin.",
  },
  {
    title: "Betalingen activeren",
    description: "iDEAL, creditcard en Bancontact aanzetten in Shopify. Zodra dit aan staat, kunnen klanten afrekenen.",
  },
  {
    title: "Mailgun instellen",
    description: "Voor werkende e-mails vanuit het contactformulier en de nieuwsbrief. Ik help je met de setup.",
  },
  {
    title: "Domein koppelen",
    description: "vinoperlei.nl koppelen aan de site. E\u00e9n DNS-instelling bij je domeinprovider.",
  },
  {
    title: "Telefoonnummer & blogfoto's",
    description: "Je echte telefoonnummer invoeren en hero-afbeeldingen uploaden bij je blogartikelen.",
  },
] as const;

export default async function ShowcasePage() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const totalProducts = allProducts.length;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] bg-wine-gradient flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Shimmer background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)] animate-pulse-slow" />

        <AnimatedSection variant="fadeUp">
          <p className="text-label text-gold mb-6 tracking-[4px]">
            Voortgang Update
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-normal leading-[1.1] mb-6">
            Vino per Lei
            <br />
            <span className="text-gold italic">wordt volwassen</span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-lg mx-auto leading-relaxed mb-10">
            Een overzicht van alle verbeteringen aan jouw webshop. Van een prototype naar een professionele, veilige en gebruiksvriendelijke winkel.
          </p>
        </AnimatedSection>

        {/* Scroll hint */}
        <div className="absolute bottom-20 animate-bounce">
          <ChevronDownIcon className="w-6 h-6 text-white/40" />
        </div>
        <p className="absolute bottom-10 text-white/30 text-xs tracking-[2px]">
          Maart 2026 &middot; Blue Wire Media
        </p>
      </section>

      {/* ===== STATS BAR ===== */}
      <Section background="dark" spacing="md">
        <AnimatedSection variant="fadeUp">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Verbeteringen doorgevoerd" },
              { number: "0", label: "Build errors" },
              { number: "6", label: "Optimalisatierondes" },
              { number: "AA", label: "Toegankelijkheid (WCAG)" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl sm:text-5xl font-bold text-gold leading-none mb-2">
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
              {totalProducts} wijnen, echte data
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
              Bekijk alle {totalProducts} wijnen
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
            In zes rondes is de webshop van prototype naar productie-klaar gebracht.
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

        <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.1}>
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

      {/* ===== NEXT STEPS ===== */}
      <Section background="warm" spacing="xl">
        <AnimatedSection variant="fadeUp">
          <p className="text-label text-wine/40 mb-3">Bijna live</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Wat er nog nodig is
          </h2>
          <p className="text-grey text-base max-w-lg mb-10">
            Een paar stappen en dan kan de site live. De meeste hiervan zijn instellingen die jij moet doen in Shopify.
          </p>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp" delay={0.15}>
          <div className="bg-white rounded-2xl p-8 sm:p-10 border-2 border-gold/20 max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl text-wine mb-2 font-semibold">
              Jouw actiepunten
            </h3>
            <p className="text-grey text-sm mb-8">
              Ik help je hier graag bij — we kunnen het samen doorlopen.
            </p>

            <div className="space-y-0 divide-y divide-sand/60">
              {NEXT_STEPS.map((step, i) => (
                <div key={step.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 min-w-[36px] bg-gold/10 rounded-lg flex items-center justify-center text-gold font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-wine text-[15px] mb-1">
                      {step.title}
                    </p>
                    <p className="text-grey text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
