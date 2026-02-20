package com.starbag.Supplier_Material_Management_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierMaterialMappingDto {
    private Long id;
    private Long supplierId;
    private Long materialId;
    private Double supplyPrice;
    private Integer leadTimeDays;
}
