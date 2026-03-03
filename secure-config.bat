@echo off
echo ========================================
echo Securing Configuration Files
echo ========================================
echo.

echo This script will replace hardcoded passwords with environment variables.
echo.
echo WARNING: Make sure you have a backup before proceeding!
echo.
pause

echo.
echo Updating quotation-service...
powershell -Command "(Get-Content 'Backend\quotation-service\src\main\resources\application.properties') -replace 'spring.datasource.password=.*', 'spring.datasource.password=${DB_PASSWORD:root}' | Set-Content 'Backend\quotation-service\src\main\resources\application.properties'"

echo Updating product-catalog-service...
powershell -Command "(Get-Content 'Backend\product-catalog-service\src\main\resources\application.yaml') -replace 'password: \"@Abishek2001\"', 'password: ${DB_PASSWORD:root}' | Set-Content 'Backend\product-catalog-service\src\main\resources\application.yaml'"

echo Updating logistics-Service...
powershell -Command "(Get-Content 'Backend\logistics-Service\src\main\resources\application.yaml') -replace 'password: Nuskyny@1234', 'password: ${DB_PASSWORD:root}' | Set-Content 'Backend\logistics-Service\src\main\resources\application.yaml'"

echo Updating Order-Management-Service properties...
powershell -Command "(Get-Content 'Backend\Order-Management-Service\src\main\resources\application.properties') -replace 'spring.datasource.password=.*', 'spring.datasource.password=${DB_PASSWORD:root}' | Set-Content 'Backend\Order-Management-Service\src\main\resources\application.properties'"

echo Updating Order-Management-Service yaml...
powershell -Command "(Get-Content 'Backend\Order-Management-Service\src\main\resources\application.yaml') -replace 'password: password123', 'password: ${DB_PASSWORD:root}' | Set-Content 'Backend\Order-Management-Service\src\main\resources\application.yaml'"

echo.
echo ========================================
echo Configuration files secured!
echo ========================================
echo.
echo Next steps:
echo 1. Review the changes in each file
echo 2. Set environment variable: set DB_PASSWORD=your_password
echo 3. Test your application locally
echo 4. Commit and push to GitHub
echo.
pause
