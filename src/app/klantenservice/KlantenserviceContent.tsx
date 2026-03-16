"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { Search as SearchIcon, HelpCircle, Truck, RotateCcw, Mail, ChevronRight, CircleHelp } from "lucide-react";

const serviceLinks = [
  {
    title: "Veelgestelde Vragen",
    description: "Vind snel antwoord op de meest gestelde vragen over bestellen, betalen, verzenden en meer.",
    href: "/klantenservice/faq",
    color: "bg-purple-500/10 text-purple-600",
    icon: <HelpCircle className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "Verzending & Levering",
    description: "Alles over verzendkosten, levertijden, verpakking en verzendgebieden.",
    href: "/klantenservice/verzending",
    color: "bg-blue-500/10 text-blue-600",
    icon: <Truck className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "Retourneren",
    description: "Informatie over ons retourbeleid, 14 dagen bedenktijd en hoe je een retour aanmeldt.",
    href: "/klantenservice/retourneren",
    color: "bg-amber-500/10 text-amber-600",
    icon: <RotateCcw className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "Contact",
    description: "Stuur ons een bericht, bel ons of vind onze contactgegevens en openingstijden.",
    href: "/contact",
    color: "bg-emerald-500/10 text-emerald-600",
    icon: <Mail className="w-6 h-6" strokeWidth={1.5} />,
  },
];

const popularQuestions = [
  { q: "Hoe lang duurt de levering?", href: "/klantenservice/faq" },
  { q: "Kan ik mijn bestelling retourneren?", href: "/klantenservice/retourneren" },
  { q: "Wat zijn de verzendkosten?", href: "/klantenservice/verzending" },
  { q: "Hoe kan ik betalen?", href: "/klantenservice/faq" },
];

export function KlantenserviceContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = searchQuery.trim()
    ? serviceLinks.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : serviceLinks;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.06),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-label text-gold/60 mb-4"
          >
            Klantenservice
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-[1.15]"
          >
            Hoe kunnen wij je helpen?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 max-w-lg mx-auto mb-8"
          >
            Bij Vino per Lei staan wij voor je klaar. Vind hieronder snel de
            informatie die je nodig hebt.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto relative"
          >
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Zoek in klantenservice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-gold/50 focus:outline-none transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Service Links Grid */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <StaggerChildren className="grid gap-4 sm:grid-cols-2" staggerDelay={0.08}>
          {filteredLinks.map((item) => (
            <StaggerItem key={item.href}>
              <Link
                href={item.href}
                className="group bg-white rounded-xl p-6 border border-sand/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 block h-full"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-lg font-semibold text-charcoal mb-1 group-hover:text-wine transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-grey text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-grey/30 group-hover:text-wine group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" strokeWidth={1.5} />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Popular Questions */}
        <AnimateOnScroll variant="fadeUp">
          <div className="mb-16">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-6">
              Populaire vragen
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {popularQuestions.map((item) => (
                <Link
                  key={item.q}
                  href={item.href}
                  className="group flex items-center gap-3 bg-warm-white rounded-lg p-4 border border-sand/50 hover:border-wine/20 hover:shadow-sm transition-all"
                >
                  <CircleHelp className="w-5 h-5 text-wine/40 flex-shrink-0 group-hover:text-wine transition-colors" strokeWidth={1.5} />
                  <span className="text-sm text-charcoal group-hover:text-wine transition-colors">
                    {item.q}
                  </span>
                  <ChevronRight className="w-4 h-4 text-grey/30 ml-auto flex-shrink-0 group-hover:text-wine group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Quick Contact */}
        <AnimateOnScroll variant="scaleIn">
          <div className="relative bg-gradient-to-br from-wine to-wine-dark rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-bl-[70px]" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/3 rounded-tr-[50px]" />
            <div className="relative">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3">
                Direct contact
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Liever persoonlijk contact? Wij staan voor je klaar.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:info@vinoperlei.nl"
                  className="inline-flex items-center justify-center h-12 px-8 bg-white text-wine text-button uppercase rounded hover:bg-white/90 transition-colors"
                >
                  E-mail Ons
                </a>
                <div className="text-sm text-white/60">
                  <span className="font-semibold text-white">Ma-Vr</span>{" "}
                  09:00 - 17:00
                </div>
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
