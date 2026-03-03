package com.starbag.Supplier_Material_Management_Service.dto;

import lombok.*;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDto {
    private Long id;
    private String name;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String status;


}
