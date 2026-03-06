@echo off
echo ========================================
echo Quotation Management Database Setup
echo ========================================
echo.

set MYSQL_USER=root
set MYSQL_PASSWORD=Wr250x&@8052
set DB_NAME=quotation_db

echo Creating database and tables...
mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"
mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD% %DB_NAME% < schema.sql

echo.
echo ========================================
echo Database setup completed!
echo ========================================
echo Database: %DB_NAME%
echo Tables: quotations, quotation_items
echo Sample data inserted for testing
echo ========================================
pause
