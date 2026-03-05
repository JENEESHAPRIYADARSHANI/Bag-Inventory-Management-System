@echo off
echo ========================================
echo Testing AWS Backend Connection
echo ========================================
echo.

echo Testing Products Endpoint...
curl -s http://54.84.139.95:8080/api/quotations/products
echo.
echo.

echo ========================================
echo Connection Test Complete!
echo ========================================
echo.
echo If you see product data above, the backend is working!
echo.
echo Next steps:
echo 1. cd frontend
echo 2. npm install
echo 3. npm run dev
echo 4. Open http://localhost:5173
echo.
pause
