-- Update database schema for AWS KMS encrypted data
-- Run this script after setting up AWS KMS

USE payment_management_db;

-- Increase last4 column size to store encrypted data
-- Encrypted data is much longer than plain text
ALTER TABLE saved_payment_methods 
MODIFY COLUMN last4 VARCHAR(500);

-- Verify the change
DESCRIBE saved_payment_methods;
