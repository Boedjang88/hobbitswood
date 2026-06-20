const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: "new"
    });
    const page = await browser.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`PAGE ERROR/WARN: ${msg.text()}`);
      }
    });

    console.log("Navigating to http://localhost:3000/shop...");
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log("Waiting 2 seconds...");
    await new Promise(r => setTimeout(r, 2000));

    console.log("Clicking the first product link...");
    await page.click('a[href^="/product/"]');

    console.log("Waiting 3 seconds...");
    await new Promise(r => setTimeout(r, 3000));

    await browser.close();
    console.log("Done.");
  } catch (err) {
    console.error("Script Error:", err);
  }
})();
