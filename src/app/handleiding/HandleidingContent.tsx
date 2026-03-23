"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wine,
  FileText,
  Settings,
  ShoppingCart,
  PenLine,
  HelpCircle,
  LayoutGrid,
  Truck,
  ChevronDown,
  ExternalLink,
  BookOpen,
  Search,
  Info,
  CheckCircle2,
  Clock,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

/* ─── Types ─── */
interface Step {
  title: string;
  description: string;
  screenshot?: string;
  websiteScreenshot?: string;
  websiteCaption?: string;
  tip?: string;
}

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  steps: Step[];
}

/* ─── Data ─── */
const SHOPIFY_ADMIN_URL = "https://vino-per-lei-2.myshopify.com/admin";

const sections: Section[] = [
  {
    id: "producten",
    icon: <Wine className="w-5 h-5" />,
    title: "Producten beheren",
    subtitle: "Nieuwe wijn toevoegen, prijzen aanpassen, voorraad bijwerken",
    color: "from-purple-500/20 to-purple-600/10",
    steps: [
      {
        title: "Ga naar Producten",
        description:
          'Log in op Shopify Admin en klik in het linker menu op "Products". Je ziet hier een overzicht van al je wijnen.',
        screenshot: "/handleiding/producten-overzicht.png",
        websiteScreenshot: "/handleiding/website-producten.png",
        websiteCaption: "Zo zien je producten eruit op de website — titel, prijs, foto en badge komen allemaal uit Shopify",
      },
      {
        title: "Nieuw product toevoegen",
        description:
          'Klik rechtsboven op "Add product". Vul de volgende velden in:',
        screenshot: "/handleiding/product-velden.png",
        websiteScreenshot: "/handleiding/website-product-detail.png",
        websiteCaption: "Dit is hoe een productpagina eruitziet — titel, beschrijving en foto worden direct overgenomen",
        tip: "Vul altijd een titel, beschrijving, prijs en minimaal 1 foto in. De beschrijving verschijnt op de productpagina.",
      },
      {
        title: "Productvelden invullen",
        description:
          "Title: Naam van de wijn (bijv. 'Barolo DOCG 2019')\nDescription: Beschrijving met smaakprofiel\nMedia: Upload foto's (min. 800x800px)\nPricing: Prijs incl. BTW\nInventory: Voorraad aantal\nProduct type: 'Rode wijn', 'Witte wijn', etc.\nTags: Regio, druif, etc.",
        screenshot: "/handleiding/product-velden.png",
      },
      {
        title: "Voorraad bijwerken",
        description:
          'Om alleen de voorraad aan te passen: ga naar het product, scroll naar "Inventory" en wijzig het aantal. Klik daarna op "Save".',
        screenshot: "/handleiding/product-velden.png",
        tip: "Je kunt ook de prijs wijzigen zonder andere velden aan te passen. Vergeet niet op Save te klikken!",
      },
    ],
  },
  {
    id: "homepage",
    icon: <LayoutGrid className="w-5 h-5" />,
    title: "Homepage teksten",
    subtitle: "Hero, Announcement Bar en USP teksten aanpassen",
    color: "from-blue-500/20 to-blue-600/10",
    steps: [
      {
        title: "Ga naar Content",
        description:
          'Klik in het linker menu op "Content" → "Metaobjects". Hier staan alle aanpasbare teksten van de website.',
        screenshot: "/handleiding/content-metaobjects.png",
      },
      {
        title: "Hero tekst aanpassen",
        description:
          'Klik op "Homepage Hero" → open de entry. Je kunt hier de titel, subtitel en knoptekst van de hoofdbanner aanpassen.',
        screenshot: "/handleiding/homepage-hero.png",
        websiteScreenshot: "/handleiding/website-announcement-bar.png",
        websiteCaption: "De hero-tekst en announcement bar op de website — de rode markering toont welk element je aanpast",
        tip: "Wijzigingen zijn na maximaal 1 uur zichtbaar op de website (of direct na een nieuwe deploy).",
      },
      {
        title: "Announcement Bar",
        description:
          'De gekleurde balk bovenaan de website. Ga naar "Content" → "Metaobjects" → "Announcement Bar" om de tekst aan te passen.',
        screenshot: "/handleiding/announcement-bar.png",
        websiteScreenshot: "/handleiding/website-announcement-bar.png",
        websiteCaption: "De announcement bar is de gekleurde balk helemaal bovenaan — hier met rode markering",
      },
      {
        title: "USP punten",
        description:
          'De vertrouwenspunten (bijv. "Gratis verzending", "Direct van de producent") kun je aanpassen via de USP Items entries.',
        screenshot: "/handleiding/usp-items.png",
        websiteScreenshot: "/handleiding/website-usp-balk.png",
        websiteCaption: "De USP-balk onder de hero — \"Gratis verzending\", \"Gratis retour\" etc. komen uit Shopify",
      },
    ],
  },
  {
    id: "faq",
    icon: <HelpCircle className="w-5 h-5" />,
    title: "FAQ beheren",
    subtitle: "Veelgestelde vragen toevoegen of bewerken",
    color: "from-amber-500/20 to-amber-600/10",
    steps: [
      {
        title: "FAQ items vinden",
        description:
          'Ga naar "Content" → "Metaobjects" → "FAQ Item". Je ziet hier alle veelgestelde vragen.',
        screenshot: "/handleiding/faq-overzicht.png",
        websiteScreenshot: "/handleiding/website-faq.png",
        websiteCaption: "Zo zien de FAQ-vragen eruit op de website — elke vraag is een aparte entry in Shopify",
      },
      {
        title: "Vraag bewerken",
        description:
          "Klik op een bestaande vraag om deze te openen. Je kunt de vraag en het antwoord aanpassen. Klik daarna op Save.",
        screenshot: "/handleiding/faq-overzicht.png",
      },
      {
        title: "Nieuwe vraag toevoegen",
        description:
          'Klik op "Add entry" om een nieuwe FAQ toe te voegen. Vul de vraag, het antwoord en eventueel een categorie in.',
        screenshot: "/handleiding/faq-overzicht.png",
        tip: "Sorteer vragen op volgorde van relevantie — de eerste vragen worden het meest gezien.",
      },
    ],
  },
  {
    id: "categorieen",
    icon: <LayoutGrid className="w-5 h-5" />,
    title: "Wijn categorieën",
    subtitle: "Categorie blokken op de homepage beheren",
    color: "from-emerald-500/20 to-emerald-600/10",
    steps: [
      {
        title: "Category Blocks vinden",
        description:
          'Ga naar "Content" → "Metaobjects" → "Category Block". Hier staan de categorieblokken die op de homepage worden getoond.',
        screenshot: "/handleiding/categorie-blokken.png",
        websiteScreenshot: "/handleiding/website-categorieen.png",
        websiteCaption: "De categorieblokken op de homepage — Rode Wijn, Witte Wijn, Rosé etc. komen uit Shopify",
      },
      {
        title: "Categorie aanpassen",
        description:
          "Open een categorie om de naam, beschrijving of afbeelding te wijzigen. De afbeelding wordt als achtergrond van het blok getoond.",
        screenshot: "/handleiding/categorie-blokken.png",
        tip: "Gebruik vierkante of landschapsfoto's voor het beste resultaat (min. 600x400px).",
      },
    ],
  },
  {
    id: "instellingen",
    icon: <Settings className="w-5 h-5" />,
    title: "Site instellingen",
    subtitle: "Bedrijfsgegevens, verzenddrempel en verzendkosten",
    color: "from-rose-500/20 to-rose-600/10",
    steps: [
      {
        title: "Site Instellingen openen",
        description:
          'Ga naar "Content" → "Metaobjects" → "Site Instellingen" → open de "main" entry.',
        screenshot: "/handleiding/site-instellingen.png",
      },
      {
        title: "Bedrijfsgegevens",
        description:
          "Hier kun je het telefoonnummer, e-mailadres, KvK-nummer, BTW-nummer en adresgegevens aanpassen. Deze verschijnen in de footer en op de contactpagina.",
        screenshot: "/handleiding/bedrijfsgegevens.png",
        websiteScreenshot: "/handleiding/website-bedrijfsgegevens.png",
        websiteCaption: "De contactgegevens en KvK/BTW-info in de footer — dit wordt automatisch overgenomen uit Shopify",
      },
      {
        title: "Verzenddrempel & kosten",
        description:
          'De velden "Gratis verzending drempel" en "Verzendkosten" bepalen wanneer klanten gratis verzending krijgen en wat de standaard verzendkosten zijn. Momenteel: gratis vanaf €35, anders €4,95.',
        screenshot: "/handleiding/site-instellingen.png",
        tip: 'Pas je de drempel aan naar bijv. €50? Dan verandert dit automatisch op de hele website — in de winkelwagen, checkout, productpagina\'s en de "Gratis verzending" teksten.',
      },
    ],
  },
  {
    id: "blog",
    icon: <PenLine className="w-5 h-5" />,
    title: "Blog schrijven",
    subtitle: "Nieuwe artikelen publiceren",
    color: "from-indigo-500/20 to-indigo-600/10",
    steps: [
      {
        title: "Blog overzicht",
        description:
          'Ga naar "Content" → "Metaobjects" → "Blog Post". Hier staan alle gepubliceerde en concept-artikelen.',
        screenshot: "/handleiding/content-metaobjects.png",
        websiteScreenshot: "/handleiding/website-blog.png",
        websiteCaption: "De blog op de website — titel, excerpt en afbeelding komen uit Shopify Blog Post entries",
      },
      {
        title: "Nieuw artikel schrijven",
        description:
          'Klik op "Add entry" en vul de velden in:\n\nTitle: Pakkende titel\nSlug: URL-vriendelijke naam (bijv. "barolo-wijngebied")\nExcerpt: Korte samenvatting (1-2 zinnen)\nContent: Het volledige artikel\nFeatured Image: Hoofdafbeelding\nPublished: Vink aan om te publiceren',
        screenshot: "/handleiding/content-metaobjects.png",
        tip: "Een goede afbeelding maakt een artikel veel aantrekkelijker. Gebruik minimaal 1200x630px voor een scherpe weergave.",
      },
    ],
  },
  {
    id: "bestellingen",
    icon: <ShoppingCart className="w-5 h-5" />,
    title: "Bestellingen bekijken",
    subtitle: "Orders inzien en beheren",
    color: "from-teal-500/20 to-teal-600/10",
    steps: [
      {
        title: "Orders overzicht",
        description:
          'Klik in het linker menu op "Orders". Je ziet een overzicht van alle bestellingen met status, bedrag en klantgegevens.',
        screenshot: "/handleiding/orders-overzicht.png",
      },
      {
        title: "Bestelling inzien",
        description:
          "Klik op een bestelling om de details te bekijken: producten, klantadres, betaalstatus en eventuele notities.",
        screenshot: "/handleiding/orders-overzicht.png",
        tip: "Bestellingen worden automatisch verwerkt via de checkout. Je hoeft alleen te controleren of alles correct is en de bestelling te verzenden.",
      },
    ],
  },
  {
    id: "verzending",
    icon: <Truck className="w-5 h-5" />,
    title: "Verzending instellen",
    subtitle: "Verzendmethoden en tarieven",
    color: "from-sky-500/20 to-sky-600/10",
    steps: [
      {
        title: "Shipping instellingen",
        description:
          'Ga naar "Settings" (tandwiel linksonder) → "Shipping and delivery". Hier kun je verzondtarieven en -zones instellen.',
        screenshot: "/handleiding/site-instellingen.png",
      },
      {
        title: "Tarieven aanpassen",
        description:
          "Je kunt per zone (bijv. Nederland, België) de verzendkosten instellen. De gratis verzenddrempel wordt beheerd via Site Instellingen (zie sectie hierboven).",
        screenshot: "/handleiding/site-instellingen.png",
        tip: "Wijzig de verzendkosten op de website altijd via Site Instellingen → Verzendkosten. De Shopify shipping settings zijn voor de checkout-berekening.",
      },
    ],
  },
];

/* ─── Screenshot placeholder ─── */
function ScreenshotPlaceholder({ alt }: { alt: string }) {
  return (
    <div className="relative w-full aspect-video rounded-lg bg-[var(--sand)]/50 border-2 border-dashed border-[var(--sand)] flex items-center justify-center">
      <div className="text-center px-4">
        <FileText className="w-8 h-8 mx-auto mb-2 text-[var(--light-grey)]" />
        <p className="text-sm text-[var(--grey)]">{alt}</p>
        <p className="text-xs text-[var(--light-grey)] mt-1">Screenshot wordt nog toegevoegd</p>
      </div>
    </div>
  );
}

/* ─── Screenshot or placeholder ─── */
function Screenshot({ src, alt }: { src?: string; alt: string }) {
  if (!src) return <ScreenshotPlaceholder alt={alt} />;

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-[var(--sand)] shadow-[var(--shadow-md)]">
      <Image
        src={src}
        alt={alt}
        width={1280}
        height={720}
        className="w-full h-auto"
        unoptimized
      />
    </div>
  );
}

/* ─── Collapsible Section ─── */
function GuideSection({ section }: { section: Section }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="border border-[var(--sand)] rounded-xl overflow-hidden bg-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left cursor-pointer hover:bg-[var(--cream)] transition-colors"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}>
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-[var(--charcoal)] text-lg">{section.title}</h2>
          <p className="text-sm text-[var(--grey)] mt-0.5">{section.subtitle}</p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-[var(--grey)]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 space-y-8 border-t border-[var(--sand)]">
              {section.steps.map((step, idx) => (
                <div key={idx} className="pt-6">
                  {/* Step header */}
                  <div className="flex items-start gap-3 mb-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--wine-burgundy)] text-white text-sm font-medium flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-[var(--charcoal)] text-base pt-0.5">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="ml-10">
                    <p className="text-[var(--grey)] text-sm leading-relaxed whitespace-pre-line">
                      {step.description}
                    </p>

                    {/* Tip */}
                    {step.tip && (
                      <div className="mt-3 flex gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200/60">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{step.tip}</p>
                      </div>
                    )}

                    {/* Screenshot */}
                    <div className="mt-4">
                      <Screenshot
                        src={step.screenshot}
                        alt={`${section.title} — ${step.title}`}
                      />
                    </div>

                    {/* Website screenshot */}
                    {step.websiteScreenshot && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--wine-burgundy)]/10 text-xs font-semibold text-[var(--wine-burgundy)]">
                            <ExternalLink className="w-3 h-3" />
                            Op de website
                          </span>
                          {step.websiteCaption && (
                            <span className="text-xs text-[var(--grey)]">{step.websiteCaption}</span>
                          )}
                        </div>
                        <Screenshot
                          src={step.websiteScreenshot}
                          alt={`Website preview — ${step.title}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Content ─── */
export function HandleidingContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.steps.some(
            (step) =>
              step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              step.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : sections;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative bg-[var(--wine-burgundy)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--grain-texture)] opacity-[0.03]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Shopify Handleiding</span>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Beheer je webshop
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
              Stap-voor-stap instructies voor het beheren van producten, teksten, FAQ&apos;s en instellingen via Shopify.
            </p>
            <a
              href={SHOPIFY_ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-white text-[var(--wine-burgundy)] font-medium hover:bg-white/90 transition-colors"
            >
              Open Shopify Admin
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Search + Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--light-grey)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek in de handleiding..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[var(--sand)] bg-white text-[var(--charcoal)] placeholder:text-[var(--light-grey)] focus:outline-none focus:ring-2 focus:ring-[var(--wine-burgundy)]/20 focus:border-[var(--wine-burgundy)]/40 transition-all"
          />
        </div>

        {/* Quick links */}
        <div className="mb-8 p-4 rounded-xl bg-[var(--wine-burgundy)]/5 border border-[var(--wine-burgundy)]/10">
          <p className="text-sm font-medium text-[var(--charcoal)] mb-2">Snelle links</p>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  const el = document.getElementById(s.id);
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--sand)] text-xs font-medium text-[var(--grey)] hover:text-[var(--charcoal)] hover:border-[var(--wine-burgundy)]/30 transition-colors cursor-pointer"
              >
                {s.icon}
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <div key={section.id} id={section.id}>
              <GuideSection section={section} />
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-8 h-8 mx-auto mb-3 text-[var(--light-grey)]" />
              <p className="text-[var(--grey)]">Geen resultaten voor &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Project status overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-xl border border-[var(--sand)] bg-white overflow-hidden"
        >
          <div className="px-5 sm:px-6 py-5 bg-gradient-to-r from-[var(--wine-burgundy)] to-[var(--wine-dark)] text-white">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Projectoverzicht</h2>
            </div>
            <p className="text-white/70 text-sm mt-1">
              Wat er al klaar is en wat er nog op de planning staat.
            </p>
          </div>

          <div className="px-5 sm:px-6 py-6 space-y-6">
            {/* Done */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-[var(--charcoal)] mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Afgerond
              </h3>
              <ul className="space-y-2 ml-7">
                {[
                  "Volledige webshop gebouwd en live op vino-per-lei.vercel.app",
                  "Alle producten, categorieën en content gekoppeld aan Shopify CMS",
                  "Wijnpagina's met filters, zoekfunctie en productdetails",
                  "Cadeaupakketten pagina met gelegenheden en prijsfilters",
                  "Blog systeem — artikelen schrijven en publiceren via Shopify",
                  "FAQ pagina met categorieën — beheerbaar via Shopify",
                  "Contactformulier met e-mail notificaties",
                  "Winkelwagen en Shopify Checkout integratie",
                  "Gratis verzending drempel en verzendkosten instelbaar via Shopify",
                  "Announcement bar, USP-balk en hero teksten aanpasbaar via CMS",
                  "Bedrijfsgegevens (KvK, BTW, adres) in footer via CMS",
                  "Over Ons pagina met jouw verhaal",
                  "Mobile-friendly: getest en geoptimaliseerd voor telefoon en tablet",
                  "Beveiligingsheaders en rate limiting op formulieren",
                  "Deze handleiding met screenshots en stap-voor-stap uitleg",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--grey)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Todo - our side */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-[var(--charcoal)] mb-3">
                <Clock className="w-5 h-5 text-amber-500" />
                Nog te doen (onze kant)
              </h3>
              <ul className="space-y-2 ml-7">
                {[
                  "Eigen domeinnaam vinoperlei.nl koppelen aan de website",
                  "E-mail instellen via het domein (bijv. info@vinoperlei.nl)",
                  "Shopify API-beveiliging extra versterken (token roteren)",
                  "Lightbox toevoegen aan handleiding-screenshots (klik om te vergroten)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--grey)]">
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nodig van Carla */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-[var(--charcoal)] mb-3">
                <AlertCircle className="w-5 h-5 text-[var(--wine-burgundy)]" />
                Nodig van jou
              </h3>
              <div className="ml-7 space-y-3">
                {[
                  {
                    title: "E-mailadres voor Shopify account",
                    description: "Zodat we een eigen Shopify-inlog voor je kunnen aanmaken. Dan kun je zelf producten, teksten en bestellingen beheren.",
                  },
                  {
                    title: "E-mailadres voor bestelnotificaties",
                    description: "Op dit adres ontvang je een melding zodra er een bestelling binnenkomt. Mag hetzelfde adres zijn.",
                  },
                  {
                    title: "Domeinnaam vinoperlei.nl",
                    description: "Is deze al geregistreerd? Dan hebben we de inloggegevens van de domeinprovider nodig om de website te koppelen.",
                  },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[var(--wine-burgundy)]/5 border border-[var(--wine-burgundy)]/10">
                    <p className="text-sm font-medium text-[var(--charcoal)]">{item.title}</p>
                    <p className="text-xs text-[var(--grey)] mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer help */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-xl bg-white border border-[var(--sand)] text-center"
        >
          <h3 className="font-semibold text-[var(--charcoal)] mb-2">Hulp nodig?</h3>
          <p className="text-sm text-[var(--grey)] mb-4">
            Kom je er niet uit? Neem contact op en we helpen je graag verder.
          </p>
          <a
            href="mailto:info@vinoperlei.nl"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--wine-burgundy)] text-white text-sm font-medium hover:bg-[var(--wine-dark)] transition-colors"
          >
            Stuur een e-mail
          </a>
        </motion.div>
      </section>
    </div>
  );
}
