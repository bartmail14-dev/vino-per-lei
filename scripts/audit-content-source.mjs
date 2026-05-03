import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const outputDir = path.join(root, "content-audit");
const baselinePath = path.join(outputDir, "content-source-baseline.json");

const scanRoots = [
  "src/app",
  "src/components",
  "src/lib/shopify-cms.ts",
  "src/data",
];

const ignoredFilePatterns = [
  /src[\\/]components[\\/]icons(?:[\\/]|\.tsx$)/,
  /src[\\/]components[\\/]ui[\\/]Logo\.tsx$/,
  /src[\\/]components[\\/]icons[\\/]WineCategoryIcons\.tsx$/,
  /src[\\/]app[\\/]globals\.css$/,
];

const ignoredAttributeNames = new Set([
  "className",
  "href",
  "src",
  "id",
  "type",
  "name",
  "value",
  "key",
  "role",
  "rel",
  "target",
  "width",
  "height",
  "viewBox",
  "d",
  "fill",
  "stroke",
  "strokeWidth",
  "strokeLinecap",
  "strokeLinejoin",
  "sizes",
]);

const uiCopyAllowlist = [
  /^Ga naar inhoud$/,
  /^Open /,
  /^Sluit /,
  /^Zoeken$/,
  /^Vorige$/,
  /^Volgende$/,
  /^Aantal$/,
  /^Toegevoegd!$/,
  /^In Winkelmand$/,
  /^Winkelmand$/,
  /^Afrekenen$/,
  /^Verwijder/,
  /^Toevoegen/,
  /^Inloggen/,
  /^Registreren/,
  /^E-mailadres$/,
  /^Wachtwoord$/,
  /^Voornaam$/,
  /^Achternaam$/,
  /^Straatnaam$/,
  /^Huisnummer$/,
  /^Postcode$/,
  /^Plaats$/,
  /^Land$/,
  /^Telefoon$/,
  /^Verplicht$/,
  /^Opslaan$/,
  /^Annuleren$/,
  /^Laden/,
  /^Geen /,
  /^Product niet gevonden/,
  /^Pagina niet gevonden/,
  /^Cookie/,
  /^Accepteren$/,
  /^Weigeren$/,
  /^Instellingen$/,
  /^Noodzakelijk$/,
  /^Analytics$/,
  /^Marketing$/,
  /^Preferences$/,
  /^Rood$/,
  /^Wit$/,
  /^Ros/,
  /^Bubbels$/,
  /^Rode Wijn$/,
  /^Witte Wijn$/,
  /^Mousserende Wijn$/,
  /^Wijn$/,
  /^NV$/,
  /^Non-Vintage$/,
  /^Op voorraad$/,
  /^Uitverkocht$/,
  /^Bespaar /,
  /^Prijs$/,
  /^Regio$/,
  /^Druif$/,
  /^Sorteer/,
  /^Filter/,
  /^Alle$/,
];

const sourceMarkers = [
  "getProducts",
  "getProductByHandle",
  "getSiteSettings",
  "getHeroContent",
  "getAnnouncementBar",
  "getUSPItems",
  "getFAQItems",
  "getWineRegions",
  "getCategoryBlocks",
  "getPage",
  "getBlogArticles",
  "getBlogArticleByHandle",
  "getMenu",
  "getHomeStats",
  "getTestimonials",
  "getShopConfig",
  "getUiCopy",
  "useUiCopy",
  "DEFAULT_",
  "defaultFooterLinks",
  "defaultRegionLinks",
  "FALLBACK",
  "fallback",
];

function collectFiles(target) {
  const abs = path.join(root, target);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return [abs];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(tsx|ts)$/.test(entry.name)) {
        files.push(full);
      }
    }
  };
  walk(abs);
  return files;
}

function cleanText(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function isProbablyTechnical(text) {
  if (!text || text.length < 2) return true;
  if (/^[{}()[\].,;:+\-*/0-9%#=<>!?|&]+$/.test(text)) return true;
  if (/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+){1,}$/i.test(text) && !/\s/.test(text)) return true;
  if (/^(wineType)$/.test(text)) return true;
  if (/^[a-z0-9_-]+$/i.test(text) && !/[A-ZÀ-ÿ]/.test(text) && text.length < 18) return true;
  if (/^(GET|POST|PUT|PATCH|DELETE|Content-Type|application\/json|numeric|long|short|medium|large|true|false|auto|hidden|visible)$/i.test(text)) return true;
  if (/^(@context|@type|@id|BreadcrumbList|ListItem|Product|Brand|Offer|Organization|AggregateRating|PropertyValue|BlogPosting|FAQPage|ItemList|WebSite|SearchAction|Person|ImageObject|WebPage|Question|Answer|EUR)$/.test(text)) return true;
  if (/^(easeOut|easeInOut|linear|spring|start start|end start|start end|end end|fadeUp|fadeLeft|fadeRight|scaleIn|activeBlogCategory)$/.test(text)) return true;
  if (/^(x mandatory|x proximity|xMidYMid meet|scale\([0-9.]+\)|inset\(.+\)|url\(#.+\)|[0-9]+px [0-9]+px|max-w-\[[0-9]+px\]|[0-9]+% [0-9]+%|&copy;|&middot;|&ldquo;|&rdquo;|&larr;)$/.test(text)) return true;
  if (/^-?[0-9]+px 0px(?: -?[0-9]+% 0px)?$/.test(text)) return true;
  if (/^(?:[0-9]+(?:\.[0-9]+)?\s+){3,}[0-9]+(?:\.[0-9]+)?$/.test(text)) return true;
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return true;
  if (/^(bg-|text-|from-|to-|border-|shadow-|hover:|focus:|grid|flex|rounded|w-|h-|px-|py-)/.test(text)) return true;
  if (/^https?:\/\//.test(text)) return true;
  if (/\.(webp|png|jpg|jpeg|svg|ico)$/i.test(text)) return true;
  if (/^[MmLlHhVvCcSsQqTtAaZz0-9 .,\-]+$/.test(text) && text.length > 80) return true;
  return false;
}

function isUiAllowed(text) {
  return uiCopyAllowlist.some((pattern) => pattern.test(text));
}

function riskFor(file, text, context) {
  if (isUiAllowed(text)) return "allowed-ui";
  if (/src\/app\/(privacy|voorwaarden|cookies)\//.test(file)) return "p0-legal-content";
  if (/src\/app\/(over-ons|klantenservice|cadeaus|handleiding|showcase)\//.test(file)) return "p0-static-page-content";
  if (/src\/components\/layout\/Header\.tsx$/.test(file)) return "p0-navigation-content";
  if (/src\/components\/layout\/Footer\.tsx$/.test(file)) return "p1-footer-content";
  if (/src\/data\//.test(file)) return "p0-local-data-source";
  if (/src\/lib\/shopify-cms\.ts$/.test(file) && /DEFAULT_|fallback/i.test(context + text)) return "p0-shopify-fallback-content";
  if (/src\/components\/map\/|src\/components\/product\/RegionSpotlight|src\/lib\/region-utils/.test(file)) return "p0-region-content";
  if (/src\/app\/blog|src\/data\/blogPosts/.test(file)) return "p1-blog-content";
  if (/src\/app\/page\.tsx$/.test(file)) return "p1-homepage-content";
  if (/src\/app\/wijnen|src\/components\/product/.test(file)) return "p1-product-ui-content";
  if (/src\/components\/checkout|src\/app\/checkout/.test(file)) return "p2-checkout-ui";
  if (/src\/components\/auth|src\/app\/account/.test(file)) return "p2-account-ui";
  return "p2-ui-or-technical-copy";
}

function location(sourceFile, node) {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return { line: pos.line + 1, column: pos.character + 1 };
}

function addRecord(records, sourceFile, node, type, rawText, context = "") {
  const text = cleanText(rawText);
  if (isProbablyTechnical(text)) return;
  const rel = path.relative(root, sourceFile.fileName).replace(/\\/g, "/");
  const loc = location(sourceFile, node);
  records.push({
    file: rel,
    line: loc.line,
    column: loc.column,
    type,
    text,
    risk: riskFor(rel, text, context),
    context,
  });
}

function scanFile(file) {
  const sourceText = fs.readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const records = [];
  const sourceUsage = sourceMarkers.filter((marker) => sourceText.includes(marker));

  function visit(node) {
    if (ts.isJsxText(node)) {
      addRecord(records, sourceFile, node, "jsxText", node.getText(sourceFile));
    }

    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sourceFile);
      if (ignoredAttributeNames.has(name)) return;
      if (node.initializer && ts.isStringLiteral(node.initializer)) {
        addRecord(records, sourceFile, node, `attr:${name}`, node.initializer.text, name);
      }
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent;
      if (
        ts.isJsxExpression(parent) ||
        ts.isPropertyAssignment(parent) ||
        ts.isArrayLiteralExpression(parent) ||
        ts.isConditionalExpression(parent) ||
        ts.isReturnStatement(parent) ||
        ts.isVariableDeclaration(parent)
      ) {
        addRecord(records, sourceFile, node, "string", node.text, ts.SyntaxKind[parent.kind]);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { records, sourceUsage };
}

const files = scanRoots
  .flatMap(collectFiles)
  .filter((file) => !ignoredFilePatterns.some((pattern) => pattern.test(path.relative(root, file).replace(/\\/g, "/"))));

const allRecords = [];
const fileSources = [];
for (const file of files) {
  const { records, sourceUsage } = scanFile(file);
  allRecords.push(...records);
  if (records.length > 0 || sourceUsage.length > 0) {
    fileSources.push({
      file: path.relative(root, file).replace(/\\/g, "/"),
      sourceUsage,
      stringCount: records.length,
      highRiskCount: records.filter((record) => record.risk.startsWith("p0") || record.risk.startsWith("p1")).length,
    });
  }
}

const highRisk = allRecords.filter((record) => record.risk.startsWith("p0") || record.risk.startsWith("p1"));
const byRisk = allRecords.reduce((acc, record) => {
  acc[record.risk] = (acc[record.risk] || 0) + 1;
  return acc;
}, {});
const byFile = allRecords.reduce((acc, record) => {
  if (!acc[record.file]) acc[record.file] = [];
  acc[record.file].push(record);
  return acc;
}, {});

function signatureFor(record) {
  return [record.risk, record.file, record.type, record.text].join("\u001f");
}

function summarizeSignatures(records) {
  return records.reduce((acc, record) => {
    const signature = signatureFor(record);
    acc[signature] = (acc[signature] || 0) + 1;
    return acc;
  }, {});
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  path.join(outputDir, "content-source-audit.json"),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    scannedFiles: files.length,
    totalStrings: allRecords.length,
    highRiskStrings: highRisk.length,
    byRisk,
    fileSources,
    byFile,
  }, null, 2),
);

const csv = ["risk,file,line,type,text"].concat(
  allRecords.map((record) =>
    [
      record.risk,
      record.file,
      record.line,
      record.type,
      `"${record.text.replace(/"/g, '""')}"`,
    ].join(","),
  ),
);
fs.writeFileSync(path.join(outputDir, "content-source-audit.csv"), csv.join("\n"));

const topFiles = Object.entries(byFile)
  .map(([file, records]) => ({
    file,
    count: records.length,
    highRisk: records.filter((record) => record.risk.startsWith("p0") || record.risk.startsWith("p1")).length,
    sourceUsage: fileSources.find((entry) => entry.file === file)?.sourceUsage ?? [],
    samples: records.slice(0, 8).map((record) => `${record.line}: [${record.risk}] ${record.text}`),
  }))
  .sort((a, b) => b.highRisk - a.highRisk || b.count - a.count)
  .slice(0, 50);

console.log(JSON.stringify({
  scannedFiles: files.length,
  totalStrings: allRecords.length,
  highRiskStrings: highRisk.length,
  byRisk,
  topFiles,
}, null, 2));

if (process.argv.includes("--write-baseline")) {
  fs.writeFileSync(
    baselinePath,
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      highRiskStrings: highRisk.length,
      byRisk,
      signatures: summarizeSignatures(highRisk),
    }, null, 2),
  );
  console.log(`Wrote content audit baseline: ${path.relative(root, baselinePath)}`);
}

if (process.argv.includes("--guard")) {
  if (!fs.existsSync(baselinePath)) {
    console.error(`Missing content audit baseline: ${path.relative(root, baselinePath)}`);
    process.exitCode = 1;
  } else {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
    const remainingBaselineSignatures = { ...(baseline.signatures || {}) };
    const newRecords = highRisk.filter((record) => {
      const signature = signatureFor(record);
      if ((remainingBaselineSignatures[signature] || 0) > 0) {
        remainingBaselineSignatures[signature] -= 1;
        return false;
      }
      return true;
    });

    if (newRecords.length > 0) {
      console.error(JSON.stringify({
        message: "New high-risk hardcoded storefront content detected. Move content to Shopify or update the reviewed baseline intentionally.",
        newHighRiskStrings: newRecords.length,
        samples: newRecords.slice(0, 25).map((record) => ({
          risk: record.risk,
          file: record.file,
          line: record.line,
          type: record.type,
          text: record.text,
        })),
      }, null, 2));
      process.exitCode = 1;
    }
  }
}

if (process.argv.includes("--strict") && highRisk.length > 0) {
  process.exitCode = 1;
}
