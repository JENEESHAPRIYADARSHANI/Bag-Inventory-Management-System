package com.example.quotation_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class QuotationUpdateRequest {
    private List<ItemUpdate> items;

    @Data
    public static class ItemUpdate {
        private Long itemId; // The ID of the QuotationItem
        private BigDecimal unitPrice;
        private BigDecimal discount; // Expected as percentage or flat? Assume flat amount or percentage. We'll use
                                     // percentage for now: (Unit Price * Quantity) * (1 - discount/100) or simply
                                     // standard amount discount. Let's stick with percentage based on previous
                                     // implementation.
    }
}
