const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use(limiter);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Clean old files periodically (every 1 hour)
const cleanOldFiles = () => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  fs.readdirSync(uploadsDir).forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    if (stats.mtimeMs < oneHourAgo) {
      fs.unlinkSync(filePath);
    }
  });
};

setInterval(cleanOldFiles, 60 * 60 * 1000);

// 1. Home Page Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sammylove - Social Media Video Downloader</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container {
          width: 100%;
          max-width: 600px;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .header p {
          font-size: 16px;
          opacity: 0.9;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .platforms {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 25px;
        }

        .platform-btn {
          padding: 12px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s ease;
          color: #1e293b;
        }

        .platform-btn:hover,
        .platform-btn.active {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }

        .input-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .download-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .download-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .download-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        #status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          font-size: 14px;
          display: none;
          animation: slideDown 0.3s ease-out;
        }

        #status.loading {
          display: block;
          background: #e0f2fe;
          color: #0369a1;
          border-left: 4px solid #0369a1;
        }

        #status.success {
          display: block;
          background: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        #status.error {
          display: block;
          background: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #ef4444;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .features {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #e2e8f0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .feature {
          text-align: center;
          font-size: 13px;
          color: #64748b;
        }

        .feature-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .footer {
          text-align: center;
          color: white;
          margin-top: 25px;
          font-size: 13px;
          opacity: 0.8;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #0369a1;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Sammylove</h1>
          <p>Download videos from any social media platform • No watermarks • Fast & Free</p>
        </div>

        <div class="card">
          <div class="input-group">
            <label>Select Platform</label>
            <div class="platforms">
              <button class="platform-btn active" data-platform="tiktok">TikTok</button>
              <button class="platform-btn" data-platform="instagram">Instagram</button>
              <button class="platform-btn" data-platform="facebook">Facebook</button>
              <button class="platform-btn" data-platform="youtube">YouTube</button>
              <button class="platform-btn" data-platform="twitter">Twitter/X</button>
              <button class="platform-btn" data-platform="snapchat">Snapchat</button>
            </div>
          </div>

          <div class="input-group">
            <label>Paste Video Link</label>
            <input 
              type="text" 
              id="url" 
              placeholder="https://www.tiktok.com/@username/video/..." 
              autocomplete="off"
            />
          </div>

          <button class="download-btn" onclick="downloadVideo()" id="downloadBtn">
            📥 Download Video
          </button>

          <div id="status"></div>

          <div class="features">
            <div class="feature">
              <div class="feature-icon">✨</div>
              <div>Watermark Free</div>
            </div>
            <div class="feature">
              <div class="feature-icon">⚡</div>
              <div>Super Fast</div>
            </div>
            <div class="feature">
              <div class="feature-icon">🔒</div>
              <div>Safe & Secure</div>
            </div>
            <div class="feature">
              <div class="feature-icon">📱</div>
              <div>All Platforms</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2024 Sammylove - All rights reserved</p>
        </div>
      </div>

      <script>
        let selectedPlatform = 'tiktok';

        document.querySelectorAll('.platform-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPlatform = this.dataset.platform;
          });
        });

        function showStatus(message, type) {
          const status = document.getElementById('status');
          status.className = type;
          status.innerHTML = type === 'loading' 
            ? \`<span class="spinner"></span>\${message}\`
            : message;
        }

        async function downloadVideo() {
          const url = document.getElementById('url').value.trim();
          const btn = document.getElementById('downloadBtn');

          if (!url) {
            showStatus('❌ Please enter a valid URL', 'error');
            return;
          }

          btn.disabled = true;
          showStatus('Processing your video...', 'loading');

          try {
            const response = await fetch('/api/download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url, platform: selectedPlatform })
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || 'Download failed');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = \`sammylove_\${Date.now()}.mp4\`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

            showStatus('✅ Video downloaded successfully!', 'success');
          } catch (error) {
            showStatus(\`❌ Error: \${error.message}\`, 'error');
          } finally {
            btn.disabled = false;
          }
        }

        document.getElementById('url').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') downloadVideo();
        });
      </script>
    </body>
    </html>
  `);
});

// 2. Download API Endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, platform } = req.body;

    if (!url || !platform) {
      return res.status(400).json({ message: 'URL and platform are required' });
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    const tempFileName = `sammylove_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`;
    const tempFilePath = path.join(uploadsDir, tempFileName);

    // Build yt-dlp command with watermark removal options
    const ytDlpArgs = [
      '-o', tempFilePath,
      '-f', 'best[ext=mp4]',
      '--remove-cache-dir',
      '--no-keep-video',
      // Watermark removal for different platforms
      '--postprocessor-args', '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2',
      url
    ];

    // Platform-specific options
    if (platform === 'tiktok') {
      ytDlpArgs.splice(2, 0, '--extractor-args', 'tiktok:api_hostname=api19-core.tiktokv.com');
    } else if (platform === 'instagram') {
      ytDlpArgs.splice(2, 0, '--extractor-args', 'instagram:android_app_user_agent=');
    }

    return new Promise((resolve) => {
      const ytDlp = spawn('yt-dlp', ytDlpArgs);

      const timeout = setTimeout(() => {
        ytDlp.kill();
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        res.status(408).json({ message: 'Download timeout - video too large or connection issue' });
        resolve();
      }, 120000); // 2 minute timeout

      ytDlp.stderr.on('data', (data) => {
        console.error(`yt-dlp error: ${data}`);
      });

      ytDlp.on('close', (code) => {
        clearTimeout(timeout);

        if (code !== 0 || !fs.existsSync(tempFilePath)) {
          return res.status(500).json({ 
            message: 'Failed to process video. The link might be invalid or the video is unavailable.' 
          });
        }

        res.download(tempFilePath, `sammylove_${Date.now()}.mp4`, (err) => {
          if (err) console.error('Download error:', err);
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        });

        resolve();
      });

      ytDlp.on('error', (err) => {
        clearTimeout(timeout);
        console.error('yt-dlp process error:', err);
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        res.status(500).json({ message: 'Server error during download processing' });
        resolve();
      });
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// 3. Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Sammylove Video Downloader' });
});

// 4. URL Validation
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Sammylove downloader running on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});

module.exports = app;
