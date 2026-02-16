package com.starbag.Supplier_Material_Management_Service.service;

import com.starbag.Supplier_Material_Management_Service.dto.SupplierDto;
import java.util.List;
public abstract class SupplierService {
    public abstract List<SupplierDto> getAllSuppliers();
    public abstract SupplierDto getSupplierById(Long id);
    public abstract SupplierDto createSupplier(SupplierDto dto);
    public abstract SupplierDto updateSupplier(Long id, SupplierDto dto);
    public abstract void deleteSupplier(Long id);
}
