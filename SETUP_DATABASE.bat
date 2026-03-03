@echo off
echo ========================================
echo Payment Management Service - Database Setup
echo ========================================
echo.

REM Set MySQL path
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

echo This script will help you set up the database.
echo.
echo Please enter your MySQL root password when prompted.
echo (The password you use to connect to MySQL Workbench)
echo.

REM Prompt for password
set /p MYSQL_PASSWORD="Enter MySQL root password: "

echo.
echo Testing MySQL connection...
%MYSQL_PATH% -u root -p%MYSQL_PASSWORD% -e "SELECT 1;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Could not connect to MySQL!
    echo Please check your password and try again.
    echo.
    echo If you don't know your password:
    echo 1. Open MySQL Workbench
    echo 2. Check your saved connection
    echo 3. The password should be saved there
    pause
    exit /b 1
)

echo SUCCESS: Connected to MySQL!
echo.

echo Creating database...
%MYSQL_PATH% -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS payment_management_db;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Could not create database!
    pause
    exit /b 1
)

echo SUCCESS: Database created!
echo.

echo Creating tables...
%MYSQL_PATH% -u root -p%MYSQL_PASSWORD% payment_management_db < "Backend\Payment-Management-Service\database\create_database.sql" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Could not create tables!
    pause
    exit /b 1
)

echo SUCCESS: Tables created!
echo.

echo Updating application.properties...
powershell -Command "(Get-Content 'Backend\Payment-Management-Service\src\main\resources\application.properties') -replace 'spring.datasource.password=.*', 'spring.datasource.password=%MYSQL_PASSWORD%' | Set-Content 'Backend\Payment-Management-Service\src\main\resources\application.properties'"

echo SUCCESS: Configuration updated!
echo.

echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart the backend server
echo 2. The backend should now connect successfully
echo 3. You can use the payment management features
echo.
pause
