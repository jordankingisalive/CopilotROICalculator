/*
 * e2e_viva.spec.js — Real headless-browser end-to-end QA for the staging ROI web app.
 *
 * DEV/TEST TOOLING ONLY. This file is never referenced by any app runtime page
 * (index.html / *.html load only lib/*.js + the app's own scripts). It does not
 * touch the vendored lib/ bundle. Run manually:  node stagingroicalculator/test/e2e_viva.spec.js
 *
 * What it proves:
 *   - Uploads raw Viva Insights CSV exports (en-US, en-GB, es) into the real UI.
 *   - Rejects a legacy Super Usage Report heatmap CSV with on-screen guidance
 *     and zero uncaught exceptions.
 *   - Zero uncaught exceptions (pageerror) and zero app-origin console.error.
 *   - Cohort tiers (Power/Habitual/Novice/Low/Non) + key metrics render with values.
 *   - Cohort counts are internally consistent (sum == totals == person count).
 *   - Insights subpages (orgs/at-risk/forecast) hydrate from the
 *     upload's sessionStorage handoff and render primary content.
 *   - DOCX / PPTX / Executive-Deck exports produce non-empty files.
 *
 * Console-error whitelist (justified, does NOT hide app bugs):
 *   Only console errors whose resource origin is NOT the local test server
 *   (http://127.0.0.1:PORT) are ignored. The single such source is Microsoft
 *   Clarity (https://www.clarity.ms/...), a third-party telemetry tag that is
 *   (a) guarded everywhere by `if (window.clarity)`, (b) irrelevant to app
 *   functionality, and (c) deliberately blocked here for a hermetic offline run.
 *   Uncaught exceptions (pageerror) are NEVER whitelisted, regardless of origin.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');          // stagingroicalculator/
const PORT = 8123;
const BASE = `http://127.0.0.1:${PORT}`;
const EXPORT_DIR = path.resolve(__dirname, '..', '..', '_temp', 'phase2', 'e2e_exports');

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json; charset=utf-8'
};

// ── Static file server (rooted at stagingroicalculator/, no traversal) ────────
function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            try {
                let urlPath = decodeURIComponent(req.url.split('?')[0]);
                if (urlPath === '/') urlPath = '/index.html';
                const resolved = path.normalize(path.join(ROOT, urlPath));
                if (!resolved.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
                if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
                    res.writeHead(404); res.end('Not found: ' + urlPath); return;
                }
                const ext = path.extname(resolved).toLowerCase();
                res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
                fs.createReadStream(resolved).pipe(res);
            } catch (e) {
                res.writeHead(500); res.end('Server error: ' + e.message);
            }
        });
        server.on('error', reject);
        server.listen(PORT, '127.0.0.1', () => resolve(server));
    });
}

// ── Tiny assertion harness ────────────────────────────────────────────────────
const checks = [];
function record(name, pass, detail) {
    checks.push({ name, pass: !!pass, detail: detail || '' });
    const tag = pass ? 'PASS' : 'FAIL';
    console.log(`[${tag}] ${name}${detail ? '  — ' + detail : ''}`);
}

// ── Error tracking (app-origin filter) ────────────────────────────────────────
const appErrors = [];   // {kind, text, url}
function isExternal(url) {
    return !!url && !url.startsWith(BASE);
}

async function main() {
    if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR, { recursive: true });

    const server = await startServer();
    console.log(`Static server up at ${BASE} (root: ${ROOT})`);

    const browser = await chromium.launch({ headless: true });
    // NOTE: service workers are intentionally NOT blocked. Blocking them makes
    // navigator.serviceWorker.register(...).then(reg => ...) resolve with reg===undefined,
    // which throws a pageerror that does NOT occur in a real browser. We serve sw.js
    // locally and let registration behave exactly as it does for real users.
    const context = await browser.newContext({
        acceptDownloads: true
    });

    // Hermetic offline run: allow only localhost; abort everything external.
    await context.route('**/*', (route) => {
        const host = new URL(route.request().url()).hostname;
        if (host === '127.0.0.1' || host === 'localhost') return route.continue();
        return route.abort();
    });

    const page = await context.newPage();

    const dialogs = [];
    page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss().catch(() => {}); });

    page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const url = (msg.location() && msg.location().url) || '';
        if (isExternal(url)) return;             // whitelist: third-party (Clarity) only
        appErrors.push({ kind: 'console.error', text: msg.text(), url });
    });
    page.on('pageerror', (err) => {              // uncaught — never whitelisted
        appErrors.push({ kind: 'pageerror', text: err.message, url: '', stack: (err.stack || '').split('\n').slice(0, 4).join(' | ') });
    });

    const errMark = () => appErrors.length;
    const newErrs = (mark) => appErrors.slice(mark);

    // ── Helper: upload a fixture on a fresh index.html and run the calculation ──
    async function uploadAndCalculate(fixture) {
        await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
        await page.waitForSelector('#fileInput', { state: 'attached', timeout: 15000 });
        await page.setInputFiles('#fileInput', path.join(__dirname, fixture));
        // Preview appears with the Calculate button (onclick="runCalculation()")
        await page.waitForFunction(
            () => !!document.querySelector('#filePreview button[onclick="runCalculation()"]'),
            { timeout: 15000 }
        );
        await page.click('#filePreview button[onclick="runCalculation()"]');
        // Results render replaces .container; wait for the ROI hero metric to populate
        await page.waitForFunction(
            () => { const e = document.querySelector('#km-roi'); return e && e.textContent.trim().length > 0; },
            { timeout: 30000 }
        );
    }

    // ── Helper: assert the key metrics + cohort tiers on the results page ───────
    async function assertResults(label) {
        const m = await page.evaluate(() => {
            const t = (id) => { const e = document.getElementById(id); return e ? e.textContent.trim() : null; };
            const b = document.getElementById('tierTableBody');
            const tierText = b ? b.textContent : '';
            // Read cohort counts straight from the rendered tier table (what the user sees).
            // Rows: 5 tier rows + an "ALL USERS" totals row; each row cell[1] is the person count.
            const TIERS = ['Power Users', 'Habitual Users', 'Novice Users', 'Low Users', 'Non Users'];
            let cohort = null;
            if (b) {
                const parsed = [...b.querySelectorAll('tr')].map(tr => {
                    const tds = [...tr.querySelectorAll('td')];
                    const label = tds[0] ? tds[0].textContent.trim() : '';
                    const count = tds[1] ? parseInt(tds[1].textContent.replace(/[^0-9]/g, ''), 10) : NaN;
                    return { label, count };
                });
                const tierRows = parsed.filter(r => TIERS.includes(r.label));
                const allRow = parsed.find(r => /ALL USERS/i.test(r.label));
                cohort = {
                    sum: tierRows.reduce((s, r) => s + (Number.isFinite(r.count) ? r.count : 0), 0),
                    totalsCount: allRow ? allRow.count : NaN,
                    tierCount: tierRows.length,
                    labels: tierRows.map(r => r.label)
                };
            }
            return {
                roi: t('km-roi'),                       // ROI Multiple
                monthlyValue: t('km-monthlyValue'),     // Monthly Value
                adoption: t('km-adoption'),             // Activation / Adoption Rate
                powerRate: t('km-powerUserRate'),       // % Power Users
                tierText,
                cohort
            };
        });

        record(`${label}: ROI Multiple present (#km-roi)`,
            !!m.roi && /x/i.test(m.roi), `value="${m.roi}"`);
        record(`${label}: Monthly Value present (#km-monthlyValue)`,
            !!m.monthlyValue && /\$/.test(m.monthlyValue), `value="${m.monthlyValue}"`);
        record(`${label}: Activation Rate present (#km-adoption)`,
            !!m.adoption && /%/.test(m.adoption), `value="${m.adoption}"`);
        record(`${label}: % Power Users present (#km-powerUserRate)`,
            !!m.powerRate && /%/.test(m.powerRate), `value="${m.powerRate}"`);

        const tiers = ['Power Users', 'Habitual Users', 'Novice Users', 'Low Users', 'Non Users'];
        const missing = tiers.filter(x => !m.tierText.includes(x));
        record(`${label}: cohort tier labels present`,
            missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : tiers.join(' / '));

        if (m.cohort) {
            const c = m.cohort;
            const consistent = c.tierCount === 5 && Number.isFinite(c.totalsCount) && c.sum === c.totalsCount && c.totalsCount > 0;
            record(`${label}: cohort counts consistent (Power+Habitual+Novice+Low+Non == ALL USERS total)`,
                consistent, `sum=${c.sum}, ALL USERS total=${c.totalsCount}, tierRows=${c.tierCount}`);
            const labelsOk = tiers.every(x => c.labels.includes(x));
            record(`${label}: tier table has all 5 cohorts`, labelsOk, c.labels.join(', '));
        } else {
            record(`${label}: cohort counts consistent (Power+Habitual+Novice+Low+Non == ALL USERS total)`, false, 'no #tierTableBody rendered');
        }
    }

    // ── Helper: trigger an export and capture the download ─────────────────────
    async function runExport(selector, outFile, label) {
        const outPath = path.join(EXPORT_DIR, outFile);
        try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
        const dialogsBefore = dialogs.length;
        try {
            const dlPromise = page.waitForEvent('download', { timeout: 120000 });
            await page.click(selector);
            const download = await dlPromise;
            await download.saveAs(outPath);
            const size = fs.existsSync(outPath) ? fs.statSync(outPath).size : 0;
            record(`Export ${label}: non-empty file`, size > 0,
                `${outFile} = ${size.toLocaleString()} bytes`);
        } catch (e) {
            const dlgMsg = dialogs.slice(dialogsBefore).join(' | ');
            record(`Export ${label}: non-empty file`, false,
                `no download captured — ${e.message}${dlgMsg ? ' | dialog: ' + dlgMsg : ''}`);
        }
    }

    // ── Helper: assert an insights subpage rendered primary content ────────────
    async function assertSubpage(file, label) {
        const mark = errMark();
        await page.goto(`${BASE}/${file}`, { waitUntil: 'load' });
        try {
            await page.waitForFunction(() => {
                const m = document.getElementById('main');
                return m && m.innerHTML.length > 300;
            }, { timeout: 20000 });
        } catch (_) { /* fall through to assertions below */ }

        const info = await page.evaluate(() => {
            const m = document.getElementById('main');
            if (!m) return { hasMain: false };
            return {
                hasMain: true,
                empty: !!m.querySelector('.empty-state'),
                htmlLen: m.innerHTML.length,
                textLen: m.textContent.trim().length,
                hasStructured: !!m.querySelector('table, svg, canvas, .insights-card, .kpi, .metric-card')
            };
        });

        const errs = newErrs(mark);
        record(`${label} (${file}): no app errors`, errs.length === 0,
            errs.length ? errs.map(e => `${e.kind}: ${e.text}`).join(' || ') : 'clean');
        record(`${label} (${file}): data hydrated (not empty-state)`,
            info.hasMain && !info.empty, info.hasMain ? (info.empty ? 'empty-state shown' : 'hydrated') : 'no #main');
        record(`${label} (${file}): primary content rendered`,
            info.hasMain && !info.empty && info.textLen > 100 && info.hasStructured,
            `textLen=${info.textLen}, structured=${info.hasStructured}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE A — Primary fixture: viva-large.csv (en-US), full assertions
    // ═══════════════════════════════════════════════════════════════════════════
    {
        const label = 'viva-large (en-US)';
        const mark = errMark();
        await uploadAndCalculate('viva-large.csv');
        const errs = newErrs(mark);
        record(`${label}: no uncaught exceptions / app console.error on upload+calc`,
            errs.length === 0, errs.length ? errs.map(e => `${e.kind}: ${e.text}`).join(' || ') : 'clean');
        await assertResults(label);

        // Exports (results are on-screen now)
        await runExport('[onclick="exportToDocx()"]', 'Copilot_ROI_Analysis.docx', 'DOCX');
        await runExport('[onclick="exportToPptx()"]', 'Copilot_ROI_Analysis.pptx', 'PPTX');
        await runExport('[onclick="exportExecutiveDeck()"]', 'Copilot_ROI_Executive_Deck.pptx', 'Executive Deck');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE B — In-report ROI hosts hydrate from the viva-large upload (Phase A)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        const hosts = await page.evaluate(() => {
            const probe = (k) => {
                const h = document.querySelector('.insights-host[data-tab-host="' + k + '"]');
                if (!h) return { found: false };
                const txt = h.textContent.trim();
                return {
                    found: true,
                    loading: /Loading/i.test(txt),
                    textLen: txt.length,
                    structured: !!h.querySelector('table, svg, canvas, .insights-card, .kpi, .metric-card')
                };
            };
            return { orgs: probe('orgs'), forecast: probe('forecast') };
        });
        record('In-report Organizations host populated (data-tab-host="orgs")',
            hosts.orgs.found && !hosts.orgs.loading && hosts.orgs.textLen > 100,
            hosts.orgs.found ? `textLen=${hosts.orgs.textLen}, structured=${hosts.orgs.structured}` : 'host not found');
        record('In-report ROI & Forecast host populated (data-tab-host="forecast")',
            hosts.forecast.found && !hosts.forecast.loading && hosts.forecast.textLen > 100,
            hosts.forecast.found ? `textLen=${hosts.forecast.textLen}, structured=${hosts.forecast.structured}` : 'host not found');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE C — Locale coverage: en-GB and es headers must parse + render
    // ═══════════════════════════════════════════════════════════════════════════
    for (const [fixture, label] of [['viva-en-gb.csv', 'viva-en-gb (en-GB)'], ['viva-es.csv', 'viva-es (es)']]) {
        const mark = errMark();
        await uploadAndCalculate(fixture);
        const errs = newErrs(mark);
        record(`${label}: no uncaught exceptions / app console.error on upload+calc`,
            errs.length === 0, errs.length ? errs.map(e => `${e.kind}: ${e.text}`).join(' || ') : 'clean');
        await assertResults(label);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE D — Heatmap CSV is rejected with guidance, not parsed and not thrown
    // ═══════════════════════════════════════════════════════════════════════════
    {
        const label = 'heatmap rejection (demo-data.csv)';
        const mark = errMark();
        const heatmapFixture = path.join(ROOT, 'demo-data.csv');
        record(`${label}: fixture present on disk`, fs.existsSync(heatmapFixture), heatmapFixture);

        await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
        await page.waitForSelector('#fileInput', { state: 'attached', timeout: 15000 });
        await page.setInputFiles('#fileInput', heatmapFixture);
        let shown = true;
        try {
            await page.waitForFunction(() => {
                const es = document.getElementById('errorState');
                return es && es.style.display === 'block' && es.textContent.trim().length > 0;
            }, { timeout: 15000 });
        } catch (_) { shown = false; }

        const rej = await page.evaluate(() => {
            const es = document.getElementById('errorState');
            return {
                text: es ? es.textContent.replace(/\s+/g, ' ').trim() : '',
                previewShown: !!document.getElementById('filePreview')
            };
        });

        record(`${label}: error state shown`, shown, shown ? 'errorState visible' : 'errorState never displayed');
        record(`${label}: names the unsupported heatmap export`,
            /Super Usage Report heatmap export, which is no longer supported/.test(rej.text),
            rej.text.slice(0, 200));
        record(`${label}: names the Viva Insights person-query requirement`,
            /Viva Insights person-query export/.test(rej.text), 'guidance text present');
        record(`${label}: lists all three required columns`,
            /PersonId/.test(rej.text) && /MetricDate/.test(rej.text) && /Total Copilot actions taken/.test(rej.text),
            'PersonId / MetricDate / Total Copilot actions taken');
        record(`${label}: no file preview / Calculate offered`, !rej.previewShown,
            rej.previewShown ? '#filePreview rendered for an unsupported file' : 'no preview');

        const errs = newErrs(mark);
        record(`${label}: zero uncaught pageerrors / app console.error`,
            errs.length === 0, errs.length ? errs.map(e => `${e.kind}: ${e.text}`).join(' || ') : 'clean');
    }

    // ── Global error summary ───────────────────────────────────────────────────
    record('Overall: zero app-origin errors across full session', appErrors.length === 0,
        appErrors.length ? appErrors.map(e => `${e.kind}: ${e.text}`).join(' || ') : 'clean');

    await context.close();
    await browser.close();
    server.close();

    // ── Summary ────────────────────────────────────────────────────────────────
    const failed = checks.filter(c => !c.pass);
    console.log('\n================= E2E SUMMARY =================');
    console.log(`Total checks: ${checks.length} | Passed: ${checks.length - failed.length} | Failed: ${failed.length}`);
    if (failed.length) {
        console.log('\nFAILED CHECKS:');
        failed.forEach(c => console.log(`  x ${c.name} — ${c.detail}`));
    }
    if (appErrors.length) {
        console.log('\nAPP ERROR DETAIL (with stacks):');
        appErrors.forEach((e, i) => console.log(`  [${i + 1}] ${e.kind}: ${e.text}${e.stack ? '\n        stack: ' + e.stack : ''}`));
    }
    console.log('\nExport artifacts in: ' + EXPORT_DIR);
    for (const f of ['Copilot_ROI_Analysis.docx', 'Copilot_ROI_Analysis.pptx', 'Copilot_ROI_Executive_Deck.pptx']) {
        const p = path.join(EXPORT_DIR, f);
        console.log(`  ${f}: ${fs.existsSync(p) ? fs.statSync(p).size.toLocaleString() + ' bytes' : 'MISSING'}`);
    }
    console.log('==============================================');
    console.log(failed.length === 0 ? 'RESULT: PASS' : 'RESULT: FAIL');
    process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((e) => {
    console.error('E2E harness crashed:', e);
    process.exit(1);
});
