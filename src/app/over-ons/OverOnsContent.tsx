"use client";

import Link from "next/link";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { motion } from "framer-motion";
import { Wine as WineGlassIcon, Heart as HeartHandIcon, Leaf as LeafIcon, Truck as TruckIcon, Star as StarIcon, Globe as GlobeIcon } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

// ─── Fallback data (alleen getoond als Shopify page body leeg is) ───

const fallbackValues = [
  {
    Icon: WineGlassIcon,
    title: "Bewust klein, bewust goed",
    description:
      "Geen eindeloze schappen. Elke fles is er omdat Carla hem zelf zou drinken. Valt een wijn tegen na een seizoen? Dan gaat hij eruit.",
  },
  {
    Icon: HeartHandIcon,
    title: "Naam en gezicht",
    description:
      "Bij elke wijn hoort een producent die Carla persoonlijk kent. Geen anonieme groothandel, maar families die je bij naam kunt noemen.",
  },
  {
    Icon: LeafIcon,
    title: "Eerlijke prijzen",
    description:
      "Zonder tussenpersonen importeren betekent: betere wijn voor minder geld. Wat je bij ons betaalt, gaat naar de producent en de kwaliteit in je glas.",
  },
  {
    Icon: TruckIcon,
    title: "Veldhoven – Italië, directe lijn",
    description:
      "Van producent naar ons magazijn in Veldhoven, en dan naar jou. Geen omwegen via importeurs of distributeurs.",
  },
];

const fallbackTimeline = [
  {
    year: "Het Begin",
    title: "Een Barolo die alles veranderde",
    description:
      "Carla dronk haar eerste serieuze Italiaanse wijn bij een klein restaurant in de Langhe. Een Barolo van een producent die drie hectare bezat en alles met de hand deed. Die fles kostte lokaal een fractie van wat je in Nederland betaalt. Dat verschil wilde ze oplossen.",
  },
  {
    year: "De Eerste Stap",
    title: "Zelf importeren, zonder tussenpersonen",
    description:
      "Carla ging terug, proefde zich door tientallen kelders en koos alleen producenten die klein werken en hun eigen druiven verbouwen. Geen handelshuis ertussen, geen marge voor een importeur.",
  },
  {
    year: "Vandaag",
    title: "Rechtstreeks, zonder omwegen",
    description:
      "Vanuit Veldhoven levert Carla nu rechtstreeks aan wijnliefhebbers in heel Nederland. Geen warehouse vol pallets, maar een selectie die ze bewust klein houdt. Als een wijn niet goed genoeg is om zelf te schenken, komt hij niet in het assortiment.",
  },
];

// ─── Component ───

interface OverOnsContentProps {
  pageBody: string | null;
  email: string;
  wineCount: number;
}

export function OverOnsContent({ pageBody, email, wineCount }: OverOnsContentProps) {
  const hasCmsContent = pageBody && pageBody.trim().length > 0;

  return (
    <div className="bg-background">
      {/* Hero Banner — altijd getoond */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,39,0.05),transparent_40%)]" />
        <svg
          className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-[400px] text-white/[0.03] hidden lg:block"
          viewBox="0 0 120 260"
          fill="currentColor"
        >
          <rect x="48" y="0" width="24" height="14" rx="3" />
          <path d="M52 14h16v20l10 16v120c0 12-8 20-18 20H60c-10 0-18-8-18-20V50l10-16V14z" />
        </svg>

        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-label text-gold/60 mb-4"
          >
            Ons Verhaal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-[1.15]"
          >
            Waarom deze
            <br />
            <span className="text-gold">wijnen?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            Carla Daniels importeert Italiaanse wijn rechtstreeks van kleine
            familieproducenten. Geen tussenpersonen, geen eindeloos assortiment.
            Alleen wijnen die ze zelf zou schenken.
          </motion.p>
        </div>
      </section>

      {hasCmsContent ? (
        <>
          {/* ═══ CMS-DRIVEN CONTENT ═══
              Carla beheert deze inhoud vanuit Shopify Admin → Pages → "Over Ons".
              De rich text editor ondersteunt headings, paragraphs, lijsten, afbeeldingen en links. */}
          <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
            <AnimateOnScroll variant="fadeUp">
              <div
                className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2 prose-img:rounded-xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageBody) }}
              />
            </AnimateOnScroll>
          </div>
        </>
      ) : (
        <>
          {/* ═══ FALLBACK CONTENT (als Shopify page nog niet is ingevuld) ═══ */}

          {/* Values Grid */}
          <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.08}>
              {fallbackValues.map((v) => (
                <StaggerItem key={v.title}>
                  <div className="bg-white rounded-lg p-6 shadow-lg border border-sand/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-12 h-12 rounded-lg bg-wine/10 flex items-center justify-center mb-4">
                      <v.Icon className="w-6 h-6 text-wine" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                      {v.title}
                    </h3>
                    <p className="text-sm text-grey leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>

          {/* Story Timeline */}
          <section className="py-16 sm:py-24">
            <div className="max-w-5xl mx-auto px-4">
              <AnimateOnScroll variant="fadeUp">
                <div className="text-center mb-12 sm:mb-16">
                  <p className="text-label text-gold/60 mb-3">
                    Hoe het begon
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-charcoal leading-[1.2]">
                    Drie momenten die ertoe deden
                  </h2>
                </div>
              </AnimateOnScroll>

              <div className="relative">
                <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-sand hidden sm:block" />
                <div className="space-y-12 sm:space-y-16">
                  {fallbackTimeline.map((item, index) => (
                    <AnimateOnScroll
                      key={item.year}
                      variant={index % 2 === 0 ? "fadeLeft" : "fadeRight"}
                      delay={index * 0.15}
                    >
                      <div className={`sm:flex sm:items-start sm:gap-8 ${index % 2 === 0 ? "" : "sm:flex-row-reverse"}`}>
                        <div className={`sm:w-[calc(50%-2rem)] ${index % 2 === 0 ? "sm:text-right" : ""}`}>
                          <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-sand/50 hover:shadow-md transition-shadow ${index % 2 === 0 ? "sm:mr-4" : "sm:ml-4"}`}>
                            <span className="inline-block text-label text-wine bg-wine/5 px-3 py-1 rounded-full mb-3">
                              {item.year}
                            </span>
                            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-3">
                              {item.title}
                            </h3>
                            <p className="text-grey leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center justify-center flex-shrink-0">
                          <div className="w-4 h-4 rounded-full bg-wine border-4 border-background" />
                        </div>
                        <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Brand Philosophy */}
          <section className="bg-cream">
            <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
              <AnimateOnScroll variant="fadeUp">
                <div className="text-center mb-12">
                  <p className="text-label text-gold/60 mb-3">
                    Zo werken wij
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-charcoal leading-[1.2]">
                    Onze principes
                  </h2>
                </div>
              </AnimateOnScroll>

              <StaggerChildren className="grid sm:grid-cols-3 gap-6 sm:gap-8" staggerDelay={0.12}>
                {[
                  {
                    Icon: StarIcon,
                    title: "Klein houden",
                    text: "We groeien niet om te groeien. Een compacte selectie is genoeg als elke fles goed is. Groter worden betekent concessies doen, en dat doen we niet.",
                  },
                  {
                    Icon: GlobeIcon,
                    title: "Volledige herkomst",
                    text: "Bij elke wijn staat wie hem maakt, welk perceel, welk jaar. Geen vaag etiket, geen marketingverhaal. Gewoon de feiten.",
                  },
                  {
                    Icon: HeartHandIcon,
                    title: "Advies van Carla zelf",
                    text: "Mail of bel, en je hebt Carla aan de lijn. Geen callcenter, geen chatbot. Vertel wat je zoekt en ze wijst je de goede kant op.",
                  },
                ].map((item) => (
                  <StaggerItem key={item.title}>
                    <div className="text-center p-6 sm:p-8">
                      <div className="w-14 h-14 rounded-full bg-wine/10 flex items-center justify-center mx-auto mb-5">
                        <item.Icon className="w-7 h-7 text-wine" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-charcoal mb-3">
                        {item.title}
                      </h3>
                      <p className="text-grey leading-relaxed text-sm">
                        {item.text}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </section>

          {/* Numbers */}
          <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
            <AnimateOnScroll variant="scaleIn">
              <div className="bg-warm-white rounded-2xl p-8 sm:p-12 border border-sand">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-4 text-center">
                  Onze Belofte
                </h2>
                <p className="text-grey leading-relaxed mb-8 text-center max-w-2xl mx-auto">
                  Elke fles die je bij ons bestelt wordt zorgvuldig verpakt en
                  snel verzonden. Ben je niet tevreden? Dan krijg je zonder
                  gedoe je geld terug.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { number: "100%", label: "Proefgarantie" },
                    { number: `${wineCount || "?"}`, label: "Wijnen in de collectie" },
                  ].map((stat, i) => (
                    <AnimateOnScroll key={stat.label} variant="fadeUp" delay={i * 0.1}>
                      <div className="text-center p-4">
                        <p className="font-serif text-4xl sm:text-5xl font-bold text-wine mb-2 tabular-nums">
                          {stat.number}
                        </p>
                        <p className="text-sm text-grey font-medium">{stat.label}</p>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </>
      )}

      {/* Contact CTA — altijd getoond */}
      <div className="max-w-4xl mx-auto px-4 pb-16 sm:pb-24">
        <AnimateOnScroll variant="fadeUp" delay={0.1}>
          <div className="relative bg-gradient-to-br from-wine to-wine-dark rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[80px]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-[60px]" />
            <div className="relative">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3">
                Wijnadvies nodig?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Niet zeker welke wijn bij jouw gelegenheid past? Carla denkt
                graag mee. Stuur een mail of bel even.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-8 bg-white text-wine text-button uppercase rounded hover:bg-white/90 transition-colors"
                >
                  Vraag advies aan Carla
                </Link>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center h-12 px-8 border-2 border-white/30 text-white text-button uppercase rounded hover:bg-white/10 transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-sand">
          <Link
            href="/"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar de homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
