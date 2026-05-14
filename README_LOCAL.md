# M365 Copilot ROI Calculator - Local Version

## 🚀 Quick Start

**Windows Users:**
1. Double-click `RUN_LOCAL_SERVER.bat`
2. Your browser will automatically open the calculator
3. Keep the terminal window open while using the app
4. Press `Ctrl+C` in the terminal to stop when done

**Mac/Linux Users:**
1. Open Terminal in this folder
2. Run: `bash RUN_LOCAL_SERVER.sh`
3. Your browser will automatically open the calculator
4. Keep the terminal window open while using the app
5. Press `Ctrl+C` in the terminal to stop when done

## 📋 Requirements

- **Python** (version 2.7+ or 3.x) - Usually pre-installed on Mac/Linux
- **Web Browser** (Chrome, Edge, Firefox, or Safari)

### Checking if Python is Installed

**Windows:**
```cmd
python --version
```

**Mac/Linux:**
```bash
python3 --version
```

### Installing Python (if needed)

Download from: https://www.python.org/downloads/

**Windows Installation Note:** Make sure to check "Add Python to PATH" during installation!

## 🔒 Security & Privacy

Running locally ensures:
- ✅ **No internet connection required** after download
- ✅ **Your data stays on your computer** - never sent anywhere
- ✅ **Complete privacy** - no tracking, no analytics
- ✅ **Offline functionality** - works without network access
- ✅ **Full control** - you can inspect all source code

## 📁 What's Included

```
📦 ROI Calculator Package
├── 📄 index.html              - Full Data Analysis view
├── 📄 roi-calculator.html     - ROI Calculator view
├── 📄 Start Here.html         - Adoption Journey view
├── 📄 script.js               - Main application logic
├── 📄 sales-script.js         - Sales support features
├── 📄 styles.css              - Application styling
├── 📄 sample-data.csv         - Example data file
├── � README_LOCAL.md         - This file
├── 📄 LICENSE                 - Software license
├── 📄 PRIVACY.md              - Privacy policy & data handling
├── 🔧 RUN_LOCAL_SERVER.bat   - Windows launcher
├── 🔧 RUN_LOCAL_SERVER.sh    - Mac/Linux launcher
└── 📁 lib/                    - Required libraries
    ├── jszip.min.js           - ZIP file creation
    ├── docx.umd.js            - Word document generation
    ├── html2canvas.min.js     - Screenshot capture
    ├── jspdf.umd.min.js       - PDF generation
    └── pptxgen.bundle.js      - PowerPoint generation
```

## 🆘 Troubleshooting

### Browser doesn't open automatically?
Manually open: http://localhost:8000/index.html

### Port 8000 already in use?
1. Close the existing server (press Ctrl+C)
2. Or change the port in the launcher script to 8001, 8080, etc.

### Python not found?
- **Windows:** Ensure Python is added to PATH during installation
- **Mac/Linux:** Try `python3 --version` instead of `python --version`

### Files not working properly?
Make sure all files are in the same folder and the `lib/` folder contains all libraries.

### Getting CORS errors?
You **must** use the local server launcher - opening `index.html` directly in the browser will have limited functionality due to browser security restrictions.

## 💡 Usage Tips

1. **Upload Your Data:** Use the CSV upload feature to analyze your organization's Copilot usage
2. **Sample Data:** Try the sample data first to see how it works
3. **Export Options:** Generate PDF reports, PowerPoint presentations, or Word documents
4. **Privacy:** All processing happens in your browser - no data is uploaded anywhere

## 🔄 Updates

To get the latest version:
1. Download the newest package from the website
2. Extract and replace your local files
3. Your data files are separate and won't be affected

## 📧 Support

For questions or issues:
- Visit the Analytics Hub: https://aka.ms/Analytics-Hub
- Check the online documentation
- Review the in-app help sections

## 📄 License

See LICENSE file for details.

---

**Enjoy secure, offline ROI calculations! 🎉**
