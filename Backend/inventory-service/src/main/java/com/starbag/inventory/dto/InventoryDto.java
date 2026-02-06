package com.starbag.inventory.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class InventoryDto {
    private Long productId;
    private String productName;
    private int quantityInStock;
    private int reorderLevel;

}
