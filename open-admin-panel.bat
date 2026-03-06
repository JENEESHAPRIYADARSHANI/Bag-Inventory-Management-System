@echo off
echo Opening admin panel...
echo.
echo Please check the following in your browser:
echo 1. Open Developer Tools (F12)
echo 2. Check Console tab for any JavaScript errors
echo 3. Check Network tab to see if API calls are successful
echo 4. Look for quotations with status "draft" in the table
echo 5. Verify if delete buttons (trash icons) are visible for draft quotations
echo.
echo If delete buttons are not visible, try:
echo - Hard refresh (Ctrl+Shift+R)
echo - Clear browser cache
echo - Check if quotations are loading correctly
echo.
start http://localhost:5173/admin/quotations
pause