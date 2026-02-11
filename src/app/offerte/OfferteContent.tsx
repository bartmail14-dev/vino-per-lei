"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  CheckIcon,
  CloseIcon,
  ChevronDownIcon,
  TruckIcon,
  ShieldIcon,
} from "@/components/icons";

/* ============================================
   Accordion Component
   ============================================ */

function AccordionItem({
  title,
  icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-sand rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-warm-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-wine">{icon}</span>
          <span className="font-semibold text-charcoal">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-grey" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-grey leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================
   Icons for sections
   ============================================ */

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/* ============================================
   Main Component
   ============================================ */

export function OfferteContent() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [openSla, setOpenSla] = useState(false);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const today = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="print:bg-white print:text-black">
      {/* ===== 1. BRIEFHOOFD & INTRO ===== */}
      <Section background="warm" spacing="lg" containerSize="narrow">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-wine">
                Blue Wire Media
              </h1>
              <p className="text-grey text-sm mt-1">Webdesign & Development</p>
            </div>
            <div className="text-sm text-grey text-left sm:text-right">
              <p>{today}</p>
              <p className="mt-1">Kenmerk: BWM-2025-VPL</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-sand" />

          {/* Address block */}
          <div className="text-sm text-charcoal">
            <p className="font-semibold">Vino per Lei</p>
            <p className="text-grey mt-1">T.a.v. de directie</p>
          </div>

          {/* Intro text */}
          <div className="space-y-4 text-charcoal leading-relaxed">
            <p>Beste ondernemer,</p>
            <p>
              Wat leuk dat je interesse hebt in een samenwerking! Mijn naam
              is <strong>Bart Visser</strong> en ik ben de oprichter van Blue Wire
              Media. Met veel plezier presenteer ik deze offerte voor de
              ontwikkeling van jouw webshop <strong>Vino per Lei</strong>.
            </p>
            <p>
              Even een eerlijke bekentenis: ik ben zelf een enorme Italië-gek
              en wijnliefhebber. Van de heuvels van Piemonte tot de kusten van
              Puglia — ik ken ze en ik hou ervan. Toen ik jouw plannen voor
              Vino per Lei hoorde, wist ik meteen: dit project wil ik doen.
              Niet puur als opdracht, maar omdat ik oprecht geloof in wat je
              aan het opbouwen bent.
            </p>
            <p>
              Daarom heb ik deze offerte bewust scherp geprijsd. Ik wil graag
              samen met je groeien als vaste webpartner — van de eerste
              productpagina tot jullie duizendste bestelling.
            </p>
            <p>
              Hieronder vind je mijn aanpak, de werkzaamheden en twee
              transparante prijsopties — speciaal samengesteld voor een
              ambitieuze starter.
            </p>
          </div>
        </div>
      </Section>

      {/* ===== 2. PROJECTOMSCHRIJVING ===== */}
      <Section background="default" spacing="lg" containerSize="narrow">
        <div className="space-y-6">
          <div>
            <p className="text-label text-wine mb-2">Het project</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
              Vino per Lei — Italiaanse Wijnwebshop
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal">Wat bouwen we?</h3>
              <p className="text-grey leading-relaxed">
                Een op maat gemaakte webshop voor authentieke Italiaanse wijnen.
                De shop combineert een premium uitstraling met een soepele
                winkelervaring — van browsen tot bezorging.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal">Technische basis</h3>
              <ul className="space-y-2 text-grey">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-1 shrink-0" />
                  <span>Next.js (App Router) + TypeScript</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-1 shrink-0" />
                  <span>Shopify Headless (Storefront API)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-1 shrink-0" />
                  <span>Tailwind CSS — custom wine-thema</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-1 shrink-0" />
                  <span>Vercel hosting (99.99% uptime)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-1 shrink-0" />
                  <span>Mobile-first, SEO-geoptimaliseerd</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== 3. WERKZAAMHEDEN — ACCORDIONS ===== */}
      <Section background="cream" spacing="lg" containerSize="narrow">
        <div className="space-y-6">
          <div>
            <p className="text-label text-wine mb-2">Scope</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
              Werkzaamheden
            </h2>
            <p className="text-grey mt-2">
              Klik op een onderdeel voor meer details over wat er precies wordt opgeleverd.
            </p>
          </div>

          <div className="space-y-3">
            <AccordionItem
              title="Design & UX"
              icon={<PaletteIcon className="w-5 h-5" />}
              isOpen={openItems.includes("design")}
              onToggle={() => toggleItem("design")}
            >
              <ul className="space-y-2">
                <li>Custom ontwerp in lijn met het Vino per Lei merkgevoel — warm, Italiaans, premium</li>
                <li>Mobile-first responsive design (telefoon, tablet, desktop)</li>
                <li>Wine-thema met zorgvuldig gekozen kleuren, typografie en sfeerbeelden</li>
                <li>Productfotografie-integratie met zoom en galerij</li>
                <li>Interactieve elementen: smaakprofielen, regio-spotlights, food pairings</li>
                <li>Leeftijdsverificatie gate bij eerste bezoek</li>
              </ul>
            </AccordionItem>

            <AccordionItem
              title="Frontend Ontwikkeling"
              icon={<CodeIcon className="w-5 h-5" />}
              isOpen={openItems.includes("frontend")}
              onToggle={() => toggleItem("frontend")}
            >
              <ul className="space-y-2">
                <li>Next.js App Router met Server Components voor snelle laadtijden</li>
                <li>TypeScript strict mode voor betrouwbare, onderhoudbare code</li>
                <li>Wijnencatalogus met geavanceerde filters (regio, druif, prijs, smaak)</li>
                <li>Productdetailpagina&apos;s met accordions, reviews en gerelateerde wijnen</li>
                <li>Slide-out winkelwagen met realtime updates</li>
                <li>Checkout flow met stapsgewijze voortgang</li>
                <li>Wenslijst-functionaliteit</li>
                <li>Cadeau-opties met inpakservice en persoonlijk bericht</li>
              </ul>
            </AccordionItem>

            <AccordionItem
              title="Shopify Integratie"
              icon={<ShoppingBagIcon className="w-5 h-5" />}
              isOpen={openItems.includes("shopify")}
              onToggle={() => toggleItem("shopify")}
            >
              <ul className="space-y-2">
                <li>Shopify Headless via Storefront API — volledige controle over de frontend</li>
                <li>Productbeheer via het vertrouwde Shopify-dashboard</li>
                <li>Voorraadbeheer en automatische &quot;uitverkocht&quot; meldingen</li>
                <li>Bestelbeheer met orderoverzicht en statusupdates</li>
                <li>Collecties en tags voor georganiseerd wijnbeheer</li>
                <li>Kortingscodes en automatische promoties</li>
              </ul>
            </AccordionItem>

            <AccordionItem
              title="Checkout & Betaling"
              icon={<CreditCardIcon className="w-5 h-5" />}
              isOpen={openItems.includes("checkout")}
              onToggle={() => toggleItem("checkout")}
            >
              <ul className="space-y-2">
                <li>iDEAL-integratie (primaire betaalmethode NL)</li>
                <li>Creditcard en overige betaalmethoden via Shopify Payments</li>
                <li>Leeftijdsverificatie bij bestelling (wettelijke verplichting)</li>
                <li>Kortingscode-systeem met validatie</li>
                <li>Bezorgopties: standaard en avondlevering</li>
                <li>Gratis verzending boven drempelbedrag</li>
                <li>Ordersamenvatting met realtime berekeningen</li>
              </ul>
            </AccordionItem>

            <AccordionItem
              title="SEO & Performance"
              icon={<SearchIcon className="w-5 h-5" />}
              isOpen={openItems.includes("seo")}
              onToggle={() => toggleItem("seo")}
            >
              <ul className="space-y-2">
                <li>Server-Side Rendering (SSR) voor optimale indexering door Google</li>
                <li>Automatische meta-tags en Open Graph data per productpagina</li>
                <li>JSON-LD structured data (Product schema) voor rich snippets</li>
                <li>Core Web Vitals optimalisatie (LCP, FID, CLS)</li>
                <li>Automatische sitemap en robots.txt</li>
                <li>Afbeeldingsoptimalisatie met lazy loading en WebP</li>
              </ul>
            </AccordionItem>

            <AccordionItem
              title="Content & Lancering"
              icon={<RocketIcon className="w-5 h-5" />}
              isOpen={openItems.includes("launch")}
              onToggle={() => toggleItem("launch")}
            >
              <ul className="space-y-2">
                <li>Hulp bij het invoeren van producten in Shopify</li>
                <li>DNS-configuratie en SSL-certificaat</li>
                <li>Go-live begeleiding en checklist</li>
                <li>Basisinstructie voor het Shopify-dashboard</li>
                <li>Performance-test en laatste optimalisaties voor lancering</li>
              </ul>
            </AccordionItem>
          </div>
        </div>
      </Section>

      {/* ===== 4. TIJDLIJN ===== */}
      <Section background="default" spacing="lg" containerSize="narrow">
        <div className="space-y-8">
          <div>
            <p className="text-label text-wine mb-2">Planning</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
              Tijdlijn
            </h2>
            <p className="text-grey mt-2">
              Geschatte doorlooptijd: 6 weken van start tot lancering.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                week: "Week 1–2",
                title: "Design & Prototype",
                desc: "Wireframes, visueel ontwerp en prototype ter goedkeuring.",
                icon: <PaletteIcon className="w-5 h-5" />,
              },
              {
                week: "Week 3–4",
                title: "Frontend Development",
                desc: "Bouw van alle pagina's, componenten en interacties.",
                icon: <CodeIcon className="w-5 h-5" />,
              },
              {
                week: "Week 5",
                title: "Shopify & Content",
                desc: "Koppeling met Shopify, producten invoeren, testen.",
                icon: <ShoppingBagIcon className="w-5 h-5" />,
              },
              {
                week: "Week 6",
                title: "Testing & Lancering",
                desc: "Uitgebreid testen, optimalisatie en go-live.",
                icon: <RocketIcon className="w-5 h-5" />,
              },
            ].map((step, index) => (
              <div key={step.week} className="flex gap-4 sm:gap-6">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-wine text-white flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  {index < 3 && (
                    <div className="w-px h-full min-h-[3rem] bg-sand" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8">
                  <p className="text-label text-wine">{step.week}</p>
                  <h3 className="font-semibold text-charcoal mt-1">
                    {step.title}
                  </h3>
                  <p className="text-grey text-sm mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== 5. PRIJSOVERZICHT ===== */}
      <Section background="wine" spacing="lg" containerSize="narrow">
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-label text-champagne mb-2">Investering</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
              Twee opties, transparant geprijsd
            </h2>
            <p className="text-champagne/80 mt-2 max-w-xl mx-auto">
              Kies de optie die het beste bij jouw situatie past. Beide opties
              leveren exact dezelfde webshop op.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Option A: Subscription */}
            <div className="bg-white rounded-lg p-6 sm:p-8 text-charcoal relative">
              <div className="absolute -top-3 left-6">
                <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-sm bg-gold text-charcoal">
                  Aanbevolen voor starters
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-serif text-xl font-semibold">
                  Optie A: Abonnement
                </h3>
                <div className="mt-4">
                  <span className="text-price-lg text-wine">&euro;150</span>
                  <span className="text-grey ml-1">/maand</span>
                </div>
                <p className="text-sm text-grey mt-1">
                  All-inclusive — looptijd 24 maanden
                </p>
              </div>

              <div className="h-px bg-sand my-5" />

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Geen investering vooraf</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Shopify Basic inbegrepen</strong> (~&euro;32/mnd)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span><strong>Hosting inbegrepen</strong> (Vercel Pro, &euro;20/mnd)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Doorlopende support & onderhoud</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>2 uur aanpassingen per maand inclusief</span>
                </li>
              </ul>

              <div className="h-px bg-sand my-5" />

              <div className="space-y-2 text-sm text-grey">
                <div className="flex justify-between">
                  <span>Shopify Basic (incl.)</span>
                  <span>&euro;32/mnd</span>
                </div>
                <div className="flex justify-between">
                  <span>Hosting Vercel Pro (incl.)</span>
                  <span>&euro;20/mnd</span>
                </div>
                <div className="flex justify-between">
                  <span>Ontwikkeling (gespreid)</span>
                  <span>&euro;68/mnd</span>
                </div>
                <div className="flex justify-between">
                  <span>Support & onderhoud</span>
                  <span>&euro;30/mnd</span>
                </div>
                <div className="h-px bg-sand my-2" />
                <div className="flex justify-between font-semibold text-charcoal">
                  <span>Totaal</span>
                  <span>&euro;150/mnd</span>
                </div>
              </div>

              <p className="text-xs text-grey mt-4">
                Na 24 maanden: &euro;50/mnd (hosting + support).
                Eigendom na afloop looptijd. Je betaalt nergens extra voor.
              </p>

              <Button variant="primary" fullWidth className="mt-6">
                Kies abonnement
              </Button>
            </div>

            {/* Option B: One-time */}
            <div className="bg-white rounded-lg p-6 sm:p-8 text-charcoal">
              <h3 className="font-serif text-xl font-semibold mt-2">
                Optie B: Eenmalig
              </h3>
              <div className="mt-4">
                <span className="text-price-lg text-wine">&euro;1.450</span>
                <span className="text-grey ml-1">eenmalig</span>
              </div>
              <p className="text-sm text-grey mt-1">
                + SLA &euro;45/maand na oplevering
              </p>

              <div className="h-px bg-sand my-5" />

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Direct eigendom na oplevering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Hosting inbegrepen in SLA (&euro;20/mnd)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Support & onderhoud via SLA (&euro;25/mnd)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>2 uur aanpassingen per maand inclusief</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span>Broncode via Git altijd toegankelijk</span>
                </li>
              </ul>

              <div className="h-px bg-sand my-5" />

              <div className="space-y-2 text-sm text-grey">
                <div className="flex justify-between">
                  <span>Ontwikkeling</span>
                  <span>&euro;1.450</span>
                </div>
                <div className="flex justify-between">
                  <span>SLA (maandelijks)</span>
                  <span>&euro;45/mnd</span>
                </div>
                <div className="flex justify-between">
                  <span>Shopify Basic (apart)*</span>
                  <span>~&euro;32/mnd</span>
                </div>
              </div>

              <p className="text-xs text-grey mt-4">
                * Shopify-kosten worden rechtstreeks aan Shopify betaald.
                Het Shopify-account is altijd jouw eigendom.
              </p>

              <Button variant="secondary" fullWidth className="mt-6">
                Kies eenmalig
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== 6. WAT IS INBEGREPEN ===== */}
      <Section background="default" spacing="lg" containerSize="narrow">
        <div className="space-y-6">
          <div>
            <p className="text-label text-wine mb-2">Overzicht</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
              Wat is inbegrepen?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Included */}
            <div>
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-success" />
                Inbegrepen
              </h3>
              <ul className="space-y-3 text-sm text-grey">
                {[
                  "Responsive design (mobiel, tablet, desktop)",
                  "Shopify Headless setup en configuratie",
                  "Tot 50 producten invoeren",
                  "1 revisieronde op het ontwerp",
                  "SEO basisoptimalisatie",
                  "SSL-certificaat en HTTPS",
                  "Hosting setup en configuratie",
                  "Leeftijdsverificatie (18+)",
                  "Productpagina's met smaakprofielen",
                  "Winkelwagen en checkout flow",
                  "Cadeaufunctie met inpakservice",
                  "Filterfunctie (regio, druif, prijs)",
                  "Wenslijst-functionaliteit",
                  "Kortingscode-systeem",
                  "Basis analytics setup",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not included */}
            <div>
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <CloseIcon className="w-5 h-5 text-error" />
                Niet inbegrepen
              </h3>
              <ul className="space-y-3 text-sm text-grey">
                {[
                  "Productfotografie",
                  "Copywriting en tekstcreatie",
                  "Extra revisierondes (op uurbasis)",
                  "Custom integraties (ERP, boekhouding)",
                  "E-mailmarketing setup (Mailchimp e.d.)",
                  "Social media beheer",
                  "Voorraadaanvulling en logistiek",
                  "Vertalingen naar andere talen",
                  "Betaalde advertentiecampagnes",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CloseIcon className="w-4 h-4 text-error mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== 7. SLA DETAILS ===== */}
      <Section background="cream" spacing="lg" containerSize="narrow">
        <div className="space-y-6">
          <div>
            <p className="text-label text-wine mb-2">Service</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
              Service Level Agreement
            </h2>
            <p className="text-grey mt-2">
              Na oplevering zorg ik voor het onderhoud en de continu&iuml;teit van jouw webshop.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-5 border border-sand">
              <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center mb-3">
                <ClockIcon className="w-5 h-5 text-wine" />
              </div>
              <h3 className="font-semibold text-charcoal text-sm">Response tijd</h3>
              <p className="text-grey text-sm mt-1">
                Binnen 24 uur op werkdagen
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-sand">
              <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center mb-3">
                <ShieldIcon className="w-5 h-5 text-wine" />
              </div>
              <h3 className="font-semibold text-charcoal text-sm">Uptime</h3>
              <p className="text-grey text-sm mt-1">
                99.99% via Vercel Pro
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-sand">
              <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center mb-3">
                <CalendarIcon className="w-5 h-5 text-wine" />
              </div>
              <h3 className="font-semibold text-charcoal text-sm">Aanpassingen</h3>
              <p className="text-grey text-sm mt-1">
                2 uur per maand inclusief
              </p>
            </div>
          </div>

          {/* SLA Accordion */}
          <div className="border border-sand rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setOpenSla(!openSla)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-warm-white/50 transition-colors"
            >
              <span className="font-semibold text-charcoal">
                Volledige SLA-voorwaarden
              </span>
              <motion.span
                animate={{ rotate: openSla ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="w-5 h-5 text-grey" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openSla && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm text-grey leading-relaxed space-y-4">
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Maandelijks onderhoud</h4>
                      <ul className="space-y-1 ml-4 list-disc">
                        <li>Security updates en patches</li>
                        <li>Framework- en dependency-updates</li>
                        <li>Uptime monitoring (24/7)</li>
                        <li>Dagelijkse backups</li>
                        <li>Performance monitoring</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Inclusieve aanpassingen (2 uur/maand)</h4>
                      <ul className="space-y-1 ml-4 list-disc">
                        <li>Kleine tekstwijzigingen en content updates</li>
                        <li>Toevoegen of aanpassen van producten (boven de 50)</li>
                        <li>Minor styling aanpassingen</li>
                        <li>Bug fixes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Meerwerk</h4>
                      <ul className="space-y-1 ml-4 list-disc">
                        <li>Aanvullende uren: &euro;75/uur excl. BTW</li>
                        <li>Nieuwe features worden apart geoffreerd</li>
                        <li>Meerwerk altijd in overleg en na goedkeuring</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Hosting specificaties</h4>
                      <ul className="space-y-1 ml-4 list-disc">
                        <li>Vercel Pro — edge network, global CDN</li>
                        <li>Automatische SSL/TLS certificaten</li>
                        <li>DDoS-bescherming</li>
                        <li>Automatische schaling bij verkeerspieken</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {/* ===== 8. EIGENDOM & RECHTEN ===== */}
      <Section background="default" spacing="lg" containerSize="narrow">
        <div className="space-y-6">
          <div>
            <p className="text-label text-wine mb-2">Juridisch</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
              Eigendom & Rechten
            </h2>
          </div>

          <div className="space-y-4 text-grey leading-relaxed">
            <div className="bg-cream rounded-lg p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-wine/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-wine font-bold text-sm">A</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Bij abonnement</h3>
                  <p className="text-sm mt-1">
                    Eigendom gaat over na afloop van de looptijd (24 maanden).
                    Tussentijds afkopen is mogelijk tegen betaling van het resterende
                    ontwikkelingsbedrag. Tijdens de looptijd heb je te allen tijde
                    toegang tot de broncode.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream rounded-lg p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-wine/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-wine font-bold text-sm">B</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Bij eenmalige betaling</h3>
                  <p className="text-sm mt-1">
                    Direct en volledig eigendom na oplevering en betaling.
                    Alle broncode wordt overgedragen via een Git-repository.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg p-5 text-sm text-grey space-y-2">
            <h4 className="font-semibold text-charcoal">Altijd van toepassing:</h4>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>Het Shopify-account is altijd jouw eigendom</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>De domeinnaam is altijd jouw eigendom</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>Broncode is altijd toegankelijk via Git</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>Geen vendor lock-in — je kunt altijd overstappen</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ===== 9. PERSOONLIJKE AFSLUITING ===== */}
      <Section background="warm" spacing="lg" containerSize="narrow">
        <div className="space-y-8">
          <div className="space-y-4 text-charcoal leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
              Tot slot
            </h2>
            <p>
              Ik geloof oprecht in dit project. Italië loopt als een rode draad
              door mijn leven — de cultuur, de keuken, en ja, vooral de wijnen.
              Vino per Lei is precies het soort project waar ik mijn tanden in
              wil zetten.
            </p>
            <p>
              De prijsstelling in deze offerte is dan ook bewust scherp — niet
              omdat ik aan kwaliteit inlever, maar omdat ik graag samen met je
              wil groeien. Ik zie dit als het begin van een langdurig
              partnerschap waarin ik als jouw vaste webpartner meedenk,
              mee-ontwikkel en mee-onderneem.
            </p>
            <p>
              Ik maak graag tijd vrij voor een persoonlijk gesprek om deze
              offerte samen door te nemen. Uiteraard onder het genot van een
              goed glas wijn.
            </p>
            <p className="font-medium">
              Met hartelijke groet,<br />
              <strong>Bart Visser</strong> — Blue Wire Media
            </p>
            <p className="font-medium italic">
              Salute!
            </p>
          </div>

          <div className="h-px bg-sand" />

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal">Blue Wire Media</h3>
              <div className="space-y-2 text-sm text-grey">
                <a
                  href="mailto:info@bluewiremedia.nl"
                  className="flex items-center gap-2 hover:text-wine transition-colors"
                >
                  <MailIcon className="w-4 h-4" />
                  info@bluewiremedia.nl
                </a>
                <a
                  href="tel:+31612345678"
                  className="flex items-center gap-2 hover:text-wine transition-colors"
                >
                  <PhoneIcon className="w-4 h-4" />
                  +31 6 12 34 56 78
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-charcoal">Geldigheid</h3>
              <p className="text-sm text-grey">
                Deze offerte is 30 dagen geldig vanaf de dagtekening.
              </p>
              <p className="text-sm text-grey">
                Alle genoemde bedragen zijn exclusief 21% BTW.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Button variant="primary" size="lg">
              Laten we kennismaken
            </Button>
            <p className="text-sm text-grey mt-3">
              Of bel direct — wij maken graag tijd voor u.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
