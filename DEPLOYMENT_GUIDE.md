# 🚀 AquaNova Deployment Guide - Vercel

This guide will help you deploy your AquaNova project to Vercel in two parts: Frontend and Backend.

## 📋 Prerequisites

1. ✅ GitHub account with AquaNova repository
2. ✅ Vercel account (sign up at https://vercel.com)
3. ✅ TiDB Cloud database (already configured)
4. ✅ Google AI API key for Gemini chatbot

---

## 🎯 Deployment Strategy

Since Vercel serverless functions have limitations, we'll deploy:
- **Frontend** (React app) → Main Vercel project
- **Backend** (Express API) → Separate Vercel project OR Railway/Render

---

## 📦 Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Your Repository

1. **Ensure all changes are committed to GitHub:**
```powershell
cd "C:\Users\lenovo\Desktop\SIH Project\aquanova"
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your **AquaNova** repository from GitHub
5. Authorize Vercel to access your repository

### Step 3: Configure Frontend Deployment

**Framework Preset:** Create React App  
**Root Directory:** `./` (leave as is)  
**Build Command:** `npm run build` (or `npm run vercel-build`)  
**Output Directory:** `build`  
**Install Command:** `npm install`

### Step 4: Add Environment Variables

In Vercel project settings, add these environment variables:

```env
# Frontend Environment Variables
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_GOOGLE_AI_KEY=your_google_ai_api_key_here
```

**Note:** You'll update `REACT_APP_API_URL` after deploying the backend.

### Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Your frontend will be live at `https://aquanova-yourname.vercel.app`

---

## 🔧 Part 2: Deploy Backend to Vercel

### Option A: Deploy Backend as Separate Vercel Project (Recommended)

#### Step 1: Create a New Repository for Backend

Since Vercel works best with monorepo or separate repos, you have two options:

**Option 1: Create Separate Backend Repo (Easier)**

1. Create a new repository on GitHub: `aquanova-backend`
2. Copy backend files to a new directory:
```powershell
# Create a new directory
mkdir "C:\Users\lenovo\Desktop\SIH Project\aquanova-backend"
cd "C:\Users\lenovo\Desktop\SIH Project\aquanova-backend"

# Copy backend files
Copy-Item "C:\Users\lenovo\Desktop\SIH Project\aquanova\backend\*" -Destination . -Recurse

# Initialize git
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin https://github.com/sakthi44710/aquanova-backend.git
git push -u origin main
```

#### Step 2: Deploy Backend to Vercel

1. Go to Vercel → **Add New Project**
2. Import `aquanova-backend` repository
3. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

#### Step 3: Add Backend Environment Variables

```env
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=2ZGMvSRghBi5aJw.root
DB_PASSWORD=c5RZNwi4h8GQ6NZk
DB_NAME=test
JWT_SECRET=aquanova_secret_key_2024_change_in_production_use_random_string
PORT=5000
EMAIL_USER=testingforproject07@gmail.com
EMAIL_PASSWORD=mrvxwiglfdwxcwkk
```

⚠️ **Security Note:** Change `JWT_SECRET` to a strong random string in production!

#### Step 4: Deploy Backend

1. Click **"Deploy"**
2. Your API will be live at `https://aquanova-backend.vercel.app`

#### Step 5: Update Frontend Environment Variable

1. Go to your frontend Vercel project settings
2. Update `REACT_APP_API_URL` to: `https://aquanova-backend.vercel.app/api`
3. Redeploy frontend

---

### Option B: Deploy Backend to Railway (Alternative - Recommended for Production)

Railway is better suited for Node.js backends with persistent connections.

#### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Sign up with GitHub

#### Step 2: Deploy Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `aquanova-backend` (or the backend folder)
4. Railway will auto-detect Node.js

#### Step 3: Add Environment Variables

Add the same environment variables as above in Railway dashboard.

#### Step 4: Get Backend URL

Railway will provide a URL like: `https://aquanova-backend.up.railway.app`

#### Step 5: Update Frontend

Update `REACT_APP_API_URL` in Vercel to point to Railway URL.

---

## 🔒 Security Checklist Before Deployment

### 1. Update .gitignore

Ensure `.env` files are ignored:
```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env
```

### 2. Generate Strong JWT Secret

```powershell
# Generate a random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use this value for `JWT_SECRET` in production.

### 3. Update CORS Settings

In `backend/server.js`, update CORS to allow your Vercel domain:

```javascript
app.use(cors({
  origin: ['https://aquanova-yourname.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### 4. Environment-Specific URLs

Create `.env.production` in frontend:
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_GOOGLE_AI_KEY=your_actual_api_key
```

---

## 🧪 Testing Deployment

### 1. Test Frontend
- Visit your Vercel URL
- Check if login page loads
- Verify purple theme is applied
- Check browser console for errors

### 2. Test Backend API
- Visit `https://your-backend-url.vercel.app/api/health`
- Should return: `{"status":"OK","message":"AquaNova API is running"}`

### 3. Test Authentication
- Try signing up with a new email
- Check if OTP email is received
- Complete registration process
- Try logging in

### 4. Test AI Chatbot
- Navigate to AI Assistant page
- Send a test message
- Verify Gemini AI responds

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:** Ensure all dependencies are in `package.json`, not `devDependencies`

### Issue 2: Database connection fails
**Solution:** 
- Verify TiDB Cloud is accessible from Vercel IPs
- Check environment variables are set correctly
- TiDB Cloud should allow connections from anywhere (0.0.0.0/0)

### Issue 3: CORS errors
**Solution:** Update CORS settings in `backend/server.js` to include your Vercel domain

### Issue 4: Build fails on Vercel
**Solution:** 
- Check build logs in Vercel dashboard
- Ensure `react-app-rewired` is in `dependencies`, not `devDependencies`
- Try adding `CI=false` to environment variables to ignore warnings

### Issue 5: API routes return 404
**Solution:** 
- Verify `vercel.json` routing configuration
- Ensure backend is deployed separately
- Check `REACT_APP_API_URL` is set correctly

---

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- Monitor build status
- Check deployment logs
- View analytics and performance metrics

### Database Monitoring
- Monitor TiDB Cloud dashboard for connection count
- Check query performance
- Set up alerts for high usage

### Error Tracking
Consider adding error tracking:
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)
- Vercel Analytics (built-in)

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```powershell
# Make changes to your code
git add .
git commit -m "Update feature XYZ"
git push origin main
# Vercel will automatically deploy!
```

### Branch Deployments
- `main` branch → Production deployment
- Other branches → Preview deployments

---

## 💰 Cost Considerations

### Vercel Free Tier Includes:
- ✅ Unlimited personal projects
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Serverless function timeout: 10 seconds (may be limiting)

### TiDB Cloud Free Tier:
- ✅ 1 cluster
- ✅ 5 GB storage
- ✅ Sufficient for development

### Railway Free Tier:
- ✅ $5 credit/month
- ✅ Better for backends with persistent connections

---

## 🚀 Production Recommendations

### 1. Use Custom Domain
- Buy domain from Namecheap/GoDaddy
- Add to Vercel project settings
- Example: `aquanova.com`

### 2. Enable Analytics
- Turn on Vercel Analytics
- Monitor user behavior
- Track performance metrics

### 3. Set Up CI/CD
- Already configured with Vercel + GitHub
- Add automated tests before deployment

### 4. Implement Rate Limiting
- Protect API from abuse
- Use `express-rate-limit` package

### 5. Add Monitoring
- Set up uptime monitoring (UptimeRobot)
- Configure error alerts
- Monitor database performance

---

## 📝 Deployment Checklist

### Before Deploying:
- [ ] All code committed to GitHub
- [ ] `.env` files are in `.gitignore`
- [ ] Environment variables documented
- [ ] Build succeeds locally (`npm run build`)
- [ ] Tests pass (if any)
- [ ] CORS configured for production domain

### Frontend Deployment:
- [ ] Vercel project created
- [ ] Repository connected
- [ ] Environment variables added
- [ ] Build configuration set
- [ ] Deployment successful
- [ ] Custom domain configured (optional)

### Backend Deployment:
- [ ] Backend repository created (or Railway project)
- [ ] Environment variables added
- [ ] Database connection tested
- [ ] API health endpoint working
- [ ] CORS allows frontend domain

### Post-Deployment:
- [ ] Test signup/login flow
- [ ] Test AI chatbot
- [ ] Test all major features
- [ ] Check mobile responsiveness
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

## 🎉 You're Live!

Once deployed, share your project:
- Frontend: `https://aquanova-yourname.vercel.app`
- Backend: `https://aquanova-backend.vercel.app`

### Sample URLs for Testing:
- Health Check: `https://your-backend/api/health`
- Login: `https://your-frontend/login`
- Dashboard: `https://your-frontend/`

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **TiDB Cloud Docs:** https://docs.pingcap.com/tidbcloud
- **React Deployment:** https://create-react-app.dev/docs/deployment

---

## 🔧 Quick Commands Reference

```powershell
# Build locally to test
npm run build

# Test production build locally
npm install -g serve
serve -s build

# Deploy to Vercel (if using Vercel CLI)
npm i -g vercel
vercel

# Check deployment logs
vercel logs

# Promote deployment to production
vercel --prod
```

---

**Good luck with your deployment! 🚀🌊**

If you encounter any issues, check the Vercel deployment logs and TiDB Cloud connection settings.
