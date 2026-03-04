package com.starbag.Supplier_Material_Management_Service.dto;

import lombok.*;


@Getter
@Setter
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
