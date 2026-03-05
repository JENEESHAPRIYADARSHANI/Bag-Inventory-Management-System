# Troubleshooting Guide - Payment Management Frontend

## Common Issues and Solutions

### 1. "Failed to resolve import 'axios'" Error

**Problem:** Axios is not installed in the project.

**Solution:**
```bash
cd frontend
npm install axios
```

Then restart the dev server:
```bash
npm run dev
```

---

### 2. Frontend Won't Start

**Problem:** Dependencies are missing or corrupted.

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### 3. "Cannot connect to backend" / CORS Errors

**Problem:** Backend is not running or CORS is not configured.

**Solution:**

1. **Check if backend is running:**
```bash
curl http://localhost:8085/api/payments
```

2. **Start backend if not running:**
```bash
cd Backend/Payment-Management-Service
mvnw spring-boot:run
```

3. **Verify CORS configuration** in backend:
   - File: `src/main/java/com/starbag/Payment_Management_Service/config/CorsConfig.java`
   - Should allow all origins for development

---

### 4. "Loading..." Never Finishes

**Problem:** API calls are failing silently.

**Solution:**

1. **Open browser DevTools (F12)**
2. **Go to Console tab** - Check for errors
3. **Go to Network tab** - Check API calls
4. **Look for failed requests** (red status codes)

**Common causes:**
- Backend not running
- Wrong API URL in `paymentApi.ts`
- Database connection issues
- Network firewall blocking requests

---

### 5. Toast Notifications Not Showing

**Problem:** Sonner (toast library) not properly configured.

**Solution:**

1. **Check if Toaster is in App.tsx:**
```typescript
import { Toaster as Sonner } from "@/components/ui/sonner";

// In the component:
<Sonner />
```

2. **Verify sonner is installed:**
```bash
npm list sonner
```

3. **Reinstall if needed:**
```bash
npm install sonner
```

---

### 6. "Module not found" Errors

**Problem:** TypeScript can't find modules.

**Solution:**

1. **Check tsconfig.json has path aliases:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **Restart TypeScript server** in VS Code:
   - Press `Ctrl+Shift+P`
   - Type "TypeScript: Restart TS Server"
   - Press Enter

---

### 7. Data Not Updating After Operations

**Problem:** Context not refreshing data.

**Solution:**

1. **Check if refresh functions are called** in PaymentContext.tsx
2. **Verify API calls are successful** in Network tab
3. **Check for errors in console**

**Debug:**
```typescript
// Add console.log in PaymentContext
const refreshPayments = async () => {
  console.log('Refreshing payments...');
  try {
    const response = await paymentApi.getPayments({ size: 100 });
    console.log('Payments loaded:', response);
    // ...
  } catch (error) {
    console.error('Failed to fetch payments:', error);
  }
};
```

---

### 8. Port Already in Use

**Problem:** Port 5173 is already being used.

**Solution:**

Vite will automatically use the next available port. Check the terminal output:
```
Local: http://localhost:5174  <-- Note the different port
```

Or manually specify a port in `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

---

### 9. Build Errors

**Problem:** TypeScript compilation errors.

**Solution:**

1. **Check for type errors:**
```bash
npm run build
```

2. **Fix common type issues:**
   - Missing imports
   - Incorrect prop types
   - Undefined variables

3. **Verify all dependencies are installed:**
```bash
npm install
```

---

### 10. Slow Performance / Lag

**Problem:** Too much data or inefficient rendering.

**Solution:**

1. **Limit data fetching:**
```typescript
// In paymentApi.ts
const response = await paymentApi.getPayments({ 
  size: 50  // Reduce from 100
});
```

2. **Add pagination** to the table
3. **Use React.memo** for expensive components
4. **Check for memory leaks** in DevTools

---

### 11. Environment Variables Not Working

**Problem:** `.env` file not being read.

**Solution:**

1. **Create `.env` file** in frontend root:
```env
VITE_API_URL=http://localhost:8085/api
VITE_API_DEBUG=false
```

2. **Restart dev server** (required for env changes):
```bash
# Stop server (Ctrl+C)
npm run dev
```

3. **Verify variables are loaded:**
```typescript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Note:** Environment variables must start with `VITE_` to be exposed to the client.

---

### 12. Database Connection Issues

**Problem:** Backend can't connect to MySQL.

**Solution:**

1. **Check MySQL is running:**
```bash
mysql -u root -p
```

2. **Verify database exists:**
```sql
SHOW DATABASES;
USE payment_management_db;
SHOW TABLES;
```

3. **Check credentials** in `application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

4. **Run database setup script:**
```bash
cd Backend/Payment-Management-Service/database
setup_mysql.bat
```

---

### 13. API Returns 404 Not Found

**Problem:** Endpoint doesn't exist or wrong URL.

**Solution:**

1. **Verify backend endpoints:**
```bash
# List all endpoints
curl http://localhost:8085/api/payments
curl http://localhost:8085/api/payment-methods
```

2. **Check API URL** in `paymentApi.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8085/api';
```

3. **Verify controller mappings** in backend:
   - `@RequestMapping("/api/payments")`
   - `@RequestMapping("/api/payment-methods")`

---

### 14. API Returns 500 Internal Server Error

**Problem:** Backend error.

**Solution:**

1. **Check backend logs** in terminal
2. **Look for stack traces**
3. **Common causes:**
   - Database query errors
   - Null pointer exceptions
   - Data validation failures

4. **Test endpoint directly:**
```bash
curl -X POST http://localhost:8085/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST",
    "customerName": "Test",
    "amount": 100,
    "method": "CARD",
    "status": "PENDING",
    "paymentDate": "2024-01-15",
    "txnRef": "TEST"
  }'
```

---

### 15. Changes Not Reflecting

**Problem:** Browser cache or hot reload issues.

**Solution:**

1. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Debug Mode

Enable debug mode to see detailed API logs:

1. **Create `.env` file:**
```env
VITE_API_DEBUG=true
```

2. **Restart dev server**

3. **Check console** for API request/response logs

---

## Getting Help

If you're still stuck:

1. **Check browser console** (F12) for errors
2. **Check backend logs** for errors
3. **Review Network tab** for failed requests
4. **Check database** for data issues
5. **Review documentation:**
   - `QUICK_START.md`
   - `PAYMENT_BACKEND_SETUP.md`
   - `INTEGRATION_CHECKLIST.md`

---

## Useful Commands

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Check for issues
npm run lint
```

### Backend
```bash
# Start backend
mvnw spring-boot:run

# Clean and compile
mvnw clean compile

# Run tests
mvnw test

# Package as JAR
mvnw package
```

### Database
```bash
# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use database
USE payment_management_db;

# Show tables
SHOW TABLES;

# View data
SELECT * FROM payments;
SELECT * FROM saved_payment_methods;
```

---

## Still Having Issues?

1. Delete everything and start fresh:
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd Backend/Payment-Management-Service
mvnw clean install

# Database
mysql -u root -p
DROP DATABASE payment_management_db;
# Then run setup script again
```

2. Check system requirements:
   - Node.js v16 or higher
   - Java 17
   - MySQL 8.0
   - Maven 3.6+

3. Verify all services are running:
   - MySQL on port 3306
   - Backend on port 8085
   - Frontend on port 5173 (or next available)

---

Good luck! 🚀
