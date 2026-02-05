import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
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
await page.screenshot({ path: '../screenshot-map-filter.png', fullPage: false });

// Click on Piemonte region on the map (approximate coordinates)
// The map should be in the left sidebar
try {
  // Take a screenshot of just the filter sidebar area
  await page.screenshot({ path: '../screenshot-map-filter-sidebar.png', fullPage: false, clip: { x: 0, y: 100, width: 350, height: 700 } });
} catch (e) {
  console.log('Clip screenshot failed, taking full');
}

console.log('Done');
await browser.close();
