@echo off
echo ============================================
echo   MySQL Database Setup for Logistics Service
echo ============================================
echo.

REM Check if MySQL is installed
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo.
    echo Please install MySQL first:
    echo 1. Download from: https://dev.mysql.com/downloads/installer/
    echo 2. Or install XAMPP: https://www.apachefriends.org/
    echo.
    pause
    exit /b 1
)

echo MySQL found!
echo.

REM Get MySQL root password
set /p MYSQL_PASSWORD="Enter MySQL root password (press Enter if no password): "
echo.

echo Creating database...
echo.

if "%MYSQL_PASSWORD%"=="" (
    mysql -u root < create_database.sql
) else (
    mysql -u root -p%MYSQL_PASSWORD% < create_database.sql
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   SUCCESS! Database created successfully!
    echo ============================================
    echo.
    echo Database Name: logistics_db
    echo.
    echo Next steps:
    echo 1. Update application.yaml with your MySQL password
    echo 2. Run the Spring Boot application
    echo 3. Tables will be created automatically
    echo.
) else (
    echo.
    echo ============================================
    echo   ERROR: Failed to create database
    echo ============================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Password is correct
    echo 3. You have admin privileges
    echo.
)

pause
