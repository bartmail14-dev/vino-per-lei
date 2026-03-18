"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Mail as MailIcon, Package as PackageIcon, RotateCcw as RefreshIcon, CreditCard as CreditCardIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, ShieldCheck, Check, X } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

const returnSteps = [
  {
    number: "01",
    Icon: MailIcon,
    title: "Meld je retour aan",
    description: "Stuur een e-mail naar info@vinoperlei.nl met je bestelnummer en de reden van retour. Wij bevestigen binnen 1 werkdag.",
  },
  {
    number: "02",
    Icon: PackageIcon,
    title: "Verpak je bestelling",
    description: "Verpak de ongeopende fles(sen) zorgvuldig in de originele verpakking. Gebruik voldoende beschermingsmateriaal.",
  },
  {
    number: "03",
    Icon: RefreshIcon,
    title: "Verstuur het pakket",
    description: "Stuur het pakket retour met het verstrekte retourlabel. Bewaar je verzendbewijs goed.",
  },
  {
    number: "04",
    Icon: CreditCardIcon,
    title: "Ontvang je terugbetaling",
    description: "Na ontvangst en controle betalen wij het aankoopbedrag binnen 5 werkdagen terug op je rekening.",
  },
];

const conditions = {
  allowed: [
    "Ongeopende flessen in originele staat",
    "Retour aangemeld binnen 14 dagen",
    "Producten in originele verpakking",
    "Onbeschadigde flessen en etiketten",
  ],
  notAllowed: [
    "Geopende of aangebroken flessen",
    "Producten zonder originele verpakking",
    "Retourzendingen na 14 dagen",
    "Speciaal bestelde of gegraveerde artikelen",
  ],
};

interface RetournerenContentProps {
  pageBody: string | null;
  pageTitle: string | null;
}

export function RetournerenContent({ pageBody, pageTitle }: RetournerenContentProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-wine via-wine-dark to-[#0a0d1a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28">
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
            {pageTitle ?? "Retourbeleid"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 max-w-lg"
          >
            Niet tevreden? Wij helpen je graag met een retour. 14 dagen bedenktijd op ongeopende producten.
          </motion.p>
        </div>
      </section>

      {/* Guarantee banner */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 mb-12">
        <AnimateOnScroll variant="scaleIn">
          <div className="bg-white rounded-lg shadow-lg border border-sand/50 p-5 sm:p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-wine" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm">100% Proefgarantie</p>
              <p className="text-xs text-grey mt-0.5">
                Niet tevreden over een wijn? Wij lossen het altijd op — zonder gedoe.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* CMS Content */}
        {pageBody && (
          <AnimateOnScroll variant="fadeUp">
            <div
              className="prose prose-lg max-w-none text-grey prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-xl prose-h3:mb-3 prose-a:text-wine prose-a:underline hover:prose-a:text-wine-dark prose-strong:text-charcoal prose-li:text-grey prose-ul:space-y-1 prose-ol:space-y-2 mb-16"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(pageBody) }}
            />
          </AnimateOnScroll>
        )}

        {/* Return Steps */}
        <div className="mb-16">
          <AnimateOnScroll variant="fadeUp">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-8">
              Retour in 4 stappen
            </h2>
          </AnimateOnScroll>

          <div className="space-y-4">
            {returnSteps.map((step, index) => (
              <AnimateOnScroll key={step.number} variant="fadeUp" delay={index * 0.1}>
                <div className="bg-white rounded-lg border border-sand/50 p-5 sm:p-6 flex items-start gap-4 sm:gap-5 hover:shadow-md transition-shadow">
                  {/* Number circle */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-wine flex items-center justify-center">
                    <step.Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-wine/50 tracking-wider">
                        STAP {step.number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-charcoal mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-grey leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <AnimateOnScroll variant="fadeUp">
          <div className="mb-16">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-6">
              Voorwaarden
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Allowed */}
              <div className="bg-white rounded-lg border border-sand/50 p-6">
                <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  Retour mogelijk
                </h3>
                <ul className="space-y-3">
                  {conditions.allowed.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-grey">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Allowed */}
              <div className="bg-white rounded-lg border border-sand/50 p-6">
                <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                  Niet retourneerbaar
                </h3>
                <ul className="space-y-3">
                  {conditions.notAllowed.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-grey">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* CTA */}
        <AnimateOnScroll variant="scaleIn">
          <div className="mb-16 relative bg-gradient-to-br from-wine to-wine-dark rounded-2xl p-8 sm:p-10 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[60px]" />
            <div className="relative">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white mb-3">
                Retour aanmelden?
              </h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">
                Stuur een e-mail met je bestelnummer en we helpen je direct.
              </p>
              <a
                href="mailto:info@vinoperlei.nl?subject=Retour aanmelding"
                className="inline-flex items-center justify-center h-12 px-8 bg-white text-wine text-button uppercase rounded hover:bg-white/90 transition-colors"
              >
                Retour Aanmelden
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-16 sm:pb-24">
        <div className="pt-8 border-t border-sand flex flex-wrap gap-4 justify-between">
          <Link
            href="/klantenservice"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            &larr; Terug naar Klantenservice
          </Link>
          <Link
            href="/klantenservice/verzending"
            className="text-sm text-wine hover:text-wine-dark transition-colors"
          >
            Verzending & Levering &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
