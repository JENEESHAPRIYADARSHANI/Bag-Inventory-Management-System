# Refactoring Complete: Convert to Order with API

## ✅ Task Completed Successfully!

The quotation-service has been refactored to properly call the Order-Management-Service API instead of managing orders directly.

## Changes Made

### 1. Created Order Service Client ✅
**File:** `Backend/quotation-service/src/main/java/com/example/quotation_service/client/OrderServiceClient.java`

```java
@Component
public class OrderServiceClient {
    @Value("${order.service.url:http://localhost:8082}")
    private String orderServiceUrl;
    
    public OrderResponseDto createOrder(CreateOrderRequest request) {
        // Calls Order Management Service API
    }
}
```

### 2. Created DTOs for Communication ✅
**Files:**
- `CreateOrderRequest.java` - Request DTO matching Order Service expectations
- `OrderResponseDto.java` - Response DTO from Order Service

### 3. Updated Quotation Entity ✅
**File:** `Backend/quotation-service/src/main/java/com/example/quotation_service/model/Quotation.java`

Added:
```java
@Column(name = "order_id")
private Long orderId;  // Reference to order in Order Management Service
```

### 4. Refactored QuotationService ✅
**File:** `Backend/quotation-service/src/main/java/com/example/quotation_service/service/QuotationService.java`

**Before (WRONG):**
```java
@Transactional
public Quotation convertToOrder(Long id) {
    // Created Order entity locally ❌
    Order order = new Order();
    orderRepository.save(order);  // Saved to local database ❌
    
    // Optionally tried to call external service
    try {
        orderClient.createOrder(orderRequest);
    } catch (Exception e) {
        // Failed silently ❌
    }
}
```

**After (CORRECT):**
```java
@Transactional
public Quotation convertToOrder(Long id) {
    Quotation quotation = quotationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quotation not found"));

    if (!"ACCEPTED".equals(quotation.getStatus())) {
        throw new RuntimeException("Only ACCEPTED quotations can be converted");
    }

    // Prepare order request
    CreateOrderRequest orderRequest = new CreateOrderRequest();
    orderRequest.setCustomerId(Long.parseLong(quotation.getCustomerId()));
    orderRequest.setProductIds(/* comma-separated product IDs */);
    orderRequest.setQuantities(/* comma-separated quantities */);
    orderRequest.setOrderDate(LocalDateTime.now());
    orderRequest.setStatus("PENDING");

    // Call Order Management Service API ✅
    OrderResponseDto orderResponse = orderServiceClient.createOrder(orderRequest);
    
    // Store order reference only ✅
    quotation.setOrderId(orderResponse.getOrderId());
    quotation.setStatus("CONVERTED");
    
    return quotationRepository.save(quotation);
}
```

### 5. Removed Order Management from Quotation Service ✅
**Deleted Files:**
- ❌ `model/Order.java`
- ❌ `model/OrderItem.java`
- ❌ `repository/OrderRepository.java`
- ❌ `controller/OrderController.java`
- ❌ `client/OrderClient.java` (old version)
- ❌ `dto/OrderRequestDto.java` (old version)

### 6. Configuration ✅
**File:** `Backend/quotation-service/src/main/resources/application.properties`

```properties
# Microservice URLs
product.service.url=http://localhost:8081/api/products
order.service.url=http://localhost:8082
```

## Architecture Comparison

### Before (WRONG ❌):
```
┌─────────────────────────────────┐
│   Quotation Service             │
│   - Quotation entity ✅         │
│   - Order entity ❌             │
│   - orders table ❌             │
│   - Manages orders directly ❌  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   Order Management Service      │
│   - Order entity ✅             │
│   - orders table ✅             │
└─────────────────────────────────┘

Problem: Duplicate order management!
```

### After (CORRECT ✅):
```
┌─────────────────────────────────┐
│   Quotation Service             │
│   - Quotation entity ✅         │
│   - orderId reference ✅        │
│   - OrderServiceClient ✅       │
│   - Calls Order Service API ✅  │
└────────────┬────────────────────┘
             │ HTTP POST /orders
             ▼
┌─────────────────────────────────┐
│   Order Management Service      │
│   - Order entity ✅             │
│   - orders table ✅             │
│   - REST API ✅                 │
└─────────────────────────────────┘

Solution: Single source of truth!
```

## How It Works Now

### Flow: Convert Quotation to Order

1. **User accepts quotation** (status: ACCEPTED)
2. **Admin clicks "Convert to Order"**
3. **Quotation Service:**
   - Validates quotation status
   - Prepares CreateOrderRequest with:
     - customerId
     - productIds (comma-separated)
     - quantities (comma-separated)
     - orderDate
     - status: "PENDING"
4. **Calls Order Management Service API:**
   ```
   POST http://localhost:8082/orders
   Content-Type: application/json
   
   {
     "customerId": 123,
     "productIds": "1,2,3",
     "quantities": "5,10,2",
     "orderDate": "2026-03-04T18:00:00",
     "status": "PENDING"
   }
   ```
5. **Order Management Service:**
   - Creates order in its database
   - Returns order response with orderId
6. **Quotation Service:**
   - Stores orderId reference
   - Updates quotation status to "CONVERTED"
   - Returns updated quotation

### Data Storage

**Quotation Service Database:**
```sql
quotations table:
  - id: 1
  - customer_id: "123"
  - company_name: "Test Company"
  - status: "CONVERTED"
  - order_id: 456  ← Reference only!
  
quotation_items table:
  - id: 1
  - quotation_id: 1
  - product_id: 1
  - quantity: 5
  - unit_price: 100.00
```

**Order Management Service Database:**
```sql
orders table:
  - order_id: 456  ← Actual order data
  - customer_id: 123
  - product_ids: "1,2,3"
  - quantities: "5,10,2"
  - status: "PENDING"
```

## Testing the Implementation

### Prerequisites
1. Start Order-Management-Service on port 8082
2. Start quotation-service on port 8080
3. Ensure both services can connect to their databases

### Test Steps

#### 1. Create a Quotation
```bash
curl -X POST http://localhost:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "123",
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "john@test.com",
    "phone": "1234567890",
    "items": [
      {"productId": 1, "quantity": 5}
    ]
  }'
```

#### 2. Send Quotation (Admin)
```bash
curl -X PUT http://localhost:8080/api/quotations/1/send \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"itemId": 1, "unitPrice": 100.00, "discount": 0}
    ]
  }'
```

#### 3. Accept Quotation (Customer)
```bash
curl -X PUT http://localhost:8080/api/quotations/1/accept
```

#### 4. Convert to Order (Admin)
```bash
curl -X POST http://localhost:8080/api/quotations/1/convert
```

**Expected Response:**
```json
{
  "id": 1,
  "customerId": "123",
  "companyName": "Test Company",
  "status": "CONVERTED",
  "orderId": 456,  ← Order reference!
  "totalAmount": 500.00
}
```

#### 5. Verify Order in Order Management Service
```bash
curl http://localhost:8082/orders/456
```

**Expected Response:**
```json
{
  "orderId": 456,
  "customerId": 123,
  "productIds": "1",
  "quantities": "5",
  "status": "PENDING",
  "orderDate": "2026-03-04T18:00:00"
}
```

## Error Handling

### If Order Management Service is Down

**Before (WRONG):**
```java
try {
    orderClient.createOrder(orderRequest);
} catch (Exception e) {
    // Failed silently, order saved locally anyway ❌
}
```

**After (CORRECT):**
```java
try {
    OrderResponseDto orderResponse = orderServiceClient.createOrder(orderRequest);
    quotation.setOrderId(orderResponse.getOrderId());
    quotation.setStatus("CONVERTED");
} catch (Exception e) {
    // Throws exception, quotation stays ACCEPTED ✅
    throw new RuntimeException(
        "Failed to convert quotation to order. Order Management Service may be unavailable: " 
        + e.getMessage(), e
    );
}
```

**Benefits:**
- User knows there's a problem
- Quotation stays in ACCEPTED state
- Can retry later when service is available
- No data inconsistency

## Configuration for Different Environments

### Local Development
```properties
# application.properties
order.service.url=http://localhost:8082
```

### Docker Compose
```properties
# application.properties
order.service.url=http://order-management-service:8082
```

### Kubernetes
```properties
# application.properties
order.service.url=http://order-management-service.default.svc.cluster.local:8082
```

### AWS (Separate Deployments)
```properties
# application.properties
order.service.url=http://order-service-alb.us-east-1.elb.amazonaws.com
```

## Benefits of This Architecture

### ✅ Single Responsibility
- Quotation Service: Manages quotations only
- Order Management Service: Manages orders only

### ✅ Data Consistency
- Orders exist in one place only
- No risk of data duplication
- Single source of truth

### ✅ Independent Scaling
- Scale Order Service independently if order processing is heavy
- Scale Quotation Service independently if quotation requests are high

### ✅ Independent Deployment
- Deploy Order Service without affecting Quotation Service
- Different teams can work independently

### ✅ Fault Isolation
- If Order Service fails, Quotation Service still works
- Users can still create and view quotations
- Clear error messages when conversion fails

### ✅ Technology Flexibility
- Order Service could use PostgreSQL
- Quotation Service could use MySQL
- Each service chooses what's best for its needs

## Next Steps

### 1. Update Order Management Service API (If Needed)

The current Order-Management-Service expects:
```java
private String productIds;  // Comma-separated
private String quantities;  // Comma-separated
```

This works but is not ideal. Consider enhancing it to:
```java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
private List<OrderItem> items;
```

### 2. Add Circuit Breaker (Recommended)

```java
@CircuitBreaker(name = "orderService", fallbackMethod = "convertToOrderFallback")
public Quotation convertToOrder(Long id) {
    // ... existing code
}

private Quotation convertToOrderFallback(Long id, Exception e) {
    throw new RuntimeException(
        "Order Management Service is currently unavailable. Please try again later."
    );
}
```

### 3. Add Retry Logic

```yaml
# application.yaml
resilience4j:
  retry:
    instances:
      orderService:
        maxAttempts: 3
        waitDuration: 1s
```

### 4. Add Logging

```java
@Slf4j
@Service
public class QuotationService {
    
    public Quotation convertToOrder(Long id) {
        log.info("Converting quotation {} to order", id);
        
        try {
            OrderResponseDto orderResponse = orderServiceClient.createOrder(orderRequest);
            log.info("Successfully created order {} for quotation {}", 
                orderResponse.getOrderId(), id);
            // ...
        } catch (Exception e) {
            log.error("Failed to convert quotation {} to order", id, e);
            throw new RuntimeException(...);
        }
    }
}
```

### 5. Add Integration Tests

```java
@SpringBootTest
@AutoConfigureMockMvc
class QuotationServiceIntegrationTest {
    
    @MockBean
    private OrderServiceClient orderServiceClient;
    
    @Test
    void testConvertToOrder() {
        // Given
        OrderResponseDto mockResponse = new OrderResponseDto();
        mockResponse.setOrderId(456L);
        when(orderServiceClient.createOrder(any())).thenReturn(mockResponse);
        
        // When
        Quotation result = quotationService.convertToOrder(1L);
        
        // Then
        assertEquals("CONVERTED", result.getStatus());
        assertEquals(456L, result.getOrderId());
    }
}
```

## Summary

✅ **Removed** Order entity, OrderItem, OrderRepository, OrderController from quotation-service
✅ **Created** OrderServiceClient to call Order Management Service API
✅ **Created** DTOs for service-to-service communication
✅ **Updated** Quotation entity to store orderId reference
✅ **Refactored** convertToOrder() to use API instead of local database
✅ **Configured** order.service.url in application.properties

**Result:** Proper microservices architecture with single source of truth for orders!

---

**Date:** March 4, 2026
**Status:** ✅ COMPLETE
**Architecture:** Microservices with API communication
