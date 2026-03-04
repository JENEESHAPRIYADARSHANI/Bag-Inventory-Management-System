# Quotation Microservice

A Spring Boot microservice for managing quotations in a distributed system. This service handles the complete quotation lifecycle from draft creation to order conversion, integrating with Product and Order microservices.

## ✅ Recent Fixes (Latest Update)

**All issues resolved!** The application now works properly:
- ✅ Product dropdown shows temporary products (5 sample products)
- ✅ Admin can edit prices and apply discounts
- ✅ Complete workflow: DRAFT → SENT → ACCEPTED → CONVERTED
- ✅ All buttons and actions working correctly
- ✅ Microservice URLs configured in application.properties
- ✅ **NEW: Built-in mock Order Service** - Orders saved locally and displayed on orders page!

See [FRONTEND_FIXES.md](FRONTEND_FIXES.md) for detailed fix information.  
See [ORDER_MOCK_FEATURE.md](ORDER_MOCK_FEATURE.md) for the new order tracking feature.

### ⚠️ No More "Error converting to order"!

Orders are now saved locally in the Quotation Service. When you convert a quotation to an order, it's automatically saved and can be viewed on the orders page at `http://localhost:8080/orders.html`. No external Order Service needed!

---

## 🏗️ Architecture Overview

This quotation service is part of a microservices architecture with three main components:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Product        │      │  Quotation      │      │  Order          │
│  Service        │◄─────┤  Service        │─────►│  Service        │
│  (Port 8081)    │      │  (Port 8080)    │      │  (Port 8082)    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Service Responsibilities

- **Product Service**: Manages product catalog and pricing
- **Quotation Service** (This service): Creates and manages quotations, applies discounts
- **Order Service**: Handles final orders converted from accepted quotations

---

## 🔗 Connecting to Other Microservices

### Configuration

The service connects to other microservices via REST APIs. Configure the endpoints in `src/main/resources/application.properties`:

```properties
# Product Service URL - for fetching product data
product.service.url=http://localhost:8081/api/products

# Order Service URL - for creating orders from quotations
order.service.url=http://localhost:8082/api/orders
```

### Update for Your Environment

If your Product or Order services are running on different hosts/ports:

1. Open `src/main/resources/application.properties`
2. Update the URLs with your actual endpoints:
   ```properties
   product.service.url=http://your-product-service-host:port/api/products
   order.service.url=http://your-order-service-host:port/api/orders
   ```

### Fallback Mode (Temporary Products)

If the Product Service is unavailable, this service automatically uses temporary product data:
- Laptop - Dell XPS 15 ($1299.99)
- Monitor - LG 27 inch 4K ($399.99)
- Keyboard - Mechanical RGB ($89.99)
- Mouse - Wireless Gaming ($59.99)
- Headset - Noise Cancelling ($149.99)

This allows you to test the quotation service independently without requiring the Product Service to be running.

---

## 🚀 Getting Started

### Prerequisites

- Java 25 or higher
- Maven 3.6+
- MySQL 8.0+ (running on localhost:3306)
- MySQL database credentials configured in `application.properties`

### Database Setup

The service automatically creates the database if it doesn't exist. Default configuration:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quotation_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=Wr250x&@8052
```

Update these credentials in `application.properties` to match your MySQL setup.

### Running the Application

1. **Build the project**:
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or run the JAR directly:
   ```bash
   java -jar target/quotation-service-0.0.1-SNAPSHOT.jar
   ```

3. **Access the application**:
   - API Base URL: `http://localhost:8080`
   - Frontend: `http://localhost:8080/index.html`

---

## 📋 API Endpoints

### Product Proxy

#### Get Products
```http
GET /api/quotations/products
```
Fetches products from the Product Service (or returns temporary products if unavailable).

**Response**:
```json
[
  {
    "id": 1,
    "name": "Laptop - Dell XPS 15",
    "price": 1299.99
  }
]
```

### Quotation Management

#### Create Quotation (Draft)
```http
POST /api/quotations
Content-Type: application/json

{
  "customerId": "CUST-123",
  "companyName": "Tech Innovations Inc",
  "contactPerson": "John Doe",
  "email": "john@example.com",
  "phone": "555-0199",
  "items": [
    {
      "productId": 1,
      "quantity": 10
    },
    {
      "productId": 2,
      "quantity": 5
    }
  ]
}
```

**Response**: Quotation object with status `DRAFT`

#### Get All Quotations
```http
GET /api/quotations
```

#### Get Quotation by ID
```http
GET /api/quotations/{id}
```

#### Search Quotations by Email
```http
GET /api/quotations/search?email=john@example.com
```

#### Update and Send Quotation
```http
PUT /api/quotations/{id}/send
Content-Type: application/json

{
  "items": [
    {
      "itemId": 1,
      "unitPrice": 1250.00,
      "discount": 50.00
    }
  ]
}
```

Changes status from `DRAFT` to `SENT`. Allows admin to adjust prices and apply discounts.

#### Accept Quotation
```http
PUT /api/quotations/{id}/accept
```

Changes status from `SENT` to `ACCEPTED`. Customer accepts the quotation.

#### Convert to Order
```http
POST /api/quotations/{id}/convert
```

Changes status from `ACCEPTED` to `CONVERTED`. Sends order data to the Order Service.

---

## 🔄 Quotation Workflow

```
1. DRAFT      → Customer requests quotation
                ↓
2. SENT       → Admin reviews, applies discounts, sends to customer
                ↓
3. ACCEPTED   → Customer accepts the quotation
                ↓
4. CONVERTED  → System converts to order (sent to Order Service)
```

### Detailed Flow

1. **Create Draft** (`POST /api/quotations`)
   - Customer submits quotation request with product IDs and quantities
   - System fetches current prices from Product Service
   - Creates quotation with status `DRAFT`

2. **Send Quotation** (`PUT /api/quotations/{id}/send`)
   - Admin reviews the draft
   - Can adjust unit prices and apply discounts
   - System recalculates totals
   - Status changes to `SENT`

3. **Accept Quotation** (`PUT /api/quotations/{id}/accept`)
   - Customer reviews and accepts
   - Status changes to `ACCEPTED`

4. **Convert to Order** (`POST /api/quotations/{id}/convert`)
   - Admin or system converts accepted quotation
   - Sends complete order data to Order Service
   - Status changes to `CONVERTED`

---

## 🔌 Integration with Other Services

### Product Service Integration

**Purpose**: Fetch product details and current pricing

**Client**: `ProductClient.java`

**Methods**:
- `getProducts()` - Get all products
- `getProductById(Long id)` - Get specific product

**Fallback**: Returns temporary product data if service is unavailable

### Order Service Integration

**Purpose**: Create orders from accepted quotations

**Client**: `OrderClient.java`

**Methods**:
- `createOrder(OrderRequestDto)` - Submit order to Order Service

**Payload Structure**:
```json
{
  "quotationId": 1,
  "customerId": "CUST-123",
  "totalAmount": 12999.00,
  "items": [
    {
      "productId": 1,
      "quantity": 10,
      "unitPrice": 1250.00,
      "discount": 50.00
    }
  ]
}
```

---

## 🧪 Testing

### Run Tests
```bash
./mvnw test
```

### Manual Testing with cURL

**Create a quotation**:
```bash
curl -X POST http://localhost:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-001",
    "companyName": "Test Company",
    "contactPerson": "Jane Smith",
    "email": "jane@test.com",
    "phone": "555-1234",
    "items": [{"productId": 1, "quantity": 2}]
  }'
```

**Get products**:
```bash
curl http://localhost:8080/api/quotations/products
```

---

## 📁 Project Structure

```
src/main/java/com/example/quotation_service/
├── client/              # REST clients for external services
│   ├── OrderClient.java
│   └── ProductClient.java
├── config/              # Spring configuration
│   └── AppConfig.java
├── controller/          # REST API controllers
│   └── QuotationController.java
├── dto/                 # Data Transfer Objects
│   ├── OrderRequestDto.java
│   ├── ProductDto.java
│   ├── QuotationRequest.java
│   └── QuotationUpdateRequest.java
├── exception/           # Exception handlers
│   └── GlobalExceptionHandler.java
├── model/               # JPA entities
│   ├── Quotation.java
│   └── QuotationItem.java
├── repository/          # Data access layer
│   └── QuotationRepository.java
└── service/             # Business logic
    └── QuotationService.java
```

---

## 🛠️ Troubleshooting

### Product Service Connection Issues

**Symptom**: Console shows "Failed to connect to Product Service"

**Solution**: 
- Verify Product Service is running on the configured URL
- Check `product.service.url` in `application.properties`
- Service will use temporary products as fallback

### Order Service Connection Issues

**Symptom**: Order conversion fails

**Solution**:
- Verify Order Service is running on the configured URL
- Check `order.service.url` in `application.properties`
- Ensure Order Service API accepts the payload format

### Database Connection Issues

**Symptom**: Application fails to start with database errors

**Solution**:
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database user has CREATE DATABASE privileges

### Port Already in Use

**Symptom**: "Port 8080 is already in use"

**Solution**:
- Change port in `application.properties`: `server.port=8081`
- Or stop the process using port 8080

---

## 🔧 Configuration Reference

### Application Properties

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | 8080 | Application port |
| `product.service.url` | http://localhost:8081/api/products | Product Service endpoint |
| `order.service.url` | http://localhost:8082/api/orders | Order Service endpoint |
| `spring.datasource.url` | jdbc:mysql://localhost:3306/quotation_db | Database URL |
| `spring.datasource.username` | root | Database username |
| `spring.datasource.password` | Wr250x&@8052 | Database password |

---

## 📝 Notes

- The service uses BigDecimal for all monetary calculations to ensure precision
- Discounts are absolute amounts, not percentages
- All REST clients include error handling with fallback mechanisms
- CORS is enabled for all origins (`@CrossOrigin("*")`)
- JPA automatically creates/updates database schema

---

## 🤝 Contributing

When making changes:
1. Update this README if adding new features or changing configuration
2. Ensure all tests pass before committing
3. Follow the existing code structure and naming conventions

---

## 📄 License

This project is part of a microservices demonstration system.
