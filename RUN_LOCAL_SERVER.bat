@echo off
echo ========================================
echo  M365 Copilot ROI Calculator
echo  Local Server Launcher
echo ========================================
echo.
echo Starting local web server...
echo.
echo The calculator will open in your browser at:
echo http://localhost:8000
echo.
echo Keep this window open while using the calculator.
echo Press Ctrl+C to stop the server when done.
echo.
echo ========================================
echo.

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting with Python...
    start http://localhost:8000/index.html
    python -m http.server 8000
    goto :end
)

REM Try Python 2
python2 -m SimpleHTTPServer 8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting with Python 2...
    start http://localhost:8000/index.html
    python2 -m SimpleHTTPServer 8000
    goto :end
)

REM If no Python, show error
echo ERROR: Python is not installed or not in PATH
echo.
echo Please install Python from: https://www.python.org/downloads/
echo Or open index.html directly in your browser (limited functionality)
echo.
pause
exit /b 1

:end
exit /b 0
