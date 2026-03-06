# 🚀 Running Quotation Service with MySQL

## Prerequisites

1. **MySQL Server** installed and running
2. **Java 17** installed
3. **Node.js** installed
4. **Maven** (or use the included Maven wrapper)

## Step 1: Setup MySQL Database

### Option 1: Local MySQL Installation

1. **Install MySQL** (if not already installed):
   - Windows: Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
   - Mac: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Start MySQL Service**:
   ```bash
   # Windows (as Administrator)
   net start mysql80
   
   # Mac
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

3. **Create Database and User**:
   ```sql
   # Connect to MySQL as root
   mysql -u root -p
   
   # Create database
   CREATE DATABASE quotation_db;
   
   # Create user (optional - you can use root)
   CREATE USER 'quotation_user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON quotation_db.* TO 'quotation_user'@'localhost';
   FLUSH PRIVILEGES;
   
   # Exit MySQL
   EXIT;
   ```

### Option 2: Docker MySQL (if you have Docker)

```bash
# Run MySQL in Docker container
docker run --name mysql-quotation \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=quotation_db \
  -p 3306:3306 \
  -d mysql:8.0

# Wait for MySQL to start (about 30 seconds)
docker logs mysql-quotation
```

## Step 2: Configure Application

### Update Database Configuration

Choose one of these options:

**Option A: Use Local Profile (Recommended)**
- The `application-local.properties` is already configured for local MySQL
- Database: `localhost:3306/quotation_db`
- Username: `root`
- Password: `password`

**Option B: Update Main Configuration**
Edit `Backend/quotation-service/src/main/resources/application.properties`:
```properties
# Local MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/quotation_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

## Step 3: Initialize Database Schema

Run the database schema script:
```bash
# Connect to MySQL and run the schema
mysql -u root -p quotation_db < Backend/quotation-service/database/schema.sql
```

Or manually execute the SQL from `Backend/quotation-service/database/schema.sql`

## Step 4: Start Backend Service

### Option A: Using Local Profile (Recommended)
```bash
cd Backend/quotation-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### Option B: Using Default Profile
```bash
cd Backend/quotation-service
./mvnw spring-boot:run
```

### Windows Users:
```cmd
cd Backend\quotation-service
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v4.0.2)

2024-03-06 10:30:00.000  INFO --- [           main] c.e.q.QuotationServiceApplication        : Starting QuotationServiceApplication
2024-03-06 10:30:05.000  INFO --- [           main] c.e.q.QuotationServiceApplication        : Started QuotationServiceApplication in 5.123 seconds
```

✅ **Backend running at: http://localhost:8080**

## Step 5: Test Backend API

```bash
# Test products endpoint
curl http://localhost:8080/api/quotations/products

# Test health (if you have actuator)
curl http://localhost:8080/actuator/health

# Test all quotations
curl http://localhost:8080/api/quotations
```

## Step 6: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend running at: http://localhost:5173**

## Step 7: Verify Everything Works

1. **Open browser**: http://localhost:5173
2. **Test quotation creation**: Try creating a new quotation
3. **Check database**: Verify data is saved in MySQL
4. **Test API endpoints**: Use browser dev tools to see API calls

## 🔍 Troubleshooting

### Backend Issues

**MySQL Connection Error:**
```
java.sql.SQLException: Access denied for user 'root'@'localhost'
```
**Solution:** Check MySQL username/password in application properties

**Database Not Found:**
```
java.sql.SQLSyntaxErrorException: Unknown database 'quotation_db'
```
**Solution:** Create the database: `CREATE DATABASE quotation_db;`

**Port Already in Use:**
```
Port 8080 was already in use
```
**Solution:** 
- Kill process: `netstat -ano | findstr :8080` then `taskkill /F /PID <process-id>`
- Or change port in application.properties: `server.port=8081`

### Frontend Issues

**API Connection Error:**
- Verify backend is running on port 8080
- Check `.env.development` has correct API URL: `VITE_API_URL=http://localhost:8080/api`

**CORS Error:**
- Backend CORS is configured in `CorsConfig.java`
- Should allow `http://localhost:5173`

## 🗄️ Database Management

### View Data in MySQL
```sql
# Connect to database
mysql -u root -p quotation_db

# View tables
SHOW TABLES;

# View quotations
SELECT * FROM quotations;

# View quotation items
SELECT * FROM quotation_items;
```

### Reset Database
```sql
# Drop and recreate database
DROP DATABASE quotation_db;
CREATE DATABASE quotation_db;

# Re-run schema
mysql -u root -p quotation_db < Backend/quotation-service/database/schema.sql
```

## 🎯 Success Indicators

- ✅ Backend starts without errors
- ✅ MySQL connection successful
- ✅ API endpoints respond (products, quotations)
- ✅ Frontend loads and connects to backend
- ✅ Can create and view quotations
- ✅ Data persists in MySQL database

## 📝 Configuration Summary

| Component | URL/Port | Configuration |
|-----------|----------|---------------|
| Backend API | http://localhost:8080 | Spring Boot with MySQL |
| Frontend | http://localhost:5173 | React with Vite |
| MySQL Database | localhost:3306 | quotation_db |
| API Base URL | http://localhost:8080/api | Used by frontend |

Your Quotation Management Service is now running with MySQL! 🎉