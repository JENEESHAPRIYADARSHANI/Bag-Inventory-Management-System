package com.starbag.Payment_Management_Service.dto;

import com.starbag.Payment_Management_Service.entity.enums.PaymentMethod;
import com.starbag.Payment_Management_Service.entity.enums.PaymentStatus;
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
