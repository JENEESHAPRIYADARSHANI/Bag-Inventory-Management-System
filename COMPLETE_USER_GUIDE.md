# Complete User Guide - Quotation Management System

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [How to Run Backend](#how-to-run-backend)
3. [How to Run Frontend](#how-to-run-frontend)
4. [API Documentation](#api-documentation)
5. [Testing with Postman](#testing-with-postman)
6. [Database Access](#database-access)
7. [Complete Workflow](#complete-workflow)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software:
1. **Java 17** - For backend
   - Download: https://adoptium.net/
   - Verify: `java -version`

2. **Maven** - For building backend
   - Download: https://maven.apache.org/download.cgi
   - Verify: `mvn -version`

3. **Node.js 18+** - For frontend
   - Download: https://nodejs.org/
   - Verify: `node -version`

4. **MySQL 8.0** - For database
   - Download: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`

5. **Postman** (Optional) - For API testing
   - Download: https://www.postman.com/downloads/

---

## How to Run Backend

### Step 1: Setup Database

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE quotation_db;

# Verify
SHOW DATABASES;

# Exit
EXIT;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click "Create Schema" button
4. Name: `quotation_db`
5. Click "Apply"

### Step 2: Configure Database Connection

Edit `Backend/quotation-service/src/main/resources/application.properties`:

```properties
spring.application.name=quotation-service
spring.datasource.url=jdbc:mysql://localhost:3306/quotation_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
server.port=8080

# Microservice URLs
product.service.url=http://localhost:8081/api/products
order.service.url=http://localhost:8082
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### Step 3: Build the Backend

#### Windows:
```bash
cd Backend\quotation-service
mvnw clean install
```

#### Mac/Linux:
```bash
cd Backend/quotation-service
./mvnw clean install
```

### Step 4: Run the Backend

#### Option A: Using Maven
```bash
cd Backend/quotation-service
mvnw spring-boot:run
```

#### Option B: Using JAR file
```bash
cd Backend/quotation-service
java -jar target/quotation-service-0.0.1-SNAPSHOT.jar
```

#### Option C: Using start script
**Windows:**
```bash
cd Backend/quotation-service
start.bat
```

**Mac/Linux:**
```bash
cd Backend/quotation-service
./start.sh
```

### Step 5: Verify Backend is Running

Open browser and go to:
```
http://localhost:8080/api/quotations/products
```

You should see JSON response with products.

**Expected Output:**
```json
[
  {
    "id": 1,
    "name": "Laptop - Dell XPS 15",
    "price": 1299.99
  },
  {
    "id": 2,
    "name": "Monitor - LG 27 inch 4K",
    "price": 399.99
  }
]
```

---

## How to Run Frontend

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Backend URL

Edit `frontend/.env.development`:

```env
# For local backend
VITE_API_URL=http://localhost:8080/api

# For AWS backend (if deployed)
# VITE_API_URL=http://your-aws-ip:8080/api
```

### Step 3: Run Frontend

```bash
cd frontend
npm run dev
```

### Step 4: Access Frontend

Open browser and go to:
```
http://localhost:8080
```

**Note:** The frontend runs on port 8080 (configured in vite.config.ts)

---

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### 1. Get Products

**Endpoint:** `GET /quotations/products`

**Description:** Get list of available products

**Request:**
```http
GET http://localhost:8080/api/quotations/products
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop - Dell XPS 15",
    "price": 1299.99
  },
  {
    "id": 2,
    "name": "Monitor - LG 27 inch 4K",
    "price": 399.99
  }
]
```

---

### 2. Create Quotation

**Endpoint:** `POST /quotations`

**Description:** Create a new quotation (User)

**Request:**
```http
POST http://localhost:8080/api/quotations
Content-Type: application/json

{
  "customerId": "CUST001",
  "companyName": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "email": "john@techsolutions.com",
  "phone": "+1-555-0123",
  "items": [
    {
      "productId": 1,
      "quantity": 5
    },
    {
      "productId": 2,
      "quantity": 10
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "customerId": "CUST001",
  "companyName": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "email": "john@techsolutions.com",
  "phone": "+1-555-0123",
  "status": "DRAFT",
  "totalAmount": 10499.85,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 5,
      "unitPrice": 1299.99,
      "discount": 0,
      "lineTotal": 6499.95
    },
    {
      "id": 2,
      "productId": 2,
      "quantity": 10,
      "unitPrice": 399.99,
      "discount": 0,
      "lineTotal": 3999.90
    }
  ],
  "createdAt": "2026-03-05T10:30:00"
}
```

---

### 3. Get All Quotations

**Endpoint:** `GET /quotations`

**Description:** Get all quotations (Admin)

**Request:**
```http
GET http://localhost:8080/api/quotations
```

**Response:**
```json
[
  {
    "id": 1,
    "customerId": "CUST001",
    "companyName": "Tech Solutions Inc",
    "status": "DRAFT",
    "totalAmount": 10499.85,
    "createdAt": "2026-03-05T10:30:00"
  }
]
```

---

### 4. Get Quotation by ID

**Endpoint:** `GET /quotations/{id}`

**Description:** Get specific quotation details

**Request:**
```http
GET http://localhost:8080/api/quotations/1
```

**Response:**
```json
{
  "id": 1,
  "customerId": "CUST001",
  "companyName": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "email": "john@techsolutions.com",
  "phone": "+1-555-0123",
  "status": "DRAFT",
  "totalAmount": 10499.85,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 5,
      "unitPrice": 1299.99,
      "discount": 0,
      "lineTotal": 6499.95
    }
  ],
  "createdAt": "2026-03-05T10:30:00"
}
```

---

### 5. Search Quotations by Email

**Endpoint:** `GET /quotations/search?email={email}`

**Description:** Search quotations by customer email

**Request:**
```http
GET http://localhost:8080/api/quotations/search?email=john@techsolutions.com
```

**Response:**
```json
[
  {
    "id": 1,
    "customerId": "CUST001",
    "companyName": "Tech Solutions Inc",
    "email": "john@techsolutions.com",
    "status": "DRAFT",
    "totalAmount": 10499.85
  }
]
```

---

### 6. Update and Send Quotation

**Endpoint:** `PUT /quotations/{id}/send`

**Description:** Admin updates prices/discounts and sends to customer

**Request:**
```http
PUT http://localhost:8080/api/quotations/1/send
Content-Type: application/json

{
  "items": [
    {
      "itemId": 1,
      "unitPrice": 1199.99,
      "discount": 100.00
    },
    {
      "itemId": 2,
      "unitPrice": 379.99,
      "discount": 50.00
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "status": "SENT",
  "totalAmount": 9649.85,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 5,
      "unitPrice": 1199.99,
      "discount": 100.00,
      "lineTotal": 5899.95
    },
    {
      "id": 2,
      "productId": 2,
      "quantity": 10,
      "unitPrice": 379.99,
      "discount": 50.00,
      "lineTotal": 3749.90
    }
  ]
}
```

---

### 7. Accept Quotation

**Endpoint:** `PUT /quotations/{id}/accept`

**Description:** Customer accepts the quotation

**Request:**
```http
PUT http://localhost:8080/api/quotations/1/accept
```

**Response:**
```json
{
  "id": 1,
  "status": "ACCEPTED",
  "totalAmount": 9649.85
}
```

---

### 8. Convert to Order

**Endpoint:** `POST /quotations/{id}/convert`

**Description:** Admin converts accepted quotation to order

**Request:**
```http
POST http://localhost:8080/api/quotations/1/convert
```

**Response (Success - when Order Service is available):**
```json
{
  "id": 1,
  "status": "CONVERTED",
  "orderId": 456,
  "totalAmount": 9649.85
}
```

**Response (Error - when Order Service is unavailable):**
```json
{
  "timestamp": "2026-03-05T10:45:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Failed to convert quotation to order. Order Management Service may be unavailable",
  "path": "/api/quotations/1/convert"
}
```

---

## Testing with Postman

### Setup Postman Collection

#### 1. Create New Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name: "Quotation Management System"
4. Click "Create"

#### 2. Add Environment Variables
1. Click "Environments" (left sidebar)
2. Click "+" to create new environment
3. Name: "Local Development"
4. Add variables:
   - `base_url`: `http://localhost:8080/api`
   - `quotation_id`: `1` (will be updated)
   - `email`: `john@techsolutions.com`

#### 3. Import Requests

**Request 1: Get Products**
- Method: GET
- URL: `{{base_url}}/quotations/products`
- Save as: "1. Get Products"

**Request 2: Create Quotation**
- Method: POST
- URL: `{{base_url}}/quotations`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "customerId": "CUST001",
  "companyName": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "email": "{{email}}",
  "phone": "+1-555-0123",
  "items": [
    {
      "productId": 1,
      "quantity": 5
    }
  ]
}
```
- Tests (to save quotation ID):
```javascript
var jsonData = pm.response.json();
pm.environment.set("quotation_id", jsonData.id);
```
- Save as: "2. Create Quotation"

**Request 3: Get All Quotations**
- Method: GET
- URL: `{{base_url}}/quotations`
- Save as: "3. Get All Quotations"

**Request 4: Get Quotation by ID**
- Method: GET
- URL: `{{base_url}}/quotations/{{quotation_id}}`
- Save as: "4. Get Quotation by ID"

**Request 5: Search by Email**
- Method: GET
- URL: `{{base_url}}/quotations/search?email={{email}}`
- Save as: "5. Search by Email"

**Request 6: Send Quotation**
- Method: PUT
- URL: `{{base_url}}/quotations/{{quotation_id}}/send`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "items": [
    {
      "itemId": 1,
      "unitPrice": 1199.99,
      "discount": 100.00
    }
  ]
}
```
- Save as: "6. Send Quotation (Admin)"

**Request 7: Accept Quotation**
- Method: PUT
- URL: `{{base_url}}/quotations/{{quotation_id}}/accept`
- Save as: "7. Accept Quotation (Customer)"

**Request 8: Convert to Order**
- Method: POST
- URL: `{{base_url}}/quotations/{{quotation_id}}/convert`
- Save as: "8. Convert to Order (Admin)"

### Testing Workflow in Postman

1. **Run "1. Get Products"** - Verify products are available
2. **Run "2. Create Quotation"** - Creates quotation, saves ID
3. **Run "4. Get Quotation by ID"** - Verify quotation created (status: DRAFT)
4. **Run "6. Send Quotation"** - Admin updates and sends (status: SENT)
5. **Run "7. Accept Quotation"** - Customer accepts (status: ACCEPTED)
6. **Run "8. Convert to Order"** - Admin converts (status: CONVERTED)

---

## Database Access

### Using MySQL Command Line

#### 1. Connect to Database
```bash
mysql -u root -p
# Enter your password

# Use the database
USE quotation_db;
```

#### 2. View Tables
```sql
SHOW TABLES;
```

**Expected Output:**
```
+-------------------------+
| Tables_in_quotation_db  |
+-------------------------+
| quotations              |
| quotation_items         |
+-------------------------+
```

#### 3. View Quotations
```sql
SELECT * FROM quotations;
```

**Example Output:**
```
+----+-------------+---------------------+----------------+-------------------------+------------+--------+--------------+---------------------+
| id | customer_id | company_name        | contact_person | email                   | phone      | status | total_amount | created_at          |
+----+-------------+---------------------+----------------+-------------------------+------------+--------+--------------+---------------------+
|  1 | CUST001     | Tech Solutions Inc  | John Doe       | john@techsolutions.com  | +1-555-0123| DRAFT  |    10499.85  | 2026-03-05 10:30:00 |
+----+-------------+---------------------+----------------+-------------------------+------------+--------+--------------+---------------------+
```

#### 4. View Quotation Items
```sql
SELECT * FROM quotation_items;
```

**Example Output:**
```
+----+--------------+------------+----------+------------+----------+------------+
| id | quotation_id | product_id | quantity | unit_price | discount | line_total |
+----+--------------+------------+----------+------------+----------+------------+
|  1 |            1 |          1 |        5 |    1299.99 |     0.00 |    6499.95 |
|  2 |            1 |          2 |       10 |     399.99 |     0.00 |    3999.90 |
+----+--------------+------------+----------+------------+----------+------------+
```

#### 5. View Quotation with Items (JOIN)
```sql
SELECT 
    q.id AS quotation_id,
    q.company_name,
    q.status,
    q.total_amount,
    qi.product_id,
    qi.quantity,
    qi.unit_price,
    qi.line_total
FROM quotations q
LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
WHERE q.id = 1;
```

#### 6. Count Quotations by Status
```sql
SELECT status, COUNT(*) as count
FROM quotations
GROUP BY status;
```

**Example Output:**
```
+----------+-------+
| status   | count |
+----------+-------+
| DRAFT    |     5 |
| SENT     |     3 |
| ACCEPTED |     2 |
| CONVERTED|     1 |
+----------+-------+
```

### Using MySQL Workbench

#### 1. Connect to Database
1. Open MySQL Workbench
2. Click on your connection
3. Enter password
4. Double-click `quotation_db` in left panel

#### 2. View Data
1. Right-click on `quotations` table
2. Select "Select Rows - Limit 1000"
3. View data in grid

#### 3. Run Custom Queries
1. Click "SQL" icon (new query tab)
2. Type your SQL query
3. Click lightning bolt icon to execute

---

## Complete Workflow

### Scenario: Complete Quotation to Order Process

#### Step 1: Customer Requests Quotation

**Action:** User fills quotation request form

**API Call:**
```http
POST /api/quotations
{
  "customerId": "CUST001",
  "companyName": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "email": "john@techsolutions.com",
  "phone": "+1-555-0123",
  "items": [
    {"productId": 1, "quantity": 5},
    {"productId": 2, "quantity": 10}
  ]
}
```

**Database State:**
```sql
-- quotations table
id=1, status='DRAFT', total_amount=10499.85

-- quotation_items table
id=1, quotation_id=1, product_id=1, quantity=5, unit_price=1299.99
id=2, quotation_id=1, product_id=2, quantity=10, unit_price=399.99
```

**Frontend:** Shows "Quotation submitted successfully"

---

#### Step 2: Admin Reviews Quotation

**Action:** Admin views all quotations

**API Call:**
```http
GET /api/quotations
```

**Frontend:** Admin dashboard shows list of quotations

**Database Query:**
```sql
SELECT * FROM quotations WHERE status = 'DRAFT';
```

---

#### Step 3: Admin Updates Prices and Sends

**Action:** Admin adjusts prices/discounts and sends to customer

**API Call:**
```http
PUT /api/quotations/1/send
{
  "items": [
    {"itemId": 1, "unitPrice": 1199.99, "discount": 100.00},
    {"itemId": 2, "unitPrice": 379.99, "discount": 50.00}
  ]
}
```

**Database State:**
```sql
-- quotations table
id=1, status='SENT', total_amount=9649.85

-- quotation_items table (updated)
id=1, unit_price=1199.99, discount=100.00, line_total=5899.95
id=2, unit_price=379.99, discount=50.00, line_total=3749.90
```

**Frontend:** Shows "Quotation sent to customer"

---

#### Step 4: Customer Views Quotation

**Action:** Customer checks their email and views quotation

**API Call:**
```http
GET /api/quotations/search?email=john@techsolutions.com
```

**Frontend:** Customer portal shows quotation with updated prices

**Database Query:**
```sql
SELECT * FROM quotations WHERE email = 'john@techsolutions.com' AND status = 'SENT';
```

---

#### Step 5: Customer Accepts Quotation

**Action:** Customer clicks "Accept Quotation"

**API Call:**
```http
PUT /api/quotations/1/accept
```

**Database State:**
```sql
-- quotations table
id=1, status='ACCEPTED', total_amount=9649.85
```

**Frontend:** Shows "Quotation accepted successfully"

---

#### Step 6: Admin Converts to Order

**Action:** Admin converts accepted quotation to order

**API Call:**
```http
POST /api/quotations/1/convert
```

**What Happens:**
1. Quotation Service calls Order Management Service API
2. Order is created in Order Management Service
3. Order ID is returned
4. Quotation is updated with order reference

**Database State:**
```sql
-- quotations table
id=1, status='CONVERTED', order_id=456, total_amount=9649.85
```

**Frontend:** Shows "Order created successfully. Order ID: 456"

---

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    QUOTATION WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

1. CREATE QUOTATION (User)
   ↓
   Status: DRAFT
   Database: quotations table (status='DRAFT')
   ↓

2. ADMIN REVIEWS
   ↓
   API: GET /quotations
   Frontend: Admin Dashboard
   ↓

3. ADMIN UPDATES & SENDS
   ↓
   API: PUT /quotations/{id}/send
   Status: SENT
   Database: quotations table (status='SENT')
   ↓

4. CUSTOMER VIEWS
   ↓
   API: GET /quotations/search?email=xxx
   Frontend: Customer Portal
   ↓

5. CUSTOMER ACCEPTS
   ↓
   API: PUT /quotations/{id}/accept
   Status: ACCEPTED
   Database: quotations table (status='ACCEPTED')
   ↓

6. ADMIN CONVERTS TO ORDER
   ↓
   API: POST /quotations/{id}/convert
   Calls: Order Management Service
   Status: CONVERTED
   Database: quotations table (status='CONVERTED', order_id=456)
   ↓

7. ORDER CREATED
   ↓
   Order Management Service Database
   orders table (order_id=456)
```

---

## Troubleshooting

### Backend Won't Start

**Problem:** Port 8080 already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>
```

---

**Problem:** Database connection failed

**Solution:**
1. Check MySQL is running
2. Verify database exists: `SHOW DATABASES;`
3. Check username/password in application.properties
4. Check MySQL port (default: 3306)

---

**Problem:** Table doesn't exist

**Solution:**
```sql
-- Check if tables exist
SHOW TABLES;

-- If not, check application.properties
spring.jpa.hibernate.ddl-auto=update

-- Restart backend to create tables
```

---

### Frontend Won't Start

**Problem:** Port 8080 already in use

**Solution:** Change port in `vite.config.ts`:
```javascript
server: {
  port: 5173,  // Change to different port
}
```

---

**Problem:** Cannot connect to backend

**Solution:**
1. Check backend is running: `http://localhost:8080/api/quotations/products`
2. Check `.env.development` has correct URL
3. Check CORS configuration in backend

---

### API Errors

**Problem:** 404 Not Found

**Solution:**
- Check URL is correct
- Verify backend is running
- Check endpoint exists in controller

---

**Problem:** 500 Internal Server Error

**Solution:**
- Check backend logs in console
- Check database connection
- Verify request body format

---

**Problem:** CORS Error

**Solution:**
- Check `CorsConfig.java` includes your frontend URL
- Restart backend after CORS changes
- Clear browser cache

---

## Quick Reference

### Start Everything

**Backend:**
```bash
cd Backend/quotation-service
mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Database:**
```bash
mysql -u root -p
USE quotation_db;
```

### URLs

- Frontend: http://localhost:8080
- Backend API: http://localhost:8080/api
- Products: http://localhost:8080/api/quotations/products

### Database Tables

- `quotations` - Main quotation data
- `quotation_items` - Quotation line items

### Status Flow

DRAFT → SENT → ACCEPTED → CONVERTED

---

**For more help, check:**
- `REFACTORING_COMPLETE.md` - Technical architecture details
- `AWS_DEPLOYMENT_COMPLETE.md` - Cloud deployment guide
- `MICROSERVICES_ARCHITECTURE_ISSUE.md` - Architecture patterns
