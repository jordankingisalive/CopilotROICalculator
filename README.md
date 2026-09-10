# M365 Copilot Productivity ROI Calculator

A web-based tool for analyzing Microsoft 365 Copilot usage data and calculating productivity ROI projections. All data processing happens locally in your browser—your CSV file and its contents are never uploaded.

**Live site:** https://jordankingisalive.github.io/CopilotROICalculator/

---

## What It Does

This calculator suite helps you understand the productivity impact and ROI of M365 Copilot deployments. It includes three tools:

1. **Full Data Analysis** - Upload CSV exports from Power BI, view team performance breakdowns, and calculate organization-wide ROI
2. **ROI Calculator** - Project potential value with scenario modeling and industry-specific benchmarks
3. **Adoption Journey** - Month-by-month productivity projections with phase-based roadmaps

The tool handles both long-format (with dates) and wide-format CSV exports, automatically aggregates duplicate records, and provides sortable tables with peak performance tracking.

---

## Privacy

All CSV parsing and calculations happen in your browser using JavaScript. Your CSV file is never uploaded. When you close the tab, everything is cleared from memory.

- No server-side processing
- No CSV data storage
- The hosted site loads Microsoft Clarity for product analytics (session replay, cookies); the downloaded local version makes zero external requests. See [PRIVACY.md](PRIVACY.md).
- All libraries bundled locally — no CDN requests. On the hosted site the only external request is Microsoft Clarity; the local version makes zero external requests.

This makes it safe for analyzing sensitive enterprise data. See [PRIVACY.md](PRIVACY.md) for technical details.

---

## How to Use

### 1. Export Your Data

The calculator accepts one format: a **Viva Insights person query** export.

1. Go to https://analysis.insights.cloud.microsoft and open **Analysis results**
2. Click **Create analysis** → **Person query** → **Set up analysis**
3. Time period: Last 6 months (rolling) · Group by: **Week** · Filter: Is Active = True
4. Attributes: Organization, FunctionType, TimeZone
5. Metrics: **Microsoft 365 Copilot — all metrics**
6. Run the query, then download the result as **CSV** from **Analysis results**

`Group by Week` is required — cohort tiers need at least 12 consecutive weekly rows per person.

### 2. Configure Settings

Set your parameters:
- Industry (or custom hourly rate)
- License cost per user/month
- Minutes saved per Copilot action (1-15 min)
- Analysis period in weeks
- Optional: Intelligent Recap actions per month

### 3. Upload and Analyze

Drop your CSV file into the upload area, review the analysis, and export to PDF or email if needed.

---

## Running Locally

No build process or server required. Just open `index.html` in any modern browser:

```bash
git clone https://github.com/jordankingisalive/CopilotROICalculator.git
cd CopilotROICalculator
start index.html  # or open index.html on macOS
```

Works in Chrome, Edge, Firefox, and Safari (recent versions).

---

## File Structure

```
├── index.html              Main data analysis page
├── roi-calculator.html     ROI projection calculator
├── Start Here.html         Adoption journey timeline
├── styles.css              Styling
├── script.js               Data processing
├── sample-data.csv         Test data
├── README.md               This file
├── PRIVACY.md              Privacy documentation
├── DEPLOYMENT.md           GitHub Pages setup guide
└── LICENSE                 MIT License
```

---

## Technical Details

Built with vanilla HTML, CSS, and JavaScript—no frameworks. Uses the FileReader API for client-side file processing and html2pdf.js (bundled locally) for PDF generation.

### CSV Format Support

One supported format: the **Viva Insights person query** export — one row per person per week.

```csv
PersonId,MetricDate,Total Copilot actions taken,Total Copilot active days,Total Copilot enabled days,Copilot assisted hours,Organization,...
P1,2025-01-06 00:00:00,25,5,5,3.5,Contoso Ltd,...
P1,2025-01-13 00:00:00,25,5,5,3.5,Contoso Ltd,...
```

`PersonId`, `MetricDate` and `Total Copilot actions taken` are required. Organization,
FunctionType, Region, active/enabled days, assisted hours and per-app action columns are
used when present. British and Spanish column headers are translated automatically.

Any other CSV (including the retired Super Usage Report heatmap export) is rejected with
on-screen guidance rather than parsed.

### ROI Calculation

```
Monthly ROI = (Total Actions × Minutes per Action × Hourly Rate) / 60
Annual ROI = Monthly ROI × 12
Net ROI = Annual ROI - (License Cost × 12 × Enabled Users)
```

---

## Deploying Your Own

If you want to deploy this to your own GitHub Pages:

```bash
# Initialize and commit
git init
git add .
git commit -m "Initial commit"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main

# Enable GitHub Pages in Settings → Pages
# Set source to: main branch, / (root)
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions including custom domains.

---

## Making Updates

After editing files:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically redeploy in 1-2 minutes.

---

## Support

Questions or issues? Contact [jordanking@microsoft.com](mailto:jordanking@microsoft.com)

Bug reports: Open an issue with browser version, steps to reproduce, and screenshots if applicable.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2025 Jordan King

---

## Acknowledgments

- Built for M365 Copilot customers
- Data source: [Viva Insights person query](https://analysis.insights.cloud.microsoft) · related report: [Super User Adoption](https://aka.ms/decodingsuperusage)
- PDF generation: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
