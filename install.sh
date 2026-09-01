#!/bin/bash

# 🎬 SAMMYLOVE DOWNLOADER - ONE-CLICK INSTALLER
# This script sets up the entire app with all features and monetization
# Just run: bash install.sh

set -e

echo "╔════════════════════════════════════════════════════╗"
echo "║    🎬 SAMMYLOVE - COMPLETE APP INSTALLER 🎬       ║"
echo "║  One command to build everything you need!        ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Check if in sammylove directory
if [ ! -f "package.json" ]; then
    echo "📦 Cloning Sammylove repository..."
    git clone https://github.com/abolajisammyemmy-dev/sammylove-downloader.git
    cd sammylove-downloader
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎬 Installing yt-dlp (video downloader)..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install yt-dlp
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo apt-get update
    sudo apt-get install -y yt-dlp
elif [[ "$OSTYPE" == "msys" ]]; then
    # Windows
    echo "Windows detected. Please install yt-dlp manually:"
    echo "  pip install yt-dlp"
    echo ""
fi

echo ""
echo "⚙️  Setting up configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file (update with your API keys later)"
fi

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  ✅ INSTALLATION COMPLETE!                         ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "📝 NEXT STEPS:"
echo ""
echo "1️⃣  Start the app:"
echo "   npm start"
echo ""
echo "2️⃣  Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "3️⃣  To make money, add API keys to .env:"
echo "   nano .env"
echo ""
echo "📖 Learn more:"
echo "   - Setup: cat QUICK_START.md"
echo "   - Monetization: cat MONETIZATION_SETUP.md"
echo "   - Deploy: cat DEPLOYMENT_GUIDE.md"
echo ""
echo "🚀 Ready? Run: npm start"
echo ""
