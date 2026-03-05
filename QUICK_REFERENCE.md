# Quick Reference Card - Quotation Management System

## 🚀 Start Commands

### Backend
```bash
cd Backend/quotation-service
mvnw spring-boot:run
```
**URL:** http://localhost:8080/api

### Frontend
```bash
cd frontend
npm run dev
```
**URL:** http://localhost:8080

### Database
```bash
mysql -u root -p
USE quotation_db;
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Status Required |
|--------|----------|-------------|-----------------|
| GET | `/quotations/products` | Get products | - |
| POST | `/quotations` | Create quotation | - |
| GET | `/quotations` | Get all quotations | - |
| GET | `/quotations/{id}` | Get quotation by ID | - |
| GET | `/quotations/search?email=xxx` | Search by email | - |
| PUT | `/quotations/{id}/send` | Send quotation | DRAFT |
| PUT | `/quotations/{id}/accept` | Accept quotation | SENT |
| POST | `/quotations/{id}/convert` | Convert to order | ACCEPTED |

---

## 📊 Database Tables

### quotations
```sql
SELECT * FROM quotations;
```
Columns: id, customer_id, company_name, contact_person, email, phone, status, total_amount, order_id, created_at

### quotation_items
```sql
SELECT * FROM quotation_items;
```
Columns: id, quotation_id, product_id, quantity, unit_price, discount, line_total

---

## 🔄 Status Flow

```
DRAFT → SENT → ACCEPTED → CONVERTED
```

- **DRAFT**: Quotation created by user
- **SENT**: Admin updated and sent to customer
- **ACCEPTED**: Customer accepted the quotation
- **CONVERTED**: Admin converted to order

---

## 🧪 Postman Quick Test

1. **Import Collection:** `Quotation-Management-System.postman_collection.json`
2. **Set Environment:** base_url = `http://localhost:8080/api`
3. **Run in Order:**
   - Get Products
   - Create Quotation (saves ID automatically)
   - Send Quotation
   - Accept Quotation
   - Convert to Order

---

## 🔍 Database Queries

### View all quotations
```sql
SELECT id, company_name, status, total_amount, created_at 
FROM quotations 
ORDER BY created_at DESC;
```

### View quotation with items
```sql
SELECT 
    q.id, q.company_name, q.status, q.total_amount,
    qi.product_id, qi.quantity, qi.unit_price, qi.line_total
FROM quotations q
LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
WHERE q.id = 1;
```

### Count by status
```sql
SELECT status, COUNT(*) as count 
FROM quotations 
GROUP BY status;
```

---

## ⚙️ Configuration Files

### Backend
`Backend/quotation-service/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quotation_db
spring.datasource.username=root
spring.datasource.password=your_password
server.port=8080
```

### Frontend
`frontend/.env.development`
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🐛 Common Issues

### Port 8080 in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>
```

### Database connection failed
1. Check MySQL is running
2. Verify password in application.properties
3. Create database: `CREATE DATABASE quotation_db;`

### CORS error
- Check `CorsConfig.java` includes your frontend URL
- Restart backend

---

## 📝 Sample Request Bodies

### Create Quotation
```json
{
  "customerId": "CUST001",
  "companyName": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "email": "john@techsolutions.com",
  "phone": "+1-555-0123",
  "items": [
    {"productId": 1, "quantity": 5}
  ]
}
```

### Send Quotation
```json
{
  "items": [
    {
      "itemId": 1,
      "unitPrice": 1199.99,
      "discount": 100.00
    }
  ]
}
```

---

## 📚 Documentation Files

- `COMPLETE_USER_GUIDE.md` - Full documentation
- `REFACTORING_COMPLETE.md` - Architecture details
- `AWS_DEPLOYMENT_COMPLETE.md` - Cloud deployment
- `Quotation-Management-System.postman_collection.json` - Postman collection

---

## 🎯 Testing Checklist

- [ ] Backend starts successfully
- [ ] Frontend loads at http://localhost:8080
- [ ] Can get products
- [ ] Can create quotation
- [ ] Can view quotations
- [ ] Can send quotation (admin)
- [ ] Can accept quotation (customer)
- [ ] Can convert to order (admin)
- [ ] Database tables created
- [ ] Data persists in database
