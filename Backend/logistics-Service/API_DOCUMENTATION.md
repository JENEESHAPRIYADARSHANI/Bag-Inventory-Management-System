# Logistics Service - Delivery Tracking API Documentation

Base URL: `http://localhost:8080/api/tracking`

## Delivery Status Values

- `ORDER_CONFIRMED` - Order confirmed and tracking created
- `PROCESSING` - Order is being processed
- `PACKED` - Order has been packed
- `SHIPPED` - Order has been shipped
- `OUT_FOR_DELIVERY` - Order is out for delivery
- `DELIVERED` - Order has been delivered
- `FAILED` - Delivery failed
- `CANCELLED` - Delivery cancelled

---

## 1️⃣ ADMIN ENDPOINTS - Delivery Tracking Management

### Create Tracking (Auto after Order Confirmation)

**POST** `/api/tracking/create`

Request Body:

```json
{
  "orderId": "ORD-12345",
  "customerName": "John Doe",
  "deliveryAddress": "123 Main St, City, State 12345",
  "recipientPhone": "+1234567890",
  "carrierName": "FedEx",
  "estimatedDeliveryDate": "2026-02-25T10:00:00",
  "remarks": "Handle with care"
}
```

Response: DeliveryTracking object with auto-generated trackingId

### View All Trackings (List View)

**GET** `/api/tracking`

Response: Array of DeliveryTracking objects

### View Tracking Details

**GET** `/api/tracking/{trackingId}`

**GET** `/api/tracking/order/{orderId}`

Response: DeliveryTracking object with all details

### Update Delivery Status

**PUT** `/api/tracking/{trackingId}/status`

Request Body:

```json
{
  "status": "SHIPPED",
  "message": "Package has been shipped from warehouse",
  "location": "Distribution Center, City",
  "updatedBy": "admin@example.com",
  "remarks": "On schedule"
}
```

Response: Updated DeliveryTracking object

### Update Tracking Details

**PUT** `/api/tracking/{trackingId}`

Request Body:

```json
{
  "carrierName": "UPS",
  "estimatedDeliveryDate": "2026-02-26T14:00:00",
  "deliveryAddress": "456 New Address",
  "recipientPhone": "+9876543210",
  "remarks": "Updated delivery instructions"
}
```

### Add Tracking Notes

**PUT** `/api/tracking/{trackingId}/notes?notes=Customer requested morning delivery`

### Cancel Delivery

**PUT** `/api/tracking/{trackingId}/cancel?reason=Customer cancelled order&cancelledBy=admin@example.com`

### Delete Tracking

**DELETE** `/api/tracking/{trackingId}`

---

## 2️⃣ HISTORY & TIMELINE ENDPOINTS

### View Complete Delivery Status History

**GET** `/api/tracking/{trackingId}/history`

Response: Array of TrackingHistory objects (chronological order)

### View Detailed History with Customer Info

**GET** `/api/tracking/{trackingId}/history/details`

Response: Array of TrackingHistoryResponse objects

### Filter Deliveries by Status

**GET** `/api/tracking/history/status/{status}`

Example: `/api/tracking/history/status/DELIVERED`

### Filter Deliveries by Date Range

**GET** `/api/tracking/history/date-range?startDate=2026-02-01T00:00:00&endDate=2026-02-28T23:59:59`

### Filter by Status AND Date Range

**GET** `/api/tracking/history/filter?status=DELIVERED&startDate=2026-02-01T00:00:00&endDate=2026-02-28T23:59:59`

---

## 3️⃣ SEARCH & FILTER ENDPOINTS

### Search by Order ID or Customer Name

**GET** `/api/tracking/search?query=John`

Searches in: Order ID, Customer Name, Tracking ID

### Filter by Status

**GET** `/api/tracking/filter/status/{status}`

Example: `/api/tracking/filter/status/OUT_FOR_DELIVERY`

### Filter by Date Range

**GET** `/api/tracking/filter/date-range?startDate=2026-02-01T00:00:00&endDate=2026-02-28T23:59:59`

### Filter by Status AND Date Range

**GET** `/api/tracking/filter?status=SHIPPED&startDate=2026-02-01T00:00:00&endDate=2026-02-28T23:59:59`

---

## 4️⃣ CUSTOMER READ-ONLY ENDPOINTS

### View My Orders Tracking List

**GET** `/api/tracking/customer/{customerName}`

Response: Array of TrackingResponse objects (simplified view)

### View Delivery Status for Specific Order

**GET** `/api/tracking/customer/order/{orderId}`

Response: TrackingResponse object

### View Full Status Timeline

**GET** `/api/tracking/customer/timeline/{trackingId}`

Response: Array of TrackingHistory objects (messages displayed sequentially)

---

## Data Models

### DeliveryTracking

```json
{
  "id": 1,
  "trackingId": "TRK-ABC12345",
  "orderId": "ORD-12345",
  "carrierName": "FedEx",
  "currentStatus": "SHIPPED",
  "currentLocation": "Distribution Center",
  "estimatedDeliveryDate": "2026-02-25T10:00:00",
  "actualDeliveryDate": null,
  "recipientName": "John Doe",
  "recipientPhone": "+1234567890",
  "deliveryAddress": "123 Main St, City, State 12345",
  "remarks": "Handle with care",
  "createdAt": "2026-02-21T10:00:00",
  "updatedAt": "2026-02-21T15:30:00"
}
```

### TrackingHistory

```json
{
  "id": 1,
  "status": "SHIPPED",
  "location": "Distribution Center, City",
  "message": "Package has been shipped from warehouse",
  "updatedBy": "admin@example.com",
  "remarks": "On schedule",
  "updatedAt": "2026-02-21T15:30:00"
}
```

### TrackingResponse (Customer View)

```json
{
  "trackingId": "TRK-ABC12345",
  "orderId": "ORD-12345",
  "customerName": "John Doe",
  "deliveryAddress": "123 Main St, City, State 12345",
  "currentStatus": "SHIPPED",
  "estimatedDeliveryDate": "2026-02-25T10:00:00",
  "actualDeliveryDate": null,
  "lastUpdated": "2026-02-21T15:30:00",
  "remarks": "Handle with care",
  "carrierName": "FedEx"
}
```

---

## Frontend Integration Guide

### Admin Screen - Delivery Tracking Management

- Use `POST /api/tracking/create` after order confirmation
- Use `GET /api/tracking` for list view
- Use `GET /api/tracking/{trackingId}` for details
- Use `PUT /api/tracking/{trackingId}/status` with dropdown selection
- Use `PUT /api/tracking/{trackingId}/notes` for adding notes
- Use `PUT /api/tracking/{trackingId}/cancel` for cancellation

### Admin Screen - History & Timeline

- Use `GET /api/tracking/{trackingId}/history/details` for complete timeline
- Use `GET /api/tracking/search?query=` for search functionality
- Use `GET /api/tracking/filter?status=&startDate=&endDate=` for filtering

### Customer Screen - Read-Only Tracking

- Use `GET /api/tracking/customer/{customerName}` for order list
- Use `GET /api/tracking/customer/order/{orderId}` for specific order
- Use `GET /api/tracking/customer/timeline/{trackingId}` for status timeline
- Display messages sequentially with date & time from timeline

---

## Error Responses

### 404 Not Found

```json
{
  "timestamp": "2026-02-21T15:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Tracking not found: TRK-INVALID"
}
```

### 500 Internal Server Error

```json
{
  "timestamp": "2026-02-21T15:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```
