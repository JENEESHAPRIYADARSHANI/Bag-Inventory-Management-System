@echo off
echo Fixing last4 column size...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p0904 -e "USE payment_management_db; ALTER TABLE saved_payment_methods MODIFY COLUMN last4 VARCHAR(500) NOT NULL;"
echo Done!
pause
