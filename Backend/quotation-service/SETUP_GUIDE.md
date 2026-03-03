# Quotation Service - Complete Setup Guide

## Overview
The Quotation Service is a Spring Boot microservice that manages quotations with both user-side and admin-side interfaces. It connects to Product and Order services and includes built-in frontend pages.

---

## Prerequisites

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`

2. **Maven 3.6+** (included via Maven Wrapper)
   - No separate installation needed

3. **MySQL 8.0+**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Must be running on `localhost:3306`

4. **Git** (for cloning the repository)

---

## Step 1: Database Setup

### Option A: Using MySQL Command Line

1. Start MySQL service
2. Login to MySQL:
   ```bash
   mysql -u root -p
   ```

3. The database will be created automatically when the application starts (configured with `createDatabaseIfNotExist=true`)

### Option B: Update Database Credentials

If your MySQL has different credentials, update `src/main/resources/application.properties`:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## Step 2: Configure Microservice URLs

The quotation service connects to other microservices. Update these URLs in `src/main/resources/application.properties`:

```properties
# Product Service URL (for fetching products)
product.service.url=http://localhost:8081/api/products

# Order Service URL (for creating orders)
order.service.url=http://localhost:8082/api/orders
```

**Note**: If these services are not running, the quotation service will use fallback data and save orders locally.

---

## Step 3: Build the Application

### Windows (PowerShell or CMD):
```bash
mvnw.cmd clean package -DskipTests
```

### Linux/Mac:
```bash
./mvnw clean package -DskipTests
```

This will:
- Download all dependencies
- Compile the code
- Create a JAR file in the `target/` directory

---

## Step 4: Run the Application

### Option A: Using Maven (Recommended for Development)

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

### Option B: Using JAR File (Recommended for Production)

```bash
java -jar target/quotation-service-0.0.1-SNAPSHOT.jar
```

---

## Step 5: Verify the Application is Running

1. Check the console output for:
   ```
   Started QuotationServiceApplication in X.XXX seconds
   ```

2. Test the API:
   ```bash
   curl http://localhost:8080/api/quotations/products
   ```

3. You should see a list of products (either from Product Service or fallback data)

---

## Step 6: Access the Frontend

The quotation service includes built-in frontend pages:

### User Side (Customer Interface)
- **Main Page**: http://localhost:8080/index.html
- **Customer Dashboard**: http://localhost:8080/customer-dashboard.html
- **Create Quotation**: http://localhost:8080/customer.html

### Admin Side (Admin Interface)
- **Admin Dashboard**: http://localhost:8080/admin-dashboard.html
- **View Orders**: http://localhost:8080/orders.html
- **Quotation Details**: http://localhost:8080/quotation-detail.html?id={quotationId}

---

## Frontend-Backend Connection

### How It Works

1. **Frontend files** are located in: `src/main/resources/static/`
2. **Spring Boot** automatically serves these files
3. **JavaScript files** in `static/js/` make API calls to the backend
4. **CORS is enabled** for all origins in the controllers

### API Endpoints Used by Frontend

| Frontend Page | Backend Endpoint | Purpose |
|---------------|------------------|---------|
| customer.html | GET /api/quotations/products | Fetch products for quotation |
| customer.html | POST /api/quotations | Create new quotation |
| customer-dashboard.html | GET /api/quotations/search?email={email} | Search user's quotations |
| admin-dashboard.html | GET /api/quotations | Get all quotations |
| admin-dashboard.html | PUT /api/quotations/{id}/send | Send quotation with pricing |
| quotation-detail.html | GET /api/quotations/{id} | Get quotation details |
| quotation-detail.html | PUT /api/quotations/{id}/accept | Accept quotation |
| quotation-detail.html | POST /api/quotations/{id}/convert | Convert to order |
| orders.html | GET /api/orders | View all orders |

---

## Complete Workflow

### User Side Flow:

1. **Customer visits**: http://localhost:8080/customer.html
2. **Fills form**: Company details and selects products
3. **Submits quotation**: Creates DRAFT quotation
4. **Checks status**: http://localhost:8080/customer-dashboard.html
5. **Receives quotation**: Admin sends with pricing (status: SENT)
6. **Reviews and accepts**: Status changes to ACCEPTED
7. **Order created**: Admin converts to order (status: CONVERTED)

### Admin Side Flow:

1. **Admin visits**: http://localhost:8080/admin-dashboard.html
2. **Views all quotations**: Sees DRAFT quotations
3. **Opens quotation**: Clicks to view details
4. **Edits pricing**: Adjusts unit prices and applies discounts
5. **Sends to customer**: Changes status to SENT
6. **Waits for acceptance**: Customer accepts (status: ACCEPTED)
7. **Converts to order**: Creates order in system (status: CONVERTED)
8. **Views orders**: http://localhost:8080/orders.html

---

## Testing the Complete System

### Test 1: Create a Quotation (User Side)

1. Open: http://localhost:8080/customer.html
2. Fill in the form:
   - Customer ID: CUST-001
   - Company Name: Test Company
   - Contact Person: John Doe
   - Email: john@test.com
   - Phone: 555-1234
3. Select products and quantities
4. Click "Submit Quotation Request"
5. Note the quotation ID from the response

### Test 2: Process Quotation (Admin Side)

1. Open: http://localhost:8080/admin-dashboard.html
2. Find the quotation you just created
3. Click "View Details"
4. Edit unit prices and add discounts
5. Click "Send Quotation"
6. Status should change to SENT

### Test 3: Accept and Convert (User + Admin)

1. User opens: http://localhost:8080/customer-dashboard.html
2. Enter email: john@test.com
3. Click "Accept" on the quotation
4. Admin opens: http://localhost:8080/admin-dashboard.html
5. Click "Convert to Order" on the accepted quotation
6. View the order at: http://localhost:8080/orders.html

---

## API Testing with cURL

### Get Products
```bash
curl http://localhost:8080/api/quotations/products
```

### Create Quotation
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

### Get All Quotations
```bash
curl http://localhost:8080/api/quotations
```

### Search by Email
```bash
curl "http://localhost:8080/api/quotations/search?email=john@test.com"
```

### Send Quotation (Admin)
```bash
curl -X PUT http://localhost:8080/api/quotations/1/send \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"itemId": 1, "unitPrice": 1200.00, "discount": 50.00}
    ]
  }'
```

### Accept Quotation (Customer)
```bash
curl -X PUT http://localhost:8080/api/quotations/1/accept
```

### Convert to Order (Admin)
```bash
curl -X POST http://localhost:8080/api/quotations/1/convert
```

### Get All Orders
```bash
curl http://localhost:8080/api/orders
```

---

## Troubleshooting

### Issue: Port 8080 already in use

**Solution**: Change the port in `application.properties`:
```properties
server.port=8081
```
Then update frontend URLs accordingly.

### Issue: Database connection failed

**Solutions**:
1. Verify MySQL is running: `mysql -u root -p`
2. Check credentials in `application.properties`
3. Ensure MySQL is on port 3306

### Issue: Products not loading

**Solutions**:
1. Check if Product Service is running on port 8081
2. Service will use fallback products if external service is unavailable
3. Verify `product.service.url` in `application.properties`

### Issue: Order conversion fails

**Solutions**:
1. Orders are saved locally even if Order Service is unavailable
2. Check `order.service.url` in `application.properties`
3. View orders at: http://localhost:8080/orders.html

### Issue: Frontend shows CORS errors

**Solution**: CORS is already enabled. If issues persist:
1. Clear browser cache
2. Try incognito/private mode
3. Check browser console for specific errors

---

## Project Structure

```
quotation-service/
├── src/
│   ├── main/
│   │   ├── java/com/example/quotation_service/
│   │   │   ├── client/          # REST clients for external services
│   │   │   ├── config/          # Spring configuration
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── exception/       # Exception handlers
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/      # Database repositories
│   │   │   └── service/         # Business logic
│   │   └── resources/
│   │       ├── static/          # Frontend files
│   │       │   ├── css/         # Stylesheets
│   │       │   ├── js/          # JavaScript files
│   │       │   ├── index.html
│   │       │   ├── customer.html
│   │       │   ├── customer-dashboard.html
│   │       │   ├── admin-dashboard.html
│   │       │   ├── quotation-detail.html
│   │       │   └── orders.html
│   │       └── application.properties
│   └── test/                    # Test files
├── target/                      # Compiled files (generated)
├── mvnw                         # Maven wrapper (Linux/Mac)
├── mvnw.cmd                     # Maven wrapper (Windows)
├── pom.xml                      # Maven configuration
└── README.md                    # Documentation
```

---

## Configuration Reference

### application.properties

```properties
# Application name
spring.application.name=quotation-service

# Server port
server.port=8080

# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/quotation_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=Wr250x&@8052
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# External microservice URLs
product.service.url=http://localhost:8081/api/products
order.service.url=http://localhost:8082/api/orders
```

---

## Stopping the Application

### If running with Maven:
- Press `Ctrl + C` in the terminal

### If running as JAR:
- Press `Ctrl + C` in the terminal
- Or find and kill the process:
  ```bash
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -i :8080
  kill -9 <PID>
  ```

---

## Next Steps

1. **Customize the frontend**: Edit files in `src/main/resources/static/`
2. **Add authentication**: Implement Spring Security
3. **Connect to real services**: Update microservice URLs
4. **Deploy to production**: Package as JAR and deploy to server
5. **Add email notifications**: Integrate email service for quotation updates

---

## Support

For issues or questions:
1. Check the console logs for error messages
2. Review the troubleshooting section above
3. Verify all prerequisites are installed correctly
4. Ensure MySQL is running and accessible

---

## Summary

You now have a complete quotation management system with:
- ✅ Backend API (Spring Boot)
- ✅ User-side frontend (Customer interface)
- ✅ Admin-side frontend (Admin interface)
- ✅ Database integration (MySQL)
- ✅ Microservice connectivity (Product & Order services)
- ✅ Complete quotation workflow (DRAFT → SENT → ACCEPTED → CONVERTED)

Access the application at: **http://localhost:8080**
