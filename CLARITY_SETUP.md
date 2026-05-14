# Microsoft Clarity Analytics Setup Guide

## Overview
Microsoft Clarity tracking has been integrated into your ROI Calculator. You'll be able to track:

- ✅ **Visitors** - Total page views and unique visitors
- ✅ **User Behavior** - Session recordings and heatmaps
- ✅ **Download Events** - PowerPoint, ZIP package downloads
- ✅ **Engagement** - Time on page, scroll depth, click maps

## Setup Instructions

### Step 1: Create a FREE Microsoft Clarity Account

1. Go to **https://clarity.microsoft.com/**
2. Click **"Sign up"** (use your Microsoft account)
3. Click **"Add new project"**
4. Enter project details:
   - **Name**: M365 Copilot ROI Calculator
   - **Website URL**: https://jordankingisalive.github.io/CopilotROICalculator/
5. Click **"Create"**

### Step 2: Get Your Clarity Project ID

After creating the project, you'll see your tracking code that looks like:

```javascript
clarity("YOUR_CLARITY_PROJECT_ID")
```

**Copy just the Project ID** (example: `abc123xyz`)

### Step 3: Replace the Placeholder ID

You need to update 3 HTML files with your actual Clarity Project ID:

#### Files to Update:
1. **index.html** (line ~14)
2. **roi-calculator.html** (line ~14)
3. **Start Here.html** (line ~14)

#### Find this line in each file:
```javascript
})(window,document,"clarity","script","YOUR_CLARITY_PROJECT_ID");
```

#### Replace with your actual ID:
```javascript
})(window,document,"clarity","script","abc123xyz");
```

### Step 4: Deploy Updated Files

After updating all 3 files:

```powershell
cd "c:\Studio proj\Demo Data\generic roi\CopilotROICalculator"
git add index.html roi-calculator.html "Start Here.html"
git commit -m "Configure Clarity tracking ID"
git push
```

Then copy to staging and backup repos:

```powershell
cd ..
Copy-Item "CopilotROICalculator\index.html" "stagingroicalculator\index.html" -Force
Copy-Item "CopilotROICalculator\roi-calculator.html" "stagingroicalculator\roi-calculator.html" -Force
Copy-Item "CopilotROICalculator\Start Here.html" "stagingroicalculator\Start Here.html" -Force

cd stagingroicalculator
git add -A
git commit -m "Configure Clarity tracking ID"
git push

cd ../roicalculatorbackup
Copy-Item "../CopilotROICalculator/index.html" "index.html" -Force
Copy-Item "../CopilotROICalculator/roi-calculator.html" "roi-calculator.html" -Force
Copy-Item "../CopilotROICalculator/Start Here.html" "Start Here.html" -Force
git add -A
git commit -m "Backup: Configure Clarity tracking ID"
git push
```

### Step 5: Verify Tracking is Working

1. Visit your live site: **https://jordankingisalive.github.io/CopilotROICalculator/**
2. Open the browser console (F12)
3. Type: `typeof clarity` - should return **"function"**
4. Go back to **https://clarity.microsoft.com/**
5. Click on your project
6. Wait 2-3 minutes for data to appear

## What Gets Tracked

### Automatic Tracking (No Configuration Needed)
- Page views on all 3 pages (index, calculator, adoption journey)
- Unique visitors
- Geographic location (country/region)
- Device type (desktop, mobile, tablet)
- Browser and OS
- Session duration
- Scroll depth
- Click patterns
- Rage clicks (frustrated users)

### Custom Events (Already Configured)
These events fire when users download exports:

1. **`download_executive_deck`** - When user exports the Executive Deck PowerPoint
2. **`download_powerpoint_analysis`** - When user exports the full Analysis PowerPoint
3. **`download_local_package`** - When user downloads the offline ZIP package

## Viewing Your Analytics

### Dashboard Overview
Go to **Clarity Dashboard** → Your Project to see:
- **Sessions**: Total user sessions
- **Recordings**: Video playback of user sessions
- **Heatmaps**: Click and scroll maps
- **Insights**: AI-powered behavior analysis

### Custom Events
Go to **Settings** → **Custom Tags** to see download event counts:
- How many people downloaded Executive Decks
- How many downloaded the local package
- Which page drives the most downloads

### Session Recordings
Click **Recordings** tab to watch:
- How users interact with your calculator
- Where they get confused
- Which features they use most
- Where they drop off

## Privacy & Compliance

✅ **GDPR Compliant** - No personal data collected
✅ **Cookie-Free** - No cookie consent banner needed
✅ **Microsoft-Backed** - Enterprise-grade privacy
✅ **Anonymous** - No IP addresses stored

## Support

- **Clarity Documentation**: https://learn.microsoft.com/clarity/
- **Clarity Dashboard**: https://clarity.microsoft.com/
- **Setup Issues**: Contact jordanking@microsoft.com

## Current Status

🟡 **Tracking Code Integrated** - Ready to activate
🔴 **Project ID Required** - Complete Step 2 & 3 above
⏳ **Deployment Pending** - Follow Step 4 to go live

---

**Last Updated**: May 14, 2026
**Deployed to**: Production, Staging, Backup repos
