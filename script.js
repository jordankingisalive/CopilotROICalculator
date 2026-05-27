// Global state
let uploadedData = null;
let resultsDisplayed = false;
// Tooltip helper — returns inline HTML for a hover ? icon with explanation
const tip = (text) => `<span class="info-tip"><span class="info-icon">?</span><span class="tip-text">${text}</span></span>`;
// Collapsible section wrapper — renders as <details open> so user can collapse before PDF export
const section = (title, content, extraClass = '') => `
<details open class="collapsible-section ${extraClass}">
    <summary class="section-toggle"><span class="toggle-chevron">▾</span> ${title}</summary>
    <div class="section-body">${content}</div>
</details>`;
let config = {
    licenseCost: 30,
    professionalRate: 78,
    minutesPerAction: 6,
    analysisWeeks: 26,
    intelligentRecapActions: 0
};

// Position tooltips dynamically (fixed positioning to escape overflow containers)
document.addEventListener('mouseover', function(e) {
    const icon = e.target.closest('.info-tip');
    if (!icon) return;
    const tip = icon.querySelector('.tip-text');
    if (!tip) return;
    const rect = icon.getBoundingClientRect();
    const tipW = 260;
    // Temporarily show to measure height
    tip.style.visibility = 'hidden';
    tip.style.display = 'block';
    tip.style.opacity = '0';
    const tipH = tip.offsetHeight || 80;
    tip.style.display = '';
    tip.style.visibility = '';
    tip.style.opacity = '';
    let left = rect.left + rect.width / 2 - tipW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8));
    tip.style.left = left + 'px';
    // Default: show above
    let top = rect.top - tipH - 10;
    // If it would go off-screen top, show below instead
    if (top < 8) top = rect.bottom + 10;
    tip.style.top = top + 'px';
});

// Initialize upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileSelectBtn = document.getElementById('fileSelectBtn');

    // File select button
    fileSelectBtn.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
        if (event.target !== fileSelectBtn) {
            fileInput.click();
        }
    });

    // Prevent Enter key on config inputs from triggering form submission / Calculate button
    document.querySelectorAll('.config-grid input[type="number"]').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
    });

    // Config inputs — update config values, show recalculate prompt if results are visible
    function onConfigChange() {
        if (resultsDisplayed) showRecalculateBanner();
    }

    document.getElementById('licensesCost').addEventListener('change', (e) => {
        config.licenseCost = parseFloat(e.target.value);
        onConfigChange();
    });

    document.getElementById('professionalRate').addEventListener('change', (e) => {
        config.professionalRate = parseFloat(e.target.value);
        onConfigChange();
    });

    // Minutes per action slider
    const minutesSlider = document.getElementById('minutesPerAction');
    const minutesOutput = document.getElementById('minutesValue');

    minutesSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        minutesOutput.textContent = `${value} min`;
        config.minutesPerAction = value;
        onConfigChange();
    });



    document.getElementById('intelligentRecapActions').addEventListener('change', (e) => {
        config.intelligentRecapActions = parseInt(e.target.value) || 0;
        onConfigChange();
    });
});

// Handle file upload
function handleFile(file) {
    if (!file.name.endsWith('.csv')) {
        showError('Please upload a CSV file');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csvData = e.target.result;
            uploadedData = parseCSV(csvData);
            config.analysisWeeks = uploadedData.detectedWeeks || 26;
            showFilePreview(file.name, uploadedData);
        } catch (error) {
            showError('Error processing file: ' + error.message);
        }
    };
    reader.onerror = () => {
        showError('Error reading file');
    };
    reader.readAsText(file);
}

// Instant demo render: used by dedicated demo.html page.
// Skips fetch, skips DOM input writes, goes straight to renderResults().
function loadDemoReportInstant(csvText) {
    try {
        config.totalPurchasedLicenses = 8000;
        config.licenseCost = 30;
        config.minutesPerAction = 6;
        config.professionalRate = 78;
        config.intelligentRecapActions = 0;

        uploadedData = parseCSV(csvText);
        config.analysisWeeks = uploadedData.detectedWeeks || 26;
        isDemoData = true;

        if (window.clarity) {
            try { clarity('event', 'demo_report_loaded_instant'); } catch (e) {}
        }

        renderResults();
    } catch (error) {
        console.error('Error in instant demo render:', error);
        var container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '<div style="padding:3rem;text-align:center;color:#fff;"><h2>Unable to load demo</h2><p>' + (error && error.message ? error.message : 'Unknown error') + '</p><p><a href="index.html" style="color:#00D4FF;">Return to calculator</a></p></div>';
        }
    }
}

// Show file preview with Calculate button
function showFilePreview(fileName, data) {
    const rows = data.rows;
    const totalUsers = rows.reduce((s, r) => s + r.enabledUsers, 0);
    const totalWeeklyActions = rows.reduce((s, r) => s + r.weeklyActions, 0);
    const groupLabel = data.groupLabel || 'teams';

    const previewHtml = `
        <div style="background: var(--surface, #1E293B); border: 1px solid var(--border, rgba(255,255,255,0.08)); border-radius: 16px; padding: 2rem; margin: 1.5rem 0; animation: fadeIn 0.4s ease;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                <span style="font-size: 1.5rem;">✅</span>
                <div>
                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary, #F1F5F9);">${fileName}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary, #94A3B8);">File loaded successfully</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: var(--surface-raised, #253449); border-radius: 10px; padding: 1rem; text-align: center; border: 1px solid var(--border, rgba(255,255,255,0.08));">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--copilot-cyan, #00D4FF);">${rows.length}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary, #94A3B8); text-transform: uppercase; letter-spacing: 0.5px;">${groupLabel}</div>
                </div>
                <div style="background: var(--surface-raised, #253449); border-radius: 10px; padding: 1rem; text-align: center; border: 1px solid var(--border, rgba(255,255,255,0.08));">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--copilot-cyan, #00D4FF);">${totalUsers.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary, #94A3B8); text-transform: uppercase; letter-spacing: 0.5px;">Licensed Users</div>
                </div>
                <div style="background: var(--surface-raised, #253449); border-radius: 10px; padding: 1rem; text-align: center; border: 1px solid var(--border, rgba(255,255,255,0.08));">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--copilot-cyan, #00D4FF);">${totalWeeklyActions.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary, #94A3B8); text-transform: uppercase; letter-spacing: 0.5px;">Weekly Actions</div>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center;">
                <button type="button" onclick="runCalculation()" style="flex: 1; padding: 1rem; font-size: 1.1rem; font-weight: 700; background: linear-gradient(135deg, #4A9EF7, #A855F7); color: #fff; border: none; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; font-family: inherit;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 24px rgba(74,158,247,0.3)';"
                    onmouseout="this.style.transform=''; this.style.boxShadow='';">
                    Calculate Productivity ROI
                </button>
                <button type="button" onclick="location.reload()" style="padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: transparent; color: var(--text-secondary, #94A3B8); border: 1px solid var(--border, rgba(255,255,255,0.08)); border-radius: 10px; cursor: pointer; font-family: inherit;">
                    Reset
                </button>
            </div>
        </div>
    `;

    // Reset calculation state so config edits don't auto-trigger results
    resultsDisplayed = false;

    // Insert preview after upload area
    const existingPreview = document.getElementById('filePreview');
    if (existingPreview) existingPreview.remove();

    const previewDiv = document.createElement('div');
    previewDiv.id = 'filePreview';
    previewDiv.innerHTML = previewHtml;

    const uploadArea = document.getElementById('uploadArea');
    uploadArea.style.display = 'none';
    uploadArea.parentNode.insertBefore(previewDiv, uploadArea.nextSibling);
}

// Sync config from current DOM input values
function syncConfigFromInputs() {
    config.licenseCost = parseFloat(document.getElementById('licensesCost').value) || 0;
    config.professionalRate = parseFloat(document.getElementById('professionalRate').value) || 0;
    config.minutesPerAction = parseFloat(document.getElementById('minutesPerAction').value) || 6;
    config.intelligentRecapActions = parseInt(document.getElementById('intelligentRecapActions').value) || 0;
}

// Run calculation (triggered by Calculate button)
function runCalculation() {
    if (!uploadedData) return;
    syncConfigFromInputs();
    showLoading();
    // Small delay so loading spinner is visible
    setTimeout(() => {
        try {
            renderResults();
            dismissRecalculateBanner();
        } catch (error) {
            showError('Error calculating results: ' + error.message);
        }
    }, 300);
}

// Show a banner prompting user to recalculate after config changes
function showRecalculateBanner() {
    if (document.getElementById('recalcBanner')) return; // already visible
    const banner = document.createElement('div');
    banner.id = 'recalcBanner';
    banner.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:9999;background:linear-gradient(135deg,#4A9EF7,#A855F7);color:#fff;padding:0.75rem 1.5rem;border-radius:12px;font-weight:600;font-size:0.95rem;cursor:pointer;box-shadow:0 8px 32px rgba(74,158,247,0.35);display:flex;align-items:center;gap:0.75rem;font-family:inherit;animation:fadeIn 0.3s ease;';
    banner.innerHTML = '⟳ Settings changed &mdash; <span style="text-decoration:underline;cursor:pointer;">Recalculate</span>';
    banner.addEventListener('click', () => {
        dismissRecalculateBanner();
        runCalculation();
    });
    document.body.appendChild(banner);
}

function dismissRecalculateBanner() {
    const b = document.getElementById('recalcBanner');
    if (b) b.remove();
}

// Parse CSV and flatten data structure in RAM
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV file appears to be empty');
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    // Parse rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            rows.push(row);
        }
    }

    if (rows.length === 0) {
        throw new Error('No valid data rows found in CSV');
    }

    // Flatten and normalize data
    return flattenData(rows);
}

// Parse a single CSV line (handles commas in quotes)
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());

    return values.map(v => v.replace(/^"|"$/g, ''));
}

// Parse date from various formats
function parseDate(dateString) {
    if (!dateString) return null;

    const cleaned = dateString.trim();

    // ISO format: YYYY-MM-DD HH:MM:SS or YYYY-MM-DD
    const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
        return new Date(isoMatch[1], isoMatch[2] - 1, isoMatch[3]);
    }

    // Try MM/DD/YYYY or M/D/YYYY (en-US)
    const usMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (usMatch) {
        return new Date(usMatch[3], usMatch[1] - 1, usMatch[2]);
    }

    // Fallback to native Date parsing
    const parsed = new Date(cleaned);
    return isNaN(parsed.getTime()) ? null : parsed;
}

// Flatten data structure for analysis
function flattenData(rows) {
    const headers = Object.keys(rows[0]);

    // Detect WIDE format: columns like "2025-08-10 Enabled Users"
    const dateColumnPattern = /^(\d{4}-\d{2}-\d{2})\s+(.+)$/;
    const dateMetricMap = {}; // { 'YYYY-MM-DD': { 'Enabled Users': colName, ... } }

    headers.forEach(h => {
        const match = h.match(dateColumnPattern);
        if (match) {
            const date = match[1];
            const metric = match[2];
            if (!dateMetricMap[date]) dateMetricMap[date] = {};
            dateMetricMap[date][metric] = h;
        }
    });

    const sortedDates = Object.keys(dateMetricMap).sort();
    const isWideFormat = sortedDates.length > 0;

    if (isWideFormat) {
        console.log(`Detected WIDE format CSV with ${sortedDates.length} date columns`);

        // First column is always the grouping key
        const orgColumn = headers[0];
        const groupLabel = orgColumn;

        const orgWeeklyData = {};

        const flattenedData = rows
            .filter(row => {
                const orgName = (row[orgColumn] || '').trim();
                // Exclude empty rows and the pre-aggregated "Total" row
                return orgName && orgName.toLowerCase() !== 'total';
            })
            .map(row => {
                const orgName = (row[orgColumn] || '').trim();

                // For each org, find the most recent date where it actually has Enabled Users data.
                // Many orgs don't report in every week — using a fixed last-column would miss them.
                let bestDate = null;
                for (let i = sortedDates.length - 1; i >= 0; i--) {
                    const cols = dateMetricMap[sortedDates[i]];
                    const val = parseNumber(row[cols['Enabled Users']] || 0);
                    if (val > 0) {
                        bestDate = sortedDates[i];
                        break;
                    }
                }

                if (!bestDate) {
                    // No data for this org at all — return zeroes (will be filtered out below)
                    return { team: orgName, enabledUsers: 0, activeUsers: 0, weeklyActions: 0, monthlyActions: 0, engagement: 0, actionsPerUser: 0, powerUsers: 0 };
                }

                // Use latest week's enabled users (most current headcount)
                const bestCols = dateMetricMap[bestDate];
                const enabledUsers = parseNumber(row[bestCols['Enabled Users']] || 0);

                // Average metrics across ALL weeks with data (consistent with long-format aggregation)
                const weeklyMetrics = sortedDates.map(date => {
                    const cols = dateMetricMap[date];
                    return {
                        activePercent: parseNumber(row[cols['% Active Users']] || 0),
                        actions: parseNumber(row[cols['Avg Copilot Actions']] || 0),
                        powerPercent: parseNumber(row[cols['% Power Users']] || 0),
                        activeDays: parseNumber(row[cols['Avg Active Days']] || 0),
                        enabled: parseNumber(row[cols['Enabled Users']] || 0)
                    };
                }).filter(w => w.enabled > 0);

                const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
                const activePercent = avg(weeklyMetrics.map(w => w.activePercent).filter(v => v > 0));
                const actionsPerUser = avg(weeklyMetrics.map(w => w.actions).filter(v => v > 0));
                const powerUsersPercent = avg(weeklyMetrics.map(w => w.powerPercent).filter(v => v > 0));
                const avgActiveDays = avg(weeklyMetrics.map(w => w.activeDays).filter(v => v > 0));

                const activeUsers = Math.round((enabledUsers * activePercent) / 100);
                const weeklyActions = actionsPerUser * activeUsers;
                const monthlyActions = weeklyActions * 4.33;
                const powerUsersCount = Math.round((activeUsers * powerUsersPercent) / 100);

                // Build weekly history for this org (for peak week calculation)
                orgWeeklyData[orgName] = sortedDates
                    .map(date => {
                        const cols = dateMetricMap[date];
                        const actions = parseNumber(row[cols['Avg Copilot Actions']] || 0);
                        return { date: parseDate(date), actionsPerUser: actions };
                    })
                    .filter(w => w.date !== null && w.actionsPerUser > 0);

                return {
                    team: orgName,
                    enabledUsers,
                    activeUsers,
                    weeklyActions,
                    monthlyActions,
                    engagement: avgActiveDays,
                    actionsPerUser,
                    powerUsers: powerUsersCount
                };
            })
            .filter(row => row.enabledUsers > 0 || row.activeUsers > 0);

        let detectedWeeks = sortedDates.length;
        if (sortedDates.length >= 2) {
            const earliest = new Date(sortedDates[0]);
            const latest = new Date(sortedDates[sortedDates.length - 1]);
            const spanDays = (latest - earliest) / (1000 * 60 * 60 * 24);
            const spanWeeks = Math.round(spanDays / 7) + 1;
            detectedWeeks = Math.max(spanWeeks, sortedDates.length);
        }
        console.log(`Parsed ${flattenedData.length} organizations from wide format (${detectedWeeks} weeks)`);
        const dateRange = sortedDates.length >= 2 ? `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}` : '';
        return { rows: flattenedData, mapping: {}, weeklyData: orgWeeklyData, groupLabel, detectedWeeks, dateRange };
    }

    // --- LONG FORMAT fallback ---
    // First column is always the grouping key
    const groupLabel = headers[0];

    // Try to detect column names (flexible mapping)
    const columnMappings = {
        enabledUsers: ['Enabled Users', 'Licensed Users', 'Total Users', 'Enabled'],
        activeUsers: ['Active Users', 'Active', 'Users'],
        totalActions: ['Total Actions', 'Actions', 'Total Activity', 'Avg Copilot Actions'],
        monthlyActions: ['Monthly Actions', 'Monthly Activity', 'Actions (Monthly)'],
        engagement: ['Engagement %', 'Engagement', 'Engagement Rate', 'Engagement Percentage', 'Avg Active Days'],
        activeUsersPercent: ['% Active Users', 'Active Users %', 'Active %'],
        powerUsers: ['% Power Users', 'Power Users %', 'Power Users'],
        date: ['Date', 'Week', 'Period', 'Week Ending']
    };

    // Find matching columns
    const mapping = { team: headers[0] };
    for (const [key, possibleNames] of Object.entries(columnMappings)) {
        for (const name of possibleNames) {
            const found = headers.find(h => h.toLowerCase().includes(name.toLowerCase()));
            if (found) {
                mapping[key] = found;
                break;
            }
        }
    }

    const hasDateColumn = !!mapping.date;
    const orgWeeklyData = {};

    if (hasDateColumn) {
        console.log('Detected LONG format CSV - aggregating by organization...');

        const orgGroups = {};
        rows.forEach(row => {
            const orgName = row[mapping.team];
            if (!orgName) return;
            if (!orgGroups[orgName]) orgGroups[orgName] = [];
            orgGroups[orgName].push(row);
        });

        const aggregatedRows = [];
        for (const [orgName, orgRows] of Object.entries(orgGroups)) {
            const rowsWithDates = orgRows.map(row => ({
                row: row,
                date: parseDate(row[mapping.date])
            })).filter(item => item.date !== null);

            if (rowsWithDates.length === 0) {
                aggregatedRows.push(orgRows[0]);
                continue;
            }

            rowsWithDates.sort((a, b) => b.date - a.date);

            orgWeeklyData[orgName] = rowsWithDates.map(item => ({
                date: item.date,
                actionsPerUser: parseNumber(item.row[mapping.totalActions] || 0)
            }));

            // Build an averaged row across all weeks instead of just using the latest
            const latestRow = { ...rowsWithDates[0].row };

            // Average the % Active Users across all weeks
            if (mapping.activeUsersPercent) {
                const activePercents = rowsWithDates
                    .map(item => parseNumber(item.row[mapping.activeUsersPercent] || 0))
                    .filter(p => p > 0);
                if (activePercents.length > 0) {
                    const avgActivePercent = activePercents.reduce((a, b) => a + b, 0) / activePercents.length;
                    latestRow[mapping.activeUsersPercent] = avgActivePercent.toFixed(1) + '%';
                }
            }

            // Average the actions per user across all weeks
            if (mapping.totalActions) {
                const actions = rowsWithDates
                    .map(item => parseNumber(item.row[mapping.totalActions] || 0))
                    .filter(a => a > 0);
                if (actions.length > 0) {
                    const avgActions = actions.reduce((a, b) => a + b, 0) / actions.length;
                    latestRow[mapping.totalActions] = avgActions.toFixed(1);
                }
            }

            // Use the latest week's enabled users (most current headcount)
            aggregatedRows.push(latestRow);
        }

        console.log(`Aggregated ${rows.length} rows into ${aggregatedRows.length} organizations`);
        rows = aggregatedRows;
    }

    const flattenedData = rows
        .filter(row => {
            const orgName = (row[mapping.team] || '').trim();
            return orgName && orgName.toLowerCase() !== 'total';
        })
        .map(row => {
            let enabledUsers = parseNumber(row[mapping.enabledUsers] || 0);
            let activeUsers = parseNumber(row[mapping.activeUsers] || 0);

            if (mapping.activeUsersPercent && row[mapping.activeUsersPercent] && enabledUsers > 0) {
                const activePercent = parseNumber(row[mapping.activeUsersPercent]);
                if (activePercent > 0) {
                    activeUsers = Math.round((enabledUsers * activePercent) / 100);
                }
            }

            if (activeUsers === 0 && enabledUsers > 0) {
                activeUsers = enabledUsers;
            }

            const actionsPerUserPerWeek = parseNumber(row[mapping.totalActions] || 0);
            const weeklyActions = actionsPerUserPerWeek * activeUsers;
            const monthlyActions = weeklyActions * 4.33;

            let powerUsersCount = 0;
            if (mapping.powerUsers && row[mapping.powerUsers]) {
                const powerUsersPercent = parseNumber(row[mapping.powerUsers]);
                powerUsersCount = Math.round((activeUsers * powerUsersPercent) / 100);
            }

            return {
                team: row[mapping.team],
                enabledUsers,
                activeUsers,
                weeklyActions,
                monthlyActions,
                engagement: parseNumber(row[mapping.engagement] || 0),
                actionsPerUser: actionsPerUserPerWeek,
                powerUsers: powerUsersCount
            };
        })
        .filter(row => row.enabledUsers > 0 || row.activeUsers > 0);

    // Calculate analysis period span from earliest to latest date
    const allDates = new Set();
    for (const weeks of Object.values(orgWeeklyData)) {
        weeks.forEach(w => allDates.add(w.date.toISOString().slice(0, 10)));
    }
    const sortedDateStrings = [...allDates].sort();
    let detectedWeeks = allDates.size || 1;
    if (sortedDateStrings.length >= 2) {
        const earliest = new Date(sortedDateStrings[0]);
        const latest = new Date(sortedDateStrings[sortedDateStrings.length - 1]);
        const spanDays = (latest - earliest) / (1000 * 60 * 60 * 24);
        const spanWeeks = Math.round(spanDays / 7) + 1; // +1 to include both endpoints
        detectedWeeks = Math.max(spanWeeks, allDates.size);
    }
    console.log(`Detected ${detectedWeeks} weeks of data (${sortedDateStrings.length} snapshots, span: ${sortedDateStrings[0]} to ${sortedDateStrings[sortedDateStrings.length - 1]})`);
    const dateRange = sortedDateStrings.length >= 2 ? `${sortedDateStrings[0]} to ${sortedDateStrings[sortedDateStrings.length - 1]}` : '';

    return { rows: flattenedData, mapping, weeklyData: orgWeeklyData, groupLabel, detectedWeeks, dateRange };
}

// Parse number from string (handles percentages, commas, etc.)
function parseNumber(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;

    // Remove commas, spaces, and percentage signs
    const cleaned = value.toString().replace(/[,%\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

// Calculate all ROI metrics
function calculateMetrics(data) {
    const rows = data.rows;

    // Aggregate totals
    const totalEnabledUsers = rows.reduce((sum, row) => sum + row.enabledUsers, 0);
    const totalActiveUsers = rows.reduce((sum, row) => sum + row.activeUsers, 0);
    const totalWeeklyActions = rows.reduce((sum, row) => sum + row.weeklyActions, 0);
    const totalMonthlyActions = rows.reduce((sum, row) => sum + row.monthlyActions, 0);

    // Activation rate
    const activationRate = totalEnabledUsers > 0 ? (totalActiveUsers / totalEnabledUsers) * 100 : 0;

    // Average actions per user
    const avgActionsPerUser = totalActiveUsers > 0 ? totalWeeklyActions / totalActiveUsers : 0;

    // Power users — sum actual power user counts from each team
    const powerUsers = rows.reduce((sum, row) => sum + row.powerUsers, 0);
    const powerUserRate = totalEnabledUsers > 0 ? (powerUsers / totalEnabledUsers) * 100 : 0;

    // Monthly costs
    const monthlyCost = totalEnabledUsers * config.licenseCost;
    const annualCost = monthlyCost * 12;

    // ROI Calculations using configured minutes per action
    const minsPerAction = config.minutesPerAction;
    const hoursPerMonth = (totalMonthlyActions * minsPerAction) / 60;
    const valuePerMonth = hoursPerMonth * config.professionalRate;
    const annualValue = valuePerMonth * 12;
    const roiMultiple = monthlyCost > 0 ? (valuePerMonth / monthlyCost) : 0;

    // Weekly hours saved
    const weeklyHoursSaved = (totalWeeklyActions * minsPerAction) / 60;

    return {
        totalEnabledUsers,
        totalActiveUsers,
        activationRate,
        avgActionsPerUser,
        powerUsers,
        powerUserRate,
        totalWeeklyActions,
        totalMonthlyActions,
        weeklyHoursSaved,
        monthlyCost,
        annualCost,
        minsPerAction,
        hoursPerMonth,
        valuePerMonth,
        annualValue,
        roiMultiple
    };
}

// Build ROI projection tables (break-even, tiers, 3-year projections)
function buildProjectionTables(metrics, sortedTeams) {
    const rate = config.professionalRate;
    const mpa = config.minutesPerAction;
    const valPerAction = (mpa / 60) * rate;
    const licenseCost = config.licenseCost;
    const totalUsers = metrics.totalEnabledUsers;
    const activeUsers = metrics.totalActiveUsers;
    const avgWeekly = metrics.avgActionsPerUser;
    const avgMonthly = avgWeekly * 4.33;

    // Helper: break-even actions needed at a given price
    const be = (price) => (price / valPerAction).toFixed(1);
    // Helper: ROI at a given price
    const roiAt = (price) => (avgMonthly * valPerAction / price).toFixed(1);

    // Price tiers for break-even table
    const tiers = [
        { label: `Current @ $${licenseCost}`, price: licenseCost },
    ];
    // Add common expansion tiers if different from current
    [9, 12, 15, 18, 24, 30].forEach(p => {
        if (p !== licenseCost) tiers.push({ label: `@ $${p}/mo`, price: p });
    });
    // Keep it manageable - show current + 4 most relevant
    const priceTiers = [tiers[0]];
    const others = tiers.slice(1).sort((a, b) => a.price - b.price);
    // Pick a spread: lowest, a mid, and highest that differ from current
    if (others.length > 0) {
        const spread = [others[0]];
        if (others.length > 2) spread.push(others[Math.floor(others.length / 2)]);
        if (others.length > 1) spread.push(others[others.length - 1]);
        spread.forEach(t => { if (!priceTiers.find(p => p.price === t.price)) priceTiers.push(t); });
    }

    // ---- BREAK-EVEN TABLE ----
    const beHeaders = priceTiers.map(t => `<th>${t.label}</th>`).join('');
    const beRow = (label, multiplier) => {
        const cells = priceTiers.map(t => `<td>${(t.price * multiplier / valPerAction).toFixed(1)}</td>`).join('');
        return `<tr><td><strong>${label}</strong></td>${cells}</tr>`;
    };

    const breakEvenHtml = section('Break-Even & ROI Thresholds', `
        <div class="roi-table-container" style="box-shadow:none;border:none;padding:0;margin:0;">
            <p style="text-align:center; margin-bottom:1rem; color: var(--text-secondary);">
                Shows how many Copilot actions per user per month are needed to break even on the license cost at different price points.
            </p>
            <p style="text-align:center; margin-bottom:1rem; color: var(--text-secondary);">
                Actions per user per month required to reach each ROI target
                (at ${mpa} min/action, $${rate}/hr)
            </p>
            <table>
                <thead>
                    <tr><th>ROI Target</th>${beHeaders}</tr>
                </thead>
                <tbody>
                    ${beRow('Break-even (1x)', 1)}
                    ${beRow('2x Return', 2)}
                    ${beRow('5x Return', 5)}
                    ${beRow('10x Return', 10)}
                    <tr style="border-top: 2px solid var(--copilot-blue);">
                        <td><strong>Your Actual (avg)</strong></td>
                        ${priceTiers.map(t => `<td style="color: var(--green); font-weight: bold;">${(avgMonthly * valPerAction / t.price).toFixed(1)}x ROI</td>`).join('')}
                    </tr>
                </tbody>
            </table>
            <div class="info-box" style="margin-top:1rem;">
                <p><strong>Your users average ~${avgMonthly.toFixed(0)} actions/month</strong>, which
                ${avgMonthly > parseFloat(be(licenseCost)) ? 'exceeds' : 'is below'} break-even
                (${be(licenseCost)} actions) at the current $${licenseCost}/user/month rate.</p>
            </div>
        </div>
        `);

    // ---- USAGE TIER DISTRIBUTION ----
    // Sort teams by actions per user, split into super user report tiers
    const byActions = [...sortedTeams].sort((a, b) => b.actionsPerUser - a.actionsPerUser);
    const totalTeams = byActions.length;
    // Tier boundaries: Top 10%, 75-90%, 50-75%, 25-50%, Bottom 25%
    const tierDefs = [
        { name: 'Top 10%',    color: 'var(--green)',          start: 0,                                    end: Math.max(1, Math.round(totalTeams * 0.10)) },
        { name: '75-90%',     color: 'var(--copilot-cyan)',   start: Math.max(1, Math.round(totalTeams * 0.10)), end: Math.round(totalTeams * 0.25) },
        { name: '50-75%',     color: 'var(--copilot-blue)',   start: Math.round(totalTeams * 0.25),        end: Math.round(totalTeams * 0.50) },
        { name: '25-50%',     color: 'var(--copilot-orange)', start: Math.round(totalTeams * 0.50),        end: Math.round(totalTeams * 0.75) },
        { name: 'Bottom 25%', color: 'var(--red)',            start: Math.round(totalTeams * 0.75),        end: totalTeams },
    ];

    let tierRows = '';
    tierDefs.forEach(tier => {
        const slice = byActions.slice(tier.start, tier.end);
        if (slice.length === 0) return;

        const tierUsers = slice.reduce((s, t) => s + t.activeUsers, 0);
        const tierWeekly = slice.reduce((s, t) => s + t.weeklyActions, 0);
        const tierAvgWeekly = tierUsers > 0 ? tierWeekly / tierUsers : 0;
        const tierMonthly = tierAvgWeekly * 4.33;
        const tierMonthlyVal = slice.reduce((s, t) => s + t.monthlyValue, 0);
        const tierInvestment = tierUsers * licenseCost;
        const tierRoi = tierInvestment > 0 ? (tierMonthlyVal / tierInvestment).toFixed(1) : '0.0';

        tierRows += `<tr>
            <td><span style="color:${tier.color}; font-weight:700;">${tier.name}</span></td>
            <td>${tierUsers.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td>${tierMonthly.toFixed(0)}</td>
            <td>$${tierInvestment.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td>$${tierMonthlyVal.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td style="color: var(--green); font-weight: bold;">${tierRoi}x</td>
        </tr>`;
    });

    // Totals row — investment is based on all licensed users (you pay for every license)
    const totalTierInvestment = totalUsers * licenseCost;
    tierRows += `<tr style="border-top: 2px solid var(--copilot-blue); font-weight: 700;">
        <td>ALL USERS</td>
        <td>${activeUsers.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
        <td>${avgMonthly.toFixed(0)}</td>
        <td>$${totalTierInvestment.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
        <td>$${metrics.valuePerMonth.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
        <td style="color: var(--green);">${metrics.roiMultiple.toFixed(1)}x</td>
    </tr>`;

    const tierHtml = section('Usage Tier Value Distribution', `
        <div class="roi-table-container" style="box-shadow:none;border:none;padding:0;margin:0;">
            <p style="text-align:center; margin-bottom:1rem; color: var(--text-secondary);">
                ${uploadedData.groupLabel || 'Teams'} segmented into performance tiers by Copilot actions per user.
                Investment at $${licenseCost}/user/month.<br>
                <a href="https://jordankingisalive.github.io/CopilotROICalculator/Start%20Here.html" target="_blank" style="color: var(--copilot-cyan); font-weight: 600; text-decoration: none;">🚀 Explore the Adoption Journey to move users up tiers →</a>
            </p>
            <table>
                <thead>
                    <tr><th>User Tier ${tip('Users ranked by actions per user and grouped into percentile bands. Top 10% are your champions; Bottom 25% may need enablement support.')}</th><th>Active Users</th><th>Actions/Month ${tip('Average monthly Copilot actions per user in this tier.')}</th><th>Monthly Investment ${tip('Number of active users in this tier × license cost per month.')}</th><th>Monthly Value ${tip('Productivity value generated by this tier based on their actions and the configured time savings.')}</th><th>ROI ${tip('Monthly value ÷ monthly investment for this tier. Shows which user segments generate the most return.')}</th></tr>
                </thead>
                <tbody>${tierRows}</tbody>
            </table>
        </div>
        `);

    // ---- EXPANSION PROJECTION TABLE ----
    const scaledMonthly = metrics.valuePerMonth;
    const scaledAnnual = scaledMonthly * 12;
    const annualCost = metrics.annualCost;
    const currentActivation = activeUsers / totalUsers;
    const valuePerActiveUser = activeUsers > 0 ? scaledMonthly / activeUsers : 0;

    // Expansion scenarios modeled on increasing actions per user (network effects)
    // As more people use Copilot, shared prompts, templates, and culture drive higher per-user engagement
    const currentActionsPerUser = avgMonthly;
    const expansionScenarios = [
        { users: totalUsers, label: 'Current deployment', actionsMultiplier: 1.0, isCurrentRow: true },
        { users: Math.round(totalUsers * 2), label: null, actionsMultiplier: 1.10 },
        { users: Math.round(totalUsers * 5), label: null, actionsMultiplier: 1.25 },
        { users: Math.round(totalUsers * 10), label: null, actionsMultiplier: 1.40 },
        { users: Math.round(totalUsers * 20), label: null, actionsMultiplier: 1.55 },
    ];

    let projRows = '';
    expansionScenarios.forEach(s => {
        const actionsPerUser = currentActionsPerUser * s.actionsMultiplier;
        const totalMonthlyActions = actionsPerUser * s.users;
        const mv = (totalMonthlyActions * mpa / 60) * rate;
        const av = mv * 12;
        const ac = s.users * licenseCost * 12;
        const roi = ac > 0 ? (av / ac).toFixed(1) : '0.0';
        const label = s.label || `${s.users.toLocaleString(undefined, {maximumFractionDigits: 0})} users`;
        const rowStyle = s.isCurrentRow ? ' style="border-bottom: 2px solid var(--copilot-blue);"' : '';
        projRows += `<tr${rowStyle}>
            <td>${s.isCurrentRow ? '<strong>' + label + '</strong>' : label}</td>
            <td>${s.users.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td>${actionsPerUser.toFixed(0)}</td>
            <td>${totalMonthlyActions.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td>$${mv.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td>$${ac.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td style="color: var(--green); font-weight: bold;">${roi}x</td>
        </tr>`;
    });

    const avgMonthlyActions = avgMonthly.toFixed(0);

    const projHtml = section('Expansion Projections', `
        <div class="roi-table-container" style="box-shadow:none;border:none;padding:0;margin:0;">
            <p style="text-align:center; margin-bottom:1rem; color: var(--text-secondary);">
                Projected value as deployment scales. Per-user actions increase at larger scale due to network effects — more shared prompts, templates, and AI-fluent culture.
                Current avg: ${avgMonthlyActions} actions/user/mo at ${mpa} min/action, $${rate}/hr.
            </p>
            <table>
                <thead>
                    <tr><th>Scenario</th><th>Licensed Users</th><th>Actions/User/Mo ${tip('Average monthly Copilot actions per user. As more colleagues adopt Copilot, shared best practices, prompt libraries, and cultural momentum drive higher per-user engagement.')}</th><th>Total Actions/Mo</th><th>Monthly Value</th><th>Annual Cost ${tip('Total licensing cost per year = licensed users × license cost × 12 months.')}</th><th>ROI</th></tr>
                </thead>
                <tbody>${projRows}</tbody>
            </table>
            <div class="info-box" style="margin-top:1rem;">
                <p><strong>Why do actions per user increase at scale?</strong><br>
                Organizations with broader Copilot deployment see higher per-user engagement due to <strong>network effects</strong>: 
                shared prompt libraries, AI-first meeting culture, peer learning, and purpose-built workflows compound as more teams adopt. 
                Microsoft internal data shows mature deployments consistently outperform initial rollouts in per-user activity.</p>
                <p style="margin-top:0.75rem;"><strong>Need more detailed projections?</strong>
                Use the <a href="https://jordankingisalive.github.io/CopilotROICalculator/roi-calculator.html" target="_blank" style="color: var(--copilot-cyan); font-weight: 600;">ROI Calculator</a>
                to model custom user counts, pricing tiers, and engagement curves for your specific scenario.</p>
            </div>
        </div>
        `);

    // ---- UNLICENSED USER OPPORTUNITY COST ----
    const avgValuePerActiveUser = activeUsers > 0 ? metrics.valuePerMonth / activeUsers : 0;
    const unlicensedUsageFactor = 0.10;
    const unlicensedActionsPerMonth = avgMonthly * unlicensedUsageFactor;
    const valuePerUnlicensedUser = avgValuePerActiveUser * unlicensedUsageFactor;

    const opportunityHtml = section('Unlicensed User Opportunity Cost', `
        <div class="roi-table-container" style="box-shadow:none;border:none;padding:0;margin:0;">
            <p style="text-align:center; margin-bottom:1rem; color: var(--text-secondary);">
                Estimated productivity left on the table for employees without a Copilot license.<br>
                Assumes unlicensed users would adopt at <strong>10%</strong> of the current licensed-user average.
            </p>

            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 1.5rem;">
                <label style="font-size: 0.9rem; color: var(--text-secondary);">Show as:</label>
                <div style="display: inline-flex; border-radius: 8px; overflow: hidden; border: 1px solid var(--border);">
                    <button id="opp-view-value" onclick="setOppView('value')" style="padding: 6px 16px; font-size: 0.85rem; border: none; cursor: pointer; background: var(--copilot-blue); color: white; font-weight: 600;">Dollar Value</button>
                    <button id="opp-view-actions" onclick="setOppView('actions')" style="padding: 6px 16px; font-size: 0.85rem; border: none; cursor: pointer; background: var(--surface); color: var(--text-secondary);">Monthly Actions</button>
                </div>
            </div>

            <div style="max-width: 600px; margin: 0 auto 2rem;">
                <label style="display: block; text-align: center; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Unlicensed Seat Count</label>
                <input type="range" id="opp-slider" min="100" max="300000" step="100" value="1000"
                    style="width: 100%; accent-color: var(--copilot-blue);"
                    oninput="updateOppCost()">
                <div style="display: flex; justify-content: space-between; margin-top: 0.25rem;">
                    <small style="color: var(--text-secondary);">100</small>
                    <strong id="opp-slider-label" style="font-size: 1.1rem; color: var(--copilot-cyan);">1,000 users</strong>
                    <small style="color: var(--text-secondary);">300,000</small>
                </div>
            </div>

            <div class="metrics-grid" id="opp-metrics">
                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Licensing Cost / Mo ${tip('The monthly cost to license this many users for Copilot at the configured rate.')}</span></div>
                    <div class="metric-value" id="opp-licensing-cost">—</div>
                    <div class="metric-sublabel" id="opp-licensing-math"></div>
                </div>
                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row"><span id="opp-value-label">Potential Value / Mo</span> ${tip('The estimated monthly productivity value these users would generate at 10% of current licensed-user adoption.')}</span></div>
                    <div class="metric-value" id="opp-potential-value">—</div>
                    <div class="metric-sublabel" id="opp-value-math"></div>
                </div>
                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Net Gain / Mo ${tip('Potential value minus licensing cost. Green means the productivity gained exceeds the cost of licenses.')}</span></div>
                    <div class="metric-value" id="opp-net-gain">—</div>
                    <div class="metric-sublabel" id="opp-net-math"></div>
                </div>
                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Annual Opportunity ${tip('Net monthly gain × 12. This is the total dollar amount your organization leaves on the table each year by not licensing these users.')}</span></div>
                    <div class="metric-value" id="opp-annual">—</div>
                    <div class="metric-sublabel" id="opp-annual-math"></div>
                </div>
            </div>

            <div class="info-box" style="margin-top:1.5rem;">
                <p><strong>How is this calculated?</strong><br>
                Your current licensed users average <strong>${avgMonthly.toFixed(0)} actions/user/month</strong> worth <strong>$${avgValuePerActiveUser.toFixed(0)}/user/month</strong>.
                Unlicensed users are conservatively estimated at <strong>10% of that rate</strong>
                (~${unlicensedActionsPerMonth.toFixed(0)} actions/user/month, worth $${valuePerUnlicensedUser.toFixed(0)}/user/month),
                reflecting minimal initial adoption with no training or enablement.</p>
            </div>
        </div>
        `);

    // Store opportunity cost params globally so the slider/toggle can recalculate
    window._oppParams = {
        licenseCost: licenseCost,
        valuePerUser: valuePerUnlicensedUser,
        actionsPerUser: unlicensedActionsPerMonth,
        avgMonthly: avgMonthly,
        view: 'value'
    };

    // Initialize after render
    setTimeout(() => { if (document.getElementById('opp-slider')) updateOppCost(); }, 50);

    return breakEvenHtml + tierHtml + opportunityHtml + projHtml;
}

// Opportunity cost slider update
function updateOppCost() {
    const p = window._oppParams;
    if (!p) return;
    const count = parseInt(document.getElementById('opp-slider').value);
    const fmt = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

    document.getElementById('opp-slider-label').textContent = fmt(count) + ' users';

    const licensingCost = p.licenseCost * count;
    const potentialValue = p.valuePerUser * count;
    const netGain = potentialValue - licensingCost;
    const annual = netGain * 12;
    const totalActions = p.actionsPerUser * count;

    document.getElementById('opp-licensing-cost').textContent = '$' + fmt(licensingCost);
    document.getElementById('opp-licensing-math').textContent = fmt(count) + ' users × $' + p.licenseCost + '/mo';

    if (p.view === 'value') {
        document.getElementById('opp-value-label').textContent = 'Potential Value / Mo';
        document.getElementById('opp-potential-value').textContent = '$' + fmt(potentialValue);
        document.getElementById('opp-value-math').textContent = fmt(count) + ' × $' + fmt(Math.round(p.valuePerUser)) + '/user/mo';
        document.getElementById('opp-net-gain').textContent = '$' + fmt(netGain);
        document.getElementById('opp-net-gain').style.color = netGain >= 0 ? 'var(--green)' : 'var(--red)';
        document.getElementById('opp-net-math').textContent = '$' + fmt(potentialValue) + ' − $' + fmt(licensingCost);
        document.getElementById('opp-annual').textContent = '$' + fmt(annual);
        document.getElementById('opp-annual').style.color = annual >= 0 ? 'var(--green)' : 'var(--red)';
        document.getElementById('opp-annual-math').textContent = '$' + fmt(netGain) + ' × 12 months';
    } else {
        document.getElementById('opp-value-label').textContent = 'Total Actions / Mo';
        document.getElementById('opp-potential-value').textContent = fmt(totalActions);
        document.getElementById('opp-value-math').textContent = fmt(count) + ' × ' + fmt(Math.round(p.actionsPerUser)) + ' actions/user';
        document.getElementById('opp-net-gain').textContent = fmt(Math.round(p.actionsPerUser)) + '/user';
        document.getElementById('opp-net-gain').style.color = '';
        document.getElementById('opp-net-math').textContent = '10% of ' + fmt(Math.round(p.avgMonthly)) + ' avg actions';
        document.getElementById('opp-annual').textContent = fmt(totalActions * 12) + '/yr';
        document.getElementById('opp-annual').style.color = '';
        document.getElementById('opp-annual-math').textContent = fmt(totalActions) + ' × 12 months';
    }
}

function setOppView(view) {
    window._oppParams.view = view;
    document.getElementById('opp-view-value').style.background = view === 'value' ? 'var(--copilot-blue)' : 'var(--surface)';
    document.getElementById('opp-view-value').style.color = view === 'value' ? 'white' : 'var(--text-secondary)';
    document.getElementById('opp-view-actions').style.background = view === 'actions' ? 'var(--copilot-blue)' : 'var(--surface)';
    document.getElementById('opp-view-actions').style.color = view === 'actions' ? 'white' : 'var(--text-secondary)';
    updateOppCost();
}

// Render results page
function renderResults() {
    const metrics = calculateMetrics(uploadedData);
    const rows = uploadedData.rows;

    // Calculate Intelligent Recap values
    const INTELLIGENT_RECAP_HOURS_PER_ACTION = 0.5; // 30 minutes median meeting duration
    const recapHoursSaved = config.intelligentRecapActions * INTELLIGENT_RECAP_HOURS_PER_ACTION;
    const recapMonthlyValue = recapHoursSaved * config.professionalRate;
    const recapAnnualValue = recapMonthlyValue * 12;

    // Calculate values with Intelligent Recap
    const valuePerMonthWithRecap = metrics.valuePerMonth + recapMonthlyValue;
    const annualValueWithRecap = metrics.annualValue + recapAnnualValue;
    const roiMultipleWithRecap = valuePerMonthWithRecap / metrics.monthlyCost;

    const showRecap = config.intelligentRecapActions > 0;

    // Sort teams by monthly value using configured minutes per action
    const sortedTeams = rows.map(row => {
        const monthlyValue = (row.monthlyActions * config.minutesPerAction / 60) * config.professionalRate;
        const weeklyHours = (row.weeklyActions * config.minutesPerAction / 60);

        // Find peak performance week for this team
        let peakWeek = null;
        let peakActionsPerUser = row.actionsPerUser;

        if (uploadedData.weeklyData && uploadedData.weeklyData[row.team]) {
            const weeklyData = uploadedData.weeklyData[row.team];
            if (weeklyData.length > 0) {
                // Find the week with highest actionsPerUser
                const peak = weeklyData.reduce((max, week) =>
                    week.actionsPerUser > max.actionsPerUser ? week : max
                , weeklyData[0]);

                peakWeek = peak.date;
                peakActionsPerUser = peak.actionsPerUser;
            }
        }

        return {
            ...row,
            monthlyValue,
            weeklyHours,
            peakWeek,
            peakActionsPerUser
        };
    }).sort((a, b) => b.monthlyValue - a.monthlyValue);

    const html = `
        <div class="results-container">
            <header>
                <h1>M365 Copilot Productivity ROI Analysis Results</h1>
                <p class="subtitle">Based on ${rows.length} ${uploadedData.groupLabel || 'teams'} • ${config.analysisWeeks} weeks of data${uploadedData.dateRange ? ` (${uploadedData.dateRange})` : ''}</p>
                <p style="margin-top: 0.5rem;"><a href="https://aka.ms/Analytics-Hub" target="_blank" style="color: var(--copilot-cyan); font-weight: 600; text-decoration: none; font-size: 0.95rem;">📊 View more reports on the Analytics Hub →</a></p>
            </header>

            ${showRecap ? `
            <!-- Intelligent Recap Toggle -->
            <div class="recap-toggle-container" id="recapToggleContainer" style="display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 8px; margin: 1.5rem 0; border: 2px solid var(--copilot-blue);">
                <span class="recap-toggle-label" style="font-weight: 600; color: var(--dark-blue); font-size: 1rem;">Include Intelligent Recap in ROI:</span>
                <label class="toggle-switch" style="position: relative; display: inline-block; width: 60px; height: 30px;">
                    <input type="checkbox" id="recapToggleData" checked onchange="toggleRecapDisplayData()" style="opacity: 0; width: 0; height: 0;">
                    <span class="toggle-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--copilot-blue); transition: 0.4s; border-radius: 30px;"></span>
                </label>
                <span class="recap-toggle-label" id="recapToggleStatusData" style="font-weight: 600; color: var(--dark-blue); font-size: 1rem;">Included</span>
            </div>

            <!-- Intelligent Recap Value Display -->
            <div class="recap-value-box" id="recapValueBoxData" style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border: 2px solid var(--copilot-blue); border-radius: 12px; padding: 1.5rem; margin: 1rem 0; text-align: center;">
                <h4 style="color: var(--copilot-blue); margin-bottom: 0.5rem; font-size: 0.95rem;">💡 Intelligent Recap Additional Value</h4>
                <div class="value" style="font-size: 2rem; font-weight: bold; color: var(--dark-blue);">$${recapMonthlyValue.toLocaleString(undefined, {maximumFractionDigits: 2})}/mo</div>
                <small>${config.intelligentRecapActions.toLocaleString(undefined, {maximumFractionDigits: 2})} actions × 0.5 hours each = ${recapHoursSaved.toLocaleString(undefined, {maximumFractionDigits: 2})} hours/mo</small>
            </div>
            ` : ''}

            ${section('Key Metrics', `<div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Enabled Users <span class="info-tip"><span class="info-icon">?</span><span class="tip-text">The total number of people in your organization who have been assigned a Microsoft 365 Copilot license.</span></span></span></div>
                    <div class="metric-value">${metrics.totalEnabledUsers.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div class="metric-sublabel">Licensed for Copilot</div>
                </div>

                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Super User Rate <span class="info-tip"><span class="info-icon">?</span><span class="tip-text">The percentage of licensed users classified as Super Users — averaging 20+ weekly Copilot actions with consistent usage in at least 9 of the past 12 weeks. These are your AI champions.</span></span></span></div>
                    <div class="metric-value">${metrics.powerUserRate.toFixed(1)}%</div>
                    <div class="metric-sublabel">${metrics.powerUsers.toLocaleString(undefined, {maximumFractionDigits: 0})} super users</div>
                </div>

                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Weekly Actions per User <span class="info-tip"><span class="info-icon">?</span><span class="tip-text">The average number of Copilot actions each active user performs per week — things like accepting a suggestion, using Copilot chat, or generating a summary.</span></span></span></div>
                    <div class="metric-value">${metrics.avgActionsPerUser.toFixed(1)}</div>
                    <div class="metric-sublabel">${metrics.totalWeeklyActions.toLocaleString(undefined, {maximumFractionDigits: 0})} total/week</div>
                </div>

                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Weekly Hours Saved <span class="info-tip"><span class="info-icon">?</span><span class="tip-text">Estimated time saved per week across all users. Calculated by multiplying total weekly Copilot actions by the configured minutes saved per action, then converting to hours.</span></span></span></div>
                    <div class="metric-value">${metrics.weeklyHoursSaved.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div class="metric-sublabel">${metrics.totalWeeklyActions.toLocaleString(undefined, {maximumFractionDigits: 0})} actions × ${config.minutesPerAction} min ÷ 60</div>
                </div>
            </div>

            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">WAU (Weekly Active Users) ${tip('The number of unique users who performed at least one Copilot action in the most recent week.')}</span></div>
                    <div class="metric-value">${metrics.totalActiveUsers.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div class="metric-sublabel">${(metrics.totalActiveUsers / metrics.totalEnabledUsers * 100).toFixed(1)}% of ${metrics.totalEnabledUsers.toLocaleString(undefined, {maximumFractionDigits: 0})} licensed</div>
                </div>

                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Monthly Actions/User ${tip('Average monthly Copilot actions per active user. This is the key engagement depth metric — higher means users are integrating Copilot into more workflows.')}</span></div>
                    <div class="metric-value">${(metrics.avgActionsPerUser * 4.33).toFixed(0)}</div>
                    <div class="metric-sublabel">${metrics.avgActionsPerUser.toFixed(1)}/wk × 4.33</div>
                </div>

                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Weekly Productivity Value ${tip('The estimated dollar value of time saved each week. Calculated as: total weekly actions × minutes per action ÷ 60 × hourly rate.')}</span></div>
                    <div class="metric-value">$${(metrics.valuePerMonth / 4.33).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div class="metric-sublabel">${metrics.totalWeeklyActions.toLocaleString(undefined, {maximumFractionDigits: 0})} actions × ${config.minutesPerAction} min × $${config.professionalRate}/hr</div>
                </div>

                <div class="metric-card">
                    <div class="metric-label"><span class="metric-label-row">Monthly Productivity Value ${tip('Weekly productivity value × 4.33 (average weeks per month). This is the headline number — the total dollar value Copilot generates each month for your organization.')}</span></div>
                    <div class="metric-value">$${metrics.valuePerMonth.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div class="metric-sublabel">$${(metrics.valuePerMonth / 4.33).toLocaleString(undefined, {maximumFractionDigits: 0})}/wk × 4.33 = ${metrics.roiMultiple.toFixed(1)}x ROI</div>
                </div>
            </div>
            `)}<!-- end Key Metrics -->

            ${section('Productivity ROI Calculation', `<div class="roi-table-container" style="box-shadow:none;border:none;padding:0;margin:0;">
                <table>
                    <thead>
                        <tr>
                            <th>Time Savings Assumption ${tip('The number of minutes each Copilot action is estimated to save. Default is 6 minutes based on Microsoft research. You can adjust this in the config.')}</th>
                            <th>Hours/Month ${tip('Total actions per month × minutes per action ÷ 60. This is the raw time saved across all users.')}</th>
                            <th>Monthly Value ${tip('Hours saved × professional hourly rate. Represents the dollar value of employee time reclaimed by Copilot.')}</th>
                            <th>Annual Value ${tip('Monthly value × 12. The projected yearly productivity gain.')}</th>
                            <th>Monthly ROI Multiple ${tip('Monthly productivity value ÷ monthly license cost. A 3x ROI means every $1 spent on licenses generates $3 in productivity value.')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="highlight-row">
                            <td><strong>${metrics.minsPerAction} minutes per action</strong><br><small>Configurable setting</small></td>
                            <td>${metrics.hoursPerMonth.toLocaleString(undefined, {maximumFractionDigits: 2})} hrs</td>
                            <td id="dataMonthlyValue"
                                data-without-recap="$${metrics.valuePerMonth.toLocaleString(undefined, {maximumFractionDigits: 2})}"
                                data-with-recap="$${valuePerMonthWithRecap.toLocaleString(undefined, {maximumFractionDigits: 2})}">
                                ${showRecap ? `$${valuePerMonthWithRecap.toLocaleString(undefined, {maximumFractionDigits: 2})}` : `$${metrics.valuePerMonth.toLocaleString(undefined, {maximumFractionDigits: 2})}`}
                            </td>
                            <td id="dataAnnualValue"
                                data-without-recap="$${metrics.annualValue.toLocaleString(undefined, {maximumFractionDigits: 2})}"
                                data-with-recap="$${annualValueWithRecap.toLocaleString(undefined, {maximumFractionDigits: 2})}">
                                ${showRecap ? `$${annualValueWithRecap.toLocaleString(undefined, {maximumFractionDigits: 2})}` : `$${metrics.annualValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`}
                            </td>
                            <td id="dataROIMultiple" style="color: var(--green); font-weight: bold;"
                                data-without-recap="${metrics.roiMultiple.toFixed(1)}x"
                                data-with-recap="${roiMultipleWithRecap.toFixed(1)}x">
                                ${showRecap ? `${roiMultipleWithRecap.toFixed(1)}x` : `${metrics.roiMultiple.toFixed(1)}x`}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5" style="background: var(--light-gray); padding: 1rem;">
                                <strong>Investment:</strong> $${metrics.monthlyCost.toLocaleString(undefined, {maximumFractionDigits: 0})}/month
                                ($${metrics.annualCost.toLocaleString(undefined, {maximumFractionDigits: 0})}/year) for ${metrics.totalEnabledUsers.toLocaleString(undefined, {maximumFractionDigits: 0})} licenses at $${config.licenseCost}/user/month<br>
                                <strong>Professional Rate:</strong> $${config.professionalRate}/hour (fully-loaded cost)<br>
                                <strong>Calculation:</strong> ${metrics.totalMonthlyActions.toLocaleString(undefined, {maximumFractionDigits: 0})} monthly actions × ${metrics.minsPerAction} min ÷ 60 × $${config.professionalRate}/hr = $${metrics.valuePerMonth.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                ${showRecap ? `<br><strong>Intelligent Recap:</strong> ${config.intelligentRecapActions.toLocaleString(undefined, {maximumFractionDigits: 0})} actions × 0.5 hrs × $${config.professionalRate}/hr = $${recapMonthlyValue.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo` : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `)}<!-- end Productivity ROI -->

            ${section('Top 10 by Value Generated', `<div class="roi-table-container" style="box-shadow:none;border:none;padding:0;margin:0;">
                <p style="text-align:center; margin-bottom:1rem; color: var(--text-secondary); font-size: 0.9rem;">Monthly value = weekly actions × ${config.minutesPerAction} min/action ÷ 60 × $${config.professionalRate}/hr × 4.33 weeks</p>
                <table>
                    <thead>
                        <tr><th>#</th><th>${uploadedData.groupLabel || 'Team'}</th><th>Active Users</th><th>Super Users</th><th>Actions/User</th><th>Monthly Value</th><th>Hrs/Week</th></tr>
                    </thead>
                    <tbody>
                        ${sortedTeams.slice(0, 10).map((team, index) => `
                        <tr>
                            <td style="color: var(--copilot-cyan); font-weight: 700; font-size: 1.1rem;">${index + 1}</td>
                            <td style="font-weight: 600;">${team.team}</td>
                            <td>${team.activeUsers.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                            <td>${team.powerUsers}</td>
                            <td>${team.actionsPerUser.toFixed(1)}</td>
                            <td style="color: var(--green); font-weight: 700;">$${team.monthlyValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                            <td>${team.weeklyHours.toFixed(0)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
            `)}<!-- end Top 10 -->

            ${section('All ' + (uploadedData.groupLabel || 'Teams') + ' Performance', `<div class="leaderboard-container" style="box-shadow:none;border:none;padding:0;margin:0;">
                <table id="teamsTable" class="sortable-table">
                    <thead>
                        <tr>
                            <th class="sortable" data-column="team" data-type="string">
                                ${uploadedData.groupLabel || 'Team/Division'} <span class="sort-icon"></span>
                            </th>
                            <th class="sortable" data-column="activeUsers" data-type="number">
                                Active Users <span class="sort-icon"></span>
                            </th>
                            <th class="sortable" data-column="powerUsers" data-type="number">
                                Super Users <span class="sort-icon"></span>
                            </th>
                            <th class="sortable" data-column="weeklyActions" data-type="number">
                                Weekly Actions <span class="sort-icon"></span>
                            </th>
                            <th class="sortable" data-column="actionsPerUser" data-type="number">
                                Actions/User <span class="sort-icon"></span>
                            </th>
                            <th class="sortable" data-column="peakWeek" data-type="date">
                                Peak Performance Week <span class="sort-icon"></span>
                            </th>
                            <th class="sortable" data-column="weeklyHours" data-type="number">
                                Weekly Hours <span class="sort-icon"></span>
                            </th>
                            <th class="sortable" data-column="monthlyValue" data-type="number">
                                Monthly Value <span class="sort-icon"></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="teamsTableBody">
                        ${sortedTeams.map(team => {
                            const peakWeekDisplay = team.peakWeek
                                ? `${(team.peakWeek.getMonth() + 1).toString().padStart(2, '0')}/${team.peakWeek.getDate().toString().padStart(2, '0')}/${team.peakWeek.getFullYear()} (${team.peakActionsPerUser.toFixed(1)})`
                                : 'N/A';

                            return `
                            <tr>
                                <td data-value="${team.team}">${team.team}</td>
                                <td data-value="${team.activeUsers}">${team.activeUsers.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                <td data-value="${team.powerUsers}">${team.powerUsers}</td>
                                <td data-value="${team.weeklyActions}">${team.weeklyActions.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                <td data-value="${team.actionsPerUser}">${team.actionsPerUser.toFixed(1)}</td>
                                <td data-value="${team.peakWeek ? team.peakWeek.getTime() : 0}">${peakWeekDisplay}</td>
                                <td data-value="${team.weeklyHours}">${team.weeklyHours.toFixed(0)}</td>
                                <td data-value="${team.monthlyValue}"><strong>$${team.monthlyValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
            `)}<!-- end All Teams -->

            ${buildProjectionTables(metrics, sortedTeams)}

            ${section('Calculation Methodology', `<div class="info-box" style="margin-top: 0;">
                <strong>Calculation Methodology</strong>
                <p>
                    • <strong>Time savings:</strong> ${metrics.minsPerAction} minutes saved per Copilot action (adjustable 1-15 min)<br>
                    • <strong>Professional rate:</strong> $${config.professionalRate}/hour fully-loaded cost (salary + benefits + overhead)<br>
                    • <strong>Analysis period:</strong> ${config.analysisWeeks} weeks of actual usage data<br>
                    • <strong>Productivity ROI Multiple:</strong> Monthly productivity value ÷ monthly license cost<br>
                    • <strong>Reference:</strong> Microsoft research suggests 6 min average; adjust based on your use cases<br>
                    • All data processed locally in your browser - no data transmitted to servers
                </p>
            </div>
            `)}<!-- end Methodology -->

            ${section('Glossary', `
            <table class="glossary-table">
                <tbody>
                    <tr><td><strong>Activation Rate</strong></td><td>The percentage of licensed users who have used Copilot at least once. A high activation rate means licenses are not going unused.</td></tr>
                    <tr><td><strong>Active User</strong></td><td>A user who performed at least one Copilot action during the reporting period (typically one week).</td></tr>
                    <tr><td><strong>Adoption Rate</strong></td><td>The percentage of licensed users who are actively using Copilot on an ongoing basis. Unlike activation, adoption reflects sustained usage over time.</td></tr>
                    <tr><td><strong>Copilot Action</strong></td><td>Any discrete interaction with Microsoft 365 Copilot — e.g., accepting a suggested edit, using Copilot Chat, generating a summary, drafting an email, or creating a presentation outline.</td></tr>
                    <tr><td><strong>Enabled User</strong></td><td>An employee who has been assigned a Microsoft 365 Copilot license, whether or not they have used it.</td></tr>
                    <tr><td><strong>Expansion Projection</strong></td><td>A modeled estimate of ROI at larger deployment scales, using increasing per-user actions to reflect network effects as more employees adopt Copilot.</td></tr>
                    <tr><td><strong>Fully-Loaded Cost</strong></td><td>The true cost of an employee hour including salary, benefits, taxes, and overhead — not just base pay. Used as the "professional rate" in ROI calculations.</td></tr>
                    <tr><td><strong>Intelligent Recap</strong></td><td>A Copilot feature that automatically summarizes Teams meetings, extracting key decisions, action items, and discussion topics so attendees (and non-attendees) save time on meeting follow-up.</td></tr>
                    <tr><td><strong>MAU (Monthly Active Users)</strong></td><td>The count of unique users who performed at least one Copilot action in the past 28 days.</td></tr>
                    <tr><td><strong>Minutes per Action</strong></td><td>The estimated time saved each time a user completes a Copilot action. Default is 6 minutes based on Microsoft research; adjustable to reflect your organization's experience.</td></tr>
                    <tr><td><strong>Opportunity Cost</strong></td><td>The productivity value your organization forgoes by not licensing additional users. Calculated at a conservative 10% of current licensed-user adoption rates.</td></tr>
                    <tr><td><strong>Productivity Value</strong></td><td>The dollar value of time saved, calculated as: number of actions × minutes per action ÷ 60 × professional hourly rate.</td></tr>
                    <tr><td><strong>ROI Multiple</strong></td><td>Monthly productivity value divided by monthly license cost. An ROI of 3.0x means every $1 spent on Copilot licenses returns $3 in estimated productivity value.</td></tr>
                    <tr><td><strong>Super User</strong></td><td>A user averaging 20+ weekly Copilot actions with consistent usage in at least 9 of the past 12 weeks. Super Users are both high-volume and habitual — your AI champions who drive peer adoption and can be leveraged for internal enablement.</td></tr>
                    <tr><td><strong>Super User Rate</strong></td><td>The percentage of all licensed users classified as Super Users.</td></tr>
                    <tr><td><strong>Super Usage Report</strong></td><td>A Power BI report (<a href="https://aka.ms/decodingsuperusage" target="_blank" style="color:var(--copilot-cyan);">aka.ms/decodingsuperusage</a>) that provides a heatmap view of Copilot usage across your organization, broken out by team/division.</td></tr>
                    <tr><td><strong>Usage Tier</strong></td><td>A percentile band (Top 10%, 75-90%, etc.) that groups teams by their average Copilot actions per user, helping identify champions and teams that need enablement.</td></tr>
                    <tr><td><strong>WAU (Weekly Active Users)</strong></td><td>The count of unique users who performed at least one Copilot action in the most recent week.</td></tr>
                </tbody>
            </table>
            `)}<!-- end Glossary -->

            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-primary" onclick="location.reload()">Analyze Another File</button>
            </div>
        </div>
    `;

    var loadingEl = document.getElementById('loadingState');
    if (loadingEl) loadingEl.style.display = 'none';
    document.querySelector('.container').innerHTML = html;
    resultsDisplayed = true;

    // Initialize table sorting after rendering
    initTableSorting();
}

// Initialize table sorting functionality
function initTableSorting() {
    const table = document.getElementById('teamsTable');
    if (!table) return;

    const headers = table.querySelectorAll('th.sortable');
    let currentSort = { column: null, direction: 'asc' };

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            const type = header.getAttribute('data-type');

            // Toggle direction if clicking same column, otherwise default to desc
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.direction = 'desc';
            }
            currentSort.column = column;

            // Sort the table
            sortTable(column, type, currentSort.direction);

            // Update visual indicators
            headers.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
                const icon = h.querySelector('.sort-icon');
                icon.textContent = '';
            });

            header.classList.add(`sort-${currentSort.direction}`);
            const icon = header.querySelector('.sort-icon');
            icon.textContent = currentSort.direction === 'asc' ? ' ▲' : ' ▼';
        });
    });
}

// Sort table by column
function sortTable(column, type, direction) {
    const tbody = document.getElementById('teamsTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aCell = a.querySelector(`td[data-value]`);
        const bCell = b.querySelector(`td[data-value]`);

        // Get the data-value attributes based on column position
        const columnIndex = getColumnIndex(column);
        const aValue = a.children[columnIndex].getAttribute('data-value');
        const bValue = b.children[columnIndex].getAttribute('data-value');

        let comparison = 0;

        if (type === 'number' || type === 'date') {
            const aNum = parseFloat(aValue) || 0;
            const bNum = parseFloat(bValue) || 0;
            comparison = aNum - bNum;
        } else {
            // string comparison
            comparison = aValue.localeCompare(bValue);
        }

        return direction === 'asc' ? comparison : -comparison;
    });

    // Re-append rows in sorted order
    rows.forEach(row => tbody.appendChild(row));
}

// Get column index from column name
function getColumnIndex(column) {
    const columnMap = {
        'team': 0,
        'activeUsers': 1,
        'powerUsers': 2,
        'weeklyActions': 3,
        'actionsPerUser': 4,
        'peakWeek': 5,
        'weeklyHours': 6,
        'monthlyValue': 7
    };
    return columnMap[column] || 0;
}

// Show loading state
function showLoading() {
    document.querySelector('.instructions-section').style.display = 'none';
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
}

// Show error state
function showError(message) {
    document.querySelector('.instructions-section').style.display = 'none';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

// Toggle Intelligent Recap display for Data Analysis
function toggleRecapDisplayData() {
    const toggle = document.getElementById('recapToggleData');
    const statusText = document.getElementById('recapToggleStatusData');
    const isIncluded = toggle.checked;

    // Update status text
    statusText.textContent = isIncluded ? 'Included' : 'Excluded';

    // Get all elements that need updating
    const elementsToUpdate = [
        'dataMonthlyValue',
        'dataAnnualValue',
        'dataROIMultiple'
    ];

    // Update each element based on toggle state
    elementsToUpdate.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const valueToShow = isIncluded ?
                element.getAttribute('data-with-recap') :
                element.getAttribute('data-without-recap');
            element.textContent = valueToShow;
        }
    });
}
