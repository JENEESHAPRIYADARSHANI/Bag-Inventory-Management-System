package com.starbag.product_catalog_service.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String color;

    // We store the file names or URLs as strings in the database
    private String frontView;
    private String backView;
    private String insideView;
}