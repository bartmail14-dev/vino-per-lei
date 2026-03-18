"use client";

import Link from "next/link";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { motion } from "framer-motion";
import { Wine as WineGlassIcon, Heart as HeartHandIcon, Leaf as LeafIcon, Truck as TruckIcon, Star as StarIcon, Globe as GlobeIcon } from "lucide-react";

const values = [
  {
    Icon: WineGlassIcon,
    title: "Handgeselecteerd",
    description:
      "Elke wijn in onze collectie is persoonlijk geproefd en geselecteerd. We werken alleen met familiewijngaarden die generaties lang dezelfde passie delen.",
  },
  {
    Icon: HeartHandIcon,
    title: "Met Liefde",
    description:
      "Vino per Lei betekent 'Wijn voor Haar'. We geloven dat elke fles een verhaal vertelt — van de wijngaard tot jouw tafel.",
  },
  {
    Icon: LeafIcon,
    title: "Duurzaam & Eerlijk",
    description:
      "Onze producenten werken met respect voor het land. Veel van onze wijnen zijn biologisch of biodynamisch geproduceerd.",
  },
  {
    Icon: TruckIcon,
    title: "Direct uit Italië",
    description:
      "Geen tussenpersonen. Wij importeren rechtstreeks van de wijngaard naar jouw deur, zodat je de beste prijs-kwaliteitverhouding krijgt.",
  },
];

const timeline = [
  {
    year: "Het Begin",
    title: "Een passie geboren in Italië",
    description:
      "Tijdens een reis door Toscane ontdekten we de magie van kleine familiewijngaarden. Wijnen met karakter, gemaakt door mensen die hun land kennen als geen ander.",
  },
  {
    year: "De Missie",
    title: "Italië naar Nederland brengen",
    description:
      "We begonnen contacten te leggen met producenten in Piemonte, Puglia, Sicilië en Veneto. Geen grote handelshuizen, maar families met generaties ervaring.",
  },
  {
    year: "Vandaag",
    title: "Jouw persoonlijke wijnimporteur",
    description:
      "Met een zorgvuldig samengestelde collectie brengen wij het beste van Italië bij jou thuis. Elke fles vertelt een verhaal, elke slok neemt je mee.",
  },
];

interface OverOnsContentProps {
  pageBody: string | null;
  email: string;
}

export function OverOnsContent({ pageBody, email }: OverOnsContentProps) {
  return (
    <div className="bg-background">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        {/* Decorative elements */}
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
            Passie voor
            <br />
            <span className="text-gold">Italiaanse Wijn</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            Achter elke fles schuilt een verhaal van generaties, terroir en
            vakmanschap. Wij brengen de mooiste Italiaanse wijnen naar jouw
            tafel — met zorg geselecteerd, met liefde geleverd.
          </motion.p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.08}>
          {values.map((v) => (
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
                Onze Reis
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-charcoal leading-[1.2]">
                Van Wijngaard tot Jouw Tafel
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-sand hidden sm:block" />

            <div className="space-y-12 sm:space-y-16">
              {timeline.map((item, index) => (
                <AnimateOnScroll
                  key={item.year}
                  variant={index % 2 === 0 ? "fadeLeft" : "fadeRight"}
                  delay={index * 0.15}
                >
                  <div className={`sm:flex sm:items-start sm:gap-8 ${index % 2 === 0 ? "" : "sm:flex-row-reverse"}`}>
                    {/* Content */}
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

                    {/* Dot (desktop) */}
                    <div className="hidden sm:flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-wine border-4 border-background" />
                    </div>

                    {/* Spacer */}
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
                Onze Filosofie
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-charcoal leading-[1.2]">
                Waar wij in geloven
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerChildren className="grid sm:grid-cols-3 gap-6 sm:gap-8" staggerDelay={0.12}>
            {[
              {
                Icon: StarIcon,
                title: "Kwaliteit boven Kwantiteit",
                text: "Liever twintig uitzonderlijke wijnen dan honderd middelmatige. Elke fles in onze collectie is er op eigen verdienste.",
              },
              {
                Icon: GlobeIcon,
                title: "Transparantie",
                text: "We vertellen je precies waar elke wijn vandaan komt, wie hem maakt en waarom wij er zo enthousiast over zijn.",
              },
              {
                Icon: HeartHandIcon,
                title: "Persoonlijke Service",
                text: "Wijn kiezen kan overweldigend zijn. Wij helpen je graag met persoonlijk advies — of je nu beginner bent of kenner.",
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

      {/* CMS Content or Numbers */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {pageBody ? (
          <div
            className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2"
            dangerouslySetInnerHTML={{ __html: pageBody }}
          />
        ) : (
          <AnimateOnScroll variant="scaleIn">
            <div className="bg-warm-white rounded-2xl p-8 sm:p-12 border border-sand">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-4 text-center">
                Onze Belofte
              </h2>
              <p className="text-grey leading-relaxed mb-8 text-center max-w-2xl mx-auto">
                Elke fles die je bij ons bestelt wordt zorgvuldig verpakt en
                snel verzonden. Ben je niet tevreden? Dan krijg je zonder
                gedoe je geld terug. Dat is onze 100% proefgarantie.
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { number: "100%", label: "Proefgarantie" },
                  { number: "19+", label: "Authentieke Wijnen" },
                  { number: "6", label: "Italiaanse Regio\u2019s" },
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
        )}

        {/* Contact CTA */}
        <AnimateOnScroll variant="fadeUp" delay={0.1}>
          <div className="mt-16 relative bg-gradient-to-br from-wine to-wine-dark rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[80px]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-[60px]" />
            <div className="relative">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3">
                Vragen? Neem contact op
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                We helpen je graag met wijnadvies, bestellingen of andere
                vragen. Je kunt ons bereiken via e-mail of telefoon.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-8 bg-white text-wine text-button uppercase rounded hover:bg-white/90 transition-colors"
                >
                  Contact Opnemen
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
