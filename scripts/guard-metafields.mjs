// Guard: every custom.* product metafield the site reads must have a
// Shopify metafield definition, and that definition must be PINNED so it
// shows inline on the product page in Shopify admin (Carla's editing UI).
//
// Why: definitions created via the Admin API default to pin=false. Unpinned
// definitions are invisible on products without values, so new products
// appear to have "no fields" in admin. This guard self-heals (re-pins) and
// fails the build only when a definition is missing entirely.
//
// Runs in prebuild. Skips with a warning when the Admin API is unreachable
// or the token is absent, so offline builds keep working.

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
} catch {
  // dotenv not installed in this environment; rely on process env (Vercel)
}

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = "2026-01";

if (!DOMAIN || !TOKEN) {
  console.warn("[guard-metafields] SKIP — geen store-domein of admin-token in env");
  process.exit(0);
}

// Source of truth: the metafield keys the storefront actually queries.
const shopifyTs = readFileSync(
  path.join(process.cwd(), "src", "lib", "shopify.ts"),
  "utf8"
);
const siteKeys = [
  ...new Set(
    [...shopifyTs.matchAll(/metafield\(namespace:\s*"custom",\s*key:\s*"([^"]+)"\)/g)].map(
      (m) => m[1]
    )
  ),
];

if (siteKeys.length < 20) {
  console.error(
    `[guard-metafields] FOUT — maar ${siteKeys.length} metafield-keys gevonden in src/lib/shopify.ts; parser kapot of query drastisch veranderd. Pas dit script aan.`
  );
  process.exit(1);
}

async function adminGQL(query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

let defs;
try {
  const data = await adminGQL(`{
    metafieldDefinitions(first: 100, ownerType: PRODUCT) {
      nodes { id key namespace pinnedPosition }
    }
  }`);
  defs = data.metafieldDefinitions.nodes.filter((d) => d.namespace === "custom");
} catch (e) {
  console.warn(`[guard-metafields] SKIP — Admin API onbereikbaar (${e.message})`);
  process.exit(0);
}

const byKey = new Map(defs.map((d) => [d.key, d]));
const missing = siteKeys.filter((k) => !byKey.has(k));
const unpinned = siteKeys
  .map((k) => byKey.get(k))
  .filter((d) => d && d.pinnedPosition == null);

let pinFailures = 0;
for (const def of unpinned) {
  try {
    const data = await adminGQL(
      `mutation($id: ID!) {
        metafieldDefinitionPin(definitionId: $id) {
          pinnedDefinition { key pinnedPosition }
          userErrors { message code }
        }
      }`,
      { id: def.id }
    );
    const errs = data.metafieldDefinitionPin.userErrors;
    if (errs?.length) {
      console.error(`[guard-metafields] herpinnen MISLUKT custom.${def.key}: ${errs[0].message}`);
      pinFailures++;
    } else {
      console.warn(`[guard-metafields] custom.${def.key} was unpinned — automatisch herpind`);
    }
  } catch (e) {
    console.error(`[guard-metafields] herpinnen MISLUKT custom.${def.key}: ${e.message}`);
    pinFailures++;
  }
}

if (missing.length || pinFailures) {
  if (missing.length) {
    console.error(
      `[guard-metafields] FOUT — definitie ONTBREEKT in Shopify voor: ${missing
        .map((k) => `custom.${k}`)
        .join(", ")}\n  Site leest deze velden maar Carla kan ze niet invullen. Maak de definitie aan (Shopify admin > Settings > Custom data > Products) of via metafieldDefinitionCreate met pin: true.`
    );
  }
  process.exit(1);
}

console.log(
  `[guard-metafields] OK — ${siteKeys.length} site-keys, alle definities aanwezig en gepind${
    unpinned.length ? ` (${unpinned.length} herpind)` : ""
  }`
);
