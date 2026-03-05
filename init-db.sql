-- Initialize quotation_db database
-- This script runs automatically when MySQL container starts for the first time

CREATE DATABASE IF NOT EXISTS quotation_db;
USE quotation_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON quotation_db.* TO 'root'@'%';
FLUSH PRIVILEGES;

-- Tables will be auto-created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- This script just ensures the database exists
