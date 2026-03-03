# Payment Management Service - Database Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Payment Management Service - Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MySQL path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

if (-not (Test-Path $mysqlPath)) {
    Write-Host "ERROR: MySQL not found at $mysqlPath" -ForegroundColor Red
    Write-Host "Please install MySQL or update the path in this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "This script will help you set up the database." -ForegroundColor White
Write-Host ""
Write-Host "Please enter your MySQL root password when prompted." -ForegroundColor Yellow
Write-Host "(The password you use to connect to MySQL Workbench)" -ForegroundColor Yellow
Write-Host ""

# Prompt for password securely
$securePassword = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Testing MySQL connection..." -ForegroundColor Yellow

# Test connection
$testResult = & $mysqlPath -u root --password="$password" -e "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not connect to MySQL!" -ForegroundColor Red
    Write-Host "Please check your password and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If you don't know your password:" -ForegroundColor Yellow
    Write-Host "1. Open MySQL Workbench" -ForegroundColor White
    Write-Host "2. Check your saved connection" -ForegroundColor White
    Write-Host "3. The password should be saved there" -ForegroundColor White
    exit 1
}

Write-Host "SUCCESS: Connected to MySQL!" -ForegroundColor Green
Write-Host ""

# Create database
Write-Host "Creating database..." -ForegroundColor Yellow
$createDbResult = & $mysqlPath -u root --password="$password" -e "CREATE DATABASE IF NOT EXISTS payment_management_db;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not create database!" -ForegroundColor Red
    Write-Host $createDbResult
    exit 1
}

Write-Host "SUCCESS: Database created!" -ForegroundColor Green
Write-Host ""

# Create tables
Write-Host "Creating tables..." -ForegroundColor Yellow
$sqlFile = "Backend\Payment-Management-Service\database\create_database.sql"
if (Test-Path $sqlFile) {
    $createTablesResult = Get-Content $sqlFile | & $mysqlPath -u root --password="$password" payment_management_db 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Could not create tables!" -ForegroundColor Red
        Write-Host $createTablesResult
        exit 1
    }
    Write-Host "SUCCESS: Tables created!" -ForegroundColor Green
} else {
    Write-Host "WARNING: SQL file not found at $sqlFile" -ForegroundColor Yellow
    Write-Host "You may need to create tables manually." -ForegroundColor Yellow
}
Write-Host ""

# Update application.properties
Write-Host "Updating application.properties..." -ForegroundColor Yellow
$propsFile = "Backend\Payment-Management-Service\src\main\resources\application.properties"
if (Test-Path $propsFile) {
    $content = Get-Content $propsFile
    $content = $content -replace 'spring.datasource.password=.*', "spring.datasource.password=$password"
    $content | Set-Content $propsFile
    Write-Host "SUCCESS: Configuration updated!" -ForegroundColor Green
} else {
    Write-Host "WARNING: application.properties not found!" -ForegroundColor Yellow
}
Write-Host ""

# Verify setup
Write-Host "Verifying setup..." -ForegroundColor Yellow
$verifyResult = & $mysqlPath -u root --password="$password" -e "USE payment_management_db; SHOW TABLES;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Database is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tables in database:" -ForegroundColor Cyan
    Write-Host $verifyResult
} else {
    Write-Host "WARNING: Could not verify database setup" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart the backend server" -ForegroundColor White
Write-Host "2. The backend should now connect successfully" -ForegroundColor White
Write-Host "3. You can use the payment management features" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
