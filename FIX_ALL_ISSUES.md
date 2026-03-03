# Fix All Issues - Complete Guide

## Current Problem
❌ Backend cannot connect to MySQL (wrong password)
❌ Frontend shows "Failed to save payment method" (because backend is down)
✅ Frontend is running on http://localhost:8080/
✅ MySQL Server is running

## Solution - Run the Setup Script

I've created an automated setup script for you. Just run it and enter your MySQL password.

### Option 1: Run PowerShell Script (Recommended)

1. **Right-click** on `Setup-Database.ps1`
2. **Select** "Run with PowerShell"
3. **Enter** your MySQL root password when prompted
4. **Wait** for the script to complete

The script will:
- Test your MySQL connection
- Create the database
- Create all tables
- Update the backend configuration
- Verify everything is set up correctly

### Option 2: Run Batch Script

1. **Double-click** on `SETUP_DATABASE.bat`
2. **Enter** your MySQL root password when prompted
3. **Wait** for the script to complete

### Option 3: Manual Setup (If scripts don't work)

#### Step 1: Find Your MySQL Password

Open MySQL Workbench and check your saved connection to find the password.

#### Step 2: Update Backend Configuration

Edit this file:
```
Backend/Payment-Management-Service/src/main/resources/application.properties
```

Change this line:
```properties
spring.datasource.password=root
```

To your actual password:
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

#### Step 3: Create Database in MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local instance
3. Run this SQL:

```sql
CREATE DATABASE IF NOT EXISTS payment_management_db;

USE payment_management_db;

CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    payment_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    txn_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    card_holder_name VARCHAR(255),
    last4 VARCHAR(4),
    expiry_month INT,
    expiry_year INT,
    brand VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_cards (
    card_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) NOT NULL,
    card_holder_name VARCHAR(255) NOT NULL,
    expiry_date VARCHAR(7) NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    card_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Step 4: Restart Backend

After database is set up, restart the backend.

## After Setup - Restart Backend

Once the database is configured:

1. **Stop the current backend** (if running)
2. **Start it again:**
   ```bash
   cd Backend/Payment-Management-Service
   ./mvnw spring-boot:run
   ```

3. **Wait for it to start** (look for "Started PaymentManagementServiceApplication")

4. **Test the connection:**
   - Open http://localhost:8080/
   - Login as admin: `admin@starbags.com` / `admin123`
   - Go to Payments page
   - Try adding a payment method
   - Should work without errors!

## Verification

After setup, verify everything works:

### Test 1: Backend is Running
```bash
curl http://localhost:8085/api/payment-methods
```
Should return: `[]` (empty array) or list of methods

### Test 2: Frontend Can Connect
1. Open http://localhost:8080/
2. Login as admin
3. Go to Payments page
4. Should see "No saved payment methods" (not an error)
5. Click "Add Method"
6. Fill in details and save
7. Should see success message!

### Test 3: User Panel Works
1. Logout from admin
2. Login as user: `user@example.com` / `user123`
3. Go to Profile → Payment Methods
4. Add a card
5. Should save successfully!

## Common Issues

### Issue: "Access denied for user 'root'@'localhost'"
**Solution:** Your MySQL password is wrong. Find the correct password in MySQL Workbench.

### Issue: "Failed to save payment method"
**Solution:** Backend is not running. Check backend terminal for errors.

### Issue: Backend won't start
**Solution:** Check MySQL is running and database is created.

### Issue: Can't find MySQL password
**Solution:** 
1. Open MySQL Workbench
2. Look at "MySQL Connections" on home screen
3. Right-click your connection → Edit Connection
4. Click "Store in Vault" to see/edit password

## Success Indicators

You'll know everything is working when:
- ✅ Backend starts without errors
- ✅ Backend logs show: "Started PaymentManagementServiceApplication"
- ✅ Frontend loads without errors
- ✅ Can add payment methods in admin panel
- ✅ Can add cards in user panel
- ✅ Data persists after page refresh

## Need More Help?

If you're still having issues:
1. Check the backend terminal for error messages
2. Check browser console (F12) for frontend errors
3. Verify MySQL is running: `Get-Service MySQL80`
4. Test database connection in MySQL Workbench

---

**Quick Start:**
1. Run `Setup-Database.ps1` (right-click → Run with PowerShell)
2. Enter your MySQL password
3. Restart backend
4. Test at http://localhost:8080/

That's it! 🎉
