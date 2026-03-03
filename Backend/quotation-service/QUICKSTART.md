# Quick Start Guide - Quotation Service

## 🚀 Get Running in 5 Minutes

### Step 1: Verify Prerequisites
```bash
java -version    # Should be Java 25+
mysql --version  # Should be MySQL 8.0+
```

### Step 2: Start MySQL
Make sure MySQL is running on `localhost:3306` with the credentials in `application.properties`.

### Step 3: Build and Run
```bash
# Build the project
./mvnw clean package -DskipTests

# Run the application
./mvnw spring-boot:run
```

### Step 4: Test It Works
Open your browser to: `http://localhost:8080/index.html`

Or test the API:
```bash
curl http://localhost:8080/api/quotations/products
```

You should see temporary products (since Product Service isn't running yet).

---

## 🔗 Connecting to Other Microservices

### If Product Service is Running

1. Open `src/main/resources/application.properties`
2. Update this line:
   ```properties
   product.service.url=http://YOUR_PRODUCT_SERVICE_HOST:PORT/api/products
   ```
3. Restart the application

### If Order Service is Running

1. Open `src/main/resources/application.properties`
2. Update this line:
   ```properties
   order.service.url=http://YOUR_ORDER_SERVICE_HOST:PORT/api/orders
   ```
3. Restart the application

---

## 📝 Test the Complete Flow

### 1. Get Products
```bash
curl http://localhost:8080/api/quotations/products
```

### 2. Create a Quotation
```bash
curl -X POST http://localhost:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-001",
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "john@test.com",
    "phone": "555-1234",
    "items": [
      {"productId": 1, "quantity": 2},
      {"productId": 2, "quantity": 1}
    ]
  }'
```

Save the returned `id` (let's say it's `1`).

### 3. Send Quotation (Apply Discount)
```bash
curl -X PUT http://localhost:8080/api/quotations/1/send \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"itemId": 1, "unitPrice": 1250.00, "discount": 50.00}
    ]
  }'
```

### 4. Accept Quotation
```bash
curl -X PUT http://localhost:8080/api/quotations/1/accept
```

### 5. Convert to Order
```bash
curl -X POST http://localhost:8080/api/quotations/1/convert
```

This will send the order to the Order Service (if configured and running).

---

## 🎯 What's Working Now

✅ Application compiles and runs successfully  
✅ Temporary products available when Product Service is offline  
✅ Complete quotation workflow (DRAFT → SENT → ACCEPTED → CONVERTED)  
✅ REST API endpoints functional  
✅ Database integration with MySQL  
✅ Microservice URLs configurable in application.properties  

---

## 🔧 Troubleshooting

**Problem**: Port 8080 already in use  
**Solution**: Change port in `application.properties`:
```properties
server.port=8081
```

**Problem**: Can't connect to MySQL  
**Solution**: Update credentials in `application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

**Problem**: Product Service connection fails  
**Solution**: This is normal! The service uses temporary products as fallback.

---

## 📚 Next Steps

1. Set up Product Service and update `product.service.url`
2. Set up Order Service and update `order.service.url`
3. Test the complete integration flow
4. Customize the temporary products in `ProductClient.java` if needed

For detailed documentation, see [README.md](README.md)
