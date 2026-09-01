// Monetization Module for Sammylove
// Handles ads, premium features, and revenue tracking

const mongoose = require('mongoose');

// User Schema with Premium Features
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  isPremium: { type: Boolean, default: false },
  premiumExpiryDate: Date,
  downloadsCount: { type: Number, default: 0 },
  totalDownloadSize: { type: Number, default: 0 },
  adInteractions: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  stripeCustomerId: String
});

// Revenue Tracking Schema
const revenueSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  source: String, // 'ad-click', 'premium-subscription', 'affiliate', 'donation'
  amount: Number,
  currency: { type: String, default: 'USD' },
  timestamp: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed
});

// Download Analytics Schema
const analyticsSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  platform: String, // tiktok, instagram, etc
  fileSize: Number,
  downloadTime: Number, // in seconds
  status: String, // success, failed
  timestamp: { type: Date, default: Date.now }
});

class MonetizationManager {
  constructor() {
    this.User = mongoose.model('User', userSchema);
    this.Revenue = mongoose.model('Revenue', revenueSchema);
    this.Analytics = mongoose.model('Analytics', analyticsSchema);
  }

  // Generate Ad Code (Google AdSense)
  generateAdSenseCode() {
    return `
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT_ID}"
        crossorigin="anonymous"></script>
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="${process.env.ADSENSE_CLIENT_ID}"
        data-ad-slot="${process.env.ADSENSE_SLOT_ID}"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    `;
  }

  // Generate Adsterra Code
  generateAdsterraCode() {
    return `
      <script src="https://cdn.adsterra.com/js/banners.js"></script>
      <div id="container-${process.env.ADSTERRA_ZONE_ID}"></div>
      <script>
        AdsterraLoader.push({
          zoneId: ${process.env.ADSTERRA_ZONE_ID},
          containerId: 'container-${process.env.ADSTERRA_ZONE_ID}'
        });
      </script>
    `;
  }

  // Track Ad Click
  async trackAdClick(userId, adNetwork) {
    try {
      await this.Revenue.create({
        userId,
        source: `ad-click-${adNetwork}`,
        amount: 0.01, // Average CPM/CPC
        metadata: { adNetwork, timestamp: new Date() }
      });

      // Update user ad interactions
      await this.User.findByIdAndUpdate(userId, {
        $inc: { adInteractions: 1 }
      });

      return true;
    } catch (error) {
      console.error('Error tracking ad click:', error);
      return false;
    }
  }

  // Create Premium Subscription (Stripe Integration)
  async createPremiumSubscription(userId, email, stripeCustomerId) {
    try {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

      await this.User.findByIdAndUpdate(userId, {
        isPremium: true,
        premiumExpiryDate: expiryDate,
        stripeCustomerId
      });

      // Log revenue
      await this.Revenue.create({
        userId,
        source: 'premium-subscription',
        amount: 9.99,
        metadata: { stripeCustomerId, plan: 'monthly' }
      });

      return { success: true, expiryDate };
    } catch (error) {
      console.error('Error creating premium subscription:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if Premium Valid
  async isPremiumUser(userId) {
    try {
      const user = await this.User.findById(userId);
      if (!user) return false;

      if (!user.isPremium) return false;

      // Check if premium is expired
      if (user.premiumExpiryDate < new Date()) {
        await this.User.findByIdAndUpdate(userId, { isPremium: false });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  // Track Download
  async trackDownload(userId, platform, fileSize, downloadTime, status) {
    try {
      // Record analytics
      await this.Analytics.create({
        userId,
        platform,
        fileSize,
        downloadTime,
        status
      });

      // Update user stats
      if (status === 'success') {
        await this.User.findByIdAndUpdate(userId, {
          $inc: {
            downloadsCount: 1,
            totalDownloadSize: fileSize
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error tracking download:', error);
      return false;
    }
  }

  // Get User Revenue
  async getUserRevenue(userId) {
    try {
      const revenues = await this.Revenue.find({ userId });
      const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0);
      return { totalRevenue, revenues };
    } catch (error) {
      console.error('Error getting user revenue:', error);
      return { totalRevenue: 0, revenues: [] };
    }
  }

  // Get Platform Analytics
  async getPlatformAnalytics(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const analytics = await this.Analytics.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: '$platform',
            totalDownloads: { $sum: 1 },
            totalSize: { $sum: '$fileSize' },
            avgTime: { $avg: '$downloadTime' },
            successRate: {
              $avg: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
            }
          }
        }
      ]);

      return analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return [];
    }
  }

  // Generate Referral Link
  generateReferralLink(userId) {
    return `https://sammylove.com?ref=${userId}`;
  }

  // Track Referral
  async trackReferral(referrerId, newUserId) {
    try {
      await this.Revenue.create({
        userId: referrerId,
        source: 'referral',
        amount: 0.50, // $0.50 per referral
        metadata: { newUserId, timestamp: new Date() }
      });

      return true;
    } catch (error) {
      console.error('Error tracking referral:', error);
      return false;
    }
  }

  // Generate Dashboard Stats
  async generateDashboardStats(userId) {
    try {
      const user = await this.User.findById(userId);
      const { totalRevenue } = await this.getUserRevenue(userId);
      const platformStats = await this.getPlatformAnalytics(30);

      return {
        isPremium: user.isPremium,
        premiumExpiryDate: user.premiumExpiryDate,
        downloadsCount: user.downloadsCount,
        totalDownloadSize: (user.totalDownloadSize / 1024 / 1024).toFixed(2) + ' MB',
        adInteractions: user.adInteractions,
        totalRevenue: totalRevenue.toFixed(2),
        platformStats
      };
    } catch (error) {
      console.error('Error generating dashboard stats:', error);
      return null;
    }
  }
}

module.exports = MonetizationManager;
