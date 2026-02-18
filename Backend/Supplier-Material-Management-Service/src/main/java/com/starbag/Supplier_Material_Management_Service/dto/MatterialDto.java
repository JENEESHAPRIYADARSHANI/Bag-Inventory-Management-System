package com.starbag.Supplier_Material_Management_Service.dto;


import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatterialDto {
    private Long id;
    private String name;
    private String type;
    private String unit;
    private Double unitPrice;
    private Integer reorderLevel;
    private String status;

}
