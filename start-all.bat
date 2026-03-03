@echo off
echo ========================================
echo Starting Full Stack Application
echo ========================================
echo.

echo [1/3] Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed
    pause
    exit /b 1
)
echo ✓ Java found

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Check MySQL
mysql -u root -pWr250x^&@8052 -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Cannot connect to MySQL
    echo Please ensure MySQL is running
    pause
)
echo ✓ MySQL connection OK
echo.

echo [2/3] Starting Backend (Spring Boot)...
echo.
cd Backend\quotation-service
start "Quotation Backend" cmd /k "mvnw.cmd spring-boot:run"
echo Backend starting on http://localhost:8080
echo.

REM Wait for backend to start
echo Waiting for backend to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo [3/3] Starting Frontend (React + Vite)...
echo.
cd ..\..\frontend
start "Quotation Frontend" cmd /k "npm run dev"
echo Frontend starting on http://localhost:5173
echo.

echo ========================================
echo Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo User Interface:  http://localhost:5173/user/request-quotation
echo Admin Interface: http://localhost:5173/admin/quotations
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:5173

echo.
echo To stop the application:
echo 1. Close the Backend terminal window
echo 2. Close the Frontend terminal window
echo.
pause
