# 🔗 How the Services Connect - Visual Guide

## Current Setup

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                   http://localhost:8080                     │
│                                                             │
│  User Actions:                                              │
│  1. Create Quotation                                        │
│  2. Send Quotation (Admin)                                  │
│  3. Accept Quotation (Customer)                             │
│  4. Convert to Order (Admin) ← This calls quotation service │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Requests
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Quotation Service (Your Service)               │
│                   http://localhost:8080                     │
│                                                             │
│  Endpoints:                                                 │
│  - POST /api/quotations (create)                            │
│  - GET  /api/quotations (list)                              │
│  - PUT  /api/quotations/{id}/send                           │
│  - PUT  /api/quotations/{id}/accept                         │
│  - POST /api/quotations/{id}/convert ← Calls Order Service  │
│                                                             │
│  Configuration:                                             │
│  order.service.url=http://localhost:8082                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP POST /orders
                       │ (When converting quotation to order)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│         Order Management Service (Teammate's Service)       │
│                   http://localhost:8082                     │
│                                                             │
│  Endpoints:                                                 │
│  - POST /orders (create order) ← Called by quotation service│
│  - GET  /orders (list orders)                               │
│  - GET  /orders/{id} (get order)                            │
│  - PUT  /orders/{id} (update status)                        │
│                                                             │
│  Database: order_management_db                              │
└─────────────────────────────────────────────────────────────┘
```

---

## What Happens When You Convert to Order

### Step-by-Step Flow:

```
1. User clicks "Convert to Order" in Frontend
   ↓
2. Frontend sends: POST /api/quotations/{id}/convert
   ↓
3. Quotation Service receives request
   ↓
4. Quotation Service prepares order data:
   - customerId: 123
   - productIds: "1,2,3"
   - quantities: "5,10,15"
   - status: "PENDING"
   ↓
5. Quotation Service calls Order Service:
   POST http://localhost:8082/orders
   ↓
6. Order Service creates the order
   ↓
7. Order Service returns order with ID
   ↓
8. Quotation Service saves orderId reference
   ↓
9. Quotation Service updates status to "CONVERTED"
   ↓
10. Frontend shows success message ✅
```

---

## Data Flow Example

### Quotation Data:
```json
{
  "id": 1,
  "customerId": "123",
  "companyName": "ABC Corp",
  "status": "ACCEPTED",
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "unitPrice": 1199.99
    },
    {
      "productId": 2,
      "quantity": 10,
      "unitPrice": 299.99
    }
  ]
}
```

### Converted to Order Request:
```json
{
  "customerId": 123,
  "productIds": "1,2",
  "quantities": "5,10",
  "status": "PENDING",
  "orderDate": "2026-03-05T10:30:00"
}
```

### Order Service Response:
```json
{
  "orderId": 42,
  "customerId": 123,
  "productIds": "1,2",
  "quantities": "5,10",
  "status": "PENDING",
  "orderDate": "2026-03-05T10:30:00"
}
```

### Updated Quotation:
```json
{
  "id": 1,
  "customerId": "123",
  "companyName": "ABC Corp",
  "status": "CONVERTED",
  "orderId": 42,  ← Reference to created order
  "items": [...]
}
```

---

## Connection Configuration

### In Quotation Service:

**File:** `Backend/quotation-service/src/main/resources/application.properties`

```properties
# This tells quotation service where to find order service
order.service.url=http://localhost:8082
```

### In Code:

**File:** `Backend/quotation-service/src/main/java/com/example/quotation_service/client/OrderServiceClient.java`

```java
@Value("${order.service.url:http://localhost:8082}")
private String orderServiceUrl;  // Reads from application.properties

public OrderResponseDto createOrder(CreateOrderRequest request) {
    String url = orderServiceUrl + "/orders";  // http://localhost:8082/orders
    return restTemplate.postForObject(url, request, OrderResponseDto.class);
}
```

---

## Port Configuration

### Default Ports:
- **Frontend:** 8080 (Vite dev server)
- **Quotation Service:** 8080 (Spring Boot)
- **Order Service:** 8082 (Spring Boot)

### If Ports Conflict:

**Change Order Service Port:**

Edit `Backend/Order-Management-Service/src/main/resources/application.properties`:
```properties
server.port=9090
```

Then update quotation service:
```properties
order.service.url=http://localhost:9090
```

---

## Network Scenarios

### Scenario 1: All on Same Computer (Current)
```
order.service.url=http://localhost:8082
```

### Scenario 2: Order Service on Different Computer
```
order.service.url=http://192.168.1.100:8082
```

### Scenario 3: Order Service on AWS
```
order.service.url=http://54.123.45.67:8082
```

### Scenario 4: Using Domain Name
```
order.service.url=http://order-service.mycompany.com:8082
```

---

## Testing the Connection

### Test 1: Check Order Service is Accessible
```bash
curl http://localhost:8082/orders
```
✅ Should return: `[]` or list of orders

### Test 2: Create Order Directly
```bash
curl -X POST http://localhost:8082/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 123,
    "productIds": "1,2",
    "quantities": "5,10",
    "status": "PENDING"
  }'
```
✅ Should return: Created order with ID

### Test 3: Convert Quotation (Through Frontend)
1. Create quotation
2. Send quotation
3. Accept quotation
4. Convert to Order
✅ Should succeed and create order in Order Service

---

## Error Scenarios

### Error 1: Connection Refused
```
Failed to convert quotation to order. 
Order Management Service may be unavailable: Connection refused
```

**Cause:** Order Service is not running  
**Solution:** Start Order Service on port 8082

### Error 2: 404 Not Found
```
Failed to convert quotation to order.
Order Management Service may be unavailable: 404 Not Found
```

**Cause:** Wrong URL or endpoint  
**Solution:** Check `order.service.url` configuration

### Error 3: Invalid Customer ID
```
Invalid customer ID format: CUST001
```

**Cause:** Customer ID must be numeric  
**Solution:** Use numeric customer IDs (e.g., "123" not "CUST001")

---

## Database Structure

### Quotation Database (quotation_db)
```
quotations table:
- id
- customerId (String)
- companyName
- status
- orderId ← Reference to order in Order Service
- totalAmount

quotation_items table:
- id
- quotation_id
- productId
- quantity
- unitPrice
- discount
- lineTotal
```

### Order Database (order_management_db)
```
orders table:
- orderId
- customerId (Long)
- productIds (String, comma-separated)
- quantities (String, comma-separated)
- orderDate
- status
```

---

## Summary

### What's Already Done ✅
- Connection code written
- Configuration updated
- Error handling implemented
- DTOs created

### What You Need to Do ✅
1. Start Order Service (port 8082)
2. Start Quotation Service (port 8080)
3. Test Convert to Order

### The Connection Works Like This:
```
Frontend → Quotation Service → Order Service → Database
```

**It's that simple!** Just make sure both services are running.

