# Logistics Service - Delivery Tracking

Complete backend service for delivery tracking with MySQL database.

## Quick Start

### 1. Setup MySQL

```batch
cd database
setup_mysql.bat
```

### 2. Start Service

```batch
mvnw.cmd spring-boot:run
```

### 3. Test API

```
http://localhost:8080/api/tracking
```

## Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All API endpoints
- **[POSTMAN_TESTING_GUIDE.md](POSTMAN_TESTING_GUIDE.md)** - Test with Postman
- **[MYSQL_SETUP_GUIDE.md](MYSQL_SETUP_GUIDE.md)** - Database setup
- **[IDE_ERROR_FIX.md](IDE_ERROR_FIX.md)** - Fix IDE issues

## Features

- ✅ 30+ REST API endpoints
- ✅ Auto-generated tracking IDs
- ✅ Status history tracking
- ✅ Search & filter
- ✅ Admin & customer views
- ✅ MySQL database

## Configuration

**Database**: `application.yaml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/logistics_db
    username: root
    password: root # Change this
```

## Status Values

- ORDER_CONFIRMED
- PROCESSING
- PACKED
- SHIPPED
- OUT_FOR_DELIVERY
- DELIVERED
- FAILED
- CANCELLED

---

**Everything is ready to use!** 🚀
