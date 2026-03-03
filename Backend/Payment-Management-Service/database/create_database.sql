-- Create Database
CREATE DATABASE IF NOT EXISTS payment_management_db;

USE payment_management_db;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    method VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    payment_date DATE NOT NULL,
    txn_ref VARCHAR(80),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
);

-- Create saved_payment_methods table
CREATE TABLE IF NOT EXISTS saved_payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL,
    card_holder_name VARCHAR(120) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    expiry_month INT NOT NULL,
    expiry_year INT NOT NULL,
    brand VARCHAR(40),
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_customer_name (customer_name),
    INDEX idx_status (status)
);

-- Create payment_cards table (for card management)
CREATE TABLE IF NOT EXISTS payment_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    card_holder_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(19) NOT NULL UNIQUE,
    expiry_date VARCHAR(7) NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_card_number (card_number),
    INDEX idx_is_active (is_active)
);

-- Insert sample data for payments
INSERT INTO payments (payment_id, order_id, customer_name, amount, method, status, payment_date, txn_ref, verified, created_at, updated_at)
VALUES 
('PAY-001', 'ORD-001', 'John Doe', 150.00, 'CARD', 'COMPLETED', '2024-01-15', 'TXN-12345', TRUE, NOW(), NOW()),
('PAY-002', 'ORD-002', 'Jane Smith', 250.50, 'ONLINE_TRANSFER', 'PENDING', '2024-01-16', 'TXN-12346', FALSE, NOW(), NOW()),
('PAY-003', 'ORD-003', 'Bob Johnson', 99.99, 'CASH', 'COMPLETED', '2024-01-17', NULL, TRUE, NOW(), NOW());

-- Insert sample data for saved payment methods
INSERT INTO saved_payment_methods (customer_name, type, card_holder_name, last4, expiry_month, expiry_year, brand, status, created_at, updated_at)
VALUES 
('John Doe', 'Card', 'John Doe', '0366', 12, 2026, 'Visa', 'ACTIVE', NOW(), NOW()),
('Jane Smith', 'Card', 'Jane Smith', '0005', 9, 2027, 'American Express', 'ACTIVE', NOW(), NOW());

-- Insert sample data for payment cards
INSERT INTO payment_cards (user_id, card_holder_name, card_number, expiry_date, cvv, card_type, is_default, is_active, created_at, updated_at)
VALUES 
(1, 'John Doe', '4532015112830366', '12/2026', '123', 'Visa', TRUE, TRUE, NOW(), NOW()),
(1, 'John Doe', '5425233430109903', '06/2025', '456', 'Mastercard', FALSE, TRUE, NOW(), NOW()),
(2, 'Jane Smith', '378282246310005', '09/2027', '789', 'American Express', TRUE, TRUE, NOW(), NOW());
