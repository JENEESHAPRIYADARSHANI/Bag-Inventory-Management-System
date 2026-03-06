# Deploy Quotation Service to AWS EC2

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2_IP,
    
    [Parameter(Mandatory=$true)]
    [string]$KEY_FILE,
    
    [string]$EC2_USER = "ec2-user"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Quotation Service to AWS EC2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build application
Write-Host "[1/4] Building application..." -ForegroundColor Yellow
.\mvnw.cmd clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Upload JAR to EC2
Write-Host "[2/4] Uploading JAR to EC2..." -ForegroundColor Yellow
$jarFile = "target/quotation-service-0.0.1-SNAPSHOT.jar"

if (!(Test-Path $jarFile)) {
    Write-Host "JAR file not found: $jarFile" -ForegroundColor Red
    exit 1
}

scp -i $KEY_FILE $jarFile ${EC2_USER}@${EC2_IP}:/home/${EC2_USER}/

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Upload successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Stop existing service (if running)
Write-Host "[3/4] Stopping existing service..." -ForegroundColor Yellow
ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} "sudo systemctl stop quotation-service 2>/dev/null || true"
Write-Host ""

# Step 4: Start service
Write-Host "[4/4] Starting service..." -ForegroundColor Yellow
ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} "sudo systemctl start quotation-service"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Service start failed!" -ForegroundColor Red
    Write-Host "Check logs with: ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} 'sudo journalctl -u quotation-service -n 50'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Service started successfully!" -ForegroundColor Green
Write-Host ""

# Step 5: Verify deployment
Write-Host "Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$response = Invoke-WebRequest -Uri "http://${EC2_IP}:8080/actuator/health" -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "Health check passed!" -ForegroundColor Green
} else {
    Write-Host "Health check failed. Service may still be starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API URL: http://${EC2_IP}:8080/api/quotations" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  Check status: ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} 'sudo systemctl status quotation-service'" -ForegroundColor White
Write-Host "  View logs: ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} 'sudo journalctl -u quotation-service -f'" -ForegroundColor White
Write-Host "  Restart: ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} 'sudo systemctl restart quotation-service'" -ForegroundColor White
