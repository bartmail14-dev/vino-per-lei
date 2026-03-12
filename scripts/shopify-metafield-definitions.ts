import { config } from "dotenv";
config({ path: ".env.local" });

const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const API_VERSION = "2025-01";

if (!STORE || !TOKEN) {
  console.error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

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

interface MetafieldDef {
  name: string;
  namespace: string;
  key: string;
  type: string;
  description: string;
  pin?: boolean;
  validations?: Array<{ name: string; value: string }>;
}

const definitions: MetafieldDef[] = [
  // --- Wijn basis ---
  {
    name: "Wijntype",
    namespace: "custom",
    key: "wine_type",
    type: "single_line_text_field",
    description: "Type wijn: red, white, rose, sparkling",
    pin: true,
  },
  {
    name: "Druivensoorten",
    namespace: "custom",
    key: "grape_varieties",
    type: "list.single_line_text_field",
    description: "Lijst van druivensoorten (bijv. Nebbiolo, Corvina)",
    pin: true,
  },
  {
    name: "Land",
    namespace: "custom",
    key: "country",
    type: "single_line_text_field",
    description: "Land van herkomst",
  },
  {
    name: "Regio",
    namespace: "custom",
    key: "region",
    type: "single_line_text_field",
    description: "Wijnregio (bijv. Piemonte, Veneto, Toscana)",
    pin: true,
  },
  {
    name: "Jaargang",
    namespace: "custom",
    key: "vintage",
    type: "single_line_text_field",
    description: "Jaargang van de wijn",
    pin: true,
  },
  {
    name: "Collectie",
    namespace: "custom",
    key: "collection_name",
    type: "single_line_text_field",
    description: "Collectienaam (bijv. Piemonte Icons, Veneto Selection)",
  },

  // --- Beoordeling ---
  {
    name: "Beoordeling",
    namespace: "custom",
    key: "rating",
    type: "number_decimal",
    description: "Gemiddelde beoordeling (bijv. 4.5)",
    pin: true,
  },
  {
    name: "Aantal reviews",
    namespace: "custom",
    key: "review_count",
    type: "number_integer",
    description: "Totaal aantal reviews",
  },

  // --- Flags ---
  {
    name: "Uitgelicht",
    namespace: "custom",
    key: "is_featured",
    type: "boolean",
    description: "Toon op de homepage als uitgelichte wijn",
  },
  {
    name: "Nieuw",
    namespace: "custom",
    key: "is_new",
    type: "boolean",
    description: "Markeer als nieuw in de winkel",
  },
  {
    name: "Heeft award",
    namespace: "custom",
    key: "has_award",
    type: "boolean",
    description: "Heeft deze wijn een award/onderscheiding?",
  },
  {
    name: "Award tekst",
    namespace: "custom",
    key: "award_text",
    type: "single_line_text_field",
    description: "Award beschrijving (bijv. Gold Medal, 95 Points)",
  },

  // --- Smaakprofiel (schaal 1-5) ---
  {
    name: "Smaak: Droog - Zoet",
    namespace: "custom",
    key: "taste_dry_sweet",
    type: "number_integer",
    description: "Smaakschaal 1 (droog) tot 5 (zoet)",
    pin: true,
    validations: [
      { name: "min", value: "1" },
      { name: "max", value: "5" },
    ],
  },
  {
    name: "Smaak: Licht - Vol",
    namespace: "custom",
    key: "taste_light_full",
    type: "number_integer",
    description: "Smaakschaal 1 (licht) tot 5 (vol)",
    pin: true,
    validations: [
      { name: "min", value: "1" },
      { name: "max", value: "5" },
    ],
  },
  {
    name: "Smaak: Zacht - Tannine",
    namespace: "custom",
    key: "taste_soft_tannic",
    type: "number_integer",
    description: "Smaakschaal 1 (zacht) tot 5 (veel tannine) — alleen rood",
    pin: true,
    validations: [
      { name: "min", value: "1" },
      { name: "max", value: "5" },
    ],
  },
  {
    name: "Smaak: Fruitig - Kruidig",
    namespace: "custom",
    key: "taste_fruity_spicy",
    type: "number_integer",
    description: "Smaakschaal 1 (fruitig) tot 5 (kruidig) — alleen rood",
    pin: true,
    validations: [
      { name: "min", value: "1" },
      { name: "max", value: "5" },
    ],
  },
  {
    name: "Smaak: Fris - Zacht",
    namespace: "custom",
    key: "taste_fresh_soft",
    type: "number_integer",
    description: "Smaakschaal 1 (fris) tot 5 (zacht) — wit, rosé, sparkling",
    pin: true,
    validations: [
      { name: "min", value: "1" },
      { name: "max", value: "5" },
    ],
  },
];

async function createDefinition(def: MetafieldDef) {
  const { data } = await adminGraphQL(
    `mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id name }
        userErrors { field message code }
      }
    }`,
    {
      definition: {
        name: def.name,
        namespace: def.namespace,
        key: def.key,
        type: def.type,
        description: def.description,
        ownerType: "PRODUCT",
        pin: def.pin ?? false,
        ...(def.validations ? { validations: def.validations } : {}),
      },
    }
  );

  return data?.metafieldDefinitionCreate;
}

async function main() {
  console.log(`\n🍷 Shopify Metafield Definitions — Vino per Lei`);
  console.log(`   Store: ${STORE}\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const def of definitions) {
    process.stdout.write(`  [${def.key}] ${def.name}...`);
    const result = await createDefinition(def);

    if (result?.createdDefinition) {
      console.log(" OK");
      created++;
    } else if (result?.userErrors?.length) {
      const alreadyExists = result.userErrors.some(
        (e: { code: string }) => e.code === "TAKEN" || e.code === "DUPLICATE_OPTION"
      );
      if (alreadyExists) {
        console.log(" already exists, skipped");
        skipped++;
      } else {
        console.log(` FAILED: ${result.userErrors.map((e: { message: string }) => e.message).join(", ")}`);
        failed++;
      }
    } else {
      console.log(" FAILED (unknown error)");
      failed++;
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n--- Summary ---`);
  console.log(`Created: ${created}`);
  console.log(`Skipped (already exist): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`\nDone! Check product editor: https://admin.shopify.com/store/vino-per-lei-2/products`);
  console.log(`Gepinde velden verschijnen direct in de producteditor.\n`);
}

main().catch(console.error);
