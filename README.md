# 🎬 Sammylove - Professional Social Media Video Downloader

[![Node.js](https://img.shields.io/badge/Node.js-14+-green)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()

**Sammylove** is a professional, monetized social media video downloader that supports TikTok, Instagram, Facebook, YouTube, Twitter/X, and Snapchat with automatic watermark removal.

## 📋 Features

✅ **Multi-Platform Support**
- TikTok
- Instagram
- Facebook
- YouTube
- Twitter/X
- Snapchat

✅ **Core Features**
- 🎥 Watermark-free downloads
- ⚡ Lightning-fast processing
- 🔒 Secure and private
- 📱 Responsive mobile design
- 🛡️ Rate limiting & security
- 📊 Download analytics
- 💾 Auto file cleanup

✅ **Monetization Features**
- 💰 Google AdSense integration
- 🎯 Adsterra ads
- 💳 Premium subscriptions (Stripe)
- 👥 Referral program
- 📈 Revenue tracking
- 📊 Analytics dashboard

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js >= 14.0.0
- npm >= 6.0.0
- yt-dlp (for video downloading)
- MongoDB (for user data & analytics)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abolajisammyemmy-dev/sammylove-downloader.git
cd sammylove-downloader
```

2. **Install dependencies**
```bash
npm install
```

3. **Install yt-dlp**
```bash
# Ubuntu/Debian
sudo apt-get install yt-dlp

# macOS
brew install yt-dlp

# Windows (via Python pip)
pip install yt-dlp
```

4. **Configure environment**
```bash
cp .env.example .env
```

5. **Edit .env file with your credentials**
```bash
nano .env
```

6. **Start the server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

7. **Access the app**
```
http://localhost:3000
```

## 💰 Monetization Setup

### 1. Google AdSense
1. Sign up at [Google AdSense](https://adsense.google.com)
2. Get your Client ID and Slot ID
3. Add to `.env`:
```env
ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
ADSENSE_SLOT_ID=1234567890
```

### 2. Adsterra (Best for Video Sites)
1. Sign up at [Adsterra](https://adsterra.com?ref=256044)
2. Create a zone for your website
3. Add to `.env`:
```env
ADSTERRA_ZONE_ID=your_zone_id
ADSTERRA_PUBLISHER_ID=your_publisher_id
```

### 3. Stripe (Premium Features)
1. Create account at [Stripe](https://stripe.com)
2. Get your API keys
3. Add to `.env`:
```env
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
PREMIUM_PRICE=9.99
```

### 4. MongoDB (Analytics & User Data)
```bash
# Local MongoDB
DATABASE_URL=mongodb://localhost:27017/sammylove

# MongoDB Atlas (Cloud)
MONGODB_ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/sammylove
```

## 📊 Revenue Streams

### Stream 1: Display Ads (CPM/CPC)
- **Estimated**: $5-15 per 1,000 views
- Integration: Google AdSense, Adsterra, PropellerAds
- **Setup time**: 24-48 hours

### Stream 2: Premium Subscription
- **Price**: $9.99/month
- **Features**: 
  - Ad-free experience
  - Higher download limits
  - Batch downloads
  - Priority support
- **Expected conversion**: 2-5% of users

### Stream 3: Referral Program
- **Commission**: $0.50 per referral
- **How**: Share `https://sammylove.com?ref=YOUR_ID`
- **Payout**: Monthly via PayPal/Stripe

### Stream 4: Affiliate Marketing
- Promote video editing tools
- Screen recording software
- Cloud storage services
- Expected earnings: $100-500/month

## 📈 Expected Monthly Earnings

With **10,000 monthly users**:
- **Display Ads**: $50-150 (CPM $5-15 per 1K views)
- **Premium Subscriptions**: $300-500 (3-5% conversion, 2% LTV)
- **Referrals**: $100-200 (100-200 referrals)
- **Affiliates**: $100-500 (varies)

**Total Potential**: $550-1,350/month

With **100,000 monthly users**:
**Potential**: $5,500-13,500/month

## 🛠️ API Endpoints

### Download Video
```bash
POST /api/download
Content-Type: application/json

{
  "url": "https://www.tiktok.com/@username/video/...",
  "platform": "tiktok"
}
```

### Track Ad Click
```bash
POST /api/track-ad-click
{
  "userId": "user_id",
  "adNetwork": "google"
}
```

### Get User Stats
```bash
GET /api/user/stats/:userId
```

### Create Premium Subscription
```bash
POST /api/premium/subscribe
{
  "userId": "user_id",
  "stripeToken": "tok_..."
}
```

## 📁 Project Structure

```
sammylove-downloader/
├── server.js                 # Main server & UI
├── monetization.js          # Monetization module
├── package.json             # Dependencies
├── .env.example             # Environment template
├── README.md                # This file
└── downloads/               # Temporary video storage
```

## 🔐 Security Features

- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Rate limiting (30 req/15min per IP)
- ✅ Input validation
- ✅ XSS protection
- ✅ Automatic file cleanup
- ✅ JWT authentication ready

## 📱 Deployment

### Heroku
```bash
git push heroku main
```

### Railway
```bash
railway link
railway up
```

### DigitalOcean
```bash
# Create droplet, install Node.js & yt-dlp
git clone repo
npm install
npm start
```

### AWS EC2
```bash
# Create t2.micro instance
sudo apt update && sudo apt install nodejs npm yt-dlp mongodb
npm install && npm start
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file

## 💬 Support

- 📧 Email: support@sammylove.com
- 🐛 Issues: [GitHub Issues](https://github.com/abolajisammyemmy-dev/sammylove-downloader/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/abolajisammyemmy-dev/sammylove-downloader/discussions)

## 📊 Analytics Dashboard

Monitor your earnings in real-time:
- Daily ad revenue
- Premium subscriptions
- Download statistics
- User engagement metrics
- Platform performance

## ⚠️ Legal Notice

This tool is for personal use only. Ensure compliance with:
- Platform terms of service
- Copyright laws
- DMCA regulations
- Local data protection laws

---

**Made with ❤️ by Sammylove**

*Start downloading • Make money • Grow your platform*
