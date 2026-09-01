@echo off
REM 🎬 SAMMYLOVE DOWNLOADER - ONE-CLICK INSTALLER FOR WINDOWS
REM This script sets up the entire app with all features and monetization
REM Just double-click this file or run it in Command Prompt

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║    🎬 SAMMYLOVE - COMPLETE APP INSTALLER 🎬       ║
echo ║  One command to build everything you need!        ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found!
    echo.
    echo Install Node.js from: https://nodejs.org
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo ✅ npm found:
npm --version

echo.
echo 📦 Installing all dependencies...
call npm install

echo.
echo 🎬 Installing yt-dlp (video downloader)...
echo.
echo Checking if Python is installed...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! 
    echo.
    echo Please install Python from: https://www.python.org
    echo Make sure to check "Add Python to PATH" during installation
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Python found:
python --version

echo.
echo Installing yt-dlp via pip...
pip install --upgrade yt-dlp

echo.
echo ⚙️  Setting up configuration...
if not exist ".env" (
    copy .env.example .env >nul
    echo ✅ Created .env file (update with your API keys later)
) else (
    echo ✅ .env file already exists
)

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║  ✅ INSTALLATION COMPLETE!                         ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo 📝 NEXT STEPS:
echo.
echo 1️⃣  Start the app:
echo    npm start
echo.
echo 2️⃣  Open in browser:
echo    http://localhost:3000
echo.
echo 3️⃣  To make money, add API keys to .env:
echo    notepad .env
echo.
echo 📖 Learn more:
echo    - Setup: type QUICK_START.md
echo    - Monetization: type MONETIZATION_SETUP.md
echo    - Deploy: type DEPLOYMENT_GUIDE.md
echo.
echo 🚀 Ready? Run: npm start
echo.
pause
