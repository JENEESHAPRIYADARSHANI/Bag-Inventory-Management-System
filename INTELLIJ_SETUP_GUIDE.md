# IntelliJ IDEA Setup Guide - Payment Management Service

Complete guide to run the Payment Management Service (Backend + Frontend) in IntelliJ IDEA.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ IntelliJ IDEA (Community or Ultimate Edition)
- ✅ JDK 17 or higher
- ✅ MySQL Server 8.0 (running)
- ✅ Node.js 16+ and npm
- ✅ Maven (bundled with IntelliJ)

---

## 🚀 Part 1: Setup Backend in IntelliJ IDEA

### Step 1: Open Project in IntelliJ

1. **Launch IntelliJ IDEA**
2. Click **"Open"** or **"File → Open"**
3. Navigate to: `Backend/Payment-Management-Service`
4. Click **"OK"**
5. Wait for IntelliJ to import the Maven project (check bottom-right corner)

### Step 2: Configure JDK

1. Go to **"File → Project Structure"** (Ctrl+Alt+Shift+S)
2. Under **"Project"**:
   - Set **Project SDK**: Java 17 or higher
   - Set **Project language level**: 17
3. Click **"Apply"** and **"OK"**

### Step 3: Configure MySQL Database

#### Option A: Using MySQL Workbench (Recommended)

1. **Open MySQL Workbench**
2. **Connect to your local MySQL instance**
3. **Run this SQL:**

```sql
CREATE DATABASE IF NOT EXISTS payment_management_db;

USE payment_management_db;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    method VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    payment_date DATE NOT NULL,
    txn_ref VARCHAR(80),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
);

-- Create saved_payment_methods table
CREATE TABLE IF NOT EXISTS saved_payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL,
    card_holder_name VARCHAR(120) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    expiry_month INT NOT NULL,
    expiry_year INT NOT NULL,
    brand VARCHAR(40),
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_customer_name (customer_name),
    INDEX idx_status (status)
);

-- Create payment_cards table
CREATE TABLE IF NOT EXISTS payment_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    card_holder_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(19) NOT NULL UNIQUE,
    expiry_date VARCHAR(7) NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_card_number (card_number),
    INDEX idx_is_active (is_active)
);

-- Insert sample data
INSERT INTO payments (payment_id, order_id, customer_name, amount, method, status, payment_date, txn_ref, verified, created_at, updated_at)
VALUES 
('PAY-001', 'ORD-001', 'John Doe', 150.00, 'CARD', 'COMPLETED', '2024-01-15', 'TXN-12345', TRUE, NOW(), NOW()),
('PAY-002', 'ORD-002', 'Jane Smith', 250.50, 'ONLINE_TRANSFER', 'PENDING', '2024-01-16', 'TXN-12346', FALSE, NOW(), NOW());

INSERT INTO saved_payment_methods (customer_name, type, card_holder_name, last4, expiry_month, expiry_year, brand, status, created_at, updated_at)
VALUES 
('John Doe', 'Card', 'John Doe', '0366', 12, 2026, 'Visa', 'ACTIVE', NOW(), NOW()),
('Jane Smith', 'Card', 'Jane Smith', '0005', 9, 2027, 'American Express', 'ACTIVE', NOW(), NOW());
```

#### Option B: Using IntelliJ Database Tool

1. **Open Database Tool Window**: View → Tool Windows → Database
2. Click **"+"** → Data Source → MySQL
3. **Configure connection:**
   - Host: localhost
   - Port: 3306
   - Database: payment_management_db
   - User: root
   - Password: 0904 (or your MySQL password)
4. Click **"Test Connection"**
5. Click **"OK"**
6. Right-click database → **"Run SQL Script"**
7. Select: `Backend/Payment-Management-Service/database/create_database.sql`

### Step 4: Configure Application Properties

1. **Open file:** `src/main/resources/application.properties`
2. **Verify/Update MySQL password:**

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/payment_management_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=0904
```

**Important:** Replace `0904` with your actual MySQL root password!

### Step 5: Run Backend in IntelliJ

#### Method 1: Using Run Configuration (Recommended)

1. **Locate main class:** `PaymentManagementServiceApplication.java`
   - Path: `src/main/java/com/starbag/Payment_Management_Service/PaymentManagementServiceApplication.java`
2. **Right-click on the file**
3. Select **"Run 'PaymentManagementServiceApplication'"**
4. Wait for application to start (check console)
5. Look for: **"Started PaymentManagementServiceApplication"**

#### Method 2: Using Maven

1. **Open Maven Tool Window**: View → Tool Windows → Maven
2. Expand **"payment-management-service"**
3. Expand **"Plugins"** → **"spring-boot"**
4. **Double-click** on **"spring-boot:run"**

#### Method 3: Using Terminal in IntelliJ

1. **Open Terminal**: View → Tool Windows → Terminal
2. **Navigate to backend:**
   ```bash
   cd Backend/Payment-Management-Service
   ```
3. **Run Maven command:**
   ```bash
   ./mvnw spring-boot:run
   ```

### Step 6: Verify Backend is Running

**Check console output for:**
```
Started PaymentManagementServiceApplication in X.XXX seconds
Tomcat started on port 8085
```

**Test API endpoint:**
- Open browser: http://localhost:8085/api/payment-methods
- Should return JSON array (even if empty: `[]`)

---

## 🎨 Part 2: Setup Frontend in IntelliJ

### Step 1: Open Frontend in IntelliJ

#### Option A: Open in Same Window (Recommended)

1. In IntelliJ, go to **"File → Open"**
2. Navigate to: `frontend` folder
3. Select **"Attach"** when prompted (to keep backend open)

#### Option B: Open in New Window

1. **Launch new IntelliJ window**
2. Click **"Open"**
3. Navigate to: `frontend` folder
4. Click **"OK"**

### Step 2: Install Dependencies

1. **Open Terminal in IntelliJ**: View → Tool Windows → Terminal
2. **Ensure you're in frontend directory:**
   ```bash
   pwd  # Should show: .../frontend
   ```
3. **Install npm packages:**
   ```bash
   npm install
   ```
4. Wait for installation to complete

### Step 3: Configure Frontend Environment (Optional)

Create `.env` file in `frontend` folder if you need custom configuration:

```env
VITE_API_URL=http://localhost:8085/api
VITE_API_DEBUG=false
```

### Step 4: Run Frontend in IntelliJ

#### Method 1: Using npm Scripts (Recommended)

1. **Open Terminal in IntelliJ**
2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```
3. **Run development server:**
   ```bash
   npm run dev
   ```
4. **Wait for Vite to start**
5. Look for: **"Local: http://localhost:8080/"**

#### Method 2: Using IntelliJ npm Tool

1. **Open package.json** in frontend folder
2. **Right-click on "dev" script** in the scripts section
3. Select **"Run 'dev'"**

#### Method 3: Using Run Configuration

1. Go to **"Run → Edit Configurations"**
2. Click **"+"** → **"npm"**
3. **Configure:**
   - Name: Frontend Dev Server
   - Package.json: `frontend/package.json`
   - Command: run
   - Scripts: dev
4. Click **"OK"**
5. Click **"Run"** button (green play icon)

### Step 5: Verify Frontend is Running

**Check terminal output for:**
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:8080/
```

**Open browser:**
- Navigate to: http://localhost:8080/
- Should see the login page

---

## 🧪 Part 3: Test the Application

### Test 1: Admin Panel

1. **Open:** http://localhost:8080/
2. **Login as Admin:**
   - Email: `admin@starbags.com`
   - Password: `admin123`
3. **Navigate to "Payments" page**
4. **Verify:**
   - Can see saved payment methods
   - Can add new payment method
   - Can edit payment method
   - Can delete payment method

### Test 2: User Panel

1. **Logout from admin**
2. **Login as User:**
   - Email: `user@example.com`
   - Password: `user123`
3. **Go to Profile → Payment Methods**
4. **Test adding a card:**
   - Card Holder: Test User
   - Card Number: 4532 0151 1283 0366
   - Expiry: 12/26
   - CVV: 123
5. **Verify:**
   - Card saves successfully
   - Card appears in list
   - Can edit card
   - Can delete card

### Test 3: Data Sync

1. **As User:** Add a payment method
2. **Switch to Admin:** See the new method in admin panel
3. **As Admin:** Edit or delete the method
4. **Verify:** Changes are reflected

---

## 🔧 IntelliJ Tips & Tricks

### Hot Reload Backend

IntelliJ IDEA Ultimate has Spring Boot DevTools support:

1. **Add to pom.xml** (if not present):
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

2. **Enable auto-build:**
   - Settings → Build, Execution, Deployment → Compiler
   - Check "Build project automatically"

3. **Enable auto-restart:**
   - Settings → Advanced Settings
   - Check "Allow auto-make to start even if developed application is currently running"

### Hot Reload Frontend

Frontend already has hot reload enabled with Vite. Just save files and see changes instantly!

### Debug Backend

1. **Set breakpoints** in your Java code (click left margin)
2. **Run in Debug mode:**
   - Right-click `PaymentManagementServiceApplication.java`
   - Select **"Debug 'PaymentManagementServiceApplication'"**
3. **Trigger the code** (e.g., make API call)
4. **IntelliJ will pause** at breakpoints

### View Logs

**Backend logs:**
- Check "Run" tool window at bottom
- All Spring Boot logs appear here

**Frontend logs:**
- Check "Run" tool window for Vite logs
- Check browser console (F12) for frontend logs

### Database Tool

**View data in IntelliJ:**
1. Open Database tool window
2. Connect to MySQL (see Step 3, Option B above)
3. Browse tables
4. Run queries
5. View/edit data

---

## 📁 Project Structure in IntelliJ

### Backend Structure
```
Payment-Management-Service/
├── src/
│   ├── main/
│   │   ├── java/com/starbag/Payment_Management_Service/
│   │   │   ├── PaymentManagementServiceApplication.java  ← Main class
│   │   │   ├── controller/                               ← REST endpoints
│   │   │   ├── service/                                  ← Business logic
│   │   │   ├── repository/                               ← Database access
│   │   │   ├── entity/                                   ← JPA entities
│   │   │   ├── dto/                                      ← Data transfer objects
│   │   │   └── config/                                   ← Configuration
│   │   └── resources/
│   │       └── application.properties                    ← Configuration file
│   └── test/                                             ← Unit tests
├── pom.xml                                               ← Maven dependencies
└── database/
    └── create_database.sql                               ← Database setup
```

### Frontend Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Payments.tsx                                  ← Admin payment page
│   │   └── user/
│   │       └── UserPaymentMethods.tsx                    ← User payment page
│   ├── services/
│   │   └── paymentApi.ts                                 ← API service layer
│   ├── contexts/
│   │   └── PaymentContext.tsx                            ← State management
│   ├── components/                                       ← Reusable components
│   └── App.tsx                                           ← Main app component
├── package.json                                          ← npm dependencies
└── vite.config.ts                                        ← Vite configuration
```

---

## 🐛 Troubleshooting in IntelliJ

### Issue: Backend won't start - "Access denied for user 'root'"

**Solution:**
1. Open `application.properties`
2. Update MySQL password:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Restart backend

### Issue: "Port 8085 already in use"

**Solution:**
1. Stop any running backend instance
2. Or change port in `application.properties`:
   ```properties
   server.port=8086
   ```
3. Update frontend API URL accordingly

### Issue: Frontend shows "Failed to load payment methods"

**Solution:**
1. Verify backend is running (check console)
2. Test backend: http://localhost:8085/api/payment-methods
3. Check browser console (F12) for errors
4. Verify CORS is enabled in backend

### Issue: Maven dependencies not downloading

**Solution:**
1. Right-click `pom.xml`
2. Select **"Maven → Reload Project"**
3. Or: View → Tool Windows → Maven → Click refresh icon

### Issue: npm install fails

**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Or try: `npm install --legacy-peer-deps`

### Issue: Can't see Database tool window

**Solution:**
- IntelliJ Community: Database tools not available
- IntelliJ Ultimate: View → Tool Windows → Database
- Alternative: Use MySQL Workbench

---

## ⚡ Quick Start Commands

### Start Everything (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd Backend/Payment-Management-Service
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Stop Everything

- Press **Ctrl+C** in each terminal
- Or click **Stop** button (red square) in IntelliJ Run tool window

---

## 📚 Additional Resources

### IntelliJ Documentation
- [Spring Boot in IntelliJ](https://www.jetbrains.com/help/idea/spring-boot.html)
- [Maven in IntelliJ](https://www.jetbrains.com/help/idea/maven-support.html)
- [Database Tools](https://www.jetbrains.com/help/idea/database-tool-window.html)

### Project Documentation
- `API_DOCUMENTATION.md` - Complete API reference
- `README.md` - Project overview
- `CARD_MANAGEMENT_GUIDE.md` - Feature guide
- `ALL_ISSUES_FIXED.md` - Setup verification

---

## ✅ Success Checklist

After setup, verify:

- [ ] IntelliJ opened backend project
- [ ] JDK 17+ configured
- [ ] MySQL database created
- [ ] application.properties updated with correct password
- [ ] Backend starts without errors
- [ ] Backend accessible at http://localhost:8085
- [ ] Frontend dependencies installed
- [ ] Frontend starts without errors
- [ ] Frontend accessible at http://localhost:8080
- [ ] Can login as admin
- [ ] Can add payment methods
- [ ] Can login as user
- [ ] Can add cards
- [ ] Data syncs between user and admin

---

## 🎓 For Your University Project

**Presentation Tips:**

1. **Show the architecture:**
   - Spring Boot backend (REST API)
   - React frontend (Vite + TypeScript)
   - MySQL database
   - Full-stack integration

2. **Demonstrate features:**
   - User can manage their payment methods
   - Admin can see all payment methods
   - Real-time data synchronization
   - CRUD operations working

3. **Highlight technologies:**
   - Java 17, Spring Boot 3.x
   - React 18, TypeScript
   - MySQL 8.0
   - RESTful API design
   - Responsive UI

---

**Good luck with your university project! 🎉**

If you encounter any issues, check the troubleshooting section or refer to other documentation files.
