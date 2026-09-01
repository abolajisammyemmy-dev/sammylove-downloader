# 🚀 DEPLOYMENT GUIDE - Sammylove Downloader

Choose your preferred deployment platform and follow the step-by-step instructions.

---

## 🟢 OPTION 1: HEROKU (Easiest - Recommended for Beginners)

### Cost: FREE (with limitations) → $7/month (production)
### Setup Time: 15-20 minutes
### Difficulty: ⭐ (Very Easy)

### Prerequisites:
- GitHub account
- Credit card (for verification, won't charge if on free tier)

### Steps:

1. **Create Heroku Account**
   ```bash
   # Go to https://www.heroku.com
   # Sign up with email
   # Verify email
   ```

2. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu/Debian
   sudo snap install heroku --classic
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   # Opens browser, sign in
   ```

4. **Create Heroku App**
   ```bash
   heroku create sammylove-app-123
   # Note: Name must be unique, add random numbers
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set PORT=3000
   heroku config:set NODE_ENV=production
   heroku config:set ADSENSE_CLIENT_ID=ca-pub-xxxxx
   heroku config:set ADSENSE_SLOT_ID=12345
   heroku config:set ADSTERRA_ZONE_ID=xxxxx
   heroku config:set STRIPE_PUBLIC_KEY=pk_live_xxxxx
   heroku config:set STRIPE_SECRET_KEY=sk_live_xxxxx
   heroku config:set DATABASE_URL=mongodb+srv://...
   heroku config:set JWT_SECRET=your_super_secret_key
   ```

6. **Add yt-dlp Buildpack**
   ```bash
   heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
   heroku buildpacks:add heroku/python
   heroku buildpacks:add heroku/nodejs
   ```

7. **Deploy to Heroku**
   ```bash
   git push heroku main
   # Wait 2-3 minutes for build
   ```

8. **Open App**
   ```bash
   heroku open
   # Opens your live site!
   ```

9. **Monitor Logs**
   ```bash
   heroku logs --tail
   ```

### Your App URL:
```
https://sammylove-app-123.herokuapp.com
```

### Get Custom Domain (Optional):
```bash
heroku domains:add sammylove.com
# Then update DNS records at domain registrar
```

---

## 🟡 OPTION 2: RAILWAY.APP (Modern & Easy)

### Cost: $5 starter credit free → $5/month
### Setup Time: 10-15 minutes
### Difficulty: ⭐⭐ (Easy)

### Steps:

1. **Sign Up**
   - Go to: https://railway.app
   - Click "Start Free"
   - Sign in with GitHub

2. **Create New Project**
   - Click "Create New Project"
   - "Deploy from GitHub repo"
   - Connect GitHub account
   - Select `sammylove-downloader` repo

3. **Configure Variables**
   - Project Settings
   - Raw Editor
   - Paste environment variables:
   ```
   PORT=3000
   NODE_ENV=production
   ADSENSE_CLIENT_ID=ca-pub-xxxxx
   ADSENSE_SLOT_ID=12345
   ADSTERRA_ZONE_ID=xxxxx
   STRIPE_PUBLIC_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   DATABASE_URL=mongodb+srv://...
   JWT_SECRET=your_super_secret_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Get your public URL (e.g., sammylove-prod.up.railway.app)

5. **Custom Domain**
   - Settings → Domain
   - Add custom domain
   - Update DNS at registrar

---

## 🔵 OPTION 3: AWS EC2 (Most Flexible)

### Cost: $3-5/month (t3.micro)
### Setup Time: 30-45 minutes
### Difficulty: ⭐⭐⭐ (Intermediate)

### Steps:

1. **Create AWS Account**
   - Go to: https://aws.amazon.com
   - Sign up
   - Add payment method

2. **Create EC2 Instance**
   - Go to EC2 Dashboard
   - Click "Launch Instances"
   - Choose: Ubuntu 22.04 LTS
   - Instance type: t3.micro (free tier)
   - Storage: 20GB
   - Security group: Allow SSH, HTTP, HTTPS
   - Create & download key pair (.pem file)

3. **Connect to Instance**
   ```bash
   chmod 400 your-key.pem
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

4. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm python3 python3-pip git
   pip3 install yt-dlp
   ```

5. **Clone & Setup**
   ```bash
   git clone https://github.com/YOUR-USERNAME/sammylove-downloader.git
   cd sammylove-downloader
   npm install
   ```

6. **Create .env File**
   ```bash
   nano .env
   # Paste all environment variables
   # Press Ctrl+X, then Y, then Enter
   ```

7. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name sammylove
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add this config:
   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Then:
   ```bash
   sudo systemctl restart nginx
   ```

9. **Setup SSL (Free HTTPS)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

10. **Update Domain DNS**
    - Point A record to your EC2 IP

---

## 🟣 OPTION 4: DIGITALOCEAN APP PLATFORM (Balanced)

### Cost: $5-12/month
### Setup Time: 15-20 minutes
### Difficulty: ⭐⭐ (Easy)

### Steps:

1. **Create DigitalOcean Account**
   - Go to: https://www.digitalocean.com
   - Sign up
   - Add payment method

2. **Create App**
   - Apps → Create App
   - Choose GitHub repo: sammylove-downloader
   - Auto-detects Node.js
   - Name: sammylove

3. **Add Environment Variables**
   - Edit → Environment
   - Add all from .env.example

4. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Get your live URL

5. **Add Domain**
   - Settings → Domain
   - Add sammylove.com
   - Update DNS at registrar

---

## 🟠 OPTION 5: DOCKER + ANY CLOUD (Advanced)

### Cost: $3-20/month (varies)
### Setup Time: 45-60 minutes
### Difficulty: ⭐⭐⭐⭐ (Advanced)

### Dockerfile:
```dockerfile
FROM node:18-alpine

# Install yt-dlp and Python
RUN apk add --no-cache python3 py3-pip
RUN pip3 install yt-dlp

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Push to Docker Hub:
```bash
# Login to Docker
docker login

# Build image
docker build -t your-username/sammylove:latest .

# Push to Docker Hub
docker push your-username/sammylove:latest

# Deploy on DigitalOcean/AWS/Azure using Docker image
```

---

## 🎯 RECOMMENDED SETUP FLOW

### For Beginners:
1. Heroku (5 min setup) → Test functionality
2. Railway.app (more affordable long-term)
3. Custom domain

### For Production:
1. AWS EC2 (scalable, fast)
2. CloudFlare CDN (faster globally)
3. Custom domain with SSL
4. Monitoring & analytics

### For Rapid Growth:
1. DigitalOcean App Platform (balanced)
2. MongoDB Atlas (handled)
3. Set up monitoring
4. Enable auto-scaling

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] App is live and working
- [ ] Ads are displaying
- [ ] Premium button works
- [ ] Download functionality works
- [ ] MongoDB connected (analytics tracking)
- [ ] Custom domain set up
- [ ] SSL/HTTPS enabled
- [ ] Monitoring configured
- [ ] Backups enabled

---

## 🔒 SECURITY AFTER DEPLOYMENT

1. **Update Security Headers**
   ```javascript
   // In server.js
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "pagead2.googlesyndication.com"],
         imgSrc: ["'self'", "data:", "https:"],
       },
     },
   }));
   ```

2. **Enable HTTPS**
   - Use Let's Encrypt (free)
   - Auto-renew certificates

3. **Set Secure Environment Variables**
   - Never commit .env to GitHub
   - Use platform's secrets manager
   - Rotate keys regularly

4. **Monitor Logs**
   - Set up alerts for errors
   - Monitor CPU/memory usage
   - Track downloads

---

## 📊 MONITORING & ANALYTICS

### Set up monitoring:

```bash
# PM2 Plus (optional, paid)
pm2 plus register

# Or use free options:
# - CloudWatch (AWS)
# - Datadog (free tier)
# - New Relic (free tier)
```

### Track key metrics:
- Daily active users
- Downloads per hour
- Ad impressions
- Premium subscribers
- Errors & uptime

---

## 💰 COST COMPARISON

| Platform | Monthly Cost | Setup | Performance |
|----------|-------------|-------|-------------|
| Heroku | $7-25 | 5 min | Good |
| Railway | $5-15 | 10 min | Good |
| DigitalOcean | $5-20 | 15 min | Excellent |
| AWS EC2 | $3-15 | 30 min | Excellent |
| Docker | $5-50 | 45 min | Flexible |

---

## 🆘 DEPLOYMENT TROUBLESHOOTING

### App won't start?
```bash
# Check logs
heroku logs --tail
# or
railway logs

# Verify Node version
node --version
npm --version
```

### yt-dlp not found?
```bash
# Reinstall yt-dlp
pip install --upgrade yt-dlp

# Verify installation
which yt-dlp
yt-dlp --version
```

### Database connection error?
```bash
# Test MongoDB connection
# Verify .env DATABASE_URL
# Check IP whitelist in MongoDB Atlas
```

### Port already in use?
```bash
# Kill process on port 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🚀 SCALING FOR GROWTH

### Phase 1 (0-10K users)
- Single server ✓
- Free tier sufficient
- Basic monitoring

### Phase 2 (10K-100K users)
- Load balancer
- Multiple servers
- S3 for video cache
- Redis for sessions

### Phase 3 (100K+ users)
- CDN (CloudFlare)
- Database cluster
- Microservices
- Advanced analytics

---

## 📞 NEED HELP?

- Deployment issues? → Check platform docs
- yt-dlp problems? → See yt-dlp GitHub
- Node.js errors? → Check Stack Overflow
- Sammylove specific? → GitHub Issues

---

**Pick a platform, follow the steps, and go live! 🎉**

Your Sammylove downloader will be earning money within hours! 💰
