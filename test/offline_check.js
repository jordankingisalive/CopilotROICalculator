// Offline integrity check: serves the app locally, aborts ALL non-localhost
// traffic (simulating no-CDN / offline), and asserts every page loads clean.
// Usage: node test/offline_check.js
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8237;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.csv': 'text/csv', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

function serve() {
  return http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('nf'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(PORT);
}

const PAGES = [
  { file: 'index.html', needsHtml2pdf: false },
  { file: 'roi-calculator.html', needsHtml2pdf: true },
  { file: 'Start Here.html', needsHtml2pdf: true },
  { file: 'run-locally.html', needsHtml2pdf: false },
  { file: 'demo.html', needsHtml2pdf: false }
];

(async () => {
  const server = serve();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

  let blockedExternal = 0;
  await ctx.route('**', r => {
    if (r.request().url().includes(`localhost:${PORT}`)) return r.continue();
    blockedExternal++;
    return r.abort();
  });

  const base = `http://localhost:${PORT}/`;
  const failures = [];

  for (const p of PAGES) {
    const page = await ctx.newPage();
    const pageErrors = [];
    const badResponses = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    page.on('response', r => {
      if (r.url().includes(`localhost:${PORT}`) && r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`);
    });

    await page.goto(base + encodeURIComponent(p.file), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const html2pdfType = await page.evaluate(() => typeof window.html2pdf);

    if (pageErrors.length) failures.push(`${p.file}: ${pageErrors.length} pageerror -> ${pageErrors.join(' | ')}`);
    if (badResponses.length) failures.push(`${p.file}: failed local responses -> ${badResponses.join(' | ')}`);
    if (p.needsHtml2pdf && html2pdfType !== 'function') failures.push(`${p.file}: typeof window.html2pdf === '${html2pdfType}' (expected 'function')`);

    console.log(`${p.file} | pageerrors=${pageErrors.length} | badLocal=${badResponses.length} | html2pdf=${html2pdfType}${p.needsHtml2pdf ? ' (required)' : ''}`);
    await page.close();
  }

  await browser.close(); server.close();

  console.log(`external requests blocked (offline simulation): ${blockedExternal}`);
  if (failures.length) {
    console.error('OFFLINE CHECK FAILED:');
    failures.forEach(f => console.error('  - ' + f));
    process.exit(1);
  }
  console.log('OFFLINE CHECK PASSED');
})().catch(e => { console.error(e); process.exit(1); });
