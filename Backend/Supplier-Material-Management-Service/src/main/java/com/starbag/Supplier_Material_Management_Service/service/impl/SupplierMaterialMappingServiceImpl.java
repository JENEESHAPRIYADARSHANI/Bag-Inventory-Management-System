package com.starbag.Supplier_Material_Management_Service.service.impl;


import com.starbag.Supplier_Material_Management_Service.dto.SupplierMaterialMappingDto;
import com.starbag.Supplier_Material_Management_Service.exception.ResourceNotFoundException;
import com.starbag.Supplier_Material_Management_Service.repository.MaterialRepository;
import com.starbag.Supplier_Material_Management_Service.repository.SupplierMaterialMappingRepository;
import com.starbag.Supplier_Material_Management_Service.repository.SupplierRepository;
import com.starbag.Supplier_Material_Management_Service.service.SupplierMaterialMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierMaterialMappingServiceImpl implements SupplierMaterialMappingService {
    private final SupplierMaterialMappingRepository repository;
    private final SupplierRepository supplierRepository;
    private final MaterialRepository materialRepository;

    @Override
    public List<SupplierMaterialMappingDto> getAllMappings(){
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public SupplierMaterialMappingDto getMappingById(Long id){
        return repository.findById(id).map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
    }

}
