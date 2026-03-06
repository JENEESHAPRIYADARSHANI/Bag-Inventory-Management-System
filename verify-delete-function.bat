@echo off
echo ========================================
echo    DELETE FUNCTION VERIFICATION
echo ========================================
echo.
echo ✅ CORS configuration updated
echo ✅ Backend service restarted
echo ✅ Test quotation QT-31 created
echo.
echo Testing Steps:
echo 1. Open admin panel: http://localhost:5173/admin/quotations
echo 2. Look for "QT-31" (Final Delete Test) with Draft status
echo 3. Click the red trash icon (🗑️) in Actions column
echo 4. Confirm deletion in popup dialog
echo 5. Quotation should disappear from list
echo.
echo Opening admin panel...
start http://localhost:5173/admin/quotations
echo.
echo If delete still fails:
echo 1. Press F12 in browser
echo 2. Check Console tab for errors
echo 3. Look for network errors or CORS issues
echo.
pause