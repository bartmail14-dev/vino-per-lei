const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  
  // Set the age verification cookie
  await context.addCookies([{
    name: 'vpl_age_verified',
    value: 'true',
    domain: 'vino-per-lei.vercel.app',
    path: '/'
  }]);
  
  const page = await context.newPage();
  await page.goto('https://vino-per-lei.vercel.app/wijnen', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-wijnen-products.png', fullPage: false });
  
  // Scroll down to see more products
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-wijnen-products-2.png', fullPage: false });
  
  await browser.close();
  console.log('Screenshots taken!');
})();
