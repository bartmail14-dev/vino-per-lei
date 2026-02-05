import puppeteer from 'puppeteer';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// iPhone 14 Pro viewport
await page.setViewport({
  width: 393,
  height: 852,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true
});

// Set user agent to mobile
await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');

await page.goto('https://vino-per-lei.vercel.app/wijnen', { waitUntil: 'networkidle0', timeout: 60000 });

// Click age gate if present
try {
  await page.waitForSelector('button', { timeout: 3000 });
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
await page.screenshot({ path: '../mobile-wijnen.png', fullPage: false });

// Scroll down a bit to see more cards
await page.evaluate(() => window.scrollBy(0, 400));
await wait(500);
await page.screenshot({ path: '../mobile-wijnen-scroll.png', fullPage: false });

console.log('Mobile screenshots saved');
await browser.close();
