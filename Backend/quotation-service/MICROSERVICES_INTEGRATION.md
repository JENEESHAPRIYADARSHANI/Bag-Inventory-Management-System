# Microservices Integration Guide

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend / Client                        │
│                     (Browser, Mobile App, etc.)                  │
└────────────────┬────────────────────────────────┬────────────────┘
                 │                                │
                 │                                │
                 ▼                                ▼
┌────────────────────────────┐    ┌──────────────────────────────┐
│   Product Service          │    │   Order Service              │
│   Port: 8081               │    │   Port: 8082                 │
│                            │    │                              │
│   GET /api/products        │    │   POST /api/orders           │
│   GET /api/products/{id}   │    │   GET /api/orders            │
└────────────┬───────────────┘    └───────────┬──────────────────┘
             │                                 │
             │                                 │
             │    ┌────────────────────────┐   │
             └───►│  Quotation Service     │◄──┘
                  │  Port: 8080            │
                  │                        │
                  │  This Service          │
                  └────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Creating a Quotation

```
Client → Quotation Service: POST /api/quotations
         ↓
Quotation Service → Product Service: GET /api/products/{id}
         ↓
Product Service → Quotation Service: Product details + price
         ↓
Quotation Service → Database: Save quotation (DRAFT)
         ↓
Quotation Service → Client: Return quotation
```

### 2. Converting to Order

```
Client → Quotation Service: POST /api/quotations/{id}/convert
         ↓
Quotation Service → Order Service: POST /api/orders
         ↓
Order Service → Quotation Service: Order confirmation
         ↓
Quotation Service → Database: Update status (CONVERTED)
         ↓
Quotation Service → Client: Return updated quotation
```

---

## 🔌 Integration Points

### Product Service Integration

**Purpose**: Fetch product catalog and current pricing

**Endpoints Used**:
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get specific product details

**Configuration**:
```properties
product.service.url=http://localhost:8081/api/products
```

**Expected Response Format**:
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99.99
}
```

**Fallback Behavior**:
- If Product Service is unavailable, uses temporary product data
- Logs error to console but continues operation
- Returns 5 sample products for testing

**Implementation**: `ProductClient.java`

---

### Order Service Integration

**Purpose**: Create orders from accepted quotations

**Endpoints Used**:
- `POST /api/orders` - Create new order

**Configuration**:
```properties
order.service.url=http://localhost:8082/api/orders
```

**Payload Sent**:
```json
{
  "quotationId": 1,
  "customerId": "CUST-123",
  "totalAmount": 1299.99,
  "items": [
    {
      "productId": 1,
      "quantity": 10,
      "unitPrice": 129.99,
      "discount": 0.00
    }
  ]
}
```

**Expected Response**: Order confirmation (String or Order object)

**Error Handling**: 
- Throws RuntimeException if Order Service is unavailable
- Transaction is rolled back
- Quotation status remains ACCEPTED

**Implementation**: `OrderClient.java`

---

## 🛠️ Setup Instructions

### Scenario 1: All Services on Localhost

**Product Service**: `http://localhost:8081`  
**Quotation Service**: `http://localhost:8080`  
**Order Service**: `http://localhost:8082`

No configuration changes needed! Default settings work.

### Scenario 2: Services on Different Machines

**Example**: 
- Product Service: `http://192.168.1.100:8081`
- Order Service: `http://192.168.1.101:8082`

**Update `application.properties`**:
```properties
product.service.url=http://192.168.1.100:8081/api/products
order.service.url=http://192.168.1.101:8082/api/orders
```

### Scenario 3: Services in Docker

**Example**:
- Product Service: `http://product-service:8081`
- Order Service: `http://order-service:8082`

**Update `application.properties`**:
```properties
product.service.url=http://product-service:8081/api/products
order.service.url=http://order-service:8082/api/orders
```

### Scenario 4: Cloud Deployment

**Example**:
- Product Service: `https://api.example.com/products`
- Order Service: `https://api.example.com/orders`

**Update `application.properties`**:
```properties
product.service.url=https://api.example.com/products
order.service.url=https://api.example.com/orders
```

---

## 🧪 Testing Integration

### Test Product Service Connection

```bash
# Start Quotation Service
./mvnw spring-boot:run

# In another terminal, test the proxy endpoint
curl http://localhost:8080/api/quotations/products
```

**Expected**: 
- If Product Service is running: Real product data
- If Product Service is down: Temporary product data

### Test Order Service Connection

```bash
# Create and accept a quotation first
curl -X POST http://localhost:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{"customerId":"TEST","companyName":"Test","contactPerson":"Test","email":"test@test.com","phone":"123","items":[{"productId":1,"quantity":1}]}'

# Accept it (use the ID from response, e.g., 1)
curl -X PUT http://localhost:8080/api/quotations/1/accept

# Convert to order
curl -X POST http://localhost:8080/api/quotations/1/convert
```

**Expected**:
- If Order Service is running: Order created successfully
- If Order Service is down: Error message

---

## 📊 API Contract

### What Quotation Service Expects from Product Service

**Endpoint**: `GET /api/products`
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 99.99
  }
]
```

**Endpoint**: `GET /api/products/{id}`
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99.99
}
```

### What Quotation Service Sends to Order Service

**Endpoint**: `POST /api/orders`
```json
{
  "quotationId": 1,
  "customerId": "CUST-123",
  "totalAmount": 1299.99,
  "items": [
    {
      "productId": 1,
      "quantity": 10,
      "unitPrice": 129.99,
      "discount": 0.00
    }
  ]
}
```

---

## 🔐 Security Considerations

### Current Implementation
- No authentication/authorization
- CORS enabled for all origins (`@CrossOrigin("*")`)
- Direct HTTP communication

### Production Recommendations
1. Add API authentication (JWT, OAuth2)
2. Restrict CORS to specific origins
3. Use HTTPS for all communication
4. Implement service-to-service authentication
5. Add rate limiting
6. Use API Gateway for routing

---

## 🚨 Common Issues

### Issue: "Failed to connect to Product Service"

**Cause**: Product Service is not running or URL is incorrect

**Solution**:
1. Check if Product Service is running
2. Verify `product.service.url` in `application.properties`
3. Test Product Service directly: `curl http://localhost:8081/api/products`
4. Service will use temporary products as fallback

### Issue: "Failed to convert quotation to order"

**Cause**: Order Service is not running or URL is incorrect

**Solution**:
1. Check if Order Service is running
2. Verify `order.service.url` in `application.properties`
3. Test Order Service directly: `curl http://localhost:8082/api/orders`
4. Check Order Service logs for errors

### Issue: "Connection refused"

**Cause**: Target service is not accessible

**Solution**:
1. Verify service is running: `netstat -an | grep PORT`
2. Check firewall rules
3. Verify network connectivity
4. Check service logs

### Issue: "Timeout connecting to service"

**Cause**: Service is slow or network issues

**Solution**:
1. Increase RestTemplate timeout (add to `AppConfig.java`)
2. Check network latency
3. Verify service health

---

## 📝 Development Tips

### Running All Services Locally

**Terminal 1** (Product Service):
```bash
cd product-service
./mvnw spring-boot:run
```

**Terminal 2** (Quotation Service):
```bash
cd quotation-service
./mvnw spring-boot:run
```

**Terminal 3** (Order Service):
```bash
cd order-service
./mvnw spring-boot:run
```

### Testing Without Other Services

The Quotation Service can run independently:
- Uses temporary products when Product Service is unavailable
- Order conversion will fail gracefully if Order Service is down
- All other features work normally

### Mocking Services for Testing

You can use tools like:
- **WireMock**: Mock HTTP services
- **MockServer**: Create mock endpoints
- **Postman Mock Server**: Quick API mocking

---

## 🔄 Version Compatibility

Ensure all services use compatible API versions:

| Service | Version | API Version |
|---------|---------|-------------|
| Product Service | 1.0.0 | v1 |
| Quotation Service | 0.0.1-SNAPSHOT | v1 |
| Order Service | 1.0.0 | v1 |

---

## 📞 Support

For integration issues:
1. Check service logs
2. Verify configuration in `application.properties`
3. Test each service independently
4. Review this integration guide

For detailed API documentation, see [README.md](README.md)
