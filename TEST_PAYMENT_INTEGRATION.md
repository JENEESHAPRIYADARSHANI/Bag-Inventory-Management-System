# Test Payment Integration - Step by Step

## Prerequisites
- ✅ Backend running on port 8085
- ✅ Frontend running on port 5173
- ✅ MySQL database running
- ✅ Axios installed (`npm list axios` shows version)

## Test 1: Backend is Running

Open terminal and run:
```bash
curl http://localhost:8085/api/payments
```

**Expected Result:**
```json
{
  "content": [...],
  "totalElements": 3,
  "totalPages": 1,
  ...
}
```

✅ If you see JSON data, backend is working!
❌ If you see "Connection refused", start the backend

---

## Test 2: Frontend Loads Data

1. Open browser: `http://localhost:5173`
2. Navigate to **Payments** page
3. Open DevTools (F12)
4. Go to **Network** tab
5. Refresh the page

**Expected Result:**
- See API calls to `http://localhost:8085/api/payments`
- See API calls to `http://localhost:8085/api/payment-methods`
- Status code: 200 (green)
- Response contains data

**What You Should See on Page:**
- Statistics cards with numbers (not zeros)
- Payment table with rows
- Saved payment methods cards

✅ If data loads, integration is working!
❌ If you see "Loading..." forever, check console for errors

---

## Test 3: Create Payment

1. Click **"Record Payment"** button
2. Fill in the form:
   ```
   Order ID: ORD-TEST-001
   Customer Name: Test Customer
   Amount: 150
   Method: Card
   Status: Pending
   Date: (today's date)
   Transaction Ref: TXN-TEST-001
   ```
3. Click **"Record Payment"**

**Expected Result:**
- ✅ Success toast appears: "Payment recorded successfully"
- ✅ Dialog closes
- ✅ New payment appears in table
- ✅ Statistics update (pending count +1)

**Check in DevTools Network Tab:**
- POST request to `/api/payments`
- Status: 200
- Response contains new payment with ID

**Verify in Database:**
```sql
SELECT * FROM payments WHERE orderId = 'ORD-TEST-001';
```

✅ If payment appears in table and database, CREATE works!

---

## Test 4: Update Payment

1. Find the payment you just created
2. Click **edit icon** (pencil)
3. Change customer name to: `Updated Test Customer`
4. Click **"Update Payment"**

**Expected Result:**
- ✅ Success toast: "Payment updated successfully"
- ✅ Dialog closes
- ✅ Customer name changes in table

**Check in DevTools:**
- PUT request to `/api/payments/PAY-XXX`
- Status: 200

**Verify in Database:**
```sql
SELECT * FROM payments WHERE orderId = 'ORD-TEST-001';
```

✅ If customer name updated, UPDATE works!

---

## Test 5: Change Payment Status

1. Find a pending payment
2. Click **shield icon** (verify)

**Expected Result:**
- ✅ Success toast: "Payment updated successfully"
- ✅ Status badge changes to "Completed" (green)
- ✅ Statistics update (pending -1, completed +1)

**Check in DevTools:**
- PATCH request to `/api/payments/PAY-XXX/status?status=COMPLETED`
- Status: 200

✅ If status changes, STATUS UPDATE works!

---

## Test 6: Delete Payment

1. Find a payment to delete
2. Click **trash icon**

**Expected Result:**
- ✅ Success toast: "Payment deleted successfully"
- ✅ Payment removed from table
- ✅ Statistics update

**Check in DevTools:**
- DELETE request to `/api/payments/PAY-XXX`
- Status: 204 (No Content)

**Verify in Database:**
```sql
SELECT * FROM payments WHERE paymentId = 'PAY-XXX';
-- Should return 0 rows
```

✅ If payment disappears, DELETE works!

---

## Test 7: View Payment Details

1. Click **eye icon** on any payment
2. Dialog opens

**Expected Result:**
- ✅ All payment details displayed
- ✅ Formatted correctly
- ✅ Status badge shows

✅ If details show, VIEW works!

---

## Test 8: Add Saved Payment Method

1. Scroll to **"Saved Payment Methods"** section
2. Click **"Add Method"**
3. Fill in form:
   ```
   Method Type: Card
   Card Holder Name: John Doe
   Masked Card Number: **** **** **** 1234
   Expiry Date: 12/25
   ```
4. Click **"Add Method"**

**Expected Result:**
- ✅ Success toast: "Payment method added successfully"
- ✅ Dialog closes
- ✅ New card appears in grid

**Check in DevTools:**
- POST request to `/api/payment-methods`
- Status: 200

**Verify in Database:**
```sql
SELECT * FROM saved_payment_methods WHERE last4 = '1234';
```

✅ If card appears, ADD METHOD works!

---

## Test 9: Update Saved Method

1. Click **"Edit"** on a saved method card
2. Change card holder name
3. Click **"Update Method"**

**Expected Result:**
- ✅ Success toast: "Payment method updated successfully"
- ✅ Dialog closes
- ✅ Name changes on card

**Check in DevTools:**
- PUT request to `/api/payment-methods/X`
- Status: 200

✅ If name updates, UPDATE METHOD works!

---

## Test 10: Delete Saved Method

1. Click **trash icon** on a saved method card

**Expected Result:**
- ✅ Success toast: "Payment method deleted successfully"
- ✅ Card removed from grid

**Check in DevTools:**
- DELETE request to `/api/payment-methods/X`
- Status: 204

✅ If card disappears, DELETE METHOD works!

---

## Test 11: Search and Filter

1. Enter "Test" in search box
2. Table filters to show only matching payments

**Expected Result:**
- ✅ Only payments with "Test" in ID, order, customer, or ref show
- ✅ Filtering happens instantly (client-side)

3. Select status filter: "Completed"
4. Table shows only completed payments

**Expected Result:**
- ✅ Only completed payments show
- ✅ Filtering works

5. Select date range
6. Table shows only payments in range

✅ If filtering works, SEARCH/FILTER works!

---

## Test 12: Statistics Accuracy

1. Note the statistics at top:
   - Total Revenue
   - Completed Count
   - Pending Count
   - Failed Count

2. Verify in database:
```sql
-- Total Revenue (completed only)
SELECT SUM(amount) FROM payments WHERE status = 'COMPLETED';

-- Completed Count
SELECT COUNT(*) FROM payments WHERE status = 'COMPLETED';

-- Pending Count
SELECT COUNT(*) FROM payments WHERE status = 'PENDING';

-- Failed Count
SELECT COUNT(*) FROM payments WHERE status = 'FAILED';
```

**Expected Result:**
- ✅ Numbers match database
- ✅ Statistics update after operations

✅ If numbers match, STATISTICS work!

---

## Test 13: Error Handling

### Test Backend Down
1. Stop backend (Ctrl+C in backend terminal)
2. Try to create a payment in frontend

**Expected Result:**
- ✅ Error toast appears: "Failed to record payment"
- ✅ No crash or blank screen
- ✅ Console shows error message

3. Restart backend
4. Try again

**Expected Result:**
- ✅ Works normally

✅ If error handling works, RESILIENCE is good!

---

## Test 14: Loading States

1. Refresh the page
2. Watch for loading spinner

**Expected Result:**
- ✅ Loading spinner shows initially
- ✅ Spinner disappears when data loads
- ✅ No flash of empty state

✅ If loading states show, UX is good!

---

## Test 15: Toast Notifications

For each operation, verify toast appears:
- ✅ Create payment → Success toast
- ✅ Update payment → Success toast
- ✅ Delete payment → Success toast
- ✅ Add method → Success toast
- ✅ Update method → Success toast
- ✅ Delete method → Success toast
- ✅ Error → Error toast

✅ If all toasts show, NOTIFICATIONS work!

---

## Final Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Data loads from backend
- [ ] Can create payments
- [ ] Can update payments
- [ ] Can delete payments
- [ ] Can change status
- [ ] Can view details
- [ ] Can add saved methods
- [ ] Can update saved methods
- [ ] Can delete saved methods
- [ ] Search/filter works
- [ ] Statistics are accurate
- [ ] Toast notifications show
- [ ] Loading states display
- [ ] Error handling works
- [ ] No console errors
- [ ] No network errors

---

## Success Criteria

✅ **All tests passed** = Integration is working perfectly!

❌ **Some tests failed** = Check TROUBLESHOOTING.md

---

## Common Issues During Testing

### Issue: "Loading..." never finishes
**Solution:** Check backend is running and accessible

### Issue: Toast notifications don't show
**Solution:** Check Sonner is imported in App.tsx

### Issue: Data doesn't update after operations
**Solution:** Check refresh functions are called in context

### Issue: Console shows CORS errors
**Solution:** Verify CORS is enabled in backend

### Issue: 404 errors in Network tab
**Solution:** Check API endpoints match backend

---

## Next Steps After Testing

1. ✅ All tests pass → System is ready!
2. 📝 Document any issues found
3. 🎨 Implement card management feature
4. 🔒 Add authentication
5. 🚀 Deploy to production

---

## Quick Debug Commands

### Check Backend
```bash
curl http://localhost:8085/api/payments
curl http://localhost:8085/api/payment-methods
curl http://localhost:8085/api/payments/summary
```

### Check Database
```sql
USE payment_management_db;
SELECT COUNT(*) FROM payments;
SELECT COUNT(*) FROM saved_payment_methods;
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
```

### Check Frontend
- Open DevTools (F12)
- Console tab → Check for errors
- Network tab → Check API calls
- Application tab → Check local storage

---

**Happy Testing! 🧪**

If all tests pass, your payment management system is fully operational! 🎉
