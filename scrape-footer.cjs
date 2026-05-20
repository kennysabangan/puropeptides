const { chromium } = require('playwright');
const fs = require('fs');

const OUT = '/Users/scalesolving/.openclaw/workspace/amino-clone/amino-reference-pages';
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  { slug: 'quality', url: 'https://www.aminoclub.com/us/quality' },
  { slug: 'coa', url: 'https://www.aminoclub.com/us/coa' },
  { slug: 'research', url: 'https://www.aminoclub.com/us/research' },
  { slug: 'faq', url: 'https://www.aminoclub.com/us/faq' },
  { slug: 'contact', url: 'https://www.aminoclub.com/us/contact' },
  { slug: 'shipping', url: 'https://www.aminoclub.com/us/shipping' },
  { slug: 'returns', url: 'https://www.aminoclub.com/us/returns' },
  { slug: 'terms', url: 'https://www.aminoclub.com/us/terms' },
  { slug: 'privacy', url: 'https://www.aminoclub.com/us/privacy' },
  { slug: 'disclaimer', url: 'https://www.aminoclub.com/us/disclaimer' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Pass age gate
  console.log('=== Passing age gate ===');
  await page.goto('https://www.aminoclub.com/age-verify?return=%2F', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  const checks = await page.locator('input[type="checkbox"], [role="checkbox"]').all();
  for (const c of checks) { try { await c.click(); } catch(e) {} }
  await page.waitForTimeout(500);
  try { await page.locator('button[type="submit"]').click(); } catch(e) {
    const btns = page.locator('button');
    const n = await btns.count();
    if (n > 0) await btns.nth(n - 1).click();
  }
  await page.waitForTimeout(5000);

  // Scrape each page
  for (const { slug, url } of pages) {
    console.log(`\n=== ${slug} ===`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(2000);

      // Full page screenshot
      await page.screenshot({ path: `${OUT}/${slug}.png`, fullPage: true });

      // Extract text content
      const text = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(`${OUT}/${slug}.txt`, text);

      console.log(`  ✓ Screenshot + text saved (${text.length} chars)`);
    } catch(e) {
      console.log(`  ✗ Error: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\n=== Done! ===');
})();
