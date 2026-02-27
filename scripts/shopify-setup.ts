import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { join } from "path";

const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const API_VERSION = "2025-01";

if (!STORE || !TOKEN) {
  console.error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

// --- Helpers ---

async function adminGraphQL(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
  return json;
}

async function adminREST(endpoint: string, method = "GET", body?: unknown) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

function extractId(gid: string): string {
  return gid.split("/").pop()!;
}

// --- Wine data (matches mockProducts.ts) ---

interface WineProduct {
  handle: string;
  title: string;
  description: string;
  collection: string;
  wineType: string;
  grapeVarieties: string[];
  country: string;
  region: string;
  vintage: string;
  price: string;
  compareAtPrice?: string;
  tasteProfile: Record<string, number>;
  imageFile: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isNew: boolean;
  isFeatured: boolean;
  hasAward: boolean;
  awardText?: string;
}

const wines: WineProduct[] = [
  { handle: "montaribaldi-barolo-2019", title: "Montaribaldi Barolo DOCG", description: "De koning der Italiaanse wijnen. Krachtig en complex met betoverende aroma's van rozen, teer, truffel en rijp rood fruit.", collection: "Piemonte Icons", wineType: "red", grapeVarieties: ["Nebbiolo"], country: "Italië", region: "Piemonte", vintage: "2019", price: "42.00", tasteProfile: { drySweet: 1, lightFull: 5, softTannic: 5, fruitySpicy: 4 }, imageFile: "montaribaldi-barolo.png", imageAlt: "Montaribaldi Barolo 2019", rating: 4.9, reviewCount: 156, inStock: true, stockQuantity: 12, isNew: false, isFeatured: true, hasAward: true, awardText: "Gold Medal" },
  { handle: "montaribaldi-barbera-dalba-2021", title: "Montaribaldi Barbera d'Alba", description: "Een elegante Barbera uit de heuvels van Alba met levendige zuren en smaken van kersen, frambozen en een subtiele kruidigheid.", collection: "Piemonte Classics", wineType: "red", grapeVarieties: ["Barbera"], country: "Italië", region: "Piemonte", vintage: "2021", price: "16.50", tasteProfile: { drySweet: 2, lightFull: 4, softTannic: 2, fruitySpicy: 4 }, imageFile: "montaribaldi-barbera-alba.png", imageAlt: "Montaribaldi Barbera d'Alba 2021", rating: 4.5, reviewCount: 67, inStock: true, stockQuantity: 32, isNew: false, isFeatured: true, hasAward: false },
  { handle: "barolo-classico-2018", title: "Barolo Classico DOCG", description: "Een tijdloze Barolo met alle klassieke kenmerken. Betoverende aroma's van rozen, teer, kersen en kruiden.", collection: "Piemonte Icons", wineType: "red", grapeVarieties: ["Nebbiolo"], country: "Italië", region: "Piemonte", vintage: "2018", price: "45.00", tasteProfile: { drySweet: 1, lightFull: 5, softTannic: 5, fruitySpicy: 4 }, imageFile: "barolo-classico-2018.png", imageAlt: "Barolo Classico DOCG 2018", rating: 4.8, reviewCount: 89, inStock: true, stockQuantity: 10, isNew: true, isFeatured: true, hasAward: true, awardText: "94 Points" },
  { handle: "nebbiolo-langhe-2021", title: "Nebbiolo Langhe DOC", description: "Een toegankelijke Nebbiolo met de elegantie van de Langhe. Aroma's van kersen, rozen en kruiden.", collection: "Piemonte Classics", wineType: "red", grapeVarieties: ["Nebbiolo"], country: "Italië", region: "Piemonte", vintage: "2021", price: "19.99", tasteProfile: { drySweet: 1, lightFull: 4, softTannic: 4, fruitySpicy: 3 }, imageFile: "nebbiolo-piemonte-2019.png", imageAlt: "Nebbiolo Langhe 2021", rating: 4.5, reviewCount: 87, inStock: true, stockQuantity: 34, isNew: false, isFeatured: false, hasAward: false },
  { handle: "amarone-della-valpolicella-2018", title: "Amarone della Valpolicella DOCG", description: "De legendarische Amarone - gedroogde druiven resulteren in een intense, volle wijn met smaken van gedroogde pruimen, chocolade en koffie.", collection: "Veneto Icons", wineType: "red", grapeVarieties: ["Corvina", "Rondinella", "Molinara"], country: "Italië", region: "Veneto", vintage: "2018", price: "54.99", compareAtPrice: "64.99", tasteProfile: { drySweet: 3, lightFull: 5, softTannic: 4, fruitySpicy: 5 }, imageFile: "amarone-valpolicella-2018.png", imageAlt: "Amarone della Valpolicella 2018", rating: 4.9, reviewCount: 203, inStock: true, stockQuantity: 6, isNew: false, isFeatured: true, hasAward: true, awardText: "95 Points" },
  { handle: "rubinelli-vajol-valpolicella-ripasso-2020", title: "Rubinelli Vajol Valpolicella Ripasso", description: "Een rijke Ripasso met de typische Valpolicella elegantie. Complexe aroma's van gedroogde kersen, rozijnen en amandel.", collection: "Veneto Selection", wineType: "red", grapeVarieties: ["Corvina", "Rondinella", "Molinara"], country: "Italië", region: "Veneto", vintage: "2020", price: "19.99", compareAtPrice: "24.99", tasteProfile: { drySweet: 2, lightFull: 5, softTannic: 4, fruitySpicy: 3 }, imageFile: "rubinelli-valpolicella-ripasso.png", imageAlt: "Rubinelli Vajol Valpolicella Ripasso 2020", rating: 4.8, reviewCount: 89, inStock: true, stockQuantity: 24, isNew: false, isFeatured: true, hasAward: true, awardText: "Best Buy" },
  { handle: "valpolicella-ripasso-superiore-2020", title: "Valpolicella Ripasso Superiore DOC", description: "Een rijke Ripasso gemaakt volgens de traditionele methode. Intense aroma's van gedroogde kersen, rozijnen, chocolade en kruiden.", collection: "Veneto Selection", wineType: "red", grapeVarieties: ["Corvina", "Rondinella", "Molinara"], country: "Italië", region: "Veneto", vintage: "2020", price: "22.50", tasteProfile: { drySweet: 2, lightFull: 5, softTannic: 3, fruitySpicy: 4 }, imageFile: "valpolicella-ripasso-2020.png", imageAlt: "Valpolicella Ripasso Superiore 2020", rating: 4.6, reviewCount: 78, inStock: true, stockQuantity: 32, isNew: true, isFeatured: false, hasAward: false },
  { handle: "tenuta-val-dombra-ombra-alta-2019", title: "Tenuta Val d'Ombra 'Ombra Alta'", description: "Een elegante Super Tuscan blend van Cabernet Sauvignon en Sangiovese. Complexe aroma's van cassis, kersen en cederhout.", collection: "Toscana Icons", wineType: "red", grapeVarieties: ["Cabernet Sauvignon", "Sangiovese"], country: "Italië", region: "Toscana", vintage: "2019", price: "34.99", tasteProfile: { drySweet: 1, lightFull: 5, softTannic: 4, fruitySpicy: 4 }, imageFile: "val-dombra-2019.png", imageAlt: "Tenuta Val d'Ombra 2019", rating: 4.7, reviewCount: 67, inStock: true, stockQuantity: 15, isNew: true, isFeatured: true, hasAward: true, awardText: "92 Points" },
  { handle: "teroldego-rotaliano-2020", title: "Teroldego Rotaliano DOC", description: "Een krachtige rode wijn uit Trentino met intense aroma's van zwarte kersen, bramen en kruiden.", collection: "Trentino Selection", wineType: "red", grapeVarieties: ["Teroldego"], country: "Italië", region: "Trentino-Alto Adige", vintage: "2020", price: "18.99", tasteProfile: { drySweet: 1, lightFull: 5, softTannic: 4, fruitySpicy: 4 }, imageFile: "teroldego-rotaliano-2020.png", imageAlt: "Teroldego Rotaliano DOC 2020", rating: 4.5, reviewCount: 42, inStock: true, stockQuantity: 24, isNew: true, isFeatured: false, hasAward: false },
  { handle: "refosco-dal-peduncolo-rosso-2021", title: "Refosco dal Peduncolo Rosso DOC", description: "Een karaktervolle rode wijn uit Friuli met diepe kleur en intense aroma's van donkere bessen, pruimen en violetten.", collection: "Friuli Selection", wineType: "red", grapeVarieties: ["Refosco dal Peduncolo Rosso"], country: "Italië", region: "Friuli-Venezia Giulia", vintage: "2021", price: "16.50", tasteProfile: { drySweet: 1, lightFull: 4, softTannic: 4, fruitySpicy: 4 }, imageFile: "refosco-2021.png", imageAlt: "Refosco dal Peduncolo Rosso 2021", rating: 4.4, reviewCount: 38, inStock: true, stockQuantity: 28, isNew: true, isFeatured: false, hasAward: false },
  { handle: "jo-primitivo-salento-2021", title: "Jo Primitivo Salento IGT", description: "Een moderne, elegante Primitivo. Intense aroma's van rijpe kersen, pruimen en specerijen.", collection: "Puglia Selection", wineType: "red", grapeVarieties: ["Primitivo"], country: "Italië", region: "Puglia", vintage: "2021", price: "14.99", tasteProfile: { drySweet: 3, lightFull: 4, softTannic: 3, fruitySpicy: 5 }, imageFile: "jo-primitivo.png", imageAlt: "Jo Primitivo Salento 2021", rating: 4.4, reviewCount: 156, inStock: true, stockQuantity: 48, isNew: false, isFeatured: false, hasAward: false },
  { handle: "san-marzano-primitivo-2022", title: "San Marzano Il Pumo Primitivo", description: "Een volle, ronde Primitivo van het gerenommeerde San Marzano wijnhuis.", collection: "Puglia Selection", wineType: "red", grapeVarieties: ["Primitivo"], country: "Italië", region: "Puglia", vintage: "2022", price: "11.99", compareAtPrice: "14.99", tasteProfile: { drySweet: 3, lightFull: 4, softTannic: 3, fruitySpicy: 5 }, imageFile: "san-marzano-primitivo.png", imageAlt: "San Marzano Il Pumo Primitivo 2022", rating: 4.3, reviewCount: 234, inStock: true, stockQuantity: 86, isNew: false, isFeatured: false, hasAward: false },
  { handle: "montaribaldi-langhe-chardonnay-2023", title: "Montaribaldi Langhe Chardonnay", description: "Een verfijnde Chardonnay uit de Langhe met frisse citrus, witte perzik en een subtiele hint van vanille.", collection: "Piemonte Classics", wineType: "white", grapeVarieties: ["Chardonnay"], country: "Italië", region: "Piemonte", vintage: "2023", price: "18.50", tasteProfile: { drySweet: 2, lightFull: 3, freshSoft: 4 }, imageFile: "montaribaldi-chardonnay.png", imageAlt: "Montaribaldi Langhe Chardonnay 2023", rating: 4.4, reviewCount: 45, inStock: true, stockQuantity: 28, isNew: true, isFeatured: true, hasAward: false },
  { handle: "pinot-grigio-delle-venezie-2022", title: "Pinot Grigio delle Venezie DOC", description: "Kristalhelder en elegant uit het noordoosten van Italië. Aroma's van witte perzik, peer en delicate bloesem.", collection: "Veneto Selection", wineType: "white", grapeVarieties: ["Pinot Grigio"], country: "Italië", region: "Veneto", vintage: "2022", price: "12.99", tasteProfile: { drySweet: 1, lightFull: 2, freshSoft: 5 }, imageFile: "pinot-grigio-venezie-2022.png", imageAlt: "Pinot Grigio delle Venezie 2022", rating: 4.5, reviewCount: 134, inStock: true, stockQuantity: 52, isNew: false, isFeatured: false, hasAward: false },
  { handle: "vermentino-toscana-2021", title: "Vermentino Toscana IGT", description: "Een frisse, aromatische witte wijn van de Toscaanse kust.", collection: "Toscana Classics", wineType: "white", grapeVarieties: ["Vermentino"], country: "Italië", region: "Toscana", vintage: "2021", price: "14.99", tasteProfile: { drySweet: 1, lightFull: 2, freshSoft: 5 }, imageFile: "vermentino-toscana-2021.png", imageAlt: "Vermentino Toscana IGT 2021", rating: 4.4, reviewCount: 62, inStock: true, stockQuantity: 40, isNew: true, isFeatured: false, hasAward: false },
  { handle: "bardolino-chiaretto-rose-2023", title: "Bardolino Chiaretto Rosé DOC", description: "Een elegante rosé van het Gardameer. Delicate aroma's van verse aardbeien, kersen en amandel.", collection: "Veneto Selection", wineType: "rose", grapeVarieties: ["Corvina", "Rondinella", "Molinara"], country: "Italië", region: "Veneto", vintage: "2023", price: "13.99", tasteProfile: { drySweet: 2, lightFull: 2, freshSoft: 5 }, imageFile: "bardolino-chiaretto-2023.png", imageAlt: "Bardolino Chiaretto Rosé 2023", rating: 4.4, reviewCount: 67, inStock: true, stockQuantity: 42, isNew: false, isFeatured: false, hasAward: false },
  { handle: "cerasuolo-dabruzzo-rose-2022", title: "Cerasuolo d'Abruzzo Rosé DOC", description: "Een intens gekleurde rosé met krachtige aroma's van rode kersen en aardbeien.", collection: "Abruzzo Selection", wineType: "rose", grapeVarieties: ["Montepulciano"], country: "Italië", region: "Abruzzo", vintage: "2022", price: "11.99", tasteProfile: { drySweet: 2, lightFull: 3, freshSoft: 4 }, imageFile: "cerasuolo-abruzzo-2022.png", imageAlt: "Cerasuolo d'Abruzzo Rosé 2022", rating: 4.3, reviewCount: 54, inStock: true, stockQuantity: 38, isNew: true, isFeatured: false, hasAward: false },
  { handle: "prosecco-superiore-valdobbiadene-brut", title: "Prosecco Superiore Valdobbiadene DOCG", description: "Premium Prosecco uit de heuvels van Valdobbiadene. Fijne perlage met aroma's van groene appel en witte bloemen.", collection: "Veneto Selection", wineType: "sparkling", grapeVarieties: ["Glera"], country: "Italië", region: "Veneto", vintage: "2023", price: "16.99", tasteProfile: { drySweet: 2, lightFull: 2, freshSoft: 5 }, imageFile: "prosecco-valdobbiadene.png", imageAlt: "Prosecco Superiore Valdobbiadene DOCG Brut", rating: 4.6, reviewCount: 189, inStock: true, stockQuantity: 64, isNew: false, isFeatured: true, hasAward: false },
  { handle: "asolo-prosecco-superiore-extra-brut", title: "Asolo Prosecco Superiore DOCG Extra Brut", description: "Een verfijnde, droge Prosecco uit de heuvels van Asolo. Elegante perlage met aroma's van groene appel en peer.", collection: "Veneto Selection", wineType: "sparkling", grapeVarieties: ["Glera"], country: "Italië", region: "Veneto", vintage: "2023", price: "19.99", tasteProfile: { drySweet: 1, lightFull: 2, freshSoft: 5 }, imageFile: "asolo-prosecco-2023.png", imageAlt: "Asolo Prosecco Superiore DOCG Extra Brut", rating: 4.6, reviewCount: 54, inStock: true, stockQuantity: 36, isNew: true, isFeatured: false, hasAward: false },
];

// --- Main ---

async function checkExisting(): Promise<Set<string>> {
  const handles = new Set<string>();
  const { data } = await adminGraphQL(`{
    products(first: 100) {
      edges { node { handle } }
    }
  }`);
  for (const edge of data?.products?.edges || []) {
    handles.add(edge.node.handle);
  }
  return handles;
}

function buildMetafields(w: WineProduct) {
  const mf: Array<{ namespace: string; key: string; value: string; type: string }> = [
    { namespace: "custom", key: "wine_type", value: w.wineType, type: "single_line_text_field" },
    { namespace: "custom", key: "grape_varieties", value: JSON.stringify(w.grapeVarieties), type: "list.single_line_text_field" },
    { namespace: "custom", key: "country", value: w.country, type: "single_line_text_field" },
    { namespace: "custom", key: "region", value: w.region, type: "single_line_text_field" },
    { namespace: "custom", key: "vintage", value: w.vintage, type: "single_line_text_field" },
    { namespace: "custom", key: "rating", value: w.rating.toString(), type: "number_decimal" },
    { namespace: "custom", key: "review_count", value: w.reviewCount.toString(), type: "number_integer" },
    { namespace: "custom", key: "is_featured", value: w.isFeatured.toString(), type: "boolean" },
    { namespace: "custom", key: "is_new", value: w.isNew.toString(), type: "boolean" },
    { namespace: "custom", key: "has_award", value: w.hasAward.toString(), type: "boolean" },
    { namespace: "custom", key: "collection_name", value: w.collection, type: "single_line_text_field" },
  ];
  if (w.awardText) mf.push({ namespace: "custom", key: "award_text", value: w.awardText, type: "single_line_text_field" });
  for (const [k, v] of Object.entries(w.tasteProfile)) {
    mf.push({ namespace: "custom", key: `taste_${k.replace(/([A-Z])/g, "_$1").toLowerCase()}`, value: v.toString(), type: "number_integer" });
  }
  return mf;
}

async function createProduct(w: WineProduct): Promise<string | null> {
  const tags = [w.wineType, w.region, ...w.grapeVarieties];
  if (w.isFeatured) tags.push("featured");
  if (w.isNew) tags.push("new");
  if (w.hasAward) tags.push("award");

  const { data } = await adminGraphQL(`
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product { id title variants(first: 1) { edges { node { id } } } }
        userErrors { field message }
      }
    }
  `, {
    input: {
      title: w.title,
      descriptionHtml: `<p>${w.description}</p>`,
      handle: w.handle,
      vendor: "Vino per Lei",
      productType: w.wineType === "sparkling" ? "Sparkling Wine" : w.wineType === "rose" ? "Rosé Wine" : w.wineType === "white" ? "White Wine" : "Red Wine",
      tags,
      metafields: buildMetafields(w),
    },
  });

  const result = data?.productCreate;
  if (result?.userErrors?.length) {
    console.error(`  Errors:`, result.userErrors);
    return null;
  }

  const productGid = result?.product?.id;
  const variantGid = result?.product?.variants?.edges?.[0]?.node?.id;

  // Set price
  if (variantGid) {
    await adminGraphQL(`
      mutation variantUpdate($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant { id }
          userErrors { field message }
        }
      }
    `, {
      input: {
        id: variantGid,
        price: w.price,
        ...(w.compareAtPrice ? { compareAtPrice: w.compareAtPrice } : {}),
      },
    });
  }

  return productGid;
}

async function uploadImage(productGid: string, w: WineProduct) {
  const productId = extractId(productGid);
  const imagePath = join(process.cwd(), "public", "wines", w.imageFile);

  try {
    const imageBuffer = readFileSync(imagePath);
    const base64 = imageBuffer.toString("base64");

    await adminREST(`/products/${productId}/images.json`, "POST", {
      image: {
        attachment: base64,
        filename: w.imageFile,
        alt: w.imageAlt,
      },
    });
  } catch (err) {
    console.error(`  Image upload failed for ${w.imageFile}:`, err);
  }
}

async function main() {
  console.log(`\n🍷 Shopify Setup — Vino per Lei`);
  console.log(`   Store: ${STORE}\n`);

  // Check existing
  console.log("Checking existing products...");
  const existing = await checkExisting();
  console.log(`  Found ${existing.size} existing product(s)\n`);

  let created = 0;
  let skipped = 0;

  for (const wine of wines) {
    if (existing.has(wine.handle)) {
      console.log(`[SKIP] ${wine.title} (already exists)`);
      skipped++;
      continue;
    }

    process.stdout.write(`[CREATE] ${wine.title}...`);
    const productGid = await createProduct(wine);

    if (productGid) {
      process.stdout.write(" uploading image...");
      await uploadImage(productGid, wine);
      console.log(" done");
      created++;
    } else {
      console.log(" FAILED");
    }

    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n--- Summary ---`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total in store: ${existing.size + created}`);
  console.log(`\nDone! Check: https://admin.shopify.com/store/vino-per-lei-2/products\n`);
}

main().catch(console.error);
