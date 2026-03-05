# Quotation Management System - Complete Documentation

## 📚 Documentation Index

This project includes comprehensive documentation for running, testing, and deploying the Quotation Management System.

### 🎯 Start Here

1. **[COMPLETE_USER_GUIDE.md](COMPLETE_USER_GUIDE.md)** ⭐ **START HERE**
   - How to run backend and frontend
   - Complete API documentation
   - Postman testing guide
   - Database access instructions
   - Complete workflow explanation
   - Troubleshooting guide

2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** 
   - Quick commands
   - API endpoints table
   - Database queries
   - Common issues

### 🔧 Technical Documentation

3. **[REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)**
   - Microservices architecture
   - Convert to Order implementation
   - Service-to-service communication
   - Technical details

4. **[MICROSERVICES_ARCHITECTURE_ISSUE.md](MICROSERVICES_ARCHITECTURE_ISSUE.md)**
   - Architecture patterns
   - Order management explanation
   - Best practices

5. **[PRODUCT_ARCHITECTURE_ANALYSIS.md](PRODUCT_ARCHITECTURE_ANALYSIS.md)**
   - Product service integration
   - Correct vs incorrect patterns

### ☁️ Cloud Deployment

6. **[AWS_DEPLOYMENT_COMPLETE.md](AWS_DEPLOYMENT_COMPLETE.md)**
   - AWS deployment status
   - What works on cloud
   - Configuration for AWS
   - Next steps

7. **[CORS_FIXED.md](CORS_FIXED.md)**
   - CORS configuration
   - Frontend-backend connection

### 🧪 Testing

8. **[Quotation-Management-System.postman_collection.json](Quotation-Management-System.postman_collection.json)**
   - Import this file into Postman
   - Pre-configured API requests
   - Environment variables included

---

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
- Java 17
- Maven
- Node.js 18+
- MySQL 8.0

### 2. Setup Database
```bash
mysql -u root -p
CREATE DATABASE quotation_db;
EXIT;
```

### 3. Configure Backend
Edit `Backend/quotation-service/src/main/resources/application.properties`:
```properties
spring.datasource.password=your_mysql_password
```

### 4. Start Backend
```bash
cd Backend/quotation-service
mvnw spring-boot:run
```
Wait for: "Started QuotationServiceApplication"

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 6. Open Application
```
http://localhost:8080
```

---

## 📡 API Overview

**Base URL:** `http://localhost:8080/api`

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/quotations/products` | GET | Get products |
| `/quotations` | POST | Create quotation |
| `/quotations` | GET | Get all quotations |
| `/quotations/{id}` | GET | Get quotation by ID |
| `/quotations/search?email=xxx` | GET | Search by email |
| `/quotations/{id}/send` | PUT | Send quotation (Admin) |
| `/quotations/{id}/accept` | PUT | Accept quotation (Customer) |
| `/quotations/{id}/convert` | POST | Convert to order (Admin) |

---

## 🔄 Workflow

```
1. User creates quotation (DRAFT)
   ↓
2. Admin reviews and sends (SENT)
   ↓
3. Customer accepts (ACCEPTED)
   ↓
4. Admin converts to order (CONVERTED)
```

---

## 🗄️ Database

### Tables
- `quotations` - Main quotation data
- `quotation_items` - Line items

### Quick Queries
```sql
-- View all quotations
SELECT * FROM quotations;

-- View quotation items
SELECT * FROM quotation_items WHERE quotation_id = 1;

-- Count by status
SELECT status, COUNT(*) FROM quotations GROUP BY status;
```

---

## 🧪 Testing with Postman

1. Import `Quotation-Management-System.postman_collection.json`
2. Set base_url: `http://localhost:8080/api`
3. Run requests in order:
   - Get Products
   - Create Quotation
   - Send Quotation
   - Accept Quotation
   - Convert to Order

---

## 🏗️ Architecture

### Current (Local)
```
Frontend (localhost:8080)
    ↓
Quotation Service (localhost:8080/api)
    ↓
MySQL Database (quotation_db)
```

### Microservices (Target)
```
Frontend
    ↓
Quotation Service
    ├─→ Product Catalog Service
    └─→ Order Management Service
```

---

## ☁️ Cloud Deployment

**Current Status:**
- ✅ Quotation Service deployed on AWS
- ✅ RDS MySQL database
- ⚠️ Order Management Service not deployed (Convert to Order will fail)

**AWS Backend:** http://3.227.243.51:8080/api

See [AWS_DEPLOYMENT_COMPLETE.md](AWS_DEPLOYMENT_COMPLETE.md) for details.

---

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database exists
- Check port 8080 is free

### Frontend won't connect
- Check backend is running
- Verify `.env.development` has correct URL
- Check CORS configuration

### Database errors
- Check MySQL credentials
- Verify database exists: `SHOW DATABASES;`
- Check tables exist: `SHOW TABLES;`

---

## 📞 Support

For detailed help, see:
- **[COMPLETE_USER_GUIDE.md](COMPLETE_USER_GUIDE.md)** - Full documentation
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands

---

## 📝 Project Structure

```
Bag-Inventory-Management-System/
├── Backend/
│   └── quotation-service/
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       │   └── com/example/quotation_service/
│       │       │       ├── client/          # API clients
│       │       │       ├── config/          # Configuration
│       │       │       ├── controller/      # REST controllers
│       │       │       ├── dto/             # Data transfer objects
│       │       │       ├── model/           # Entities
│       │       │       ├── repository/      # Database repositories
│       │       │       └── service/         # Business logic
│       │       └── resources/
│       │           └── application.properties
│       └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── .env.development
│   ├── .env.production
│   └── package.json
└── Documentation/
    ├── COMPLETE_USER_GUIDE.md
    ├── QUICK_REFERENCE.md
    ├── REFACTORING_COMPLETE.md
    ├── AWS_DEPLOYMENT_COMPLETE.md
    └── Quotation-Management-System.postman_collection.json
```

---

## ✅ Features

- ✅ Create quotations
- ✅ View quotations
- ✅ Search by email
- ✅ Admin review and pricing
- ✅ Customer acceptance
- ✅ Convert to order (requires Order Management Service)
- ✅ CORS enabled
- ✅ MySQL persistence
- ✅ RESTful API
- ✅ Microservices architecture

---

## 🎯 Next Steps

1. **Test locally** - Follow COMPLETE_USER_GUIDE.md
2. **Deploy Order Management Service** - Enable order conversion
3. **Deploy Product Catalog Service** - Use real product data
4. **Setup Load Balancer** - Stable URLs
5. **Deploy Frontend to AWS** - Complete cloud deployment

---

**Version:** 1.0.0  
**Last Updated:** March 5, 2026  
**Status:** ✅ Deployed and Working
