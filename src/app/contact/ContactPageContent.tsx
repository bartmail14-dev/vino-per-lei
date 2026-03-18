"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateOnScroll, StaggerChildren, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { ContactForm } from "./ContactForm";
import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, Clock as ClockIcon, ShieldCheck as ShieldCheckIcon, MessageCircle as MessageCircleIcon, Check } from "lucide-react";

interface ContactPageContentProps {
  email: string;
  phone: string;
  addressStreet: string;
  addressPostal: string;
  addressCity: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
}

export function ContactPageContent({
  email,
  phone,
  addressStreet,
  addressPostal,
  addressCity,
  hoursWeekday,
  hoursSaturday,
  hoursSunday,
}: ContactPageContentProps) {
  return (
    <div className="bg-background">
      {/* Hero header */}
      <div className="relative bg-dark-bg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(201,162,39,0.04),transparent_40%)]" />
        <div className="max-w-5xl mx-auto px-4 py-20 sm:py-28 relative">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-label text-gold/60 mb-4"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-[1.15]"
          >
            Stel je vraag aan Carla
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 max-w-lg text-sm sm:text-base leading-relaxed"
          >
            Wijnadvies, vragen over je bestelling of een cadeau samenstellen?
            Carla beantwoordt alles persoonlijk.
          </motion.p>
        </div>
      </div>

      {/* Contact info cards strip */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 sm:-mt-10 relative z-10 mb-12 sm:mb-16">
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-4" staggerDelay={0.08}>
          <StaggerItem>
            <a
              href={`mailto:${email}`}
              className="bg-white rounded-lg p-5 sm:p-6 shadow-lg border border-sand/50 flex items-start gap-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group block"
            >
              <div className="w-11 h-11 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0 group-hover:bg-wine/20 transition-colors">
                <MailIcon className="w-5 h-5 text-wine" />
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm mb-1">E-mail</p>
                <span className="text-sm text-wine group-hover:text-wine-dark transition-colors">
                  {email}
                </span>
              </div>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="bg-white rounded-lg p-5 sm:p-6 shadow-lg border border-sand/50 flex items-start gap-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group block"
            >
              <div className="w-11 h-11 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0 group-hover:bg-wine/20 transition-colors">
                <PhoneIcon className="w-5 h-5 text-wine" />
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm mb-1">Telefoon</p>
                <span className="text-sm text-grey group-hover:text-charcoal transition-colors">{phone}</span>
              </div>
            </a>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-lg border border-sand/50 flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-5 h-5 text-wine" />
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm mb-1">Adres</p>
                <p className="text-sm text-grey">
                  {addressStreet}, {addressPostal} {addressCity}
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <AnimateOnScroll variant="fadeUp">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-sand/50">
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-2">
                  Stuur ons een bericht
                </h2>
                <p className="text-grey text-sm mb-6">
                  Vul het formulier in en we reageren binnen 1 werkdag.
                </p>
                <ContactForm />
              </div>
            </AnimateOnScroll>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AnimateOnScroll variant="fadeRight" delay={0.1}>
              <div className="bg-warm-white rounded-lg p-6 border border-sand">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-4 h-4 text-gold" />
                  </div>
                  <h2 className="font-serif text-lg font-semibold text-charcoal">
                    Openingstijden
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-sand/50">
                    <span className="text-grey">Maandag - Vrijdag</span>
                    <span className="font-semibold text-charcoal">{hoursWeekday}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-sand/50">
                    <span className="text-grey">Zaterdag</span>
                    <span className="font-semibold text-charcoal">{hoursSaturday}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-grey">Zondag</span>
                    <span className="text-grey">{hoursSunday}</span>
                  </div>
                </div>
                <p className="text-xs text-grey/70 mt-5 pt-4 border-t border-sand">
                  Online bestellen kan 24/7. E-mails worden binnen 1 werkdag beantwoord.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeRight" delay={0.2}>
              <div className="relative bg-gradient-to-br from-wine to-wine-dark rounded-lg p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[60px]" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/3 rounded-tr-[40px]" />
                <div className="relative">
                  <MessageCircleIcon className="w-8 h-8 text-gold/60 mb-3" />
                  <h2 className="font-serif text-lg font-semibold text-white mb-2">
                    Snel antwoord nodig?
                  </h2>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    Bekijk eerst onze veelgestelde vragen — misschien staat het
                    antwoord er al bij.
                  </p>
                  <Link
                    href="/klantenservice/faq"
                    className="inline-flex items-center gap-2 text-sm text-white font-semibold bg-white/15 hover:bg-white/25 px-4 py-2.5 rounded-lg transition-colors"
                  >
                    Bekijk FAQ &rarr;
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Trust signals */}
            <AnimateOnScroll variant="fadeRight" delay={0.3}>
              <div className="bg-white rounded-lg p-5 border border-sand/50">
                <h3 className="font-semibold text-charcoal text-sm mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-wine" />
                  Vertrouwenssignalen
                </h3>
                <ul className="space-y-3 text-sm text-grey">
                  {[
                    "Reactie binnen 1 werkdag",
                    "100% proefgarantie",
                    "Veilig betalen via iDEAL",
                    "Gratis verzending vanaf \u20AC35",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-wine/60 flex-shrink-0" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Map placeholder */}
        <AnimateOnScroll variant="fadeUp" delay={0.1}>
          <div className="mt-12 sm:mt-16 rounded-2xl overflow-hidden border border-sand/50">
            <div className="bg-cream h-48 sm:h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="w-10 h-10 text-wine/30 mx-auto mb-3" />
                <p className="text-charcoal font-serif text-lg font-semibold">{addressStreet}</p>
                <p className="text-grey text-sm">{addressPostal} {addressCity}</p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-sand">
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
