# 🔗 Connect Your Teammate's Order Service - 3 Steps

## Your Situation
Your teammate built the Order Management Service. You just need to connect it!

---

## ✅ I Already Fixed the Configuration!

The quotation service is now configured to connect to:
```
http://localhost:8082
```

This matches your teammate's Order Management Service endpoint.

---

## 🚀 3 Steps to Make It Work

### Step 1: Start Your Teammate's Order Service

Ask your teammate to start their Order Management Service, or start it yourself:

```bash
cd Backend/Order-Management-Service
mvn spring-boot:run
```

**Expected:** Service starts on port 8082

### Step 2: Verify Order Service is Running

```bash
curl http://localhost:8082/orders
```

**Expected:** `[]` (empty array) or list of orders

### Step 3: Restart Quotation Service

```bash
cd Backend/quotation-service
mvn spring-boot:run
```

**That's it!** The services are now connected.

---

## 🧪 Test Convert to Order

1. Open frontend: `http://localhost:8080`
2. Create a quotation
3. Send it (admin panel)
4. Accept it (customer)
5. **Convert to Order** ✅ Should work!

---

## 🔍 Verify the Order Was Created

Check in Order Management Service:

```bash
curl http://localhost:8082/orders
```

You should see the created order!

---

## ⚠️ If It Doesn't Work

### Problem: "Connection refused"
**Solution:** Make sure Order Service is running on port 8082

```bash
# Check if port 8082 is in use
netstat -an | grep 8082
```

### Problem: "Order Service may be unavailable"
**Solution:** 
1. Check Order Service logs for errors
2. Test Order Service directly:
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

### Problem: Different Port
If your teammate's service runs on a different port (e.g., 9090):

Edit `Backend/quotation-service/src/main/resources/application.properties`:
```properties
order.service.url=http://localhost:9090
```

Then restart quotation service.

---

## 📊 How It Works

```
Frontend
    ↓ Create quotation
Quotation Service (port 8080)
    ↓ Convert to order (HTTP POST)
Order Management Service (port 8082) ← Your teammate's service
    ↓ Save order
Database
```

---

## 🎯 Quick Commands

```bash
# 1. Start Order Service
cd Backend/Order-Management-Service
mvn spring-boot:run

# 2. Test Order Service (in new terminal)
curl http://localhost:8082/orders

# 3. Start Quotation Service (in new terminal)
cd Backend/quotation-service
mvn spring-boot:run

# 4. Start Frontend (in new terminal)
cd frontend
npm run dev
```

---

## ✅ Success Checklist

- [ ] Order Service running on port 8082
- [ ] Can access `http://localhost:8082/orders`
- [ ] Quotation Service running on port 8080
- [ ] Frontend running on port 8080
- [ ] Convert to Order works in frontend
- [ ] Order appears in Order Service

---

## 💡 What I Changed

**File:** `Backend/quotation-service/src/main/resources/application.properties`

**Changed from:**
```properties
order.service.url=http://localhost:8082/api/orders
```

**Changed to:**
```properties
order.service.url=http://localhost:8082
```

This matches your teammate's Order Service API endpoint (`/orders` not `/api/orders`).

---

## 🎉 That's All!

The connection is already coded and configured. Just start both services and it will work!

