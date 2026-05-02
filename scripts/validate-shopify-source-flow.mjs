import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

const root = process.cwd();
dotenv.config({ path: path.join(root, ".env.local") });
const outputDir = path.join(root, "content-audit");
const reportPath = path.join(outputDir, "shopify-source-flow-extended.json");
const baseUrl = process.env.VPL_TEST_BASE_URL || "http://localhost:3099";
const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!storeDomain || !storefrontToken || !adminToken) {
  throw new Error("Missing Shopify environment variables.");
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

async function storefrontGraphql(query, variables = {}) {
  const response = await fetch(`https://${storeDomain}/api/2026-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchHtml(route) {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) throw new Error(`${route} returned ${response.status}`);
  return response.text();
}

async function waitForMarkers(route, markers, attempts = 12) {
  let lastHtml = "";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    lastHtml = await fetchHtml(route);
    const missing = markers.filter((marker) => !lastHtml.includes(marker));
    if (missing.length === 0) return;
    await wait(2500);
  }
  throw new Error(`${route} missing markers: ${markers.filter((marker) => !lastHtml.includes(marker)).join(", ")}`);
}

function fieldMap(fields) {
  return Object.fromEntries(fields.map((field) => [field.key, field.value]));
}

async function getMetaobjects(type) {
  const nodes = [];
  let after = null;

  do {
    const data = await adminGraphql(
      `query Metaobjects($type: String!, $after: String) {
        metaobjects(type: $type, first: 250, after: $after) {
          nodes { id handle fields { key value } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { type, after },
    );
    nodes.push(...data.metaobjects.nodes);
    after = data.metaobjects.pageInfo.hasNextPage ? data.metaobjects.pageInfo.endCursor : null;
  } while (after);

  return nodes;
}

async function updateMetaobject(id, fields) {
  const data = await adminGraphql(
    `mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
      metaobjectUpdate(id: $id, metaobject: $metaobject) {
        metaobject { id handle }
        userErrors { field message }
      }
    }`,
    { id, metaobject: { fields } },
  );
  const errors = data.metaobjectUpdate.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
}

async function getProduct(handle) {
  const data = await adminGraphql(
    `query Product($query: String!) {
      products(first: 1, query: $query) {
        nodes {
          id title handle descriptionHtml vendor productType tags
          seo { title description }
          variants(first: 10) {
            nodes { id title price compareAtPrice }
          }
          metafields(first: 100) { nodes { id namespace key value type } }
        }
      }
    }`,
    { query: `handle:${handle}` },
  );
  const product = data.products.nodes[0];
  if (!product) throw new Error(`Product not found: ${handle}`);
  return product;
}

async function storefrontProduct(handle) {
  const data = await storefrontGraphql(
    `query Product($handle: String!) {
      product(handle: $handle) {
        title
        description
        vendor
        productType
        tags
        seo { title description }
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { maxVariantPrice { amount currencyCode } }
      }
    }`,
    { handle },
  );
  if (!data.product) throw new Error(`Storefront product not found: ${handle}`);
  return data.product;
}

async function waitForStorefrontProductMarkers(handle, markers, attempts = 16) {
  let lastPayload = "";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    lastPayload = JSON.stringify(await storefrontProduct(handle));
    const missing = markers.filter((marker) => !lastPayload.includes(marker));
    if (missing.length === 0) return;
    await wait(2500);
  }
  throw new Error(`Storefront product ${handle} missing markers: ${markers.filter((marker) => !lastPayload.includes(marker)).join(", ")}`);
}

async function updateProduct(input) {
  const data = await adminGraphql(
    `mutation UpdateProduct($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product { id title handle }
        userErrors { field message }
      }
    }`,
    { product: input },
  );
  const errors = data.productUpdate.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
}

async function updateVariants(productId, variants) {
  const data = await adminGraphql(
    `mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id price compareAtPrice }
        userErrors { field message }
      }
    }`,
    { productId, variants },
  );
  const errors = data.productVariantsBulkUpdate.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
}

async function setMetafields(metafields) {
  const data = await adminGraphql(
    `mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }`,
    { metafields },
  );
  const errors = data.metafieldsSet.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
  return data.metafieldsSet.metafields;
}

async function deleteMetafield(ownerId, namespace, key) {
  const data = await adminGraphql(
    `mutation DeleteMetafields($metafields: [MetafieldIdentifierInput!]!) {
      metafieldsDelete(metafields: $metafields) {
        deletedMetafields { ownerId namespace key }
        userErrors { field message }
      }
    }`,
    { metafields: [{ ownerId, namespace, key }] },
  );
  const errors = data.metafieldsDelete.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors));
}

function resultRecords(group, route, source, markers) {
  return markers.map((marker) => ({
    status: "passed",
    group,
    route,
    source,
    marker,
  }));
}

function restoreProductInput(product) {
  return {
    id: product.id,
    title: product.title,
    descriptionHtml: product.descriptionHtml,
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags,
    seo: {
      title: product.seo?.title ?? "",
      description: product.seo?.description ?? "",
    },
  };
}

async function runMetaobjectGroup({ group, type, handle, route, updates }) {
  const object = (await getMetaobjects(type)).find((node) => node.handle === handle);
  if (!object) throw new Error(`Metaobject not found: ${type}/${handle}`);
  const original = fieldMap(object.fields);
  const rollbackFields = updates.map((update) => ({ key: update.key, value: original[update.key] ?? "" }));
  const changedFields = updates.map((update) => ({ key: update.key, value: update.value }));
  const markers = updates.map((update) => update.marker ?? update.value);

  try {
    await updateMetaobject(object.id, changedFields);
    await waitForMarkers(route, markers);
    return resultRecords(group, route, `${type}/${handle}`, markers);
  } finally {
    await updateMetaobject(object.id, rollbackFields);
    await wait(1000);
  }
}

async function runProductGroup() {
  const product = await getProduct("gavi");
  const originalByKey = Object.fromEntries(
    product.metafields.nodes
      .filter((field) => field.namespace === "custom")
      .map((field) => [field.key, field]),
  );
  const updates = [
    ["serving_temperature", "11-12C VPLPDP01"],
    ["decant_time", "VPLPDP02 decanteren"],
    ["decant_note", "VPLPDP03 decant note"],
    ["alcohol_percentage", "VPLPDP04 13procent"],
    ["bottle_volume", "VPLPDP05 751ml"],
    ["closure", "VPLPDP06 testkurk"],
    ["allergens", "VPLPDP07 allergenen"],
    ["legal_notice", "VPLPDP08 legal notice"],
    ["vinification", "VPLPDP09 vinificatie"],
    ["storage_advice", "VPLPDP10 opslagregel\nVPLPDP11 tweede opslagregel"],
    ["producer_story", "VPLPDP12 producent"],
    ["food_pairing", "VPLPDP13 gerecht, VPLPDP14 tweede gerecht"],
    ["region", "VPLPDP16 regio"],
    ["grape_varieties", JSON.stringify(["VPLPDP17 druif"])],
  ];
  const changed = updates.map(([key, value]) => {
    const original = originalByKey[key];
    if (!original) throw new Error(`Missing product metafield custom.${key}`);
    return {
      ownerId: product.id,
      namespace: "custom",
      key,
      type: original.type,
      value,
    };
  });
  const rollback = updates.map(([key]) => {
    const original = originalByKey[key];
    return {
      ownerId: product.id,
      namespace: "custom",
      key,
      type: original.type,
      value: original.value,
    };
  });
  const markers = [
    "VPLPDP01",
    "VPLPDP02",
    "VPLPDP03",
    "VPLPDP04",
    "VPLPDP05",
    "VPLPDP06",
    "VPLPDP07",
    "VPLPDP09",
    "VPLPDP10",
    "VPLPDP11",
    "VPLPDP12",
    "VPLPDP13",
    "VPLPDP14",
    "VPLPDP16",
    "VPLPDP17",
  ];

  try {
    await setMetafields(changed);
    await waitForMarkers("/wijnen/gavi", markers);
    return resultRecords("product-metafields-gavi", "/wijnen/gavi", "Product/Gavi custom metafields", markers);
  } finally {
    await setMetafields(rollback);
    await wait(1000);
  }
}

async function runProductCoreGroup() {
  const product = await getProduct("gavi");
  const htmlMarkers = ["VPLPROD01 Gavi", "VPLPROD02 omschrijving"];
  const apiMarkers = [
    "VPLPROD01 Gavi",
    "VPLPROD02 omschrijving",
    "VPLPROD03 vendor",
    "VPLPROD04 producttype",
    "VPLPROD05 tag",
    "VPLPROD06 seo titel",
    "VPLPROD07 seo omschrijving",
  ];

  try {
    await updateProduct({
      id: product.id,
      title: "VPLPROD01 Gavi",
      descriptionHtml: "<p>VPLPROD02 omschrijving vanuit Shopify productomschrijving.</p>",
      vendor: "VPLPROD03 vendor",
      productType: "VPLPROD04 producttype",
      tags: [...new Set([...(product.tags ?? []), "VPLPROD05 tag"])],
      seo: {
        title: "VPLPROD06 seo titel",
        description: "VPLPROD07 seo omschrijving",
      },
    });
    await waitForMarkers("/wijnen/gavi", htmlMarkers, 20);
    await waitForStorefrontProductMarkers("gavi", apiMarkers, 20);
    return [
      ...resultRecords("product-core-gavi-html", "/wijnen/gavi", "Product/Gavi title + description", htmlMarkers),
      ...resultRecords("product-core-gavi-storefront-api", "storefront-api:product(gavi)", "Product/Gavi core fields", apiMarkers),
    ];
  } finally {
    await updateProduct(restoreProductInput(product));
    await wait(1000);
  }
}

async function runProductVariantPriceGroup() {
  const product = await getProduct("gavi");
  const variant = product.variants.nodes[0];
  if (!variant) throw new Error("Gavi has no variant to test.");
  const markers = ["123,45", "150,00"];

  try {
    await updateVariants(product.id, [
      { id: variant.id, price: "123.45", compareAtPrice: "150.00" },
    ]);
    await waitForMarkers("/wijnen/gavi", markers, 20);
    await waitForStorefrontProductMarkers("gavi", ["123.45", "150.0"], 20);
    return [
      ...resultRecords("product-variant-price-gavi-html", "/wijnen/gavi", "Product/Gavi variant price", markers),
      ...resultRecords("product-variant-price-gavi-storefront-api", "storefront-api:product(gavi)", "Product/Gavi variant price", ["123.45", "150.0"]),
    ];
  } finally {
    await updateVariants(product.id, [
      {
        id: variant.id,
        price: String(variant.price),
        compareAtPrice: variant.compareAtPrice == null ? null : String(variant.compareAtPrice),
      },
    ]);
    await wait(1000);
  }
}

async function runProductMerchandisingGroup() {
  const product = await getProduct("gavi");
  const originalByKey = Object.fromEntries(
    product.metafields.nodes
      .filter((field) => field.namespace === "custom")
      .map((field) => [field.key, field]),
  );
  const updates = [
    ["country", "VPLCOUNTRY01 land", "single_line_text_field"],
    ["region", "VPLREGION01 streek", "single_line_text_field"],
    ["vintage", "2039", "single_line_text_field"],
    ["rating", "4.9", "number_decimal"],
    ["review_count", "123", "number_integer"],
    ["collection_name", "VPLCOLL01 collectie", "single_line_text_field"],
    ["is_new", "true", "boolean"],
    ["has_award", "true", "boolean"],
    ["award_text", "VPLAWARD01 prijs", "single_line_text_field"],
    ["food_pairing", "VPLFOOD01 gerecht, VPLFOOD02 gerecht", "multi_line_text_field"],
    ["price_unit_label", "per VPLFLES", "single_line_text_field"],
    ["order_minimum", "12", "number_integer"],
    ["order_increment", "6", "number_integer"],
    ["order_unit_label", "VPLDOOS", "single_line_text_field"],
    ["order_unit_size", "6", "number_integer"],
  ];
  const changed = updates.map(([key, value, fallbackType]) => {
    const original = originalByKey[key];
    return {
      ownerId: product.id,
      namespace: "custom",
      key,
      type: original?.type ?? fallbackType,
      value,
    };
  });
  const rollback = updates
    .filter(([key]) => originalByKey[key])
    .map(([key]) => {
      const original = originalByKey[key];
      return {
        ownerId: product.id,
        namespace: "custom",
        key,
        type: original.type,
        value: original.value,
      };
    });
  const createdKeys = new Set(updates.filter(([key]) => !originalByKey[key]).map(([key]) => key));
  let createdMetafields = [];
  const htmlMarkers = [
    "VPLCOUNTRY01",
    "VPLREGION01",
    "2039",
    "VPLCOLL01",
    "VPLAWARD01",
    "VPLFOOD01",
    "VPLFOOD02",
    "VPLFLES",
    "VPLDOOS",
  ];

  try {
    const updatedMetafields = await setMetafields(changed);
    createdMetafields = updatedMetafields.filter((field) => createdKeys.has(field.key));
    await waitForMarkers("/wijnen/gavi", htmlMarkers, 20);
    return resultRecords("product-merchandising-gavi", "/wijnen/gavi", "Product/Gavi merchandising + order metafields", htmlMarkers);
  } finally {
    if (rollback.length > 0) {
      await setMetafields(rollback);
    }
    for (const field of createdMetafields) {
      await deleteMetafield(product.id, "custom", field.key);
    }
    await wait(1000);
  }
}

async function runUiCopyGroup() {
  const checks = [
    ["home-featured-title", "/", "VPLUI01 favorieten"],
    ["home-regions-body", "/", "VPLUI02 regio body"],
    ["collection-heading-default", "/wijnen", "VPLUI03 collectie"],
    ["collection-seo-title", "/wijnen", "VPLUI04 seo titel"],
    ["faq-title", "/klantenservice/faq", "VPLUI05 faq titel"],
    ["faq-cta-title", "/klantenservice/faq", "VPLUI06 faq cta"],
    ["blog-title", "/blog", "VPLUI07 blog titel"],
    ["blog-intro", "/blog", "VPLUI08 blog intro"],
  ];
  const results = [];

  for (const [handle, route, marker] of checks) {
    results.push(...await runMetaobjectGroup({
      group: `ui-copy-${handle}`,
      type: "ui_copy",
      handle,
      route,
      updates: [
        { key: "value", value: marker },
      ],
    }));
  }

  return results;
}

async function ensurePageContentObjects() {
  const data = await storefrontGraphql(
    `query {
      klantenservice: metaobject(handle: { type: "page_content", handle: "klantenservice" }) { handle }
      cadeaus: metaobject(handle: { type: "page_content", handle: "cadeaus" }) { handle }
      handleiding: metaobject(handle: { type: "page_content", handle: "handleiding" }) { handle }
    }`,
  );
  for (const [key, value] of Object.entries(data)) {
    if (!value) throw new Error(`Missing page_content metaobject: ${key}`);
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  await ensurePageContentObjects();
  const results = [];

  results.push(...await runMetaobjectGroup({
    group: "homepage-hero",
    type: "homepage_hero",
    handle: "main",
    route: "/",
    updates: [
      { key: "subtitle", value: "VPLHOME01 subtitle" },
      { key: "title_line_1", value: "VPLHOME02 titel een" },
      { key: "title_line_2", value: "VPLHOME03 titel twee" },
      { key: "description", value: "VPLHOME04 beschrijving" },
      { key: "cta_primary_text", value: "VPLHOME05 knop" },
      { key: "cta_secondary_text", value: "VPLHOME06 tweede knop" },
    ],
  }));

  const uspItems = (await getMetaobjects("usp_item")).sort((a, b) => Number(fieldMap(a.fields).sort_order || 0) - Number(fieldMap(b.fields).sort_order || 0)).slice(0, 4);
  for (let index = 0; index < uspItems.length; index += 1) {
    const item = uspItems[index];
    const n = index + 1;
    results.push(...await runMetaobjectGroup({
      group: `usp-${n}`,
      type: "usp_item",
      handle: item.handle,
      route: "/",
      updates: [
        { key: "title", value: `VPLUSP${n}A titel` },
        { key: "subtitle", value: `VPLUSP${n}B subtitel` },
      ],
    }));
  }

  const stats = (await getMetaobjects("homepage_stat")).sort((a, b) => Number(fieldMap(a.fields).sort_order || 0) - Number(fieldMap(b.fields).sort_order || 0)).slice(0, 4);
  for (let index = 0; index < stats.length; index += 1) {
    const item = stats[index];
    const n = index + 1;
    results.push(...await runMetaobjectGroup({
      group: `homepage-stat-${n}`,
      type: "homepage_stat",
      handle: item.handle,
      route: "/",
      updates: [
        { key: "value", value: String(910 + n), marker: String(910 + n) },
        { key: "label", value: `VPLSTAT${n} label` },
      ],
    }));
  }

  const faqItems = (await getMetaobjects("faq_item")).sort((a, b) => Number(fieldMap(a.fields).sort_order || 0) - Number(fieldMap(b.fields).sort_order || 0)).slice(0, 4);
  for (let index = 0; index < faqItems.length; index += 1) {
    const item = faqItems[index];
    const n = index + 1;
    results.push(...await runMetaobjectGroup({
      group: `faq-${n}`,
      type: "faq_item",
      handle: item.handle,
      route: "/klantenservice/faq",
      updates: [
        { key: "question", value: `VPLFAQ${n}A vraag` },
        { key: "answer", value: `VPLFAQ${n}B antwoord` },
      ],
    }));
  }

  const pages = [
    ["klantenservice", "/klantenservice", "VPLPAGE01"],
    ["handleiding", "/handleiding", "VPLPAGE03"],
  ];
  for (const [handle, route, marker] of pages) {
    results.push(...await runMetaobjectGroup({
      group: `page-content-${handle}`,
      type: "page_content",
      handle,
      route,
      updates: [
        { key: "title", value: `${marker} titel` },
        { key: "body", value: `<h2>${marker} bodykop</h2><p>${marker} bodytekst</p>`, marker },
      ],
    }));
  }

  results.push(...await runProductCoreGroup());
  results.push(...await runProductVariantPriceGroup());
  results.push(...await runProductGroup());
  results.push(...await runProductMerchandisingGroup());
  results.push(...await runUiCopyGroup());

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    passed: results.length,
    failed: 0,
    results,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    passed: 0,
    failed: 1,
    error: error instanceof Error ? error.message : String(error),
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.error(report.error);
  process.exitCode = 1;
});
