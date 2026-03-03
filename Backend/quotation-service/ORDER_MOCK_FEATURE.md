# Mock Order Service Feature

## ✅ What Was Added

The Quotation Service now includes a **built-in mock Order Service**! You no longer need a separate Order Service to test the complete workflow.

### New Features

1. **Local Order Storage** - Orders are saved in the same database as quotations
2. **Order API Endpoints** - Full REST API for retrieving orders
3. **Complete Order Details** - Shows all items, prices, discounts, and totals
4. **Customer Order Tracking** - Customers can view their orders by Customer ID

---

## 🎯 How It Works

### When You Convert a Quotation to Order:

1. **Order is saved locally** in the Quotation Service database
2. **All quotation details are copied** to the order (items, prices, discounts)
3. **Order gets a unique ID** and status "CONFIRMED"
4. **Quotation status changes** to "CONVERTED"
5. **Optional**: Also tries to send to external Order Service (if available)

### Order Data Includes:

- Order ID
- Quotation Reference ID
- Customer ID
- Total Amount
- All Order Items:
  - Product ID
  - Quantity
  - Unit Price
  - Discount
  - Subtotal
- Order Status (CONFIRMED)
- Created Date/Time

---

## 📋 New API Endpoints

### Get Orders by Customer ID
```http
GET /api/orders?customerId=CUST-123
```

**Response:**
```json
[
  {
    "id": 1,
    "quotationId": 5,
    "customerId": "CUST-123",
    "totalAmount": 2599.98,
    "status": "CONFIRMED",
    "createdAt": "2026-02-28T23:00:00",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "unitPrice": 1299.99,
        "discount": 0.00
      }
    ]
  }
]
```

### Get All Orders (Admin)
```http
GET /api/orders/all
```

### Get Order by ID
```http
GET /api/orders/{id}
```

---

## 🖥️ Orders Page

### Access
Open: `http://localhost:8080/orders.html`

### Features

1. **Email Search**
   - Enter your email address (e.g., john@example.com)
   - Click "View Orders"

2. **Order Display**
   - Order number
   - Company name and contact person
   - Quotation reference
   - Order status (CONFIRMED)
   - Order date and time
   - Total amount
   - **Complete item breakdown:**
     - Product ID
     - Quantity
     - Unit Price
     - Discount
     - Subtotal per item

3. **Beautiful UI**
   - Clean, modern design
   - Easy to read
   - Mobile responsive
   - Detailed item table

---

## 🧪 Testing the Feature

### Step 1: Create and Convert a Quotation

1. **Create quotation:**
   ```bash
   curl -X POST http://localhost:8080/api/quotations \
     -H "Content-Type: application/json" \
     -d '{
       "customerId": "CUST-123",
       "companyName": "Test Company",
       "contactPerson": "John Doe",
       "email": "john@test.com",
       "phone": "555-1234",
       "items": [
         {"productId": 1, "quantity": 2},
         {"productId": 2, "quantity": 1}
       ]
     }'
   ```

2. **Send quotation** (via admin dashboard or API)
3. **Accept quotation** (via admin dashboard or API)
4. **Convert to order:**
   ```bash
   curl -X POST http://localhost:8080/api/quotations/1/convert
   ```

### Step 2: View Orders

**Option A: Via UI**
1. Open: http://localhost:8080/orders.html
2. Enter Customer ID: `CUST-123`
3. Click "View Orders"
4. See complete order details with all items!

**Option B: Via API**
```bash
curl http://localhost:8080/api/orders?customerId=CUST-123
```

---

## 📊 Database Tables

### New Tables Created

**orders table:**
- id (Primary Key)
- quotation_id
- customer_id
- total_amount
- status
- created_at

**order_items table:**
- id (Primary Key)
- order_id (Foreign Key)
- product_id
- quantity
- unit_price
- discount

---

## 🔄 Complete Workflow

```
1. Customer creates quotation
   ↓
2. Admin edits prices/discounts
   ↓
3. Admin sends quotation (DRAFT → SENT)
   ↓
4. Customer accepts (SENT → ACCEPTED)
   ↓
5. Admin converts to order (ACCEPTED → CONVERTED)
   ↓
6. Order saved locally with all details
   ↓
7. Customer views order on orders page
   ✅ Complete order details displayed!
```

---

## 🎨 What You'll See on Orders Page

```
┌─────────────────────────────────────────────────────────┐
│ Order #1                                    $2,599.98   │
│ Quotation Reference: QT-5                               │
│ Status: CONFIRMED                                       │
│ Placed: 2/28/2026, 11:00:00 PM                        │
│                                                         │
│ Order Items:                                            │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Product ID │ Qty │ Unit Price │ Discount │ Subtotal ││
│ ├────────────┼─────┼────────────┼──────────┼──────────┤│
│ │ Product 1  │  2  │  $1,299.99 │   $0.00  │$2,599.98││
│ │ Product 2  │  1  │    $399.99 │  $50.00  │  $349.99││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Benefits

### No External Dependencies
✅ Works completely standalone  
✅ No need to run separate Order Service  
✅ Perfect for development and testing  
✅ All data in one database  

### Complete Order Details
✅ Shows exact approved quotation details  
✅ All items with prices and discounts  
✅ Subtotals calculated correctly  
✅ Total amount matches quotation  

### Easy to Use
✅ Simple Customer ID search  
✅ Beautiful, clean interface  
✅ Mobile responsive  
✅ Real-time data  

### Still Compatible with External Order Service
✅ Tries to send to external service if available  
✅ Fails gracefully if not available  
✅ Local order always saved  

---

## 🔧 Configuration

No configuration needed! The mock Order Service is built-in and works automatically.

### Optional: External Order Service

If you want to also send orders to an external Order Service:

1. Make sure external service is running
2. Configure URL in `application.properties`:
   ```properties
   order.service.url=http://your-order-service:port/api/orders
   ```
3. Orders will be saved locally AND sent externally

---

## 📝 Code Changes

### New Files Created:
1. `src/main/java/com/example/quotation_service/model/Order.java`
2. `src/main/java/com/example/quotation_service/model/OrderItem.java`
3. `src/main/java/com/example/quotation_service/repository/OrderRepository.java`
4. `src/main/java/com/example/quotation_service/controller/OrderController.java`

### Modified Files:
1. `src/main/java/com/example/quotation_service/service/QuotationService.java`
   - Updated `convertToOrder()` method to save orders locally
2. `src/main/resources/static/orders.html`
   - Updated to fetch from local API
   - Enhanced UI to show complete order details

---

## 🚀 Quick Start

1. **Start the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Create a quotation** (via UI or API)

3. **Convert it to an order** (via admin dashboard)

4. **View the order:**
   - Go to: http://localhost:8080/orders.html
   - Enter the Customer ID
   - See complete order details!

---

## 🎯 Example Scenario

### Scenario: Tech Company Orders Laptops

1. **Customer (CUST-001) requests quotation:**
   - 2x Laptop - Dell XPS 15
   - 3x Monitor - LG 27 inch 4K

2. **Admin reviews and adjusts:**
   - Laptop price: $1,250 (discounted from $1,299.99)
   - Laptop discount: $50 per unit
   - Monitor price: $380 (discounted from $399.99)
   - Monitor discount: $20 per unit

3. **Admin sends quotation** → Customer accepts

4. **Admin converts to order**

5. **Customer views order on orders page:**
   ```
   Order #1                                    $3,540.00
   Quotation Reference: QT-1
   Status: CONFIRMED
   
   Order Items:
   Product 1 (Laptop)    Qty: 2    $1,250.00    -$50.00    $2,400.00
   Product 2 (Monitor)   Qty: 3    $380.00      -$20.00    $1,140.00
   
   Total: $3,540.00
   ```

---

## 📚 Related Documentation

- [README.md](README.md) - Complete feature documentation
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing instructions
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [MICROSERVICES_INTEGRATION.md](MICROSERVICES_INTEGRATION.md) - Integration details

---

## ✅ Summary

The Quotation Service now includes a complete mock Order Service that:
- Saves orders locally
- Provides full REST API
- Shows complete order details on orders page
- Works standalone without external dependencies
- Displays exact approved quotation details with all items

**No more "Error converting to order"! Everything works seamlessly!** 🎉
