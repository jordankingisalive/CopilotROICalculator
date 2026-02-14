# Privacy & Security Documentation

## Overview

The M365 Copilot ROI Calculator is designed with **privacy-first architecture**. All data processing occurs entirely within the user's web browser, with **zero data transmission** to external servers.

---

## Privacy Guarantees

### ✅ What We DO

- **Process data locally** - All CSV parsing, calculations, and analysis happen in browser JavaScript
- **Use browser memory only** - Data exists temporarily in RAM during the session
- **Clear data automatically** - All data is garbage collected when you close the tab
- **Serve static files** - GitHub Pages only delivers HTML, CSS, and JavaScript files
- **Use secure CDN** - html2pdf.js is loaded from Cloudflare's trusted CDN

### ❌ What We DON'T Do

- **No server-side processing** - Zero backend infrastructure
- **No data storage** - No databases, cookies, or persistent storage
- **No data transmission** - No AJAX calls, fetch requests, or API submissions with user data
- **No tracking** - No analytics, pixels, or fingerprinting
- **No third-party services** - No external processing or cloud services
- **No authentication** - No user accounts or login systems

---

## Technical Architecture

### Client-Side Only Processing

```
User's Browser
├── HTML/CSS/JS loaded from GitHub Pages (one-time)
├── User selects CSV file via FileReader API
├── JavaScript parses CSV in browser memory
├── Calculations performed locally
├── Results displayed in DOM
└── Data cleared on tab close
```

**No data ever leaves this boundary.**

### Data Flow Diagram

```
[User's Device]
     │
     ├─► CSV File Selected (FileReader API)
     │   └─► File read into memory buffer
     │
     ├─► JavaScript Processing (script.js)
     │   ├─► Parse CSV rows
     │   ├─► Detect format (long/wide)
     │   ├─► Aggregate by organization
     │   ├─► Calculate ROI metrics
     │   └─► Generate table HTML
     │
     ├─► Display Results (DOM manipulation)
     │   └─► Rendered in browser only
     │
     └─► PDF Export (html2pdf.js - client-side)
         └─► Generated in browser, saved locally

[No network transmission of user data]
```

---

## Security Analysis

### FileReader API

The application uses the browser's native [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader):

```javascript
const reader = new FileReader();
reader.onload = function(e) {
    const csvContent = e.target.result;
    // All processing happens here in memory
};
reader.readAsText(file);
```

**Security properties:**
- ✅ Runs in browser sandbox
- ✅ No file system access beyond user-selected file
- ✅ Same-origin policy enforced
- ✅ Content Security Policy (CSP) compatible

### JavaScript Processing (script.js)

All data manipulation uses vanilla JavaScript:

```javascript
// Example: CSV parsing
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => {
        // Parse and return row object
    });
    return { headers, rows };
}
```

**Security properties:**
- ✅ No eval() or dynamic code execution
- ✅ No external library dependencies for core processing
- ✅ Input sanitization for display (prevents XSS)
- ✅ No local storage or cookies

### PDF Export (html2pdf.js)

PDF generation uses [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) via CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
```

**Security properties:**
- ✅ Client-side rendering only (uses html2canvas + jsPDF)
- ✅ No data sent to external services
- ✅ PDF generated in browser memory
- ✅ User triggers download via browser's native save dialog
- ✅ Loaded from Cloudflare CDN with SRI (Subresource Integrity) possible

**Note:** To add SRI verification, update to:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        integrity="sha512-[HASH]"
        crossorigin="anonymous"></script>
```

---

## Network Activity Analysis

### What Network Requests Occur?

**Initial Page Load (one-time):**
1. `https://YOUR-USERNAME.github.io/m365-copilot-roi-calculator/index.html` - Main HTML
2. `https://YOUR-USERNAME.github.io/m365-copilot-roi-calculator/styles.css` - Stylesheet
3. `https://YOUR-USERNAME.github.io/m365-copilot-roi-calculator/script.js` - JavaScript
4. `https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js` - PDF library

**After Page Load:**
- ❌ **ZERO network requests with user data**
- ❌ No analytics beacons
- ❌ No tracking pixels
- ❌ No API calls

### Verification Steps

Users can verify zero data transmission using browser DevTools:

**Chrome/Edge:**
1. Press `F12` to open DevTools
2. Go to **Network** tab
3. Clear existing requests (trash icon)
4. Upload CSV and perform analysis
5. **Verify: No new network requests appear**

**Firefox:**
1. Press `F12` to open Web Developer Tools
2. Go to **Network** tab
3. Click "Clear" to reset
4. Upload CSV and perform analysis
5. **Verify: No new network requests appear**

---

## Compliance Considerations

### GDPR (General Data Protection Regulation)

**Article 4(2) - Processing:**
Since no data leaves the user's device, this technically may not constitute "processing" under GDPR as the data controller (you) never receives the data.

**Recommendation:** Include a brief notice:
> "This tool processes your data locally in your browser. We do not collect, store, or transmit your data."

### CCPA (California Consumer Privacy Act)

Not applicable - no personal information is collected or sold.

### HIPAA (Healthcare)

If analyzing healthcare organization data:
- ✅ No PHI (Protected Health Information) transmission
- ✅ No business associate agreement required
- ✅ Safe for aggregate usage data analysis

**Note:** Individual-level data (specific employees) should not be included in CSV exports.

### SOC 2 / ISO 27001

Organizations with these requirements can safely use this tool:
- ✅ No third-party data processors
- ✅ No cloud storage or transmission
- ✅ Client-side encryption (inherent via HTTPS)
- ✅ No access logging (no server interaction)

---

## Enterprise Deployment Considerations

### Internal Hosting

Organizations can host this internally:

**Option 1: Intranet Web Server**
```bash
# Copy files to web server directory
cp -r m365-copilot-roi-calculator/ /var/www/html/roi/

# Access via: http://intranet.company.com/roi/
```

**Option 2: SharePoint**
1. Upload files to SharePoint document library
2. Set `index.html` as welcome page
3. Access via SharePoint URL

**Option 3: Offline/Air-Gapped**
1. Copy folder to USB drive or network share
2. Open `index.html` directly in browser (file:// protocol)
3. Full functionality works offline

### Content Security Policy

For enhanced security, add CSP headers to your web server:

```http
Content-Security-Policy:
    default-src 'self';
    script-src 'self' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    connect-src 'none';
```

This explicitly:
- ✅ Allows scripts only from same origin and Cloudflare CDN
- ✅ Blocks all XMLHttpRequest/fetch API calls (`connect-src 'none'`)
- ✅ Prevents injection attacks

---

## Data Retention

**Session Duration:** Data exists in browser memory only during the session.

**Data Lifecycle:**
1. **Upload:** File read into JavaScript variable (RAM)
2. **Processing:** Calculations performed on in-memory data
3. **Display:** Results rendered to DOM
4. **Tab Close:** JavaScript variables garbage collected
5. **Browser Close:** All memory cleared

**Persistent Storage:** None
- ❌ No localStorage
- ❌ No sessionStorage
- ❌ No IndexedDB
- ❌ No cookies
- ❌ No cache API

---

## Audit & Verification

### For IT Security Teams

**Code Review:**
All source code is available in the repository:
- `index.html` - Structure and form handling
- `script.js` - Data processing logic (no external calls)
- `styles.css` - Styling only (no executable code)

**Static Analysis:**
```bash
# Check for external API calls
grep -r "fetch\|XMLHttpRequest\|axios\|ajax" *.js *.html
# Expected: No results in user data processing functions

# Check for storage APIs
grep -r "localStorage\|sessionStorage\|indexedDB\|cookie" *.js *.html
# Expected: No results

# Check for analytics
grep -r "analytics\|gtag\|ga\|track" *.js *.html
# Expected: No results
```

**Network Monitoring:**
Deploy on test environment and monitor with:
- Wireshark
- Fiddler
- Browser DevTools Network tab

**Expected Result:** Zero POST/PUT requests after initial page load.

---

## Email Functionality Privacy

The "Email" button uses `mailto:` protocol:

```javascript
function emailReport() {
    const subject = encodeURIComponent('M365 Copilot Productivity ROI Analysis');
    const body = encodeURIComponent('Please find attached...');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
```

**Privacy properties:**
- ✅ Opens user's default email client
- ✅ No data included in email (user must attach PDF manually)
- ✅ No email addresses collected
- ✅ No tracking of email sends

---

## Open Source Transparency

This tool is open source to enable:
- ✅ **Audit by security teams** - Review all source code
- ✅ **Trust through transparency** - No hidden functionality
- ✅ **Community verification** - Independent security researchers can validate
- ✅ **Internal modifications** - Customize for specific requirements

---

## Questions & Concerns

### "How can I verify no data is transmitted?"

1. Open browser DevTools (F12)
2. Go to Network tab
3. Upload CSV and process
4. Verify no POST/PUT requests occur

### "Can GitHub see my data?"

No. GitHub Pages only serves static files. GitHub's servers deliver the HTML/CSS/JS files once, then all processing happens in your browser. GitHub cannot see the CSV data you upload.

### "What about the CDN (html2pdf.js)?"

The CDN (Cloudflare) delivers the pdf library code, but never receives your data. PDF generation happens entirely in your browser.

### "Is this safe for confidential data?"

Yes, as long as:
- ✅ You're accessing via HTTPS (encrypts page delivery)
- ✅ You're on a trusted network
- ✅ Your browser is up-to-date and malware-free

The application itself does not transmit data, but general computer security best practices still apply.

---

## Contact for Security Concerns

If you discover a security vulnerability:

**Please DO:**
- Email: jordanking@microsoft.com
- Provide details of the vulnerability
- Allow reasonable time for patch before public disclosure

**Please DON'T:**
- Publicly disclose before patch is available
- Test vulnerabilities on production deployments

---

## Version History

**v1.0.0 (2025-02-14)**
- Initial privacy-first architecture
- Zero data transmission design
- Client-side only processing
- Open source release

---

**Last Updated:** February 14, 2025
**Privacy Architecture:** Client-Side Only
**Data Transmission:** None
**Third-Party Services:** None (except CDN for library delivery)
