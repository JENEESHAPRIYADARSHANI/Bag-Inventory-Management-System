# Frontend Deployment Script for AWS S3
# Deploy React frontend to S3 + CloudFront

param(
    [Parameter(Mandatory=$true)]
    [string]$BUCKET_NAME,
    
    [Parameter(Mandatory=$false)]
    [string]$BACKEND_URL = ""
)

Write-Host "🚀 Deploying Frontend to AWS S3..." -ForegroundColor Green

# Step 1: Update environment for production
if ($BACKEND_URL -ne "") {
    Write-Host "⚙️ Updating production environment..." -ForegroundColor Yellow
    $envContent = "# Production Environment Variables - AWS Deployment`nVITE_API_URL=$BACKEND_URL"
    $envContent | Out-File -FilePath ".env.production" -Encoding UTF8
    Write-Host "✅ Updated .env.production with: $BACKEND_URL" -ForegroundColor Green
}

# Step 2: Build the application
Write-Host "📦 Building React application..." -ForegroundColor Yellow
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Deploy to S3
Write-Host "📤 Deploying to S3 bucket: $BUCKET_NAME..." -ForegroundColor Yellow
& aws s3 sync dist/ s3://$BUCKET_NAME --delete
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ S3 deployment failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Configure S3 for static website hosting
Write-Host "🌐 Configuring S3 for static website hosting..." -ForegroundColor Yellow
& aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

Write-Host "✅ Frontend deployment completed!" -ForegroundColor Green
Write-Host "🌐 Website URL: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Optional: Setup CloudFront for better performance" -ForegroundColor Cyan
Write-Host "1. Go to AWS Console → CloudFront"
Write-Host "2. Create distribution with S3 origin"
Write-Host "3. Use CloudFront URL for production"