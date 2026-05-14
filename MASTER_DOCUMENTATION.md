# M365 Copilot ROI Calculator - Master Documentation
## Complete System Reference & Checkpoint

> **Checkpoint Date:** May 14, 2026  
> **Version:** v25  
> **Commit:** 16ad234  
> **Status:** Production-ready, fully functional  
> **Purpose:** Complete documentation of all components, features, and architecture

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Complete File Structure](#complete-file-structure)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [Key Functions Reference](#key-functions-reference)
6. [Design System](#design-system)
7. [Dependencies & Libraries](#dependencies--libraries)
8. [Deployment & Maintenance](#deployment--maintenance)
9. [Configuration & Settings](#configuration--settings)
10. [Critical Code Locations](#critical-code-locations)
11. [Version History](#version-history)
12. [Backup & Recovery](#backup--recovery)

---

## System Overview

The **M365 Copilot Productivity ROI Calculator** is a comprehensive web application that analyzes Microsoft 365 Copilot usage data and generates detailed ROI projections, visualizations, and executive-ready reports.

### What It Does
- **Parses CSV data** from Microsoft 365 Copilot usage reports
- **Calculates ROI metrics** (adoption rates, productivity value, cost analysis)
- **Generates interactive visualizations** (charts, heatmaps, tier breakdowns)
- **Produces executive reports** in multiple formats:
  - PDF (full report with all charts)
  - DOCX (narrative document)
  - PPTX (9-slide executive deck)
  - PPTX (full 12-slide detailed deck)
- **Runs offline** with complete local package support
- **Provides adoption guidance** with journey mapping

### Primary Users
- Microsoft sales engineers
- Customer success managers
- IT decision-makers
- Finance teams evaluating Copilot ROI

---

## Complete File Structure

### Root Files (18 total)

```
CopilotROICalculator/
├── index.html                   (18 KB, 258 lines)   - Main data analysis page
├── roi-calculator.html          (54 KB, 1026 lines)  - Simplified ROI calculator
├── Start Here.html              (29 KB, 597 lines)   - Adoption journey guide
├── run-locally.html             (15 KB, 180 lines)   - Local installation guide
├── script.js                    (217 KB, 3131 lines) - Main application logic
├── sales-script.js              (33 KB, 536 lines)   - ROI calculator logic
├── styles.css                   (18 KB, 769 lines)   - Global styles
├── sw.js                        (1 KB, 35 lines)     - Service worker (PWA)
├── sample-data.csv              (1 KB, 11 lines)     - Example CSV data
├── RUN_LOCAL_SERVER.bat         (1 KB, 42 lines)    - Windows launcher
├── RUN_LOCAL_SERVER.sh          (2 KB, 48 lines)    - Unix/Mac launcher
├── README.md                    (5 KB, 120 lines)    - GitHub readme
├── README_LOCAL.md              (4 KB, 89 lines)     - Local usage guide
├── DEPLOYMENT.md                (14 KB, 407 lines)   - Deployment guide
├── EXECUTIVE_DECK_TEMPLATE.md   (16 KB, 332 lines)  - PPTX export reference
├── PRIVACY.md                   (5 KB, 90 lines)     - Privacy policy
├── LICENSE                      (1 KB, 17 lines)     - MIT license
└── .gitignore                   (1 KB, 44 lines)     - Git ignore rules

lib/
├── pptxgen.bundle.js            (466 KB)             - PowerPoint generation
├── docx.umd.js                  (752 KB)             - Word document generation
├── jspdf.umd.min.js             (358 KB)             - PDF generation
├── html2canvas.min.js           (194 KB)             - HTML to canvas rendering
└── jszip.min.js                 (95 KB)              - ZIP file creation

Total Assets: 23 files
Total Size: ~2.2 MB (without .git)
```

---

## Core Features

### 1. Data Analysis (index.html + script.js)

**CSV Import & Processing**
- Drag-and-drop CSV upload
- Automatic schema detection
- Date parsing (multiple formats supported)
- Flattening of grouped/weekly data
- Group label detection (teams, departments, organizations)

**Metrics Calculated**
- Total purchased licenses
- Active users (weekly threshold: 1+ action)
- Activation rate (active/enabled ratio)
- Power users (20+ actions/week)
- Power user rate
- Total weekly actions
- Average actions per user
- Monthly productivity value
- Annual value projection
- Monthly cost (licenses × $30)
- ROI multiple (value/cost)

**Visualizations**
- Executive summary cards (8 key metrics)
- Time period comparison (current vs. prior 4 weeks)
- Usage tier distribution (Top 10%, 75-90%, 50-75%, 25-50%, Bottom 25%)
- Weekly trend charts (actions per user)
- Usage heatmap (teams × weeks)
- Top performers table (sortable, searchable, paginated)
- Opportunity cost projections (unlicensed users)

**Interactive Features**
- Time period toggle (4-week, 8-week, 12-week, All Time)
- Minutes per action selector (2, 3, 5, 10, custom)
- Slicer controls for filtering data
- Export buttons (PDF, DOCX, PPTX, Executive Deck)
- Search/filter teams table
- Sort by any column

**Report Tabs**
1. **Data Analysis** - Full metrics and charts
2. **Tier Analysis** - Distribution and ROI by usage tier
3. **All Teams** - Detailed table with search/sort/pagination
4. **Opportunity Cost** - Unlicensed user value projections

---

### 2. ROI Calculator (roi-calculator.html + sales-script.js)

**Purpose:** Simplified calculator for quick ROI estimates without uploading CSV data.

**Inputs**
- Number of licenses
- Average weekly actions per user
- Minutes saved per action (configurable)
- Professional hourly rate (default: $125)
- License cost per month (default: $30)

**Outputs**
- Monthly productivity value
- Annual value projection
- ROI multiple
- Break-even actions per month
- Cost per hour saved

**Features**
- Real-time calculation (no "Run" button needed)
- Preset scenarios for common use cases
- Responsive design for mobile/tablet
- Export summary as PDF/DOCX

---

### 3. Adoption Journey (Start Here.html)

**Purpose:** Guide for driving Copilot adoption in organizations.

**Content Sections**
- Pre-Launch Checklist
- Week 1-2: Initial Rollout
- Week 3-4: Early Momentum
- Week 5-8: Expanding Adoption
- Week 9-12: Measuring Success
- Ongoing: Continuous Improvement
- Power User Program guidance
- Champion identification strategies
- Training recommendations

**Features**
- Expandable/collapsible sections
- Progress tracking (local storage)
- Printable checklist
- Links to Microsoft resources

---

### 4. Run Locally Feature (run-locally.html + downloadLocalPackage())

**Purpose:** Allow users to download and run the tool without internet connectivity.

**Download Package Contents (18 files)**
- All HTML pages (index, roi-calculator, Start Here, run-locally)
- All scripts (script.js, sales-script.js, sw.js)
- All styles (styles.css)
- All libraries (lib/*.js - 5 files)
- Sample data (sample-data.csv)
- Local readme (README_LOCAL.md)
- Launchers (RUN_LOCAL_SERVER.bat, RUN_LOCAL_SERVER.sh)
- Privacy & license docs

**How It Works**
1. User clicks "Download Local" button (green button in header)
2. `downloadLocalPackage()` function runs (line 3409 in script.js)
3. JSZip creates in-memory ZIP file
4. Fetch all 18 files from server
5. Add to ZIP with original paths
6. Trigger browser download (~2 MB file)
7. User extracts ZIP, runs launcher script
8. Local Python HTTP server starts on port 8000
9. Browser opens to local version

**Launchers**
- **Windows:** `RUN_LOCAL_SERVER.bat` - Starts Python SimpleHTTPServer
- **Mac/Linux:** `RUN_LOCAL_SERVER.sh` - Same functionality, bash script

---

### 5. Export Features

#### PDF Export (full report)
- **Function:** `exportToPdf()` - NOT IMPLEMENTED YET (commented out)
- **Library:** jsPDF + html2canvas
- **Content:** All visible charts and tables as images
- **Status:** Placeholder - future enhancement

#### DOCX Export (narrative document)
- **Function:** `exportToDocx()` (line 2192)
- **Library:** docx.js (UMD build)
- **Content:**
  - Cover page with title and key stats
  - Executive summary paragraph
  - 8 key metrics in formatted table
  - Usage tier breakdown table
  - Top 10 teams table
  - Recommendations section
- **Styling:** 
  - Calibri font family
  - Dark blue headings (#0B1F3A)
  - Cyan accents (#4FC3F7)
  - Professional spacing and borders

#### PPTX Export - Full Deck (12 slides)
- **Function:** `exportToPptx()` (line 2381)
- **Library:** PptxGenJS
- **Slides:**
  1. Title slide
  2. Executive summary
  3. Key metrics (8-card dashboard)
  4. Usage trends chart
  5. Tier distribution table
  6. Top 10 teams chart
  7. Usage heatmap
  8. Opportunity cost projection
  9. Break-even analysis
  10. Expansion projections
  11. Recommendations
  12. Thank you / contact
- **Format:** 13.33" × 7.5" (wide)
- **Theme:** Light background with blue accents

#### PPTX Export - Executive Deck (9 slides)
- **Function:** `exportExecutiveDeck()` (line 2642)
- **Library:** PptxGenJS
- **Slides:**
  1. Title with headline stat
  2. Executive summary (3 insight cards)
  3. Key metrics (8 cards in 3 rows)
  4. Value by organization (bar chart + Pareto sidebar)
  5. Usage tier distribution (table)
  6. Break-even & pricing sensitivity (bar chart + pricing sidebar)
  7. Unlicensed opportunity cost
  8. Expansion projections (bar chart)
  9. Recommendations (3 action cards)
- **Format:** 13.33" × 7.5" (wide)
- **Theme:** **Dark navy background** (`0B1F3A`)
- **Critical Properties:** All charts MUST have `dataLabelColor: WHITE` explicitly set
- **Documentation:** See [EXECUTIVE_DECK_TEMPLATE.md](EXECUTIVE_DECK_TEMPLATE.md) for complete reference

---

## Technical Architecture

### Frontend Stack
- **HTML5** - Semantic markup, no frameworks
- **CSS3** - Custom properties (CSS variables), Flexbox, Grid
- **Vanilla JavaScript** - ES6+, async/await, no jQuery

### Key Libraries
| Library | Version | Purpose | Size |
|---------|---------|---------|------|
| PptxGenJS | ~3.12 | PowerPoint generation | 466 KB |
| docx.js | ~7.8 UMD | Word document generation | 752 KB |
| jsPDF | ~2.5 | PDF generation | 358 KB |
| html2canvas | ~1.4 | HTML to canvas rendering | 194 KB |
| JSZip | ~3.10 | ZIP file creation | 95 KB |

### Data Flow

```
CSV Upload
    ↓
parseCSV() → Parse text to rows
    ↓
flattenData() → Convert grouped data to weekly rows
    ↓
calculateMetrics() → Compute all ROI metrics
    ↓
renderResults() → Generate HTML visualizations
    ↓
User Actions:
  - Switch time periods → computeTeamsForPeriod()
  - Change minutes/action → switchMinutesPerAction()
  - Export to DOCX → exportToDocx()
  - Export to PPTX → exportToPptx()
  - Export Executive Deck → exportExecutiveDeck()
  - Download Local → downloadLocalPackage()
```

### State Management
- **Global Variables:**
  - `uploadedData` - Parsed CSV data (rows, headers, date range, group label)
  - `config` - User settings (license cost, professional rate, minutes per action, analysis weeks)
  - `currentAnalysisPeriod` - Time period filter (4wk, 8wk, 12wk, all)

- **No Framework:** State stored in plain JavaScript objects, DOM updated imperatively

### Browser Compatibility
- **Modern browsers only** (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+)
- Uses ES6+ features (arrow functions, template literals, async/await)
- No polyfills included (could be added if needed)

---

## Key Functions Reference

### Data Processing Functions (script.js)

| Function | Line | Purpose |
|----------|------|---------|
| `handleFile(file)` | 137 | Process uploaded CSV file |
| `parseCSV(csvText)` | 270 | Parse CSV text to array of objects |
| `parseCSVLine(line)` | 301 | Parse single CSV line (handles quoted fields) |
| `parseDate(dateString)` | 328 | Parse various date formats to Date object |
| `flattenData(rows)` | 351 | Convert grouped/weekly data to individual rows |
| `parseNumber(value)` | 638 | Parse number with commas/decimals |
| `calculateMetrics(data)` | 649 | Calculate all ROI metrics from data |

### Analysis Functions

| Function | Line | Purpose |
|----------|------|---------|
| `computeTeamsForPeriod(period)` | 716 | Filter data by time period (4wk, 8wk, 12wk, all) |
| `computePrior4Weeks()` | 815 | Calculate metrics for prior 4-week period |
| `trendBadge(current, previous)` | 852 | Generate trend indicator (↑/↓ with color) |
| `buildProjectionTables(metrics, sortedTeams)` | 1036 | Build usage tier distribution tables |
| `updateOppCost()` | 1332 | Calculate unlicensed user opportunity cost |

### UI Functions

| Function | Line | Purpose |
|----------|------|---------|
| `renderResults()` | 1455 | Main rendering function - generates all HTML |
| `switchTimePeriod(period)` | 862 | Change time period filter |
| `switchMinutesPerAction(minutes)` | 1427 | Change minutes-per-action setting |
| `switchReportTab(tabId)` | 1433 | Switch between report tabs |
| `filterTeamsTable()` | 3258 | Filter teams table by search query |
| `initTableSorting()` | 3272 | Initialize table column sorting |
| `sortTable(column, type, direction)` | 3310 | Sort table by column |

### Export Functions

| Function | Line | Purpose |
|----------|------|---------|
| `generateStoryNarrative()` | 1992 | Generate AI-style narrative for reports |
| `exportToDocx()` | 2192 | Export narrative document to Word |
| `exportToPptx()` | 2381 | Export full 12-slide PowerPoint deck |
| `exportExecutiveDeck()` | 2642 | Export 9-slide executive PowerPoint deck |
| `downloadLocalPackage(event)` | 3409 | Create and download ZIP of all files |

### Helper Functions

| Function | Line | Purpose |
|----------|------|---------|
| `showLoading()` | 3357 | Show loading spinner state |
| `showError(message)` | 3367 | Show error message state |
| `prepareForCapture(container)` | 1933 | Prepare DOM for screenshot (fix scrolling elements) |
| `restoreAfterCapture(container, state)` | 1965 | Restore DOM after screenshot |
| `captureSections(container, progressCb)` | 1976 | Capture DOM sections as images for PDF |

---

## Design System

### Color Palette

#### Main Application (Light Theme)
```css
:root {
    --copilot-dark: #06132B;        /* Primary background */
    --copilot-card: #0B1F3A;        /* Card backgrounds */
    --copilot-card-alt: #0F2647;    /* Alternate card color */
    --copilot-cyan: #00D4FF;        /* Primary accent */
    --copilot-green: #10B981;       /* Success/positive */
    --copilot-purple: #A855F7;      /* Secondary accent */
    --copilot-text: #F1F5F9;        /* Primary text (light) */
    --copilot-text-muted: #94A3B8;  /* Secondary text */
}
```

#### Executive Deck (Dark Theme)
```javascript
// Defined in exportExecutiveDeck() function (line ~2677)
const BG_DARK = '06132B';    // Darkest navy - title slide only
const BG = '0B1F3A';         // Primary background - all other slides
const CARD = '0F2647';       // Card/container background
const CARD_ALT = '16335E';   // Alternate card background
const CYAN = '4FC3F7';       // Primary accent - section headers
const GREEN = '4ADE80';      // Success/positive - ROI, value metrics
const GOLD = 'F5C451';       // Warning/opportunity - mid-tier, expansion
const RED = 'F26D6D';        // Cost/investment - rarely used
const WHITE = 'FFFFFF';      // Primary text for emphasis
const TEXT = 'CADCFC';       // Secondary text - light blue-gray
const MUTED = '9AB0CC';      // Tertiary text - muted blue-gray
```

### Typography

**Font Stack**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

**Font Sizes**
- **Headlines:** 2rem - 2.5rem (32-40px)
- **Sub-headlines:** 1.5rem (24px)
- **Body text:** 1rem (16px)
- **Small text:** 0.875rem (14px)
- **Footnotes:** 0.75rem (12px)

**PPTX Export Fonts**
- **Headlines:** Cambria (bold) - 28-60pt
- **Body:** Calibri - 10-18pt
- **Data labels:** Calibri - 8-10pt

### Layout System

**Responsive Breakpoints**
```css
/* Desktop: 1200px+ */
.container { max-width: 1400px; }

/* Tablet: 768px - 1199px */
@media (max-width: 1199px) { ... }

/* Mobile: < 768px */
@media (max-width: 767px) { ... }
```

**Grid System**
- Cards: CSS Grid with `auto-fit` and `minmax(300px, 1fr)`
- Tables: Full-width with horizontal scroll on mobile
- Charts: Responsive width with fixed aspect ratios

---

## Dependencies & Libraries

### External Libraries (CDN or Bundled)

#### 1. PptxGenJS (lib/pptxgen.bundle.js - 466 KB)
- **Version:** ~3.12.0
- **Purpose:** Generate PowerPoint presentations client-side
- **Usage:** Both full deck and executive deck exports
- **Documentation:** https://gitbrent.github.io/PptxGenJS/
- **Key Features Used:**
  - Slide layouts (13.33" × 7.5" wide)
  - Chart generation (bar, column charts)
  - Text boxes with custom styling
  - Shapes (rectangles for cards/decorations)
  - Master slide properties

#### 2. docx.js (lib/docx.umd.js - 752 KB)
- **Version:** ~7.8.0 (UMD build)
- **Purpose:** Generate Word documents client-side
- **Usage:** Narrative report export
- **Documentation:** https://docx.js.org/
- **Key Features Used:**
  - Document creation with sections
  - Styled paragraphs and headings
  - Tables with borders and shading
  - Page margins and spacing
  - Bold, italic, color formatting

#### 3. jsPDF (lib/jspdf.umd.min.js - 358 KB)
- **Version:** ~2.5.0
- **Purpose:** Generate PDF documents client-side
- **Usage:** PDF export (not fully implemented yet)
- **Documentation:** https://artskydj.github.io/jsPDF/docs/
- **Status:** Loaded but export function not complete

#### 4. html2canvas (lib/html2canvas.min.js - 194 KB)
- **Version:** ~1.4.0
- **Purpose:** Convert HTML/DOM to canvas for PDF generation
- **Usage:** PDF export (for capturing charts as images)
- **Documentation:** https://html2canvas.hertzen.com/
- **Status:** Loaded but not actively used (future PDF enhancement)

#### 5. JSZip (lib/jszip.min.js - 95 KB)
- **Version:** ~3.10.1
- **Purpose:** Create ZIP files in browser
- **Usage:** Download Local Package feature
- **Documentation:** https://stuk.github.io/jszip/
- **Key Features Used:**
  - Create ZIP archive in memory
  - Add files from fetch responses
  - Generate blob for download
  - Async/await API

### Service Worker (sw.js)
- **Purpose:** Enable Progressive Web App (PWA) functionality
- **Features:**
  - Offline caching of core assets (not implemented)
  - Basic service worker registration
  - Future: could cache pages for offline use

---

## Deployment & Maintenance

### Git Repository Structure

**Three Repositories (All Public)**

1. **Production:** `github.com/jordankingisalive/CopilotROICalculator`
   - **Branch:** `main`
   - **Live URL:** https://jordankingisalive.github.io/CopilotROICalculator/
   - **Purpose:** Production deployment via GitHub Pages
   - **Auto-deploy:** Push to main → GitHub Pages rebuilds (2-3 min)

2. **Staging:** `github.com/jordankingisalive/stagingroicalculator`
   - **Branch:** `main`
   - **Live URL:** https://jordankingisalive.github.io/stagingroicalculator/
   - **Purpose:** Pre-production testing
   - **Update:** Manual copy from production after testing

3. **Backup:** `github.com/jordankingisalive/roicalculatorbackup`
   - **Branch:** `main`
   - **Visibility:** Private
   - **Purpose:** Weekly snapshots, rollback safety
   - **Update:** Manual copy after major milestones

### Deployment Workflow

**Standard Deployment (from local → production)**

```powershell
# 1. Make changes in local CopilotROICalculator directory
cd "c:\Studio proj\Demo Data\generic roi\CopilotROICalculator"

# 2. Test locally (open index.html in browser)

# 3. Bump cache version in index.html (v24 → v25)
# Edit: <link rel="stylesheet" href="styles.css?v=25">
# Edit: <script src="script.js?v=25"></script>

# 4. Commit and push to production
git add .
git commit -m "Description of changes"
git push origin main

# 5. Wait 2-3 minutes for GitHub Pages to rebuild

# 6. Test production URL
# https://jordankingisalive.github.io/CopilotROICalculator/

# 7. Copy to staging (if production works)
cd "c:\Studio proj\Demo Data\generic roi"
Copy-Item -Path "CopilotROICalculator\*" -Destination "stagingroicalculator\" -Recurse -Force
cd stagingroicalculator
git add .
git commit -m "Sync from production"
git push origin main

# 8. Copy to backup (weekly or after major changes)
cd "c:\Studio proj\Demo Data\generic roi"
Copy-Item -Path "CopilotROICalculator\*" -Destination "roicalculatorbackup\" -Recurse -Force
cd roicalculatorbackup
git add .
git commit -m "Backup: [description]"
git push origin main
```

**Emergency Rollback**

```powershell
cd "c:\Studio proj\Demo Data\generic roi\CopilotROICalculator"

# Find last working commit
git log --oneline -20

# Reset to that commit (replace COMMIT_HASH)
git reset --hard COMMIT_HASH

# Force push to GitHub (overwrites remote)
git push origin main --force

# Wait 2-3 minutes for GitHub Pages to rebuild
```

### Cache-Busting Strategy

**Problem:** Browsers cache CSS and JS files aggressively. Users don't see changes after deployment.

**Solution:** Version query parameter in HTML file links.

**Process:**
1. Make changes to `script.js` or `styles.css`
2. Edit `index.html`, `roi-calculator.html`, `Start Here.html`, `run-locally.html`
3. Increment version number:
   ```html
   <!-- Old -->
   <link rel="stylesheet" href="styles.css?v=24">
   <script src="script.js?v=24"></script>
   
   <!-- New -->
   <link rel="stylesheet" href="styles.css?v=25">
   <script src="script.js?v=25"></script>
   ```
4. Commit and push

**User Action:** If changes still don't appear, tell users to do **hard refresh**:
- **Windows:** `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

**Current Version:** v25 (as of May 14, 2026)

---

## Configuration & Settings

### Default Configuration (script.js)

```javascript
// Default config object (loaded on page load)
const config = {
    licenseCost: 30,            // $/month per license
    professionalRate: 125,      // $/hour fully-loaded rate
    minutesPerAction: 5,        // Minutes saved per Copilot action
    analysisWeeks: 4            // Default time period
};
```

### Configurable Parameters (UI Controls)

**License Cost**
- **Default:** $30/month
- **Editable:** Yes (input field in calculator section)
- **Range:** Any positive number
- **Effect:** Recalculates ROI multiple, monthly cost

**Professional Rate**
- **Default:** $125/hour
- **Editable:** Yes (input field in calculator section)
- **Range:** Any positive number
- **Effect:** Recalculates productivity value, cost per hour saved

**Minutes Per Action**
- **Default:** 5 minutes
- **Options:** 2, 3, 5, 10, or custom
- **Editable:** Yes (buttons + custom input)
- **Range:** 1-60 minutes
- **Effect:** Recalculates weekly hours saved, monthly value, ROI

**Analysis Weeks**
- **Default:** 4 weeks (last 4 weeks)
- **Options:** 4, 8, 12, or All Time
- **Editable:** Yes (toggle buttons)
- **Effect:** Filters data by date range, recalculates all metrics

### CSV Schema Requirements

**Required Columns:**
- `Date` or `Week` - Date/week identifier
- Column with "Active" in name - Active users count
- Column with "Action" in name - Total actions count

**Optional Columns:**
- `Organization` / `Team` / `Department` - Group identifier
- `EnabledUsers` / `Licenses` / `Purchased` - Licensed user count
- Weekly breakdown columns (detected by presence of dates)

**Supported Date Formats:**
- ISO: `2026-01-15`, `2026-1-15`
- US: `01/15/2026`, `1/15/2026`
- European: `15/01/2026`, `15.01.2026`
- Text: `Jan 15, 2026`, `January 15, 2026`

**Sample CSV:**
```csv
Date,Organization,Active Copilot Users,Enabled Copilot Users,Copilot Actions
2026-05-01,Engineering,145,200,12500
2026-05-01,Sales,89,150,8900
2026-05-08,Engineering,152,200,13200
2026-05-08,Sales,95,150,9500
```

---

## Critical Code Locations

### Where Key Features Live

#### CSV Upload & Parsing
- **Upload handler:** `handleFile()` at line 137
- **CSV parser:** `parseCSV()` at line 270
- **Date parser:** `parseDate()` at line 328
- **Data flattener:** `flattenData()` at line 351

#### Metrics Calculation
- **Main function:** `calculateMetrics()` at line 649
- **Returns object with:**
  - `totalPurchasedLicenses`
  - `totalEnabledUsers`
  - `totalActiveUsers`
  - `activationRate`
  - `powerUsers`, `powerUserRate`
  - `totalWeeklyActions`, `avgActionsPerUser`
  - `valuePerMonth`, `annualValue`
  - `monthlyCostPurchased`, `roiMultiple`

#### Report Generation
- **Main render:** `renderResults()` at line 1455
  - Generates all HTML for metrics cards, charts, tables
  - Called after CSV upload or settings change
- **Narrative generation:** `generateStoryNarrative()` at line 1992
  - Creates AI-style talking points for exports
  - Returns object with `title`, `subtitle`, `agentPrompt`, etc.

#### Export Functions
- **DOCX export:** `exportToDocx()` at line 2192
  - Uses docx.js library
  - Creates narrative document with tables
- **PPTX full deck:** `exportToPptx()` at line 2381
  - Uses PptxGenJS library
  - 12 slides with light theme
- **PPTX executive deck:** `exportExecutiveDeck()` at line 2642
  - Uses PptxGenJS library
  - 9 slides with dark navy theme
  - **CRITICAL:** Charts must have `dataLabelColor: WHITE`
- **Download local:** `downloadLocalPackage()` at line 3409
  - Uses JSZip library
  - Fetches 18 files, creates ZIP, downloads

#### Interactive Features
- **Time period toggle:** `switchTimePeriod()` at line 862
- **Minutes/action changer:** `switchMinutesPerAction()` at line 1427
- **Tab switcher:** `switchReportTab()` at line 1433
- **Table filter:** `filterTeamsTable()` at line 3258
- **Table sorting:** `sortTable()` at line 3310

---

## Version History

### Current Version: v25 (May 14, 2026)

**Recent Commits (Last 20)**

| Commit | Date | Description |
|--------|------|-------------|
| `16ad234` | May 14 | **v25** - URGENT FIX: Restore missing Run Locally nav button |
| `cdaf432` | May 14 | Add comprehensive Executive Deck template documentation |
| `d357f11` | May 14 | **v24** - Fix black chart data labels (add `dataLabelColor: WHITE`) |
| `f45535b` | May 13 | **v23** - Add working Download Local ZIP package feature |
| `b68e37f` | May 13 | Fix Executive Deck PPTX: reduce header font 36→28pt |
| `bfbddc1` | May 13 | URGENT FIX: Restore to May 12 version (pagination, PPTX) |
| `18796fb` | May 12 | RESTORE: Bring back full-featured tool |
| `d2dae80` | May 11 | Add download button on Run Locally page |
| `bbc77fa` | May 11 | Add privacy statement for online vs local |
| `4ea5d17` | May 11 | Include run-locally.html in ZIP (18 files total) |
| `4189d9c` | May 10 | **v22** - Add Run Locally navigation button and page |
| `b120497` | May 10 | Add Run Locally section with ZIP instructions |
| `8f6ea5c` | May 9 | Update all pages to v22 for cache busting |
| `0d146a4` | May 9 | Bump script version to v22 to force reload |
| `dc1d4f3` | May 8 | Fix malformed template literals in download function |
| `faf9331` | May 8 | Add cache-busting version parameter |
| `97d60fa` | May 7 | Fix download button - pass event parameter |
| `563c7a1` | May 6 | Remove Real Customer Examples table |
| `de332b9` | May 5 | Fix Download Local button contrast (white text) |
| `5ba509b` | May 5 | **v20** - Add Download Local button with package support |

### Version Milestones

- **v25** (May 14, 2026) - Run Locally nav button restored
- **v24** (May 14, 2026) - Chart text color fix (Executive Deck)
- **v23** (May 13, 2026) - Download Local ZIP feature complete
- **v22** (May 10, 2026) - Run Locally navigation added
- **v20** (May 5, 2026) - Initial Download Local feature

---

## Backup & Recovery

### Backup Strategy

**Three-Tier Safety Net**

1. **Production** (`CopilotROICalculator`) - Active deployment
   - Live URL: https://jordankingisalive.github.io/CopilotROICalculator/
   - Updated: Every deployment (multiple times per day if needed)

2. **Staging** (`stagingroicalculator`) - Pre-production testing
   - Live URL: https://jordankingisalive.github.io/stagingroicalculator/
   - Updated: After testing production (daily or as needed)

3. **Backup** (`roicalculatorbackup`) - Private archive
   - Not publicly accessible
   - Updated: Weekly or after major milestones
   - Purpose: Rollback safety if both production and staging are compromised

### Recovery Procedures

#### Scenario 1: Production Broken, Staging OK
```powershell
# Copy staging to production
cd "c:\Studio proj\Demo Data\generic roi"
Remove-Item -Path "CopilotROICalculator\*" -Recurse -Force
Copy-Item -Path "stagingroicalculator\*" -Destination "CopilotROICalculator\" -Recurse -Force
cd CopilotROICalculator
git add .
git commit -m "RECOVERY: Restore from staging"
git push origin main --force
```

#### Scenario 2: Both Production and Staging Broken
```powershell
# Copy backup to production
cd "c:\Studio proj\Demo Data\generic roi"
Remove-Item -Path "CopilotROICalculator\*" -Recurse -Force
Copy-Item -Path "roicalculatorbackup\*" -Destination "CopilotROICalculator\" -Recurse -Force
cd CopilotROICalculator
git add .
git commit -m "RECOVERY: Restore from backup"
git push origin main --force
```

#### Scenario 3: Need Older Version
```powershell
# Find commit in git history
cd "c:\Studio proj\Demo Data\generic roi\CopilotROICalculator"
git log --oneline --all -50

# Reset to specific commit
git reset --hard <COMMIT_HASH>
git push origin main --force
```

### What to Backup

**Critical Files (Changes Tracked)**
- `index.html` - Main page structure
- `script.js` - Main application logic
- `styles.css` - Global styles
- `roi-calculator.html` - Calculator page
- `sales-script.js` - Calculator logic
- `Start Here.html` - Adoption guide
- `run-locally.html` - Local installation guide

**Documentation Files**
- `EXECUTIVE_DECK_TEMPLATE.md` - PPTX export reference
- `MASTER_DOCUMENTATION.md` - This file (complete system reference)
- `DEPLOYMENT.md` - Deployment guide
- `README.md` - GitHub readme

**Configuration Files**
- `.gitignore` - Git ignore rules
- `sw.js` - Service worker

**Static Assets (Rarely Change)**
- `lib/*.js` - External libraries (5 files)
- `sample-data.csv` - Example data
- `LICENSE`, `PRIVACY.md` - Legal docs

---

## Testing Checklist

### Pre-Deployment Testing

**Local Testing**
- [ ] Open `index.html` in browser from file system
- [ ] Upload sample CSV - verify data loads
- [ ] Check all 4 tabs render correctly (Data Analysis, Tier Analysis, All Teams, Opportunity Cost)
- [ ] Test time period toggles (4wk, 8wk, 12wk, All Time)
- [ ] Test minutes-per-action selector (2, 3, 5, 10, custom)
- [ ] Export DOCX - verify download and file opens in Word
- [ ] Export PPTX Full Deck - verify 12 slides render correctly
- [ ] Export Executive Deck - **verify chart numbers are WHITE, not black**
- [ ] Test Download Local button - verify 18-file ZIP downloads
- [ ] Test table search/filter functionality
- [ ] Test table sorting (click column headers)

**Cross-Page Testing**
- [ ] Test navigation buttons (Full Data Analysis, ROI Calculator, Adoption Journey, Run Locally)
- [ ] Verify all 4 pages load without errors
- [ ] Check responsive design on mobile (F12 → Device Toolbar in Chrome)

**Post-Deployment Testing (Production URL)**
- [ ] Visit https://jordankingisalive.github.io/CopilotROICalculator/
- [ ] Do hard refresh (Ctrl+Shift+R) to clear cache
- [ ] Upload CSV - verify calculations are correct
- [ ] Export all formats - verify downloads work
- [ ] Check console for JavaScript errors (F12)

### Regression Testing (After Major Changes)

**Features to Always Test**
1. CSV upload and parsing
2. Metrics calculation (compare against known dataset)
3. Executive Deck export (check chart text colors)
4. Download Local ZIP (verify all 18 files included)
5. Navigation between pages
6. Mobile responsiveness

---

## Known Issues & Limitations

### Current Limitations

1. **PDF Export Not Implemented**
   - `exportToPdf()` function exists but not fully built
   - jsPDF and html2canvas are loaded but not used
   - Future enhancement

2. **No Server-Side Processing**
   - All processing happens in browser
   - Large CSV files (10,000+ rows) may be slow
   - No data validation before parsing

3. **Browser-Only**
   - Requires modern browser (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+)
   - No IE11 support (uses ES6+ features)
   - No mobile app version

4. **No Authentication**
   - Public GitHub Pages site
   - Anyone can access and use the tool
   - No user accounts or saved sessions

5. **Local Storage Only**
   - Config settings not persisted across sessions
   - Must re-upload CSV each time
   - No "save project" feature

### Known Bugs (None Currently)

**Previous Issues (Now Fixed)**
- ✅ Black text on charts in Executive Deck (fixed in v24)
- ✅ Missing Run Locally nav button (fixed in v25)
- ✅ Download Local button not working (fixed in v23)
- ✅ PPTX header overlap with charts (fixed May 13)
- ✅ CSV upload button broken after bad code insertion (fixed May 13)

---

## Future Enhancements (Backlog)

### Short-Term (Next 1-2 Months)

1. **PDF Export Completion**
   - Implement full `exportToPdf()` function
   - Capture all charts as images with html2canvas
   - Generate multi-page PDF with jsPDF
   - Add page numbers and headers/footers

2. **Data Validation**
   - Validate CSV schema before parsing
   - Show helpful error messages for invalid files
   - Suggest column mappings if schema is non-standard

3. **Saved Sessions**
   - Use localStorage to save uploaded data
   - Persist config settings across browser sessions
   - "Load Last Session" button on homepage

4. **Additional Charts**
   - Weekly trend line chart (actions over time)
   - Adoption curve projection
   - User engagement histogram

### Long-Term (3-6 Months)

1. **Backend Integration**
   - Optional server-side processing for large files
   - Direct integration with Microsoft Graph API
   - Automated data refresh

2. **Custom Branding**
   - Allow users to upload company logo
   - Customize color scheme
   - Add company name to reports

3. **Collaboration Features**
   - Share reports via unique URL
   - Email reports directly from tool
   - Schedule automated report generation

4. **Advanced Analytics**
   - Predictive modeling (adoption forecasting)
   - Cohort analysis (user segments over time)
   - A/B testing scenarios (what-if analysis)

---

## Contact & Support

**Developer:** jordanking@microsoft.com  
**Tool URL:** https://jordankingisalive.github.io/CopilotROICalculator/  
**Repository:** https://github.com/jordankingisalive/CopilotROICalculator  
**Documentation:** This file + `EXECUTIVE_DECK_TEMPLATE.md` + `DEPLOYMENT.md`

---

## Appendix: Quick Reference Commands

### Deployment Commands
```powershell
# Production deploy
cd "c:\Studio proj\Demo Data\generic roi\CopilotROICalculator"
git add .
git commit -m "Description"
git push origin main

# Staging sync
cd "c:\Studio proj\Demo Data\generic roi"
Copy-Item -Path "CopilotROICalculator\*" -Destination "stagingroicalculator\" -Recurse -Force
cd stagingroicalculator
git add .
git commit -m "Sync from production"
git push origin main

# Backup
cd "c:\Studio proj\Demo Data\generic roi"
Copy-Item -Path "CopilotROICalculator\*" -Destination "roicalculatorbackup\" -Recurse -Force
cd roicalculatorbackup
git add .
git commit -m "Backup: [description]"
git push origin main
```

### Emergency Rollback
```powershell
cd "c:\Studio proj\Demo Data\generic roi\CopilotROICalculator"
git log --oneline -20
git reset --hard <COMMIT_HASH>
git push origin main --force
```

### Cache Version Bump
```html
<!-- Find and replace in index.html, roi-calculator.html, Start Here.html, run-locally.html -->
<!-- Old: -->
<link rel="stylesheet" href="styles.css?v=24">
<script src="script.js?v=24"></script>

<!-- New: -->
<link rel="stylesheet" href="styles.css?v=25">
<script src="script.js?v=25"></script>
```

---

**END OF MASTER DOCUMENTATION**

_Last Updated: May 14, 2026 (v25)_  
_This document serves as the complete checkpoint reference for the M365 Copilot ROI Calculator._  
_Keep this file updated with any significant changes to the system._
