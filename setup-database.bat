@echo off
echo ==========================================
echo Setting up Quotation Management Databases
echo ==========================================

echo.
echo This will create the required databases and user.
echo Please enter your MySQL root password when prompted.
echo.

mysql -u root -p < database-setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo.
    echo Databases created:
    echo - quotation_db
    echo - order_management_db
    echo.
    echo User created: orderuser (password: order123)
    echo.
) else (
    echo.
    echo ❌ Database setup failed!
    echo Please check your MySQL installation and root password.
    echo.
)

pause