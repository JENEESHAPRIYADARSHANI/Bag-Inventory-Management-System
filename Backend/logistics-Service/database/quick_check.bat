@echo off
echo ============================================
echo Checking Logistics Database
echo ============================================
echo.

mysql -u root -pNuskyny@1234 -e "USE logistics_db; SELECT 'DELIVERY TRACKING RECORDS:' AS Info; SELECT trackingId, orderId, recipientName, currentStatus, createdAt FROM delivery_tracking ORDER BY createdAt DESC; SELECT ''; SELECT 'TRACKING HISTORY RECORDS:' AS Info; SELECT COUNT(*) AS total_history_entries FROM tracking_history;"

echo.
echo ============================================
echo Check complete!
echo ============================================
pause
