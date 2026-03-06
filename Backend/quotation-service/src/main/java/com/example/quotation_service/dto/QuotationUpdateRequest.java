package com.example.quotation_service.dto;

import java.math.BigDecimal;
import java.util.List;

public class QuotationUpdateRequest {

    private List<ItemUpdate> items;

    public static class ItemUpdate {
        private Long itemId;
        private BigDecimal unitPrice;
        private BigDecimal discount; // Percentage (0-100)

        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }

        public BigDecimal getDiscount() {
            return discount;
        }

        public void setDiscount(BigDecimal discount) {
            this.discount = discount;
        }
    }

    // Getters and Setters
    public List<ItemUpdate> getItems() {
        return items;
    }

    public void setItems(List<ItemUpdate> items) {
        this.items = items;
    }
}
