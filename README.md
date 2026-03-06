# Bag Inventory Management System

Complete inventory management system for bag manufacturing with quotation management, order processing, and more.

## Quotation Management System

### Quick Start

1. **Start Backend**
   ```bash
   cd Backend/quotation-service
   mvn spring-boot:run
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Documentation

- **Complete Guide**: See `QUOTATION_SYSTEM_GUIDE.md`
- **API Testing**: Import `Quotation-Service-Complete-With-Delete.postman_collection.json` into Postman
- **Postman Guide**: See `POSTMAN_TESTING_GUIDE.md`

### Workflow

```
CUSTOMER CREATES → DRAFT → ADMIN PRICES → SENT → CUSTOMER ACCEPTS → ACCEPTED → ADMIN CONVERTS → CONVERTED
                     ↓                       ↓
                  (Can Delete)          (Can Reject → REJECTED → Can Delete)
```

### Key Features

- ✅ Customer quotation creation
- ✅ Admin pricing and discount management
- ✅ Customer accept/reject workflow
- ✅ Order conversion
- ✅ Delete DRAFT and REJECTED quotations
- ✅ Full audit trail

### Requirements

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+
- npm 9+

### Database Setup

```sql
CREATE DATABASE quotation_db;
```

Update credentials in `Backend/quotation-service/src/main/resources/application.properties`

## Other Services

This repository contains multiple microservices:
- Quotation Service (Port 8080)
- Order Management Service (Port 8082)
- Product Catalog Service (Port 8081)
- Inventory Service
- Logistics Service
- Payment Service
- Production Service
- Supplier Material Management Service

Each service can be started independently using `mvn spring-boot:run` in its directory.

## License

Proprietary - All rights reserved
