package com.starbag.Supplier_Material_Management_Service.service;

import com.starbag.Supplier_Material_Management_Service.dto.MaterialDto;
import java.util.List;

public interface MaterialService {
    List<MaterialDto> getAllMaterials();
    MaterialDto getMaterialById(Long id);
    MaterialDto createMaterial(MaterialDto dto);
    MaterialDto updateMaterial(Long id, MaterialDto dto);
    void deleteMaterial(Long id);
}
