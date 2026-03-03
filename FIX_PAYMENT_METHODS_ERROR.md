# Fix "Failed to Load Payment Methods" Error

## Problem
Admin panel shows error: "Failed to load payment methods"

## Quick Fixes

### Fix 1: Check Backend is Running

```bash
# Test if backend is accessible
curl http://localhost:8085/api/payment-methods
```

**Expected:** JSON array (even if empty: `[]`)
**If error:** Backend is not running or not accessible

**Solution:**
```bash
cd Backend/Payment-Management-Service
mvnw spring-boot:run
```

---

### Fix 2: Check Database Has Data

```sql
-- Connect to MySQL
mysql -u root -p

-- Use database
USE payment_management_db;

-- Check if table exists
SHOW TABLES;

-- Check data
SELECT * FROM saved_payment_methods;
```

**If table is empty:** This is normal! The error has been fixed to not show when there's no data.

**If table doesn't exist:** Run database setup:
```bash
cd Backend/Payment-Management-Service/database
mysql -u root -p < create_database.sql
```

---

### Fix 3: Add Sample Data

If you want to see sample data in the admin panel:

```sql
USE payment_management_db;

INSERT INTO saved_payment_methods 
(customer_name, type, card_holder_name, last4, expiry_month, expiry_year, brand, status, created_at, updated_at)
VALUES 
('John Doe', 'Card', 'John Doe', '4242', 12, 2027, 'Visa', 'ACTIVE', NOW(), NOW()),
('Jane Smith', 'Card', 'Jane Smith', '1234', 6, 2028, 'Mastercard', 'ACTIVE', NOW(), NOW());
```

Then refresh the admin panel page.

---

### Fix 4: Check CORS Configuration

If backend is running but frontend can't connect:

1. **Check browser console (F12)**
   - Look for CORS errors
   - Look for network errors

2. **Verify CORS is enabled in backend**
   - File: `Backend/Payment-Management-Service/src/main/java/com/starbag/Payment_Management_Service/config/CorsConfig.java`
   - Should allow all origins for development

3. **Restart backend after any config changes**

---

### Fix 5: Check API URL

Verify the API URL is correct:

**File:** `frontend/src/services/paymentApi.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';
```

Should point to: `http://localhost:8085/api`

---

### Fix 6: Clear Browser Cache

Sometimes the browser caches old errors:

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

Or:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## Verify Fix

After applying fixes:

1. **Refresh admin panel page**
2. **Check browser console (F12)**
   - Should see: "Refreshing payments..."
   - Should NOT see error messages

3. **Check Network tab**
   - Should see GET request to `/api/payment-methods`
   - Status should be 200 (green)
   - Response should be JSON array

4. **Check UI**
   - "Saved Payment Methods" section should show
   - Either cards display OR "No saved payment methods" message
   - NO error toast

---

## Still Having Issues?

### Debug Mode

Enable debug mode to see detailed logs:

**Create `frontend/.env`:**
```env
VITE_API_DEBUG=true
```

**Restart frontend:**
```bash
npm run dev
```

**Check console for detailed API logs**

### Check Backend Logs

Look at the terminal where backend is running:
- Any errors?
- Any stack traces?
- Database connection issues?

### Test Backend Directly

```bash
# Test payment methods endpoint
curl http://localhost:8085/api/payment-methods

# Test payments endpoint
curl http://localhost:8085/api/payments

# Test with verbose output
curl -v http://localhost:8085/api/payment-methods
```

### Check Database Connection

```bash
# Connect to MySQL
mysql -u root -p

# Test connection
SELECT 1;

# Check database
USE payment_management_db;
SHOW TABLES;
```

---

## Common Causes

1. **Backend not running** → Start backend
2. **Database not set up** → Run setup script
3. **Wrong API URL** → Check paymentApi.ts
4. **CORS issues** → Check CorsConfig.java
5. **Network issues** → Check firewall/antivirus
6. **Port conflict** → Check port 8085 is free

---

## Expected Behavior After Fix

### If No Data in Database:
- ✅ No error message
- ✅ "Saved Payment Methods" section shows
- ✅ Message: "No saved payment methods"
- ✅ Can add new methods

### If Data Exists:
- ✅ No error message
- ✅ Cards display in grid
- ✅ Can edit/delete cards
- ✅ All operations work

---

## Prevention

To avoid this error in the future:

1. **Always start backend before frontend**
2. **Verify database is running**
3. **Check backend logs for errors**
4. **Keep backend and frontend in sync**

---

## Quick Test

Run this quick test to verify everything works:

```bash
# Terminal 1 - Backend
cd Backend/Payment-Management-Service
mvnw spring-boot:run

# Terminal 2 - Test API
curl http://localhost:8085/api/payment-methods

# Terminal 3 - Frontend
cd frontend
npm run dev
```

Then:
1. Open `http://localhost:5173`
2. Login as admin: `admin@starbags.com` / `admin123`
3. Go to Payments page
4. Check "Saved Payment Methods" section
5. Should work without errors!

---

## Success!

If you followed these steps, the error should be fixed! ✅

The admin panel should now:
- Load without errors
- Show saved payment methods (or empty state)
- Allow adding new methods
- Work smoothly

---

**Need more help?** Check `TROUBLESHOOTING.md` for other common issues.
