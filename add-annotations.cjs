const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, 'public/handleiding');
const OUT_DIR = 'C:\\Users\\BartVisser\\Desktop\\hld-annotated';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Annotation configs: [filename, width, height, annotations[]]
// Each annotation: { x, y, w, h, n } = red rounded rect with numbered label
const configs = [
  ['admin-producten-overzicht', 1280, 800, [
    { x: 28, y: 125, w: 115, h: 28, n: 1 },    // "Products" sidebar item
    { x: 1160, y: 73, w: 120, h: 38, n: 2 },   // "Add product" button (top-right)
  ]],
  ['admin-product-nieuw', 1280, 800, [
    { x: 288, y: 125, w: 590, h: 55, n: 1 },   // Title field + input
    { x: 288, y: 198, w: 590, h: 210, n: 2 },  // Description editor
    { x: 288, y: 430, w: 590, h: 155, n: 3 },  // Media upload area
    { x: 288, y: 728, w: 190, h: 55, n: 4 },   // Price field
  ]],
  ['admin-product-prijs-voorraad', 1280, 800, [
    { x: 288, y: 55, w: 185, h: 40, n: 1 },    // Price field (€ 19.99)
    { x: 288, y: 178, w: 600, h: 180, n: 2 },  // Inventory section
    { x: 912, y: 16, w: 60, h: 36, n: 3 },     // Save button (top bar)
  ]],
  ['admin-content-metaobjects', 1280, 800, [
    { x: 28, y: 238, w: 115, h: 28, n: 1 },    // "Content" sidebar item
    { x: 275, y: 74, w: 140, h: 32, n: 2 },    // "Metaobjects" page heading
  ]],
  ['admin-homepage-hero-entry', 1280, 800, [
    { x: 300, y: 180, w: 620, h: 42, n: 1 },   // Subtitle field
    { x: 300, y: 280, w: 620, h: 42, n: 2 },   // Title line 1
    { x: 300, y: 380, w: 620, h: 100, n: 3 },  // Description
  ]],
  ['admin-announcement-bar-entry', 1280, 800, [
    { x: 300, y: 180, w: 620, h: 42, n: 1 },   // Message field
    { x: 300, y: 300, w: 100, h: 35, n: 2 },   // Enabled toggle
  ]],
  ['admin-usp-item-entry', 1280, 800, [
    { x: 300, y: 180, w: 620, h: 42, n: 1 },   // Title
    { x: 300, y: 280, w: 620, h: 42, n: 2 },   // Subtitle
    { x: 300, y: 380, w: 200, h: 42, n: 3 },   // Order
  ]],
  ['admin-testimonial-overzicht', 1280, 800, [
    { x: 1178, y: 74, w: 105, h: 36, n: 1 },   // "Add entry" button (top-right)
  ]],
  ['admin-testimonial-bewerken', 1280, 800, [
    { x: 288, y: 160, w: 600, h: 42, n: 1 },   // Naam klant field
    { x: 288, y: 230, w: 600, h: 100, n: 2 },  // Review tekst field
    { x: 288, y: 410, w: 260, h: 60, n: 3 },   // Wijn field
    { x: 288, y: 505, w: 410, h: 55, n: 4 },   // Bron field
  ]],
  ['admin-homepage-cijfer-entry', 1280, 800, [
    { x: 300, y: 180, w: 300, h: 42, n: 1 },   // Getal
    { x: 300, y: 280, w: 200, h: 42, n: 2 },   // Prefix/Suffix
    { x: 300, y: 380, w: 400, h: 42, n: 3 },   // Label
  ]],
  ['admin-faq-overzicht', 1280, 800, [
    { x: 1178, y: 74, w: 105, h: 36, n: 1 },   // "Add entry" button (top-right)
  ]],
  ['admin-categorie-blok-entry', 1280, 800, [
    { x: 300, y: 180, w: 620, h: 42, n: 1 },   // Naam
    { x: 300, y: 280, w: 620, h: 42, n: 2 },   // Beschrijving
    { x: 300, y: 380, w: 300, h: 42, n: 3 },   // Link
  ]],
  ['admin-site-instellingen-entry', 1280, 800, [
    { x: 300, y: 180, w: 620, h: 42, n: 1 },   // Bedrijfsnaam
    { x: 300, y: 280, w: 400, h: 42, n: 2 },   // Email
    { x: 300, y: 380, w: 400, h: 42, n: 3 },   // KvK
    { x: 300, y: 480, w: 400, h: 42, n: 4 },   // Social URLs
  ]],
  ['admin-orders', 1280, 800, [
    { x: 28, y: 97, w: 100, h: 28, n: 1 },     // "Orders" sidebar item
  ]],
  ['admin-bestellingen', 1036, 799, [
    { x: 28, y: 97, w: 100, h: 28, n: 1 },     // "Orders" sidebar item (no orders to show fulfill)
  ]],
  ['admin-blog-nieuw', 1036, 799, [
    { x: 270, y: 125, w: 455, h: 57, n: 1 },   // Title field + input
    { x: 270, y: 198, w: 455, h: 210, n: 2 },  // Content editor
    { x: 775, y: 265, w: 220, h: 110, n: 3 },  // Image upload area (right panel)
  ]],
  ['admin-verzending', 1280, 800, [
    { x: 135, y: 430, w: 165, h: 28, n: 1 },   // "Shipping and delivery" sidebar item
    { x: 440, y: 182, w: 680, h: 45, n: 2 },   // Shipping profiles section
  ]],
  ['admin-paginas', 1280, 800, [
    { x: 1178, y: 74, w: 105, h: 36, n: 1 },   // "Add page" button (top-right)
  ]],
];

function buildSVG(w, h, annotations) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`;

  for (const a of annotations) {
    // Red rounded rect
    svg += `<rect x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" rx="5" ry="5" fill="none" stroke="#dc2626" stroke-width="3"/>`;
    // Number badge (top-left of rect)
    const bx = a.x - 5;
    const by = a.y - 5;
    svg += `<circle cx="${bx}" cy="${by}" r="14" fill="#dc2626"/>`;
    svg += `<text x="${bx}" y="${by + 5}" text-anchor="middle" fill="white" font-size="15" font-weight="bold" font-family="Arial,sans-serif">${a.n}</text>`;
  }

  svg += '</svg>';
  return Buffer.from(svg);
}

async function annotate(filename, w, h, annotations) {
  const src = path.join(DIR, filename + '.webp');
  const out = path.join(OUT_DIR, filename + '.webp');

  const svgBuf = buildSVG(w, h, annotations);

  await sharp(src)
    .composite([{ input: svgBuf, top: 0, left: 0 }])
    .webp({ quality: 90 })
    .toFile(out);

  console.log('✓ ' + filename);
}

async function main() {
  for (const [filename, w, h, anns] of configs) {
    try {
      await annotate(filename, w, h, anns);
    } catch (e) {
      console.error('✗ ' + filename + ': ' + e.message);
    }
  }
  console.log('\nDone! ' + configs.length + ' screenshots annotated.');
}

main();
