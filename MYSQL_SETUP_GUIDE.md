# MySQL Setup Guide for Payment Management Service

## Current Status
- ✅ Frontend running on http://localhost:8080/
- ❌ Backend failed - MySQL connection issue
- ✅ MySQL Server 8.0 is running

## Problem
The backend can't connect to MySQL because the password in the configuration doesn't match your actual MySQL password.

## Solution

### Step 1: Find Your MySQL Password

Your MySQL root password is NOT "root". You need to find the correct password.

**Where to find it:**
- Check MySQL Workbench (if you have a saved connection, the password is there)
- Check your notes or password manager
- If you forgot it, you may need to reset the MySQL root password

### Step 2: Update Backend Configuration

Once you know your MySQL password, update this file:

**File:** `Backend/Payment-Management-Service/src/main/resources/application.properties`

**Change this line:**
```properties
spring.datasource.password=root
```

**To your actual password:**
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Step 3: Create Database Using MySQL Workbench

1. **Open MySQL Workbench**
2. **Connect to Local Instance** (use your saved connection)
3. **Run this SQL:**
   ```sql
   CREATE DATABASE IF NOT EXISTS payment_management_db;
   USE payment_management_db;
   ```

4. **Run the table creation script:**
   - Open file: `Backend/Payment-Management-Service/database/create_database.sql`
   - Copy all the SQL
   - Paste and execute in MySQL Workbench

### Step 4: Restart Backend

After updating the password and creating the database:

1. Stop the current backend process (if running)
2. Start it again:
   ```bash
   cd Backend/Payment-Management-Service
   ./mvnw spring-boot:run
   ```

## Alternative: Use MySQL Command Line

If you know your MySQL password, you can use command line:

```powershell
# Set MySQL path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# Create database (replace YOUR_PASSWORD)
& $mysqlPath -u root -pYOUR_PASSWORD -e "CREATE DATABASE IF NOT EXISTS payment_management_db;"

# Run setup script (replace YOUR_PASSWORD)
& $mysqlPath -u root -pYOUR_PASSWORD payment_management_db < Backend/Payment-Management-Service/database/create_database.sql
```

## Quick Test

After setup, test the connection:

```powershell
# Test database exists (replace YOUR_PASSWORD)
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pYOUR_PASSWORD -e "SHOW DATABASES LIKE 'payment_management_db';"
```

Should show:
```
+---------------------------+
| Database (payment_management_db) |
+---------------------------+
| payment_management_db     |
+---------------------------+
```

## What's Next?

Once MySQL is set up:
1. Backend will start successfully on port 8085
2. Frontend (already running on port 8080) will connect to backend
3. You can test the payment management features!

## Need Help?

If you don't know your MySQL password:
1. Open MySQL Workbench
2. Look at your saved connections
3. The password should be saved there (you can view it)

Or you may need to reset your MySQL root password (Google: "reset MySQL root password Windows")

---

**Current Services:**
- ✅ Frontend: http://localhost:8080/
- ⏳ Backend: Waiting for MySQL setup
- ✅ MySQL: Running (needs correct password)
