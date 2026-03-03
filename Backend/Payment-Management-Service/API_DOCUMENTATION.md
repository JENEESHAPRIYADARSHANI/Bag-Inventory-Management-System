# Payment Management Service - API Documentation

## Base URL
```
http://localhost:8085/api
```

## User API Endpoints

### 1. Add New Card
Create a new payment card for a user.

**Endpoint:** `POST /user/cards`

**Request Body:**
```json
{
  "userId": 1,
  "cardHolderName": "John Doe",
  "cardNumber": "4532015112830366",
  "expiryDate": "12/2026",
  "cvv": "123",
  "cardType": "Visa",
  "isDefault": true
}
```

**Validation Rules:**
- `userId`: Required, not null
- `cardHolderName`: Required, 3-100 characters
- `cardNumber`: Required, 13-19 digits
- `expiryDate`: Required, MM/YYYY format
- `cvv`: Required, 3-4 digits
- `cardType`: Required
- `isDefault`: Optional, defaults to false

**Response:** `201 Created`
```json
{
  "id": 1,
  "userId": 1,
  "cardHolderName": "John Doe",
  "maskedCardNumber": "**** **** **** 0366",
  "expiryDate": "12/2026",
  "cardType": "Visa",
  "isDefault": true,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

---

### 2. Get User Cards
Retrieve all cards for a specific user.

**Endpoint:** `GET /user/cards/user/{userId}`

**Path Parameters:**
- `userId`: User ID (Long)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 1,
    "cardHolderName": "John Doe",
    "maskedCardNumber": "**** **** **** 0366",
    "expiryDate": "12/2026",
    "cardType": "Visa",
    "isDefault": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

---

### 3. Get Card by ID
Retrieve a specific card by ID for a user.

**Endpoint:** `GET /user/cards/{cardId}/user/{userId}`

**Path Parameters:**
- `cardId`: Card ID (Long)
- `userId`: User ID (Long)

**Response:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "cardHolderName": "John Doe",
  "maskedCardNumber": "**** **** **** 0366",
  "expiryDate": "12/2026",
  "cardType": "Visa",
  "isDefault": true,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

---

### 4. Update Card
Update card details (name, expiry date, default status).

**Endpoint:** `PUT /user/cards/{cardId}/user/{userId}`

**Path Parameters:**
- `cardId`: Card ID (Long)
- `userId`: User ID (Long)

**Request Body:**
```json
{
  "cardHolderName": "John Smith",
  "expiryDate": "12/2027",
  "isDefault": true
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "cardHolderName": "John Smith",
  "maskedCardNumber": "**** **** **** 0366",
  "expiryDate": "12/2027",
  "cardType": "Visa",
  "isDefault": true,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T11:45:00"
}
```

---

### 5. Delete Card
Delete a card for a user.

**Endpoint:** `DELETE /user/cards/{cardId}/user/{userId}`

**Path Parameters:**
- `cardId`: Card ID (Long)
- `userId`: User ID (Long)

**Response:** `204 No Content`

---

### 6. Set Default Card
Set a card as the default payment method.

**Endpoint:** `PUT /user/cards/{cardId}/user/{userId}/set-default`

**Path Parameters:**
- `cardId`: Card ID (Long)
- `userId`: User ID (Long)

**Response:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "cardHolderName": "John Doe",
  "maskedCardNumber": "**** **** **** 0366",
  "expiryDate": "12/2026",
  "cardType": "Visa",
  "isDefault": true,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T12:00:00"
}
```

---

## Admin API Endpoints

### 1. Get All Cards
Retrieve all payment cards in the system.

**Endpoint:** `GET /admin/cards`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 1,
    "cardHolderName": "John Doe",
    "maskedCardNumber": "**** **** **** 0366",
    "expiryDate": "12/2026",
    "cardType": "Visa",
    "isDefault": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

---

### 2. Update Card (Admin)
Admin can update any card's details including active status.

**Endpoint:** `PUT /admin/cards/{cardId}`

**Path Parameters:**
- `cardId`: Card ID (Long)

**Request Body:**
```json
{
  "isActive": false,
  "cardHolderName": "Updated Name",
  "expiryDate": "12/2028"
}
```

**Note:** All fields are optional.

**Response:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "cardHolderName": "Updated Name",
  "maskedCardNumber": "**** **** **** 0366",
  "expiryDate": "12/2028",
  "cardType": "Visa",
  "isDefault": true,
  "isActive": false,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T13:00:00"
}
```

---

### 3. Delete Card (Admin)
Admin can delete any card.

**Endpoint:** `DELETE /admin/cards/{cardId}`

**Path Parameters:**
- `cardId`: Card ID (Long)

**Response:** `204 No Content`

---

### 4. Toggle Card Status
Toggle the active status of a card (active ↔ inactive).

**Endpoint:** `PUT /admin/cards/{cardId}/toggle-status`

**Path Parameters:**
- `cardId`: Card ID (Long)

**Response:** `200 OK`
```json
{
  "id": 1,
  "userId": 1,
  "cardHolderName": "John Doe",
  "maskedCardNumber": "**** **** **** 0366",
  "expiryDate": "12/2026",
  "cardType": "Visa",
  "isDefault": true,
  "isActive": false,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T13:30:00"
}
```

---

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "cardNumber": "Card number must be 13-19 digits",
  "expiryDate": "Expiry date must be in MM/YYYY format"
}
```

### 403 Forbidden - Unauthorized Access
```json
{
  "status": 403,
  "message": "Unauthorized access to this card",
  "timestamp": "2024-01-15T10:30:00"
}
```

### 404 Not Found - Card Not Found
```json
{
  "status": 404,
  "message": "Card not found",
  "timestamp": "2024-01-15T10:30:00"
}
```

### 409 Conflict - Duplicate Card
```json
{
  "status": 409,
  "message": "Card number already exists",
  "timestamp": "2024-01-15T10:30:00"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An unexpected error occurred: ...",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## Testing with cURL

### Add a Card
```bash
curl -X POST http://localhost:8085/api/user/cards \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "cardHolderName": "John Doe",
    "cardNumber": "4532015112830366",
    "expiryDate": "12/2026",
    "cvv": "123",
    "cardType": "Visa",
    "isDefault": true
  }'
```

### Get User Cards
```bash
curl -X GET http://localhost:8085/api/user/cards/user/1
```

### Update Card
```bash
curl -X PUT http://localhost:8085/api/user/cards/1/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "cardHolderName": "John Smith",
    "expiryDate": "12/2027"
  }'
```

### Delete Card
```bash
curl -X DELETE http://localhost:8085/api/user/cards/1/user/1
```

### Admin - Get All Cards
```bash
curl -X GET http://localhost:8085/api/admin/cards
```

### Admin - Toggle Card Status
```bash
curl -X PUT http://localhost:8085/api/admin/cards/1/toggle-status
```

---

## Supported Card Types
- Visa
- Mastercard
- American Express
- Discover
- Diners Club
- JCB
- UnionPay

## Security Notes
1. Card numbers are masked in all responses (only last 4 digits shown)
2. CVV is never returned in responses
3. User authorization is enforced for all user operations
4. Duplicate card numbers are prevented
5. All inputs are validated
