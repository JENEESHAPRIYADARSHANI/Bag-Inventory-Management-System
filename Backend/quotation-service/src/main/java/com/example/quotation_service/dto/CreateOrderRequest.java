package com.example.quotation_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for creating an order in Order Management Service
 * Maps to the Order entity structure in Order-Management-Service
 */
@Data
public class CreateOrderRequest {
    private Long customerId;
    private String productIds;  // Comma-separated product IDs
    private String quantities;  // Comma-separated quantities
    private LocalDateTime orderDate;
    private String status;      // Order status (e.g., "PENDING", "CONFIRMED")
}
