#!/bin/bash
echo "========================================"
echo " M365 Copilot ROI Calculator"
echo " Local Server Launcher"
echo "========================================"
echo ""
echo "Starting local web server..."
echo ""
echo "The calculator will open in your browser at:"
echo "http://localhost:8000"
echo ""
echo "Keep this window open while using the calculator."
echo "Press Ctrl+C to stop the server when done."
echo ""
echo "========================================"
echo ""

# Try Python 3 first
if command -v python3 &> /dev/null; then
    echo "Starting with Python 3..."
    # Open browser based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8000/index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open http://localhost:8000/index.html 2>/dev/null || echo "Please open http://localhost:8000/index.html in your browser"
    fi
    python3 -m http.server 8000
    exit 0
fi

# Try Python 2
if command -v python &> /dev/null; then
    echo "Starting with Python..."
    # Open browser based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8000/index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open http://localhost:8000/index.html 2>/dev/null || echo "Please open http://localhost:8000/index.html in your browser"
    fi
    python -m http.server 8000 2>/dev/null || python -m SimpleHTTPServer 8000
    exit 0
fi

# If no Python, show error
echo "ERROR: Python is not installed or not in PATH"
echo ""
echo "Please install Python from: https://www.python.org/downloads/"
echo "Or open index.html directly in your browser (limited functionality)"
echo ""
read -p "Press Enter to exit..."
exit 1
