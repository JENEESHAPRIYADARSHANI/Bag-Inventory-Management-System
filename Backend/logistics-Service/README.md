# 📦 Logistics Service - Delivery Tracking System

A complete RESTful backend service for managing delivery tracking and logistics operations. Built with Spring Boot 4.0.2, featuring real-time status tracking, comprehensive history management, and a robust MySQL database.

---

## 🚀 Features

- **30+ REST API Endpoints** - Complete CRUD operations for delivery management
- **Auto-generated Tracking IDs** - Unique tracking numbers for every delivery
- **Status History Tracking** - Full audit trail with @OneToMany relationship
- **Advanced Search & Filtering** - Search by order ID, customer name, status, and date ranges
- **Dual Interface** - Separate endpoints for admin operations and customer tracking
- **Cascade Operations** - Automatic history management with JPA relationships
- **Real-time Updates** - Track delivery status changes with timestamps
- **MySQL Database** - Persistent storage with Hibernate ORM

---

## 🛠️ Tech Stack

| Technology      | Version | Purpose               |
| --------------- | ------- | --------------------- |
| Spring Boot     | 4.0.2   | Application framework |
| Java            | 17      | Programming language  |
| Spring Data JPA | 4.0.2   | Database ORM          |
| Hibernate       | 7.2.1   | JPA implementation    |
| MySQL           | 8.0+    | Database              |
| MyBatis         | 4.0.1   | SQL mapping           |
| Lombok          | 1.18.42 | Boilerplate reduction |
| Maven           | 3.x     | Build tool            |

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Java 17** or higher installed
- **MySQL 8.0+** or XAMPP with MySQL
- **Maven 3.x** (included via wrapper)
- **IntelliJ IDEA** (recommended) or any Java IDE
- **Insomnia/Postman** for API testing

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd logistics-Service
```

### 2. Setup MySQL Database

```batch
cd database
setup_mysql.bat
```

Enter your MySQL root password when prompted (press Enter if no password).

### 3. Configure Database Connection

Edit `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/logistics_db
    username: root
    password: YOUR_MYSQL_PASSWORD # Change this!
```

### 4. Run the Application

**Option A: Using IntelliJ IDEA**

1. Open project in IntelliJ
2. Navigate to `LogisticsServiceApplication.java`
3. Click the green play button ▶️
4. Wait for "Started LogisticsServiceApplication"

**Option B: Using Maven**

```batch
mvnw.cmd spring-boot:run
```

### 5. Verify Installation

Open browser or API client:

```
GET http://localhost:8080/api/tracking
```

Expected response: `[]` (empty array)

---

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api/tracking
```

### Quick API Reference

| Method | Endpoint                               | Description             |
| ------ | -------------------------------------- | ----------------------- |
| POST   | `/api/tracking/create`                 | Create new tracking     |
| GET    | `/api/tracking`                        | Get all trackings       |
| GET    | `/api/tracking/{trackingId}`           | Get tracking by ID      |
| GET    | `/api/tracking/{trackingId}/history`   | Get tracking history    |
| PUT    | `/api/tracking/{trackingId}/status`    | Update delivery status  |
| PUT    | `/api/tracking/{trackingId}`           | Update tracking details |
| DELETE | `/api/tracking/{trackingId}`           | Delete tracking         |
| GET    | `/api/tracking/search?query={text}`    | Search trackings        |
| GET    | `/api/tracking/filter/status/{status}` | Filter by status        |

For complete API documentation, see **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

---

## 🧪 Testing the API

### Create a New Tracking

```http
POST http://localhost:8080/api/tracking/create
Content-Type: application/json

{
  "orderId": "ORD-12345",
  "customerName": "John Doe",
  "deliveryAddress": "123 Main Street, New York, NY 10001",
  "recipientPhone": "555-1234",
  "carrierName": "DHL Express",
  "estimatedDeliveryDate": "2026-03-01T10:00:00",
  "remarks": "Handle with care"
}
```

### Update Delivery Status

```http
PUT http://localhost:8080/api/tracking/TRK-XXXXXXXX/status
Content-Type: application/json

{
  "status": "SHIPPED",
  "location": "Distribution Center",
  "message": "Package shipped",
  "updatedBy": "admin"
}
```

### Get Tracking History

```http
GET http://localhost:8080/api/tracking/TRK-XXXXXXXX/history
```

---

## 📊 Database Schema

### Tables

**delivery_tracking**

- Primary table storing delivery information
- Auto-generated tracking IDs
- Timestamps for creation and updates

**tracking_history**

- Stores complete status change history
- @ManyToOne relationship with delivery_tracking
- Cascade delete enabled

### Relationship

```
delivery_tracking (1) ←→ (Many) tracking_history
```

### View in MySQL Workbench

```sql
USE logistics_db;
SHOW TABLES;
SELECT * FROM delivery_tracking;
SELECT * FROM tracking_history;
```

---

## 🔧 Configuration

### Application Properties

Located at: `src/main/resources/application.yaml`

```yaml
spring:
  application:
    name: logistics-service

  datasource:
    url: jdbc:mysql://localhost:3306/logistics_db
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update # Auto-creates tables
    show-sql: true # Shows SQL in console
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

server:
  port: 8080
```

---

## 📦 Delivery Status Values

| Status             | Description                    |
| ------------------ | ------------------------------ |
| `ORDER_CONFIRMED`  | Order received and confirmed   |
| `PROCESSING`       | Order being processed          |
| `PACKED`           | Package packed and ready       |
| `SHIPPED`          | Package shipped from warehouse |
| `OUT_FOR_DELIVERY` | Out for delivery to customer   |
| `DELIVERED`        | Successfully delivered         |
| `FAILED`           | Delivery attempt failed        |
| `CANCELLED`        | Order cancelled                |

---

## 🏗️ Project Structure

```
logistics-Service/
├── src/
│   ├── main/
│   │   ├── java/com/starbag/logistics_Service/
│   │   │   ├── controller/          # REST controllers
│   │   │   ├── service/             # Business logic
│   │   │   ├── repository/          # Data access layer
│   │   │   ├── entity/              # JPA entities
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   ├── exception/           # Exception handlers
│   │   │   ├── constants/           # Enums and constants
│   │   │   └── LogisticsServiceApplication.java
│   │   └── resources/
│   │       └── application.yaml     # Configuration
│   └── test/                        # Test files
├── database/
│   ├── create_database.sql          # Database creation script
│   └── setup_mysql.bat              # Setup automation
├── pom.xml                          # Maven dependencies
├── README.md                        # This file
└── API_DOCUMENTATION.md             # Complete API docs
```

---

## 🐛 Troubleshooting

### MySQL Connection Failed

**Problem:** Application can't connect to MySQL

**Solutions:**

1. Ensure MySQL service is running (XAMPP or Windows Service)
2. Verify database `logistics_db` exists
3. Check password in `application.yaml`
4. Test connection: `mysql -u root -p`

### Port 8080 Already in Use

**Problem:** Another application using port 8080

**Solution:** Change port in `application.yaml`:

```yaml
server:
  port: 8081
```

### Tables Not Created

**Problem:** Database exists but tables missing

**Solutions:**

1. Verify `ddl-auto: update` in `application.yaml`
2. Check console for Hibernate errors
3. Restart the application

### 500 Internal Server Error on Root URL

**Problem:** Error when accessing `http://localhost:8080/`

**Solution:** This is normal! Use `/api/tracking` endpoints instead.

---

## 🧪 Testing with Insomnia/Postman

1. **Import Collection** (if available) or create requests manually
2. **Set Base URL:** `http://localhost:8080`
3. **Test Endpoints:**
   - Create tracking → Note the `trackingId`
   - Update status multiple times
   - Get history → See all status changes
   - Delete tracking → Verify cascade delete

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is part of the Bag Inventory Management System.

---

## 👥 Authors

- **Starbag Development Team**

---

## 📞 Support

For issues and questions:

- Check **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** for endpoint details
- Review troubleshooting section above
- Check application logs in console

---

## 🎯 Next Steps

- [ ] Test all CRUD operations in Insomnia
- [ ] Verify @OneToMany relationship with history tracking
- [ ] Test cascade delete operations
- [ ] Explore search and filter endpoints
- [ ] Review API documentation for advanced features

---

**🚀 Your logistics tracking system is ready to use!**
