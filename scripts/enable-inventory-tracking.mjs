/**
 * Enable inventory tracking on all products and set initial stock.
 *
 * PREREQUISITES:
 * 1. Go to Shopify Admin → Settings → Apps and sales channels → "Headless" (or your app)
 * 2. Click "Configure" → API permissions
 * 3. Enable these scopes:
 *    - read_inventory
 *    - write_inventory
 *    - read_locations
 * 4. Save and get the new Admin API token
 * 5. Update SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local
 *
 * ALSO enable on Storefront API token:
 * - unauthenticated_read_product_inventory
 *
 * Usage: node scripts/enable-inventory-tracking.mjs [initial_stock]
 * Example: node scripts/enable-inventory-tracking.mjs 48
 */

import 'dotenv/config';

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const INITIAL_STOCK = parseInt(process.argv[2] || '48', 10);

if (!DOMAIN || !TOKEN) {
  console.error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

async function adminQuery(query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function main() {
  console.log(`\n🍷 Vino per Lei — Inventory Setup`);
  console.log(`   Initial stock per product: ${INITIAL_STOCK} flessen\n`);

  // Step 1: Get all products with inventory items
  console.log('📦 Fetching products...');
  const { data, errors } = await adminQuery(`{
    products(first: 50) {
      edges {
        node {
          title
          variants(first: 10) {
            edges {
              node {
                id
                inventoryItem {
                  id
                  tracked
                }
              }
            }
          }
        }
      }
    }
  }`);

  if (errors) {
    console.error('❌ Error fetching products:', errors[0].message);
    process.exit(1);
  }

  const products = data.products.edges.map(e => e.node);
  console.log(`   Found ${products.length} products\n`);

  // Step 2: Enable tracking on each inventory item
  console.log('🔄 Enabling inventory tracking...');
  for (const product of products) {
    for (const ve of product.variants.edges) {
      const inventoryItemId = ve.node.inventoryItem.id;
      const tracked = ve.node.inventoryItem.tracked;

      if (tracked) {
        console.log(`   ✅ ${product.title} — already tracked`);
        continue;
      }

      const result = await adminQuery(`
        mutation enableTracking($id: ID!) {
          inventoryItemUpdate(id: $id, input: { tracked: true }) {
            inventoryItem { id tracked }
            userErrors { field message }
          }
        }
      `, { id: inventoryItemId });

      if (result.errors) {
        console.error(`   ❌ ${product.title} — ${result.errors[0].message}`);
        continue;
      }

      const ue = result.data?.inventoryItemUpdate?.userErrors;
      if (ue?.length) {
        console.error(`   ❌ ${product.title} — ${ue[0].message}`);
      } else {
        console.log(`   ✅ ${product.title} — tracking enabled`);
      }
    }
  }

  // Step 3: Get location ID
  console.log('\n📍 Fetching location...');
  const locResult = await adminQuery(`{ locations(first: 1) { edges { node { id name } } } }`);

  if (locResult.errors) {
    console.error('❌ Cannot fetch locations:', locResult.errors[0].message);
    console.log('\n⚠️  Tracking is enabled but stock not set.');
    console.log('   Manually set stock in Shopify Admin → Products → [product] → Inventory');
    process.exit(0);
  }

  const locationId = locResult.data.locations.edges[0]?.node?.id;
  if (!locationId) {
    console.error('❌ No location found');
    process.exit(1);
  }
  console.log(`   Location: ${locResult.data.locations.edges[0].node.name} (${locationId})`);

  // Step 4: Set inventory quantities
  console.log(`\n📊 Setting stock to ${INITIAL_STOCK} per variant...`);
  for (const product of products) {
    for (const ve of product.variants.edges) {
      const inventoryItemId = ve.node.inventoryItem.id;

      const result = await adminQuery(`
        mutation setQuantity($input: InventorySetQuantitiesInput!) {
          inventorySetQuantities(input: $input) {
            inventoryAdjustmentGroup { reason }
            userErrors { field message }
          }
        }
      `, {
        input: {
          name: "available",
          reason: "correction",
          quantities: [{
            inventoryItemId,
            locationId,
            quantity: INITIAL_STOCK,
          }],
        },
      });

      if (result.errors) {
        console.error(`   ❌ ${product.title} — ${result.errors[0].message}`);
      } else {
        const ue = result.data?.inventorySetQuantities?.userErrors;
        if (ue?.length) {
          console.error(`   ❌ ${product.title} — ${ue[0].message}`);
        } else {
          console.log(`   ✅ ${product.title} — ${INITIAL_STOCK} flessen`);
        }
      }
    }
  }

  console.log('\n✨ Done! Inventory tracking is now active.');
  console.log('   Products with stock > 0 show "Op voorraad"');
  console.log('   Products with stock <= 5 show "Nog X flessen"');
  console.log('   Products with stock = 0 show "Uitverkocht" + "Mail bij voorraad"');
}

main().catch(console.error);
