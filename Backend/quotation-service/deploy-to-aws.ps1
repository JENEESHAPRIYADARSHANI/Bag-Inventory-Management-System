# AWS Deployment Script for Quotation Service
# Run this script to deploy to AWS EC2

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2_IP,
    
    [Parameter(Mandatory=$true)]
    [string]$KEY_FILE,
    
    [string]$EC2_USER = "ec2-user"
)

Write-Host "🚀 Deploying Quotation Service to AWS EC2..." -ForegroundColor Green
Write-Host "Target: $EC2_USER@$EC2_IP" -ForegroundColor Cyan

# Step 1: Build the application
Write-Host "📦 Building application..." -ForegroundColor Yellow
& mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Upload JAR file
Write-Host "📤 Uploading JAR file to EC2..." -ForegroundColor Yellow
& scp -i $KEY_FILE target/quotation-service-0.0.1-SNAPSHOT.jar ${EC2_USER}@${EC2_IP}:/home/ec2-user/
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Upload startup script
Write-Host "📤 Uploading startup script..." -ForegroundColor Yellow
& scp -i $KEY_FILE setup-ec2-service.sh ${EC2_USER}@${EC2_IP}:/home/ec2-user/
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Script upload failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Setup and start service
Write-Host "⚙️ Setting up service on EC2..." -ForegroundColor Yellow
& ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} "chmod +x setup-ec2-service.sh && sudo ./setup-ec2-service.sh"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Service setup failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your API is now available at: http://${EC2_IP}:8080/api/quotations" -ForegroundColor Cyan
Write-Host "🔍 Health check: http://${EC2_IP}:8080/actuator/health" -ForegroundColor Cyan

# Test the deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://${EC2_IP}:8080/actuator/health" -TimeoutSec 30
    if ($response.status -eq "UP") {
        Write-Host "✅ Service is running successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Service may not be fully ready yet. Check logs." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not reach service yet. It may still be starting up." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update frontend .env.production with: VITE_API_URL=http://${EC2_IP}:8080/api"
Write-Host "2. Build and deploy frontend: npm run build"
Write-Host "3. Test the complete system"