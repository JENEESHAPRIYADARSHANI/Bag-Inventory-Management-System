package com.starbag.Supplier_Material_Management_Service.service.impl;

import com.starbag.Supplier_Material_Management_Service.domain.Supplier;
import com.starbag.Supplier_Material_Management_Service.domain.Material;
import com.starbag.Supplier_Material_Management_Service.domain.SupplierMaterialMapping;
import com.starbag.Supplier_Material_Management_Service.dto.SupplierMaterialMappingDto;
import com.starbag.Supplier_Material_Management_Service.exception.ResourceNotFoundException;
import com.starbag.Supplier_Material_Management_Service.repository.MaterialRepository;
import com.starbag.Supplier_Material_Management_Service.repository.SupplierMaterialMappingRepository;
import com.starbag.Supplier_Material_Management_Service.repository.SupplierRepository;
import com.starbag.Supplier_Material_Management_Service.service.SupplierMaterialMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
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

    @Override
    public SupplierMaterialMappingDto createMapping(SupplierMaterialMappingDto dto){
        Supplier supplier = supplierRepository.findById((dto.getSupplierId()))
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        Material material = materialRepository.findById((dto.getMaterialId()))
                .orElseThrow(()-> new ResourceNotFoundException("Material not found"));
        SupplierMaterialMapping mapping = SupplierMaterialMapping.builder()
                .supplier(supplier)
                .material(material)
                .supplyPrice(dto.getSupplyPrice())
                .leadTimeDays(dto.getLeadTimeDays())
                .build();
        return toDto(repository.save(mapping));
    }

    @Override
    public SupplierMaterialMappingDto updateMapping(Long id, SupplierMaterialMappingDto dto){
        SupplierMaterialMapping mapping = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Mapping not found"));
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(()-> new ResourceNotFoundException("Supplier not found"));
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(()-> new ResourceNotFoundException("Material not found"));
        mapping.setSupplier(supplier);
        mapping.setMaterial(material);
        mapping.setSupplyPrice(dto.getSupplyPrice());
        mapping.setLeadTimeDays(dto.getLeadTimeDays());
        return toDto(repository.save(mapping));
    }

    @Override
    public void deleteMapping(Long id) {
        SupplierMaterialMapping mapping = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
        repository.delete(mapping);
    }

    private SupplierMaterialMappingDto toDto(SupplierMaterialMapping mapping) {
        return SupplierMaterialMappingDto.builder()
                .id(mapping.getId())
                .supplierId(mapping.getSupplier().getId())
                .materialId(mapping.getMaterial().getId())
                .supplyPrice(mapping.getSupplyPrice())
                .leadTimeDays(mapping.getLeadTimeDays())
                .build();
    }

}
