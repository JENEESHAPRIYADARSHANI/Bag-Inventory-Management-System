@echo off
echo ========================================
echo Quotation Management System Startup
echo ========================================
echo.

echo Starting Backend Service...
start "Quotation Service" cmd /k "cd Backend\quotation-service && mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 15 /nobreak

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Services Starting...
echo ========================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause
