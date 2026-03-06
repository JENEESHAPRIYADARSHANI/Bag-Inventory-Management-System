@echo off
echo ========================================
echo Testing Quotation Service Backend
echo ========================================
echo.

echo 1. Testing Health Check...
curl -s http://localhost:8080/api/quotations/health
echo.
echo.

echo 2. Testing Get Products...
curl -s http://localhost:8080/api/quotations/products
echo.
echo.

echo 3. Testing Get All Quotations...
curl -s http://localhost:8080/api/quotations
echo.
echo.

echo ========================================
echo Basic Tests Complete!
echo ========================================
echo.
echo For complete testing, use Postman:
echo Import: Quotation-Service-Complete-With-Delete.postman_collection.json
echo.
pause
