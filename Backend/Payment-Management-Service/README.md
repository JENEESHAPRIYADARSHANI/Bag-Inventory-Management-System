# Payment Management Service

A comprehensive Spring Boot microservice for managing payments and saved payment methods with user and admin operations.

## Features

### Payment Management (Existing)
- Record payments with multiple payment methods (Card, Cash, Online Transfer)
- Track payment status (Completed, Pending, Failed)
- Payment history with filtering and search
- Payment verification system
- Revenue and payment statistics

### Saved Payment Methods (Existing)
- Save customer payment card details (last 4 digits only)
- Manage saved payment methods
- Enable/disable payment methods
- CRUD operations for payment methods

### Card Management (Your Part - To Be Implemented)
You need to create a new card management module with the following features:

**User Features:**
- Add new payment cards with full details
- View all their cards
- Update card details (name, expiry date)
- Delete their cards
- Set default card
- Card number masking for security

**Admin Features:**
- View all payment cards in system
- Update any card
- Delete any card
- Enable/disable cards
- Toggle card status

## Technology Stack
- Java 17
- Spring Boot 3.2.6
- Spring Data JPA
- MySQL Database
- Lombok
- Maven

## Database Setup

### Option 1: Automatic Setup (Windows)
```bash
cd database
setup_mysql.bat
```

### Option 2: Manual Setup
```bash
mysql -u root -p < database/create_database.sql
```

The database includes three tables:
1. `payments` - Main payment transactions
2. `saved_payment_methods` - Saved card details (last 4 digits)
3. `payment_cards` - Full card management (your part)

## Configuration

Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/payment_management_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Running the Application

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run
```

The service will start on `http://localhost:8085`

## Existing API Endpoints

### Payment Endpoints (`/api/payments`)

#### Create Payment
```http
POST /api/payments
Content-Type: application/json

{
  "orderId": "ORD-001",
  "customerName": "John Doe",
  "amount": 150.00,
  "method": "CARD",
  "status": "COMPLETED",
  "paymentDate": "2024-01-15",
  "txnRef": "TXN-12345"
}
```

#### List Payments
```http
GET /api/payments?search=John&status=COMPLETED&page=0&size=10
```

#### Get Payment
```http
GET /api/payments/{paymentId}
```

#### Update Payment
```http
PUT /api/payments/{paymentId}
```

#### Update Status
```http
PATCH /api/payments/{paymentId}/status?status=COMPLETED
```

#### Verify Payment
```http
POST /api/payments/{paymentId}/verify
```

#### Delete Payment
```http
DELETE /api/payments/{paymentId}
```

#### Get Summary
```http
GET /api/payments/summary?fromDate=2024-01-01&toDate=2024-12-31
```

### Saved Payment Method Endpoints (`/api/payment-methods`)

#### Add Method
```http
POST /api/payment-methods
Content-Type: application/json

{
  "customerName": "John Doe",
  "type": "Card",
  "cardHolderName": "John Doe",
  "last4": "0366",
  "expiryMonth": 12,
  "expiryYear": 2026,
  "brand": "Visa",
  "status": "ACTIVE"
}
```

#### List Methods
```http
GET /api/payment-methods
```

#### Update Method
```http
PUT /api/payment-methods/{id}
```

#### Set Status
```http
PATCH /api/payment-methods/{id}/status?status=DISABLED
```

#### Delete Method
```http
DELETE /api/payment-methods/{id}
```

## Your Task: Card Management Implementation

You need to create the following components in the `com.starbag.Payment_Management_Service` package:

### 1. Entity (`entity/PaymentCard.java`)
```java
@Entity
@Table(name = "payment_cards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaymentCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String cardHolderName;
    private String cardNumber; // Store encrypted or full number
    private String expiryDate; // MM/YYYY format
    private String cvv;
    private String cardType; // Visa, Mastercard, etc.
    private Boolean isDefault;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 2. Repository (`repo/PaymentCardRepository.java`)
```java
public interface PaymentCardRepository extends JpaRepository<PaymentCard, Long> {
    List<PaymentCard> findByUserId(Long userId);
    Optional<PaymentCard> findByCardNumber(String cardNumber);
    boolean existsByCardNumber(String cardNumber);
}
```

### 3. DTOs (`dto/`)
- `CardRequest.java` - For adding cards
- `CardUpdateRequest.java` - For updating cards
- `CardResponse.java` - For returning card data (with masked number)
- `AdminCardUpdateRequest.java` - For admin updates

### 4. Service (`service/PaymentCardService.java`)
Implement business logic for:
- Adding cards
- Updating cards
- Deleting cards
- Setting default card
- Admin operations

### 5. Controllers (`controller/`)
- `UserCardController.java` - User endpoints (`/api/user/cards`)
- `AdminCardController.java` - Admin endpoints (`/api/admin/cards`)

### Required Endpoints

**User Endpoints:**
- `POST /api/user/cards` - Add card
- `GET /api/user/cards/user/{userId}` - Get user's cards
- `GET /api/user/cards/{cardId}/user/{userId}` - Get specific card
- `PUT /api/user/cards/{cardId}/user/{userId}` - Update card
- `DELETE /api/user/cards/{cardId}/user/{userId}` - Delete card
- `PUT /api/user/cards/{cardId}/user/{userId}/set-default` - Set default

**Admin Endpoints:**
- `GET /api/admin/cards` - Get all cards
- `PUT /api/admin/cards/{cardId}` - Update any card
- `DELETE /api/admin/cards/{cardId}` - Delete any card
- `PUT /api/admin/cards/{cardId}/toggle-status` - Toggle active status

### Security Considerations

1. **Card Number Masking**: Always return masked card numbers in responses (e.g., "**** **** **** 1234")
2. **CVV Security**: Never return CVV in API responses
3. **User Authorization**: Verify user owns the card before operations
4. **Input Validation**: Validate card number format, expiry date, CVV
5. **Duplicate Prevention**: Check for duplicate card numbers

### Testing

Sample test data is provided in `database/create_database.sql`. You can test with:
- User ID: 1 (has 2 cards)
- User ID: 2 (has 1 card)

## Project Structure
```
src/main/java/com/starbag/Payment_Management_Service/
├── config/              # Configuration classes
├── controller/          # REST controllers
│   ├── PaymentController.java
│   ├── SavedMethodController.java
│   ├── UserCardController.java (TO CREATE)
│   └── AdminCardController.java (TO CREATE)
├── dto/                 # Data transfer objects
├── entity/              # JPA entities
│   ├── Payment.java
│   ├── SavedPaymentMethod.java
│   └── PaymentCard.java (TO CREATE)
├── exception/           # Custom exceptions
├── repo/                # JPA repositories
│   ├── PaymentRepository.java
│   ├── SavedMethodRepository.java
│   └── PaymentCardRepository.java (TO CREATE)
└── service/             # Business logic
    ├── PaymentService.java
    ├── SavedMethodService.java
    └── PaymentCardService.java (TO CREATE)
```

## Error Handling

The service provides detailed error responses:
- 400 Bad Request - Validation errors
- 403 Forbidden - Unauthorized access
- 404 Not Found - Resource not found
- 409 Conflict - Duplicate resource
- 500 Internal Server Error - Server errors

## Development Tips

1. Follow the existing code structure and patterns
2. Use Lombok annotations (@Getter, @Setter, @Builder, etc.)
3. Add proper validation annotations (@NotNull, @NotBlank, @Pattern)
4. Implement proper exception handling
5. Test all CRUD operations thoroughly
6. Ensure card numbers are properly masked in responses
7. Add indexes to database columns for better performance

## Next Steps

1. Create the entity, repository, DTOs, service, and controllers as outlined above
2. Test the endpoints using Postman or cURL
3. Integrate with your frontend application
4. Add additional security measures as needed
5. Consider adding encryption for sensitive card data

Good luck with your university project!
