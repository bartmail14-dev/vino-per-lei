const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const STORE = 'vino-per-lei-2';
const BASE = `https://admin.shopify.com/store/${STORE}/email_templates`;
const DIR = __dirname;

const TEMPLATES = [
  ['abandoned_checkout', '02-abandoned-checkout.html'],
  ['order_cancelled', '03-order-cancelled.html'],
  ['delivered', '04-shipment-delivered.html'],
  ['customer_account_invite', '05-customer-account-invite.html'],
  ['customer_account_reset_password', '06-customer-password-reset.html'],
  ['out_for_delivery', '07-shipment-out-for-delivery.html'],
  ['gift_card_created', '08-gift-card-created.html'],
  ['order_edited', '09-order-edited.html'],
  ['draft_order_invoice', '10-draft-order-invoice.html'],
];

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const page = browser.contexts()[0].pages()[0];
  let ok = 0, fail = 0;

  for (const [slug, file] of TEMPLATES) {
    const html = fs.readFileSync(path.join(DIR, file), 'utf8');
    console.log(`\n>>> ${slug} (${html.length} chars)`);
    try {
      await page.goto(`${BASE}/${slug}/edit`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1500);
      const cm = await page.$('.cm-content');
      if (!cm) { console.log('  SKIP: no editor'); fail++; continue; }
      await cm.click();
      await page.keyboard.press('Control+a');
      await page.waitForTimeout(200);
      await page.evaluate(async c => navigator.clipboard.writeText(c), html);
      await page.keyboard.press('Control+v');
      await page.waitForTimeout(800);
      const btn = await page.$('button[type="submit"]:has-text("Save")');
      if (!btn) { console.log('  SKIP: no Save btn'); fail++; continue; }
      await btn.click();
      await page.waitForTimeout(2000);
      console.log('  SAVED');
      ok++;
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} saved, ${fail} failed`);
  process.exit(0);
})();
