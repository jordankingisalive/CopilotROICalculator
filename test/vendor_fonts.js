// Vendors Google Fonts locally (offline-safe). Downloads every woff2 + rewrites url() to relative paths.
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'fonts');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const FAMILIES = [
  'Newsreader:wght@400;600',
  'IBM+Plex+Sans:wght@400;500;600',
  'IBM+Plex+Mono:wght@400;500;600'
];

const get = (url, bin = false) => new Promise((res, rej) => {
  const req = https.get(url, { headers: { 'User-Agent': UA } }, r => {
    if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return get(r.headers.location, bin).then(res, rej);
    if (r.statusCode !== 200) return rej(new Error(`HTTP ${r.statusCode} for ${url}`));
    const chunks = [];
    r.on('data', c => chunks.push(c));
    r.on('end', () => res(bin ? Buffer.concat(chunks) : Buffer.concat(chunks).toString('utf8')));
  });
  req.setTimeout(30000, () => { req.destroy(new Error('timeout ' + url)); });
  req.on('error', rej);
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let combined = '/* Vendored Google Fonts (SIL OFL). Local-only: no CDN at runtime. */\n';
  let total = 0, count = 0;

  for (const fam of FAMILIES) {
    const css = await get(`https://fonts.googleapis.com/css2?family=${fam}&display=swap`);
    const urls = [...new Set(css.match(/https:\/\/[^)]+\.woff2/g) || [])];
    if (!urls.length) throw new Error('No woff2 found for ' + fam);
    let out = css;
    for (const u of urls) {
      const name = fam.split(':')[0].replace(/\+/g, '') + '-' + path.basename(u);
      const file = path.join(OUT, name);
      if (!fs.existsSync(file)) {
        const buf = await get(u, true);
        fs.writeFileSync(file, buf);
        total += buf.length; count++;
      } else { total += fs.statSync(file).size; count++; }
      out = out.split(u).join('./' + name);
    }
    if (!/font-display/.test(out)) out = out.replace(/@font-face\s*{/g, '@font-face {\n  font-display: swap;');
    combined += `\n/* ${fam} */\n${out}\n`;
  }

  fs.writeFileSync(path.join(OUT, 'fonts.css'), combined, 'utf8');
  console.log(`VENDORED files=${count} totalKB=${Math.round(total / 1024)}`);
  console.log('faces=' + (combined.match(/@font-face/g) || []).length);
})().catch(e => { console.error('FAIL ' + e.message); process.exit(1); });
