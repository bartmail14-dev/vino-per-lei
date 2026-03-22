"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { GiftBoxIcon, WineGlassesIcon } from "@/components/icons";
import { Heart, Award, Check, Wine, PenLine, Truck, Sparkles, ShieldCheck, Package, Star, Clock } from "lucide-react";

// ─── Data ────────────────────────────────────────────

const giftIdeas = [
  {
    icon: "bottle" as const,
    title: "Enkele Fles",
    description: "Eén fles die indruk maakt. Carla helpt je kiezen op basis van smaak en gelegenheid.",
    price: "Vanaf €12",
    features: ["Geschenkdoos inbegrepen", "Optioneel kaartje"],
    popular: false,
    contactSubject: "Cadeau: Enkele Fles",
  },
  {
    icon: "duo" as const,
    title: "Duo Pakket",
    description: "Een rode en een witte uit dezelfde streek, of juist twee totaal verschillende karakters. Jij kiest het thema.",
    price: "Vanaf €25",
    features: ["Twee wijnen", "Stevige geschenkverpakking", "Persoonlijk bericht"],
    popular: true,
    contactSubject: "Cadeau: Duo Pakket",
  },
  {
    icon: "box" as const,
    title: "Proeverij Box",
    description: "Drie of zes flessen uit Piemonte, Veneto en Toscane. Voor wie een avond lang wil vergelijken en leren.",
    price: "Vanaf €40",
    features: ["3 of 6 wijnen", "Proefnotities per wijn", "Geschenkverpakking"],
    popular: false,
    contactSubject: "Cadeau: Proeverij Box",
  },
];

const occasions = [
  { icon: Heart, label: "Verjaardag" },
  { icon: Award, label: "Jubileum" },
  { icon: Sparkles, label: "Feestdagen" },
  { icon: Wine, label: "Housewarming" },
  { icon: Star, label: "Bedankje" },
];

const steps = [
  {
    step: "01",
    title: "Kies je wijn",
    description: "Selecteer een fles, duo of proeverij box. We helpen je graag met advies.",
    icon: Wine,
  },
  {
    step: "02",
    title: "Personaliseer",
    description: "Voeg een persoonlijk bericht toe. Wij verzorgen de luxe verpakking.",
    icon: PenLine,
  },
  {
    step: "03",
    title: "Laat bezorgen",
    description: "Kies een bezorgdatum. Wij leveren het cadeau waar en wanneer jij wilt.",
    icon: Truck,
  },
];

const trustPoints = [
  {
    icon: Wine,
    title: "Familiewijngaarden",
    description: "Rechtstreeks van kleine, Italiaanse wijnmakers",
  },
  {
    icon: Package,
    title: "Luxe geschenkverpakking",
    description: "Inclusief bij elk cadeau, zonder extra kosten",
  },
  {
    icon: ShieldCheck,
    title: "Persoonlijk advies",
    description: "Carla helpt je de perfecte wijn te kiezen",
  },
  {
    icon: Truck,
    title: "Gratis verzending",
    description: "Vanaf €35 bezorgen wij gratis in heel Nederland",
  },
];

// ─── Gold sparkle particles for hero ─────────────────

function GoldParticles() {
  // Static particle positions to avoid hydration mismatch
  const particles = [
    { id: 0, x: 12, y: 8, size: 2.1, delay: 0, duration: 4.5 },
    { id: 1, x: 85, y: 15, size: 1.4, delay: 1.2, duration: 5.1 },
    { id: 2, x: 45, y: 22, size: 2.8, delay: 2.5, duration: 3.8 },
    { id: 3, x: 72, y: 55, size: 1.8, delay: 0.8, duration: 4.2 },
    { id: 4, x: 28, y: 68, size: 2.4, delay: 3.1, duration: 5.5 },
    { id: 5, x: 90, y: 42, size: 1.2, delay: 1.8, duration: 3.5 },
    { id: 6, x: 55, y: 78, size: 3.0, delay: 0.5, duration: 4.8 },
    { id: 7, x: 18, y: 38, size: 1.6, delay: 2.2, duration: 5.8 },
    { id: 8, x: 65, y: 88, size: 2.2, delay: 3.5, duration: 3.2 },
    { id: 9, x: 38, y: 45, size: 1.3, delay: 1.5, duration: 4.0 },
    { id: 10, x: 78, y: 72, size: 2.6, delay: 0.3, duration: 5.3 },
    { id: 11, x: 8, y: 55, size: 1.9, delay: 2.8, duration: 3.6 },
    { id: 12, x: 52, y: 12, size: 1.5, delay: 3.8, duration: 4.4 },
    { id: 13, x: 35, y: 92, size: 2.0, delay: 1.0, duration: 5.0 },
    { id: 14, x: 82, y: 30, size: 1.7, delay: 2.0, duration: 3.9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Decorative wine bottle SVG for hero background ──

function WineBottleBg() {
  return (
    <svg
      className="absolute right-[5%] top-1/2 -translate-y-1/2 h-[70%] w-auto opacity-[0.04] text-gold pointer-events-none"
      viewBox="0 0 80 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="30" y="0" width="20" height="30" rx="2" />
      <path d="M30 30 L25 60 L25 200 C25 220 55 220 55 200 L55 60 L50 30" />
      <path d="M25 100 H55" />
      <rect x="28" y="110" width="24" height="40" rx="2" />
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────

interface CadeausContentProps {
  children?: React.ReactNode; // product cards slot
}

export function CadeausContent({ children }: CadeausContentProps) {
  return (
    <div className="bg-background">
      {/* Hero — Immersive */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        {/* Radial gold accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(201,162,39,0.06),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(201,162,39,0.08),transparent_50%)]" />

        <GoldParticles />
        <WineBottleBg />

        <div className="relative max-w-5xl mx-auto px-4 py-28 sm:py-36 lg:py-40 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border border-gold/25 mb-8"
          >
            <GiftBoxIcon className="w-10 h-10 text-gold" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white mb-6 leading-[1.1]"
          >
            Geef Wijn met een{" "}
            <span className="text-gold italic">Verhaal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Geen willekeurige fles uit het schap, maar een wijn met karakter.
            Inclusief luxe geschenkverpakking en een persoonlijk kaartje.
          </motion.p>

          {/* Occasion tags — larger, more prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {occasions.map((o, i) => (
              <motion.span
                key={o.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                className="inline-flex items-center gap-2.5 text-sm font-medium text-white/80 bg-white/[0.08] backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/15 hover:bg-white/[0.14] hover:border-gold/30 hover:text-gold transition-all duration-300 cursor-default"
              >
                <o.icon className="w-4 h-4" strokeWidth={1.5} />
                {o.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gift Ideas — Premium Cards */}
      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        <StaggerChildren className="grid sm:grid-cols-3 gap-5 sm:gap-6" staggerDelay={0.1}>
          {giftIdeas.map((idea) => (
            <StaggerItem key={idea.title}>
              <div className="group relative bg-white rounded-2xl shadow-lg border border-sand/50 text-center hover:shadow-2xl hover:-translate-y-2 hover:border-gold/30 transition-all duration-500 h-full flex flex-col overflow-hidden">
                {/* Popular badge */}
                {idea.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-gold px-3 py-1 rounded-full shadow-md">
                      <Star className="w-3 h-3" fill="currentColor" strokeWidth={0} />
                      Populair
                    </span>
                  </div>
                )}

                {/* Visual illustration area */}
                <div className="relative bg-gradient-to-br from-wine/[0.04] to-gold/[0.04] px-6 pt-8 pb-6 group-hover:from-wine/[0.07] group-hover:to-gold/[0.07] transition-colors duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-wine/10 group-hover:bg-wine/15 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110">
                    {idea.icon === "duo" ? (
                      <WineGlassesIcon className="w-8 h-8 text-wine" />
                    ) : idea.icon === "box" ? (
                      <GiftBoxIcon className="w-9 h-9 text-wine" />
                    ) : (
                      <Wine className="w-8 h-8 text-wine" strokeWidth={1.5} />
                    )}
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-6 pb-6">
                  {/* Price — prominent */}
                  <div className="mb-3">
                    <span className="font-serif text-2xl font-bold text-wine">{idea.price}</span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-grey leading-relaxed mb-5 flex-1">
                    {idea.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {idea.features.map((f) => (
                      <li key={f} className="flex items-center justify-center gap-2 text-xs text-grey">
                        <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={`/contact?onderwerp=${encodeURIComponent(idea.contactSubject)}`}
                    className="inline-flex items-center justify-center h-11 px-6 bg-wine text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-wine-dark transition-colors duration-300 group-hover:shadow-md"
                  >
                    Stel samen
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Zo Werkt Het — Horizontal Timeline */}
      <section className="bg-warm-white py-16 sm:py-24 mt-16 sm:mt-24">
        <div className="max-w-4xl mx-auto px-4">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center mb-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-3">
                Zo Werkt Het
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-charcoal">
                In 3 stappen een perfect cadeau
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerChildren className="relative grid sm:grid-cols-3 gap-8 sm:gap-6" staggerDelay={0.15}>
            {/* Connecting line (desktop only) */}
            <div className="hidden sm:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-sand via-gold/30 to-sand" />

            {steps.map((item) => (
              <StaggerItem key={item.step}>
                <div className="relative text-center">
                  {/* Icon circle */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-white border-2 border-sand flex items-center justify-center mx-auto mb-5 shadow-sm">
                    <item.icon className="w-8 h-8 text-wine" strokeWidth={1.5} />
                  </div>

                  {/* Step number */}
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                    Stap {item.step}
                  </span>

                  <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-grey leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Trust Section — Waarom Vino per Lei */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <AnimateOnScroll variant="fadeUp">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-3">
                Waarom Vino per Lei
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                Meer dan zomaar een fles wijn
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {trustPoints.map((point) => (
              <StaggerItem key={point.title}>
                <div className="text-center p-6 rounded-xl bg-cream/60 border border-sand/40 hover:border-gold/20 hover:bg-cream transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-wine/8 flex items-center justify-center mx-auto mb-4">
                    <point.icon className="w-5 h-5 text-wine" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-charcoal mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-xs text-grey leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Product cards slot */}
      {children}

      {/* Contact CTA */}
      <section className="bg-cream">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <AnimateOnScroll variant="scaleIn">
            <div className="relative bg-gradient-to-br from-wine to-wine-dark rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.03] rounded-tr-[60px]" />
              <div className="absolute top-1/2 left-[10%] w-1.5 h-1.5 rounded-full bg-gold/20" />
              <div className="absolute top-[30%] right-[15%] w-1 h-1 rounded-full bg-gold/15" />

              <div className="relative">
                {/* Animated gift icon */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-5"
                >
                  <GiftBoxIcon className="w-14 h-14 text-gold/50" />
                </motion.div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
                  Twijfel je? Carla denkt mee
                </h2>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                  Vertel voor wie het is en wat de gelegenheid is. Carla stelt
                  een pakket samen dat past bij de persoon en het moment.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-12 px-8 bg-white text-wine text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Vraag advies aan Carla
                  </Link>
                  <Link
                    href="/wijnen"
                    className="inline-flex items-center justify-center h-12 px-8 border-2 border-white/30 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Alle wijnen bekijken
                  </Link>
                </div>

                {/* Trust signal */}
                <div className="inline-flex items-center gap-2 text-white/40 text-xs">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Reactietijd: binnen 24 uur
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
