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
  UserPlus,
  Star,
  BarChart3,
  Scale,
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
    id: "toegang",
    icon: <UserPlus className="w-5 h-5" />,
    title: "Toegang tot Shopify",
    subtitle: "Eenmalig instellen — zo krijg je toegang tot het beheerpaneel",
    color: "from-green-500/20 to-green-600/10",
    steps: [
      {
        title: "Ga naar de Shopify Partners website",
        description:
          "Open je browser en ga naar:\n\npartners.shopify.com\n\nDit is de officiële website van Shopify waar je gratis een Partners-account kunt aanmaken. Dit account heb je nodig om toegang te krijgen tot het beheerpaneel van jouw webshop: Vino per Lei. Je hebt hier geen abonnement of betaling voor nodig.",
        screenshot: "/handleiding/toegang-stap1-partners-website.webp",
      },
      {
        title: 'Klik op "Join now" (Aanmelden)',
        description:
          "Je ziet rechtsboven een groene knop \"Join now\" (of \"Aanmelden\" als de pagina in het Nederlands staat). Klik hierop om te beginnen met het aanmaken van je Partners-account.",
        screenshot: "/handleiding/toegang-stap1-partners-website.webp",
      },
      {
        title: "Maak je Partners-account aan",
        description:
          "Je wordt gevraagd om de volgende gegevens:\n\n1. E-mailadres — gebruik je zakelijke e-mail (bijv. vinoperlei@outlook.com)\n2. Wachtwoord — kies een sterk wachtwoord\n3. Voornaam en achternaam\n\nKlik daarna op \"Create account\" (Account aanmaken).\n\nBelangrijk: je krijgt een verificatie-e-mail. Klik op de link in die e-mail om je account te bevestigen. Controleer ook je spam-map als je de e-mail niet ziet.",
        screenshot: "/handleiding/toegang-stap2-aanmelden.webp",
        tip: "Gebruik bij voorkeur hetzelfde e-mailadres als waarmee je straks bestellingen wilt ontvangen. Dit maakt het overzichtelijker.",
      },
      {
        title: "Log in op het Partners Dashboard",
        description:
          "Na het aanmaken en verifiëren van je account log je in op partners.shopify.com. Je komt op het Partners Dashboard terecht.\n\nLet op: je hebt nu een Partners-account, maar je bent nog NIET gekoppeld aan de Vino per Lei webshop. Dat doe je in de volgende stap.",
        screenshot: "/handleiding/toegang-stap4-inloggen.webp",
      },
      {
        title: "Koppel je account aan de Vino per Lei webshop",
        description:
          "Dit is de belangrijkste stap — hier koppel je je Partners-account aan jouw webshop. Volg deze stappen precies:\n\n1. Klik in het linkermenu op \"Stores\"\n2. Klik rechtsboven op de knop \"Add store\"\n3. Kies de optie \"Request access\" (Toegang aanvragen)\n4. Je ziet nu een veld \"Store URL\" — vul hier exact het volgende in:\n\nvino-per-lei-2.myshopify.com\n\nDit is het adres van jouw Vino per Lei webshop in Shopify. Het is belangrijk dat je dit exact zo intypt, inclusief de \"-2\".\n\n5. Bij \"Bericht\" kun je bijv. schrijven: \"Ik ben Carla, de eigenaar van Vino per Lei\"\n6. Klik op \"Submit request\" (Verzoek versturen)\n\nJe verzoek wordt nu naar ons verstuurd. Wij keuren het goed en dan heb je volledige toegang tot het beheerpaneel.",
        screenshot: "/handleiding/toegang-stap4-dashboard.webp",
        tip: "Let op: de store URL is vino-per-lei-2.myshopify.com (met een \"-2\" erachter). Dit is het interne Shopify-adres — de website zelf krijgt straks het domein vinoperlei.nl.",
      },
      {
        title: "Wacht op goedkeuring",
        description:
          "Na het versturen van je verzoek krijgen wij automatisch een melding. We keuren je aanvraag zo snel mogelijk goed — meestal binnen een paar uur.\n\nJe ontvangt een e-mail van Shopify zodra je toegang is goedgekeurd. Je hoeft verder niets te doen — gewoon even afwachten.",
      },
      {
        title: "Log in op het beheerpaneel van Vino per Lei",
        description:
          "Zodra je goedkeuring hebt ontvangen kun je inloggen:\n\n1. Ga naar partners.shopify.com en log in met je account\n2. Klik in het linkermenu op \"Stores\"\n3. Je ziet nu \"Vino per Lei\" in de lijst staan — dit bevestigt dat de koppeling is gelukt!\n4. Klik op de naam \"Vino per Lei\"\n5. Klik op \"Log in to store\"\n\nJe bent nu in het Shopify beheerpaneel van Vino per Lei! Hier kun je alles beheren: producten, teksten, bestellingen, en meer.\n\nTip: je kunt ook rechtstreeks naar het beheerpaneel gaan via:\nhttps://vino-per-lei-2.myshopify.com/admin",
        screenshot: "/handleiding/toegang-stap7-admin-panel.webp",
        tip: "Sla deze link op als bladwijzer in je browser zodat je er snel bij kunt:\nhttps://vino-per-lei-2.myshopify.com/admin",
      },
    ],
  },
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
          'Log in op het Shopify beheerpaneel en klik in het linker menu op "Products". Je ziet hier een overzicht van al je wijnen met naam, prijs, voorraad en status.',
        screenshot: "/handleiding/admin-producten-overzicht.webp",
        websiteScreenshot: "/handleiding/website-producten-grid.webp",
        websiteCaption: "Zo zien je producten eruit op de website — het productgrid met filters en regio-kaart",
      },
      {
        title: "Nieuw product toevoegen",
        description:
          'Klik rechtsboven op de knop "Add product". Je krijgt een formulier te zien waar je alle gegevens van de wijn kunt invullen.',
        screenshot: "/handleiding/admin-product-nieuw.webp",
        websiteScreenshot: "/handleiding/website-product-detail.webp",
        websiteCaption: "Dit is hoe een productpagina eruitziet — titel, beschrijving en foto worden direct overgenomen",
        tip: "Vul altijd een titel, beschrijving, prijs en minimaal 1 foto in. Zonder foto wordt het product niet goed getoond op de website.",
      },
      {
        title: "Productvelden invullen",
        description:
          "Vul de volgende velden in voor elk product:\n\nTitle — Naam van de wijn (bijv. \"Barolo DOCG 2019\")\nDescription — Beschrijving met smaakprofiel en verhaal\nMedia — Upload minimaal 1 foto (bij voorkeur 800x800px of groter)\nPricing — Verkoopprijs inclusief BTW\nInventory — Hoeveel flessen je op voorraad hebt\nProduct type — \"Rode wijn\", \"Witte wijn\", \"Rosé\" of \"Mousserende wijn\"\nTags — Voeg tags toe voor regio (bijv. \"piemonte\") en druif (bijv. \"nebbiolo\")\n\nKlik daarna op \"Save\" rechtsboven.",
        screenshot: "/handleiding/product-velden.webp",
        websiteScreenshot: "/handleiding/website-product-detail.webp",
        websiteCaption: "Zo ziet een productpagina eruit — titel, beschrijving, prijs en foto worden direct overgenomen uit Shopify",
      },
      {
        title: "Prijs of voorraad snel wijzigen",
        description:
          'Wil je alleen de prijs of voorraad aanpassen? Open het product, wijzig het gewenste veld en klik op "Save". Je hoeft niet alle velden opnieuw in te vullen.\n\nScroll naar beneden om de prijs- en voorraadvelden te vinden. Bij "Inventory" kun je de voorraad bijhouden — Shopify telt automatisch af bij elke bestelling.',
        screenshot: "/handleiding/admin-product-prijs-voorraad.webp",
        websiteScreenshot: "/handleiding/website-producten.webp",
        websiteCaption: "De wijnenpagina toont altijd de actuele prijs — wijzigingen in Shopify worden automatisch overgenomen",
        tip: "De website wordt automatisch bijgewerkt. Het kan maximaal een paar minuten duren voordat de wijziging zichtbaar is.",
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
          'Klik in het linker menu op "Content" en daarna op "Metaobjects". Hier staan alle aanpasbare teksten van de website, gegroepeerd per type.',
        screenshot: "/handleiding/admin-content-metaobjects.webp",
      },
      {
        title: "Hero tekst aanpassen (de grote banner)",
        description:
          'Klik op "Homepage Hero" en open de entry genaamd "main". Hier kun je de volgende teksten aanpassen:\n\nSubtitel — de kleine tekst boven de titel\nTitel regel 1 — eerste regel van de grote titel\nTitel regel 2 — tweede regel (wordt in goud getoond)\nBeschrijving — de tekst onder de titel\nKnopteksten — de tekst op de twee knoppen\nKnoplinks — waar de knoppen naartoe linken',
        screenshot: "/handleiding/admin-homepage-hero-entry.webp",
        websiteScreenshot: "/handleiding/website-hero.webp",
        websiteCaption: "De hero-tekst is het eerste wat bezoekers zien — de grote banner met titel en knoppen",
        tip: "Wijzigingen zijn binnen 1 uur zichtbaar op de website.",
      },
      {
        title: "Announcement Bar (meldingsbalk bovenaan)",
        description:
          'De gekleurde balk helemaal bovenaan de website. Ga naar "Content" \u2192 "Metaobjects" \u2192 "Announcement Bar" \u2192 "main".\n\nMessage — de tekst die wordt getoond\nEnabled — aan/uit schakelaar\nLink — optioneel: waar de balk naartoe linkt als je erop klikt',
        screenshot: "/handleiding/admin-announcement-bar-entry.webp",
        websiteScreenshot: "/handleiding/website-announcement-bar.webp",
        websiteCaption: "De meldingsbalk bovenaan de website — de tekst en link komen uit Shopify",
        tip: "Handig voor seizoensacties, kortingscodes of belangrijke mededelingen. Zet \"Enabled\" op uit als je de balk tijdelijk wilt verbergen.",
      },
      {
        title: "USP punten (vertrouwensbalk)",
        description:
          'De balk met vertrouwenspunten onder de hero (bijv. "Gratis verzending", "Veilig betalen"). Ga naar "Content" \u2192 "Metaobjects" \u2192 "USP Item".\n\nElke entry heeft een titel, subtitel, icoon en volgorde. Je kunt bestaande aanpassen of nieuwe toevoegen.',
        screenshot: "/handleiding/admin-usp-item-entry.webp",
        websiteScreenshot: "/handleiding/website-kaart.webp",
        websiteCaption: "De Italië-kaart sectie op de homepage — USP-balk, favorieten en wijngebieden in beeld",
      },
    ],
  },
  {
    id: "klantervaringen",
    icon: <Star className="w-5 h-5" />,
    title: "Klantervaringen",
    subtitle: "Reviews en testimonials op de homepage beheren",
    color: "from-yellow-500/20 to-yellow-600/10",
    steps: [
      {
        title: "Reviews vinden in Shopify",
        description:
          'Ga naar "Content" \u2192 "Metaobjects" \u2192 "Testimonial". Hier staan de klantreviews die in het \"Reacties van de proeverij\"-blok op de homepage worden getoond.\n\nEr staan standaard 3 voorbeeldreviews klaar. Deze kun je aanpassen naar echte reacties zodra je die hebt.',
        screenshot: "/handleiding/admin-testimonial-overzicht.webp",
        websiteScreenshot: "/handleiding/website-reviews.webp",
        websiteCaption: "De klantervaringen op de homepage — sterren, naam en wijn komen uit Shopify",
      },
      {
        title: "Een review toevoegen",
        description:
          'Klik rechtsboven op "Add entry" en vul de volgende velden in:\n\nNaam klant — bijv. "Marloes V." (gebruik alleen een voorletter van de achternaam voor privacy)\nReview tekst — wat de klant heeft gezegd\nSterren (1-5) — de beoordeling (5 = beste)\nWijn — welke wijn het betreft (bijv. "Barolo 2019")\nBron — waar de review vandaan komt (bijv. "Google Review", "Na aankoop", "Proeverij maart 2026")\nVolgorde — een nummer dat bepaalt in welke volgorde de reviews worden getoond (1 = eerste)\n\nKlik op "Save" om op te slaan.',
        screenshot: "/handleiding/admin-testimonial-bewerken.webp",
        websiteScreenshot: "/handleiding/website-reviews.webp",
        websiteCaption: "Zo verschijnen reviews op de homepage — sterren, naam, wijn en bron worden direct overgenomen",
        tip: "Gebruik altijd echte reviews van echte klanten. Het vermelden van de bron (bijv. Google, na aankoop) maakt het geloofwaardiger.",
      },
      {
        title: "Een review bewerken of verwijderen",
        description:
          'Klik op een bestaande review om deze te openen en aan te passen. Om een review te verwijderen: open de review en klik onderaan op "Delete".\n\nDe website wordt automatisch bijgewerkt.',
        screenshot: "/handleiding/admin-testimonial-bewerken.webp",
        tip: "Houd altijd minimaal 3 reviews actief. Dit geeft bezoekers meer vertrouwen.",
      },
    ],
  },
  {
    id: "cijfers",
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Homepage cijfers",
    subtitle: "De statistieken op de homepage aanpassen (bijv. \"12+ Producenten\")",
    color: "from-cyan-500/20 to-cyan-600/10",
    steps: [
      {
        title: "Hoe werken de cijfers?",
        description:
          "Op de homepage staan 4 cijfers (bijv. \"19 Geselecteerde wijnen\", \"3 Italiaanse wijngebieden\", \"12+ Familieproducenten\"). Standaard worden het aantal wijnen en wijngebieden automatisch berekend op basis van je Shopify producten. De overige cijfers kun je zelf instellen.",
        websiteScreenshot: "/handleiding/website-cijfers.webp",
        websiteCaption: "De cijfers op de homepage — 19 wijnen, 3 wijngebieden, 12+ producenten en < 48 uur levering",
        tip: "Zolang je geen \"Homepage Cijfer\" entries in Shopify aanmaakt, worden de automatisch berekende waarden getoond. Zodra je zelf entries maakt, worden die gebruikt.",
      },
      {
        title: "Cijfers zelf instellen",
        description:
          'Ga naar "Content" \u2192 "Metaobjects" \u2192 "Homepage Cijfer". Hier kun je entries aanmaken of bewerken.\n\nGetal — het nummer (bijv. "12")\nPrefix — optioneel: tekst voor het getal (bijv. "< " wordt dan "< 48")\nSuffix — optioneel: tekst na het getal (bijv. "+" wordt dan "12+")\nLabel — de beschrijving onder het getal (bijv. "Familieproducenten")\nVolgorde — welk cijfer eerst komt (1, 2, 3, 4)',
        screenshot: "/handleiding/admin-homepage-cijfer-entry.webp",
        websiteScreenshot: "/handleiding/website-cijfers.webp",
        websiteCaption: "De cijfers op de homepage — elk getal, prefix/suffix en label komen uit de Shopify entries",
        tip: "Houd het bij 4 cijfers voor de beste weergave op zowel desktop als mobiel.",
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
          'Ga naar "Content" \u2192 "Metaobjects" \u2192 "FAQ Item". Je ziet hier alle veelgestelde vragen, gesorteerd op volgorde.',
        screenshot: "/handleiding/faq-overzicht.webp",
        websiteScreenshot: "/handleiding/website-faq.webp",
        websiteCaption: "Zo zien de FAQ-vragen eruit op de website — elke vraag is een aparte entry in Shopify",
      },
      {
        title: "Vraag bewerken of toevoegen",
        description:
          'Klik op een bestaande vraag om deze aan te passen, of klik op "Add entry" voor een nieuwe.\n\nCategorie — de groep (bijv. "Bestellen", "Verzending", "Retourneren")\nVraag — de veelgestelde vraag\nAntwoord — het antwoord op de vraag\nVolgorde — het nummer bepaalt de positie (1 = bovenaan)',
        screenshot: "/handleiding/admin-faq-overzicht.webp",
        websiteScreenshot: "/handleiding/website-faq-items.webp",
        websiteCaption: "Zo zien de FAQ-vragen eruit op de website — elke vraag klapt open met het antwoord",
        tip: "Groepeer vragen per categorie (Bestellen, Betalen, Verzending, etc.). De website toont ze automatisch per groep.",
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
          'Ga naar "Content" \u2192 "Metaobjects" \u2192 "Categorie Blok". Hier staan de categorieblokken die op de homepage worden getoond (Rode Wijn, Witte Wijn, Rosé, etc.).',
        screenshot: "/handleiding/categorie-blokken.webp",
        websiteScreenshot: "/handleiding/website-categorieen.webp",
        websiteCaption: "De categorieblokken op de homepage — Rode Wijn, Witte Wijn, Rosé etc. komen uit Shopify",
      },
      {
        title: "Categorie aanpassen",
        description:
          'Open een categorie om de naam of beschrijving te wijzigen.\n\nNaam — de titel van het blok\nBeschrijving — korte tekst onder de titel\nLink — waar het blok naartoe linkt (bijv. "/wijnen?type=red")\nIcoon type — bepaalt het icoon en de kleur (red, white, rose, sparkling, gift)\nVolgorde — de positie op de homepage',
        screenshot: "/handleiding/admin-categorie-blok-entry.webp",
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
          'Ga naar "Content" \u2192 "Metaobjects" \u2192 "Site Instellingen" en open de entry genaamd "main". Hier staan al je bedrijfsgegevens.',
        screenshot: "/handleiding/site-instellingen.webp",
      },
      {
        title: "Bedrijfsgegevens aanpassen",
        description:
          "De volgende gegevens verschijnen automatisch in de footer, op de contactpagina en in juridische teksten:\n\nBedrijfsnaam — \"Vino per Lei\"\nEigenaar — jouw naam\nE-mail — je e-mailadres\nStraat + huisnr — je adres\nPostcode en Plaats\nKvK-nummer en BTW-nummer\nOpeningstijden — voor de contactpagina\nSocial media URLs — Instagram, Facebook",
        screenshot: "/handleiding/admin-site-instellingen-entry.webp",
        websiteScreenshot: "/handleiding/website-footer.webp",
        websiteCaption: "De volledige footer met contactgegevens, KvK/BTW-info en betaalmethodes — alles wordt overgenomen uit deze instellingen",
        tip: "Controleer of je KvK-nummer en BTW-nummer correct zijn — deze verschijnen in de footer.",
      },
      {
        title: "Verzenddrempel & kosten",
        description:
          'De velden "Gratis verzending drempel" en "Verzendkosten" bepalen wanneer klanten gratis verzending krijgen en wat de standaard verzendkosten zijn.\n\nMomenteel: gratis vanaf \u20AC35, anders \u20AC4,95.',
        screenshot: "/handleiding/admin-site-instellingen.webp",
        websiteScreenshot: "/handleiding/website-verzending.webp",
        websiteCaption: "De verzendpagina toont automatisch de juiste drempel en kosten uit deze instellingen",
        tip: 'Pas je de drempel aan naar bijv. \u20AC50? Dan verandert dit automatisch overal op de website \u2014 in de winkelwagen, checkout, en de "Gratis verzending" teksten.',
      },
    ],
  },
  {
    id: "blog",
    icon: <PenLine className="w-5 h-5" />,
    title: "Blog schrijven",
    subtitle: "Nieuwe artikelen publiceren over wijn",
    color: "from-indigo-500/20 to-indigo-600/10",
    steps: [
      {
        title: "Blog overzicht",
        description:
          'Ga naar "Online Store" \u2192 "Blog Posts" in het linkermenu. Hier staan alle gepubliceerde en concept-artikelen.\n\nDe nieuwste 3 artikelen worden automatisch op de homepage getoond in het "Achter het etiket" blok. Daaronder staat de nieuwsbrief-aanmelding.',
        screenshot: "/handleiding/admin-blog-nieuw.webp",
        websiteScreenshot: "/handleiding/website-nieuwsbrief.webp",
        websiteCaption: "De blog en nieuwsbrief sectie op de website \u2014 artikelen en aanmeldformulier komen samen in beeld",
      },
      {
        title: "Nieuw artikel schrijven",
        description:
          'Klik op "Create blog post" en vul de velden in:\n\nTitle \u2014 een pakkende titel (bijv. "Barolo: de Koning der Wijnen")\nContent \u2014 schrijf je artikel in de teksteditor. Je kunt koppen, lijsten, afbeeldingen en links gebruiken.\nExcerpt \u2014 een korte samenvatting (1-2 zinnen, verschijnt op de homepage en blogpagina)\nFeatured Image \u2014 een mooie hoofdafbeelding\nTags \u2014 voeg tags toe (bijv. "piemonte", "wijnkennis") voor filtering\n\nZet de status op "Active" en klik op "Save" om te publiceren.',
        screenshot: "/handleiding/admin-blog-nieuw.webp",
        websiteScreenshot: "/handleiding/website-blog-pagina.webp",
        websiteCaption: "De blogpagina op de website — alle gepubliceerde artikelen met afbeelding en samenvatting",
        tip: "Een goede afbeelding maakt een artikel veel aantrekkelijker. Gebruik minimaal 1200x630px voor een scherpe weergave op alle apparaten.",
      },
    ],
  },
  {
    id: "juridisch",
    icon: <Scale className="w-5 h-5" />,
    title: "Juridische pagina's",
    subtitle: "Privacybeleid, Voorwaarden, Cookiebeleid en Over Ons aanpassen",
    color: "from-slate-500/20 to-slate-600/10",
    steps: [
      {
        title: "Overzicht van alle pagina's",
        description:
          'Ga naar "Online Store" \u2192 "Pages" in het linkermenu. De website leest de inhoud van de volgende pagina\'s uit Shopify:\n\nprivacybeleid \u2014 Privacybeleid (AVG/GDPR)\nalgemene-voorwaarden \u2014 Algemene Voorwaarden\ncookiebeleid \u2014 Cookiebeleid met cookietabel\nover-ons \u2014 Het verhaal van Vino per Lei\nverzending-levering \u2014 Informatie over verzending\nretourbeleid \u2014 Retourvoorwaarden\n\nAls een pagina nog niet bestaat, wordt er automatisch een standaardtekst getoond.',
        screenshot: "/handleiding/admin-paginas.webp",
        websiteScreenshot: "/handleiding/website-over-ons.webp",
        websiteCaption: "De Over Ons pagina — de tekst wordt uit Shopify Pages geladen",
        tip: "Je hoeft niet alle pagina's meteen aan te maken. De standaardteksten zijn juridisch correct en geschreven voor Vino per Lei.",
      },
      {
        title: "Een pagina aanmaken of bewerken",
        description:
          'Klik op "Add page" om een nieuwe pagina te maken, of klik op een bestaande pagina om deze te bewerken.\n\nBelangrijk: de \"handle\" (de URL-naam) moet exact overeenkomen met de naam hierboven. Je vindt de handle onder \"Search engine listing\" \u2192 \"URL and handle\" onderaan het formulier.\n\nSchrijf de inhoud in de rich text editor \u2014 je kunt koppen, alinea\'s, lijsten, links en afbeeldingen gebruiken. Klik op "Save" als je klaar bent.',
        screenshot: "/handleiding/admin-paginas.webp",
        websiteScreenshot: "/handleiding/website-voorwaarden.webp",
        websiteCaption: "Zo ziet een juridische pagina eruit op de website — de tekst wordt uit Shopify Pages geladen",
        tip: "Wijzigingen zijn binnen 1 uur zichtbaar op de website. Bij twijfel over juridische teksten: raadpleeg een jurist.",
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
          'Klik in het linker menu op "Orders". Je ziet een overzicht van alle bestellingen met:\n\n\u2022 Ordernummer en datum\n\u2022 Naam en adres van de klant\n\u2022 Betaalstatus (betaald/openstaand)\n\u2022 Verzendstatus (niet verzonden/verzonden/afgeleverd)\n\u2022 Totaalbedrag',
        screenshot: "/handleiding/admin-orders.webp",
      },
      {
        title: "Bestelling inzien en verzenden",
        description:
          "Klik op een bestelling om de details te bekijken. Je ziet welke producten zijn besteld, het afleveradres en de betaalstatus.\n\nWanneer je een bestelling hebt ingepakt en verzonden:\n1. Open de bestelling\n2. Klik op \"Fulfill items\" (of \"Verzenden\")\n3. Vul het Track & Trace nummer in (optioneel)\n4. Klik op \"Fulfill\" \u2014 de klant krijgt automatisch een e-mail",
        screenshot: "/handleiding/admin-bestellingen.webp",
        tip: "Je hoeft betalingen niet handmatig te verwerken. Die worden automatisch afgehandeld via de checkout.",
      },
    ],
  },
  {
    id: "verzending",
    icon: <Truck className="w-5 h-5" />,
    title: "Verzending instellen",
    subtitle: "Verzendmethoden en tarieven in Shopify",
    color: "from-sky-500/20 to-sky-600/10",
    steps: [
      {
        title: "Verzendtarieven in Shopify",
        description:
          'Ga naar "Settings" (tandwiel linksonder) \u2192 "Shipping and delivery". Hier kun je verzendtarieven en -zones instellen voor de checkout.\n\nDit zijn de tarieven die Shopify berekent bij het afrekenen. De website toont apart de gratis verzenddrempel en standaard verzendkosten die je instelt via Site Instellingen (zie die sectie hierboven).',
        screenshot: "/handleiding/admin-verzending.webp",
        websiteScreenshot: "/handleiding/website-verzending.webp",
        websiteCaption: "De verzendpagina op de website — bezoekers zien hier de verzendvoorwaarden en levertijden",
        tip: "Zorg dat de tarieven in Shopify Shipping overeenkomen met wat je instelt in Site Instellingen. Beide moeten hetzelfde bedrag en dezelfde gratis-drempel gebruiken.",
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
            {/* Wat je zelf kunt beheren */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-[var(--charcoal)] mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Wat je zelf kunt beheren via Shopify
              </h3>
              <ul className="space-y-2 ml-7">
                {[
                  "Producten: wijnen toevoegen, prijzen en voorraad aanpassen, foto's uploaden",
                  "Homepage: hero-tekst, announcement bar, USP-punten, categorieblokken",
                  "Klantervaringen: reviews toevoegen, bewerken en verwijderen",
                  "Homepage cijfers: statistieken zoals aantal wijnen en producenten",
                  "Blog: artikelen schrijven en publiceren",
                  "FAQ: veelgestelde vragen toevoegen en categoriseren",
                  "Bedrijfsgegevens: e-mail, adres, KvK, BTW, openingstijden",
                  "Verzendkosten: gratis verzenddrempel en standaard tarief",
                  "Juridische pagina's: privacybeleid, voorwaarden, cookiebeleid",
                  "Over Ons pagina: jouw verhaal in eigen woorden",
                  "Bestellingen: orders inzien, verzenden en track & trace toevoegen",
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
                  "Domeinnaam vinoperlei.nl koppelen aan de website",
                  "E-mail instellen via het domein (bijv. info@vinoperlei.nl)",
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
                    title: "1. Shopify Partners account aanmaken en koppelen",
                    description: "Dit is de eerste stap om toegang te krijgen tot het beheerpaneel. Maak een gratis account aan op partners.shopify.com en koppel het aan de webshop (vino-per-lei-2.myshopify.com) — zie de sectie \"Toegang tot Shopify\" hierboven voor uitgebreide stap-voor-stap uitleg.",
                  },
                  {
                    title: "2. Domeinnaam vinoperlei.nl",
                    description: "Is deze al geregistreerd? Dan hebben we de inloggegevens van je domeinprovider nodig om de website te koppelen.",
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
