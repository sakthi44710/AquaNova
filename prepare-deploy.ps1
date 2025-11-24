# AquaNova - Vercel Deployment Preparation Script
# Run this before deploying to Vercel

Write-Host "🌊 AquaNova Deployment Preparation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found package.json" -ForegroundColor Green

# Step 2: Clean node_modules and reinstall
Write-Host ""
Write-Host "📦 Cleaning and reinstalling dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}
npm install

# Step 3: Test build
Write-Host ""
Write-Host "🔨 Testing production build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 4: Check .gitignore
Write-Host ""
Write-Host "🔒 Checking .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -notmatch "\.env") {
    Write-Host "⚠️  Warning: .env might not be ignored!" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env files are properly ignored" -ForegroundColor Green
}

# Step 5: Check git status
Write-Host ""
Write-Host "📝 Git Status:" -ForegroundColor Yellow
git status

# Step 6: Display next steps
Write-Host ""
Write-Host "🚀 READY FOR DEPLOYMENT!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Ready for Vercel deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy Frontend:" -ForegroundColor White
Write-Host "   → Go to https://vercel.com" -ForegroundColor Gray
Write-Host "   → Import your AquaNova repository" -ForegroundColor Gray
Write-Host "   → Add environment variables" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy Backend:" -ForegroundColor White
Write-Host "   → Create aquanova-backend repository" -ForegroundColor Gray
Write-Host "   → Deploy to Railway or Vercel" -ForegroundColor Gray
Write-Host "   → Add environment variables" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""

# Step 7: Generate JWT Secret suggestion
Write-Host "🔑 Suggested JWT_SECRET for production:" -ForegroundColor Yellow
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
Write-Host ""

Write-Host "✨ Preparation complete!" -ForegroundColor Green
