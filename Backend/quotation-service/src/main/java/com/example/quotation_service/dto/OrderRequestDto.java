package com.example.quotation_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderRequestDto {
    private Long quotationId;
    private String customerId;
    private BigDecimal totalAmount;
    
    // Fields for Order Management Service compatibility
    private String customerName;
    private LocalDateTime deliveryDate;
    private String productIds;
    private String quantities;
}
