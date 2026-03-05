# 🔗 Connect Order Management Service - Simple Guide

## Your Situation

Your teammate built the Order Management Service, and you need to connect it to the Quotation Service so "Convert to Order" works.

**Good news:** The connection code is already written! You just need to configure the URL.

---

## 🎯 What You Need

1. Your teammate's Order Management Service running
2. The URL where it's running (e.g., `http://localhost:8082`)
3. 5 minutes to configure

---

## 📋 Quick Setup

### Option 1: Running Locally (Both Services on Your Computer)

#### Step 1: Start Order Management Service

Ask your teammate how to start their service, or:

```bash
cd Backend/Order-Management-Service
mvn spring-boot:run
```

The service should start on port 8082 (default).

#### Step 2: Verify Order Service is Running

```bash
curl http://localhost:8082/orders
```

Should return: `[]` (empty array)

#### Step 3: Configure Quotation Service

The quotation service is already configured to connect to `http://localhost:8082`!

Check `Backend/quotation-service/src/main/resources/application.properties`:
```properties
order.service.url=http://localhost:8082/api/orders
```

**Note:** There's a small mismatch - the config says `/api/orders` but your teammate's service uses `/orders` (no `/api`).

#### Step 4: Fix the URL

Edit `Backend/quotation-service/src/main/resources/application.properties`:

**Change from:**
```properties
order.service.url=http://localhost:8082/api/orders
```

**Change to:**
```properties
order.service.url=http://localhost:8082
```

#### Step 5: Restart Quotation Service

```bash
cd Backend/quotation-service
mvn spring-boot:run
```

#### Step 6: Test Convert to Order

1. Open frontend: `http://localhost:8080`
2. Create a quotation
3. Send it (admin)
4. Accept it (customer)
5. Convert to Order ✅ Should work!

---

### Option 2: Order Service on Different Port

If your teammate's service runs on a different port (e.g., 9090):

Edit `Backend/quotation-service/src/main/resources/application.properties`:
```properties
order.service.url=http://localhost:9090
```

Restart quotation service.

---

### Option 3: Order Service on Different Computer/Server

If your teammate's service is on another computer or server:

Edit `Backend/quotation-service/src/main/resources/application.properties`:
```properties
order.service.url=http://192.168.1.100:8082
```

Replace `192.168.1.100` with the actual IP address or hostname.

---

### Option 4: Order Service on AWS (Already Deployed)

If your teammate already deployed to AWS:

Edit `Backend/quotation-service/src/main/resources/application.properties`:
```properties
order.service.url=http://ORDER_SERVICE_IP:8082
```

Replace `ORDER_SERVICE_IP` with the actual AWS IP address.

---

## 🔍 How to Find Order Service URL

### Ask Your Teammate:
"What URL is the Order Management Service running on?"

### Common URLs:
- Local: `http://localhost:8082`
- Local (different port): `http://localhost:9090`
- Network: `http://192.168.1.100:8082`
- AWS: `http://54.123.45.67:8082`

### Test the URL:
```bash
curl http://URL_HERE/orders
```

Should return: `[]` or a list of orders

---

## 🧪 Testing the Connection

### Test 1: Check Order Service is Running
```bash
curl http://localhost:8082/orders
```
Expected: `[]` or list of orders

### Test 2: Create a Test Order
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
Expected: Created order with ID

### Test 3: Convert Quotation to Order (Frontend)
1. Create quotation
2. Send quotation
3. Accept quotation
4. Convert to Order ✅

---

## ⚠️ Common Issues

### Issue 1: "Connection refused"
**Problem:** Order Service is not running  
**Solution:** Start the Order Management Service

### Issue 2: "404 Not Found"
**Problem:** Wrong URL or endpoint  
**Solution:** Check the URL and make sure it's `/orders` not `/api/orders`

### Issue 3: "Failed to convert quotation to order"
**Problem:** Order Service is running but not responding correctly  
**Solution:** 
- Check Order Service logs
- Verify the API endpoint matches
- Test Order Service directly with curl

### Issue 4: "Invalid customer ID format"
**Problem:** Customer ID is not a number  
**Solution:** Make sure customer ID in quotation is numeric (e.g., "123" not "CUST001")

---

## 📝 Configuration Summary

### What's Already Done ✅
- OrderServiceClient created in quotation-service
- API call logic implemented
- Error handling added
- DTOs created (CreateOrderRequest, OrderResponseDto)

### What You Need to Do ✅
1. Make sure Order Service is running
2. Update `order.service.url` in application.properties
3. Restart quotation service
4. Test!

---

## 🔧 Configuration File Location

**File to edit:**
```
Backend/quotation-service/src/main/resources/application.properties
```

**Line to change:**
```properties
order.service.url=http://localhost:8082
```

**Change to match your teammate's service URL**

---

## 📊 Architecture

```
Frontend (localhost:8080)
    ↓
Quotation Service (localhost:8080)
    ↓ HTTP POST /orders
Order Management Service (localhost:8082) ← Your teammate's service
    ↓
Order Database
```

---

## 🚀 Quick Start Commands

### 1. Start Order Service (ask your teammate)
```bash
cd Backend/Order-Management-Service
mvn spring-boot:run
```

### 2. Verify it's running
```bash
curl http://localhost:8082/orders
```

### 3. Update quotation service config
Edit `Backend/quotation-service/src/main/resources/application.properties`:
```properties
order.service.url=http://localhost:8082
```

### 4. Restart quotation service
```bash
cd Backend/quotation-service
mvn spring-boot:run
```

### 5. Test in frontend
Create → Send → Accept → Convert ✅

---

## 💡 Tips

1. **Ask your teammate for:**
   - Order Service URL
   - How to start the service
   - API documentation (if available)

2. **Make sure both services use the same database format:**
   - Customer ID should be numeric
   - Product IDs should be comma-separated
   - Quantities should be comma-separated

3. **Check the Order Service API:**
   - Endpoint: POST `/orders`
   - Request body format:
     ```json
     {
       "customerId": 123,
       "productIds": "1,2,3",
       "quantities": "5,10,15",
       "status": "PENDING"
     }
     ```

---

## 📞 Need Help?

### Check Order Service Logs
Look for errors when quotation service tries to create an order.

### Check Quotation Service Logs
Look for connection errors or API call failures.

### Test Independently
Test Order Service with curl before testing through the frontend.

---

## ✅ Success Checklist

- [ ] Order Management Service is running
- [ ] Can access Order Service at the URL (curl test)
- [ ] Updated `order.service.url` in application.properties
- [ ] Restarted quotation service
- [ ] Tested Convert to Order in frontend
- [ ] Order appears in Order Management System

---

## 🎉 That's It!

Once you configure the URL and both services are running, the "Convert to Order" feature will work automatically!

The connection code is already written - you just need to point it to the right URL.

