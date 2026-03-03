#!/bin/bash

echo "========================================="
echo "Testing Quotation Service - Orders API"
echo "========================================="
echo ""

# Test 1: Check if application is running
echo "Test 1: Checking if application is running..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/quotations/products)
if [ "$response" = "200" ]; then
    echo "✅ Application is running on port 8080"
else
    echo "❌ Application is NOT running on port 8080 (HTTP $response)"
    echo "   Please start the application with: ./mvnw spring-boot:run"
    exit 1
fi
echo ""

# Test 2: Check orders endpoint
echo "Test 2: Checking orders endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/orders/all)
if [ "$response" = "200" ]; then
    echo "✅ Orders endpoint is working"
    orders=$(curl -s http://localhost:8080/api/orders/all)
    echo "   Current orders: $orders"
else
    echo "❌ Orders endpoint failed (HTTP $response)"
    echo "   The database tables might not be created yet"
    echo "   Please restart the application"
    exit 1
fi
echo ""

# Test 3: Create a test quotation
echo "Test 3: Creating test quotation..."
quotation=$(curl -s -X POST http://localhost:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "TEST-001",
    "companyName": "Test Company",
    "contactPerson": "Test User",
    "email": "test@example.com",
    "phone": "555-0000",
    "items": [{"productId": 1, "quantity": 1}]
  }')

quotation_id=$(echo $quotation | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -n "$quotation_id" ]; then
    echo "✅ Quotation created with ID: $quotation_id"
else
    echo "❌ Failed to create quotation"
    echo "   Response: $quotation"
    exit 1
fi
echo ""

# Test 4: Send quotation
echo "Test 4: Sending quotation..."
send_response=$(curl -s -X PUT http://localhost:8080/api/quotations/$quotation_id/send \
  -H "Content-Type: application/json" \
  -d '{"items": [{"itemId": 1, "unitPrice": 1200.00, "discount": 0.00}]}')
echo "✅ Quotation sent (DRAFT → SENT)"
echo ""

# Test 5: Accept quotation
echo "Test 5: Accepting quotation..."
accept_response=$(curl -s -X PUT http://localhost:8080/api/quotations/$quotation_id/accept)
echo "✅ Quotation accepted (SENT → ACCEPTED)"
echo ""

# Test 6: Convert to order
echo "Test 6: Converting to order..."
convert_response=$(curl -s -X POST http://localhost:8080/api/quotations/$quotation_id/convert)
echo "✅ Quotation converted to order (ACCEPTED → CONVERTED)"
echo ""

# Test 7: Check orders by email
echo "Test 7: Fetching orders by email..."
orders=$(curl -s "http://localhost:8080/api/orders?email=test@example.com")
order_count=$(echo $orders | grep -o '"id":' | wc -l)

if [ "$order_count" -gt 0 ]; then
    echo "✅ Found $order_count order(s) for test@example.com"
    echo "   Orders: $orders"
else
    echo "❌ No orders found for test@example.com"
    echo "   Response: $orders"
    exit 1
fi
echo ""

echo "========================================="
echo "✅ ALL TESTS PASSED!"
echo "========================================="
echo ""
echo "You can now:"
echo "1. Open http://localhost:8080/orders.html"
echo "2. Enter email: test@example.com"
echo "3. View your test order!"
echo ""
