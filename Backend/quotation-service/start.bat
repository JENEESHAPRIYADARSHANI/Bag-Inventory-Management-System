@echo off
echo ========================================
echo Quotation Service - Quick Start
echo ========================================
echo.

echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)
echo Java found!
echo.

echo Checking MySQL connection...
mysql -u root -pWr250x^&@8052 -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Cannot connect to MySQL
    echo Please ensure MySQL is running on localhost:3306
    echo Username: root
    echo Password: Wr250x^&@8052
    echo.
    echo Press any key to continue anyway (database will be created on first run)...
    pause >nul
)
echo.

echo Building the application...
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Build successful!
echo.

echo Starting Quotation Service...
echo.
echo Application will be available at:
echo   - API: http://localhost:8080/api/quotations
echo   - User Interface: http://localhost:8080/customer.html
echo   - Admin Interface: http://localhost:8080/admin-dashboard.html
echo.
echo Press Ctrl+C to stop the application
echo.

java -jar target/quotation-service-0.0.1-SNAPSHOT.jar
