# Executive Deck PPTX Export - Complete Reference Template

> **Created:** May 14, 2026  
> **Purpose:** Comprehensive backup of the Executive Deck export function, formatting, and lessons learned  
> **Version:** v24 (with dataLabelColor fix)

---

## Table of Contents
1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Critical Chart Properties](#critical-chart-properties)
4. [Complete Function Code](#complete-function-code)
5. [Lessons Learned](#lessons-learned)
6. [Testing Checklist](#testing-checklist)

---

## Overview

The `exportExecutiveDeck()` function generates a 9-slide PowerPoint presentation using the **PptxGenJS** library. The deck features:

- **Dark theme** with navy blue background (`0B1F3A`)
- **9 slides total**:
  1. Title slide with headline stats
  2. Executive summary with 3 insight cards
  3. Key metrics dashboard (8 metric cards)
  4. Value by organization (top 10 bar chart + Pareto sidebar)
  5. Usage tier distribution table
  6. Break-even & pricing sensitivity (bar chart + pricing sidebar)
  7. Unlicensed opportunity cost projection
  8. Expansion projections (bar chart showing ROI scaling)
  9. Recommendations with 3 action cards

- **Layout:** 13.33" × 7.5" (wide format)
- **Fonts:** 
  - **Cambria** for headlines and large numbers (bold)
  - **Calibri** for body text, labels, and data

---

## Color Palette

```javascript
// Executive Deck Color Tokens (lines 2672-2686 in script.js)
const BG_DARK = '06132B';     // Darkest navy - used on title slide only
const BG = '0B1F3A';          // Primary background - all other slides
const CARD = '0F2647';        // Card/container background
const CARD_ALT = '16335E';    // Alternate card background for variation
const CYAN = '4FC3F7';        // Primary accent - section headers, highlights
const GREEN = '4ADE80';       // Success/positive - ROI, value metrics
const GOLD = 'F5C451';        // Warning/opportunity - mid-tier, expansion
const RED = 'F26D6D';         // Cost/investment - rarely used, only for cost labels
const WHITE = 'FFFFFF';       // Primary text for emphasis
const TEXT = 'CADCFC';        // Secondary text - light blue-gray
const MUTED = '9AB0CC';       // Tertiary text - muted blue-gray for footnotes
```

### Color Usage Rules
- **Background:** Always `BG` (`0B1F3A`) for slides 2-9
- **Headlines:** Always `WHITE` (`FFFFFF`) for maximum contrast
- **Section labels:** Always `CYAN` (`4FC3F7`) for consistency
- **Body text:** Use `TEXT` (`CADCFC`) for readability
- **Footnotes/metadata:** Use `MUTED` (`9AB0CC`)
- **Data values:** Use `WHITE` for emphasis, `GREEN` for positive metrics (ROI, value)
- **Chart data labels:** **MUST** use `WHITE` (`FFFFFF`) — this is critical for readability

---

## Critical Chart Properties

### ⚠️ IMPORTANT: PptxGenJS Chart Text Color Properties

PptxGenJS uses **separate properties** for different text elements in charts. Confusing these will cause readability issues:

| Property | Controls | Example |
|----------|----------|---------|
| `valueFontColor` | **Legend/series name text** | "Monthly Value ($)" legend label |
| `dataLabelColor` | **Numbers ON the bars/points** | "42,500" displayed on a bar |
| `catAxisLabelColor` | **Category axis labels** | Team names on left side of horizontal bar chart |
| `valAxisLabelColor` | **Value axis labels** | "0, 50K, 100K" on bottom of chart |

### ✅ Correct Chart Configuration

All three charts in the deck (Slides 4, 6, 8) **MUST** include these properties:

```javascript
s4.addChart(pptx.charts.BAR, [...], {
    x: 0.60, y: 1.60, w: 8.60, h: 5.15,
    showTitle: false,
    showValue: true,                    // Show numbers on bars
    valueFontSize: 8,                   // Legend font size
    valueFontColor: WHITE,              // Legend text color
    dataLabelColor: WHITE,              // ✅ Numbers on bars - CRITICAL!
    dataLabelFontSize: 8,               // ✅ Size of numbers on bars
    catAxisLabelColor: TEXT,            // Axis label color
    catAxisLabelFontSize: 9,
    catAxisLabelFontFace: 'Calibri',
    valAxisHidden: true,                // Hide value axis (or style it)
    catGridLine: { style: 'none' },
    valGridLine: { 
        color: CARD_ALT, 
        style: 'dash', 
        size: 0.5 
    },
    chartColors: [CYAN],                // Bar color
    barDir: 'bar',                      // Horizontal bars
    plotArea: { fill: { color: BG } },
});
```

### 🚨 What Happens If You Forget `dataLabelColor`

If `dataLabelColor` is **missing**, PptxGenJS defaults to **BLACK** text for the numbers on bars. On a dark blue background (`BG = '0B1F3A'`), this is **completely unreadable**.

**Symptoms:**
- Legend text is white ✅ (controlled by `valueFontColor`)
- Axis labels are light blue ✅ (controlled by `catAxisLabelColor`)
- **Numbers on bars are BLACK** ❌ (no `dataLabelColor` = default black)

**Fix:** Add `dataLabelColor: WHITE,` to the chart options.

---

## Complete Function Code

The full `exportExecutiveDeck()` function is 600+ lines. Key sections:

### Function Location
- **File:** `CopilotROICalculator/script.js`
- **Lines:** 2642-3241
- **Dependencies:** 
  - `PptxGenJS` library (loaded from CDN in index.html)
  - `calculateMetrics()` function
  - `generateStoryNarrative()` function
  - Global `config` object (license cost, professional rate, minutes per action)
  - Global `uploadedData` object (rows, date range, group label)

### Slide Structure

```javascript
// SLIDE 1: Title (decorative bars, headline stat)
const s1 = pptx.addSlide();
s1.background = { color: BG_DARK };
// ... title content, decorative bars, footer

// SLIDE 2: Executive Summary (3 insight cards)
const s2 = pptx.addSlide();
s2.background = { color: BG };
addSectionHeader(s2, 'EXECUTIVE SUMMARY', 'Copilot is delivering Xx ROI today');
// ... summary paragraph, 3 cards, footer

// SLIDE 3: Key Metrics (8 metric cards in 3 rows)
const s3 = pptx.addSlide();
s3.background = { color: BG };
// ... 2 big cards, 3+3 medium cards, footer

// SLIDE 4: Value by Organization (bar chart + Pareto sidebar)
const s4 = pptx.addSlide();
s4.background = { color: BG };
s4.addChart(pptx.charts.BAR, [...], {
    // ✅ CRITICAL: Include dataLabelColor
    dataLabelColor: WHITE,
    dataLabelFontSize: 8,
    valueFontColor: WHITE,
    // ... other properties
});
// ... Pareto insight sidebar, footer

// SLIDE 5: Usage Tier Distribution (table)
const s5 = pptx.addSlide();
s5.background = { color: BG };
// ... tier breakdown table, footer

// SLIDE 6: Break-Even Analysis (bar chart + pricing sidebar)
const s6 = pptx.addSlide();
s6.background = { color: BG };
s6.addChart(pptx.charts.BAR, [...], {
    // ✅ CRITICAL: Include dataLabelColor
    dataLabelColor: WHITE,
    dataLabelFontSize: 10,
    valueFontColor: WHITE,
    // ... other properties
});
// ... pricing sensitivity sidebar, footer

// SLIDE 7: Unlicensed Opportunity (callout + 3 cards)
const s7 = pptx.addSlide();
s7.background = { color: BG };
// ... opportunity cost calculation, footer

// SLIDE 8: Expansion Projections (bar chart + sidebar)
const s8 = pptx.addSlide();
s8.background = { color: BG };
s8.addChart(pptx.charts.BAR, [...], {
    // ✅ CRITICAL: Include dataLabelColor
    dataLabelColor: WHITE,
    dataLabelFontSize: 10,
    valueFontColor: WHITE,
    // ... other properties
});
// ... projection sidebar, footer

// SLIDE 9: Recommendations (3 action cards)
const s9 = pptx.addSlide();
s9.background = { color: BG };
// ... decorative bars, 3 recommendation cards

// Export
await pptx.writeFile({ fileName: 'Copilot_ROI_Executive_Deck.pptx' });
```

### Helper Functions

```javascript
// Add consistent footer to slides 2-8
const addFooter = (slide, pageNum) => {
    slide.addText(`M365 Copilot ROI Analysis  |  ${weeks} weeks  |  ${rows.length} ${groupLabel}`, {
        x: 0.60, y: 7.15, w: 9.0, h: 0.30, 
        fontSize: 9, fontFace: 'Calibri', color: MUTED
    });
    slide.addText(`${pageNum} / ${totalSlides}`, {
        x: 12.20, y: 7.15, w: 0.60, h: 0.30, 
        fontSize: 9, fontFace: 'Calibri', color: MUTED, align: 'right'
    });
};

// Add section header (label + headline)
const addSectionHeader = (slide, label, headline) => {
    slide.addText(label, {
        x: 0.60, y: 0.55, w: 8.0, h: 0.30, 
        fontSize: 11, fontFace: 'Calibri', color: CYAN, bold: true
    });
    slide.addText(headline, {
        x: 0.60, y: 0.85, w: 12.20, h: 0.65, 
        fontSize: 28, fontFace: 'Cambria', color: WHITE, bold: true, valign: 'top'
    });
};
```

---

## Lessons Learned

### 1. **Chart Text Color Bug (May 14, 2026)**

**Problem:** Chart numbers appeared in BLACK on dark blue background (unreadable).

**Root Cause:** `dataLabelColor` property was **missing** from all 3 chart configurations. PptxGenJS defaults to black when this property is not explicitly set.

**Confusion:** We initially only set `valueFontColor: WHITE`, which controls the **legend** text, not the numbers displayed **on the bars**. These are controlled by separate properties.

**Fix Applied:**
- Added `dataLabelColor: WHITE,` to Slide 4 chart (line ~2910)
- Added `dataLabelColor: WHITE,` to Slide 6 chart (line ~3028)
- Added `dataLabelColor: WHITE,` to Slide 8 chart (line ~3148)
- Also added `dataLabelFontSize` for consistency (8, 10, 10)
- Bumped cache version to v24 to force browser refresh

**Verification:** User confirmed fix worked after hard refresh (Ctrl+Shift+R).

---

### 2. **Header Font Overlap (May 13, 2026)**

**Problem:** Slide 4 section header text ran into the top of the chart.

**Root Cause:** Headline font size was too large (36pt).

**Fix:** Reduced headline font from 36pt → 28pt in `addSectionHeader()` function.

---

### 3. **File Insertion Location Matters**

**Problem:** First attempt at adding "Download Local Package" feature broke the entire site. CSV upload stopped working, no errors in console.

**Root Cause:** Accidentally inserted `downloadLocalPackage()` function code **inside** the `exportExecutiveDeck()` function (around line 3026) instead of **after** it.

**Fix:** 
1. Emergency rollback: `git reset --hard b68e37f`
2. Properly added function at **end of file** (after line 3241)

**Lesson:** Always check function boundaries before inserting new code. Use grep to confirm closing braces.

---

### 4. **Cache-Busting is Essential**

**Problem:** Users not seeing changes after deployment to GitHub Pages.

**Solution:** Version parameter in script/CSS tags:
```html
<link rel="stylesheet" href="styles.css?v=24">
<script src="script.js?v=24"></script>
```

Bump version number (v20 → v21 → v22 → v23 → v24) with each significant change to force browser refresh.

**User Instruction:** When cache-busting alone isn't enough, tell users to do **hard refresh**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac).

---

### 5. **Backup Before Major Changes**

**Crisis Event:** May 14, 2026 - production site accidentally overwritten with simplified version. Lost pagination, PPTX export, slicers, and full report features.

**Emergency Recovery:** 
- `git log --oneline` to find last working commit (May 7: `3464cbf`)
- `git reset --hard 3464cbf` to restore
- Created separate backup repository: `github.com/jordankingisalive/roicalculatorbackup`

**Lesson:** Before attempting significant features, commit current working state with clear message like "STABLE - before adding [feature]".

**Current Backup Strategy:**
- **Production:** `CopilotROICalculator` (public)
- **Staging:** `stagingroicalculator` (public)
- **Backup:** `roicalculatorbackup` (private, weekly snapshots)

---

## Testing Checklist

Before deploying any changes to the Executive Deck export:

### Pre-Deployment
- [ ] All text elements use approved colors (WHITE, TEXT, CYAN, MUTED)
- [ ] **All charts have `dataLabelColor: WHITE` explicitly set**
- [ ] Charts have `chartColors: [CYAN]` or appropriate color array
- [ ] Font sizes are consistent (headlines 28-40pt, body 12-13pt, footnotes 9-11pt)
- [ ] `addFooter()` called on slides 2-8 with correct page numbers
- [ ] Color palette constants match reference (BG, CARD, CYAN, GREEN, etc.)
- [ ] Cache version bumped in index.html (both CSS and script tags)

### Post-Deployment
- [ ] Do hard refresh (Ctrl+Shift+R) to clear browser cache
- [ ] Upload sample CSV file
- [ ] Click "Export Executive Deck (PPTX)" button
- [ ] Download completes (~50-100KB file size)
- [ ] Open PPTX in PowerPoint/LibreOffice/Google Slides
- [ ] Check Slide 1: Title renders correctly, no text cutoff
- [ ] Check Slide 4: **Bar chart numbers are WHITE, not black**
- [ ] Check Slide 6: **Bar chart numbers are WHITE, not black**
- [ ] Check Slide 8: **Bar chart numbers are WHITE, not black**
- [ ] All other text is readable (no black-on-dark-blue)
- [ ] Verify footer appears on slides 2-8 with correct page numbers
- [ ] Verify section headers have CYAN labels + WHITE headlines

### Common Issues
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Black numbers on charts | Missing `dataLabelColor` | Add `dataLabelColor: WHITE,` to chart config |
| White legend but black data labels | Only set `valueFontColor`, not `dataLabelColor` | Add both properties |
| Text overlaps chart | Font size too large | Reduce headline font (28pt max) |
| Changes don't appear | Browser cache | Bump cache version, hard refresh |
| Export button does nothing | Function broken, check console | Review recent edits, check closing braces |
| Download works but PPTX won't open | Invalid PPTX structure | Check for syntax errors in chart configs |

---

## File Locations

### Source Files
- **Main script:** `CopilotROICalculator/script.js` (lines 2642-3241)
- **HTML page:** `CopilotROICalculator/index.html`
- **Styles:** `CopilotROICalculator/styles.css`
- **PptxGenJS library:** Loaded from CDN in index.html

### Git Repositories
- **Production:** https://github.com/jordankingisalive/CopilotROICalculator
- **Staging:** https://github.com/jordankingisalive/stagingroicalculator
- **Backup:** https://github.com/jordankingisalive/roicalculatorbackup (private)

### Current Version
- **Cache Version:** v24
- **Last Modified:** May 14, 2026
- **Commit:** d357f11 ("Fix black chart data labels in Executive Deck - add dataLabelColor WHITE to all charts, bump to v24")

---

## Quick Reference: Chart Config Template

Copy-paste this for any new charts added to the deck:

```javascript
slide.addChart(pptx.charts.BAR, [
    { name: 'Series Name', labels: chartLabels, values: chartValues }
], {
    x: 0.60, y: 1.80, w: 8.00, h: 4.60,
    showTitle: false,
    showValue: true,                    // Show data labels on bars
    valueFontSize: 10,                  // Legend text size
    valueFontColor: WHITE,              // Legend text color
    dataLabelColor: WHITE,              // ✅ CRITICAL: Numbers on bars
    dataLabelFontSize: 10,              // ✅ Size of numbers on bars
    catAxisLabelColor: TEXT,            // Category axis labels
    catAxisLabelFontSize: 10,
    catAxisLabelFontFace: 'Calibri',
    valAxisLabelColor: MUTED,           // Value axis labels (if shown)
    valAxisLabelFontSize: 9,
    catGridLine: { style: 'none' },     // Hide category gridlines
    valGridLine: {                      // Subtle value gridlines
        color: CARD_ALT, 
        style: 'dash', 
        size: 0.5 
    },
    chartColors: [CYAN],                // Bar/series color
    barDir: 'bar',                      // 'bar' = horizontal, 'col' = vertical
    plotArea: { fill: { color: BG } },  // Chart background
});
```

---

## Contact

- **Developer:** jordanking@microsoft.com
- **Tool URL:** https://jordankingisalive.github.io/CopilotROICalculator/
- **Created:** May 2026
- **Purpose:** M365 Copilot ROI Calculator with Executive Deck PPTX export

---

**END OF TEMPLATE**

_This document serves as the authoritative reference for the Executive Deck export functionality. Keep it updated with any future changes to formatting, colors, or chart configurations._
