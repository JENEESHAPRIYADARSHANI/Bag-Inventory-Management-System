@echo off
echo ========================================
echo Testing Backend Connection
echo ========================================
echo.

echo Testing AWS Backend at http://34.229.72.186:8080/api
echo.

curl -s http://34.229.72.186:8080/api/quotations/products

echo.
echo.
echo ========================================
echo If you see product data above, backend is working!
echo ========================================
echo.
echo Frontend is running at: http://localhost:8080
echo Backend is running at: http://34.229.72.186:8080/api
echo.
echo Open your browser and go to: http://localhost:8080
echo.
pause
