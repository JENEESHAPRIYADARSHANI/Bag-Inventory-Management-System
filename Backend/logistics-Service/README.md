# 📦 Logistics Service - Delivery Tracking System

A complete RESTful backend service for managing delivery tracking and logistics operations. Built with Spring Boot 4.0.2, featuring real-time status tracking, comprehensive history management, and ready for frontend integration.

---

## 🚀 Features

- **30+ REST API Endpoints** - Complete CRUD operations for delivery management
- **Auto-generated Tracking IDs** - Unique tracking numbers for every delivery
- **Status History Tracking** - Full audit trail with @OneToMany relationship
- **Advanced Search & Filtering** - Search by order ID, customer name, status, and date ranges
- **CORS Enabled** - Ready for frontend integration
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

- **Java 17** or higher
- **MySQL 8.0+** or XAMPP
- **Maven 3.x** (included via wrapper)
- **IntelliJ IDEA** (recommended)

---

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd logistics-Service
```

### 2. Setup MySQL Database

```batch
cd database
setup_mysql.bat
```

Enter your MySQL root password when prompted.

### 3. Configure Database

Edit `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    password: YOUR_MYSQL_PASSWORD # Change this!
```

### 4. Run Application

**IntelliJ IDEA:**

1. Open `LogisticsServiceApplication.java`
2. Click green play button ▶️
3. Wait for "Started LogisticsServiceApplication"

**Maven Command:**

```batch
mvnw.cmd spring-boot:run
```

### 5. Verify

```
GET http://localhost:8080/api/tracking
```

Expected: `[]` (empty array)

---

## 🌐 Frontend Integration

### API Base URL

```
http://localhost:8080/api/tracking
```

### CORS Configuration

✅ **CORS is already enabled** with `@CrossOrigin` annotation

- Accepts requests from any origin
- Supports all HTTP methods (GET, POST, PUT, DELETE)
- Ready for React, Angular, Vue, or any frontend framework

### Example Frontend Integration

#### JavaScript/Fetch API

```javascript
// Get all trackings
fetch("http://localhost:8080/api/tracking")
  .then((response) => response.json())
  .then((data) => console.log(data));

// Create new tracking
fetch("http://localhost:8080/api/tracking/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    orderId: "ORD-12345",
    customerName: "John Doe",
    deliveryAddress: "123 Main Street",
    recipientPhone: "555-1234",
    carrierName: "DHL",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

#### React/Axios

```javascript
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/tracking";

// Get all trackings
const getAllTrackings = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Create tracking
const createTracking = async (trackingData) => {
  const response = await axios.post(`${API_BASE_URL}/create`, trackingData);
  return response.data;
};

// Update status
const updateStatus = async (trackingId, statusData) => {
  const response = await axios.put(
    `${API_BASE_URL}/${trackingId}/status`,
    statusData,
  );
  return response.data;
};

// Get history
const getHistory = async (trackingId) => {
  const response = await axios.get(`${API_BASE_URL}/${trackingId}/history`);
  return response.data;
};
```

#### Angular Service

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TrackingService {
  private apiUrl = "http://localhost:8080/api/tracking";

  constructor(private http: HttpClient) {}

  getAllTrackings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTracking(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, data);
  }

  updateStatus(trackingId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${trackingId}/status`, data);
  }

  getHistory(trackingId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${trackingId}/history`);
  }
}
```

---

## 📚 API Endpoints

### Admin Operations

| Method | Endpoint                            | Description              |
| ------ | ----------------------------------- | ------------------------ |
| POST   | `/api/tracking/create`              | Create new tracking      |
| GET    | `/api/tracking`                     | Get all trackings        |
| GET    | `/api/tracking/{trackingId}`        | Get tracking by ID       |
| GET    | `/api/tracking/order/{orderId}`     | Get tracking by order ID |
| PUT    | `/api/tracking/{trackingId}/status` | Update delivery status   |
| PUT    | `/api/tracking/{trackingId}`        | Update tracking details  |
| DELETE | `/api/tracking/{trackingId}`        | Delete tracking          |

### History & Timeline

| Method | Endpoint                                     | Description              |
| ------ | -------------------------------------------- | ------------------------ |
| GET    | `/api/tracking/{trackingId}/history`         | Get tracking history     |
| GET    | `/api/tracking/{trackingId}/history/details` | Get detailed history     |
| GET    | `/api/tracking/history/status/{status}`      | Filter history by status |

### Search & Filter

| Method | Endpoint                               | Description              |
| ------ | -------------------------------------- | ------------------------ |
| GET    | `/api/tracking/search?query={text}`    | Search by order/customer |
| GET    | `/api/tracking/filter/status/{status}` | Filter by status         |
| GET    | `/api/tracking/filter/date-range`      | Filter by date range     |

### Customer Endpoints

| Method | Endpoint                                       | Description            |
| ------ | ---------------------------------------------- | ---------------------- |
| GET    | `/api/tracking/customer/{customerName}`        | Get customer trackings |
| GET    | `/api/tracking/customer/order/{orderId}`       | Get tracking by order  |
| GET    | `/api/tracking/customer/timeline/{trackingId}` | Get tracking timeline  |

For complete API documentation, see **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

---

## 🧪 API Testing Examples

### Create Tracking

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

### Update Status

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

### Get History

```http
GET http://localhost:8080/api/tracking/TRK-XXXXXXXX/history
```

---

## 📊 Database Schema

### Tables

- **delivery_tracking** - Main delivery information
- **tracking_history** - Status change history

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
│   │   │   ├── repository/          # Data access
│   │   │   ├── entity/              # JPA entities
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   ├── exception/           # Exception handlers
│   │   │   ├── constants/           # Enums
│   │   │   └── LogisticsServiceApplication.java
│   │   └── resources/
│   │       └── application.yaml     # Configuration
│   └── test/                        # Tests
├── database/
│   ├── create_database.sql          # Database script
│   └── setup_mysql.bat              # Setup automation
├── pom.xml                          # Maven dependencies
├── README.md                        # This file
└── API_DOCUMENTATION.md             # API docs
```

---

## 🐛 Troubleshooting

### MySQL Connection Failed

1. Ensure MySQL is running
2. Verify database `logistics_db` exists
3. Check password in `application.yaml`
4. Test: `mysql -u root -p`

### Port 8080 Already in Use

Change port in `application.yaml`:

```yaml
server:
  port: 8081
```

### CORS Issues with Frontend

CORS is already enabled. If issues persist:

1. Check frontend is making requests to correct URL
2. Verify backend is running on port 8080
3. Check browser console for specific errors

### 500 Error on Root URL

This is normal! Use `/api/tracking` endpoints, not root `/`

---

## 🔧 Configuration

### application.yaml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/logistics_db
    username: root
    password: YOUR_PASSWORD
  jpa:
    hibernate:
      ddl-auto: update # Auto-creates tables
    show-sql: true # Shows SQL in console
server:
  port: 8080
```

---

## 🎯 Next Steps

- [ ] Test all CRUD operations
- [ ] Verify @OneToMany relationship
- [ ] Test cascade delete operations
- [ ] Integrate with frontend application
- [ ] Test CORS with frontend
- [ ] Deploy to production

---

## 📝 License

Part of the Bag Inventory Management System.

---

## 👥 Authors

Starbag Development Team

---

**🚀 Your logistics tracking system is ready for frontend integration!**
