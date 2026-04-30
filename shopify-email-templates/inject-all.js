// Inject all Shopify email templates via Playwright
// Run with: node inject-all.js
// Requires: playwright installed

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const STORE = 'vino-per-lei-2';
const BASE_URL = `https://admin.shopify.com/store/${STORE}/email_templates`;

// Template slug -> file mapping (skip 01 which is already done)
const TEMPLATES = [
  { slug: 'abandoned_checkout', file: '02-abandoned-checkout.html' },
  { slug: 'order_cancelled', file: '03-order-cancelled.html' },
  { slug: 'delivered', file: '04-shipment-delivered.html' },
  { slug: 'customer_account_invite', file: '05-customer-account-invite.html' },
  { slug: 'customer_account_reset_password', file: '06-customer-password-reset.html' },
  { slug: 'out_for_delivery', file: '07-shipment-out-for-delivery.html' },
  { slug: 'gift_card_created', file: '08-gift-card-created.html' },
  { slug: 'order_edited', file: '09-order-edited.html' },
  { slug: 'draft_order_invoice', file: '10-draft-order-invoice.html' },
];

async function injectTemplate(page, slug, filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const url = `${BASE_URL}/${slug}/edit`;

  console.log(`\n--- Injecting: ${slug} ---`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Click editor, select all, paste
  const cmContent = await page.$('.cm-content');
  if (!cmContent) {
    console.log(`  ERROR: No .cm-content for ${slug}`);
    return false;
  }

  await cmContent.click();
  await page.keyboard.press('Control+a');
  await page.waitForTimeout(200);

  await page.evaluate(async (content) => {
    await navigator.clipboard.writeText(content);
  }, html);

  await page.keyboard.press('Control+v');
  await page.waitForTimeout(800);

  // Save
  const saveBtn = await page.$('button[type="submit"]:has-text("Save")');
  if (saveBtn) {
    await saveBtn.click();
    await page.waitForTimeout(2000);
    console.log(`  SAVED: ${slug}`);
    return true;
  } else {
    console.log(`  ERROR: No Save button for ${slug}`);
    return false;
  }
}

async function main() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  const page = contexts[0].pages()[0];

  let success = 0;
  let failed = 0;

  for (const t of TEMPLATES) {
    const filePath = path.join(__dirname, t.file);
    try {
      const ok = await injectTemplate(page, t.slug, filePath);
      if (ok) success++;
      else failed++;
    } catch (err) {
      console.log(`  EXCEPTION: ${t.slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} saved, ${failed} failed`);
  await browser.close();
}

main().catch(console.error);
