// Annotate handleiding screenshots with red circles, arrows, and numbered labels
// Run: node annotate.mjs (requires Playwright to be running via MCP)

// Each entry: [filename, viewBox "w h", annotations[]]
// Annotation types: rect(x,y,w,h), circle(cx,cy,r), arrow(x1,y1,x2,y2), label(x,y,num)
export const annotations = {
  'admin-producten-overzicht': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 18, y: 123, w: 135, h: 28, label: 1, lx: 18, ly: 108 },
      { type: 'rect', x: 1150, y: 73, w: 110, h: 32, label: 2, lx: 1150, ly: 58 },
    ]
  },
  'admin-product-nieuw': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 320, y: 65, w: 160, h: 30, label: 1, lx: 320, ly: 50 },     // "Add product" title
      { type: 'rect', x: 430, y: 160, w: 380, h: 35, label: 2, lx: 430, ly: 145 },    // Title field
      { type: 'rect', x: 430, y: 230, w: 380, h: 140, label: 3, lx: 430, ly: 215 },   // Description
      { type: 'rect', x: 430, y: 430, w: 380, h: 80, label: 4, lx: 430, ly: 415 },    // Media
      { type: 'rect', x: 430, y: 560, w: 200, h: 35, label: 5, lx: 430, ly: 545 },    // Price
    ]
  },
  'admin-product-prijs-voorraad': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 430, y: 120, w: 200, h: 40, label: 1, lx: 430, ly: 105 },    // Price field
      { type: 'rect', x: 430, y: 400, w: 300, h: 40, label: 2, lx: 430, ly: 385 },    // Inventory
      { type: 'rect', x: 760, y: 18, w: 65, h: 32, label: 3, lx: 760, ly: 3 },        // Save button
    ]
  },
  'admin-content-metaobjects': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 18, y: 290, w: 120, h: 28, label: 1, lx: 18, ly: 275 },      // Content sidebar
      { type: 'rect', x: 280, y: 65, w: 160, h: 30, label: 2, lx: 280, ly: 50 },      // Metaobjects title
    ]
  },
  'admin-homepage-hero-entry': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 300, y: 150, w: 600, h: 40, label: 1, lx: 300, ly: 135 },    // Title field
      { type: 'rect', x: 300, y: 250, w: 600, h: 100, label: 2, lx: 300, ly: 235 },   // Description
      { type: 'rect', x: 300, y: 410, w: 300, h: 40, label: 3, lx: 300, ly: 395 },    // CTA text
    ]
  },
  'admin-testimonial-overzicht': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 1100, y: 73, w: 110, h: 32, label: 1, lx: 1100, ly: 58 },   // Add entry
    ]
  },
  'admin-testimonial-bewerken': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 300, y: 150, w: 600, h: 40, label: 1, lx: 300, ly: 135 },    // Name
      { type: 'rect', x: 300, y: 250, w: 600, h: 80, label: 2, lx: 300, ly: 235 },    // Review text
      { type: 'rect', x: 300, y: 390, w: 200, h: 40, label: 3, lx: 300, ly: 375 },    // Stars
    ]
  },
  'admin-faq-overzicht': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 1100, y: 73, w: 110, h: 32, label: 1, lx: 1100, ly: 58 },   // Add entry
    ]
  },
  'admin-orders': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 18, y: 95, w: 120, h: 28, label: 1, lx: 18, ly: 80 },        // Orders sidebar
    ]
  },
  'admin-blog-nieuw': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 430, y: 160, w: 380, h: 35, label: 1, lx: 430, ly: 145 },    // Title
      { type: 'rect', x: 430, y: 250, w: 380, h: 150, label: 2, lx: 430, ly: 235 },   // Content editor
      { type: 'rect', x: 850, y: 400, w: 200, h: 100, label: 3, lx: 850, ly: 385 },   // Featured image
    ]
  },
  'admin-announcement-bar-entry': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 300, y: 150, w: 600, h: 40, label: 1, lx: 300, ly: 135 },    // Message
      { type: 'rect', x: 300, y: 250, w: 100, h: 40, label: 2, lx: 300, ly: 235 },    // Enabled toggle
    ]
  },
  'admin-homepage-cijfer-entry': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 300, y: 150, w: 300, h: 40, label: 1, lx: 300, ly: 135 },    // Getal
      { type: 'rect', x: 300, y: 250, w: 200, h: 40, label: 2, lx: 300, ly: 235 },    // Suffix
      { type: 'rect', x: 300, y: 350, w: 400, h: 40, label: 3, lx: 300, ly: 335 },    // Label
    ]
  },
  'admin-site-instellingen-entry': {
    vb: '1280 800',
    items: [
      { type: 'rect', x: 300, y: 150, w: 600, h: 40, label: 1, lx: 300, ly: 135 },    // Company name
      { type: 'rect', x: 300, y: 250, w: 400, h: 40, label: 2, lx: 300, ly: 235 },    // Email
      { type: 'rect', x: 300, y: 350, w: 400, h: 40, label: 3, lx: 300, ly: 335 },    // KvK
    ]
  },
};

// Generate SVG for an annotation set
export function generateSVG(config) {
  const { vb, items } = config;
  let svg = `<svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;" viewBox="0 0 ${vb}">
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
    </marker>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>`;

  for (const item of items) {
    if (item.type === 'rect') {
      svg += `\n  <rect x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}" rx="4" fill="none" stroke="#dc2626" stroke-width="3" stroke-dasharray="0"/>`;
    }
    if (item.label) {
      svg += `\n  <circle cx="${item.lx + 10}" cy="${item.ly + 5}" r="13" fill="#dc2626" filter="url(#shadow)"/>`;
      svg += `\n  <text x="${item.lx + 10}" y="${item.ly + 10}" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">${item.label}</text>`;
    }
  }

  svg += '\n</svg>';
  return svg;
}

console.log('Annotation config loaded. Use with Playwright to render.');
