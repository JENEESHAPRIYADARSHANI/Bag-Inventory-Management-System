# Card Management Implementation Guide

This guide will help you implement the card management feature for your university project.

## Quick Start

The existing payment service already has:
✅ Payment transaction management
✅ Saved payment methods (last 4 digits only)
✅ Database setup with `payment_cards` table
✅ All necessary dependencies

## What You Need to Create

### Step 1: Create Entity

Create `src/main/java/com/starbag/Payment_Management_Service/entity/PaymentCard.java`:

```java
package com.starbag.Payment_Management_Service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_cards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String cardHolderName;

    @Column(nullable = false, unique = true, length = 19)
    private String cardNumber;

    @Column(nullable = false, length = 7)
    private String expiryDate; // MM/YYYY

    @Column(nullable = false, length = 4)
    private String cvv;

    @Column(nullable = false, length = 50)
    private String cardType;

    @Column(nullable = false)
    private Boolean isDefault = false;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Step 2: Create Repository

Create `src/main/java/com/starbag/Payment_Management_Service/repo/PaymentCardRepository.java`:

```java
package com.starbag.Payment_Management_Service.repo;

import com.starbag.Payment_Management_Service.entity.PaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentCardRepository extends JpaRepository<PaymentCard, Long> {
    List<PaymentCard> findByUserId(Long userId);
    List<PaymentCard> findByUserIdAndIsActive(Long userId, Boolean isActive);
    Optional<PaymentCard> findByCardNumber(String cardNumber);
    Optional<PaymentCard> findByUserIdAndIsDefault(Long userId, Boolean isDefault);
    boolean existsByCardNumber(String cardNumber);
}
```

### Step 3: Create DTOs

Create `src/main/java/com/starbag/Payment_Management_Service/dto/CardRequest.java`:

```java
package com.starbag.Payment_Management_Service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CardRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Card holder name is required")
    @Size(min = 3, max = 100)
    private String cardHolderName;

    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "^[0-9]{13,19}$", message = "Card number must be 13-19 digits")
    private String cardNumber;

    @NotBlank(message = "Expiry date is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{4}$", message = "Expiry date must be in MM/YYYY format")
    private String expiryDate;

    @NotBlank(message = "CVV is required")
    @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV must be 3 or 4 digits")
    private String cvv;

    @NotBlank(message = "Card type is required")
    private String cardType;

    private Boolean isDefault = false;
}
```

Create `src/main/java/com/starbag/Payment_Management_Service/dto/CardResponse.java`:

```java
package com.starbag.Payment_Management_Service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CardResponse {
    private Long id;
    private Long userId;
    private String cardHolderName;
    private String maskedCardNumber; // **** **** **** 1234
    private String expiryDate;
    private String cardType;
    private Boolean isDefault;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

Create `src/main/java/com/starbag/Payment_Management_Service/dto/CardUpdateRequest.java`:

```java
package com.starbag.Payment_Management_Service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CardUpdateRequest {

    @Size(min = 3, max = 100)
    private String cardHolderName;

    @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{4}$")
    private String expiryDate;

    private Boolean isDefault;
}
```

Create `src/main/java/com/starbag/Payment_Management_Service/dto/AdminCardUpdateRequest.java`:

```java
package com.starbag.Payment_Management_Service.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AdminCardUpdateRequest {
    private Boolean isActive;
    private String cardHolderName;
    private String expiryDate;
}
```

### Step 4: Create Custom Exceptions

Create `src/main/java/com/starbag/Payment_Management_Service/exception/CardNotFoundException.java`:

```java
package com.starbag.Payment_Management_Service.exception;

public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException(String message) {
        super(message);
    }
}
```

Create `src/main/java/com/starbag/Payment_Management_Service/exception/DuplicateCardException.java`:

```java
package com.starbag.Payment_Management_Service.exception;

public class DuplicateCardException extends RuntimeException {
    public DuplicateCardException(String message) {
        super(message);
    }
}
```

Create `src/main/java/com/starbag/Payment_Management_Service/exception/UnauthorizedAccessException.java`:

```java
package com.starbag.Payment_Management_Service.exception;

public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}
```

### Step 5: Update Global Exception Handler

Add these methods to `src/main/java/com/starbag/Payment_Management_Service/exception/GlobalExceptionHandler.java`:

```java
@ExceptionHandler(CardNotFoundException.class)
public ResponseEntity<?> handleCardNotFound(CardNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
            "message", ex.getMessage()
    ));
}

@ExceptionHandler(DuplicateCardException.class)
public ResponseEntity<?> handleDuplicateCard(DuplicateCardException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
            "message", ex.getMessage()
    ));
}

@ExceptionHandler(UnauthorizedAccessException.class)
public ResponseEntity<?> handleUnauthorizedAccess(UnauthorizedAccessException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
            "message", ex.getMessage()
    ));
}
```

### Step 6: Create Service

Create `src/main/java/com/starbag/Payment_Management_Service/service/PaymentCardService.java`:

```java
package com.starbag.Payment_Management_Service.service;

import com.starbag.Payment_Management_Service.dto.*;
import com.starbag.Payment_Management_Service.entity.PaymentCard;
import com.starbag.Payment_Management_Service.exception.*;
import com.starbag.Payment_Management_Service.repo.PaymentCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentCardService {

    private final PaymentCardRepository cardRepository;

    @Transactional
    public CardResponse addCard(CardRequest request) {
        if (cardRepository.existsByCardNumber(request.getCardNumber())) {
            throw new DuplicateCardException("Card number already exists");
        }

        if (request.getIsDefault()) {
            resetDefaultCard(request.getUserId());
        }

        PaymentCard card = new PaymentCard();
        card.setUserId(request.getUserId());
        card.setCardHolderName(request.getCardHolderName());
        card.setCardNumber(request.getCardNumber());
        card.setExpiryDate(request.getExpiryDate());
        card.setCvv(request.getCvv());
        card.setCardType(request.getCardType());
        card.setIsDefault(request.getIsDefault());
        card.setIsActive(true);

        PaymentCard savedCard = cardRepository.save(card);
        return mapToResponse(savedCard);
    }

    @Transactional
    public CardResponse updateCard(Long cardId, Long userId, CardUpdateRequest request) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        if (!card.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("Unauthorized access to this card");
        }

        if (request.getCardHolderName() != null) {
            card.setCardHolderName(request.getCardHolderName());
        }
        if (request.getExpiryDate() != null) {
            card.setExpiryDate(request.getExpiryDate());
        }
        if (request.getIsDefault() != null && request.getIsDefault()) {
            resetDefaultCard(userId);
            card.setIsDefault(true);
        }

        PaymentCard updatedCard = cardRepository.save(card);
        return mapToResponse(updatedCard);
    }

    @Transactional
    public void deleteCard(Long cardId, Long userId) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        if (!card.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("Unauthorized access to this card");
        }

        cardRepository.delete(card);
    }

    public List<CardResponse> getUserCards(Long userId) {
        return cardRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CardResponse getCardById(Long cardId, Long userId) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        if (!card.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("Unauthorized access to this card");
        }

        return mapToResponse(card);
    }

    @Transactional
    public CardResponse setDefaultCard(Long cardId, Long userId) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        if (!card.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("Unauthorized access to this card");
        }

        resetDefaultCard(userId);
        card.setIsDefault(true);
        PaymentCard updatedCard = cardRepository.save(card);
        return mapToResponse(updatedCard);
    }

    // Admin operations
    public List<CardResponse> getAllCards() {
        return cardRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CardResponse adminUpdateCard(Long cardId, AdminCardUpdateRequest request) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));

        if (request.getIsActive() != null) {
            card.setIsActive(request.getIsActive());
        }
        if (request.getCardHolderName() != null) {
            card.setCardHolderName(request.getCardHolderName());
        }
        if (request.getExpiryDate() != null) {
            card.setExpiryDate(request.getExpiryDate());
        }

        PaymentCard updatedCard = cardRepository.save(card);
        return mapToResponse(updatedCard);
    }

    @Transactional
    public void adminDeleteCard(Long cardId) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));
        cardRepository.delete(card);
    }

    @Transactional
    public CardResponse toggleCardStatus(Long cardId) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("Card not found"));
        card.setIsActive(!card.getIsActive());
        PaymentCard updatedCard = cardRepository.save(card);
        return mapToResponse(updatedCard);
    }

    private void resetDefaultCard(Long userId) {
        cardRepository.findByUserIdAndIsDefault(userId, true)
                .ifPresent(card -> {
                    card.setIsDefault(false);
                    cardRepository.save(card);
                });
    }

    private CardResponse mapToResponse(PaymentCard card) {
        CardResponse response = new CardResponse();
        response.setId(card.getId());
        response.setUserId(card.getUserId());
        response.setCardHolderName(card.getCardHolderName());
        response.setMaskedCardNumber(maskCardNumber(card.getCardNumber()));
        response.setExpiryDate(card.getExpiryDate());
        response.setCardType(card.getCardType());
        response.setIsDefault(card.getIsDefault());
        response.setIsActive(card.getIsActive());
        response.setCreatedAt(card.getCreatedAt());
        response.setUpdatedAt(card.getUpdatedAt());
        return response;
    }

    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }
}
```

### Step 7: Create Controllers

Create `src/main/java/com/starbag/Payment_Management_Service/controller/UserCardController.java`:

```java
package com.starbag.Payment_Management_Service.controller;

import com.starbag.Payment_Management_Service.dto.*;
import com.starbag.Payment_Management_Service.service.PaymentCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user/cards")
@RequiredArgsConstructor
public class UserCardController {

    private final PaymentCardService cardService;

    @PostMapping
    public ResponseEntity<CardResponse> addCard(@Valid @RequestBody CardRequest request) {
        CardResponse response = cardService.addCard(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardResponse>> getUserCards(@PathVariable Long userId) {
        List<CardResponse> cards = cardService.getUserCards(userId);
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/{cardId}/user/{userId}")
    public ResponseEntity<CardResponse> getCardById(
            @PathVariable Long cardId,
            @PathVariable Long userId) {
        CardResponse card = cardService.getCardById(cardId, userId);
        return ResponseEntity.ok(card);
    }

    @PutMapping("/{cardId}/user/{userId}")
    public ResponseEntity<CardResponse> updateCard(
            @PathVariable Long cardId,
            @PathVariable Long userId,
            @Valid @RequestBody CardUpdateRequest request) {
        CardResponse response = cardService.updateCard(cardId, userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cardId}/user/{userId}")
    public ResponseEntity<Void> deleteCard(
            @PathVariable Long cardId,
            @PathVariable Long userId) {
        cardService.deleteCard(cardId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{cardId}/user/{userId}/set-default")
    public ResponseEntity<CardResponse> setDefaultCard(
            @PathVariable Long cardId,
            @PathVariable Long userId) {
        CardResponse response = cardService.setDefaultCard(cardId, userId);
        return ResponseEntity.ok(response);
    }
}
```

Create `src/main/java/com/starbag/Payment_Management_Service/controller/AdminCardController.java`:

```java
package com.starbag.Payment_Management_Service.controller;

import com.starbag.Payment_Management_Service.dto.*;
import com.starbag.Payment_Management_Service.service.PaymentCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/cards")
@RequiredArgsConstructor
public class AdminCardController {

    private final PaymentCardService cardService;

    @GetMapping
    public ResponseEntity<List<CardResponse>> getAllCards() {
        List<CardResponse> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

    @PutMapping("/{cardId}")
    public ResponseEntity<CardResponse> updateCard(
            @PathVariable Long cardId,
            @RequestBody AdminCardUpdateRequest request) {
        CardResponse response = cardService.adminUpdateCard(cardId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long cardId) {
        cardService.adminDeleteCard(cardId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{cardId}/toggle-status")
    public ResponseEntity<CardResponse> toggleCardStatus(@PathVariable Long cardId) {
        CardResponse response = cardService.toggleCardStatus(cardId);
        return ResponseEntity.ok(response);
    }
}
```

## Testing

1. Run the database setup script
2. Start the application: `mvn spring-boot:run`
3. Test with Postman or cURL

### Example Test Requests

```bash
# Add a card
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

# Get user cards
curl http://localhost:8085/api/user/cards/user/1

# Admin - Get all cards
curl http://localhost:8085/api/admin/cards
```

## Summary

You now have a complete card management system with:
- ✅ Full CRUD operations
- ✅ User and admin endpoints
- ✅ Card number masking
- ✅ Security validations
- ✅ Error handling
- ✅ Database integration

The implementation follows the same patterns as the existing payment service, making it easy to understand and maintain.
