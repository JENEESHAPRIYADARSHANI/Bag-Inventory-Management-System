@echo off
echo Setting up Payment Management Database...
echo.

REM Update these variables with your MySQL credentials
set MYSQL_USER=root
set MYSQL_PASSWORD=root
set MYSQL_HOST=localhost
set MYSQL_PORT=3306

echo Connecting to MySQL and creating database...
mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD% -h %MYSQL_HOST% -P %MYSQL_PORT% < create_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Database setup completed successfully!
    echo Database: payment_management_db
    echo.
) else (
    echo.
    echo Error: Database setup failed!
    echo Please check your MySQL credentials and try again.
    echo.
)

pause
