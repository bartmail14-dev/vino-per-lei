const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1400, height: 900 });
  
  // Set cookie to bypass age gate
  await page.setCookie({
    name: 'vpl_age_verified',
    value: 'true',
    domain: 'vino-per-lei.vercel.app',
    path: '/'
  });
  
  // Homepage with hero
  await page.goto('https://vino-per-lei.vercel.app/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshot-homepage.png' });
  console.log('Screenshot saved: screenshot-homepage.png');
  
  // Products page
  await page.goto('https://vino-per-lei.vercel.app/wijnen', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshot-products.png' });
  console.log('Screenshot saved: screenshot-products.png');
  
  await browser.close();
})();
