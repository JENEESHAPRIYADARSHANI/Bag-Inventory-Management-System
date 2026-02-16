package com.starbag.Supplier_Material_Management_Service.service;

import com.starbag.Supplier_Material_Management_Service.dto.SupplierDto;
import java.util.List;

public interface SupplierService {
    List<SupplierDto> getAllSuppliers();
    SupplierDto getSupplierById(Long id);
    SupplierDto createSupplier(SupplierDto dto);
    SupplierDto updateSupplier(Long id, SupplierDto dto);
    void deleteSupplier(Long id);
}