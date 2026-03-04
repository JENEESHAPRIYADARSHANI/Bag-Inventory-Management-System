# Logistics Service - Testing Checklist

## ✅ Backend Verification

### 1. Database Setup

```bash
cd Backend/logistics-Service/database
setup_mysql.bat
```

- Enter MySQL root password: `Nuskyny@1234`
- Verify database `logistics_db` is created

### 2. Start Backend

```bash
cd Backend/logistics-Service
mvnw.cmd spring-boot:run
```

**Expected Output:**

```
Started LogisticsServiceApplication in X.XXX seconds
```

**Port:** 8081 (configured in application.yaml)

### 3. Test Backend Endpoints

Open browser or use curl:

**Test 1: Get all trackings (should return empty array initially)**

```
http://localhost:8081/api/tracking
```

Expected: `[]`

**Test 2: Create a tracking**

```bash
curl -X POST http://localhost:8081/api/tracking/create ^
  -H "Content-Type: application/json" ^
  -d "{\"orderId\":\"ORD-TEST-001\",\"customerName\":\"Test Customer\",\"deliveryAddress\":\"123 Test St\",\"recipientPhone\":\"555-1234\",\"carrierName\":\"Test Carrier\"}"
```

**Test 3: Get all trackings again**

```
http://localhost:8081/api/tracking
```

Expected: Array with 1 tracking record

## ✅ Frontend Integration

### 1. Start Frontend

```bash
cd frontend
npm run dev
```

### 2. Navigate to Tracking Page

- Open browser: `http://localhost:5173` (or your Vite port)
- Go to Tracking page

### 3. Test Frontend Features

**Create Tracking:**

- Click "Create Tracking" button
- Fill in:
  - Order ID: ORD-2024-001
  - Customer Name: ABC Corporation
  - Delivery Address: 123 Business Park
  - Est. Delivery Date: (select future date)
- Click "Create Tracking"
- Should see new record in table

**Update Status:**

- Click eye icon or row to view details
- Click "Update Status"
- Select new status (e.g., PROCESSING → PACKED)
- Add message
- Click "Update Status"
- Should see status updated

**View History:**

- Switch to "History & Timeline" tab
- Should see all trackings with their status history
- Timeline should show status progression

**Search & Filter:**

- Use search box to find by Order ID or Customer Name
- Use status filter dropdown
- Results should update in real-time

**Cancel Delivery:**

- Select a tracking
- Click cancel button
- Enter reason
- Confirm
- Status should change to CANCELLED

## ✅ Configuration Verification

### Backend Configuration (application.yaml)

- ✅ Port: 8081
- ✅ Database: logistics_db
- ✅ Username: root
- ✅ Password: Nuskyny@1234
- ✅ JPA: ddl-auto: update (auto-creates tables)

### Frontend Configuration (logisticsApi.ts)

- ✅ Base URL: http://localhost:8081/api/tracking
- ✅ CORS: Enabled with @CrossOrigin

### Status Values Match

Backend (DeliveryStatus.java):

- ORDER_CONFIRMED
- PROCESSING
- PACKED
- SHIPPED
- OUT_FOR_DELIVERY
- DELIVERED
- FAILED
- CANCELLED

Frontend (tracking.ts):

- ✅ All match backend enum values

## 🐛 Troubleshooting

### Backend won't start

1. Check MySQL is running
2. Verify database exists: `SHOW DATABASES;`
3. Check password in application.yaml
4. Look for port 8081 conflicts

### Frontend shows connection error

1. Verify backend is running on port 8081
2. Check browser console (F12) for errors
3. Check Network tab for failed requests
4. Verify CORS is enabled in controller

### Empty data

- Backend starts with empty database
- Use "Create Tracking" to add test data
- Or use curl commands above

### Status update fails

- Check status value matches enum (uppercase with underscores)
- Verify tracking ID exists
- Check backend logs for errors

## 📊 Expected Results

### After Creating 3 Trackings:

- Total Deliveries: 3
- In Transit: (depends on status)
- Delivered: (depends on status)
- Pending: (depends on status)

### Status Flow:

ORDER_CONFIRMED → PROCESSING → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED

### History Timeline:

- Each status change creates a history entry
- Timeline shows chronological progression
- Latest status highlighted

## ✅ Success Criteria

- [ ] Backend starts without errors
- [ ] Database tables auto-created
- [ ] Can create tracking via API
- [ ] Frontend loads without errors
- [ ] Can create tracking via UI
- [ ] Can update status
- [ ] Can view history timeline
- [ ] Search works
- [ ] Filter works
- [ ] Can cancel delivery
- [ ] Loading states display
- [ ] Error handling works

## 🎯 Integration Complete When:

1. Backend running on port 8081
2. Frontend connects successfully
3. All CRUD operations work
4. Status updates reflect in UI
5. History timeline displays correctly
6. No console errors
7. Data persists in MySQL database

---

**Your logistics-Service is ready for production! 🚀**
