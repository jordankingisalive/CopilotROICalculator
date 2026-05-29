<div align="center">

<br>

# 📊 M365 Copilot ROI Calculator

### Upload one CSV. See the productivity value, adoption tiers, and ROI of your Microsoft 365 Copilot rollout — all in your browser.

<br>

[![Built by Microsoft](https://img.shields.io/badge/Built%20by-Microsoft-0078d4?style=for-the-badge&logo=microsoft&logoColor=white)](https://microsoft.github.io/Analytics-Hub/team/)
[![Analytics Hub](https://img.shields.io/badge/Analytics%20Hub-11%20Repositories-8661c5?style=for-the-badge&logo=github&logoColor=white)](https://microsoft.github.io/Analytics-Hub/)

<br>

**🚀 [All Analytics Hub Reports](https://microsoft.github.io/Analytics-Hub/)**

<br>

### ✨ [Try the Live Calculator](https://jordankingisalive.github.io/CopilotROICalculator/)

<br>

**Found this useful? ⭐ Star this repo to help others discover it!**

<br>

**[What's New ↓](#whats-new)** &nbsp;·&nbsp; **[Live Demo ↓](#live-demo)** &nbsp;·&nbsp; **[Features ↓](#features)** &nbsp;·&nbsp; **[How to Use ↓](#how-to-use)** &nbsp;·&nbsp; **[Email Your Team ↓](#email-your-team)**

<br>

</div>

---

<a id="whats-new"></a>

<details open>
<summary><strong>✨ What's New</strong></summary>

<br>

- **Instant demo page** — `demo.html` loads with pre-inlined sample data so anyone can see a full report in one click, zero CSV required
- **Executive deck export** — generate a 9-slide PPTX summary (or full 12-slide deck) directly from your data
- **Word + PDF narrative reports** — branded DOCX and PDF exports with all charts and key findings baked in
- **Offline local package** — download a self-contained ZIP with all libraries bundled; no internet required after first load
- **Tier analysis tab** — usage broken into Top 10% / 75–90% / 50–75% / 25–50% / Bottom 25% with per-tier ROI
- **Opportunity cost view** — see the projected value of activating the users still without a license
- **Long & wide CSV support** — paste the Power BI heatmap export directly; the parser auto-detects the format

</details>

---

<a id="live-demo"></a>

<details open>
<summary><strong>▶️ Live Demo</strong></summary>

<br>

| | |
|---|---|
| **Hosted version** | 👉 [jordankingisalive.github.io/CopilotROICalculator](https://jordankingisalive.github.io/CopilotROICalculator/) |
| **Instant sample report** | 👉 [demo.html](https://jordankingisalive.github.io/CopilotROICalculator/demo.html) — full report on one click, sample data pre-loaded |
| **Quick ROI calculator** | 👉 [roi-calculator.html](https://jordankingisalive.github.io/CopilotROICalculator/roi-calculator.html) — no CSV needed |
| **Adoption journey planner** | 👉 [Start Here.html](https://jordankingisalive.github.io/CopilotROICalculator/Start%20Here.html) |

Everything runs **100% client-side**. Your data never leaves your browser.

</details>

---

<a id="features"></a>

<details open>
<summary><strong>🧰 Features — Three Tools in One</strong></summary>

<br>

### 1. Full Data Analysis (`index.html`)
Upload a CSV export from the [Decoding Super Usage](https://aka.ms/decodingsuperusage) Power BI report and get a complete executive dashboard:

- **8 headline metrics** — purchased licenses, active users, activation rate, power users, weekly actions, avg actions/user, monthly value, ROI multiple
- **Time-period comparison** — current vs. prior 4 weeks
- **Usage tier distribution** — Top 10% through Bottom 25% with per-tier ROI
- **Weekly trend & heatmap charts** — teams × weeks visualization
- **Top performers table** — sortable, searchable, paginated
- **Opportunity cost projections** — value left on the table from unlicensed users
- **Slicer controls** — filter by time period, minutes-per-action, and more

### 2. Quick ROI Calculator (`roi-calculator.html`)
Project value without uploading any data. Set licenses, weekly actions per user, minutes saved per action, hourly rate, and license cost — watch monthly value, annual value, ROI multiple, break-even, and cost-per-hour-saved update in real time.

### 3. Adoption Journey (`Start Here.html`)
A phase-based rollout guide:

- Pre-Launch Checklist
- Weeks 1–2: Initial Rollout
- Weeks 3–4: Early Momentum
- Weeks 5–8: Expanding Adoption
- Weeks 9–12: Measuring Success
- Ongoing: Power User Program, champion identification, training recommendations

### Export Anything
Every report can be exported as:

| Format | What you get |
|---|---|
| **PDF** | Full multi-page report with all charts |
| **DOCX** | Narrative Word document — paste-ready for emails or briefs |
| **PPTX (Executive)** | 9-slide condensed deck for execs |
| **PPTX (Full)** | 12-slide detailed deck with all visualizations |
| **Local ZIP** | Complete offline package — all libraries bundled |

</details>

---

<a id="how-to-use"></a>

<details open>
<summary><strong>📋 How to Use</strong></summary>

<br>

### Step 1 — Export your Copilot usage data

Open your **Copilot-Insight Power BI report** (template at <https://aka.ms/decodingsuperusage>) and export the usage heatmap:

1. `Ctrl` + Left-Click every option on the left side of the heatmap
2. Click the heatmap visualization
3. Click the **three dots** → **Export** → **Save**
4. Save as `data.csv`

### Step 2 — Configure your settings

Set the parameters that match your organization:

| Setting | Default | Notes |
|---|---|---|
| Industry / hourly rate | $125/hr | Pick an industry preset or set a custom rate |
| License cost per user/month | $30 | Adjust for your contract |
| Minutes saved per Copilot action | 5 min | Slider supports 1–15 min (configurable) |
| Analysis period | 12 weeks | Toggle 4 / 8 / 12 / All Time |
| Intelligent Recap actions/month | optional | Add separately if measured |

### Step 3 — Upload and analyze

1. Drag your CSV onto the upload zone (or click **Try the Sample Data** to see a full report instantly)
2. Review your dashboard — switch tabs for **Data Analysis**, **Tier Analysis**, **All Teams**, and **Opportunity Cost**
3. Click **Export** to generate a PDF, DOCX, PPTX, or executive deck
4. Use **Email Report** to drop a pre-filled summary into your default mail client

### Step 4 — (Optional) Run it locally

```bash
git clone https://github.com/jordankingisalive/CopilotROICalculator.git
cd CopilotROICalculator
# Windows:
RUN_LOCAL_SERVER.bat
# macOS / Linux:
bash RUN_LOCAL_SERVER.sh
```

Or download the **offline ZIP** from the running app's **Run Locally** page — every library is bundled and no internet connection is needed after extraction.

</details>

---

<details>
<summary><strong>🔬 Technical Details</strong></summary>

<br>

### Stack
Pure vanilla **HTML / CSS / JavaScript** — no build step, no framework, no backend. Files render natively in Chrome, Edge, Firefox, and Safari (recent versions).

### Client-side libraries (bundled in `lib/`)
| Library | Purpose |
|---|---|
| `pptxgen.bundle.js` | PowerPoint generation |
| `docx.umd.js` | Word document generation |
| `jspdf.umd.min.js` | PDF generation |
| `html2canvas.min.js` | Chart-to-image rendering |
| `jszip.min.js` | ZIP packaging for offline downloads |

### CSV format support

**Long format** (with dates) — most recent record per organization is used:
```csv
Date,Team/Division Name,Active Users,Enabled Users,Total Actions,...
2025-08-10,Team A,45,50,2340,...
2025-08-17,Team A,47,50,2567,...
```

**Wide format** (already aggregated) — processed directly:
```csv
Team/Division Name,Active Users,Enabled Users,Total Actions,...
Team A,45,50,25340,...
Team B,32,40,18920,...
```

### Core ROI formula

```text
Monthly Value  = (Total Actions × Minutes per Action × Hourly Rate) / 60
Annual Value   = Monthly Value × 12
Monthly Cost   = Enabled Users × License Cost
Annual Cost    = Monthly Cost × 12
Net Annual ROI = Annual Value − Annual Cost
ROI Multiple   = Annual Value / Annual Cost
```

### File structure

```
CopilotROICalculator/
├── index.html              Main data analysis dashboard
├── demo.html               Instant sample report (no CSV needed)
├── roi-calculator.html     Quick ROI projection calculator
├── Start Here.html         Adoption journey timeline
├── run-locally.html        Offline installation guide
├── analytics.html          Tier & opportunity-cost deep dive
├── changelog.html          Version history
├── script.js               Main application logic
├── sales-script.js         Quick-calculator logic
├── styles.css              Global styles
├── sw.js                   Service worker (PWA / offline)
├── sample-data.csv         Test data
├── demo-data.csv           Inlined demo dataset
├── lib/                    Bundled libraries (5 files)
├── README.md               This file
├── README_LOCAL.md         Offline usage guide
├── PRIVACY.md              Privacy policy
├── DEPLOYMENT.md           GitHub Pages setup
├── EXECUTIVE_DECK_TEMPLATE.md  PPTX export reference
└── LICENSE                 MIT
```

</details>

---

<details>
<summary><strong>🔒 Privacy</strong></summary>

<br>

All CSV parsing, math, chart rendering, and document export happens **inside your browser**. Nothing is uploaded.

- ❌ No server-side processing
- ❌ No data storage, no cookies, no tracking
- ❌ No external API calls *(except the PDF library CDN, which can be eliminated by using the offline local version)*
- ✅ Close the tab — everything is gone

This makes it safe for sensitive enterprise data. Full details: [PRIVACY.md](PRIVACY.md).

</details>

---

<a id="email-your-team"></a>

> 📧 **Share the ROI Calculator with your team in one click.**
> This pre-written email introduces the calculator, the data source it uses, and what the recipient will be able to do with it — perfect for forwarding to finance, IT, or your Copilot enablement lead.
>
> **[📨 Email the ROI Calculator to Your Team](mailto:?subject=M365%20Copilot%20ROI%20Calculator%20%E2%80%93%20see%20the%20productivity%20value%20of%20our%20Copilot%20rollout&body=Hi%2C%0A%0AI%20wanted%20to%20share%20the%20M365%20Copilot%20ROI%20Calculator%20%E2%80%94%20a%20free%2C%20browser-based%20tool%20from%20Microsoft%27s%20Analytics%20Hub%20that%20turns%20our%20Copilot%20usage%20data%20into%20an%20executive-ready%20ROI%20report.%0A%0AWHAT%20IT%20DOES%0A%0A-%20Calculates%20productivity%20value%2C%20annual%20ROI%2C%20and%20ROI%20multiple%20from%20our%20Copilot%20usage%20data%0A-%20Breaks%20adoption%20into%20usage%20tiers%20%28Top%2010%25%2C%2075-90%25%2C%2050-75%25%2C%2025-50%25%2C%20Bottom%2025%25%29%0A-%20Shows%20opportunity%20cost%20of%20unlicensed%20users%0A-%20Exports%20to%20PDF%2C%20Word%20%28DOCX%29%2C%20and%20PowerPoint%20%28executive%20%2B%20full%20decks%29%0A-%20Runs%20100%25%20in%20the%20browser%20%E2%80%94%20no%20data%20leaves%20your%20device%0A%0ATRY%20IT%20NOW%20%28no%20setup%2C%20no%20CSV%20required%29%0A%0AInstant%20sample%20report%3A%20https%3A%2F%2Fjordankingisalive.github.io%2FCopilotROICalculator%2Fdemo.html%0AMain%20app%3A%20https%3A%2F%2Fjordankingisalive.github.io%2FCopilotROICalculator%2F%0AQuick%20calculator%20%28no%20data%20needed%29%3A%20https%3A%2F%2Fjordankingisalive.github.io%2FCopilotROICalculator%2Froi-calculator.html%0AAdoption%20journey%20planner%3A%20https%3A%2F%2Fjordankingisalive.github.io%2FCopilotROICalculator%2FStart%2520Here.html%0A%0ADATA%20SOURCE%0A%0AThe%20full%20analysis%20tool%20takes%20a%20CSV%20export%20from%20the%20Decoding%20Super%20Usage%20Power%20BI%20report%20%28aka.ms%2Fdecodingsuperusage%29.%20If%20you%20don%27t%20have%20that%20yet%2C%20the%20Quick%20Calculator%20and%20Adoption%20Journey%20pages%20work%20with%20no%20data%20at%20all.%0A%0APRIVACY%0A%0AAll%20CSV%20parsing%2C%20calculations%2C%20and%20document%20generation%20happen%20inside%20your%20browser.%20No%20server%2C%20no%20uploads%2C%20no%20tracking.%20There%27s%20also%20an%20offline%20version%20you%20can%20download%20and%20run%20with%20zero%20internet%20connection.%0A%0AWho%20else%20should%20see%20this%3F%20Let%20me%20know%20and%20I%27ll%20add%20them.%0A%0AThanks%2C)**

---

<details>
<summary><strong>💬 Feedback</strong></summary>

<br>

Questions, bugs, or feature requests? Reach out to [jordanking@microsoft.com](mailto:jordanking@microsoft.com) or open an issue with browser version, repro steps, and a screenshot if applicable.

</details>

---

<details>
<summary><strong>🔔 Stay Updated</strong></summary>

<br>

- ⭐ **Star this repository** to receive notifications about new versions
- 👀 **Watch** for updates and announcements
- 🔄 Check the in-app [changelog](https://jordankingisalive.github.io/CopilotROICalculator/changelog.html) for the latest fixes and features

</details>

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Built for M365 Copilot customers
- Data source: [Decoding Super Usage Power BI report](https://aka.ms/decodingsuperusage)
- Part of the [Analytics Hub](https://microsoft.github.io/Analytics-Hub/) family of Copilot adoption tools

---

<div align="center">

**Found this useful? ⭐ Star this repo to help others discover it!**

That's it! 🚀

</div>
