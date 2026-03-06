-- Drop payments table from payment_management_db
-- This script removes only the payments transaction table
-- Keeps saved_payment_methods table intact

USE payment_management_db;

-- Drop the payments table
DROP TABLE IF EXISTS payments;

-- Verify remaining tables
SHOW TABLES;
