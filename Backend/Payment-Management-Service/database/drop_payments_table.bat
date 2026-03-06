@echo off
echo Dropping payments table from Payment Management Database...
echo.

REM Update these variables with your MySQL credentials
set MYSQL_USER=root
set MYSQL_PASSWORD=root
set MYSQL_HOST=localhost
set MYSQL_PORT=3306

echo Connecting to MySQL and dropping payments table...
mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD% -h %MYSQL_HOST% -P %MYSQL_PORT% < drop_payments_table.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Payments table dropped successfully!
    echo Only saved_payment_methods table remains.
    echo.
) else (
    echo.
    echo Error: Failed to drop payments table!
    echo Please check your MySQL credentials and try again.
    echo.
)

pause
