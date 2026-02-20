package com.starbags.payment.entity;

import com.starbags.payment.entity.enums.PaymentMethod;
import com.starbags.payment.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    @Column(name = "payment_id", length = 50)
    private String paymentId; // e.g. PAY-001

    @Column(nullable = false, length = 50)
    private String orderId; // e.g. ORD-001

    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus status;

    @Column(nullable = false)
    private LocalDate paymentDate;

    @Column(length = 80)
    private String txnRef;

    @Column(nullable = false)
    private boolean verified;

    private LocalDateTime verifiedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
