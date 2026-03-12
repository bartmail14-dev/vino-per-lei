import { config } from "dotenv";
config({ path: ".env.local" });

const STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const API_VERSION = "2025-01";

// --- CHANGE THIS to your actual Vercel/custom domain ---
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vino-per-lei.vercel.app";

if (!STORE || !TOKEN) {
  console.error("Missing env vars in .env.local");
  process.exit(1);
}

async function adminREST(endpoint: string, method = "GET", body?: unknown) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

// --- Theme files ---

const themeFiles: Record<string, string> = {
  // Main layout — handles all redirects
  "layout/theme.liquid": `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vino per Lei — Redirect</title>
  {{ content_for_header }}
  <script>
    (function() {
      var base = "${SITE_URL}";
      var path = window.location.pathname;
      var dest = base;

      // Product page: /products/handle → /wijnen/handle
      var productMatch = path.match(/^\\/products\\/(.+)/);
      if (productMatch) {
        dest = base + "/wijnen/" + productMatch[1];
      }
      // Collection page → /wijnen
      else if (path.match(/^\\/collections/)) {
        dest = base + "/wijnen";
      }
      // Blog → /blog
      else if (path.match(/^\\/blogs/)) {
        dest = base + "/blog";
      }
      // Cart → /checkout
      else if (path === "/cart") {
        dest = base + "/checkout";
      }
      // Pages
      else if (path === "/pages/over-ons") {
        dest = base + "/over-ons";
      }
      else if (path === "/pages/cadeaus") {
        dest = base + "/cadeaus";
      }
      else if (path === "/pages/offerte") {
        dest = base + "/offerte";
      }
      // Homepage
      else if (path === "/" || path === "") {
        dest = base;
      }
      // Fallback: homepage
      else {
        dest = base;
      }

      window.location.replace(dest);
    })();
  </script>
</head>
<body>
  <noscript>
    <meta http-equiv="refresh" content="0;url=${SITE_URL}">
    <p>Redirecting to <a href="${SITE_URL}">Vino per Lei</a>...</p>
  </noscript>
  {{ content_for_layout }}
</body>
</html>`,

  // Minimal required templates
  "templates/index.liquid": "<!-- redirect handled by layout -->",
  "templates/product.liquid": "<!-- redirect handled by layout -->",
  "templates/collection.liquid": "<!-- redirect handled by layout -->",
  "templates/collection.list.liquid": "<!-- redirect handled by layout -->",
  "templates/page.liquid": "<!-- redirect handled by layout -->",
  "templates/blog.liquid": "<!-- redirect handled by layout -->",
  "templates/article.liquid": "<!-- redirect handled by layout -->",
  "templates/cart.liquid": "<!-- redirect handled by layout -->",
  "templates/404.liquid": "<!-- redirect handled by layout -->",
  "templates/search.liquid": "<!-- redirect handled by layout -->",

  // Required config
  "config/settings_schema.json": JSON.stringify([
    {
      name: "theme_info",
      theme_name: "Vino per Lei Redirect",
      theme_version: "1.0.0",
      theme_author: "Blue Wire Media",
      theme_documentation_url: "https://vino-per-lei.vercel.app",
      theme_support_url: "https://vino-per-lei.vercel.app",
    },
  ]),
  "config/settings_data.json": JSON.stringify({ current: {} }),
};

async function main() {
  console.log(`\n🍷 Shopify Redirect Theme — Vino per Lei`);
  console.log(`   Store: ${STORE}`);
  console.log(`   Redirect to: ${SITE_URL}\n`);

  // 1. Check existing themes
  console.log("Checking existing themes...");
  const { themes } = await adminREST("/themes.json");
  const existing = themes?.find((t: { name: string }) => t.name === "Vino per Lei Redirect");

  let themeId: number;

  if (existing) {
    themeId = existing.id;
    console.log(`  Found existing redirect theme (ID: ${themeId})\n`);
  } else {
    // 2. Create theme
    console.log("  Creating new theme...");
    const { theme } = await adminREST("/themes.json", "POST", {
      theme: { name: "Vino per Lei Redirect", role: "unpublished" },
    });

    if (!theme?.id) {
      console.error("Failed to create theme");
      process.exit(1);
    }

    themeId = theme.id;
    console.log(`  Created theme (ID: ${themeId})\n`);
  }

  // 3. Upload assets
  console.log("Uploading theme files...");
  for (const [key, value] of Object.entries(themeFiles)) {
    process.stdout.write(`  [${key}]...`);
    const result = await adminREST(`/themes/${themeId}/assets.json`, "PUT", {
      asset: { key, value },
    });

    if (result?.asset) {
      console.log(" OK");
    } else {
      console.log(` FAILED: ${JSON.stringify(result?.errors || "unknown error")}`);
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  // 4. Publish the theme
  console.log("\nPublishing theme as main theme...");
  const publishResult = await adminREST(`/themes/${themeId}.json`, "PUT", {
    theme: { id: themeId, role: "main" },
  });

  if (publishResult?.theme?.role === "main") {
    console.log("  Theme is now LIVE!\n");
  } else {
    console.log("  Could not auto-publish. Publish manually in Shopify admin:");
    console.log(`  https://admin.shopify.com/store/vino-per-lei-2/themes\n`);
  }

  console.log("--- Done ---");
  console.log("Shopify preview nu redirects naar je Next.js site.");
  console.log(`Product preview → ${SITE_URL}/wijnen/[handle]`);
  console.log(`Collectie preview → ${SITE_URL}/wijnen`);
  console.log(`Homepage preview → ${SITE_URL}\n`);
}

main().catch(console.error);
