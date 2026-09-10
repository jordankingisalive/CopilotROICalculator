// Viva Insights cohort correctness test — Slice 2.1.
//
// Loads the REAL product code (stagingroicalculator/header-mapping.js and
// script.js) into a jsdom window WITHOUT modifying any product file, then
// drives the real parseVivaInsights() / cohort code path against golden and
// locale fixtures. All tier and count assertions come from product output;
// the harness never re-implements the classification or rolling-average math.
//
// Exit code 0 = all assertion groups PASS, 1 = any failure.
//
// TZ is pinned to America/Chicago before any Date is created, on purpose: the
// golden fixtures span 2025-01-06 through 2025-03-24, deliberately crossing US
// spring-forward (2025-03-09). The product's rolling window builds each trailing
// week key by LOCAL calendar-field subtraction (new Date(y, m, d - k*7)), which
// is DST-immune for date-only keys. The pre-fix code walked back raw
// milliseconds (base.getTime() - k*7*86400000); under this DST zone that
// arithmetic lands a lookback at 23:00 of the prior day and toDateKey then
// yields the wrong calendar day, dropping that week from the window. These
// assertions therefore FAIL against the old ms-subtraction code and PASS with
// the calendar-field lookback, proving DST-safety in an actual DST zone.

'use strict';

process.env.TZ = 'America/Chicago';

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const STAGING = path.resolve(__dirname, '..');
const TEST = __dirname;

// ---- Load product code into a jsdom window (no product files are edited) ----
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { runScripts: 'outside-only' });
const { window } = dom;
// jsdom has no canvas backend; make any chart getContext a harmless no-op so
// render helpers can never throw. Not exercised by the parse/cohort path.
window.HTMLCanvasElement.prototype.getContext = () => null;

const headerMapSrc = fs.readFileSync(path.join(STAGING, 'header-mapping.js'), 'utf8');
const scriptSrc = fs.readFileSync(path.join(STAGING, 'script.js'), 'utf8');

window.eval(headerMapSrc);
// Append (in memory only) an export of the real global functions so the test
// can call them. The product file on disk is NOT modified.
window.eval(
    scriptSrc +
    '\n;window.__vivaApi = { parseVivaInsights, computePersonCohortsFromIndex, parseCSVLine, parseDate, parseNumber };'
);

const api = window.__vivaApi;
if (!api || typeof api.parseVivaInsights !== 'function') {
    console.error('FATAL: product functions did not load onto the jsdom window');
    process.exit(1);
}

// ---- Helpers -------------------------------------------------------------
const TIERS = ['Power Users', 'Habitual Users', 'Novice Users', 'Low Users', 'Non Users'];
const zeroCounts = () => ({ 'Power Users': 0, 'Habitual Users': 0, 'Novice Users': 0, 'Low Users': 0, 'Non Users': 0 });

// Mirror parseCSV()'s header prep exactly: raw split -> HeaderMapping.normalizeHeaders.
function parseViva(csvPath) {
    const text = fs.readFileSync(csvPath, 'utf8');
    const lines = text.trim().split(/\r?\n/);
    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const headers = window.HeaderMapping.normalizeHeaders(rawHeaders);
    return api.parseVivaInsights(lines, headers);
}

// Latest week for a person = max date string (product sorts weeks ascending).
function latestWeek(person) {
    return person.weeks.reduce((a, b) => (a.d > b.d ? a : b));
}

// Auxiliary cross-check of the documented 9-of-12-weeks habit rule, computed
// from the REAL parsed week data. The authoritative tier still comes from the
// product's stored w.threshold; this only validates the golden habit column.
function deriveHabit(person, latest) {
    const byDate = {};
    person.weeks.forEach(w => { byDate[w.d] = w.a; });
    const base = api.parseDate(latest.d);
    let nonZero = 0;
    for (let k = 0; k < 12; k++) {
        const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate() - k * 7);
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        if (Object.prototype.hasOwnProperty.call(byDate, key) && byDate[key] >= 1) nonZero += 1;
    }
    return nonZero >= 9;
}

// Reduce a parse result to per-person latest-week snapshot + org/overall counts.
function snapshot(result) {
    const persons = {};
    const orgTierCounts = {};
    const overall = zeroCounts();
    Object.entries(result.personIndex).forEach(([pid, p]) => {
        const latest = latestWeek(p);
        const tier = latest.threshold;
        const rl12w = latest.avg12;
        persons[pid] = { rl12w, habit: deriveHabit(p, latest), tier };
        const org = p.org;
        if (!orgTierCounts[org]) orgTierCounts[org] = zeroCounts();
        if (orgTierCounts[org][tier] != null) orgTierCounts[org][tier] += 1;
        if (overall[tier] != null) overall[tier] += 1;
    });
    return { persons, orgTierCounts, overallTierCounts: overall };
}

// ---- Assertion plumbing --------------------------------------------------
let failures = 0;
function group(label, fn) {
    const before = failures;
    fn();
    const ok = failures === before;
    console.log(`${ok ? 'PASS' : 'FAIL'} :: ${label}`);
}
function check(cond, msg) {
    if (!cond) { failures += 1; console.log(`   FAIL: ${msg}`); }
}
function eqNum(a, b, msg) { check(Math.abs(a - b) < 1e-9, `${msg} (got ${a}, expected ${b})`); }
function eqCounts(actual, expected, ctx) {
    TIERS.forEach(t => check(actual[t] === expected[t], `${ctx} ${t}: got ${actual[t]}, expected ${expected[t]}`));
}

// ---- Golden fixture ------------------------------------------------------
const expected = JSON.parse(fs.readFileSync(path.join(TEST, 'golden-viva.expected.json'), 'utf8'));
const golden = snapshot(parseViva(path.join(TEST, 'golden-viva.csv')));

group('golden per-person tiers, rl12w, habit', () => {
    Object.keys(expected.persons).forEach(pid => {
        const exp = expected.persons[pid];
        const got = golden.persons[pid];
        check(!!got, `person ${pid} present in result`);
        if (!got) return;
        check(got.tier === exp.tier, `${pid} tier: got ${got.tier}, expected ${exp.tier}`);
        eqNum(got.rl12w, exp.rl12w, `${pid} rl12w`);
        check(got.habit === exp.habit, `${pid} habit: got ${got.habit}, expected ${exp.habit}`);
    });
    check(Object.keys(golden.persons).length === Object.keys(expected.persons).length,
        `person count: got ${Object.keys(golden.persons).length}, expected ${Object.keys(expected.persons).length}`);
});

group('golden per-org tier counts', () => {
    Object.keys(expected.orgTierCounts).forEach(org => {
        check(!!golden.orgTierCounts[org], `org ${org} present`);
        if (golden.orgTierCounts[org]) eqCounts(golden.orgTierCounts[org], expected.orgTierCounts[org], `org ${org}`);
    });
});

group('golden overall tier counts', () => {
    eqCounts(golden.overallTierCounts, expected.overallTierCounts, 'overall');
});

// ---- Locale normalization: en-GB and es must yield the same overall counts --
const enGb = snapshot(parseViva(path.join(TEST, 'viva-en-gb.csv')));
const es = snapshot(parseViva(path.join(TEST, 'viva-es.csv')));

group('en-GB header normalization -> same overall counts as golden', () => {
    eqCounts(enGb.overallTierCounts, golden.overallTierCounts, 'en-GB vs golden');
});
group('es header normalization -> same overall counts as golden', () => {
    eqCounts(es.overallTierCounts, golden.overallTierCounts, 'es vs golden');
});

// ---- Large smoke test ----------------------------------------------------
group('large fixture parses and every person gets a valid tier', () => {
    let large;
    try {
        large = parseViva(path.join(TEST, 'viva-large.csv'));
    } catch (e) {
        check(false, `parse threw: ${e && e.message}`);
        return;
    }
    const pids = Object.keys(large.personIndex);
    check(pids.length > 0, 'large fixture produced persons');
    let bad = 0;
    pids.forEach(pid => {
        const tier = latestWeek(large.personIndex[pid]).threshold;
        if (TIERS.indexOf(tier) === -1) bad += 1;
    });
    check(bad === 0, `${bad} persons had an invalid tier`);
    console.log(`   info: ${pids.length} persons parsed from viva-large.csv`);
});

// ---- Result --------------------------------------------------------------
console.log(`\nRESULT: ${failures === 0 ? 'ALL ASSERTION GROUPS PASSED' : failures + ' assertion(s) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
