package com.starbag.Supplier_Material_Management_Service.service.impl;

import com.starbag.Supplier_Material_Management_Service.domain.Material;
import com.starbag.Supplier_Material_Management_Service.dto.MaterialDto;
import com.starbag.Supplier_Material_Management_Service.exception.ResourceNotFoundException;
import com.starbag.Supplier_Material_Management_Service.repository.MaterialRepository;
import com.starbag.Supplier_Material_Management_Service.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository repository;

    @Override
    public List<MaterialDto> getAllMaterials(){
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public MaterialDto getMaterialById(Long id) {
        return repository.findById(id).map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));
    }

    @Override
    public MaterialDto createMaterial(MaterialDto dto) {
        Material material = Material.builder()
                .name(dto.getName())
                .type(dto.getType())
                .unit(dto.getUnit())
                .unitPrice(dto.getUnitPrice())
                .reorderLevel(dto.getReorderLevel())
                .status(Material.Status.valueOf((dto.getStatus().toUpperCase())))
                .build();
        return toDto(repository.save(material));
    }

    @Override
    public MaterialDto updateMaterial(Long id, MaterialDto dto) {
        Material material = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));
        material.setName(dto.getName());
        material.setType(dto.getType());
        material.setUnit(dto.getUnit());
        material.setUnitPrice(dto.getUnitPrice());
        material.setReorderLevel(dto.getReorderLevel());
        material.setStatus(Material.Status.valueOf(dto.getStatus().toUpperCase()));
        return toDto(repository.save(material));

    }

    @Override
    public void deleteMaterial(Long id){
        Material material = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));
        repository.delete(material);
    }

    private MaterialDto toDto(Material material){
        return MaterialDto.builder()
                .id(material.getId())
                .name(material.getName())
                .type(material.getType())
                .unit(material.getUnit())
                .unitPrice(material.getUnitPrice())
                .reorderLevel(material.getReorderLevel())
                .status(material.getStatus().name())
                .build();
    }
}
