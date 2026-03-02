package com.starbag.production.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionBatchDto {
    // We only put the fields here that we WANT the frontend to see and send
    private String id;
    private String product;
    private Integer quantity;
    private String startDate;
    private String endDate;
    private String status;
}