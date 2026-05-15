# Changelog Update Guide

## How to Add a New Version

When you push a new version to production, follow these steps:

### 1. Update changelog.html

Add a new version entry at the **top** of the changelog (after the header, before v28).

#### Template for New Version:

```html
<!-- Version XX -->
<div class="version-entry latest">
    <div class="version-header">
        <span class="version-number">vXX</span>
        <span class="version-badge latest">Latest</span>
        <span class="version-date">Month Day, 2026</span>
    </div>
    
    <!-- Add one or more of the following categories as needed -->
    
    <div class="change-category">
        <div class="category-title new">✨ New Features</div>
        <ul class="change-list">
            <li>Description of new feature 1</li>
            <li>Description of new feature 2</li>
        </ul>
    </div>
    
    <div class="change-category">
        <div class="category-title improved">🔧 Improvements</div>
        <ul class="change-list">
            <li>Description of improvement 1</li>
            <li>Description of improvement 2</li>
        </ul>
    </div>
    
    <div class="change-category">
        <div class="category-title fixed">🐛 Bug Fixes</div>
        <ul class="change-list">
            <li>Description of bug fix 1</li>
            <li>Description of bug fix 2</li>
        </ul>
    </div>
</div>
```

#### Important:
- Remove the `latest` class and badge from the **previous** version entry
- Keep the version entries in reverse chronological order (newest first)

### 2. Bump Cache Version

Update the cache version in `index.html`:

```html
<link rel="stylesheet" href="styles.css?v=XX">
<script src="script.js?v=XX"></script>
```

Replace `XX` with your new version number.

### 3. Deploy to All Repos

```powershell
# Production
cd "c:\Studio proj\Demo Data\generic roi\CopilotROICalculator"
git add changelog.html index.html
git commit -m "Update changelog for vXX"
git push

# Staging
cd ..
Copy-Item "CopilotROICalculator\changelog.html" "stagingroicalculator\changelog.html" -Force
Copy-Item "CopilotROICalculator\index.html" "stagingroicalculator\index.html" -Force
cd stagingroicalculator
git add changelog.html index.html
git commit -m "Update changelog for vXX"
git push

# Backup
cd ..
Copy-Item "CopilotROICalculator\changelog.html" "roicalculatorbackup\changelog.html" -Force
Copy-Item "CopilotROICalculator\index.html" "roicalculatorbackup\index.html" -Force
cd roicalculatorbackup
git add changelog.html index.html
git commit -m "Backup: Update changelog for vXX"
git push
```

## Categories & Badges

### Change Categories:
- **✨ New Features** (`category-title new`) - Brand new functionality
- **🔧 Improvements** (`category-title improved`) - Enhancements to existing features
- **🐛 Bug Fixes** (`category-title fixed`) - Corrections to broken functionality

### Version Badges:
- **Latest** (`version-badge latest`) - Current production version (cyan)
- **Major Update** (`version-badge major`) - Significant feature releases (green)
- No badge - Minor updates and patches

## Writing Good Changelog Entries

### ✅ Good Examples:
- "Added Microsoft Clarity analytics with download event tracking"
- "Fixed invisible badge text on Adoption Journey phase cards"
- "Removed hypothetical pricing scenarios from Executive Deck export"

### ❌ Bad Examples:
- "Updated stuff" (too vague)
- "Fixed bug in script.js line 2634" (too technical)
- "Changed colors" (not specific enough)

## Quick Reference

Current version: **v29**
Last updated: May 15, 2026
Next version: v30

## Example Full Update

```html
<!-- Version 30 -->
<div class="version-entry latest">
    <div class="version-header">
        <span class="version-number">v30</span>
        <span class="version-badge latest">Latest</span>
        <span class="version-date">May 16, 2026</span>
    </div>
    
    <div class="change-category">
        <div class="category-title new">✨ New Features</div>
        <ul class="change-list">
            <li>Added user feedback form for feature requests</li>
        </ul>
    </div>
    
    <div class="change-category">
        <div class="category-title improved">🔧 Improvements</div>
        <ul class="change-list">
            <li>Enhanced mobile responsiveness on calculator page</li>
            <li>Optimized PowerPoint export file size</li>
        </ul>
    </div>
</div>

<!-- Version 29 - REMOVE 'latest' class and badge -->
<div class="version-entry">
    <div class="version-header">
        <span class="version-number">v29</span>
        <span class="version-date">May 15, 2026</span>
    </div>
    ...
</div>
```

---

**Remember**: Keep entries user-focused and describe the benefit, not the technical implementation!
