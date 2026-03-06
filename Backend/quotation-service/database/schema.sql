-- Quotation Management System Database Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS quotation_items;
DROP TABLE IF EXISTS quotations;

-- Create quotations table
CREATE TABLE quotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    order_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create quotation_items table
CREATE TABLE quotation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    line_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
    INDEX idx_quotation_id (quotation_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data for testing
INSERT INTO quotations (customer_id, company_name, contact_person, email, phone, status, total_amount) VALUES
('123', 'Test Company Ltd', 'John Doe', 'john@testcompany.com', '+1234567890', 'DRAFT', 0.00),
('456', 'Sample Corp', 'Jane Smith', 'jane@samplecorp.com', '+0987654321', 'SENT', 500.00),
('789', 'Demo Industries', 'Bob Johnson', 'bob@demoindustries.com', '+1122334455', 'ACCEPTED', 750.00);

INSERT INTO quotation_items (quotation_id, product_id, quantity, unit_price, discount, line_total) VALUES
(1, 1, 10, 0.00, 0.00, 0.00),
(1, 2, 5, 0.00, 0.00, 0.00),
(2, 1, 20, 25.00, 0.00, 500.00),
(3, 2, 50, 15.00, 0.00, 750.00);
