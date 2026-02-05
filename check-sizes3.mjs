import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Desktop viewport
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

await page.goto('https://vino-per-lei.vercel.app/wijnen', { waitUntil: 'networkidle0', timeout: 60000 });

// Click age gate if present
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
await page.screenshot({ path: '../screenshot-grid-v3.png', fullPage: false });

// Product page
await page.goto('https://vino-per-lei.vercel.app/wijnen/montaribaldi-barolo-2019', { waitUntil: 'networkidle0', timeout: 60000 });
await wait(2000);
await page.screenshot({ path: '../screenshot-product-v3.png', fullPage: false });

// Mobile
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3, isMobile: true });
await page.goto('https://vino-per-lei.vercel.app/wijnen', { waitUntil: 'networkidle0', timeout: 60000 });
await wait(2000);
await page.screenshot({ path: '../screenshot-mobile-v3.png', fullPage: false });

console.log('Screenshots saved');
await browser.close();
