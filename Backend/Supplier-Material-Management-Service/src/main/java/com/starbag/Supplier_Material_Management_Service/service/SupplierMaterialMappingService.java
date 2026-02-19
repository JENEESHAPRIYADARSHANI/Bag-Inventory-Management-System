package com.starbag.Supplier_Material_Management_Service.service;

import com.starbag.Supplier_Material_Management_Service.dto.SupplierMaterialMappingDto;
import java.util.List;
public interface SupplierMaterialMappingService {
    List<SupplierMaterialMappingDto> getAllMappings();
    SupplierMaterialMappingDto getMappingById(Long id);
    SupplierMaterialMappingDto createMapping(SupplierMaterialMappingDto dto);
    SupplierMaterialMappingDto updateMapping(Long id, SupplierMaterialMappingDto dto);
    void deleteMapping(Long id);
}
