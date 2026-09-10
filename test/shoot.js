// Visual QA: screenshots every page (and the post-upload report) for design review.
// Usage: node test/shoot.js [outDir]        (theme via CRI_THEME=light|dark)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, '..', '_temp', 'shots');
const THEME = process.env.CRI_THEME === 'dark' ? 'dark' : 'light';
const PORT = 8231;
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

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = serve();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  // Seed the persisted theme before any page script runs, so the in-head guard
  // picks it up and the shot is captured in the requested theme with no flash.
  await ctx.addInitScript(t => { try { localStorage.setItem('cri_theme', t); } catch (e) {} }, THEME);
  // Keep the run hermetic: no third-party network.
  await ctx.route('**', r => r.request().url().includes(`localhost:${PORT}`) ? r.continue() : r.abort());
  const page = await ctx.newPage();
  const base = `http://localhost:${PORT}/`;

  const pages = ['index.html', 'demo.html', 'roi-calculator.html', 'Start Here.html', 'changelog.html', 'run-locally.html', 'analytics.html'];
  for (const p of pages) {
    await page.goto(base + encodeURIComponent(p), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(p === 'demo.html' ? 3500 : 700);
    const applied = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (applied !== THEME) throw new Error(`theme mismatch on ${p}: expected ${THEME}, got ${applied}`);
    await page.screenshot({ path: path.join(OUT, p.replace(/[^a-z0-9]/gi, '_') + '.png'), fullPage: true });
    console.log('shot', p, applied);
  }

  // Report view: upload a fixture then Calculate.
  await page.goto(base + 'index.html', { waitUntil: 'domcontentloaded' });
  await page.setInputFiles('#fileInput', path.join(ROOT, 'test', 'viva-large.csv'));
  await page.waitForTimeout(900);
  const calc = page.locator('#filePreview button', { hasText: /calculate/i }).first();
  if (await calc.count()) { await calc.click(); await page.waitForTimeout(2500); }
  await page.screenshot({ path: path.join(OUT, 'report.png'), fullPage: true });
  console.log('shot report');
  await page.screenshot({ path: path.join(OUT, 'report_above_fold.png'), fullPage: false });

  await browser.close(); server.close();
  console.log('THEME=' + THEME);
  console.log('OUT=' + OUT);
})().catch(e => { console.error(e); process.exit(1); });
