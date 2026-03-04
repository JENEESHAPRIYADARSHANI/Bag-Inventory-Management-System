# Payment Methods Management Service

A backend REST API service for managing saved payment methods and cards, built with Spring Boot and MySQL.

**University Project Topic:** Payment Options Management

---

## 📋 Quick Links

- **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** - Architecture, database design, ER diagrams
- **[SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)** - File structure & what each file does
- **[SYSTEM_FLOWS.md](SYSTEM_FLOWS.md)** - Data flows, API workflows, diagrams
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[DOCKER.md](DOCKER.md)** - Docker setup and usage

---

## 🎯 What is This Service?

This service manages **payment options/methods** - allowing users and admins to manage saved payment cards.

**Your University Topic:** Payment Methods Management

### What This Service Does

✅ Users can add their payment cards  
✅ Users can edit/delete their cards  
✅ Admin can view all payment cards  
✅ Admin can manage any card  
✅ Card details stored securely (masked)  
✅ Support multiple card types (Visa, Mastercard, Amex)  
✅ RESTful API with JSON  
✅ MySQL database  
✅ Docker support

### What This Service Does NOT Do

❌ Process actual payments  
❌ Record payment transactions  
❌ Payment history tracking  
❌ Order management

**Focus:** This is about managing payment OPTIONS, not processing payments  

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.9+
- MySQL 8.0

### Setup & Run

```bash
# 1. Setup database
mysql -u root -p < database/create_database.sql

# 2. Configure password in application.properties
# Edit: src/main/resources/application.properties

# 3. Run application
./mvnw spring-boot:run

# 4. Test
curl http://localhost:8085/api/payment-methods
```

**Service URL:** http://localhost:8085

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **SYSTEM_OVERVIEW.md** | System architecture, database ER diagrams |
| **SYSTEM_ARCHITECTURE.md** | File structure, component explanations |
| **SYSTEM_FLOWS.md** | Data flows, API workflows, diagrams |
| **API_DOCUMENTATION.md** | API endpoints, examples |
| **DOCKER.md** | Docker configuration |

---

## 🔌 API Endpoints

### Payment Methods (Your Topic)
```
GET    /api/payment-methods           - Get all saved cards
GET    /api/payment-methods/{id}      - Get specific card
POST   /api/payment-methods           - Add new card
PUT    /api/payment-methods/{id}      - Update card details
DELETE /api/payment-methods/{id}      - Delete card
```

**Base URL:** `http://localhost:8085`

**What these endpoints do:**
- Users can manage their own payment cards
- Admin can manage all payment cards
- Store card information securely
- Enable/disable cards

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for details.

---

## 💾 Database

### Tables (Your Topic)

1. **saved_payment_methods** - Main table for saved cards
   - Stores card holder name, last 4 digits, expiry, brand
   - Used by both users and admin

2. **payment_cards** - Detailed card information
   - Stores full card details (for demo purposes)
   - User-specific cards

**Note:** No payment transaction tables - this service only manages payment OPTIONS, not actual payments.

See [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) for complete ER diagrams.

---

## 🏗️ Architecture

```
Controller → Service → Repository → Database
```

**Tech Stack:**
- Spring Boot 3.2.6
- Java 17
- MySQL 8.0
- JPA/Hibernate
- Maven

See [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) for details.

---

## 🐳 Docker

```bash
# Build
docker build -t payment-service .

# Run
docker run -d -p 8085:8085 \
  -e SPRING_DATASOURCE_PASSWORD=0904 \
  payment-service
```

See [DOCKER.md](DOCKER.md) for complete guide.

---

## 🎓 For University Project

**Your Topic:** Payment Methods/Options Management

**What You're Demonstrating:**
- How users can save and manage their payment cards
- How admin can view and manage all cards
- Secure card storage (masking sensitive data)
- RESTful API design
- Spring Boot backend development
- Database design for payment methods

**Key Points for Presentation:**
1. **User Features** - Add, edit, delete their own cards
2. **Admin Features** - Manage all cards in the system
3. **Security** - Card number masking, only last 4 digits shown
4. **Architecture** - Layered design (Controller → Service → Repository)
5. **Database** - Proper schema for storing payment methods

**Technologies:**
- Spring Boot REST API
- JPA/Hibernate ORM
- MySQL database
- Docker containerization

---

**Port:** 8085  
**Database:** payment_management_db  
**Topic:** Payment Methods Management (NOT payment processing)  
**Tech:** Spring Boot + Java 17 + MySQL 8.0
