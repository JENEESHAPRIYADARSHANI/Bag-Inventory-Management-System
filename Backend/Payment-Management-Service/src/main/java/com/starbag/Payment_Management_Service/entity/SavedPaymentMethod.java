package com.starbags.payment.entity;

import com.starbags.payment.entity.enums.MethodStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_payment_methods")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SavedPaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // You can replace this with customerId later
    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(nullable = false, length = 30)
    private String type; // "Card"

    @Column(nullable = false, length = 120)
    private String cardHolderName;

    // Security: store only last 4 digits
    @Column(nullable = false, length = 4)
    private String last4;

    @Column(nullable = false)
    private int expiryMonth;

    @Column(nullable = false)
    private int expiryYear;

    @Column(length = 40)
    private String brand;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MethodStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status == null) status = MethodStatus.ACTIVE;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
