# Quick Start - Payment Management System

## 🚀 Start Everything in 3 Steps

### Step 0: Install Dependencies (First Time Only)
```bash
cd frontend
npm install
```

This will install all required dependencies including axios for API calls.

### Step 1: Start MySQL Database
Make sure MySQL is running on your system.

### Step 2: Start Backend (Terminal 1)
```bash
cd Backend/Payment-Management-Service

# First time only - setup database
cd database
setup_mysql.bat
cd ..

# Start the backend
mvnw spring-boot:run
```

Wait for: `Started PaymentManagementServiceApplication`

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend

# First time only - install dependencies
npm install

# Start the frontend
npm run dev
```

## ✅ Verify It's Working

1. Open browser: `http://localhost:5173`
2. Navigate to **Payments** page
3. You should see:
   - Payment statistics cards
   - List of payments from database
   - Saved payment methods

## 🎯 Quick Test

### Test 1: Create a Payment
1. Click **"Record Payment"** button
2. Fill in:
   - Order ID: `ORD-TEST-001`
   - Customer Name: `Test Customer`
   - Amount: `100`
   - Method: `Card`
   - Status: `Pending`
3. Click **"Record Payment"**
4. ✅ Should see success message
5. ✅ Payment appears in table

### Test 2: Update Status
1. Find a pending payment
2. Click the **shield icon** (verify)
3. ✅ Status changes to "Completed"
4. ✅ Success message appears

### Test 3: Add Payment Method
1. Scroll to **"Saved Payment Methods"**
2. Click **"Add Method"**
3. Fill in:
   - Card Holder: `John Doe`
   - Card Number: `**** **** **** 1234`
   - Expiry: `12/25`
4. Click **"Add Method"**
5. ✅ Card appears in grid

## 🔧 Ports Used

- **Backend**: `http://localhost:8085`
- **Frontend**: `http://localhost:5173`
- **MySQL**: `localhost:3306`

## 📊 Sample Data

The database comes with sample data:
- 3 sample payments
- 2 saved payment methods

## ❌ Troubleshooting

### Backend won't start
```bash
# Check if port 8085 is in use
netstat -ano | findstr :8085

# Check MySQL is running
mysql -u root -p
```

### Frontend shows errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to backend
1. Check backend is running: `http://localhost:8085/api/payments`
2. Check browser console (F12) for errors
3. Verify CORS is enabled in backend

## 📚 More Information

- **Full Setup Guide**: `PAYMENT_BACKEND_SETUP.md`
- **Backend API Docs**: `../Backend/Payment-Management-Service/API_DOCUMENTATION.md`
- **Card Management**: `../Backend/Payment-Management-Service/CARD_MANAGEMENT_GUIDE.md`

## 🎉 You're Ready!

Your payment management system is now running with:
- ✅ Real-time backend connection
- ✅ CRUD operations for payments
- ✅ Saved payment methods
- ✅ Statistics and filtering
- ✅ Toast notifications
- ✅ Loading states

Happy coding! 🚀
