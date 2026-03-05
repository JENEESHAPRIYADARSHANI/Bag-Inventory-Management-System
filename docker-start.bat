@echo off
echo ========================================
echo   Starting Quotation Management System
echo   with Docker Compose
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo Please review .env file and update if needed.
    echo.
)

echo Starting services...
echo This may take 2-3 minutes on first run...
echo.

REM Build and start services
docker-compose up --build

REM If user presses Ctrl+C, stop services
echo.
echo Stopping services...
docker-compose down

pause
