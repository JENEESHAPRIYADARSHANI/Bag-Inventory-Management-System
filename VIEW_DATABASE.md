# How to View Your Database Tables

Your data is stored in AWS RDS MySQL database. Here are the ways to access it:

---

## Option 1: MySQL Command Line (Quick)

### Connect to Database
```bash
mysql -h quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com -u admin -p quotation_db
```

**Password:** `QuotationDB2024!`

### View Tables
```sql
-- Show all tables
SHOW TABLES;

-- View quotations
SELECT * FROM quotations;

-- View quotation items
SELECT * FROM quotation_items;

-- View orders
SELECT * FROM orders;

-- View order items
SELECT * FROM order_items;

-- Count records
SELECT COUNT(*) FROM quotations;
SELECT COUNT(*) FROM orders;
```

### Useful Queries
```sql
-- View quotations with details
SELECT 
    q.id,
    q.company_name,
    q.contact_person,
    q.email,
    q.status,
    q.total_amount,
    q.created_at
FROM quotations q
ORDER BY q.created_at DESC;

-- View quotation items with product info
SELECT 
    qi.id,
    qi.quotation_id,
    qi.product_id,
    qi.quantity,
    qi.unit_price,
    qi.discount,
    qi.line_total
FROM quotation_items qi
WHERE qi.quotation_id = 1;

-- View orders
SELECT 
    o.id,
    o.quotation_id,
    o.company_name,
    o.total_amount,
    o.created_at
FROM orders o
ORDER BY o.created_at DESC;
```

---

## Option 2: MySQL Workbench (GUI - Best for Browsing)

### Download
https://dev.mysql.com/downloads/workbench/

### Connection Settings
- **Connection Name:** Quotation DB (AWS)
- **Hostname:** quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com
- **Port:** 3306
- **Username:** admin
- **Password:** QuotationDB2024!
- **Default Schema:** quotation_db

### Steps
1. Open MySQL Workbench
2. Click "+" to create new connection
3. Enter the connection details above
4. Click "Test Connection"
5. Click "OK" to save
6. Double-click the connection to connect
7. Browse tables in the left sidebar

---

## Option 3: DBeaver (Free Universal Database Tool)

### Download
https://dbeaver.io/download/

### Connection Settings
- **Database:** MySQL
- **Host:** quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com
- **Port:** 3306
- **Database:** quotation_db
- **Username:** admin
- **Password:** QuotationDB2024!

---

## Option 4: Using API Endpoints

### View All Quotations
```bash
curl http://54.90.36.32:8080/api/quotations
```

### View Quotations by Email
```bash
curl "http://54.90.36.32:8080/api/quotations/search?email=test@example.com"
```

### View All Orders
```bash
curl http://54.90.36.32:8080/api/orders
```

### View Orders by Email
```bash
curl "http://54.90.36.32:8080/api/orders?email=test@example.com"
```

---

## Option 5: In Your Frontend Application

### View Quotations (User)
1. Open http://localhost:8080
2. Go to "My Quotations"
3. Enter your email
4. Click "Search"
5. You'll see all quotations for that email

### View All Quotations (Admin)
1. Open http://localhost:8080
2. Go to "Admin" section
3. You'll see all quotations in the system

### View Orders
1. Open http://localhost:8080
2. Go to "Orders" page
3. You'll see all converted orders

---

## Database Schema

### Tables in Your Database

#### 1. `quotations`
Stores quotation requests from customers.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| customer_id | VARCHAR(255) | Customer identifier |
| company_name | VARCHAR(255) | Company name |
| contact_person | VARCHAR(255) | Contact person name |
| email | VARCHAR(255) | Email address |
| phone | VARCHAR(20) | Phone number |
| status | VARCHAR(50) | DRAFT, SENT, ACCEPTED, CONVERTED |
| total_amount | DECIMAL(10,2) | Total quotation amount |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 2. `quotation_items`
Stores line items for each quotation.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| quotation_id | BIGINT | Foreign key to quotations |
| product_id | BIGINT | Product identifier |
| quantity | INT | Quantity ordered |
| unit_price | DECIMAL(10,2) | Price per unit |
| discount | DECIMAL(10,2) | Discount amount |
| line_total | DECIMAL(10,2) | Total for this line |

#### 3. `orders`
Stores converted orders.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| quotation_id | BIGINT | Original quotation ID |
| customer_id | VARCHAR(255) | Customer identifier |
| company_name | VARCHAR(255) | Company name |
| contact_person | VARCHAR(255) | Contact person name |
| email | VARCHAR(255) | Email address |
| phone | VARCHAR(20) | Phone number |
| total_amount | DECIMAL(10,2) | Total order amount |
| created_at | TIMESTAMP | Creation timestamp |

#### 4. `order_items`
Stores line items for each order.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| order_id | BIGINT | Foreign key to orders |
| product_id | BIGINT | Product identifier |
| quantity | INT | Quantity ordered |
| unit_price | DECIMAL(10,2) | Price per unit |
| discount | DECIMAL(10,2) | Discount amount |
| line_total | DECIMAL(10,2) | Total for this line |

---

## Quick Database Check Script

Create a file `check-database.bat`:

```batch
@echo off
echo Connecting to database...
echo.
mysql -h quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com -u admin -pQuotationDB2024! quotation_db -e "SHOW TABLES; SELECT COUNT(*) as 'Total Quotations' FROM quotations; SELECT COUNT(*) as 'Total Orders' FROM orders;"
echo.
pause
```

Run it to quickly see table counts.

---

## Troubleshooting

### Can't Connect to Database

**Check Security Group:**
```bash
aws rds describe-db-instances --db-instance-identifier quotation-db --region us-east-1 --query 'DBInstances[0].VpcSecurityGroups'
```

**Your IP might not be allowed.** To allow your IP:
```bash
# Get your public IP
curl ifconfig.me

# Add your IP to RDS security group (replace YOUR_IP)
aws ec2 authorize-security-group-ingress --group-id sg-XXXXX --protocol tcp --port 3306 --cidr YOUR_IP/32 --region us-east-1
```

### MySQL Client Not Installed

**Windows:**
Download from: https://dev.mysql.com/downloads/mysql/

Or use MySQL Workbench (includes client)

**Using PowerShell:**
```powershell
# Install via Chocolatey
choco install mysql

# Or download installer
Start-Process "https://dev.mysql.com/downloads/mysql/"
```

---

## Database Connection Details Summary

| Setting | Value |
|---------|-------|
| **Host** | quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com |
| **Port** | 3306 |
| **Database** | quotation_db |
| **Username** | admin |
| **Password** | QuotationDB2024! |
| **Region** | us-east-1 |

---

## Sample Data Check

After creating some quotations in your app, run:

```sql
-- Connect first
mysql -h quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com -u admin -p quotation_db

-- Then run these queries
SELECT 
    q.id,
    q.company_name,
    q.email,
    q.status,
    q.total_amount,
    COUNT(qi.id) as item_count
FROM quotations q
LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
GROUP BY q.id
ORDER BY q.created_at DESC;
```

This will show you all quotations with their item counts.

---

**Recommended:** Use MySQL Workbench for the best visual experience browsing your data!
