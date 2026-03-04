-- ============================================
-- Check Logistics Database Data
-- ============================================
-- Use the database
USE logistics_db;
-- Show all tables
SHOW TABLES;
-- Count records in each table
SELECT 'delivery_tracking' AS table_name,
    COUNT(*) AS record_count
FROM delivery_tracking
UNION ALL
SELECT 'tracking_history' AS table_name,
    COUNT(*) AS record_count
FROM tracking_history;
-- View all delivery tracking records
SELECT *
FROM delivery_tracking;
-- View all tracking history records
SELECT *
FROM tracking_history;
-- View tracking with history (joined)
SELECT dt.trackingId,
    dt.orderId,
    dt.recipientName,
    dt.currentStatus,
    dt.createdAt,
    COUNT(th.id) AS history_count
FROM delivery_tracking dt
    LEFT JOIN tracking_history th ON th.delivery_tracking_id = dt.id
GROUP BY dt.id
ORDER BY dt.createdAt DESC;
-- View detailed history for each tracking
SELECT dt.trackingId,
    dt.orderId,
    th.status,
    th.message,
    th.location,
    th.updatedBy,
    th.updatedAt
FROM delivery_tracking dt
    LEFT JOIN tracking_history th ON th.delivery_tracking_id = dt.id
ORDER BY dt.trackingId,
    th.updatedAt;
-- Check latest status updates
SELECT trackingId,
    orderId,
    recipientName,
    currentStatus,
    currentLocation,
    estimatedDeliveryDate,
    updatedAt
FROM delivery_tracking
ORDER BY updatedAt DESC
LIMIT 10;