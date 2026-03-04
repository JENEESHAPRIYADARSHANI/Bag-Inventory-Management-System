package com.example.quotation_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequestDto {
    private Long quotationId;
    private String customerId;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;

    @Data
    public static class OrderItemDto {
        private Long productId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discount;
    }
}
