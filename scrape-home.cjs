const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Pass the age verification
  await page.goto('https://www.aminoclub.com/age-verify?return=%2F', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Click all checkboxes
  const checks = await page.locator('input[type="checkbox"], [role="checkbox"]').all();
  for (const c of checks) {
    try { await c.click(); } catch(e) {}
  }
  await page.waitForTimeout(500);

  // Click submit
  const submitBtn = page.locator('button[type="submit"]');
  try { await submitBtn.click(); } catch(e) {
    const allBtns = page.locator('button');
    const count = await allBtns.count();
    if (count > 0) await allBtns.nth(count - 1).click();
  }
  await page.waitForTimeout(5000);

  // Now on the real homepage
  console.log('URL:', page.url());
  
  // Full page screenshot
  await page.screenshot({ path: '/Users/scalesolving/.openclaw/workspace/amino-clone/real-homepage.png', fullPage: true });
  console.log('Full page screenshot saved');

  // Get the full page HTML
  const html = await page.content();
  fs.writeFileSync('/Users/scalesolving/.openclaw/workspace/amino-clone/real-homepage.html', html);
  console.log('HTML saved');

  // Extract all text content
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('/Users/scalesolving/.openclaw/workspace/amino-clone/real-homepage-text.txt', text);
  console.log('Text saved');

  // Extract CSS styles from computed styles on key elements
  const styles = await page.evaluate(() => {
    const getStyles = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        font: cs.fontFamily,
        fontSize: cs.fontSize,
        padding: cs.padding,
        margin: cs.margin,
        display: cs.display,
        width: cs.width,
        height: cs.height
      };
    };
    return {
      body: getStyles('body'),
      header: getStyles('header') || getStyles('nav'),
      hero: getStyles('[class*="hero"]') || getStyles('main > section:first-child'),
      h1: getStyles('h1'),
    };
  });
  console.log('Styles:', JSON.stringify(styles, null, 2));

  await browser.close();
})();
