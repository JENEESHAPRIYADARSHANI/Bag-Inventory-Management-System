# Quotation Service - Quick Start

## 🚀 One-Command Start

### Windows:
```bash
start.bat
```

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

---

## 📋 Prerequisites Checklist

- [ ] Java 17+ installed (`java -version`)
- [ ] MySQL running on localhost:3306
- [ ] MySQL credentials: root / Wr250x&@8052

---

## 🌐 Access URLs

| Interface | URL |
|-----------|-----|
| **User Side** | http://localhost:8080/customer.html |
| **Admin Side** | http://localhost:8080/admin-dashboard.html |
| **Orders** | http://localhost:8080/orders.html |
| **API Docs** | http://localhost:8080/api/quotations |

---

## 🔄 Quotation Workflow

```
1. DRAFT      → Customer creates quotation
2. SENT       → Admin adds pricing & sends
3. ACCEPTED   → Customer accepts
4. CONVERTED  → Admin converts to order
```

---

## 🛠️ Manual Build & Run

### Build:
```bash
# Windows
mvnw.cmd clean package -DskipTests

# Linux/Mac
./mvnw clean package -DskipTests
```

### Run:
```bash
java -jar target/quotation-service-0.0.1-SNAPSHOT.jar
```

---

## 🧪 Quick Test

### Create a quotation:
```bash
curl -X POST http://localhost:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-001",
    "companyName": "Test Co",
    "contactPerson": "John Doe",
    "email": "john@test.com",
    "phone": "555-1234",
    "items": [{"productId": 1, "quantity": 2}]
  }'
```

### Get all quotations:
```bash
curl http://localhost:8080/api/quotations
```

---

## ⚙️ Configuration

Edit `src/main/resources/application.properties`:

```properties
# Change port
server.port=8080

# Database credentials
spring.datasource.username=root
spring.datasource.password=Wr250x&@8052

# External services
product.service.url=http://localhost:8081/api/products
order.service.url=http://localhost:8082/api/orders
```

---

## 🐛 Common Issues

### Port 8080 in use:
Change `server.port` in application.properties

### MySQL connection failed:
1. Start MySQL service
2. Verify credentials
3. Check port 3306

### Products not loading:
Service uses fallback products if Product Service is unavailable

---

## 📚 Full Documentation

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete instructions.
