# GitHub Pages Deployment Guide

Complete step-by-step instructions for deploying the M365 Copilot ROI Calculator to GitHub Pages.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ GitHub account ([sign up here](https://github.com/join))
- ✅ Git installed on your computer
  - **Windows:** Download from [git-scm.com](https://git-scm.com/download/win)
  - **macOS:** Install via Homebrew: `brew install git` or download from git-scm.com
  - **Linux:** `sudo apt install git` (Debian/Ubuntu) or `sudo yum install git` (RHEL/CentOS)
- ✅ Command line / terminal access
- ✅ Files from this repository

### Verify Git Installation

```bash
git --version
# Should output: git version 2.x.x
```

---

## Part 1: Initial Setup (One-Time)

### Step 1: Configure Git (if first time)

```bash
# Set your name (will appear in commits)
git config --global user.name "Your Name"

# Set your email (should match GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Step 2: Navigate to Project Folder

```bash
# Windows (replace with your actual path)
cd "C:\path\to\m365-copilot-roi-calculator"

# macOS/Linux
cd ~/path/to/m365-copilot-roi-calculator
```

### Step 3: Initialize Git Repository

```bash
# Initialize git in this folder
git init

# Verify .git folder was created
ls -la  # macOS/Linux
dir /a  # Windows
```

### Step 4: Add Files to Git

```bash
# Add all files to staging area
git add .

# Verify files are staged
git status
# Should show files in green under "Changes to be committed"
```

### Step 5: Create Initial Commit

```bash
# Commit with a message
git commit -m "Initial commit: M365 Copilot ROI Calculator"

# Verify commit was created
git log
```

---

## Part 2: Create GitHub Repository

### Method A: Via GitHub Website (Recommended for Beginners)

1. **Go to GitHub:** https://github.com/new

2. **Repository Settings:**
   - **Owner:** Select your username/organization
   - **Repository name:** `m365-copilot-roi-calculator`
   - **Description:** "Privacy-first M365 Copilot productivity ROI calculator"
   - **Visibility:**
     - Choose **Public** (required for free GitHub Pages)
     - Or **Private** (requires GitHub Pro/Team for Pages)
   - **Initialize repository:**
     - ❌ **Do NOT check** "Add a README file"
     - ❌ **Do NOT select** .gitignore template
     - ❌ **Do NOT select** license
     - (We already have these files locally)

3. **Click:** "Create repository"

4. **Copy the repository URL** shown on the next screen:
   ```
   https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator.git
   ```

### Method B: Via GitHub CLI (Advanced)

```bash
# Install GitHub CLI first: https://cli.github.com/

# Authenticate
gh auth login

# Create repository
gh repo create m365-copilot-roi-calculator --public --description "Privacy-first M365 Copilot productivity ROI calculator"

# Repository will be created and remote added automatically
```

---

## Part 3: Push to GitHub

### Step 1: Add Remote Repository

```bash
# Replace YOUR-USERNAME with your GitHub username
git remote add origin https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator.git

# Verify remote was added
git remote -v
# Should show:
# origin  https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator.git (fetch)
# origin  https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator.git (push)
```

### Step 2: Rename Branch to "main"

```bash
# GitHub uses 'main' as default branch name
git branch -M main
```

### Step 3: Push to GitHub

```bash
# Push to remote repository
git push -u origin main

# You may be prompted for GitHub credentials:
# - Username: your GitHub username
# - Password: use Personal Access Token (not your GitHub password)
```

#### Creating a Personal Access Token (if needed)

If you don't have a token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. **Note:** "Git operations"
4. **Expiration:** Choose duration (e.g., 90 days)
5. **Scopes:** Check ✅ `repo` (all sub-options)
6. Click "Generate token"
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

### Step 4: Verify Upload

Go to your repository on GitHub:
```
https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator
```

You should see all your files listed.

---

## Part 4: Enable GitHub Pages

### Step 1: Access Repository Settings

1. Go to your repository on GitHub
2. Click the **Settings** tab (top right)

### Step 2: Navigate to Pages Settings

1. In the left sidebar, scroll down to **Pages**
2. Click **Pages**

### Step 3: Configure Source

Under **Build and deployment**:

1. **Source:** Select "Deploy from a branch"
2. **Branch:**
   - Select: `main`
   - Folder: `/ (root)`
3. Click **Save**

### Step 4: Wait for Deployment

- GitHub will automatically build and deploy your site
- This takes **1-3 minutes**
- Refresh the page to see deployment status

### Step 5: Get Your URL

Once deployed, you'll see a success message:

```
Your site is live at https://YOUR-USERNAME.github.io/m365-copilot-roi-calculator/
```

**Click the link** to view your live calculator!

---

## Part 5: Update README with Your URL

### Step 1: Edit README Locally

Open `README.md` in a text editor and find:

```markdown
**GitHub Pages**: `https://YOUR-USERNAME.github.io/m365-copilot-roi-calculator/`
```

Replace `YOUR-USERNAME` with your actual GitHub username.

Also update in the "Quick Start" section and anywhere else `YOUR-USERNAME` appears.

### Step 2: Commit and Push Changes

```bash
# Stage the updated README
git add README.md

# Commit the change
git commit -m "Update README with actual GitHub Pages URL"

# Push to GitHub
git push

# Wait 1-2 minutes for automatic redeployment
```

---

## Part 6: Verification & Testing

### Test Your Live Site

1. **Navigate to your GitHub Pages URL:**
   ```
   https://YOUR-USERNAME.github.io/m365-copilot-roi-calculator/
   ```

2. **Test all three pages:**
   - Main page (index.html) - should load automatically
   - Click "ROI Calculator" navigation button
   - Click "Adoption Journey" navigation button

3. **Test CSV upload:**
   - Use the included `sample-data.csv` file
   - Drag and drop or click "Choose File"
   - Verify data loads and displays correctly

4. **Test PDF export:**
   - Click "Export PDF" button
   - Verify PDF downloads with correct formatting

5. **Test on different devices:**
   - Desktop browser
   - Mobile phone
   - Tablet

### Verify Privacy (No Data Transmission)

1. Open browser DevTools (`F12`)
2. Go to **Network** tab
3. Clear existing requests (trash icon)
4. Upload `sample-data.csv`
5. **Verify:** No new network requests appear (except page navigation)

---

## Part 7: Making Updates

### Workflow for Future Changes

```bash
# 1. Make your changes to files locally
# (Edit HTML, CSS, or JS files)

# 2. Test locally in browser
# Open index.html and verify changes work

# 3. Stage changes
git add .

# 4. Commit with descriptive message
git commit -m "Description of what you changed"

# 5. Push to GitHub
git push

# 6. Wait 1-2 minutes
# GitHub automatically redeploys your site
```

### Example: Update Styling

```bash
# Edit styles.css
code styles.css  # or use any text editor

# Test locally
start index.html

# Commit and push
git add styles.css
git commit -m "Update header styling for better mobile display"
git push
```

---

## Part 8: Custom Domain (Optional)

To use your own domain like `roi-calculator.yourcompany.com`:

### Step 1: Add CNAME File

```bash
# Create CNAME file (no extension)
echo "roi-calculator.yourcompany.com" > CNAME

# Commit and push
git add CNAME
git commit -m "Add custom domain"
git push
```

### Step 2: Configure DNS

With your domain provider (GoDaddy, Cloudflare, etc.):

**Option A: Subdomain (recommended)**

Add a CNAME record:
- **Type:** CNAME
- **Name:** roi-calculator (or your chosen subdomain)
- **Target:** YOUR-USERNAME.github.io
- **TTL:** 3600 (or default)

**Option B: Apex domain (e.g., yourcompany.com)**

Add A records pointing to GitHub's IPs:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### Step 3: Configure in GitHub

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter: `roi-calculator.yourcompany.com`
3. Click **Save**
4. Wait for DNS check (may take up to 24 hours)
5. Once verified, check **Enforce HTTPS**

### Step 4: Verify

Visit your custom domain to confirm it's working.

---

## Part 9: Troubleshooting

### Issue: "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH:

```bash
# Check current remote
git remote -v

# If it shows git@github.com, change to HTTPS:
git remote set-url origin https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator.git
```

### Issue: "Updates were rejected because the remote contains work"

**Solution:** Pull remote changes first:

```bash
git pull origin main --rebase
git push
```

### Issue: 404 Error on GitHub Pages

**Causes:**
- Deployment not finished yet (wait 2-3 minutes)
- Wrong URL (check Settings → Pages for correct URL)
- Branch or folder misconfigured

**Solution:**
1. Go to **Settings** → **Pages**
2. Verify source is set to `main` branch, `/ (root)` folder
3. Wait a few minutes after saving
4. Hard refresh browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)

### Issue: Changes Not Appearing on Live Site

**Solution:**
1. Verify changes were pushed: `git log --oneline`
2. Check GitHub Actions tab for build status
3. Wait 2-3 minutes for redeployment
4. Hard refresh browser to clear cache
5. Try incognito/private window

### Issue: CSV Upload Not Working

**Causes:**
- Browser compatibility issue
- JavaScript error

**Solution:**
1. Open browser console (`F12` → Console tab)
2. Look for error messages
3. Verify you're using a modern browser (Chrome/Edge/Firefox/Safari latest)
4. Try a different browser
5. Check that script.js loaded properly (Network tab)

### Issue: "This site can't be reached"

**Solution:**
- Check your internet connection
- Verify repository is public (Settings → General → Danger Zone)
- Confirm GitHub Pages is enabled (Settings → Pages)

---

## Part 10: Maintenance & Best Practices

### Regular Maintenance

**Every 3-6 months:**
- Update dependencies (html2pdf.js) if new versions released
- Test on latest browser versions
- Review and update documentation
- Check for security updates

### Git Best Practices

**Commit messages:**
```bash
# Good ✅
git commit -m "Fix table sorting on mobile devices"
git commit -m "Add support for additional date formats"
git commit -m "Update README with deployment instructions"

# Bad ❌
git commit -m "fixes"
git commit -m "update"
git commit -m "changes"
```

**Commit frequently:**
- Small, focused commits are better than large ones
- Easier to track changes and revert if needed

### Backup Strategy

**Recommended:**
1. Keep local copy on your computer
2. GitHub repository (already your backup)
3. Optional: Clone to second location or external drive

```bash
# Clone to backup location
git clone https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator.git ~/backup/roi-calculator
```

---

## Part 11: Analytics (Optional)

If you want to track page views (without violating privacy):

### Google Analytics (Page Views Only)

Add to `<head>` in all HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true,  // Anonymize user IPs
    'allow_ad_personalization_signals': false
  });
</script>
```

**Important:** Update PRIVACY.md if you add analytics.

### Simple Alternative: GitHub Traffic Stats

GitHub provides basic analytics:
- Go to **Insights** → **Traffic**
- See page views, unique visitors, referring sites
- No code changes needed
- Data only visible to repository owners

---

## Additional Resources

### Documentation
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI](https://cli.github.com/)

### Learning Git
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)

### Support
- **Email:** jordanking@microsoft.com
- **GitHub Issues:** Open an issue in your repository

---

## Quick Reference Commands

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/m365-copilot-roi-calculator.git

# Check status
git status

# Add files
git add .                    # All files
git add filename.html        # Specific file

# Commit
git commit -m "Descriptive message"

# Push to GitHub
git push

# Pull from GitHub
git pull

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename.html
```

---

**Deployment Complete!** 🎉

Your M365 Copilot ROI Calculator is now live on GitHub Pages and ready to use.

Share your URL: `https://YOUR-USERNAME.github.io/m365-copilot-roi-calculator/`
