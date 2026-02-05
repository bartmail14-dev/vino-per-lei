import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
await page.goto('https://vino-per-lei.vercel.app/wijnen', { waitUntil: 'networkidle0', timeout: 60000 });

try {
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('18')) {
      await btn.click();
      await wait(1000);
      break;
    }
  }
} catch (e) {}

await wait(2000);

// Scroll to see two rows clearly
await page.evaluate(() => window.scrollBy(0, 350));
await wait(500);
await page.screenshot({ path: '../screenshot-aligned-desktop.png', fullPage: false });

// Full page to see all rows
await page.evaluate(() => window.scrollTo(0, 0));
await wait(500);
await page.screenshot({ path: '../screenshot-aligned-full.png', fullPage: true });

// Mobile view with scroll to see two rows
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3, isMobile: true });
await page.goto('https://vino-per-lei.vercel.app/wijnen', { waitUntil: 'networkidle0', timeout: 60000 });
await wait(2000);
await page.evaluate(() => window.scrollBy(0, 350));
await wait(500);
await page.screenshot({ path: '../screenshot-aligned-mobile.png', fullPage: false });

console.log('Done');
await browser.close();
