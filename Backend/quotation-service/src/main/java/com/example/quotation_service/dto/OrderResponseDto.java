package com.example.quotation_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for Order response from Order Management Service
 */
@Data
public class OrderResponseDto {
    private Long orderId;
    private Long customerId;
    private String productIds;
    private String quantities;
    private LocalDateTime orderDate;
    private String status;
}
