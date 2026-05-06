import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!storeDomain || !adminToken) {
  throw new Error("Missing Shopify admin environment variables.");
}

const entries = [
  ["global.skip_to_content", "Ga naar inhoud", "global", "Skip link voor toetsenbordnavigatie"],
  ["common.item_singular", "artikel", "global", "Enkelvoud voor winkelmandtelling"],
  ["common.item_plural", "artikelen", "global", "Meervoud voor winkelmandtelling"],
  ["common.loading", "Laden...", "global", "Algemene laadtekst"],
  ["common.close", "Sluiten", "global", "Algemene sluittekst"],
  ["common.previous", "Vorige", "global", "Algemene vorige-knop"],
  ["common.next", "Volgende", "global", "Algemene volgende-knop"],
  ["common.save", "Opslaan", "global", "Algemene opslaanknop"],
  ["common.cancel", "Annuleren", "global", "Algemene annuleerknop"],
  ["site.name", "Vino per Lei", "global", "Websitenaam"],

  ["header.announcement.close", "Sluit melding", "header", "Aria-label voor de melding sluiten"],
  ["header.menu.open", "Open navigatiemenu", "header", "Aria-label voor mobiel menu openen"],
  ["header.menu.close", "Sluit navigatiemenu", "header", "Aria-label voor mobiel menu sluiten"],
  ["header.menu.dialog_label", "Navigatie menu", "header", "Aria-label voor mobiel navigatiedialoog"],
  ["header.search.label", "Zoeken", "header", "Zoekknop en aria-label"],
  ["header.search.placeholder", "Zoek wijnen...", "header", "Placeholder in zoekveld"],
  ["header.account.label", "Mijn account", "header", "Accountlink voor ingelogde klanten"],
  ["header.auth.label", "Inloggen of registreren", "header", "Login-knop voor gasten"],
  ["header.auth.mobile_label", "Inloggen / Registreren", "header", "Mobiele login-knop voor gasten"],
  ["header.cart.empty", "Winkelmand, leeg", "header", "Aria-label voor lege winkelmand"],
  ["header.cart.with_count", "Winkelmand, {count} {itemLabel}", "header", "Aria-label voor winkelmand met artikelen"],
  ["header.contact.label", "Contact", "header", "Mobiel contactlabel"],

  ["footer.social.follow_on", "Volg ons op {platform}", "footer", "Aria-label voor social links"],
  ["footer.social.instagram", "Instagram", "footer", "Naam van het Instagram-platform"],
  ["footer.social.facebook", "Facebook", "footer", "Naam van het Facebook-platform"],
  ["footer.legal.kvk_prefix", "KvK:", "footer", "Prefix voor KvK-nummer"],
  ["footer.legal.btw_prefix", "BTW:", "footer", "Prefix voor BTW-nummer"],
  ["footer.cookie_settings", "Cookie-instellingen", "footer", "Knop om cookievoorkeuren te openen"],

  ["product.wishlist.login_required", "Log in om je verlanglijst te gebruiken", "product", "Loginmelding voor verlanglijst"],
  ["product.price.per_bottle", "per fles", "product", "Prijseenheid voor flessen"],
  ["product.stock.in_stock", "Op voorraad", "product", "Voorraadlabel beschikbaar"],
  ["product.stock.out_of_stock", "Uitverkocht", "product", "Voorraadlabel niet beschikbaar"],
  ["product.savings", "Bespaar EUR {amount}", "product", "Besparingslabel"],
  ["product.add_to_cart", "Toevoegen", "product", "Add-to-cart knop"],
  ["product.add_to_cart_short", "+ Winkelmand", "product", "Compacte add-to-cart knop"],
  ["product.add_to_cart_full", "Toevoegen aan winkelmand", "product", "Volledige add-to-cart knop"],
  ["product.in_cart", "In Winkelmand", "product", "Status na toevoegen"],
  ["product.added", "Toegevoegd", "product", "Status direct na toevoegen"],
  ["product.added_exclamation", "Toegevoegd!", "product", "Status direct na toevoegen met uitroepteken"],
  ["product.view", "Bekijk", "product", "Quickview knop op productkaart"],
  ["product.view_aria", "Bekijk {title}", "product", "Aria-label voor productlink"],
  ["product.full_details", "Bekijk alle details ->", "product", "Link naar volledige productdetails"],
  ["product.notify_stock", "Mail bij voorraad", "product", "Knop bij uitverkocht product"],
  ["product.notify_stock_full", "Mail mij bij voorraad", "product", "Knop bij uitverkocht product in quickview"],
  ["product.order.per_unit", "Bestellen per {unit}", "product", "Orderregel onder productkaart"],
  ["product.order.per_prefix", "Per", "product", "Prefix voor besteleenheid"],
  ["product.quick_view.aria", "Snel bekijken: {title}", "product", "Aria-label voor quickview"],
  ["product.viewer_count", "{count} mensen bekijken dit nu", "product", "Social proof in quickview"],
  ["product.total", "Totaal", "product", "Totaallabel in product UI"],
  ["product.secure_payment", "Veilig betalen", "product", "Trust signal"],
  ["product.delivery.desktop", "1-2 werkdagen", "product", "Desktop leveringsbelofte"],
  ["product.delivery.mobile", "1-2 dagen", "product", "Mobiele leveringsbelofte"],
  ["product.allergen_info", "Allergeninformatie", "product", "Allergeenlabel"],
  ["product.all_details", "Alle Details", "product", "Titel boven alle details"],
  ["product.curated_by", "Persoonlijk geselecteerd door Carla", "product", "Curatiebadge producthero"],
  ["product.image.zoom_hint", "Klik om in te zoomen", "product", "Zoomhint productafbeelding"],
  ["product.image.previous", "Vorige afbeelding", "product", "Vorige afbeelding aria-label"],
  ["product.image.next", "Volgende afbeelding", "product", "Volgende afbeelding aria-label"],
  ["product.reviews", "reviews", "product", "Reviewlabel meervoud"],
  ["product.not_found.title", "Product niet gevonden", "product", "Product niet gevonden titel"],
  ["product.not_found.meta_title", "Product niet gevonden | Vino per Lei", "product", "Product niet gevonden metatitel"],
  ["product.not_found.body", "De wijn die je zoekt bestaat niet of is niet meer beschikbaar.", "product", "Product niet gevonden tekst"],
  ["product.not_found.back_to_wines", "Bekijk alle wijnen", "product", "Product niet gevonden teruglink"],
  ["product.meta.title", "{title} | {wineType} | Vino per Lei", "product", "Product metatitel"],
  ["product.meta.description", "{title} - {wineType} uit {region}, {country}. {grapes}. Bestel nu bij Vino per Lei.", "product", "Product metadata omschrijving"],
  ["product.related.title", "Ook interessant", "product", "Titel gerelateerde producten"],
  ["product.related.more_red", "Meer rode wijnen", "product", "Subtitle gerelateerde rode wijnen"],
  ["product.related.more_white", "Meer witte wijnen", "product", "Subtitle gerelateerde witte wijnen"],
  ["product.related.more_default", "Meer wijnen", "product", "Subtitle gerelateerde wijnen"],
  ["product.carousel.previous", "Vorige producten", "product", "Carousel vorige producten"],
  ["product.carousel.next", "Volgende producten", "product", "Carousel volgende producten"],
  ["product.pairing.title", "Lekker bij", "product", "Titel food pairing"],
  ["product.pairing.serving_advice_title", "Serveeradvies", "product", "Titel serveeradvies zonder pairing"],
  ["product.pairing.subtitle", "Wat zet je erbij op tafel?", "product", "Subtitle food pairing"],
  ["product.badge.new", "Nieuw", "product", "Badge nieuw"],
  ["product.badge.sale", "Sale", "product", "Badge sale"],
  ["product.badge.soldout", "Uitverkocht", "product", "Badge uitverkocht"],
  ["product.badge.low_stock", "Nog {count} {unit}", "product", "Badge lage voorraad"],
  ["product.badge.award", "Award", "product", "Fallback awardbadge"],
  ["product.unit.bottle_singular", "fles", "product", "Enkelvoud fles"],
  ["product.unit.bottle_plural", "flessen", "product", "Meervoud fles"],
  ["product.wishlist.add", "Toevoegen aan verlanglijst", "product", "Aria-label verlanglijst toevoegen"],
  ["product.wishlist.remove", "Verwijder uit verlanglijst", "product", "Aria-label verlanglijst verwijderen"],
  ["product.wishlist.in", "In Verlanglijst", "product", "Status verlanglijst"],
  ["product.wishlist.label", "Verlanglijst", "product", "Knoplabel verlanglijst"],
  ["product.wine_type.red", "Rood", "product", "Wijntype rood"],
  ["product.wine_type.white", "Wit", "product", "Wijntype wit"],
  ["product.wine_type.rose", "Rose", "product", "Wijntype rose"],
  ["product.wine_type.sparkling", "Bubbels", "product", "Wijntype mousserend"],
  ["product.wine_type.red_full", "Rode wijn", "product", "Volledig wijntype rood"],
  ["product.wine_type.white_full", "Witte wijn", "product", "Volledig wijntype wit"],
  ["product.wine_type.rose_full", "Rose", "product", "Volledig wijntype rose"],
  ["product.wine_type.sparkling_full", "Mousserende wijn", "product", "Volledig wijntype mousserend"],
  ["product.wine_type.default", "Wijn", "product", "Fallback wijntype"],
  ["product.quantity.label", "Aantal", "product", "Aantalveldlabel"],
  ["product.serving_temperature.title", "Serveertemperatuur", "product", "PDP kaarttitel serveertemperatuur"],
  ["product.serving_temperature.subtitle", "Op basis van wijntype", "product", "PDP kaartsubtitel serveertemperatuur"],
  ["product.decant.title", "Decanteren", "product", "PDP kaarttitel decanteren"],
  ["product.decant.subtitle", "Voor het beste resultaat", "product", "PDP kaartsubtitel decanteren"],
  ["product.alcohol_percentage.label", "Alcoholpercentage", "product", "PDP specificatielabel alcohol"],
  ["product.alcohol_percentage.see_label", "Zie etiket", "product", "PDP alcohol fallbackwaarde uit Shopify-copy"],
  ["product.bottle_volume.label", "Inhoud", "product", "PDP specificatielabel inhoud"],
  ["product.wine_style.label", "Wijnstijl", "product", "PDP specificatielabel wijnstijl"],
  ["product.closure.label", "Sluiting", "product", "PDP specificatielabel sluiting"],
  ["product.allergens.label", "Allergenen", "product", "PDP specificatielabel allergenen"],
  ["product.vinification.title", "Vinificatie", "product", "PDP accordiontitel vinificatie"],
  ["product.storage.title", "Opslag & Drinkadvies", "product", "PDP accordiontitel opslag"],
  ["product.producer.title", "Producent", "product", "PDP accordiontitel producent"],
  ["product.info.coming_soon.vinification", "Informatie over het vinificatieproces volgt binnenkort.", "product", "PDP lege staat vinificatie"],
  ["product.info.coming_soon.producer", "Informatie over de producent volgt binnenkort.", "product", "PDP lege staat producent"],
  ["product.details.title", "Technische Details", "product", "PDP accordion technische details"],
  ["product.details.grape", "Druivenras", "product", "PDP detaillabel druivenras"],
  ["product.details.country", "Land", "product", "PDP detaillabel land"],
  ["product.details.region", "Regio", "product", "PDP detaillabel regio"],
  ["product.details.vintage", "Jaargang", "product", "PDP detaillabel jaargang"],
  ["product.details.non_vintage", "Non-Vintage", "product", "PDP waarde non-vintage"],
  ["product.details.vintage_code_non_vintage", "NV", "product", "Technische jaargangcode voor non-vintage"],
  ["product.storage.keep", "Bewaren", "product", "PDP subtitel bewaren"],

  ["collection.search.placeholder", "Zoek op naam, druif of regio...", "collection", "Zoekplaceholder op wijncollectie"],
  ["collection.search.placeholder_full", "Zoek op wijn, regio of druivenras...", "collection", "Zoekplaceholder op wijncollectie"],
  ["collection.search.label", "Zoek wijnen", "collection", "Aria-label zoekveld"],
  ["collection.search.clear", "Wis zoekopdracht", "collection", "Aria-label zoekopdracht wissen"],
  ["collection.filter.label", "Filter", "collection", "Filterlabel"],
  ["collection.filters.label", "Filters", "collection", "Filters-knop"],
  ["collection.filters.clear_all", "Wis alle filters", "collection", "Alle filters wissen"],
  ["collection.filter.group.region", "Regio", "collection", "Filtergroep regio"],
  ["collection.filter.group.wine_type", "Wijntype", "collection", "Filtergroep wijntype"],
  ["collection.filter.group.grape", "Druivenras", "collection", "Filtergroep druivenras"],
  ["collection.filter.group.price", "Prijs", "collection", "Filtergroep prijs"],
  ["collection.filter.group.alcohol", "Alcoholpercentage", "collection", "Filtergroep alcohol"],
  ["collection.sort.label", "Sorteer", "collection", "Sorteerlabel"],
  ["collection.sort.popular", "Populair", "collection", "Sorteeroptie populair"],
  ["collection.sort.price_asc", "Prijs laag-hoog", "collection", "Sorteeroptie prijs oplopend"],
  ["collection.sort.price_desc", "Prijs hoog-laag", "collection", "Sorteeroptie prijs aflopend"],
  ["collection.sort.newest", "Nieuwste", "collection", "Sorteeroptie nieuwste"],
  ["collection.sort.name_asc", "Naam A-Z", "collection", "Sorteeroptie naam"],
  ["collection.sort.rating", "Best beoordeeld", "collection", "Sorteeroptie rating"],
  ["collection.filter.all", "Alle", "collection", "Alles-optie in filters"],
  ["collection.empty.title", "Geen wijnen gevonden", "collection", "Lege staat titel"],
  ["collection.empty.description", "Probeer andere filters of bekijk al onze wijnen.", "collection", "Lege staat tekst"],
  ["collection.breadcrumb.home", "Home", "collection", "Breadcrumb home"],
  ["collection.breadcrumb.wines", "Wijnen", "collection", "Breadcrumb wijnen"],
  ["collection.heading.default", "Onze Wijnen", "collection", "Standaard collectietitel"],
  ["collection.meta.title", "Onze Wijnen | Vino per Lei", "collection", "Collectie metatitel"],
  ["collection.meta.description", "Italiaanse wijnen uit {regions}. Filter op regio, druif of prijs. Rechtstreeks van familieproducenten.", "collection", "Collectie metaomschrijving"],
  ["collection.meta.og_description", "Italiaanse wijnen rechtstreeks van familieproducenten. Filter op regio, druif of prijs.", "collection", "Collectie Open Graph omschrijving"],
  ["collection.heading.region", "Wijnen uit {region}", "collection", "Regio collectietitel"],
  ["collection.summary.region", "{count} wijnen uit {region}, rechtstreeks van de producent.", "collection", "Regio collectiesamenvatting"],
  ["collection.summary.default", "{count} wijnen uit {regions}. Allemaal persoonlijk geselecteerd en rechtstreeks geimporteerd.", "collection", "Standaard collectiesamenvatting"],
  ["collection.region.default_country", "Italie", "collection", "Landfallback voor collectie"],
  ["collection.region.joiner", " en ", "collection", "Voegwoord tussen regio's"],
  ["collection.results.wines", "wijnen", "collection", "Resultaatlabel wijnen"],
  ["collection.view.grid", "Grid weergave", "collection", "Aria-label gridweergave"],
  ["collection.view.list", "Lijst weergave", "collection", "Aria-label lijstweergave"],
  ["collection.pagination.summary", "Toont {shown} van {total} wijnen", "collection", "Paginatiesamenvatting"],
  ["collection.seo.title", "Authentieke Italiaanse Wijnen", "collection", "SEO-sectie titel collectie"],
  ["collection.seo.body", "Bij Vino per Lei selecteren we elke wijn met persoonlijke proefingen en expertise. Onze collectie bestaat uitsluitend uit echte Italiaanse wijnen van gerenommeerde familiewijngaarden. Van karaktervolle Barbera uit Piemonte tot elegante Valpolicella uit Veneto - wij brengen het beste van Italie naar jouw tafel.", "collection", "SEO-sectie body collectie"],
  ["collection.loading", "Laden...", "collection", "Laadtekst collectie"],
  ["collection.price.15_20", "EUR 15 - EUR 20", "collection", "Prijsvork 15 tot 20"],
  ["collection.price.20_30", "EUR 20 - EUR 30", "collection", "Prijsvork 20 tot 30"],
  ["collection.price.30_50", "EUR 30 - EUR 50", "collection", "Prijsvork 30 tot 50"],
  ["collection.price.50_plus", "EUR 50+", "collection", "Prijsvork 50 plus"],
  ["collection.alcohol.light", "Licht (< 12%)", "collection", "Alcoholfilter licht"],
  ["collection.alcohol.medium", "Medium (12-14%)", "collection", "Alcoholfilter medium"],
  ["collection.alcohol.full", "Vol (14%+)", "collection", "Alcoholfilter vol"],

  ["home.org.description", "Italiaanse wijnen uit Piemonte, Veneto en Toscane. Rechtstreeks van familiewijngaarden, persoonlijk geselecteerd door Carla Daniels.", "home", "Structured data omschrijving homepage"],
  ["home.featured.eyebrow", "Onze selectie", "home", "Eyebrow bij uitgelichte producten"],
  ["home.featured.title", "Onze Favorieten", "home", "Titel uitgelichte producten"],
  ["home.featured.subtitle", "Persoonlijk geselecteerd door Carla.", "home", "Subtitle uitgelichte producten"],
  ["home.featured.view_all", "Alle wijnen", "home", "Link naar collectie vanuit homepage"],
  ["home.regions.count_singular", "Een wijngebied", "home", "Enkelvoud regio-aantal op homepage"],
  ["home.regions.count_plural", "{count} wijngebieden", "home", "Meervoud regio-aantal op homepage"],
  ["home.regions.title_line_1", "Rechtstreeks", "home", "Regiosectie titel regel 1"],
  ["home.regions.title_line_2", "uit Italie", "home", "Regiosectie titel regel 2"],
  ["home.regions.body", "Elke wijn komt rechtstreeks van de producent. Ontdek de regio's waar onze wijnen vandaan komen.", "home", "Regiosectie tekst"],

  ["blog.meta.title", "Blog - Wijn Verhalen | Vino per Lei", "blog", "Blog metatitel"],
  ["blog.meta.description", "Verhalen over Italiaanse wijnen, wijnboeren, regio's, druivenrassen en food pairing tips.", "blog", "Blog metaomschrijving"],
  ["blog.eyebrow", "Journal", "blog", "Blog hero eyebrow"],
  ["blog.title", "Wijn Verhalen", "blog", "Blog paginatitel"],
  ["blog.intro", "Verhalen over Italiaanse wijnen, wijnboeren en de mooiste regio's.", "blog", "Blog introductietekst"],
  ["blog.article_singular", "verhaal", "blog", "Blog artikeltelling enkelvoud"],
  ["blog.article_plural", "verhalen", "blog", "Blog artikeltelling meervoud"],
  ["blog.article_count", "{count} {label}", "blog", "Blog artikeltelling format"],
  ["blog.categories", "Categorieen", "blog", "Blog categorietitel"],
  ["blog.single_filtered", "Dit was het enige artikel voor \"{tag}\".", "blog", "Blog melding bij een gefilterd artikel"],
  ["blog.more_soon", "Meer verhalen volgen binnenkort!", "blog", "Blog melding bij een artikel"],
  ["blog.footer.home", "Homepage", "blog", "Blog footer link homepage"],
  ["blog.footer.wines", "Onze wijnen", "blog", "Blog footer link collectie"],
  ["blog.featured", "Uitgelicht", "blog", "Blog uitgelicht label"],
  ["blog.reading_time", "{minutes} min leestijd", "blog", "Blog leestijd label"],
  ["blog.read_story", "Lees het verhaal", "blog", "Blog artikel CTA"],
  ["blog.read_short", "Lees", "blog", "Blog korte artikel CTA"],
  ["blog.newsletter.label", "Newsletter", "blog", "Blog nieuwsbrief label"],
  ["blog.newsletter.title", "Mis geen enkel verhaal", "blog", "Blog nieuwsbrief titel"],
  ["blog.newsletter.body", "Wijnverhalen, tips en exclusieve aanbiedingen. Maximaal 2x per maand, altijd opzegbaar.", "blog", "Blog nieuwsbrief tekst"],
  ["blog.load_more.aria", "Meer verhalen laden, {count} resterend", "blog", "Blog meer laden aria-label"],
  ["blog.load_more.label", "Meer verhalen", "blog", "Blog meer laden knop"],
  ["blog.load_more.remaining", "{count} resterend", "blog", "Blog meer laden resterend label"],
  ["blog.empty.filtered_title", "Geen artikelen gevonden", "blog", "Blog lege staat gefilterd titel"],
  ["blog.empty.default_title", "Binnenkort meer verhalen", "blog", "Blog lege staat titel"],
  ["blog.empty.filtered_body", "Er zijn nog geen verhalen voor \"{tag}\". Probeer een andere categorie.", "blog", "Blog lege staat gefilterd tekst"],
  ["blog.empty.default_body", "We werken aan mooie verhalen over Italiaanse wijnen. Kom snel terug!", "blog", "Blog lege staat tekst"],
  ["blog.empty.view_all", "Bekijk alle verhalen", "blog", "Blog lege staat link"],
  ["blog.empty.tagline", "In vino veritas", "blog", "Blog lege staat tagline"],
  ["blog.breadcrumb", "Blog", "blog", "Blog breadcrumb label"],
  ["blog.categories_aria", "Artikelcategorieen", "blog", "Blog categorie navigatie aria-label"],
  ["blog.filter_aria", "Filter op categorie", "blog", "Blog categorie filter aria-label"],
  ["blog.filter_button_aria", "Filter: {label}", "blog", "Blog categorieknop aria-label"],
  ["blog.all_articles", "Alle artikelen", "blog", "Blog alle artikelen filterlabel"],
  ["blog.bottom_newsletter.body", "Ontvang onze nieuwste wijnverhalen, tips en exclusieve aanbiedingen rechtstreeks in je inbox.", "blog", "Blog onderste nieuwsbrieftekst"],
  ["blog.reading_progress", "Leesvoortgang", "blog", "Blog leesvoortgang aria-label"],
  ["blog.reading_remaining", "{minutes} min resterend", "blog", "Blog resterende leestijd"],
  ["blog.newsletter.welcome", "Welkom!", "blog", "Blog nieuwsbrief succeslabel"],
  ["blog.scroll_top", "Scroll naar boven", "blog", "Blog scroll naar boven aria-label"],
  ["blog.share.text", "{title} - {site}", "blog", "Blog deeltekst"],
  ["blog.share.article", "Artikel delen", "blog", "Blog sharebar aria-label"],
  ["blog.share.label", "Delen", "blog", "Blog share label"],
  ["blog.share.whatsapp", "Deel via WhatsApp", "blog", "Blog share WhatsApp aria-label"],
  ["blog.share.facebook", "Deel op Facebook", "blog", "Blog share Facebook aria-label"],
  ["blog.share.x", "Deel op X", "blog", "Blog share X aria-label"],
  ["blog.share.email", "Deel via e-mail", "blog", "Blog share e-mail aria-label"],
  ["blog.share.copy", "Kopieer link", "blog", "Blog share kopieerlabel"],
  ["blog.share.copied", "Gekopieerd!", "blog", "Blog share gekopieerdlabel"],
  ["blog.share.copied_short", "Gekopieerd", "blog", "Blog share kort gekopieerdlabel"],
  ["blog.share.mobile_whatsapp", "WhatsApp", "blog", "Blog mobiele share WhatsApp label"],
  ["blog.share.mobile_facebook", "Facebook", "blog", "Blog mobiele share Facebook label"],
  ["blog.share.mobile_email", "E-mail", "blog", "Blog mobiele share e-maillabel"],
  ["blog.article.not_found_meta", "Artikel niet gevonden | Vino per Lei", "blog", "Blog artikel niet gevonden metadata"],
  ["blog.article.meta_title", "{title} | {site}", "blog", "Blog artikel metatitel fallback"],
  ["blog.article.reading_time_short", "{minutes} min", "blog", "Blog artikel korte leestijd"],
  ["blog.article.back_aria", "Terug naar blog", "blog", "Blog artikel teruglink aria-label"],
  ["blog.article.all_stories", "Alle verhalen", "blog", "Blog artikel alle verhalen label"],
  ["blog.article.reading_time_aria", "{minutes} minuten leestijd", "blog", "Blog artikel leestijd aria-label"],
  ["blog.article.newsletter.title", "Wijn Verhalen in je Inbox", "blog", "Blog artikel nieuwsbrief titel"],
  ["blog.article.newsletter.body", "Onze mooiste verhalen over Italiaanse wijnen en wijnmakers. Maximaal 2x per maand.", "blog", "Blog artikel nieuwsbrief tekst"],
  ["blog.article.toc", "Inhoudsopgave", "blog", "Blog artikel inhoudsopgave aria-label"],
  ["blog.article.image_zoom", "Afbeelding vergroten", "blog", "Blog artikel lightbox aria-label"],
  ["blog.article.author_label", "Geschreven door", "blog", "Blog artikel auteur label"],
  ["blog.article.related_aria", "Gerelateerde artikelen", "blog", "Blog artikel gerelateerde artikelen aria-label"],
  ["blog.article.related_title", "Lees ook", "blog", "Blog artikel gerelateerde artikelen titel"],
  ["blog.article.navigation_aria", "Artikelnavigatie", "blog", "Blog artikel navigatie aria-label"],
  ["blog.article.view_wines", "Bekijk onze wijnen", "blog", "Blog artikel wijnencollectielink"],

  ["cart.title", "Winkelmand", "cart", "Titel winkelmand"],
  ["cart.empty.title", "Je winkelmand is leeg", "cart", "Lege winkelmand titel"],
  ["cart.checkout", "Afrekenen", "cart", "Checkoutknop"],
  ["cart.remove", "Verwijder", "cart", "Verwijderknop"],
  ["cart.subtotal", "Subtotaal", "cart", "Subtotaallabel"],
  ["cart.shipping", "Verzending", "cart", "Verzendlabel"],
  ["cart.total", "Totaal", "cart", "Totaallabel"],

  ["cookie.title", "Cookie-instellingen", "cookie", "Titel cookiemelding"],
  ["cookie.accept", "Accepteren", "cookie", "Cookie accepteren"],
  ["cookie.reject", "Weigeren", "cookie", "Cookie weigeren"],
  ["cookie.preferences", "Instellingen", "cookie", "Cookie voorkeuren"],
  ["cookie.necessary", "Noodzakelijk", "cookie", "Cookie categorie noodzakelijk"],
  ["cookie.analytics", "Analytics", "cookie", "Cookie categorie analytics"],
  ["cookie.marketing", "Marketing", "cookie", "Cookie categorie marketing"],

  ["auth.email", "E-mailadres", "auth", "Loginveld e-mail"],
  ["auth.password", "Wachtwoord", "auth", "Loginveld wachtwoord"],
  ["auth.login", "Inloggen", "auth", "Loginactie"],
  ["auth.register", "Registreren", "auth", "Registratieactie"],

  ["faq.meta.title", "Veelgestelde Vragen | Vino per Lei", "faq", "FAQ metatitel"],
  ["faq.meta.description", "Antwoorden op veelgestelde vragen over bestellen, betalen, verzenden en retourneren bij Vino per Lei.", "faq", "FAQ metaomschrijving"],
  ["faq.breadcrumb.service", "Klantenservice", "faq", "FAQ breadcrumb klantenservice"],
  ["faq.title", "Veelgestelde Vragen", "faq", "FAQ titel"],
  ["faq.intro.prefix", "Vind snel antwoord op je vraag. Staat je vraag er niet bij?", "faq", "FAQ intro voor contactlink"],
  ["faq.contact_link", "Neem contact op", "faq", "FAQ contactlink"],
  ["faq.search.placeholder", "Zoek een vraag...", "faq", "FAQ zoekplaceholder"],
  ["faq.filter.all", "Alle", "faq", "FAQ alle filter"],
  ["faq.results.singular", "resultaat", "faq", "FAQ resultaat enkelvoud"],
  ["faq.results.plural", "resultaten", "faq", "FAQ resultaat meervoud"],
  ["faq.results.found", "{count} {resultLabel} gevonden", "faq", "FAQ resultaatregel"],
  ["faq.results.in_category", "in \"{category}\"", "faq", "FAQ resultaatcategorie"],
  ["faq.empty.title", "Geen resultaten gevonden", "faq", "FAQ lege staat titel"],
  ["faq.empty.description", "Probeer een andere zoekterm of", "faq", "FAQ lege staat tekst"],
  ["faq.cta.title", "Vraag niet gevonden?", "faq", "FAQ CTA titel"],
  ["faq.cta.body", "Carla helpt je persoonlijk verder.", "faq", "FAQ CTA tekst"],
  ["faq.cta.button", "Stuur Carla een bericht", "faq", "FAQ CTA knop"],
  ["faq.back_to_service", "Terug naar Klantenservice", "faq", "FAQ teruglink"],
];

function handleForKey(key) {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 250);
}

async function adminGraphql(query, variables = {}) {
  const response = await fetch(`https://${storeDomain}/admin/api/2026-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function ensureDefinition() {
  const existing = await adminGraphql(
    `query MetaobjectDefinition($type: String!) {
      metaobjectDefinitionByType(type: $type) { id type }
    }`,
    { type: "ui_copy" }
  );

  if (existing.metaobjectDefinitionByType) return;

  const created = await adminGraphql(
    `mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition { id type }
        userErrors { field message code }
      }
    }`,
    {
      definition: {
        name: "UI copy",
        type: "ui_copy",
        access: { storefront: "PUBLIC_READ" },
        fieldDefinitions: [
          { key: "key", name: "Sleutel", type: "single_line_text_field", required: true },
          { key: "value", name: "Waarde", type: "multi_line_text_field", required: false },
          { key: "group", name: "Groep", type: "single_line_text_field", required: false },
          { key: "description", name: "Omschrijving", type: "single_line_text_field", required: false },
        ],
      },
    }
  );

  const errors = created.metaobjectDefinitionCreate.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
}

async function getExistingMetaobjects() {
  const data = await adminGraphql(
    `query UiCopyMetaobjects($type: String!) {
      metaobjects(type: $type, first: 250) {
        nodes { id handle fields { key value } }
      }
    }`,
    { type: "ui_copy" }
  );

  return data.metaobjects.nodes;
}

function fieldsFor([key, value, group, description]) {
  return [
    { key: "key", value: key },
    { key: "value", value },
    { key: "group", value: group },
    { key: "description", value: description },
  ];
}

async function createMetaobject(entry) {
  const data = await adminGraphql(
    `mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id handle }
        userErrors { field message code }
      }
    }`,
    {
      metaobject: {
        type: "ui_copy",
        handle: handleForKey(entry[0]),
        fields: fieldsFor(entry),
      },
    }
  );

  const errors = data.metaobjectCreate.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
}

async function updateMetaobject(id, entry) {
  const data = await adminGraphql(
    `mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
      metaobjectUpdate(id: $id, metaobject: $metaobject) {
        metaobject { id handle }
        userErrors { field message code }
      }
    }`,
    { id, metaobject: { fields: fieldsFor(entry) } }
  );

  const errors = data.metaobjectUpdate.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
}

await ensureDefinition();

const existing = await getExistingMetaobjects();
const byHandle = new Map(existing.map((node) => [node.handle, node]));

let created = 0;
let updated = 0;

for (const entry of entries) {
  const handle = handleForKey(entry[0]);
  const current = byHandle.get(handle);
  if (current) {
    await updateMetaobject(current.id, entry);
    updated += 1;
  } else {
    await createMetaobject(entry);
    created += 1;
  }
}

console.log(`UI copy synced: ${created} created, ${updated} updated.`);
