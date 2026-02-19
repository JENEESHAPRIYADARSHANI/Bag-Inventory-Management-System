package com.example.quotation_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuotationRequest {
    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
