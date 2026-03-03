# Quotation Management System

## Overview
A comprehensive quotation and order management system built with Spring Boot backend and React frontend. The system manages the complete lifecycle of quotations from creation to order conversion.

---

## System Functions

### 1. Quotation Management
- **Create Quotation**: Customers can create quotation requests with multiple products
- **Review Quotation**: Admin reviews and sets pricing/discounts for each item
- **Approve & Send**: Admin approves quotation and sends to customer (status: SENT)
- **Accept Quotation**: Customer accepts the quotation (status: ACCEPTED)
- **Convert to Order**: Admin converts accepted quotation to order (status: CONVERTED)
- **Search Quotations**: Search quotations by email or customer ID
- **View All Quotations**: Admin can view all quotations in the system

### 2. Order Management
- **View All Orders**: Admin can view all converted orders
- **View User Orders**: Customers can view their own orders filtered by email
- **Track Order Status**: Monitor order status (CONFIRMED, PROCESSING, SHIPPED, DELIVERED)

### 3. Product Management
- **Get Products**: Retrieve available products from product service
- **Product Pricing**: Dynamic pricing based on admin-set unit prices and discounts

---

## Database Structure

### Database: `quotation_db`

### Table: `quotations`
| Column          | Type           | Description                          |
|-----------------|----------------|--------------------------------------|
| id              | BIGINT (PK)    | Auto-generated quotation ID          |
| customer_id     | VARCHAR(255)   | Customer identifier                  |
| company_name    | VARCHAR(255)   | Customer company name                |
| contact_person  | VARCHAR(255)   | Contact person name                  |
| email           | VARCHAR(255)   | Customer email                       |
| phone           | VARCHAR(255)   | Customer phone number                |
| status          | VARCHAR(50)    | DRAFT, SENT, ACCEPTED, CONVERTED     |
| total_amount    | DECIMAL(10,2)  | Total quotation amount               |
| created_at      | TIMESTAMP      | Creation timestamp                   |

### Table: `quotation_items`
| Column          | Type           | Description                          |
|-----------------|----------------|--------------------------------------|
| id              | BIGINT (PK)    | Auto-generated item ID               |
| quotation_id    | BIGINT (FK)    | Reference to quotations table        |
| product_id      | BIGINT         | Product identifier                   |
| quantity        | INT            | Quantity ordered                     |
| unit_price      | DECIMAL(10,2)  | Price per unit                       |
| discount        | DECIMAL(10,2)  | Discount amount                      |
| line_total      | DECIMAL(10,2)  | Total for this line item             |

### Table: `orders`
| Column          | Type           | Description                          |
|-----------------|----------------|--------------------------------------|
| id              | BIGINT (PK)    | Auto-generated order ID              |
| quotation_id    | BIGINT         | Reference to original quotation      |
| customer_id     | VARCHAR(255)   | Customer identifier                  |
| email           | VARCHAR(255)   | Customer email                       |
| company_name    | VARCHAR(255)   | Customer company name                |
| contact_person  | VARCHAR(255)   | Contact person name                  |
| total_amount    | DECIMAL(10,2)  | Total order amount                   |
| status          | VARCHAR(50)    | CONFIRMED, PROCESSING, SHIPPED       |
| created_at      | TIMESTAMP      | Order creation timestamp             |

### Table: `order_items`
| Column          | Type           | Description                          |
|-----------------|----------------|--------------------------------------|
| id              | BIGINT (PK)    | Auto-generated item ID               |
| order_id        | BIGINT (FK)    | Reference to orders table            |
| product_id      | BIGINT         | Product identifier                   |
| quantity        | INT            | Quantity ordered                     |
| unit_price      | DECIMAL(10,2)  | Price per unit                       |
| discount        | DECIMAL(10,2)  | Discount amount                      |

### Relationships
- `quotations` → `quotation_items` (One-to-Many)
- `orders` → `order_items` (One-to-Many)
- `quotations.id` → `orders.quotation_id` (One-to-One)

---

## API Endpoints

### Base URL
```
http://localhost:8080/api
```

---

### Quotation APIs

#### 1. Get All Products
```http
GET /quotations/products
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 100.00
  }
]
```

---

#### 2. Create Quotation
```http
POST /quotations
Content-Type: application/json
```
**Request Body:**
```json
{
  "customerId": "user123",
  "companyName": "ABC Company",
  "contactPerson": "John Doe",
  "email": "john@abc.com",
  "phone": "1234567890",
  "items": [
    {
      "productId": 1,
      "quantity": 5
    },
    {
      "productId": 2,
      "quantity": 3
    }
  ]
}
```
**Response:**
```json
{
  "id": 1,
  "customerId": "user123",
  "companyName": "ABC Company",
  "contactPerson": "John Doe",
  "email": "john@abc.com",
  "phone": "1234567890",
  "status": "DRAFT",
  "totalAmount": 0.00,
  "createdAt": "2024-01-15T10:30:00",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 5,
      "unitPrice": 0.00,
      "discount": 0.00,
      "lineTotal": 0.00
    }
  ]
}
```

---

#### 3. Get All Quotations
```http
GET /quotations
```
**Response:** Array of quotation objects

---

#### 4. Get Quotation by ID
```http
GET /quotations/{id}
```
**Example:** `GET /quotations/1`

**Response:** Single quotation object

---

#### 5. Search Quotations by Email
```http
GET /quotations/search?email={email}
```
**Example:** `GET /quotations/search?email=john@abc.com`

**Response:** Array of quotations matching the email

---

#### 6. Update and Send Quotation (Admin)
```http
PUT /quotations/{id}/send
Content-Type: application/json
```
**Request Body:**
```json
{
  "items": [
    {
      "itemId": 1,
      "unitPrice": 100.00,
      "discount": 10.00
    },
    {
      "itemId": 2,
      "unitPrice": 50.00,
      "discount": 5.00
    }
  ]
}
```
**Response:** Updated quotation with status "SENT"

**Note:** This endpoint:
- Sets unit prices and discounts for each item
- Calculates line totals and total amount
- Changes status from DRAFT to SENT
- Makes quotation ready for customer review

---

#### 7. Accept Quotation (Customer)
```http
PUT /quotations/{id}/accept
```
**Example:** `PUT /quotations/1/accept`

**Response:** Quotation with status "ACCEPTED"

**Note:** Customer accepts the quotation, making it ready for conversion to order

---

#### 8. Convert Quotation to Order (Admin)
```http
POST /quotations/{id}/convert
```
**Example:** `POST /quotations/1/convert`

**Response:** Quotation with status "CONVERTED"

**Note:** This endpoint:
- Creates a new order in the orders table
- Copies all quotation data to the order
- Changes quotation status to CONVERTED
- Order status is set to CONFIRMED

---

### Order APIs

#### 9. Get All Orders
```http
GET /orders
```
**Response:**
```json
[
  {
    "id": 1,
    "quotationId": 1,
    "customerId": "user123",
    "email": "john@abc.com",
    "companyName": "ABC Company",
    "contactPerson": "John Doe",
    "totalAmount": 450.00,
    "status": "CONFIRMED",
    "createdAt": "2024-01-15T11:00:00",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 5,
        "unitPrice": 100.00,
        "discount": 10.00
      }
    ]
  }
]
```

---

#### 10. Get Orders by Email
```http
GET /orders?email={email}
```
**Example:** `GET /orders?email=john@abc.com`

**Response:** Array of orders for the specified email

---

#### 11. Get Orders by Customer ID
```http
GET /orders?customerId={customerId}
```
**Example:** `GET /orders?customerId=user123`

**Response:** Array of orders for the specified customer

---

#### 12. Get Order by ID
```http
GET /orders/{id}
```
**Example:** `GET /orders/1`

**Response:** Single order object with items

---

## Status Flow

```
DRAFT → SENT → ACCEPTED → CONVERTED
  ↓       ↓        ↓          ↓
Created  Approved  Customer   Order
         by Admin  Accepted   Created
```

### Status Descriptions
- **DRAFT**: Initial status when quotation is created
- **SENT**: Admin has approved and sent quotation to customer
- **ACCEPTED**: Customer has accepted the quotation
- **CONVERTED**: Quotation has been converted to an order

---

## Quick Start

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### Database Setup
```sql
CREATE DATABASE quotation_db;
```

### Configuration
Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quotation_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### Run Backend
```bash
cd Backend/quotation-service
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

---

## Testing with Postman

### Complete Workflow Example

**Step 1: Create Quotation**
```
POST http://localhost:8080/api/quotations
Body: {
  "customerId": "user123",
  "companyName": "Test Co",
  "contactPerson": "John",
  "email": "john@test.com",
  "phone": "1234567890",
  "items": [{"productId": 1, "quantity": 5}]
}
```

**Step 2: Admin Approves (Update & Send)**
```
PUT http://localhost:8080/api/quotations/1/send
Body: {
  "items": [{"itemId": 1, "unitPrice": 100.00, "discount": 10.00}]
}
```

**Step 3: Customer Accepts**
```
PUT http://localhost:8080/api/quotations/1/accept
```

**Step 4: Admin Converts to Order**
```
POST http://localhost:8080/api/quotations/1/convert
```

**Step 5: View Order**
```
GET http://localhost:8080/api/orders?email=john@test.com
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK`: Successful operation
- `400 Bad Request`: Invalid request data or business rule violation
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Notes

- All monetary values are stored as DECIMAL(10,2)
- Timestamps are automatically generated
- Foreign key constraints ensure data integrity
- Cascade operations handle related records
- CORS is enabled for frontend integration

---

**Version:** 1.0  
**Last Updated:** 2024
