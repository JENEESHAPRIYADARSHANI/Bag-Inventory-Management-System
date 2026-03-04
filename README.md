# 🎒 Bag Inventory Management System

A microservices-based inventory management system with delivery tracking.

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+

### 1. Setup MySQL Database

```batch
cd Backend\logistics-Service\database
setup_mysql.bat
```

### 2. Start Backend

```batch
cd Backend\logistics-Service
mvnw.cmd spring-boot:run
```

### 3. Start Frontend

```batch
cd frontend
npm install
npm run dev
```

### Access

- **Backend API**: http://localhost:8080/api/tracking
- **Frontend**: http://localhost:5173
- **MySQL**: localhost:3306 (database: `logistics_db`)

---

## 📚 Documentation

| Document                                                                                                 | Description               |
| -------------------------------------------------------------------------------------------------------- | ------------------------- |
| [Backend/logistics-Service/API_DOCUMENTATION.md](Backend/logistics-Service/API_DOCUMENTATION.md)         | Complete API reference    |
| [Backend/logistics-Service/POSTMAN_TESTING_GUIDE.md](Backend/logistics-Service/POSTMAN_TESTING_GUIDE.md) | **Test API with Postman** |
| [Backend/logistics-Service/MYSQL_SETUP_GUIDE.md](Backend/logistics-Service/MYSQL_SETUP_GUIDE.md)         | MySQL setup guide         |
| [Backend/logistics-Service/IDE_ERROR_FIX.md](Backend/logistics-Service/IDE_ERROR_FIX.md)                 | Fix IDE errors            |

---

## 🏗️ Project Structure

```
├── Backend/
│   └── logistics-Service/          ✅ Delivery Tracking (COMPLETED)
└── frontend/                        React + TypeScript
```

---

## ✨ Features

### Admin

- Create & manage tracking records
- Update delivery status
- Search & filter deliveries
- View complete history

### Customer (Read-Only)

- Track orders
- View delivery timeline
- Check delivery status

---

## 🎯 Delivery Status

```
ORDER_CONFIRMED → PROCESSING → PACKED → SHIPPED →
OUT_FOR_DELIVERY → DELIVERED / FAILED / CANCELLED
```

---

## 🔧 Tech Stack

**Backend**: Spring Boot 4.0.2, Java 17, MySQL, JPA  
**Frontend**: React 18, TypeScript, Vite, Tailwind CSS

---

## 📋 Key API Endpoints

```
POST   /api/tracking/create              Create tracking
GET    /api/tracking                     Get all trackings
PUT    /api/tracking/{id}/status         Update status
GET    /api/tracking/search?query=       Search
GET    /api/tracking/customer/{name}     Customer orders
```

**See [API_DOCUMENTATION.md](Backend/logistics-Service/API_DOCUMENTATION.md) for complete list**

---

## 🗄️ Database

- **Database**: `logistics_db`
- **Username**: `root`
- **Password**: `root` (change in application.yaml)
- **Tables**: Auto-created by Spring Boot

**Setup**: See [MYSQL_SETUP_GUIDE.md](Backend/logistics-Service/MYSQL_SETUP_GUIDE.md)

---

## 🐛 Troubleshooting

**IDE shows errors but Maven compiles?**  
→ See [IDE_ERROR_FIX.md](Backend/logistics-Service/IDE_ERROR_FIX.md)

**MySQL connection failed?**  
→ Check MySQL is running and password in `application.yaml`

---

## ✅ Status

- ✅ Logistics Service - Complete (30+ API endpoints)
- 🔄 Other services - Pending

---

**Ready to start!** 🚀
