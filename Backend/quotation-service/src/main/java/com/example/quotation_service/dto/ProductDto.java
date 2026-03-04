package com.example.quotation_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private BigDecimal price; // Assuming product service returns 'price' or 'unitPrice' based on user
                              // requirements ("id, name, price")
}
