/**
 * Setup script: Creates all metaobject definitions, seeds initial content,
 * creates Shopify Pages, and Blog articles.
 *
 * Run with: npx tsx scripts/setup-shopify-cms.ts
 *
 * Requires SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const API_VERSION = '2025-01';
const ADMIN_URL = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

async function adminQuery(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2));
  }
  return json;
}

// ============================================================
// 1. METAOBJECT DEFINITIONS
// ============================================================

const metaobjectDefinitions = [
  {
    type: 'site_settings',
    name: 'Site Instellingen',
    fieldDefinitions: [
      { key: 'company_name', name: 'Bedrijfsnaam', type: 'single_line_text_field' },
      { key: 'owner_name', name: 'Eigenaar', type: 'single_line_text_field' },
      { key: 'phone', name: 'Telefoon', type: 'single_line_text_field' },
      { key: 'email', name: 'E-mail', type: 'single_line_text_field' },
      { key: 'address_street', name: 'Straat + huisnr', type: 'single_line_text_field' },
      { key: 'address_postal', name: 'Postcode', type: 'single_line_text_field' },
      { key: 'address_city', name: 'Plaats', type: 'single_line_text_field' },
      { key: 'kvk', name: 'KvK-nummer', type: 'single_line_text_field' },
      { key: 'btw', name: 'BTW-nummer', type: 'single_line_text_field' },
      { key: 'instagram_url', name: 'Instagram URL', type: 'single_line_text_field' },
      { key: 'facebook_url', name: 'Facebook URL', type: 'single_line_text_field' },
      { key: 'pinterest_url', name: 'Pinterest URL', type: 'single_line_text_field' },
      { key: 'hours_weekday', name: 'Openingstijden Ma-Vr', type: 'single_line_text_field' },
      { key: 'hours_saturday', name: 'Openingstijden Za', type: 'single_line_text_field' },
      { key: 'hours_sunday', name: 'Openingstijden Zo', type: 'single_line_text_field' },
      { key: 'gratis_verzending_drempel', name: 'Gratis verzending drempel', type: 'number_decimal' },
      { key: 'verzendkosten', name: 'Verzendkosten', type: 'number_decimal' },
    ],
  },
  {
    type: 'homepage_hero',
    name: 'Homepage Hero',
    fieldDefinitions: [
      { key: 'subtitle', name: 'Subtitel (boven titel)', type: 'single_line_text_field' },
      { key: 'title_line_1', name: 'Titel regel 1', type: 'single_line_text_field' },
      { key: 'title_line_2', name: 'Titel regel 2 (goud)', type: 'single_line_text_field' },
      { key: 'description', name: 'Beschrijving', type: 'multi_line_text_field' },
      { key: 'cta_primary_text', name: 'Primaire knop tekst', type: 'single_line_text_field' },
      { key: 'cta_primary_link', name: 'Primaire knop link', type: 'single_line_text_field' },
      { key: 'cta_secondary_text', name: 'Secundaire knop tekst', type: 'single_line_text_field' },
      { key: 'cta_secondary_link', name: 'Secundaire knop link', type: 'single_line_text_field' },
    ],
  },
  {
    type: 'announcement_bar',
    name: 'Announcement Bar',
    fieldDefinitions: [
      { key: 'message', name: 'Bericht', type: 'single_line_text_field' },
      { key: 'enabled', name: 'Actief', type: 'boolean' },
      { key: 'link', name: 'Link (optioneel)', type: 'single_line_text_field' },
    ],
  },
  {
    type: 'usp_item',
    name: 'USP Item',
    fieldDefinitions: [
      { key: 'title', name: 'Titel', type: 'single_line_text_field' },
      { key: 'subtitle', name: 'Subtitel', type: 'single_line_text_field' },
      { key: 'icon_name', name: 'Icoon (truck/refresh/star/shield)', type: 'single_line_text_field' },
      { key: 'sort_order', name: 'Volgorde', type: 'number_integer' },
    ],
  },
  {
    type: 'faq_item',
    name: 'FAQ Item',
    fieldDefinitions: [
      { key: 'category', name: 'Categorie', type: 'single_line_text_field' },
      { key: 'question', name: 'Vraag', type: 'single_line_text_field' },
      { key: 'answer', name: 'Antwoord', type: 'multi_line_text_field' },
      { key: 'sort_order', name: 'Volgorde', type: 'number_integer' },
    ],
  },
  {
    type: 'wine_region',
    name: 'Wijnregio',
    fieldDefinitions: [
      { key: 'name', name: 'Naam', type: 'single_line_text_field' },
      { key: 'display_name', name: 'Weergavenaam', type: 'single_line_text_field' },
      { key: 'slug', name: 'Slug', type: 'single_line_text_field' },
      { key: 'description', name: 'Beschrijving', type: 'multi_line_text_field' },
      { key: 'famous_wines', name: 'Bekende wijnen (JSON array)', type: 'json' },
      { key: 'area', name: 'Gebied (north/central)', type: 'single_line_text_field' },
      { key: 'active', name: 'Actief', type: 'boolean' },
    ],
  },
  {
    type: 'category_block',
    name: 'Categorie Blok',
    fieldDefinitions: [
      { key: 'name', name: 'Naam', type: 'single_line_text_field' },
      { key: 'description', name: 'Beschrijving', type: 'single_line_text_field' },
      { key: 'href', name: 'Link', type: 'single_line_text_field' },
      { key: 'icon_type', name: 'Icoon type (red/white/rose/sparkling/gift)', type: 'single_line_text_field' },
      { key: 'sort_order', name: 'Volgorde', type: 'number_integer' },
    ],
  },
  {
    type: 'testimonial',
    name: 'Testimonial',
    fieldDefinitions: [
      { key: 'name', name: 'Naam klant', type: 'single_line_text_field' },
      { key: 'text', name: 'Review tekst', type: 'multi_line_text_field' },
      { key: 'rating', name: 'Sterren (1-5)', type: 'number_integer' },
      { key: 'wine', name: 'Wijn', type: 'single_line_text_field' },
      { key: 'attribution', name: 'Bron (bijv. Google Review)', type: 'single_line_text_field' },
      { key: 'sort_order', name: 'Volgorde', type: 'number_integer' },
    ],
  },
  {
    type: 'homepage_stat',
    name: 'Homepage Cijfer',
    fieldDefinitions: [
      { key: 'value', name: 'Getal', type: 'single_line_text_field' },
      { key: 'prefix', name: 'Prefix (bijv. "< ")', type: 'single_line_text_field' },
      { key: 'suffix', name: 'Suffix (bijv. "+")', type: 'single_line_text_field' },
      { key: 'label', name: 'Label', type: 'single_line_text_field' },
      { key: 'sort_order', name: 'Volgorde', type: 'number_integer' },
    ],
  },
];

async function createDefinitions() {
  console.log('\n=== Creating metaobject definitions ===\n');

  for (const def of metaobjectDefinitions) {
    console.log(`Creating: ${def.name} (${def.type})...`);
    const result = await adminQuery(`
      mutation CreateDefinition($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition { id type }
          userErrors { field message code }
        }
      }
    `, {
      definition: {
        type: def.type,
        name: def.name,
        access: { storefront: 'PUBLIC_READ' },
        fieldDefinitions: def.fieldDefinitions.map(f => ({
          key: f.key,
          name: f.name,
          type: f.type,
        })),
      },
    });

    const errors = result.data?.metaobjectDefinitionCreate?.userErrors;
    if (errors?.length > 0) {
      if (errors[0].code === 'TAKEN') {
        console.log(`  ↳ Already exists, skipping`);
      } else {
        console.error(`  ↳ Error:`, errors);
      }
    } else {
      console.log(`  ↳ Created successfully`);
    }
  }
}

// ============================================================
// 2. SEED METAOBJECT ENTRIES
// ============================================================

async function createMetaobject(type: string, handle: string, fields: Array<{ key: string; value: string }>) {
  const result = await adminQuery(`
    mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id handle }
        userErrors { field message code }
      }
    }
  `, {
    metaobject: {
      type,
      handle,
      fields,
    },
  });

  const errors = result.data?.metaobjectCreate?.userErrors;
  if (errors?.length > 0) {
    if (errors.some((e: { code: string }) => e.code === 'TAKEN' || e.code === 'NOT_UNIQUE')) {
      return 'exists';
    }
    console.error(`  Error creating ${type}/${handle}:`, errors);
    return 'error';
  }
  return 'created';
}

async function seedContent() {
  console.log('\n=== Seeding metaobject content ===\n');

  // Site Settings
  console.log('Seeding site_settings...');
  await createMetaobject('site_settings', 'main', [
    { key: 'company_name', value: 'Vino per Lei' },
    { key: 'owner_name', value: 'Carla Daniels' },
    { key: 'phone', value: '' },
    { key: 'email', value: 'info@vinoperlei.nl' },
    { key: 'address_street', value: 'Pastorielaan 56' },
    { key: 'address_postal', value: '5504 CR' },
    { key: 'address_city', value: 'Veldhoven' },
    { key: 'kvk', value: '98874977' },
    { key: 'btw', value: 'NL005360033B10' },
    { key: 'instagram_url', value: 'https://instagram.com/vinoperlei' },
    { key: 'facebook_url', value: 'https://facebook.com/vinoperlei' },
    { key: 'pinterest_url', value: 'https://pinterest.com/vinoperlei' },
    { key: 'hours_weekday', value: '09:00 - 17:00' },
    { key: 'hours_saturday', value: '10:00 - 14:00' },
    { key: 'hours_sunday', value: 'Gesloten' },
    { key: 'gratis_verzending_drempel', value: '35' },
    { key: 'verzendkosten', value: '4.95' },
  ]);

  // Hero
  console.log('Seeding homepage_hero...');
  await createMetaobject('homepage_hero', 'main', [
    { key: 'subtitle', value: 'Authentieke Italiaanse Wijnen' },
    { key: 'title_line_1', value: 'La Dolce Vita' },
    { key: 'title_line_2', value: 'in Elk Glas' },
    { key: 'description', value: 'Ontdek onze zorgvuldig geselecteerde collectie Italiaanse wijnen. Van krachtige Barolo tot frisse Pinot Grigio.' },
    { key: 'cta_primary_text', value: 'Bekijk Collectie' },
    { key: 'cta_primary_link', value: '/wijnen' },
    { key: 'cta_secondary_text', value: 'Ons Verhaal' },
    { key: 'cta_secondary_link', value: '/over-ons' },
  ]);

  // Announcement Bar
  console.log('Seeding announcement_bar...');
  await createMetaobject('announcement_bar', 'main', [
    { key: 'message', value: 'Welkom! Gebruik code WELKOM10 voor 10% korting op je eerste bestelling' },
    { key: 'enabled', value: 'true' },
    { key: 'link', value: '/wijnen' },
  ]);

  // USP Items
  console.log('Seeding usp_items...');
  const usps = [
    { handle: 'gratis-verzending', title: 'Gratis verzending', subtitle: 'vanaf €35', icon_name: 'truck', sort_order: '1' },
    { handle: 'gratis-retour', title: 'Gratis retour', subtitle: '14 dagen', icon_name: 'refresh', sort_order: '2' },
    { handle: 'expert-selectie', title: 'Expert selectie', subtitle: 'Handgeplukt in Italië', icon_name: 'star', sort_order: '3' },
    { handle: 'veilig-betalen', title: 'Veilig betalen', subtitle: 'iDEAL & creditcard', icon_name: 'shield', sort_order: '4' },
  ];
  for (const usp of usps) {
    await createMetaobject('usp_item', usp.handle, [
      { key: 'title', value: usp.title },
      { key: 'subtitle', value: usp.subtitle },
      { key: 'icon_name', value: usp.icon_name },
      { key: 'sort_order', value: usp.sort_order },
    ]);
  }

  // Category Blocks
  console.log('Seeding category_blocks...');
  const categories = [
    { handle: 'rode-wijn', name: 'Rode Wijn', description: 'Vol & Rijk', href: '/wijnen?type=red', icon_type: 'red', sort_order: '1' },
    { handle: 'witte-wijn', name: 'Witte Wijn', description: 'Fris & Fruitig', href: '/wijnen?type=white', icon_type: 'white', sort_order: '2' },
    { handle: 'rose', name: 'Rosé', description: 'Licht & Zomers', href: '/wijnen?type=rose', icon_type: 'rose', sort_order: '3' },
    { handle: 'bubbels', name: 'Bubbels', description: 'Feestelijk', href: '/wijnen?type=sparkling', icon_type: 'sparkling', sort_order: '4' },
    { handle: 'cadeaus', name: 'Cadeaus', description: 'Perfect Verpakt', href: '/cadeaus', icon_type: 'gift', sort_order: '5' },
  ];
  for (const cat of categories) {
    await createMetaobject('category_block', cat.handle, [
      { key: 'name', value: cat.name },
      { key: 'description', value: cat.description },
      { key: 'href', value: cat.href },
      { key: 'icon_type', value: cat.icon_type },
      { key: 'sort_order', value: cat.sort_order },
    ]);
  }

  // Wine Regions
  console.log('Seeding wine_regions...');
  const regions = [
    { handle: 'piemonte', name: 'Piemonte', display_name: 'Piemonte', slug: 'piemonte', description: 'Home of Barolo and Barbaresco, the king and queen of Italian wines', famous_wines: '["Barolo","Barbaresco","Barbera d\'Alba","Nebbiolo"]', area: 'north' },
    { handle: 'lombardia', name: 'Lombardia', display_name: 'Lombardia', slug: 'lombardia', description: 'Home of Franciacorta sparkling wines', famous_wines: '["Franciacorta","Valtellina","Oltrepò Pavese"]', area: 'north' },
    { handle: 'alto-adige', name: 'Trentino-Alto Adige', display_name: 'Alto Adige', slug: 'alto-adige', description: 'Alpine wines with Germanic influence', famous_wines: '["Pinot Grigio","Gewürztraminer","Lagrein"]', area: 'north' },
    { handle: 'veneto', name: 'Veneto', display_name: 'Veneto', slug: 'veneto', description: 'Famous for Amarone, Valpolicella, and Prosecco', famous_wines: '["Amarone","Valpolicella Ripasso","Prosecco","Soave"]', area: 'north' },
    { handle: 'friuli', name: 'Friuli-Venezia Giulia', display_name: 'Friuli', slug: 'friuli', description: 'Italy\'s premier white wine region', famous_wines: '["Pinot Grigio","Friulano","Ribolla Gialla"]', area: 'north' },
    { handle: 'emilia-romagna', name: 'Emilia-Romagna', display_name: 'Emilia-Romagna', slug: 'emilia-romagna', description: 'Home of Lambrusco sparkling red', famous_wines: '["Lambrusco","Sangiovese di Romagna"]', area: 'north' },
    { handle: 'liguria', name: 'Liguria', display_name: 'Liguria', slug: 'liguria', description: 'Coastal wines from the Italian Riviera', famous_wines: '["Cinque Terre","Pigato","Vermentino"]', area: 'north' },
    { handle: 'valle-daosta', name: 'Valle d\'Aosta', display_name: 'Valle d\'Aosta', slug: 'valle-daosta', description: 'Italy\'s smallest wine region in the Alps', famous_wines: '["Petit Rouge","Fumin","Blanc de Morgex"]', area: 'north' },
    { handle: 'toscana', name: 'Tuscany', display_name: 'Toscana', slug: 'toscana', description: 'The heart of Italian wine with Chianti and Brunello', famous_wines: '["Chianti Classico","Brunello di Montalcino","Super Tuscans","Vernaccia"]', area: 'central' },
  ];
  for (const region of regions) {
    await createMetaobject('wine_region', region.handle, [
      { key: 'name', value: region.name },
      { key: 'display_name', value: region.display_name },
      { key: 'slug', value: region.slug },
      { key: 'description', value: region.description },
      { key: 'famous_wines', value: region.famous_wines },
      { key: 'area', value: region.area },
      { key: 'active', value: 'true' },
    ]);
  }

  // Testimonials
  console.log('Seeding testimonials...');
  const testimonials = [
    { handle: 'marloes-v', name: 'Marloes V.', text: 'Prachtige selectie! De Barolo was een absolute hit op ons feestje. Wordt nu vaste klant.', rating: '5', wine: 'Montaribaldi Barolo', attribution: 'Proeverij, maart 2026', sort_order: '1' },
    { handle: 'peter-de-g', name: 'Peter de G.', text: 'Snelle levering en mooi verpakt. De Amarone overtrof mijn verwachtingen — geweldige prijs-kwaliteit.', rating: '5', wine: 'Amarone della Valpolicella', attribution: 'Proeverij, maart 2026', sort_order: '2' },
    { handle: 'sandra-k', name: 'Sandra K.', text: 'Al drie keer besteld en altijd tevreden. De wijnbeschrijvingen kloppen precies. Aanrader!', rating: '5', wine: 'Valpolicella Ripasso', attribution: 'Proeverij, maart 2026', sort_order: '3' },
  ];
  for (const t of testimonials) {
    await createMetaobject('testimonial', t.handle, [
      { key: 'name', value: t.name },
      { key: 'text', value: t.text },
      { key: 'rating', value: t.rating },
      { key: 'wine', value: t.wine },
      { key: 'attribution', value: t.attribution },
      { key: 'sort_order', value: t.sort_order },
    ]);
  }

  // Homepage Stats
  console.log('Seeding homepage_stats...');
  const stats = [
    { handle: 'wijnen', value: '19', prefix: '', suffix: '', label: 'Geselecteerde wijnen', sort_order: '1' },
    { handle: 'regio', value: '3', prefix: '', suffix: '', label: 'Italiaanse wijngebieden', sort_order: '2' },
    { handle: 'producenten', value: '12', prefix: '', suffix: '+', label: 'Familieproducenten', sort_order: '3' },
    { handle: 'levering', value: '48', prefix: '< ', suffix: '', label: 'Uur levering', sort_order: '4' },
  ];
  for (const s of stats) {
    await createMetaobject('homepage_stat', s.handle, [
      { key: 'value', value: s.value },
      { key: 'prefix', value: s.prefix },
      { key: 'suffix', value: s.suffix },
      { key: 'label', value: s.label },
      { key: 'sort_order', value: s.sort_order },
    ]);
  }

  // FAQ Items
  console.log('Seeding faq_items...');
  const faqItems = [
    { handle: 'bestellen-1', category: 'Bestellen', question: 'Hoe plaats ik een bestelling?', answer: 'Blader door ons assortiment, voeg wijnen toe aan je winkelwagen en ga naar de checkout. Vul je gegevens in, kies een betaalmethode en bevestig je bestelling. Je ontvangt direct een orderbevestiging per e-mail.', sort_order: '1' },
    { handle: 'bestellen-2', category: 'Bestellen', question: 'Kan ik mijn bestelling nog wijzigen of annuleren?', answer: 'Dat kan, zolang je bestelling nog niet is verzonden. Neem zo snel mogelijk contact met ons op via info@vinoperlei.nl met je bestelnummer. Wij doen ons best om je verzoek te verwerken.', sort_order: '2' },
    { handle: 'bestellen-3', category: 'Bestellen', question: 'Is het mogelijk om als cadeau te bestellen?', answer: 'Ja! Bij het afrekenen kun je aangeven dat het om een cadeau gaat. We voegen dan geen factuur toe aan het pakket. Je kunt ook een persoonlijk bericht toevoegen.', sort_order: '3' },
    { handle: 'betalen-1', category: 'Betalen', question: 'Welke betaalmethodes accepteren jullie?', answer: 'Wij accepteren iDEAL, creditcard (Visa en Mastercard), PayPal en Bancontact. Alle betalingen worden veilig verwerkt via een SSL-beveiligde verbinding.', sort_order: '4' },
    { handle: 'betalen-2', category: 'Betalen', question: 'Is betalen bij Vino per Lei veilig?', answer: 'Absoluut. Onze website is volledig SSL-beveiligd en betalingen worden verwerkt door gecertificeerde betalingsproviders. Wij slaan zelf geen betalingsgegevens op.', sort_order: '5' },
    { handle: 'verzending-1', category: 'Verzending', question: 'Wat zijn de verzendkosten?', answer: 'Standaard verzending kost €4,95. Bij bestellingen vanaf €35 is verzending gratis. Avondlevering kost €7,95. Verzending naar België kost €8,95 (gratis vanaf €75).', sort_order: '6' },
    { handle: 'verzending-2', category: 'Verzending', question: 'Hoe lang duurt de levering?', answer: 'Bestellingen die voor 14:00 worden geplaatst, worden dezelfde dag verzonden. De levertijd is 1-2 werkdagen voor Nederland en 2-3 werkdagen voor België.', sort_order: '7' },
    { handle: 'verzending-3', category: 'Verzending', question: 'Hoe worden de flessen verpakt?', answer: 'Elke fles wordt zorgvuldig verpakt in speciale wijnverpakkingen die beschermen tegen breuk. Bij extreme temperaturen nemen wij extra maatregelen om de kwaliteit te waarborgen.', sort_order: '8' },
    { handle: 'verzending-4', category: 'Verzending', question: 'Kan ik mijn bestelling volgen?', answer: 'Ja, zodra je bestelling is verzonden ontvang je een Track & Trace code per e-mail waarmee je de bezorging live kunt volgen.', sort_order: '9' },
    { handle: 'retourneren-1', category: 'Retourneren', question: 'Kan ik mijn bestelling retourneren?', answer: 'Ja, je hebt 14 dagen bedenktijd na ontvangst. De flessen moeten ongeopend en in goede staat zijn. Geopende flessen kunnen helaas niet worden geretourneerd. Zie ons retourbeleid voor de volledige voorwaarden.', sort_order: '10' },
    { handle: 'retourneren-2', category: 'Retourneren', question: 'Hoe lang duurt het voordat ik mijn geld terugkrijg?', answer: 'Na ontvangst en controle van je retourzending ontvang je binnen 14 dagen het aankoopbedrag terug op dezelfde betaalmethode waarmee je hebt betaald.', sort_order: '11' },
    { handle: 'retourneren-3', category: 'Retourneren', question: 'Wat als ik een beschadigde fles heb ontvangen?', answer: 'Neem binnen 48 uur contact met ons op via info@vinoperlei.nl met foto\'s van de schade. Wij zorgen dan voor een passende oplossing — een nieuwe fles of volledige terugbetaling.', sort_order: '12' },
    { handle: 'leeftijd-1', category: 'Leeftijdsverificatie', question: 'Waarom moet ik mijn leeftijd bevestigen?', answer: 'De Nederlandse wet verbiedt de verkoop van alcohol aan personen onder de 18 jaar. Wij zijn wettelijk verplicht om de leeftijd van onze klanten te verifiëren.', sort_order: '13' },
    { handle: 'leeftijd-2', category: 'Leeftijdsverificatie', question: 'Wordt mijn leeftijd ook bij bezorging gecontroleerd?', answer: 'Ja, de bezorger kan bij aflevering om een geldig legitimatiebewijs vragen. Als de ontvanger niet kan aantonen 18 jaar of ouder te zijn, wordt het pakket niet afgegeven.', sort_order: '14' },
    { handle: 'bewaren-1', category: 'Wijn bewaren', question: 'Hoe bewaar ik wijn het beste thuis?', answer: 'Bewaar wijn op een koele (12-16°C), donkere plek met een constante temperatuur. Leg flessen met een kurk horizontaal zodat de kurk vochtig blijft. Vermijd trillingen en sterke geuren in de buurt.', sort_order: '15' },
    { handle: 'bewaren-2', category: 'Wijn bewaren', question: 'Hoe lang kan ik wijn bewaren?', answer: 'Dit verschilt sterk per wijn. De meeste wijnen die wij verkopen zijn klaar om te drinken. Bij elke wijn vermelden wij een drinkadvies. Heb je specifieke vragen? Neem gerust contact met ons op.', sort_order: '16' },
    { handle: 'bewaren-3', category: 'Wijn bewaren', question: 'Op welke temperatuur serveer ik wijn?', answer: 'Rode wijn: 16-18°C (even koelen is vaak beter dan kamertemperatuur). Witte wijn: 8-12°C. Rosé: 8-10°C. Mousserende wijn: 6-8°C.', sort_order: '17' },
  ];
  for (const faq of faqItems) {
    await createMetaobject('faq_item', faq.handle, [
      { key: 'category', value: faq.category },
      { key: 'question', value: faq.question },
      { key: 'answer', value: faq.answer },
      { key: 'sort_order', value: faq.sort_order },
    ]);
  }
}

// ============================================================
// 3. SHOPIFY PAGES
// ============================================================

async function createPages() {
  console.log('\n=== Creating Shopify Pages ===\n');

  const pages = [
    {
      handle: 'privacy',
      title: 'Privacybeleid',
      body_html: `<h2>1. Wie zijn wij?</h2><p>Vino per Lei is een online wijnwinkel gespecialiseerd in authentieke Italiaanse wijnen.</p><ul><li>Bedrijfsnaam: Vino per Lei (eenmanszaak)</li><li>KvK-nummer: 98874977</li><li>Adres: Pastorielaan 56, 5504 CR Veldhoven</li><li>E-mail: info@vinoperlei.nl</li><li>Verantwoordelijke: Carla Daniels</li></ul><h2>2. Welke gegevens verzamelen wij?</h2><p>Wij verzamelen de volgende persoonsgegevens wanneer je onze webshop gebruikt:</p><ul><li><strong>Accountgegevens:</strong> naam, e-mailadres, wachtwoord (versleuteld)</li><li><strong>Bestelgegevens:</strong> naam, afleveradres, factuuradres, telefoonnummer</li><li><strong>Betalingsgegevens:</strong> worden verwerkt door onze betalingsprovider en niet door ons opgeslagen</li><li><strong>Leeftijdsverificatie:</strong> wij slaan op dat je hebt bevestigd 18 jaar of ouder te zijn (via cookie)</li><li><strong>Communicatie:</strong> berichten die je ons stuurt via het contactformulier of e-mail</li><li><strong>Technische gegevens:</strong> IP-adres, browsertype, apparaatinformatie (alleen via cookies)</li></ul><h2>3. Waarvoor gebruiken wij jouw gegevens?</h2><ul><li>Het verwerken en verzenden van je bestellingen</li><li>Het aanmaken en beheren van je account</li><li>Klantenservice en communicatie over je bestelling</li><li>Het versturen van onze nieuwsbrief (alleen met jouw toestemming)</li><li>Wettelijke verplichtingen (bijv. leeftijdsverificatie)</li><li>Verbetering van onze website en dienstverlening</li></ul><h2>4. Grondslagen voor verwerking</h2><p>Wij verwerken jouw gegevens op basis van:</p><ul><li><strong>Uitvoering van een overeenkomst:</strong> voor het verwerken van bestellingen</li><li><strong>Wettelijke verplichting:</strong> leeftijdscontrole bij alcoholverkoop</li><li><strong>Toestemming:</strong> voor het versturen van de nieuwsbrief en niet-essentiële cookies</li><li><strong>Gerechtvaardigd belang:</strong> voor het verbeteren van onze website</li></ul><h2>5. Cookies</h2><p>Wij maken gebruik van cookies om onze website goed te laten functioneren en om je ervaring te verbeteren. Lees ons volledige cookiebeleid voor meer informatie.</p><h2>6. Verwerkers en derde partijen</h2><p>Wij delen jouw gegevens alleen met derde partijen die noodzakelijk zijn voor onze dienstverlening:</p><ul><li><strong>Shopify:</strong> ons e-commerce platform voor het verwerken van bestellingen</li><li><strong>Betalingsproviders:</strong> voor het veilig afhandelen van betalingen</li><li><strong>Bezorgdiensten:</strong> voor het bezorgen van je bestelling</li><li><strong>E-mailserviceprovider:</strong> voor het versturen van bestelbevestigingen en de nieuwsbrief</li></ul><p>Met al deze partijen hebben wij verwerkersovereenkomsten gesloten conform de AVG.</p><h2>7. Bewaartermijnen</h2><ul><li><strong>Accountgegevens:</strong> zolang je account actief is, plus maximaal 2 jaar na inactiviteit</li><li><strong>Bestelgegevens:</strong> 7 jaar (wettelijke bewaarplicht)</li><li><strong>Nieuwsbrief:</strong> tot je je uitschrijft</li><li><strong>Contactberichten:</strong> maximaal 1 jaar na afhandeling</li></ul><h2>8. Jouw rechten</h2><p>Op grond van de AVG heb je de volgende rechten: recht op inzage, correctie, verwijdering, beperking, overdraagbaarheid en bezwaar. Neem contact met ons op via info@vinoperlei.nl om een van deze rechten uit te oefenen. Wij reageren binnen 30 dagen.</p><h2>9. Beveiliging</h2><p>Wij nemen de bescherming van jouw gegevens serieus en nemen passende technische en organisatorische maatregelen. Onze website maakt gebruik van SSL-encryptie.</p><h2>10. Klachten</h2><p>Je hebt altijd het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens: autoriteitpersoonsgegevens.nl.</p><h2>11. Wijzigingen</h2><p>Wij behouden ons het recht voor om dit privacybeleid aan te passen. De meest actuele versie vind je altijd op deze pagina.</p>`,
    },
    {
      handle: 'voorwaarden',
      title: 'Algemene Voorwaarden',
      body_html: `<h2>Artikel 1 — Definities</h2><ul><li><strong>Ondernemer:</strong> Vino per Lei (eenmanszaak), gevestigd te Pastorielaan 56, 5504 CR Veldhoven, ingeschreven bij de KvK onder nummer 98874977, BTW-nummer NL005360033B10.</li><li><strong>Consument:</strong> de natuurlijke persoon die niet handelt in de uitoefening van beroep of bedrijf en een overeenkomst op afstand aangaat met de ondernemer.</li><li><strong>Overeenkomst op afstand:</strong> een overeenkomst waarbij gebruik wordt gemaakt van het systeem van de ondernemer voor verkoop op afstand via de website vinoperlei.nl.</li><li><strong>Bedenktijd:</strong> de termijn waarbinnen de consument gebruik kan maken van zijn herroepingsrecht.</li><li><strong>Herroepingsrecht:</strong> de mogelijkheid voor de consument om binnen de bedenktijd af te zien van de overeenkomst op afstand.</li></ul><h2>Artikel 2 — Identiteit van de ondernemer</h2><ul><li>Handelsnaam: Vino per Lei</li><li>Adres: Pastorielaan 56, 5504 CR Veldhoven</li><li>E-mail: info@vinoperlei.nl</li><li>KvK-nummer: 98874977</li><li>BTW-nummer: NL005360033B10</li></ul><h2>Artikel 3 — Toepasselijkheid</h2><p>Deze algemene voorwaarden zijn van toepassing op elk aanbod van de ondernemer en op elke tot stand gekomen overeenkomst op afstand. Door het plaatsen van een bestelling accepteert de consument deze algemene voorwaarden.</p><h2>Artikel 4 — Het aanbod</h2><p>Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden producten. Afbeeldingen zijn een waarheidsgetrouwe weergave. Alle producten zijn beschikbaar zolang de voorraad strekt.</p><h2>Artikel 5 — De overeenkomst</h2><p>De overeenkomst komt tot stand op het moment van aanvaarding door de consument van het aanbod. De ondernemer bevestigt de ontvangst per e-mail.</p><h2>Artikel 6 — Leeftijdsverificatie</h2><p>De verkoop van alcoholhoudende dranken is uitsluitend toegestaan aan personen van 18 jaar en ouder. Bij levering kan de bezorger om een geldig legitimatiebewijs vragen.</p><h2>Artikel 7 — Herroepingsrecht</h2><p>De consument heeft het recht de overeenkomst binnen 14 dagen zonder opgave van redenen te ontbinden. Geopende flessen wijn kunnen niet worden geretourneerd (conform art. 6:230p sub f BW).</p><h2>Artikel 8 — Prijzen</h2><p>Alle genoemde prijzen zijn in euro's en inclusief BTW. Verzendkosten worden apart vermeld bij het afrekenen.</p><h2>Artikel 9 — Betaling</h2><p>Betaling geschiedt via iDEAL, creditcard (Visa, Mastercard), PayPal of Bancontact.</p><h2>Artikel 10 — Levering</h2><p>De levertijd bedraagt doorgaans 1-2 werkdagen na ontvangst van de betaling.</p><h2>Artikel 11 — Klachtenregeling</h2><p>Klachten kunnen worden ingediend via info@vinoperlei.nl en worden binnen 14 dagen beantwoord.</p><h2>Artikel 12 — Toepasselijk recht</h2><p>Op alle overeenkomsten is uitsluitend Nederlands recht van toepassing.</p><h2>Artikel 13 — Aanvullende bepalingen</h2><p>Aanvullende bepalingen mogen niet ten nadele van de consument zijn.</p>`,
    },
    {
      handle: 'cookies',
      title: 'Cookiebeleid',
      body_html: `<h2>Wat zijn cookies?</h2><p>Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je een website bezoekt. Ze helpen de website om jouw voorkeuren te onthouden en de site goed te laten functioneren.</p><h2>Welke cookies gebruiken wij?</h2><h3>1. Functionele cookies (noodzakelijk)</h3><p>Deze cookies zijn nodig om de website goed te laten werken. Ze kunnen niet worden uitgeschakeld.</p><ul><li><strong>vpl_age_verified</strong> — Onthoudt dat je hebt bevestigd 18 jaar of ouder te zijn (sessie)</li><li><strong>vpl_cookie_consent</strong> — Slaat je cookievoorkeuren op (1 jaar)</li></ul><h3>2. Lokale opslag (functioneel)</h3><p>Naast cookies gebruiken wij localStorage voor winkelwagen, verlanglijst en tijdelijke checkout gegevens. Deze gegevens worden alleen in jouw browser opgeslagen.</p><h3>3. Analytische cookies</h3><p>Op dit moment gebruiken wij geen analytische cookies. Wanneer wij dit in de toekomst wel doen, zullen wij je toestemming vragen.</p><h3>4. Marketing cookies</h3><p>Op dit moment gebruiken wij geen marketing- of trackingcookies.</p><h2>Hoe kun je cookies beheren?</h2><p>Je kunt cookies beheren via de instellingen van je browser. Let op: als je functionele cookies blokkeert, kan het zijn dat bepaalde onderdelen van de website niet goed werken.</p><h2>Wijzigingen</h2><p>Wij behouden ons het recht voor om dit cookiebeleid aan te passen. De meest actuele versie vind je altijd op deze pagina.</p>`,
    },
    {
      handle: 'verzending',
      title: 'Verzending & Levering',
      body_html: `<h2>Verzendopties</h2><ul><li><strong>Standaard verzending:</strong> €4,95 — Levertijd 1-2 werkdagen, Track & Trace inbegrepen</li><li><strong>Gratis verzending:</strong> Bij bestellingen vanaf €35,00</li><li><strong>Avondlevering:</strong> €7,95 — Bezorging tussen 18:00-22:00, bestel voor 14:00</li><li><strong>Verzending België:</strong> €8,95 — Levertijd 2-3 werkdagen, gratis vanaf €75,00</li></ul><h2>Zorgvuldige verpakking</h2><p>Wijn is kwetsbaar — daarom besteden wij extra aandacht aan de verpakking:</p><ul><li><strong>Speciale wijnverpakkingen:</strong> elke fles wordt individueel beschermd</li><li><strong>Temperatuurgecontroleerd:</strong> bij extreme warmte of kou nemen wij extra maatregelen</li><li><strong>Duurzaam:</strong> onze verpakkingsmaterialen zijn recyclebaar</li></ul><h2>Verzendgebied</h2><p>Wij verzenden naar geheel Nederland (inclusief Waddeneilanden) en geheel België.</p><h2>Leeftijdscontrole bij levering</h2><p>De bezorger kan bij aflevering om een geldig legitimatiebewijs vragen. Als de ontvanger niet kan aantonen 18 jaar of ouder te zijn, wordt het pakket niet afgegeven.</p><h2>Niet thuis bij bezorging?</h2><p>De bezorger laat een bericht achter en het pakket wordt aangeboden bij een afhaalpunt of de volgende werkdag opnieuw bezorgd.</p>`,
    },
    {
      handle: 'retourneren',
      title: 'Retourbeleid',
      body_html: `<h2>14 dagen bedenktijd</h2><p>Conform de Europese wetgeving heb je als consument het recht om je bestelling binnen <strong>14 dagen na ontvangst</strong> zonder opgave van redenen te retourneren.</p><h2>Uitzonderingen</h2><ul><li><strong>Geopende flessen:</strong> Alcoholproducten waarvan de verzegeling is verbroken, kunnen niet worden geretourneerd (conform art. 6:230p sub f BW).</li><li><strong>Beschadigde verpakking:</strong> Producten waarvan de verpakking zodanig beschadigd is dat de waarde is verminderd.</li><li><strong>Onjuiste opslag:</strong> Wijn die aantoonbaar verkeerd is bewaard na ontvangst.</li></ul><h2>Retourprocedure</h2><ol><li><strong>Meld je retour aan</strong> — Stuur een e-mail naar info@vinoperlei.nl met je bestelnummer</li><li><strong>Verpak het product</strong> — Verpak de wijn zorgvuldig in de originele of vergelijkbare verpakking</li><li><strong>Verstuur het pakket</strong> — Stuur retour naar het adres in de retourbevestiging</li></ol><h2>Retourkosten</h2><p>De kosten voor het retourneren zijn voor rekening van de consument, tenzij het product beschadigd of foutief geleverd is.</p><h2>Terugbetaling</h2><p>Na ontvangst en controle ontvang je binnen <strong>14 dagen</strong> het aankoopbedrag terug op dezelfde betaalmethode.</p><h2>Beschadigd ontvangen?</h2><p>Neem binnen 48 uur contact op via info@vinoperlei.nl met foto's van de schade. Wij zorgen voor een passende oplossing.</p>`,
    },
    {
      handle: 'over-ons',
      title: 'Over Ons',
      body_html: `<h2>Ons Verhaal</h2><p>Vino per Lei is geboren uit een passie voor authentieke Italiaanse wijnen. Wij selecteren elke wijn persoonlijk bij kleine familiebedrijven in Italië — van de heuvels van Piemonte tot de kusten van Puglia.</p><p>Bij ons vind je geen massaproductie, maar wijnen met karakter en een verhaal. Elke fles vertelt het verhaal van de wijnmaker, het terroir en de tradities die generatie op generatie zijn doorgegeven.</p><h2>Onze Selectie</h2><p>Wij reizen regelmatig naar Italië om nieuwe wijnmakers te ontmoeten en onze collectie te verfijnen. Onze criteria zijn streng: alleen wijnen die ons verrassen en die wij met trots aanbevelen, komen in ons assortiment.</p><h2>Voor Jou</h2><p>"Per Lei" — voor haar, voor jou. Wij geloven dat een goed glas wijn een moment van genot is dat je voor jezelf mag nemen. Of je nu een kenner bent of net begint met het ontdekken van Italiaanse wijnen, wij helpen je graag.</p>`,
    },
  ];

  for (const page of pages) {
    console.log(`Creating page: ${page.title}...`);
    const result = await adminQuery(`
      mutation pageCreate($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page { id handle title }
          userErrors { field message code }
        }
      }
    `, {
      page: {
        title: page.title,
        handle: page.handle,
        body: page.body_html,
        isPublished: true,
      },
    });

    const errors = result.data?.pageCreate?.userErrors;
    if (errors?.length > 0) {
      if (errors.some((e: { code: string }) => e.code === 'TAKEN')) {
        console.log(`  ↳ Already exists`);
      } else {
        console.error(`  ↳ Error:`, errors);
      }
    } else {
      console.log(`  ↳ Created: ${page.handle}`);
    }
  }
}

// ============================================================
// 4. BLOG + ARTICLES
// ============================================================

async function createBlog() {
  console.log('\n=== Creating Blog & Articles ===\n');

  // Create blog
  console.log('Creating blog "Wijn Verhalen"...');
  const blogResult = await adminQuery(`
    mutation blogCreate($blog: BlogCreateInput!) {
      blogCreate(blog: $blog) {
        blog { id handle }
        userErrors { field message code }
      }
    }
  `, {
    blog: { title: 'Wijn Verhalen', handle: 'wijn-verhalen' },
  });

  let blogId = blogResult.data?.blogCreate?.blog?.id;
  if (!blogId) {
    // Blog might already exist, fetch it
    const existing = await adminQuery(`
      query { blogs(first: 10) { nodes { id handle } } }
    `);
    const found = existing.data?.blogs?.nodes?.find(
      (b: { handle: string }) => b.handle === 'wijn-verhalen'
    );
    if (found) {
      blogId = found.id;
      console.log('  ↳ Blog already exists');
    } else {
      console.error('  ↳ Failed to create or find blog');
      return;
    }
  } else {
    console.log('  ↳ Blog created');
  }

  // Create articles
  const articles = [
    {
      title: 'Barolo: De Koning der Italiaanse Wijnen',
      handle: 'barolo-de-koning-der-italiaanse-wijnen',
      tags: ['wijnkennis', 'piemonte'],
      excerpt: 'Ontdek waarom Barolo uit Piemonte al eeuwenlang de kroon draagt. Van de Nebbiolo-druif tot de kenmerkende tannines — alles over deze iconische wijn.',
      body: '<p>Barolo, vaak aangeduid als de "Koning der Wijnen", is een van de meest gerespecteerde wijnen ter wereld. Geproduceerd in de heuvels van de Langhe in Piemonte, wordt deze wijn uitsluitend gemaakt van de Nebbiolo-druif.</p><p>De wijn onderscheidt zich door zijn volle body, hoge tannines en complexe aroma\'s van rozen, teer, truffels en kersen. Een goede Barolo kan decennialang rijpen en wordt steeds complexer met de jaren.</p><p>Bij Vino per Lei selecteren wij Barolo\'s van kleine, familieproducenten die de tradities van generatie op generatie doorgeven.</p>',
    },
    {
      title: 'Toscana: De Ultieme Wijngids',
      handle: 'toscana-de-ultieme-wijngids',
      tags: ['regiogids', 'toscana'],
      excerpt: 'Van Chianti Classico tot Brunello di Montalcino — een reis door de wijnheuvels van Toscane.',
      body: '<p>Toscane is misschien wel de meest iconische wijnregio van Italië. Van de glooiende heuvels van Chianti tot de exclusieve wijngaarden van Bolgheri — deze regio biedt voor elke wijnliefhebber iets bijzonders.</p><p>De Sangiovese-druif is de ster van Toscane en vormt de basis voor beroemde wijnen als Chianti Classico, Brunello di Montalcino en Vino Nobile di Montepulciano.</p>',
    },
    {
      title: 'Het Geheim van Amarone',
      handle: 'het-geheim-van-amarone',
      tags: ['wijnkennis', 'veneto'],
      excerpt: 'Hoe gedroogde druiven de meest intense wijn van de Veneto creëren. De appassimento-methode uitgelegd.',
      body: '<p>Amarone della Valpolicella is een unieke wijn die zijn kracht en complexiteit dankt aan de appassimento-methode. Na de oogst worden de druiven — voornamelijk Corvina, Rondinella en Molinara — drie tot vier maanden gedroogd op speciale rekken.</p><p>Dit droogproces concentreert de suikers en smaken, resulterend in een volle, rijke wijn met aroma\'s van gedroogd fruit, chocolade en specerijen.</p>',
    },
    {
      title: 'Prosecco vs. Champagne: De Verschillen',
      handle: 'prosecco-vs-champagne-de-verschillen',
      tags: ['wist-je-dat'],
      excerpt: 'Twee bubbels, twee werelden. Waarom Prosecco uit Valdobbiadene een eigen karakter heeft.',
      body: '<p>Hoewel beide bubbels zijn, verschillen Prosecco en Champagne fundamenteel in productie, druivenrassen en smaakprofiel. Prosecco wordt gemaakt met de Charmat-methode (tankmethode), terwijl Champagne de traditionele flessengisting gebruikt.</p><p>Prosecco, gemaakt van de Glera-druif, is fris, fruitig en toegankelijk. Champagne is complexer door de langere rijping op gist.</p>',
    },
    {
      title: 'Piemonte: Meer dan Alleen Barolo',
      handle: 'piemonte-meer-dan-barolo',
      tags: ['regiogids', 'piemonte'],
      excerpt: 'Barbera, Nebbiolo, Dolcetto — de andere schatten van Piemonte.',
      body: '<p>Piemonte staat bekend om Barolo en Barbaresco, maar de regio heeft zoveel meer te bieden. Barbera d\'Alba is een sappige, fruitige wijn die perfect is voor dagelijks genot. Dolcetto biedt zachte tannines en donker fruit.</p><p>En vergeet de witte wijnen niet: Arneis en Gavi di Gavi zijn prachtige uitdrukkingen van het Piemontese terroir.</p>',
    },
    {
      title: 'Wijn & Spijs: De Perfecte Italiaanse Match',
      handle: 'italiaanse-wijn-en-spijs-combinaties',
      tags: ['tips-en-tricks'],
      excerpt: 'Van Amarone bij ossobuco tot Vermentino bij zeevruchten. De gouden regels van Italiaans combineren.',
      body: '<p>De Italiaanse keuken en wijn zijn onlosmakelijk verbonden. Enkele klassieke combinaties: Barolo bij ossobuco of truffelrisotto, Chianti bij pasta met ragu, Vermentino bij zeevruchten, en Moscato d\'Asti bij dessert.</p><p>De gouden regel? Combineer regionaal. Een wijn uit Piemonte past het beste bij gerechten uit diezelfde regio.</p>',
    },
  ];

  for (const article of articles) {
    console.log(`Creating article: ${article.title}...`);
    const result = await adminQuery(`
      mutation articleCreate($article: ArticleCreateInput!) {
        articleCreate(article: $article) {
          article { id handle }
          userErrors { field message code }
        }
      }
    `, {
      article: {
        blogId,
        title: article.title,
        handle: article.handle,
        tags: article.tags,
        body: article.body,
        summary: article.excerpt,
        isPublished: true,
      },
    });

    const errors = result.data?.articleCreate?.userErrors;
    if (errors?.length > 0) {
      console.error(`  ↳ Error:`, errors);
    } else {
      console.log(`  ↳ Created`);
    }
  }
}

// ============================================================
// 5. NAVIGATION MENUS
// ============================================================

async function createMenus() {
  console.log('\n=== Creating Navigation Menus ===\n');
  console.log('NOTE: Shopify menus are best managed in Admin → Online Store → Navigation');
  console.log('Create the following menus manually:');
  console.log('  - main-menu: Wijnen, Cadeaus, Over Ons');
  console.log('  - footer-shop: Alle Wijnen, Rode Wijn, Witte Wijn, Rosé, Cadeaus');
  console.log('  - footer-service: Verzending, Retourneren, FAQ, Contact');
  console.log('  - footer-about: Ons Verhaal, Blog');
}

// ============================================================
// RUN
// ============================================================

async function main() {
  console.log('🍷 Vino per Lei — Shopify CMS Setup\n');
  console.log(`Store: ${STORE_DOMAIN}`);
  console.log(`API: ${API_VERSION}\n`);

  await createDefinitions();
  await seedContent();
  await createPages();
  await createBlog();
  await createMenus();

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Go to Shopify Admin → Content → Metaobjects to edit content');
  console.log('2. Go to Shopify Admin → Online Store → Pages to edit legal pages');
  console.log('3. Go to Shopify Admin → Online Store → Blog Posts to manage articles');
  console.log('4. Create navigation menus in Admin → Online Store → Navigation');
  console.log('5. Update phone number in Site Instellingen metaobject');
}

main().catch(console.error);
