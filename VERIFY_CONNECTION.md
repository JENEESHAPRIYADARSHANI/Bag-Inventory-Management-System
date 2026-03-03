# Verify Backend Connection - 2 Minute Test

## Step 1: Start Backend (30 seconds)

```bash
cd Backend/Payment-Management-Service
mvnw spring-boot:run
```

Wait for: `Started PaymentManagementServiceApplication`

## Step 2: Test Backend (10 seconds)

```bash
curl http://localhost:8085/api/payments
```

✅ **If you see JSON data** → Backend is working!

## Step 3: Start Frontend (30 seconds)

```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173`

## Step 4: Open Browser (10 seconds)

1. Open: `http://localhost:5173`
2. Click on **Payments** in sidebar

## Step 5: Verify Connection (30 seconds)

### You Should See:

1. **Loading spinner** appears briefly
2. **Statistics cards** show numbers:
   - Total Revenue: $XXX
   - Completed: X
   - Pending: X
   - Failed: X

3. **Payment table** shows rows with data

4. **Saved Payment Methods** shows cards

### ✅ If You See Data → CONNECTION WORKS!

## Step 6: Test Create (20 seconds)

1. Click **"Record Payment"**
2. Fill in:
   - Order ID: `TEST-001`
   - Customer: `Test User`
   - Amount: `100`
3. Click **"Record Payment"**

### ✅ If You See:
- Success toast notification
- New payment in table
→ **BACKEND IS CONNECTED!**

---

## 🎉 Success!

Your frontend is connected to the backend and working!

## ❌ If It Doesn't Work

### Problem: No data loads
**Check:**
1. Backend is running: `curl http://localhost:8085/api/payments`
2. No console errors: Press F12, check Console tab
3. API calls succeed: Press F12, check Network tab

### Problem: "Loading..." never stops
**Solution:**
```bash
# Check backend logs for errors
# Check frontend console (F12) for errors
```

### Problem: Can't create payment
**Check:**
1. Backend logs for errors
2. Network tab shows POST request
3. Response status code

---

## Quick Debug

Open browser DevTools (F12):

### Console Tab
Should see:
```
Refreshing payments...
Payments loaded: {content: Array(3), ...}
```

### Network Tab
Should see:
- GET `/api/payments` → Status 200
- GET `/api/payment-methods` → Status 200

If you see these → **Connection is working!**

---

## Already Connected!

The connection is already set up. Just:
1. Start backend
2. Start frontend
3. Open browser
4. See data!

That's it! 🚀
