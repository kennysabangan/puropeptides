const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Screenshot our clone homepage
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/scalesolving/.openclaw/workspace/amino-clone/clone-home.png', fullPage: true });
  console.log('Clone homepage captured');

  // Screenshot store
  await page.goto('http://localhost:5173/store', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/scalesolving/.openclaw/workspace/amino-clone/clone-store.png', fullPage: true });
  console.log('Clone store captured');

  // Screenshot product
  await page.goto('http://localhost:5173/product/bpc-157', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/scalesolving/.openclaw/workspace/amino-clone/clone-product.png', fullPage: true });
  console.log('Clone product captured');

  await browser.close();
})();
