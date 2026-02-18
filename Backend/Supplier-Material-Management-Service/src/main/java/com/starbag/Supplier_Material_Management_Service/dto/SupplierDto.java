package com.starbag.Supplier_Material_Management_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDto { private Long id;
    private String name;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String status;


}
