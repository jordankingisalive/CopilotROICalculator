# M365 Copilot Productivity ROI Calculator

A web-based tool for analyzing Microsoft 365 Copilot usage data and calculating productivity ROI projections. All data processing happens locally in your browser—nothing is sent to any server.

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

All CSV parsing and calculations happen in your browser using JavaScript. No data is uploaded anywhere. When you close the tab, everything is cleared from memory.

- No server-side processing
- No data storage or cookies
- No tracking or analytics
- No external API calls (except loading the PDF library from CDN)

This makes it safe for analyzing sensitive enterprise data. See [PRIVACY.md](PRIVACY.md) for technical details.

---

## How to Use

### 1. Export Your Data

Open your Copilot-Insight Power BI report (from https://aka.ms/decodingsuperusage) and export the usage heatmap:

1. Ctrl+Left Click ALL options on the left side of the heatmap
2. Click the heatmap visualization
3. Click the three dots → Export → Save
4. Save as `data.csv`

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

Built with vanilla HTML, CSS, and JavaScript—no frameworks. Uses the FileReader API for client-side file processing and html2pdf.js (via CDN) for PDF generation.

### CSV Format Support

**Long format** (with dates):
```csv
Date,Team/Division Name,Active Users,Enabled Users,Total Actions,...
2025-08-10,Team A,45,50,2340,...
2025-08-17,Team A,47,50,2567,...
```

The tool groups by organization, sorts by date, and uses the most recent record.

**Wide format** (aggregated):
```csv
Team/Division Name,Active Users,Enabled Users,Total Actions,...
Team A,45,50,25340,...
Team B,32,40,18920,...
```

Processed directly without aggregation.

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
- Data source: [Copilot-Insight Power BI Report](https://aka.ms/decodingsuperusage)
- PDF generation: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
