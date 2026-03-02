package com.starbag.product_catalog_service.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id; // e.g., "PRD-001"

    private String name;
    private String category;
    private String price;
    private String material;
    private String dimensions;
    private String capacity;

    // One Product has Many Variants. CascadeType.ALL means if we save/delete a product, it saves/deletes its variants too.
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "product_id")
    private List<ProductVariant> variants;
}