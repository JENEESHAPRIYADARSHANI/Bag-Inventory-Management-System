package com.starbags.payment.dto;

import com.starbags.payment.entity.enums.PaymentMethod;
import com.starbags.payment.entity.enums.PaymentStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreatePaymentRequest {

    @NotBlank
    private String orderId;

    @NotBlank
    private String customerName;

    @NotNull @DecimalMin("0.01")
    private BigDecimal amount;

    @NotNull
    private PaymentMethod method;

    @NotNull
    private PaymentStatus status;

    @NotNull
    private LocalDate paymentDate;

    private String txnRef;
}
