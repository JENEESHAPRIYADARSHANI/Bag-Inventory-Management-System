package com.starbag.inventory.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Inventory {

    @Id
    private Long inventoryId;
    private Long productid;
    private int quantityInStock;
    private int reorderLevel;

    //super constructor
    public Inventory() {
    }

    public Inventory(int reorderLevel, int quantityInStock, Long productid, Long inventoryId) {
        this.reorderLevel = reorderLevel;
        this.quantityInStock = quantityInStock;
        this.productid = productid;
        this.inventoryId = inventoryId;
    }
}
