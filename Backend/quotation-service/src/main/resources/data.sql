-- Initialize products table with sample data
INSERT INTO products (id, name, description, unit_price) VALUES 
(1, 'Laptop - Dell XPS 15', 'High-performance laptop with 15-inch display', 1299.99),
(2, 'Monitor - LG 27 inch 4K', '27-inch 4K UHD monitor with USB-C', 399.99),
(3, 'Keyboard - Mechanical RGB', 'Mechanical gaming keyboard with RGB lighting', 89.99),
(4, 'Mouse - Wireless Gaming', 'High-precision wireless gaming mouse', 149.99),
(5, 'Headset - Noise Cancelling', 'Professional noise-cancelling headset', 199.99)
ON DUPLICATE KEY UPDATE 
name = VALUES(name), 
description = VALUES(description), 
unit_price = VALUES(unit_price);

-- Initialize quotations with sample data
INSERT INTO quotations (customer_id, company_name, contact_person, email, phone, status, total_amount, created_at, updated_at) VALUES
('CUST001', 'Tech Solutions Ltd', 'John Smith', 'john.smith@techsolutions.com', '+1-555-0123', 'DRAFT', 0.00, NOW(), NOW()),
('CUST002', 'Global Enterprises', 'Sarah Johnson', 'sarah.j@globalent.com', '+1-555-0456', 'SENT', 1500.00, NOW(), NOW()),
('CUST003', 'Innovation Corp', 'Mike Davis', 'mike.davis@innovationcorp.com', '+1-555-0789', 'DRAFT', 0.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
company_name = VALUES(company_name),
contact_person = VALUES(contact_person),
email = VALUES(email);

-- Initialize quotation items
INSERT INTO quotation_items (quotation_id, product_id, quantity, unit_price, discount, line_total) VALUES
-- Items for quotation 1 (DRAFT)
(1, 1, 2, 1299.99, 0.00, 2599.98),
(1, 2, 1, 399.99, 10.00, 359.99),

-- Items for quotation 2 (SENT)  
(2, 1, 1, 1299.99, 5.00, 1234.99),
(2, 3, 3, 89.99, 0.00, 269.97),

-- Items for quotation 3 (DRAFT)
(3, 2, 2, 399.99, 0.00, 799.98),
(3, 4, 1, 149.99, 0.00, 149.99)
ON DUPLICATE KEY UPDATE 
quantity = VALUES(quantity),
unit_price = VALUES(unit_price),
discount = VALUES(discount),
line_total = VALUES(line_total);

-- Update total amounts for quotations
UPDATE quotations SET total_amount = (
    SELECT COALESCE(SUM(line_total), 0) FROM quotation_items WHERE quotation_id = quotations.id
) WHERE id IN (1, 2, 3);
